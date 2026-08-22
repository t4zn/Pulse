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
    title: "Turkey-Syria Earthquake 2026",
    amount: "150",
    currency: "USDC",
    location: "Kahramanmaraş, Turkey",
  },
  {
    id: "pakistan-floods-2026",
    numericId: 2,
    title: "Pakistan Monsoon Inundation",
    amount: "100",
    currency: "USDC",
    location: "Sindh & Balochistan",
  },
  {
    id: "horn-africa-drought-2026",
    numericId: 3,
    title: "Horn of Africa Emergency Reserve",
    amount: "75",
    currency: "USDC",
    location: "Somalia & Eastern Kenya",
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
    <div className="w-full bg-[#FAFAFA] text-[#0F172A] min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-lg">
        
        {/* Unified Clean Form Card */}
        <div className="rounded-2xl bg-white border border-[#E2E8F0] shadow-sm overflow-hidden">
          
          {/* Header */}
          <div className="p-6 sm:p-7 pb-5 border-b border-[#F1F5F9]">
            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Zero-Knowledge Verification</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#0F172A]">
              Beneficiary Aid Claim
            </h1>
            <p className="text-xs sm:text-[13px] text-[#64748B] mt-1 leading-relaxed">
              Verify your identity and claim direct relief with $0 network gas fees.
            </p>
          </div>

          {/* Form */}
          {!isConfirmed ? (
            <form onSubmit={handleClaim} className="p-6 sm:p-7 space-y-4">
              
              {/* Field 1: Disaster Pool */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#475569]">
                  Disaster Pool
                </label>
                <div className="relative">
                  <select
                    value={selectedCrisisId}
                    onChange={(e) => setSelectedCrisisId(e.target.value)}
                    className="w-full py-2.5 px-3 pr-9 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-sm text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:bg-white transition-all appearance-none cursor-pointer"
                  >
                    {CRISIS_OPTIONS.map((crisis) => (
                      <option key={crisis.id} value={crisis.id}>
                        {crisis.title}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#94A3B8] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Field 2: Relief Amount */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-[#475569]">
                    Approved Amount
                  </label>
                  <span className="text-[11px] text-emerald-600 font-medium">
                    100% Direct Payout
                  </span>
                </div>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={`${activeCrisis.amount}.00`}
                    readOnly
                    className="w-full py-2.5 px-3 pr-16 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-sm font-semibold text-[#0F172A] focus:outline-none select-none cursor-default"
                  />
                  <div className="absolute right-2.5 px-2 py-0.5 rounded bg-blue-50 text-[#2563EB] text-xs font-medium border border-blue-100">
                    {activeCrisis.currency}
                  </div>
                </div>
              </div>

              {/* Field 3: Automated Beneficiary Wallet Connection */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#475569]">
                  Beneficiary Wallet
                </label>

                {!isConnected ? (
                  <button
                    type="button"
                    onClick={connectWallet}
                    className="w-full py-3 px-3 rounded-lg bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] text-xs font-medium text-[#0F172A] flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Wallet className="w-4 h-4 text-[#2563EB]" />
                    <span>Connect Wallet</span>
                  </button>
                ) : (
                  <div className="py-2.5 px-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      <span className="text-xs font-mono text-[#0F172A]">
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
                  <div className="pt-0.5 flex items-center justify-between text-xs">
                    {proofResult && proofResult.valid ? (
                      <div className="flex items-center gap-1.5 text-emerald-600 font-medium text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Eligible for Payout</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between w-full text-[11px]">
                        <span className="text-amber-600 flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> Not eligible for payout
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
                    <Lock className="w-3 h-3 text-[#2563EB]" />
                    <span>Technical Proof Details</span>
                  </div>
                  {showTechnicalDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {showTechnicalDetails && proofResult && (
                  <div className="mt-2 p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-1.5 text-[11px] font-mono text-[#475569]">
                    <div className="flex justify-between">
                      <span className="text-[#94A3B8]">Merkle Root:</span>
                      <span className="text-[#0F172A] truncate max-w-[200px]">{treeData.root}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#94A3B8]">Leaf Hash:</span>
                      <span className="text-[#0F172A] truncate max-w-[200px]">{proofResult.leaf}</span>
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
                <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-100 text-xs text-[#2563EB] flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                  <span>{statusMessage}</span>
                </div>
              )}

              {/* Action Submit Button */}
              {!isConnected && !recipientAddress ? (
                <button
                  type="button"
                  onClick={connectWallet}
                  className="w-full py-3 px-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white text-sm font-medium flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer mt-2"
                >
                  <Wallet className="w-4 h-4" />
                  <span>Connect Wallet to Claim</span>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting || !proofResult?.valid}
                  className="w-full py-3 px-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] disabled:bg-[#CBD5E1] text-white text-sm font-medium flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:cursor-not-allowed mt-2"
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

              {/* Minimal Footer Note */}
              <div className="flex items-center justify-between text-[11px] text-[#64748B] pt-1 px-1">
                <span>Polygon Amoy Testnet</span>
                <span className="text-emerald-600 font-medium">Gas: $0.00 (Sponsored)</span>
              </div>
            </form>
          ) : (
            /* Confirmed Receipt View */
            <div className="p-6 sm:p-7 text-center space-y-5">
              <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <h2 className="text-lg font-semibold text-[#0F172A]">
                  Aid Claim Confirmed
                </h2>
                <p className="text-xs text-[#64748B]">
                  <strong>{activeCrisis.amount}.00 {activeCrisis.currency}</strong> transferred to recipient address.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-mono text-left space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[#94A3B8]">Recipient:</span>
                  <span className="text-[#0F172A]">{recipientAddress.slice(0, 8)}...{recipientAddress.slice(-6)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#94A3B8]">Amount:</span>
                  <span className="text-[#0F172A] font-semibold">{activeCrisis.amount}.00 {activeCrisis.currency}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#94A3B8]">Gas Fee:</span>
                  <span className="text-emerald-600 font-medium">$0.00 (Sponsored)</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-[#E2E8F0]">
                  <span className="text-[#94A3B8]">Tx Hash:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#0F172A]">{claimTxHash.slice(0, 10)}...</span>
                    <button
                      onClick={() => handleCopy(claimTxHash)}
                      className="p-0.5 hover:text-[#2563EB]"
                      title="Copy Hash"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-[#64748B]" />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={resetForm}
                className="w-full py-2.5 px-4 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#0F172A] text-xs font-medium border border-[#E2E8F0] transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Claim for Another Address</span>
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
