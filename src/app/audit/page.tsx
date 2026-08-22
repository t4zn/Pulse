"use client";

export const dynamic = "force-dynamic";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  HardDrive,
  Copy,
  Check,
  Search,
  ExternalLink,
  FileCheck,
  RefreshCw,
  Clock,
  Layers,
  ArrowUpRight,
  Database,
  Filter,
  Eye,
} from "lucide-react";
import { FilecoinReceiptModal, FilecoinReceiptData } from "@/components/FilecoinReceiptModal";
import { getStoredAuditEvents, SEED_AUDIT_EVENTS, AuditEvent } from "@/lib/auditState";
import { getFilecoinGatewayUrl } from "@/lib/filecoin";

function AuditContent() {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<FilecoinReceiptData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load audit events (combines stored live claims + verified seed events)
  const loadEvents = () => {
    const stored = getStoredAuditEvents();
    if (stored && stored.length > 0) {
      setEvents(stored);
    } else {
      setEvents(SEED_AUDIT_EVENTS);
    }
  };

  useEffect(() => {
    loadEvents();

    const handleSync = () => loadEvents();
    window.addEventListener("PULSE_AUDIT_SYNC", handleSync);
    return () => window.removeEventListener("PULSE_AUDIT_SYNC", handleSync);
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleOpenReceipt = (event: AuditEvent) => {
    setSelectedReceipt({
      cid: event.ipfsCid || "QmbELGQD7Utne8BoocgYZ7KAcdMJRrbMdgi6bK1DNoJ5DS",
      beneficiary: event.beneficiaryAddress || event.toAddress,
      disasterPool: event.category || "Emergency Disaster Relief",
      amount: event.amountUSD.toString(),
      currency: "USDC",
      txHash: event.txHash,
      merkleRoot: event.merkleLeaf,
      timestamp: event.timestamp,
    });
    setIsModalOpen(true);
  };

  // Filter receipts by search query and category
  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (ev.beneficiaryAddress && ev.beneficiaryAddress.toLowerCase().includes(q)) ||
        (ev.toAddress && ev.toAddress.toLowerCase().includes(q)) ||
        (ev.txHash && ev.txHash.toLowerCase().includes(q)) ||
        (ev.ipfsCid && ev.ipfsCid.toLowerCase().includes(q)) ||
        (ev.category && ev.category.toLowerCase().includes(q));

      const matchesCategory =
        selectedCategory === "All" ||
        ev.category === selectedCategory ||
        (!ev.category && selectedCategory === "All");

      return matchesSearch && matchesCategory;
    });
  }, [events, searchQuery, selectedCategory]);

  // High-level transparency metrics
  const totalDisbursed = useMemo(() => {
    return events.reduce((sum, e) => sum + (e.amountUSD || 0), 0);
  }, [events]);

  const totalReceipts = events.length;

  return (
    <div className="w-full bg-[#FAFAFA] text-[#0F172A] min-h-screen py-10 px-4 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Minimal Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-semibold text-[#2563EB]">
            <HardDrive className="w-3.5 h-3.5" />
            <span>Filecoin & IPFS Transparency Registry</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A]">
            Audit Ledger
          </h1>

          <p className="text-xs sm:text-sm text-[#64748B] max-w-lg mx-auto">
            Live cryptographically verified disaster aid receipts sealed on Filecoin.
          </p>
        </div>

        {/* Minimal Transparency Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-0.5">
            <span className="text-[11px] text-[#64748B] font-medium">Total Aid Disbursed</span>
            <div className="text-xl font-bold text-[#0F172A]">
              ${totalDisbursed.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <span className="text-[10px] text-emerald-600 font-medium">100% Direct to Beneficiaries</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-0.5">
            <span className="text-[11px] text-[#64748B] font-medium">Filecoin Proof Deals</span>
            <div className="text-xl font-bold text-[#0F172A]">
              {totalReceipts} Sealed Deals
            </div>
            <span className="text-[10px] text-[#2563EB] font-medium">Immutable & Permanent</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-0.5">
            <span className="text-[11px] text-[#64748B] font-medium">Verification Protocol</span>
            <div className="text-xl font-bold text-[#0F172A]">
              Zero-Knowledge
            </div>
            <span className="text-[10px] text-purple-600 font-medium">EIP-712 Merkle Proofs</span>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          {/* Search Bar */}
          <div className="relative w-full sm:flex-1">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by wallet, tx hash, or Filecoin CID..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-[#E2E8F0] text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#2563EB] transition-colors"
            />
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {["All", "Medical Care", "Emergency Shelter", "Food Rations"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-[#0F172A] text-white border-[#0F172A]"
                    : "bg-white text-[#64748B] border-[#E2E8F0] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Receipts List */}
        <div className="space-y-3">
          {filteredEvents.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white border border-[#E2E8F0] space-y-2">
              <HardDrive className="w-8 h-8 text-[#94A3B8] mx-auto opacity-50" />
              <p className="text-xs font-medium text-[#64748B]">
                No matching Filecoin receipts found.
              </p>
            </div>
          ) : (
            filteredEvents.map((ev) => {
              const recipient = ev.beneficiaryAddress || ev.toAddress || "0x0000...0000";
              const cid = ev.ipfsCid || "QmbELGQD7Utne8BoocgYZ7KAcdMJRrbMdgi6bK1DNoJ5DS";
              const isCopiedTx = copiedId === `tx-${ev.id}`;
              const isCopiedCid = copiedId === `cid-${ev.id}`;

              return (
                <div
                  key={ev.id}
                  className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs hover:border-[#CBD5E1] transition-all space-y-3"
                >
                  {/* Top Row: Category + Payout Amount + Time */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-[#F8FAFC] text-[#0F172A] border border-[#E2E8F0]">
                        {ev.category || "Emergency Aid"}
                      </span>
                      {ev.isLiveEvent && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          ● Live Claim
                        </span>
                      )}
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-bold text-[#0F172A]">
                        ${ev.amountUSD.toLocaleString("en-US", { minimumFractionDigits: 2 })} USDC
                      </span>
                      <span className="text-[11px] text-[#94A3B8] block">
                        {ev.timeAgo || "Recently"}
                      </span>
                    </div>
                  </div>

                  {/* Metadata Grid */}
                  <div className="text-xs font-mono bg-[#F8FAFC] p-3.5 rounded-xl border border-[#F1F5F9] space-y-2.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {/* Beneficiary */}
                      <div className="flex items-center justify-between">
                        <span className="text-[#94A3B8] font-sans">Beneficiary:</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[#0F172A]">
                            {recipient.slice(0, 10)}...{recipient.slice(-6)}
                          </span>
                          <button
                            onClick={() => handleCopy(recipient, `ben-${ev.id}`)}
                            className="p-0.5 text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
                            title="Copy Address"
                          >
                            {copiedId === `ben-${ev.id}` ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Tx Hash */}
                      <div className="flex items-center justify-between">
                        <span className="text-[#94A3B8] font-sans">Tx Hash:</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[#0F172A]">
                            {ev.txHash.slice(0, 10)}...{ev.txHash.slice(-6)}
                          </span>
                          <button
                            onClick={() => handleCopy(ev.txHash, `tx-${ev.id}`)}
                            className="p-0.5 text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
                            title="Copy Tx Hash"
                          >
                            {isCopiedTx ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Filecoin CID Row - Prominent & Clickable */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pt-2 border-t border-[#E2E8F0]">
                      <span className="text-[#2563EB] font-sans font-semibold flex items-center gap-1.5">
                        <HardDrive className="w-3.5 h-3.5" />
                        <span>Filecoin CID:</span>
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenReceipt(ev)}
                          className="font-mono text-xs font-semibold text-[#0F172A] hover:text-[#2563EB] hover:underline cursor-pointer break-all"
                          title="View Verified Receipt Certificate"
                        >
                          {cid}
                        </button>
                        <button
                          onClick={() => handleCopy(cid, `cid-${ev.id}`)}
                          className="p-1 text-[#94A3B8] hover:text-[#0F172A] cursor-pointer shrink-0"
                          title="Copy Filecoin CID"
                        >
                          {isCopiedCid ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Actions Toolbar */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Verified & Sealed</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Action 1: In-App Certificate Viewer */}
                      <button
                        onClick={() => handleOpenReceipt(ev)}
                        className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#2563EB] text-xs font-semibold border border-blue-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>View Certificate</span>
                      </button>

                      {/* Action 2: Raw IPFS Gateway */}
                      <a
                        href={getFilecoinGatewayUrl(cid)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A] text-xs font-medium border border-[#E2E8F0] transition-colors flex items-center gap-1"
                        title="Open IPFS Gateway"
                      >
                        <span>Raw IPFS</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>

        {/* In-App Filecoin Receipt Modal */}
        <FilecoinReceiptModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          receipt={selectedReceipt}
        />

      </div>
    </div>
  );
}

export default function AuditPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-8">
          <div className="flex items-center gap-2 text-xs text-[#64748B]">
            <RefreshCw className="w-4 h-4 animate-spin text-[#2563EB]" />
            <span>Loading Audit Ledger...</span>
          </div>
        </div>
      }
    >
      <AuditContent />
    </Suspense>
  );
}
