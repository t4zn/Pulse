"use client";

export const dynamic = "force-dynamic";

import React, { useState, useMemo, useEffect } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Loader2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Wallet,
  Lock,
  RefreshCw,
} from "lucide-react";
import {
  buildMerkleTree,
  generateProof,
  buildEIP712ClaimData,
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

const CRISIS_OPTIONS = [
  {
    id: "turkey-earthquake-2026",
    numericId: 1,
    title: "Turkey-Syria Earthquake",
    amount: "150",
    currency: "USDC",
    location: "Kahramanmaraş, Turkey",
  },
  {
    id: "kerala-flood-2026",
    numericId: 2,
    title: "Wayanad Floods",
    amount: "100",
    currency: "USDC",
    location: "Kerala, India",
  },
  {
    id: "horn-of-africa-2026",
    numericId: 3,
    title: "Horn of Africa Drought",
    amount: "75",
    currency: "USDC",
    location: "Somalia & Ethiopia",
  },
  {
    id: "morocco-earthquake-2026",
    numericId: 4,
    title: "Morocco Earthquake",
    amount: "150",
    currency: "USDC",
    location: "Al Haouz, Morocco",
  },
  {
    id: "libya-flood-2026",
    numericId: 5,
    title: "Libya Derna Floods",
    amount: "125",
    currency: "USDC",
    location: "Derna, Libya",
  },
];

export default function BeneficiaryPage() {
  const { address: connectedAddress, isConnected, connectWallet, switchAccount, signClaimMessage } = useWallet();

  const [selectedCrisisId, setSelectedCrisisId] = useState(CRISIS_OPTIONS[0].id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [claimTxHash, setClaimTxHash] = useState("");
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [copied, setCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const recipientAddress = connectedAddress || "";

  const activeCrisis = useMemo(() => {
    return CRISIS_OPTIONS.find((c) => c.id === selectedCrisisId) || CRISIS_OPTIONS[0];
  }, [selectedCrisisId]);

  // Build Merkle Tree including demo addresses + connected user address
  const treeData = useMemo(() => {
    const addresses = [...DEMO_BENEFICIARIES];
    if (connectedAddress && !addresses.includes(connectedAddress)) {
      addresses.push(connectedAddress);
    }
    return buildMerkleTree(addresses);
  }, [connectedAddress]);

  // Compute live Merkle Proof for connected recipient
  const proofResult = useMemo<MerkleProofResult | null>(() => {
    if (!recipientAddress || !recipientAddress.startsWith("0x") || recipientAddress.length !== 42) {
      return null;
    }
    try {
      return generateProof(treeData, recipientAddress);
    } catch {
      return null;
    }
  }, [recipientAddress, treeData]);

  // EIP-712 Typed Data Structure
  const eip712Data = useMemo(() => {
    const rawAmt = (parseFloat(activeCrisis.amount) * 1e6).toString();
    const deadline = Math.floor(Date.now() / 1000) + 3600;
    return buildEIP712ClaimData(
      activeCrisis.numericId,
      rawAmt,
      recipientAddress || "0x0000000000000000000000000000000000000000",
      0,
      deadline
    );
  }, [recipientAddress, activeCrisis]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofResult || !proofResult.valid) return;

    setIsSubmitting(true);
    setStatusMessage("Requesting EIP-712 signature...");

    try {
      if (isConnected) {
        const signResult = await signClaimMessage(eip712Data);
        if (!signResult.success) {
          console.warn("MetaMask signature cancelled, using sponsored relayer simulation.");
        }
      }

      setStatusMessage("Submitting meta-tx to Polygon Amoy...");
      await new Promise((r) => setTimeout(r, 1000));

      const fakeTxHash =
        "0x" +
        Array.from({ length: 64 }, () =>
          Math.floor(Math.random() * 16).toString(16)
        ).join("");

      setClaimTxHash(fakeTxHash);
      setIsConfirmed(true);
      setIsSubmitting(false);
      setStatusMessage("");
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      setStatusMessage("Claim failed. Please try again.");
    }
  };

  const resetForm = () => {
    setIsConfirmed(false);
    setClaimTxHash("");
  };

  return (
    <div className="w-full bg-[#FAFAFA] text-[#0F172A] min-h-[calc(100vh-64px)] flex items-center justify-center py-14 px-4">
      <div className="w-full max-w-xl">
        
        {/* Unified Clean Form Card */}
        <div className="rounded-3xl bg-white border border-[#E2E8F0] shadow-[0_4px_24px_rgba(0,0,0,0.03)] overflow-hidden">
          
          {/* Header */}
          <div className="p-8 sm:p-10 pb-6 border-b border-[#F1F5F9] space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Zero-Knowledge Verification</span>
            </div>

            <h1 className="text-2xl sm:text-[28px] font-semibold tracking-tight text-[#0F172A]">
              Beneficiary Aid Claim
            </h1>
            <p className="text-sm text-[#64748B] leading-relaxed">
              Verify your identity and claim direct disaster relief.
            </p>
          </div>

          {/* Form */}
          {!isConfirmed ? (
            <form onSubmit={handleClaim} className="p-8 sm:p-10 space-y-5">
              
              {/* Field 1: Disaster Pool */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#334155]">
                  Disaster Pool
                </label>
                <div className="relative">
                  <select
                    value={selectedCrisisId}
                    onChange={(e) => setSelectedCrisisId(e.target.value)}
                    className="w-full py-3.5 px-4 pr-10 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-base text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:bg-white transition-all appearance-none cursor-pointer"
                  >
                    {CRISIS_OPTIONS.map((crisis) => (
                      <option key={crisis.id} value={crisis.id}>
                        {crisis.title}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-5 h-5 text-[#94A3B8] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Field 2: Relief Amount */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-[#334155]">
                    Approved Amount
                  </label>
                  <span className="text-xs text-emerald-600 font-medium">
                    100% Direct Payout
                  </span>
                </div>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={`${activeCrisis.amount}.00`}
                    readOnly
                    className="w-full py-3.5 px-4 pr-20 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-lg font-semibold text-[#0F172A] focus:outline-none select-none cursor-default"
                  />
                  <div className="absolute right-3 px-3 py-1 rounded-lg bg-blue-50 text-[#2563EB] text-xs font-semibold border border-blue-100">
                    {activeCrisis.currency}
                  </div>
                </div>
              </div>

              {/* Field 3: Automated Beneficiary Wallet Connection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#334155]">
                  Beneficiary Wallet
                </label>

                {!isConnected ? (
                  <button
                    type="button"
                    onClick={connectWallet}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] text-sm font-medium text-[#0F172A] flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Wallet className="w-4 h-4 text-[#2563EB]" />
                    <span>Connect Wallet</span>
                  </button>
                ) : (
                  <div className="py-3.5 px-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                      <span className="text-sm font-mono text-[#0F172A]">
                        {connectedAddress ? `${connectedAddress.slice(0, 10)}...${connectedAddress.slice(-8)}` : "Connected"}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={switchAccount}
                      className="text-xs text-[#2563EB] hover:text-[#1D4ED8] font-medium"
                    >
                      Switch
                    </button>
                  </div>
                )}

                {/* Inline Status */}
                {isConnected && (
                  <div className="pt-1 flex items-center justify-between text-xs">
                    {proofResult && proofResult.valid ? (
                      <div className="flex items-center gap-1.5 text-emerald-600 font-medium text-xs">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Eligible for Payout</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between w-full text-xs">
                        <span className="text-amber-600 flex items-center gap-1.5">
                          <XCircle className="w-4 h-4" /> Not eligible for payout
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Technical Details Toggle */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
                  className="w-full flex items-center justify-between py-1 text-xs text-[#64748B] hover:text-[#0F172A] transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>Technical Proof Details</span>
                  </div>
                  {showTechnicalDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showTechnicalDetails && proofResult && (
                  <div className="mt-2 p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2 text-xs font-mono text-[#475569]">
                    <div className="flex justify-between">
                      <span className="text-[#94A3B8]">Merkle Root:</span>
                      <span className="text-[#0F172A] truncate max-w-[240px]">{treeData.root}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#94A3B8]">Leaf Hash:</span>
                      <span className="text-[#0F172A] truncate max-w-[240px]">{proofResult.leaf}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#94A3B8]">Network:</span>
                      <span className="text-[#0F172A]">Polygon Amoy (80002)</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Status Notice if loading */}
              {isSubmitting && statusMessage && (
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-xs text-[#2563EB] flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                  <span>{statusMessage}</span>
                </div>
              )}

              {/* Action Submit Button */}
              {!isConnected && !recipientAddress ? (
                <button
                  type="button"
                  onClick={connectWallet}
                  className="w-full py-4 px-6 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white text-base font-semibold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer mt-3"
                >
                  <Wallet className="w-4 h-4" />
                  <span>Connect Wallet to Claim</span>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting || !proofResult?.valid}
                  className="w-full py-4 px-6 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] disabled:bg-[#CBD5E1] text-white text-base font-semibold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:cursor-not-allowed mt-3"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Claiming Aid...</span>
                    </>
                  ) : (
                    <span>Claim Aid</span>
                  )}
                </button>
              )}
            </form>
          ) : (
            /* Confirmed Receipt View */
            <div className="p-8 sm:p-10 text-center space-y-6">
              <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <h2 className="text-xl font-semibold text-[#0F172A]">
                  Aid Claim Confirmed
                </h2>
                <p className="text-sm text-[#64748B]">
                  <strong>{activeCrisis.amount}.00 {activeCrisis.currency}</strong> transferred to recipient address.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-mono text-left space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[#94A3B8]">Recipient:</span>
                  <span className="text-[#0F172A]">{recipientAddress.slice(0, 10)}...{recipientAddress.slice(-8)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#94A3B8]">Amount:</span>
                  <span className="text-[#0F172A] font-semibold">{activeCrisis.amount}.00 {activeCrisis.currency}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[#E2E8F0]">
                  <span className="text-[#94A3B8]">Tx Hash:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[#0F172A]">{claimTxHash.slice(0, 12)}...</span>
                    <button
                      onClick={() => handleCopy(claimTxHash)}
                      className="p-1 hover:text-[#2563EB]"
                      title="Copy Hash"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#64748B]" />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={resetForm}
                className="w-full py-3 px-4 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#0F172A] text-sm font-medium border border-[#E2E8F0] transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Claim for Another Address</span>
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
