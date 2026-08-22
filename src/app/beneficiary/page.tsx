"use client";

import React, { useState, useCallback, useRef, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ShieldCheck,
  Lock,
  Upload,
  CheckCircle2,
  XCircle,
  Copy,
  FileText,
  QrCode,
  ChevronRight,
  Loader2,
  AlertTriangle,
  Eye,
  EyeOff,
  Hash,
  GitBranch,
  Sparkles,
  Download,
} from "lucide-react";
import {
  buildMerkleTree,
  generateProof,
  verifyProof,
  parseAddressCSV,
  generateVoucherCode,
  buildEIP712ClaimData,
  hashAddress,
  type MerkleTreeData,
  type MerkleProofResult,
} from "@/lib/merkle";

// ─── Demo Addresses (Pre-seeded for demo) ────────────────────────────────────
const DEMO_BENEFICIARIES = [
  "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
  "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
  "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
  "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
  "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
  "0x976EA74026E726554dB657fA54763abd0C3a0aa9",
  "0x14dC79964da2C08dA15Fb5315796f5ef7e8d1d0A",
  "0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f",
];

const DEMO_CRISIS_ID = "turkey-earthquake-2026";

// ─── Tabs ─────────────────────────────────────────────────────────────────────
type TabId = "claim" | "ngo" | "vouchers";

interface Tab {
  id: TabId;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const TABS: Tab[] = [
  {
    id: "claim",
    label: "Victim Claim",
    icon: <ShieldCheck className="w-3.5 h-3.5" />,
    description: "Claim aid with zero gas fees",
  },
  {
    id: "ngo",
    label: "NGO Console",
    icon: <FileText className="w-3.5 h-3.5" />,
    description: "Build & commit Merkle trees",
  },
  {
    id: "vouchers",
    label: "QR Vouchers",
    icon: <QrCode className="w-3.5 h-3.5" />,
    description: "Offline voucher generator",
  },
];

// ─── Utility ──────────────────────────────────────────────────────────────────
function truncateHash(hash: string, start = 10, end = 6): string {
  if (hash.length <= start + end + 2) return hash;
  return `${hash.slice(0, start)}...${hash.slice(-end)}`;
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function BeneficiaryPage() {
  const [activeTab, setActiveTab] = useState<TabId>("claim");

  // ── Claim State ──
  const [claimAddress, setClaimAddress] = useState(DEMO_BENEFICIARIES[0]);
  const [claimStep, setClaimStep] = useState<"input" | "verifying" | "signing" | "confirmed">("input");
  const [proofResult, setProofResult] = useState<MerkleProofResult | null>(null);
  const [showProofTree, setShowProofTree] = useState(false);
  const [claimTxHash, setClaimTxHash] = useState("");

  // ── NGO State ──
  const [ngoAddresses, setNgoAddresses] = useState<string[]>([]);
  const [ngoTree, setNgoTree] = useState<MerkleTreeData | null>(null);
  const [ngoStep, setNgoStep] = useState<"upload" | "tree" | "committed">("upload");
  const [ngoCommitTxHash, setNgoCommitTxHash] = useState("");
  const [ngoIpfsCid, setNgoIpfsCid] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Voucher State ──
  const [voucherGenerated, setVoucherGenerated] = useState(false);

  // Build the demo tree for claim verification
  const demoTree = useMemo(() => buildMerkleTree(DEMO_BENEFICIARIES), []);

  // ────────────────────────────────────────────────────────────────────────────
  // CLAIM FLOW
  // ────────────────────────────────────────────────────────────────────────────
  const handleVerifyClaim = useCallback(() => {
    setClaimStep("verifying");

    setTimeout(() => {
      const proof = generateProof(demoTree, claimAddress);
      setProofResult(proof);

      if (proof.valid) {
        // Verify independently
        const verified = verifyProof(proof.proof, demoTree.root, proof.leaf);
        if (verified) {
          setClaimStep("signing");
        } else {
          setClaimStep("input");
        }
      } else {
        setClaimStep("input");
      }
    }, 1200);
  }, [claimAddress, demoTree]);

  const handleSignAndClaim = useCallback(() => {
    setClaimStep("verifying");

    // Simulate EIP-712 signing + relayer broadcast
    setTimeout(() => {
      const fakeTxHash = "0x" + Array.from({ length: 64 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join("");
      setClaimTxHash(fakeTxHash);
      setClaimStep("confirmed");
    }, 2000);
  }, []);

  const resetClaim = useCallback(() => {
    setClaimStep("input");
    setProofResult(null);
    setClaimTxHash("");
    setShowProofTree(false);
  }, []);

  // ────────────────────────────────────────────────────────────────────────────
  // NGO FLOW
  // ────────────────────────────────────────────────────────────────────────────
  const handleCSVUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      const addresses = parseAddressCSV(text);
      if (addresses.length > 0) {
        setNgoAddresses(addresses);
        const tree = buildMerkleTree(addresses);
        setNgoTree(tree);
        setNgoStep("tree");
      }
    };
    reader.readAsText(file);
  }, []);

  const handleLoadDemoAddresses = useCallback(() => {
    setNgoAddresses(DEMO_BENEFICIARIES);
    const tree = buildMerkleTree(DEMO_BENEFICIARIES);
    setNgoTree(tree);
    setNgoStep("tree");
  }, []);

  const handleCommitRoot = useCallback(() => {
    if (!ngoTree) return;

    // Simulate IPFS upload + on-chain commit
    setTimeout(() => {
      const fakeCid = "Qm" + Array.from({ length: 44 }, () =>
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"[
          Math.floor(Math.random() * 62)
        ]
      ).join("");
      const fakeTx = "0x" + Array.from({ length: 64 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join("");
      setNgoIpfsCid(fakeCid);
      setNgoCommitTxHash(fakeTx);
      setNgoStep("committed");
    }, 1500);
  }, [ngoTree]);

  const resetNgo = useCallback(() => {
    setNgoStep("upload");
    setNgoAddresses([]);
    setNgoTree(null);
    setNgoCommitTxHash("");
    setNgoIpfsCid("");
  }, []);

  // ────────────────────────────────────────────────────────────────────────────
  // VOUCHER GENERATION
  // ────────────────────────────────────────────────────────────────────────────
  const voucherData = useMemo(() => {
    return DEMO_BENEFICIARIES.map((addr) => ({
      address: addr,
      code: generateVoucherCode(addr, DEMO_CRISIS_ID),
      leaf: hashAddress(addr),
    }));
  }, []);

  const handleGenerateVouchers = useCallback(() => {
    setVoucherGenerated(true);
  }, []);

  // ────────────────────────────────────────────────────────────────────────────
  // EIP-712 Display Data
  // ────────────────────────────────────────────────────────────────────────────
  const eip712Data = useMemo(() => {
    return buildEIP712ClaimData(
      1,
      "150000000", // 150 USDC (6 decimals)
      claimAddress,
      0,
      Math.floor(Date.now() / 1000) + 3600
    );
  }, [claimAddress]);

  // ────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ────────────────────────────────────────────────────────────────────────────
  return (
    <div className="w-full bg-canvas text-ink min-h-screen py-8 px-4 md:px-8">
      <div className="max-w-[1280px] mx-auto">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-ink-subtle hover:text-ink mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Command Center
        </Link>

        {/* Page Header */}
        <div className="flex flex-col items-start gap-2 mb-6">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-pill bg-surface-1 border border-hairline text-[10px] font-mono text-semantic-success">
            <Lock className="w-3 h-3" /> Zero-Knowledge Identity Protection Active
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-ink">
            Beneficiary Claim Portal
          </h1>
          <p className="text-xs text-ink-subtle max-w-2xl leading-relaxed">
            Victims claim aid with <strong className="text-ink">$0 gas fees</strong> via EIP-712 meta-transactions.
            Identities stay protected — only 32-byte Keccak256 Merkle roots go on-chain.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 p-1 bg-surface-1 rounded-lg border border-hairline mb-6 w-fit">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-surface-3 text-ink border border-hairline-strong"
                  : "text-ink-subtle hover:text-ink border border-transparent"
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            TAB 1: VICTIM CLAIM TERMINAL
            ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === "claim" && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left: Claim Form */}
            <div className="lg:col-span-2 space-y-4">
              <div className="p-5 rounded-lg bg-surface-1 border border-hairline">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-hairline">
                  <div className="w-6 h-6 rounded bg-canvas border border-hairline flex items-center justify-center text-semantic-success">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-ink">Gasless Aid Claim</h2>
                    <span className="text-[10px] font-mono text-ink-tertiary">EIP-712 Meta-Transaction</span>
                  </div>
                </div>

                {/* Step 1: Address Input */}
                {(claimStep === "input" || claimStep === "verifying") && (
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono text-ink-subtle uppercase tracking-wider">
                        Recipient Wallet Address
                      </label>
                      <input
                        type="text"
                        value={claimAddress}
                        onChange={(e) => setClaimAddress(e.target.value)}
                        placeholder="0x..."
                        className="w-full bg-canvas border border-hairline focus:border-primary text-ink px-3 py-2 rounded-md text-xs font-mono focus:outline-none transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono text-ink-subtle uppercase tracking-wider">
                        Crisis Registry
                      </label>
                      <div className="w-full bg-canvas border border-hairline text-ink-muted px-3 py-2 rounded-md text-xs font-mono">
                        Turkey-Syria Earthquake 2026 (ID: 1)
                      </div>
                    </div>

                    <div className="p-3 rounded bg-canvas border border-hairline text-[11px] font-mono space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-ink-tertiary">Allocation:</span>
                        <span className="text-ink font-medium">150.00 USDC</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-ink-tertiary">Gas Cost to Victim:</span>
                        <span className="text-semantic-success font-medium">$0.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-ink-tertiary">Gas Sponsor:</span>
                        <span className="text-primary font-medium">Pulse Relayer</span>
                      </div>
                    </div>

                    <button
                      onClick={handleVerifyClaim}
                      disabled={claimStep === "verifying" || !claimAddress}
                      className="w-full py-2 px-4 rounded-md bg-primary hover:bg-primary-hover text-white text-xs font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {claimStep === "verifying" ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Verifying Merkle Proof...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Verify Eligibility</span>
                        </>
                      )}
                    </button>

                    {/* Failed verification */}
                    {proofResult && !proofResult.valid && claimStep === "input" && (
                      <div className="p-3 rounded bg-surface-2 border border-red-500/20 text-xs flex items-start gap-2">
                        <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        <div>
                          <div className="text-red-400 font-medium mb-0.5">Address Not Found in Registry</div>
                          <div className="text-ink-tertiary font-mono text-[10px]">
                            This address is not in the Merkle tree for the selected crisis.
                            Contact your local relief coordinator.
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 2: EIP-712 Signing */}
                {claimStep === "signing" && proofResult && (
                  <div className="space-y-3">
                    <div className="p-3 rounded bg-canvas border border-semantic-success/20 text-xs flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-semantic-success shrink-0 mt-0.5" />
                      <div>
                        <div className="text-semantic-success font-medium mb-0.5">Merkle Proof Verified</div>
                        <div className="text-ink-tertiary font-mono text-[10px]">
                          Proof path length: {proofResult.proof.length} nodes · Leaf index: {proofResult.index}
                        </div>
                      </div>
                    </div>

                    {/* EIP-712 Typed Data Preview */}
                    <div className="space-y-1.5">
                      <div className="text-[11px] font-mono text-ink-subtle uppercase tracking-wider">
                        EIP-712 Typed Data Signature
                      </div>
                      <div className="p-3 rounded bg-canvas border border-hairline text-[10px] font-mono text-ink-subtle space-y-1 overflow-x-auto">
                        <div className="text-ink-tertiary">// Domain</div>
                        <div>name: <span className="text-primary">&quot;{eip712Data.domain.name}&quot;</span></div>
                        <div>chainId: <span className="text-ink">{eip712Data.domain.chainId}</span> <span className="text-ink-tertiary">(Polygon Amoy)</span></div>
                        <div>contract: <span className="text-ink">{truncateHash(eip712Data.domain.verifyingContract, 8, 6)}</span></div>
                        <div className="text-ink-tertiary mt-2">// ClaimAid</div>
                        <div>crisisId: <span className="text-ink">{eip712Data.value.crisisId}</span></div>
                        <div>amount: <span className="text-semantic-success">{eip712Data.value.amount}</span> <span className="text-ink-tertiary">(150 USDC)</span></div>
                        <div>recipient: <span className="text-ink">{truncateHash(eip712Data.value.recipient, 8, 6)}</span></div>
                        <div>nonce: <span className="text-ink">{eip712Data.value.nonce}</span></div>
                        <div>deadline: <span className="text-ink">{eip712Data.value.deadline}</span></div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={resetClaim}
                        className="px-3 py-2 rounded-md bg-surface-2 hover:bg-surface-3 text-ink-subtle text-xs font-mono border border-hairline transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSignAndClaim}
                        className="flex-1 py-2 px-4 rounded-md bg-primary hover:bg-primary-hover text-white text-xs font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        Sign & Claim (0 Gas)
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Confirmed */}
                {claimStep === "confirmed" && (
                  <div className="space-y-3">
                    <div className="p-4 rounded bg-canvas border border-semantic-success/20 text-center space-y-2">
                      <CheckCircle2 className="w-8 h-8 text-semantic-success mx-auto" />
                      <div className="text-sm font-semibold text-ink">Aid Claimed Successfully</div>
                      <div className="text-[11px] text-ink-subtle">
                        150.00 USDC transferred to your wallet. Gas fee: $0.00
                      </div>
                    </div>

                    <div className="space-y-2 text-[11px] font-mono">
                      <div className="p-2.5 rounded bg-surface-2 border border-hairline flex items-center justify-between">
                        <span className="text-ink-tertiary">Tx Hash:</span>
                        <span className="text-primary flex items-center gap-1">
                          {truncateHash(claimTxHash)}
                          <button onClick={() => copyToClipboard(claimTxHash)}>
                            <Copy className="w-3 h-3 text-ink-tertiary hover:text-ink" />
                          </button>
                        </span>
                      </div>
                      <div className="p-2.5 rounded bg-surface-2 border border-hairline flex items-center justify-between">
                        <span className="text-ink-tertiary">Network:</span>
                        <span className="text-ink">Polygon Amoy (Testnet)</span>
                      </div>
                      <div className="p-2.5 rounded bg-surface-2 border border-hairline flex items-center justify-between">
                        <span className="text-ink-tertiary">Gas Paid By:</span>
                        <span className="text-primary">Pulse Protocol Relayer</span>
                      </div>
                      <div className="p-2.5 rounded bg-surface-2 border border-hairline flex items-center justify-between">
                        <span className="text-ink-tertiary">IPFS Receipt:</span>
                        <span className="text-ink">QmX8a...92b1</span>
                      </div>
                    </div>

                    <button
                      onClick={resetClaim}
                      className="w-full py-2 px-4 rounded-md bg-surface-2 hover:bg-surface-3 text-ink text-xs font-mono border border-hairline transition-colors"
                    >
                      New Claim
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Merkle Proof Inspector */}
            <div className="lg:col-span-3 space-y-4">
              {/* Tree Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "REGISTERED", value: demoTree.addressCount.toString(), sub: "beneficiaries" },
                  { label: "TREE DEPTH", value: (demoTree.layers.length - 1).toString(), sub: "levels" },
                  { label: "ROOT", value: truncateHash(demoTree.root, 6, 4), sub: "on-chain" },
                  { label: "ALGORITHM", value: "Keccak256", sub: "sorted pairs" },
                ].map((stat) => (
                  <div key={stat.label} className="p-3 rounded bg-surface-1 border border-hairline">
                    <div className="text-[10px] font-mono text-ink-tertiary uppercase tracking-wider">{stat.label}</div>
                    <div className="text-sm font-semibold text-ink mt-0.5 font-mono">{stat.value}</div>
                    <div className="text-[10px] text-ink-tertiary">{stat.sub}</div>
                  </div>
                ))}
              </div>

              {/* Merkle Proof Visualization */}
              <div className="p-5 rounded-lg bg-surface-1 border border-hairline">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-hairline">
                  <div className="flex items-center gap-2">
                    <GitBranch className="w-3.5 h-3.5 text-primary" />
                    <h3 className="text-sm font-semibold text-ink">Merkle Proof Inspector</h3>
                  </div>
                  <button
                    onClick={() => setShowProofTree(!showProofTree)}
                    className="flex items-center gap-1 px-2 py-1 rounded bg-surface-2 border border-hairline text-[10px] font-mono text-ink-subtle hover:text-ink transition-colors"
                  >
                    {showProofTree ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    {showProofTree ? "Hide Layers" : "Show Layers"}
                  </button>
                </div>

                {proofResult ? (
                  <div className="space-y-3">
                    {/* Leaf */}
                    <div className="p-3 rounded bg-canvas border border-hairline">
                      <div className="text-[10px] font-mono text-ink-tertiary uppercase tracking-wider mb-1">
                        Leaf = keccak256(abi.encodePacked(address))
                      </div>
                      <div className="text-xs font-mono text-ink break-all">{proofResult.leaf}</div>
                      <div className="text-[10px] font-mono text-ink-tertiary mt-1">
                        Index: {proofResult.index} · Status: {proofResult.valid ? (
                          <span className="text-semantic-success">✓ VALID</span>
                        ) : (
                          <span className="text-red-400">✗ NOT FOUND</span>
                        )}
                      </div>
                    </div>

                    {/* Proof Path */}
                    {proofResult.valid && proofResult.proof.length > 0 && (
                      <div className="space-y-1.5">
                        <div className="text-[10px] font-mono text-ink-tertiary uppercase tracking-wider">
                          Proof Path ({proofResult.proof.length} siblings)
                        </div>
                        {proofResult.proof.map((hash, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 p-2 rounded bg-canvas border border-hairline text-xs font-mono"
                          >
                            <span className="text-ink-tertiary w-10 shrink-0 text-[10px]">
                              [{i}]
                            </span>
                            <span className="text-ink break-all">{hash}</span>
                            <button
                              onClick={() => copyToClipboard(hash)}
                              className="shrink-0"
                            >
                              <Copy className="w-3 h-3 text-ink-tertiary hover:text-ink" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Root */}
                    <div className="p-3 rounded bg-canvas border border-primary/20">
                      <div className="text-[10px] font-mono text-ink-tertiary uppercase tracking-wider mb-1">
                        Merkle Root (committed on-chain)
                      </div>
                      <div className="text-xs font-mono text-primary break-all flex items-center gap-2">
                        <span>{proofResult.root}</span>
                        <button onClick={() => copyToClipboard(proofResult.root)}>
                          <Copy className="w-3 h-3 text-ink-tertiary hover:text-primary shrink-0" />
                        </button>
                      </div>
                    </div>

                    {/* Verification */}
                    {proofResult.valid && (
                      <div className="p-3 rounded bg-canvas border border-semantic-success/20 text-xs font-mono flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-semantic-success shrink-0" />
                        <span className="text-semantic-success">
                          MerkleProof.verify(proof, root, leaf) → <strong>true</strong>
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-xs text-ink-tertiary font-mono">
                    <Hash className="w-6 h-6 mx-auto mb-2 text-ink-tertiary/50" />
                    Enter an address and verify to see the proof path
                  </div>
                )}

                {/* Full Tree Layers */}
                {showProofTree && (
                  <div className="mt-4 pt-4 border-t border-hairline space-y-3">
                    <div className="text-[10px] font-mono text-ink-tertiary uppercase tracking-wider">
                      Full Tree Layers (bottom → root)
                    </div>
                    {demoTree.layers.map((layer, layerIdx) => (
                      <div key={layerIdx} className="space-y-1">
                        <div className="text-[10px] font-mono text-ink-subtle">
                          Layer {layerIdx} ({layer.length} node{layer.length !== 1 ? "s" : ""})
                          {layerIdx === 0 && " — leaves"}
                          {layerIdx === demoTree.layers.length - 1 && " — root"}
                        </div>
                        {layer.map((hash, i) => (
                          <div
                            key={i}
                            className={`text-[10px] font-mono px-2 py-1 rounded border ${
                              layerIdx === demoTree.layers.length - 1
                                ? "border-primary/30 bg-primary/5 text-primary"
                                : "border-hairline bg-canvas text-ink-subtle"
                            } break-all`}
                          >
                            {hash}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            TAB 2: NGO MERKLE TREE CONSOLE
            ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === "ngo" && (
          <div className="max-w-3xl space-y-4">
            <div className="p-5 rounded-lg bg-surface-1 border border-hairline">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-hairline">
                <div className="w-6 h-6 rounded bg-canvas border border-hairline flex items-center justify-center text-primary">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-ink">NGO Beneficiary Registry</h2>
                  <span className="text-[10px] font-mono text-ink-tertiary">
                    Upload → Build Tree → Commit Root On-Chain
                  </span>
                </div>
              </div>

              {/* Step 1: Upload */}
              {ngoStep === "upload" && (
                <div className="space-y-4">
                  <p className="text-xs text-ink-subtle leading-relaxed">
                    Upload a CSV of verified victim wallet addresses. The system computes Keccak256 hashes
                    for each address, builds a Merkle tree with sorted pairs, and extracts the 32-byte root
                    for on-chain commitment. No personal data touches the blockchain.
                  </p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.txt"
                    onChange={handleCSVUpload}
                    className="hidden"
                  />

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border border-dashed border-hairline hover:border-hairline-strong rounded-md p-6 text-center bg-canvas cursor-pointer transition-colors group"
                  >
                    <Upload className="w-5 h-5 mx-auto text-ink-tertiary group-hover:text-primary mb-1.5 transition-colors" />
                    <span className="text-ink font-medium text-xs block">
                      Upload Beneficiary Addresses (.csv)
                    </span>
                    <span className="text-[10px] text-ink-tertiary mt-0.5 block">
                      One address per line or comma-separated · Accepts 0x-prefixed hex
                    </span>
                  </button>

                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-hairline" />
                    <span className="text-[10px] font-mono text-ink-tertiary">OR</span>
                    <div className="h-px flex-1 bg-hairline" />
                  </div>

                  <button
                    onClick={handleLoadDemoAddresses}
                    className="w-full py-2 px-4 rounded-md bg-surface-2 hover:bg-surface-3 text-ink text-xs font-mono border border-hairline transition-colors"
                  >
                    Load Demo Addresses ({DEMO_BENEFICIARIES.length} beneficiaries)
                  </button>
                </div>
              )}

              {/* Step 2: Tree Built */}
              {ngoStep === "tree" && ngoTree && (
                <div className="space-y-4">
                  <div className="p-3 rounded bg-canvas border border-semantic-success/20 text-xs flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-semantic-success shrink-0 mt-0.5" />
                    <div>
                      <div className="text-semantic-success font-medium">
                        Merkle Tree Built Successfully
                      </div>
                      <div className="text-ink-tertiary font-mono text-[10px]">
                        {ngoTree.addressCount} addresses hashed · {ngoTree.layers.length - 1} tree levels · Sorted pair hashing
                      </div>
                    </div>
                  </div>

                  {/* Addresses */}
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-mono text-ink-tertiary uppercase tracking-wider">
                      Hashed Leaves ({ngoAddresses.length})
                    </div>
                    <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
                      {ngoAddresses.map((addr, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 p-2 rounded bg-canvas border border-hairline text-[10px] font-mono"
                        >
                          <span className="text-ink-tertiary w-6 shrink-0">{i + 1}.</span>
                          <span className="text-ink-subtle">{truncateHash(addr, 8, 6)}</span>
                          <ChevronRight className="w-3 h-3 text-ink-tertiary shrink-0" />
                          <span className="text-ink break-all">{truncateHash(hashAddress(addr), 10, 8)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Root */}
                  <div className="p-3 rounded bg-canvas border border-primary/20">
                    <div className="text-[10px] font-mono text-ink-tertiary uppercase tracking-wider mb-1">
                      Computed Merkle Root
                    </div>
                    <div className="text-xs font-mono text-primary break-all flex items-center gap-2">
                      <span>{ngoTree.root}</span>
                      <button onClick={() => copyToClipboard(ngoTree.root)}>
                        <Copy className="w-3 h-3 text-ink-tertiary hover:text-primary shrink-0" />
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={resetNgo}
                      className="px-3 py-2 rounded-md bg-surface-2 hover:bg-surface-3 text-ink-subtle text-xs font-mono border border-hairline transition-colors"
                    >
                      Reset
                    </button>
                    <button
                      onClick={handleCommitRoot}
                      className="flex-1 py-2 px-4 rounded-md bg-primary hover:bg-primary-hover text-white text-xs font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Pin to IPFS & Commit Root On-Chain
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Committed */}
              {ngoStep === "committed" && ngoTree && (
                <div className="space-y-4">
                  <div className="p-4 rounded bg-canvas border border-semantic-success/20 text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-semantic-success mx-auto" />
                    <div className="text-sm font-semibold text-ink">Root Committed On-Chain</div>
                    <div className="text-[11px] text-ink-subtle">
                      {ngoTree.addressCount} beneficiaries registered. Registry pinned to IPFS/Filecoin.
                    </div>
                  </div>

                  <div className="space-y-2 text-[11px] font-mono">
                    <div className="p-2.5 rounded bg-surface-2 border border-hairline">
                      <div className="text-ink-tertiary mb-0.5">Merkle Root:</div>
                      <div className="text-primary break-all">{ngoTree.root}</div>
                    </div>
                    <div className="p-2.5 rounded bg-surface-2 border border-hairline flex items-center justify-between">
                      <span className="text-ink-tertiary">Commit Tx:</span>
                      <span className="text-ink">{truncateHash(ngoCommitTxHash)}</span>
                    </div>
                    <div className="p-2.5 rounded bg-surface-2 border border-hairline">
                      <div className="text-ink-tertiary mb-0.5">IPFS / Filecoin CID:</div>
                      <div className="text-ink break-all">{ngoIpfsCid}</div>
                    </div>
                    <div className="p-2.5 rounded bg-surface-2 border border-hairline flex items-center justify-between">
                      <span className="text-ink-tertiary">Contract:</span>
                      <span className="text-ink">BeneficiaryRegistry (Polygon Amoy)</span>
                    </div>
                    <div className="p-2.5 rounded bg-surface-2 border border-hairline flex items-center justify-between">
                      <span className="text-ink-tertiary">Storage:</span>
                      <span className="text-ink">Filecoin (via IPFS pinning)</span>
                    </div>
                  </div>

                  <button
                    onClick={resetNgo}
                    className="w-full py-2 px-4 rounded-md bg-surface-2 hover:bg-surface-3 text-ink text-xs font-mono border border-hairline transition-colors"
                  >
                    Register Another Crisis
                  </button>
                </div>
              )}
            </div>

            {/* How It Works */}
            <div className="p-5 rounded-lg bg-surface-1 border border-hairline">
              <h3 className="text-xs font-semibold text-ink mb-3">How the Zero-Knowledge Flow Works</h3>
              <div className="space-y-2">
                {[
                  { step: "1", title: "Field Verification", desc: "NGO workers physically verify victims and collect wallet addresses." },
                  { step: "2", title: "Merkle Tree Construction", desc: "Each address is hashed via keccak256(abi.encodePacked(addr)). Leaves are sorted and paired bottom-up." },
                  { step: "3", title: "Root Commitment", desc: "Only the 32-byte Merkle root is committed on-chain. The full address list is pinned to IPFS/Filecoin." },
                  { step: "4", title: "Gasless Claim", desc: "Victim signs EIP-712 typed data off-chain. Pulse Relayer broadcasts the transaction — victim pays $0 gas." },
                  { step: "5", title: "On-Chain Verification", desc: "Contract calls MerkleProof.verify(proof, root, leaf). If valid, aid is transferred directly to victim." },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded bg-canvas border border-hairline flex items-center justify-center text-[10px] font-mono text-primary shrink-0 mt-0.5">
                      {item.step}
                    </span>
                    <div>
                      <div className="text-xs font-medium text-ink">{item.title}</div>
                      <div className="text-[10px] text-ink-tertiary leading-relaxed">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            TAB 3: OFFLINE QR VOUCHERS
            ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === "vouchers" && (
          <div className="max-w-3xl space-y-4">
            <div className="p-5 rounded-lg bg-surface-1 border border-hairline">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-hairline">
                <div className="w-6 h-6 rounded bg-canvas border border-hairline flex items-center justify-center text-primary">
                  <QrCode className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-ink">Offline QR Voucher Generator</h2>
                  <span className="text-[10px] font-mono text-ink-tertiary">
                    For disaster zones with degraded connectivity
                  </span>
                </div>
              </div>

              <p className="text-xs text-ink-subtle leading-relaxed mb-4">
                Generate printable voucher cards with embedded Merkle proofs encoded as QR codes.
                Field workers distribute these in areas with no internet access. When connectivity
                is restored, victims scan the QR code to trigger their gasless on-chain claim.
              </p>

              {!voucherGenerated ? (
                <div className="space-y-3">
                  <div className="p-3 rounded bg-canvas border border-hairline text-[11px] font-mono space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-ink-tertiary">Crisis:</span>
                      <span className="text-ink">Turkey-Syria Earthquake 2026</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ink-tertiary">Registered Beneficiaries:</span>
                      <span className="text-ink">{DEMO_BENEFICIARIES.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ink-tertiary">Voucher Format:</span>
                      <span className="text-ink">Printable Card (A6)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ink-tertiary">QR Payload:</span>
                      <span className="text-ink">Merkle Proof + Voucher Code</span>
                    </div>
                  </div>

                  <button
                    onClick={handleGenerateVouchers}
                    className="w-full py-2 px-4 rounded-md bg-primary hover:bg-primary-hover text-white text-xs font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    Generate {DEMO_BENEFICIARIES.length} Vouchers
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 rounded bg-canvas border border-semantic-success/20 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-semantic-success shrink-0" />
                    <span className="text-semantic-success font-medium">
                      {voucherData.length} vouchers generated
                    </span>
                  </div>

                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {voucherData.map((v, i) => (
                      <div
                        key={i}
                        className="p-3 rounded bg-canvas border border-hairline flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* QR Placeholder */}
                          <div className="w-10 h-10 rounded bg-surface-2 border border-hairline flex items-center justify-center shrink-0">
                            <QrCode className="w-5 h-5 text-ink-tertiary" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-mono font-semibold text-primary">{v.code}</div>
                            <div className="text-[10px] font-mono text-ink-tertiary truncate">
                              {truncateHash(v.address, 8, 6)}
                            </div>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-xs font-mono text-ink font-medium">150 USDC</div>
                          <div className="text-[10px] text-ink-tertiary">Gasless</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      // Generate a downloadable JSON with all voucher data
                      const exportData = voucherData.map((v) => {
                        const proof = generateProof(demoTree, v.address);
                        return {
                          voucherCode: v.code,
                          address: v.address,
                          leaf: v.leaf,
                          proof: proof.proof,
                          root: demoTree.root,
                          crisisId: DEMO_CRISIS_ID,
                          allocation: "150 USDC",
                        };
                      });
                      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `pulse-vouchers-${DEMO_CRISIS_ID}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="w-full py-2 px-4 rounded-md bg-surface-2 hover:bg-surface-3 text-ink text-xs font-mono border border-hairline transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export Voucher Data (JSON with Proofs)
                  </button>
                </div>
              )}
            </div>

            {/* Warning */}
            <div className="p-4 rounded-lg bg-surface-1 border border-hairline flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-medium text-ink mb-0.5">Offline Security Notice</div>
                <div className="text-[10px] text-ink-subtle leading-relaxed">
                  QR vouchers contain cryptographic Merkle proofs. Each voucher can only be claimed once —
                  the smart contract marks the leaf as consumed after the first successful claim.
                  Double-claim attempts are rejected on-chain.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
