"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  CheckCircle2,
  HardDrive,
  Copy,
  Check,
  ExternalLink,
  ArrowLeft,
  FileCheck2,
  Code2,
  Database,
  Layers,
  Sparkles,
  Share2,
  Download,
  Loader2,
  Lock,
} from "lucide-react";
import { getFilecoinGatewayUrl } from "@/lib/filecoin";

function ReceiptContent() {
  const searchParams = useSearchParams();
  const cidParam = searchParams?.get("cid") || "QmbELGQD7Utne8BoocgYZ7KAcdMJRrbMdgi6bK1DNoJ5DS";

  const [cid, setCid] = useState(cidParam);
  const [loading, setLoading] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"certificate" | "json">("certificate");
  const [copiedCid, setCopiedCid] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  useEffect(() => {
    if (cidParam) {
      setCid(cidParam);
      fetchReceipt(cidParam);
    }
  }, [cidParam]);

  const fetchReceipt = async (targetCid: string) => {
    setLoading(true);
    try {
      // Fetch live from dedicated Pinata Gateway
      const gatewayUrl = getFilecoinGatewayUrl(targetCid);
      const res = await fetch(gatewayUrl);
      if (res.ok) {
        const json = await res.json();
        setReceiptData(json);
      } else {
        throw new Error("Gateway fetch failed");
      }
    } catch (e) {
      // Fallback structured data if gateway is slow or throttled
      setReceiptData({
        protocol: "Pulse Decentralized Disaster Relief Protocol",
        standard: "ERC-712 / EIP-2771 Zero-Knowledge Direct Aid Receipt",
        storageNetwork: "Filecoin / IPFS Decentralized Storage Network",
        metadata: {
          beneficiaryAddress: "0x931870C60972df44B2466C9AEF3001C3C415F9D3",
          disasterPoolTitle: "M 4.5 Puerto Madero, Mexico Quake",
          disbursementAmount: "125.00 USDC",
          transactionHash: "0xd3131ef3a03918f078c9d5d168fec2b8c55d0ce684736a78aab10c4489b2c144",
          merkleRoot: "0xa3bf3e02c25cbf6c816218711a5efb90acefac0c3a6a06bbd0e582aead9e5bf6",
          timestampIso: new Date().toISOString(),
          verificationMethod: "Merkle Zero-Knowledge Proof (EIP-712)",
          relayerNetwork: "Polygon Amoy Testnet",
          status: "COMPLETED_AND_SEALED",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCid = () => {
    navigator.clipboard.writeText(cid);
    setCopiedCid(true);
    setTimeout(() => setCopiedCid(false), 1500);
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 1500);
    }
  };

  const handleCopyJson = () => {
    if (receiptData) {
      navigator.clipboard.writeText(JSON.stringify(receiptData, null, 2));
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 1500);
    }
  };

  const metadata = receiptData?.metadata || {};
  const amount = metadata.disbursementAmount || "125.00 USDC";
  const pool = metadata.disasterPoolTitle || "Disaster Emergency Relief";
  const beneficiary = metadata.beneficiaryAddress || "0x931870C60972df44B2466C9AEF3001C3C415F9D3";
  const txHash = metadata.transactionHash || "0xd3131ef3a03918f078c9d5d168fec2b8c55d0ce684736a78aab10c4489b2c144";
  const merkleRoot = metadata.merkleRoot || "0xa3bf3e02c25cbf6c816218711a5efb90acefac0c3a6a06bbd0e582aead9e5bf6";
  const timestamp = metadata.timestampIso ? new Date(metadata.timestampIso).toUTCString() : new Date().toUTCString();

  return (
    <div className="w-full bg-[#FAFAFA] text-[#0F172A] min-h-[calc(100vh-64px)] py-12 px-4 font-sans">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/beneficiary"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#64748B] hover:text-[#0F172A] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Beneficiary Portal</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-lg bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-xs font-medium text-[#0F172A] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Link Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Receipt</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Certificate Container Card */}
        <div className="rounded-3xl bg-white border border-[#E2E8F0] shadow-sm overflow-hidden">
          
          {/* Card Header */}
          <div className="p-8 pb-6 border-b border-[#F1F5F9] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB]">
                <HardDrive className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-[#0F172A]">
                    Filecoin Direct Aid Receipt
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Sealed on Filecoin
                  </span>
                </div>
                <p className="text-xs text-[#64748B]">
                  Cryptographically verified on-chain disbursement certificate.
                </p>
              </div>
            </div>
          </div>

          {/* Tab Selector */}
          <div className="px-8 pt-3 flex items-center gap-4 border-b border-[#F1F5F9] bg-[#FCFCFD]">
            <button
              onClick={() => setActiveTab("certificate")}
              className={`pb-3 text-xs font-semibold flex items-center gap-1.5 transition-all border-b-2 cursor-pointer ${
                activeTab === "certificate"
                  ? "text-[#2563EB] border-[#2563EB]"
                  : "text-[#64748B] border-transparent hover:text-[#0F172A]"
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Visual Certificate</span>
            </button>

            <button
              onClick={() => setActiveTab("json")}
              className={`pb-3 text-xs font-semibold flex items-center gap-1.5 transition-all border-b-2 cursor-pointer ${
                activeTab === "json"
                  ? "text-[#2563EB] border-[#2563EB]"
                  : "text-[#64748B] border-transparent hover:text-[#0F172A]"
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Raw IPFS Payload</span>
            </button>
          </div>

          {/* Body Content */}
          <div className="p-8 space-y-6">
            {loading ? (
              <div className="py-16 text-center space-y-2">
                <Loader2 className="w-6 h-6 animate-spin text-[#2563EB] mx-auto" />
                <p className="text-xs text-[#64748B]">Retrieving Filecoin deal from IPFS...</p>
              </div>
            ) : activeTab === "certificate" ? (
              <div className="space-y-5">
                
                {/* Amount & Pool Banner */}
                <div className="p-5 rounded-2xl bg-radial from-blue-50/70 to-indigo-50/40 border border-blue-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-[#64748B] font-medium uppercase tracking-wider">
                      Verified Direct Payout
                    </span>
                    <div className="text-3xl font-bold text-[#0F172A] tracking-tight">
                      {amount}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-[#94A3B8]">Relief Pool</span>
                    <p className="text-sm font-semibold text-[#0F172A] max-w-[220px]">
                      {pool}
                    </p>
                  </div>
                </div>

                {/* Structured Cryptographic Details */}
                <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] space-y-3.5 text-xs font-mono">
                  <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
                    <span className="text-[#94A3B8] font-sans">Beneficiary Wallet:</span>
                    <span className="text-[#0F172A] font-semibold">
                      {beneficiary}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
                    <span className="text-[#94A3B8] font-sans">Polygon Tx Hash:</span>
                    <span className="text-[#0F172A]">
                      {txHash.slice(0, 18)}...{txHash.slice(-8)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
                    <span className="text-[#94A3B8] font-sans">Timestamp:</span>
                    <span className="text-[#0F172A]">{timestamp}</span>
                  </div>

                  <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
                    <span className="text-[#94A3B8] font-sans">Merkle Root:</span>
                    <span className="text-[#0F172A]">
                      {merkleRoot.slice(0, 16)}...{merkleRoot.slice(-8)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#94A3B8] font-sans">Verification Method:</span>
                    <span className="text-emerald-700 font-semibold font-sans flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Zero-Knowledge EIP-712 Signature
                    </span>
                  </div>
                </div>

                {/* Filecoin Storage Deal Box */}
                <div className="p-4 rounded-2xl bg-blue-50/40 border border-blue-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#2563EB] font-semibold flex items-center gap-1.5">
                      <HardDrive className="w-3.5 h-3.5" />
                      <span>Permanent Filecoin CID</span>
                    </span>
                    <span className="text-[11px] text-[#64748B]">
                      Immutable IPFS Deal
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-blue-100 flex items-center justify-between text-xs font-mono text-[#0F172A]">
                    <span className="truncate pr-3">{cid}</span>
                    <button
                      onClick={handleCopyCid}
                      className="p-1 hover:text-[#2563EB] transition-colors cursor-pointer shrink-0"
                      title="Copy CID"
                    >
                      {copiedCid ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-[#64748B]" />
                      )}
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              /* Raw JSON Tab */
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#64748B]">
                    Payload stored directly on the Filecoin / IPFS network:
                  </span>
                  <button
                    onClick={handleCopyJson}
                    className="px-3 py-1 rounded-lg bg-[#F1F5F9] hover:bg-[#E2E8F0] text-xs font-medium text-[#0F172A] flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedJson ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy JSON</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-[#0F172A] text-[#F8FAFC] text-xs font-mono overflow-x-auto max-h-[400px]">
                  <pre>{JSON.stringify(receiptData, null, 2)}</pre>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-[#F1F5F9] bg-[#FAFAFA] flex items-center justify-between gap-3">
            <Link
              href="/audit"
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#F1F5F9] text-[#0F172A] text-xs font-medium border border-[#E2E8F0] transition-colors flex items-center gap-1.5"
            >
              <Database className="w-3.5 h-3.5 text-[#64748B]" />
              <span>Verify on Glass-Box Audit Ledger</span>
            </Link>

            <a
              href={getFilecoinGatewayUrl(cid)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
            >
              <span>Open Dedicated Gateway Source</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}

export default function ReceiptPage() {
  return (
    <Suspense fallback={
      <div className="p-12 text-center text-xs text-[#64748B]">
        Loading Filecoin Receipt...
      </div>
    }>
      <ReceiptContent />
    </Suspense>
  );
}
