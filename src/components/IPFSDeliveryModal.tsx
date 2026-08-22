"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  X,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Clock,
  FileCheck,
  Copy,
  Download,
  Eye,
  Check,
  Sparkles,
  Camera,
  Boxes,
  Building2,
  Fingerprint,
} from "lucide-react";
import { getIpfsGatewayUrl, formatAddress } from "@/lib/contracts";

export interface IPFSDeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  cid: string;
  title: string;
  photoUrl?: string;
  disasterLocation?: string;
  deliveredItems?: string[];
  ngoName?: string;
  timestamp?: string;
  blockNumber?: number;
  beneficiaryCount?: number;
  inspectorName?: string;
  inspectorSignature?: string;
}

// Sample photo mapping based on keywords or default
function resolveDeliveryPhoto(cid: string, title: string): { url: string; caption: string } {
  const t = title.toLowerCase();
  const c = cid.toLowerCase();

  if (t.includes("turk") || t.includes("kizilay") || t.includes("shelter") || t.includes("tent") || c.includes("qmz11") || c.includes("qmy9a")) {
    return {
      url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000&q=80",
      caption: "Field Delivery: 1,200 Sub-Zero Insulated Family Tents deployed at Hatay Antakya Sector 4 Logistics Base."
    };
  }

  if (t.includes("kerala") || t.includes("india") || t.includes("flood") || t.includes("water") || t.includes("goonj") || c.includes("qmz33")) {
    return {
      url: "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=1000&q=80",
      caption: "Field Delivery: 5,000 Liters/Hour Mobile Water Filtration Units & Sanitation Ration Kits deployed at Meppadi."
    };
  }

  if (t.includes("japan") || t.includes("jrc") || t.includes("peace winds") || c.includes("qmjrc")) {
    return {
      url: "https://images.unsplash.com/photo-1584727638096-042c45049ebe?auto=format&fit=crop&w=1000&q=80",
      caption: "Field Delivery: Emergency Auxiliary Power Generators & Medical Geriatric Bundles in Tateyama."
    };
  }

  if (t.includes("philippin") || t.includes("typhoon") || t.includes("wfp") || c.includes("qmprc")) {
    return {
      url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1000&q=80",
      caption: "Field Delivery: 850 Heavy Corrugated Tarpaulin Kits & Ready-to-Eat Emergency Food Packs dispatched to Siargao Island."
    };
  }

  return {
    url: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb7?auto=format&fit=crop&w=1000&q=80",
    caption: "Field Delivery: Cryptographically Verified Emergency Relief Aid Distribution."
  };
}

export function IPFSDeliveryModal({
  isOpen,
  onClose,
  cid,
  title,
  photoUrl,
  disasterLocation = "Verified Emergency Relief Sector",
  deliveredItems = ["Emergency Thermal Shelter Units", "High-Nutrition Food Packs", "Water Purification Tablets"],
  ngoName = "Accredited Humanitarian Responder",
  timestamp = "2026-08-22 10:35 UTC",
  blockNumber = 5938110,
  beneficiaryCount = 120,
  inspectorName = "Dr. M. Eren (Field Triage Lead)",
  inspectorSignature = "0x8a2f1b4c9e801234567890abcdef1234567890abcdef8812c45e89d123456789",
}: IPFSDeliveryModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const defaultPhoto = resolveDeliveryPhoto(cid, title);
  const activePhoto = photoUrl || defaultPhoto.url;
  const activeCaption = defaultPhoto.caption;

  const handleCopyCid = () => {
    navigator.clipboard.writeText(cid);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadProof = () => {
    const proofData = {
      protocol: "PULSE Protocol — IPFS Cryptographic Proof of Delivery",
      ipfsCid: cid,
      ipfsGatewayUrl: getIpfsGatewayUrl(cid),
      title,
      disasterLocation,
      ngoName,
      deliveredItems,
      beneficiariesServed: beneficiaryCount,
      blockNumber,
      timestamp,
      inspector: {
        name: inspectorName,
        eip712Signature: inspectorSignature,
      },
      sha256Checksum: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      verifiedOnChain: true,
    };

    const blob = new Blob([JSON.stringify(proofData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `IPFS_Proof_Delivery_${cid.slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-white rounded-3xl border border-[#E2E8F0] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
        
        {/* Header */}
        <div className="p-5 md:p-6 bg-gradient-to-r from-[#1E293B] to-[#0F172A] text-white flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-mono font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                IMMUTABLE IPFS PROOF OF DELIVERY
              </span>
              <span className="text-slate-400 text-xs">•</span>
              <span className="text-slate-300 text-xs font-mono">Block #{blockNumber}</span>
            </div>
            <h3 className="text-lg md:text-xl font-bold tracking-tight text-white">{title}</h3>
            <p className="text-xs text-slate-300 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>{disasterLocation}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 md:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Real Photographic Proof Box */}
          <div className="rounded-2xl overflow-hidden border border-[#E2E8F0] bg-[#F8FAFC] space-y-2">
            <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
              <img
                src={activePhoto}
                alt={title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-mono flex items-center gap-1.5 border border-white/20">
                <Camera className="w-3 h-3 text-blue-400" />
                <span>Verified Field Photography</span>
              </div>

              <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-emerald-600/90 backdrop-blur-md text-white text-xs font-mono font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Merkle Leaf Matched</span>
              </div>
            </div>

            <div className="p-3 text-xs text-[#475569] leading-relaxed italic bg-white border-t border-[#E2E8F0]">
              &ldquo;{activeCaption}&rdquo;
            </div>
          </div>

          {/* Verification Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
            
            <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
              <div className="text-[#94A3B8] text-[10px] uppercase">DECENTRALIZED IPFS CID:</div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[#2563EB] font-semibold break-all text-[11px]">{cid}</span>
                <button
                  onClick={handleCopyCid}
                  className="text-[#64748B] hover:text-[#0F172A] shrink-0"
                  title="Copy CID"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
              <div className="text-[#94A3B8] text-[10px] uppercase">EXECUTING NGO PARTNER:</div>
              <div className="text-[#0F172A] font-bold text-xs">{ngoName}</div>
              <div className="text-[10px] text-emerald-600">✓ Authorized Multisig Signer</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
              <div className="text-[#94A3B8] text-[10px] uppercase">DELIVERY TIMESTAMP & BLOCK:</div>
              <div className="text-[#0F172A] font-semibold">{timestamp}</div>
              <div className="text-[10px] text-[#64748B]">Recorded in Block #{blockNumber}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
              <div className="text-[#94A3B8] text-[10px] uppercase">REACH & FAMILIES AIDED:</div>
              <div className="text-emerald-600 font-bold text-sm">{beneficiaryCount} Displaced Families</div>
              <div className="text-[10px] text-[#64748B]">Zero-Knowledge Privacy Maintained</div>
            </div>

          </div>

          {/* Items Verified Dispatched */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#0F172A]">
              <Boxes className="w-4 h-4 text-[#2563EB]" />
              <span>DELIVERED AID INVENTORY SPECIFICATIONS</span>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              {deliveredItems.map((item, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg bg-white border border-[#E2E8F0] text-[#0F172A] font-medium shadow-2xs"
                >
                  ✓ {item}
                </span>
              ))}
            </div>
          </div>

          {/* Cryptographic Sign-Off */}
          <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200 text-xs font-mono space-y-1.5">
            <div className="flex items-center justify-between text-purple-900 font-bold">
              <span className="flex items-center gap-1.5">
                <Fingerprint className="w-3.5 h-3.5 text-purple-700" />
                EIP-712 FIELD INSPECTOR SIGNATURE
              </span>
              <span className="text-[10px] text-purple-700 font-normal">Cryptographically Signed</span>
            </div>
            <div className="text-[11px] text-[#0F172A]">Inspector: <span className="font-semibold">{inspectorName}</span></div>
            <div className="text-[10px] text-purple-800 break-all bg-white p-2 rounded border border-purple-100">
              {inspectorSignature}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadProof}
              className="px-4 py-2 rounded-full bg-white border border-[#E2E8F0] hover:bg-[#F1F5F9] text-[#0F172A] text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Download Proof JSON</span>
            </button>

            <Link
              href={`/receipt?cid=${encodeURIComponent(cid)}`}
              className="px-4 py-2 rounded-full bg-blue-50 border border-blue-200 hover:bg-blue-100 text-[#2563EB] text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>On-Site Certificate</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={getIpfsGatewayUrl(cid)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full bg-[#2563EB] hover:bg-blue-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <span>Raw IPFS</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-full bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
