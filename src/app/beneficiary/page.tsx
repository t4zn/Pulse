"use client";

import React, { useState, useCallback, useRef, useMemo, useEffect } from "react";
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
  Wallet,
  Check,
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
import { useWallet } from "@/context/WalletContext";

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

type TabId = "claim" | "ngo" | "vouchers";

interface Tab {
  id: TabId;
  label: string;
  icon: React.ReactNode;
}

const TABS: Tab[] = [
  {
    id: "claim",
    label: "Victim Aid Claim",
    icon: <ShieldCheck className="w-4 h-4" />,
  },
  {
    id: "ngo",
    label: "NGO Registry Console",
    icon: <FileText className="w-4 h-4" />,
  },
  {
    id: "vouchers",
    label: "Offline QR Vouchers",
    icon: <QrCode className="w-4 h-4" />,
  },
];

function truncateHash(hash: string, start = 10, end = 6): string {
  if (hash.length <= start + end + 2) return hash;
  return `${hash.slice(0, start)}...${hash.slice(-end)}`;
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}

export default function BeneficiaryPage() {
  const { address: connectedAddress, isConnected, connectWallet, signClaimMessage } = useWallet();

  const [activeTab, setActiveTab] = useState<TabId>("claim");

  // Claim State
  const [claimAddress, setClaimAddress] = useState(DEMO_BENEFICIARIES[0]);
  const [claimStep, setClaimStep] = useState<"input" | "verifying" | "signing" | "confirmed">("input");
  const [proofResult, setProofResult] = useState<MerkleProofResult | null>(null);
  const [showProofTree, setShowProofTree] = useState(false);
  const [claimTxHash, setClaimTxHash] = useState("");
  const [realSignature, setRealSignature] = useState<string | null>(null);
  const [claimError, setClaimError] = useState<string | null>(null);

  // NGO State
  const [ngoAddresses, setNgoAddresses] = useState<string[]>([]);
  const [ngoTree, setNgoTree] = useState<MerkleTreeData | null>(null);
  const [ngoStep, setNgoStep] = useState<"upload" | "tree" | "committed">("upload");
  const [ngoCommitTxHash, setNgoCommitTxHash] = useState("");
  const [ngoIpfsCid, setNgoIpfsCid] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Voucher State
  const [voucherGenerated, setVoucherGenerated] = useState(false);

  // Dynamically include connected address in demo tree if available
  const activeTreeAddresses = useMemo(() => {
    if (connectedAddress && !DEMO_BENEFICIARIES.includes(connectedAddress)) {
      return [connectedAddress, ...DEMO_BENEFICIARIES];
    }
    return DEMO_BENEFICIARIES;
  }, [connectedAddress]);

  const demoTree = useMemo(() => buildMerkleTree(activeTreeAddresses), [activeTreeAddresses]);

  // Autofill if user clicks "use connected wallet"
  const handleUseConnectedWallet = () => {
    if (connectedAddress) {
      setClaimAddress(connectedAddress);
    }
  };

  const handleVerifyClaim = useCallback(() => {
    setClaimStep("verifying");
    setClaimError(null);

    setTimeout(() => {
      const proof = generateProof(demoTree, claimAddress);
      setProofResult(proof);

      if (proof.valid) {
        const verified = verifyProof(proof.proof, demoTree.root, proof.leaf);
        if (verified) {
          setClaimStep("signing");
        } else {
          setClaimStep("input");
        }
      } else {
        setClaimStep("input");
      }
    }, 1000);
  }, [claimAddress, demoTree]);

  const handleSignAndClaim = useCallback(async () => {
    setClaimStep("verifying");
    setClaimError(null);

    try {
      const eip712 = buildEIP712ClaimData(
        1,
        "150000000",
        claimAddress,
        0,
        Math.floor(Date.now() / 1000) + 3600
      );

      // If MetaMask is connected, request a real EIP-712 signature!
      if (isConnected) {
        const res = await signClaimMessage(eip712);
        if (res.success && res.signature) {
          setRealSignature(res.signature);
        }
      }

      // Simulate relayer submission and confirmed block receipt
      setTimeout(() => {
        const fakeTxHash = "0x" + Array.from({ length: 64 }, () =>
          Math.floor(Math.random() * 16).toString(16)
        ).join("");
        setClaimTxHash(fakeTxHash);
        setClaimStep("confirmed");
      }, 1200);
    } catch (err: any) {
      setClaimError(err?.message || "Signing was cancelled or failed");
      setClaimStep("signing");
    }
  }, [claimAddress, isConnected, signClaimMessage]);

  const resetClaim = useCallback(() => {
    setClaimStep("input");
    setProofResult(null);
    setClaimTxHash("");
    setRealSignature(null);
    setShowProofTree(false);
  }, []);

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
    setNgoAddresses(activeTreeAddresses);
    const tree = buildMerkleTree(activeTreeAddresses);
    setNgoTree(tree);
    setNgoStep("tree");
  }, [activeTreeAddresses]);

  const handleCommitRoot = useCallback(() => {
    if (!ngoTree) return;

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
    }, 1200);
  }, [ngoTree]);

  const resetNgo = useCallback(() => {
    setNgoStep("upload");
    setNgoAddresses([]);
    setNgoTree(null);
    setNgoCommitTxHash("");
    setNgoIpfsCid("");
  }, []);

  const voucherData = useMemo(() => {
    return activeTreeAddresses.map((addr) => ({
      address: addr,
      code: generateVoucherCode(addr, DEMO_CRISIS_ID),
      leaf: hashAddress(addr),
    }));
  }, [activeTreeAddresses]);

  const eip712Data = useMemo(() => {
    return buildEIP712ClaimData(
      1,
      "150000000",
      claimAddress,
      0,
      Math.floor(Date.now() / 1000) + 3600
    );
  }, [claimAddress]);

  return (
    <div className="w-full bg-white text-ink min-h-screen py-8 px-4 md:px-8">
      <div className="max-w-[1280px] mx-auto">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-body hover:text-ink mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Command Center
        </Link>

        {/* Page Header */}
        <div className="flex flex-col items-start gap-2 mb-8">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-soft border border-hairline text-xs font-mono text-semantic-up">
            <Lock className="w-3.5 h-3.5" /> Zero-Knowledge Identity Protection Active
          </div>
          <h1 className="text-2xl md:text-4xl font-normal tracking-tight text-ink">
            Beneficiary Claim Portal
          </h1>
          <p className="text-sm text-body max-w-2xl leading-relaxed">
            Victims claim aid with <strong className="text-ink">$0 gas fees</strong> via EIP-712 meta-transactions.
            Only 32-byte Keccak256 Merkle roots are committed on-chain.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 p-1 bg-surface-soft rounded-full border border-hairline mb-8 w-fit">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold transition-colors ${
                activeTab === tab.id
                  ? "bg-white text-ink shadow-sm"
                  : "text-body hover:text-ink"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: VICTIM CLAIM TERMINAL */}
        {activeTab === "claim" && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left: Claim Form */}
            <div className="lg:col-span-2 space-y-4">
              <div className="p-6 rounded-2xl bg-white border border-hairline shadow-card">
                <div className="flex items-center justify-between mb-5 pb-4 border-b border-hairline">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 text-semantic-up flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-ink">Gasless Aid Claim</h2>
                      <span className="text-xs text-body">EIP-712 Meta-Transaction</span>
                    </div>
                  </div>
                </div>

                {/* Autofill with Connected MetaMask Button */}
                {isConnected && connectedAddress && claimAddress !== connectedAddress && (
                  <button
                    onClick={handleUseConnectedWallet}
                    className="w-full mb-4 p-2.5 rounded-xl bg-blue-50/60 hover:bg-blue-50 border border-blue-200 text-primary text-xs font-semibold flex items-center justify-center gap-2 transition-colors font-mono"
                  >
                    <Wallet className="w-3.5 h-3.5" />
                    <span>Autofill with My MetaMask Address</span>
                  </button>
                )}

                {/* Step 1: Address Input */}
                {(claimStep === "input" || claimStep === "verifying") && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-body uppercase tracking-wider">
                        Recipient Wallet Address
                      </label>
                      <input
                        type="text"
                        value={claimAddress}
                        onChange={(e) => setClaimAddress(e.target.value)}
                        placeholder="0x..."
                        className="w-full bg-white border border-hairline focus:border-primary text-ink px-4 py-2.5 rounded-xl text-xs font-mono focus:outline-none transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-body uppercase tracking-wider">
                        Crisis Registry
                      </label>
                      <div className="w-full bg-surface-soft border border-hairline text-ink px-4 py-2.5 rounded-xl text-xs font-mono">
                        Turkey-Syria Earthquake 2026 (ID: 1)
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-surface-soft border border-hairline text-xs font-mono space-y-2">
                      <div className="flex justify-between">
                        <span className="text-body">Allocation:</span>
                        <span className="text-ink font-semibold">150.00 USDC</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-body">Gas Cost to Victim:</span>
                        <span className="text-semantic-up font-semibold">$0.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-body">Gas Sponsor:</span>
                        <span className="text-primary font-semibold">Pulse Relayer</span>
                      </div>
                    </div>

                    <button
                      onClick={handleVerifyClaim}
                      disabled={claimStep === "verifying" || !claimAddress}
                      className="w-full py-3 px-4 rounded-full bg-primary hover:bg-primary-hover active:bg-primary-active text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
                    >
                      {claimStep === "verifying" ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Verifying Merkle Proof...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          <span>Verify Eligibility</span>
                        </>
                      )}
                    </button>

                    {proofResult && !proofResult.valid && claimStep === "input" && (
                      <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs flex items-start gap-2.5">
                        <XCircle className="w-4 h-4 text-semantic-down shrink-0 mt-0.5" />
                        <div>
                          <div className="text-semantic-down font-semibold mb-0.5">Address Not Found in Registry</div>
                          <div className="text-body text-xs">
                            This address is not in the Merkle tree for this crisis.
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 2: EIP-712 Signing */}
                {claimStep === "signing" && proofResult && (
                  <div className="space-y-4">
                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-semantic-up shrink-0 mt-0.5" />
                      <div>
                        <div className="text-semantic-up font-semibold mb-0.5">Merkle Proof Verified</div>
                        <div className="text-body font-mono text-xs">
                          Proof path length: {proofResult.proof.length} nodes · Leaf index: {proofResult.index}
                        </div>
                      </div>
                    </div>

                    {/* EIP-712 Typed Data Preview */}
                    <div className="space-y-1.5">
                      <div className="text-xs font-semibold text-body uppercase tracking-wider">
                        EIP-712 Typed Data Signature
                      </div>
                      <div className="p-3.5 rounded-xl bg-surface-soft border border-hairline text-xs font-mono text-body space-y-1 overflow-x-auto">
                        <div className="text-muted">// Domain</div>
                        <div>name: <span className="text-primary">&quot;{eip712Data.domain.name}&quot;</span></div>
                        <div>chainId: <span className="text-ink">{eip712Data.domain.chainId}</span> <span className="text-muted">(Polygon Amoy)</span></div>
                        <div className="text-muted mt-2">// ClaimAid</div>
                        <div>crisisId: <span className="text-ink">{eip712Data.value.crisisId}</span></div>
                        <div>amount: <span className="text-semantic-up">{eip712Data.value.amount}</span> <span className="text-muted">(150 USDC)</span></div>
                        <div>recipient: <span className="text-ink">{truncateHash(eip712Data.value.recipient, 8, 6)}</span></div>
                      </div>
                    </div>

                    {claimError && (
                      <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-semantic-down text-xs font-mono">
                        {claimError}
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={resetClaim}
                        className="px-4 py-2.5 rounded-full bg-surface-soft hover:bg-surface-strong text-body text-xs font-semibold transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSignAndClaim}
                        className="flex-1 py-2.5 px-4 rounded-full bg-primary hover:bg-primary-hover active:bg-primary-active text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{isConnected ? "Sign with MetaMask & Claim" : "Sign & Claim (0 Gas)"}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Confirmed */}
                {claimStep === "confirmed" && (
                  <div className="space-y-4">
                    <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                      <CheckCircle2 className="w-10 h-10 text-semantic-up mx-auto" />
                      <div className="text-base font-semibold text-ink">Aid Claimed Successfully</div>
                      <div className="text-xs text-body">
                        150.00 USDC transferred to your wallet. Gas fee: $0.00
                      </div>
                    </div>

                    <div className="space-y-2 text-xs font-mono">
                      <div className="p-3 rounded-xl bg-surface-soft border border-hairline flex items-center justify-between">
                        <span className="text-body">Tx Hash:</span>
                        <span className="text-primary font-semibold flex items-center gap-1">
                          {truncateHash(claimTxHash)}
                          <button onClick={() => copyToClipboard(claimTxHash)}>
                            <Copy className="w-3 h-3 text-muted hover:text-ink" />
                          </button>
                        </span>
                      </div>
                      {realSignature && (
                        <div className="p-3 rounded-xl bg-surface-soft border border-hairline">
                          <div className="text-muted text-[10px]">EIP-712 SIGNATURE:</div>
                          <div className="text-ink text-[10px] break-all">{truncateHash(realSignature, 12, 12)}</div>
                        </div>
                      )}
                      <div className="p-3 rounded-xl bg-surface-soft border border-hairline flex items-center justify-between">
                        <span className="text-body">Network:</span>
                        <span className="text-ink">Polygon Amoy</span>
                      </div>
                      <div className="p-3 rounded-xl bg-surface-soft border border-hairline flex items-center justify-between">
                        <span className="text-body">Gas Paid By:</span>
                        <span className="text-primary font-semibold">Pulse Protocol Relayer</span>
                      </div>
                    </div>

                    <button
                      onClick={resetClaim}
                      className="w-full py-2.5 px-4 rounded-full bg-surface-soft hover:bg-surface-strong text-ink text-xs font-semibold transition-colors"
                    >
                      New Claim
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Merkle Proof Inspector */}
            <div className="lg:col-span-3 space-y-6">
              {/* Tree Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "REGISTERED", value: demoTree.addressCount.toString(), sub: "beneficiaries" },
                  { label: "TREE DEPTH", value: (demoTree.layers.length - 1).toString(), sub: "levels" },
                  { label: "ROOT", value: truncateHash(demoTree.root, 6, 4), sub: "on-chain" },
                  { label: "ALGORITHM", value: "Keccak256", sub: "sorted pairs" },
                ].map((stat) => (
                  <div key={stat.label} className="p-4 rounded-2xl bg-white border border-hairline shadow-sm">
                    <div className="text-[10px] font-semibold text-muted uppercase tracking-wider">{stat.label}</div>
                    <div className="text-base font-semibold text-ink mt-0.5 font-mono">{stat.value}</div>
                    <div className="text-xs text-muted">{stat.sub}</div>
                  </div>
                ))}
              </div>

              {/* Merkle Proof Visualization */}
              <div className="p-6 rounded-2xl bg-white border border-hairline shadow-card">
                <div className="flex items-center justify-between mb-5 pb-4 border-b border-hairline">
                  <div className="flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-semibold text-ink">Merkle Proof Inspector</h3>
                  </div>
                  <button
                    onClick={() => setShowProofTree(!showProofTree)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-soft border border-hairline text-xs font-mono text-body hover:text-ink transition-colors"
                  >
                    {showProofTree ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showProofTree ? "Hide Layers" : "Show Layers"}</span>
                  </button>
                </div>

                {proofResult ? (
                  <div className="space-y-4">
                    {/* Leaf */}
                    <div className="p-4 rounded-xl bg-surface-soft border border-hairline">
                      <div className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-1">
                        Leaf = keccak256(abi.encodePacked(address))
                      </div>
                      <div className="text-xs font-mono text-ink break-all">{proofResult.leaf}</div>
                      <div className="text-xs font-mono text-body mt-1">
                        Index: {proofResult.index} · Status: {proofResult.valid ? (
                          <span className="text-semantic-up font-semibold">✓ VALID</span>
                        ) : (
                          <span className="text-semantic-down font-semibold">✗ NOT FOUND</span>
                        )}
                      </div>
                    </div>

                    {/* Proof Path */}
                    {proofResult.valid && proofResult.proof.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-xs font-semibold text-muted uppercase tracking-wider">
                          Proof Path ({proofResult.proof.length} siblings)
                        </div>
                        {proofResult.proof.map((hash, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 p-2.5 rounded-xl bg-surface-soft border border-hairline text-xs font-mono"
                          >
                            <span className="text-muted w-8 shrink-0 text-xs">
                              [{i}]
                            </span>
                            <span className="text-ink break-all">{hash}</span>
                            <button
                              onClick={() => copyToClipboard(hash)}
                              className="shrink-0"
                            >
                              <Copy className="w-3.5 h-3.5 text-muted hover:text-ink" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Root */}
                    <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200">
                      <div className="text-[10px] font-semibold text-primary uppercase tracking-wider mb-1">
                        Merkle Root (Committed On-Chain)
                      </div>
                      <div className="text-xs font-mono text-primary font-semibold break-all flex items-center gap-2">
                        <span>{proofResult.root}</span>
                        <button onClick={() => copyToClipboard(proofResult.root)}>
                          <Copy className="w-3.5 h-3.5 text-primary hover:text-primary-hover shrink-0" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10 text-xs text-muted font-mono">
                    <Hash className="w-8 h-8 mx-auto mb-2 text-muted/50" />
                    Enter an address and verify to inspect the proof path
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: NGO REGISTRY CONSOLE */}
        {activeTab === "ngo" && (
          <div className="max-w-3xl space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-hairline shadow-card">
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-hairline">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-primary flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-ink">NGO Beneficiary Registry</h2>
                  <span className="text-xs text-body">
                    Upload → Build Tree → Commit Root On-Chain
                  </span>
                </div>
              </div>

              {ngoStep === "upload" && (
                <div className="space-y-4">
                  <p className="text-sm text-body leading-relaxed">
                    Upload a CSV of verified victim wallet addresses. Pulse computes Keccak256 hashes, builds a Merkle tree, and extracts the 32-byte root for on-chain commitment.
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
                    className="w-full border border-dashed border-hairline hover:border-primary rounded-2xl p-8 text-center bg-surface-soft cursor-pointer transition-colors group"
                  >
                    <Upload className="w-6 h-6 mx-auto text-muted group-hover:text-primary mb-2 transition-colors" />
                    <span className="text-ink font-semibold text-sm block">
                      Upload Beneficiary Addresses (.csv)
                    </span>
                    <span className="text-xs text-muted mt-1 block">
                      One address per line or comma-separated
                    </span>
                  </button>

                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-hairline" />
                    <span className="text-xs font-mono text-muted">OR</span>
                    <div className="h-px flex-1 bg-hairline" />
                  </div>

                  <button
                    onClick={handleLoadDemoAddresses}
                    className="w-full py-3 px-4 rounded-full bg-surface-soft hover:bg-surface-strong text-ink text-xs font-semibold transition-colors"
                  >
                    Load Demo Addresses ({activeTreeAddresses.length} beneficiaries)
                  </button>
                </div>
              )}

              {ngoStep === "tree" && ngoTree && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-semantic-up shrink-0 mt-0.5" />
                    <div>
                      <div className="text-semantic-up font-semibold">
                        Merkle Tree Built Successfully
                      </div>
                      <div className="text-body font-mono text-xs">
                        {ngoTree.addressCount} addresses hashed · {ngoTree.layers.length - 1} tree levels
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-surface-soft border border-hairline">
                    <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-1">
                      Computed Merkle Root
                    </div>
                    <div className="text-xs font-mono text-primary font-semibold break-all">
                      {ngoTree.root}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={resetNgo}
                      className="px-4 py-2.5 rounded-full bg-surface-soft hover:bg-surface-strong text-body text-xs font-semibold transition-colors"
                    >
                      Reset
                    </button>
                    <button
                      onClick={handleCommitRoot}
                      className="flex-1 py-2.5 px-4 rounded-full bg-primary hover:bg-primary-hover active:bg-primary-active text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Upload className="w-4 h-4" />
                      Pin to IPFS & Commit Root On-Chain
                    </button>
                  </div>
                </div>
              )}

              {ngoStep === "committed" && ngoTree && (
                <div className="space-y-4">
                  <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                    <CheckCircle2 className="w-10 h-10 text-semantic-up mx-auto" />
                    <div className="text-base font-semibold text-ink">Root Committed On-Chain</div>
                    <div className="text-xs text-body">
                      {ngoTree.addressCount} beneficiaries registered on Filecoin / IPFS.
                    </div>
                  </div>

                  <div className="space-y-2 text-xs font-mono">
                    <div className="p-3 rounded-xl bg-surface-soft border border-hairline">
                      <div className="text-muted text-[10px] uppercase">Merkle Root:</div>
                      <div className="text-primary font-semibold break-all">{ngoTree.root}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-surface-soft border border-hairline flex items-center justify-between">
                      <span className="text-body">Commit Tx:</span>
                      <span className="text-ink">{truncateHash(ngoCommitTxHash)}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-surface-soft border border-hairline flex items-center justify-between">
                      <span className="text-body">IPFS CID:</span>
                      <span className="text-ink">{truncateHash(ngoIpfsCid)}</span>
                    </div>
                  </div>

                  <button
                    onClick={resetNgo}
                    className="w-full py-2.5 px-4 rounded-full bg-surface-soft hover:bg-surface-strong text-ink text-xs font-semibold transition-colors"
                  >
                    Register Another Crisis
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: OFFLINE QR VOUCHERS */}
        {activeTab === "vouchers" && (
          <div className="max-w-3xl space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-hairline shadow-card">
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-hairline">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-primary flex items-center justify-center">
                  <QrCode className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-ink">Offline QR Voucher Generator</h2>
                  <span className="text-xs text-body">For degraded connectivity environments</span>
                </div>
              </div>

              {!voucherGenerated ? (
                <div className="space-y-4">
                  <p className="text-sm text-body leading-relaxed">
                    Generate printable voucher cards with embedded Merkle proofs encoded as QR codes. Victims scan the code once connectivity returns to claim aid.
                  </p>

                  <button
                    onClick={() => setVoucherGenerated(true)}
                    className="w-full py-3 px-4 rounded-full bg-primary hover:bg-primary-hover active:bg-primary-active text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <QrCode className="w-4 h-4" />
                    Generate {activeTreeAddresses.length} Vouchers
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-semantic-up shrink-0" />
                    <span className="text-semantic-up font-semibold">
                      {voucherData.length} vouchers generated
                    </span>
                  </div>

                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {voucherData.map((v, i) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-xl bg-surface-soft border border-hairline flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-white border border-hairline flex items-center justify-center shrink-0">
                            <QrCode className="w-5 h-5 text-muted" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-mono font-semibold text-primary">{v.code}</div>
                            <div className="text-[10px] font-mono text-muted truncate">
                              {truncateHash(v.address, 8, 6)}
                            </div>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-xs font-mono text-ink font-semibold">150 USDC</div>
                          <div className="text-[10px] text-muted">Gasless</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => {
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
                    className="w-full py-2.5 px-4 rounded-full bg-surface-soft hover:bg-surface-strong text-ink text-xs font-semibold border border-hairline transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export Voucher JSON
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
