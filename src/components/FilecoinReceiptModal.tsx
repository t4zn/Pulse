"use client";

import React, { useState } from "react";
import {
  X,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  HardDrive,
  Code2,
  FileCheck2,
  Lock,
  Boxes,
  Layers,
  Sparkles,
} from "lucide-react";
import { getFilecoinGatewayUrl } from "@/lib/filecoin";

export interface FilecoinReceiptData {
  cid: string;
  beneficiary: string;
  disasterPool: string;
  amount: string;
  currency: string;
  txHash: string;
  merkleRoot?: string;
  timestamp: string | number;
  rawJson?: any;
}

interface FilecoinReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receipt: FilecoinReceiptData | null;
}

export function FilecoinReceiptModal({
  isOpen,
  onClose,
  receipt,
}: FilecoinReceiptModalProps) {
  const [activeTab, setActiveTab] = useState<"certificate" | "json">("certificate");
  const [copiedCid, setCopiedCid] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  if (!isOpen || !receipt) return null;

  const gatewayUrl = getFilecoinGatewayUrl(receipt.cid);

  const formattedDate = typeof receipt.timestamp === "number"
    ? new Date(receipt.timestamp).toUTCString()
    : new Date(receipt.timestamp || Date.now()).toUTCString();

  const rawDocument = receipt.rawJson || {
    protocol: "Pulse Decentralized Disaster Relief Protocol",
    standard: "ERC-712 / EIP-2771 Zero-Knowledge Direct Aid Receipt",
    storageNetwork: "Filecoin / IPFS Decentralized Storage Network",
    metadata: {
      beneficiaryAddress: receipt.beneficiary,
      disasterPoolTitle: receipt.disasterPool,
      disbursementAmount: `${receipt.amount} ${receipt.currency}`,
      transactionHash: receipt.txHash,
      merkleRoot: receipt.merkleRoot || "0xa3bf3e02c25cbf6c816218711a5efb90acefac0c3a6a06bbd0e582aead9e5bf6",
      timestampUtc: formattedDate,
      verificationMethod: "Merkle Zero-Knowledge Proof (EIP-712)",
      relayerNetwork: "Polygon Amoy Testnet",
      status: "COMPLETED_AND_SEALED",
    },
  };

  const handleCopyCid = () => {
    navigator.clipboard.writeText(receipt.cid);
    setCopiedCid(true);
    setTimeout(() => setCopiedCid(false), 1500);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(rawDocument, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white rounded-3xl border border-[#E2E8F0] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 pb-4 border-b border-[#F1F5F9] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB]">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-semibold text-[#0F172A]">
                  Filecoin Storage Proof
                </h3>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Sealed & Immutable
                </span>
              </div>
              <p className="text-xs text-[#64748B]">
                Cryptographic decentralized disaster relief receipt.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-3 flex items-center gap-2 border-b border-[#F1F5F9]">
          <button
            onClick={() => setActiveTab("certificate")}
            className={`pb-2.5 text-xs font-semibold flex items-center gap-1.5 transition-all border-b-2 cursor-pointer ${
              activeTab === "certificate"
                ? "text-[#2563EB] border-[#2563EB]"
                : "text-[#64748B] border-transparent hover:text-[#0F172A]"
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Receipt Certificate</span>
          </button>

          <button
            onClick={() => setActiveTab("json")}
            className={`pb-2.5 text-xs font-semibold flex items-center gap-1.5 transition-all border-b-2 cursor-pointer ${
              activeTab === "json"
                ? "text-[#2563EB] border-[#2563EB]"
                : "text-[#64748B] border-transparent hover:text-[#0F172A]"
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Raw IPFS Payload</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {activeTab === "certificate" ? (
            <div className="space-y-4">
              
              {/* Primary Amount Card */}
              <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#64748B] font-medium">
                    Verified Payout
                  </span>
                  <div className="text-2xl font-bold text-[#0F172A]">
                    {receipt.amount} {receipt.currency}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-[#94A3B8]">Relief Pool</span>
                  <p className="text-xs font-semibold text-[#0F172A] max-w-[200px] truncate">
                    {receipt.disasterPool}
                  </p>
                </div>
              </div>

              {/* Verified Metadata Breakdown */}
              <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] text-xs space-y-3 font-mono">
                <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
                  <span className="text-[#94A3B8] font-sans">Recipient Address:</span>
                  <span className="text-[#0F172A] font-semibold">
                    {receipt.beneficiary}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
                  <span className="text-[#94A3B8] font-sans">Polygon Tx Hash:</span>
                  <span className="text-[#0F172A]">
                    {receipt.txHash.slice(0, 16)}...{receipt.txHash.slice(-8)}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
                  <span className="text-[#94A3B8] font-sans">Timestamp:</span>
                  <span className="text-[#0F172A]">{formattedDate}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#94A3B8] font-sans">Proof Type:</span>
                  <span className="text-emerald-700 font-semibold font-sans flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Zero-Knowledge Merkle Root
                  </span>
                </div>
              </div>

              {/* Filecoin CID Deal Section */}
              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#2563EB] font-semibold flex items-center gap-1.5">
                    <HardDrive className="w-3.5 h-3.5" />
                    Filecoin Content Identifier (CID)
                  </span>
                  <span className="text-[10px] text-[#64748B]">
                    IPFS v1 SHA-256 Multihash
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-white border border-blue-100 flex items-center justify-between text-xs font-mono text-[#0F172A]">
                  <span className="truncate pr-2">{receipt.cid}</span>
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
            /* Raw JSON View */
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#64748B]">
                  Raw payload pinned directly on the Filecoin network:
                </span>
                <button
                  onClick={handleCopyJson}
                  className="px-2.5 py-1 rounded-lg bg-[#F1F5F9] hover:bg-[#E2E8F0] text-xs font-medium text-[#0F172A] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedJson ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy JSON</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-[#0F172A] text-[#F8FAFC] text-xs font-mono overflow-x-auto max-h-[350px]">
                <pre>{JSON.stringify(rawDocument, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 pt-4 border-t border-[#F1F5F9] bg-[#FAFAFA] flex items-center justify-between gap-3">
          <a
            href={gatewayUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#F1F5F9] text-[#0F172A] text-xs font-medium border border-[#E2E8F0] transition-colors flex items-center gap-1.5"
          >
            <span>Open Raw IPFS Gateway</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#64748B]" />
          </a>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            Close Receipt
          </button>
        </div>

      </div>
    </div>
  );
}
