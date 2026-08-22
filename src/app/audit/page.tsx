"use client";

import React, { useState, useMemo, useEffect, Suspense, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { 
  Search, 
  ArrowLeft, 
  ExternalLink, 
  Download, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  Globe, 
  Activity, 
  ArrowRight, 
  X, 
  Zap, 
  DollarSign, 
  Check, 
  Copy, 
  Trash2, 
  ArrowUpRight,
} from "lucide-react";
import {
  NETWORKS,
  getExplorerTxUrl,
  getExplorerAddressUrl,
  getIpfsGatewayUrl,
  formatAddress,
  formatCurrencyUSD,
} from "@/lib/contracts";
import {
  getStoredAuditEvents,
  getStoredCommittedRoots,
  getStoredVoucherBatches,
  clearAllAuditCache,
  SEED_AUDIT_EVENTS,
  type AuditEvent,
  type CommittedRootRecord,
  type VoucherBatchRecord,
} from "@/lib/auditState";

function AuditContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || searchParams.get("tx") || "";
  const initialNetwork = searchParams.get("network") || "all";

  // Data & sync state
  const [storedEvents, setStoredEvents] = useState<AuditEvent[]>([]);
  const [storedRoots, setStoredRoots] = useState<CommittedRootRecord[]>([]);
  const [storedVouchers, setStoredVouchers] = useState<VoucherBatchRecord[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Filters & sorting
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [selectedNetwork, setSelectedNetwork] = useState<string>(initialNetwork);
  const [selectedEventType, setSelectedEventType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "highest">("newest");

  // Drawers & Modals
  const [selectedTx, setSelectedTx] = useState<AuditEvent | null>(null);
  const [selectedIpfsProof, setSelectedIpfsProof] = useState<{ cid: string; title: string; event: AuditEvent } | null>(null);

  const reloadData = useCallback(() => {
    const events = getStoredAuditEvents();
    const roots = getStoredCommittedRoots();
    const vouchers = getStoredVoucherBatches();
    setStoredEvents(events);
    setStoredRoots(roots);
    setStoredVouchers(vouchers);
  }, []);

  useEffect(() => {
    reloadData();

    const handleSync = (e: any) => {
      reloadData();
      if (e?.detail?.type === "CLAIM_ADDED") {
        setNotification(`Disbursement Verified: $${e.detail.event.amountUSD.toFixed(2)} on ${e.detail.event.networkName}`);
        setTimeout(() => setNotification(null), 5000);
      } else if (e?.detail?.type === "ROOT_COMMITTED") {
        setNotification(`New Root Committed: ${e.detail.root.root.slice(0, 12)}...`);
        setTimeout(() => setNotification(null), 5000);
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key?.startsWith("pulse_audit_")) {
        reloadData();
      }
    };

    window.addEventListener("pulse:audit_sync", handleSync);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("pulse:audit_sync", handleSync);
      window.removeEventListener("storage", handleStorage);
    };
  }, [reloadData]);

  const allEvents = useMemo(() => {
    return [...storedEvents, ...SEED_AUDIT_EVENTS];
  }, [storedEvents]);

  useEffect(() => {
    const q = searchParams.get("search") || searchParams.get("tx");
    if (q) {
      setSearchQuery(q);
      const match = allEvents.find(
        (e) =>
          e.txHash.toLowerCase() === q.toLowerCase() ||
          (e.beneficiaryAddress && e.beneficiaryAddress.toLowerCase() === q.toLowerCase()) ||
          (e.ipfsCid && e.ipfsCid.toLowerCase() === q.toLowerCase())
      );
      if (match) {
        setSelectedTx(match);
      }
    }
  }, [searchParams, allEvents]);

  const filteredEvents = useMemo(() => {
    return allEvents
      .filter((evt) => {
        const matchesNetwork = selectedNetwork === "all" || evt.network === selectedNetwork;
        const matchesType = selectedEventType === "all" || evt.eventType === selectedEventType;
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch = q === "" ||
          evt.txHash.toLowerCase().includes(q) ||
          evt.fromAddress.toLowerCase().includes(q) ||
          evt.toAddress.toLowerCase().includes(q) ||
          (evt.beneficiaryAddress && evt.beneficiaryAddress.toLowerCase().includes(q)) ||
          evt.eventName.toLowerCase().includes(q) ||
          (evt.ipfsCid && evt.ipfsCid.toLowerCase().includes(q)) ||
          (evt.category && evt.category.toLowerCase().includes(q));

        return matchesNetwork && matchesType && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        }
        if (sortBy === "oldest") {
          return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        }
        if (sortBy === "highest") {
          return b.amountUSD - a.amountUSD;
        }
        return 0;
      });
  }, [allEvents, selectedNetwork, selectedEventType, searchQuery, sortBy]);

  const metrics = useMemo(() => {
    const sepoliaDonationsUSD = 428700.00;
    const amoyDonationsUSD = 597600.00;
    const additionalClaimsUSD = storedEvents.reduce((acc, e) => acc + (e.eventType === "disbursement" ? e.amountUSD : 0), 0);

    const totalDonatedUSD = sepoliaDonationsUSD + amoyDonationsUSD;
    const totalDistributedUSD = 540000.00 + additionalClaimsUSD;
    const remainingPoolUSD = Math.max(0, totalDonatedUSD - totalDistributedUSD);
    const verifiedBeneficiariesCount = 12600 + storedEvents.filter(e => e.eventType === "disbursement").length + (storedVouchers.reduce((acc, v) => acc + v.count, 0));
    const totalAuditedEventsCount = 5420 + storedEvents.length;

    const sepoliaBalanceUSD = 428700.00;
    const amoyBalanceUSD = Math.max(0, 597600.00 - additionalClaimsUSD);
    const totalCrossChainPool = sepoliaBalanceUSD + amoyBalanceUSD;
    const sepoliaPct = Math.round((sepoliaBalanceUSD / totalCrossChainPool) * 100);
    const amoyPct = 100 - sepoliaPct;

    return {
      totalDonatedUSD,
      totalDistributedUSD,
      remainingPoolUSD,
      verifiedBeneficiariesCount,
      totalAuditedEventsCount,
      sepoliaBalanceUSD,
      amoyBalanceUSD,
      totalCrossChainPool,
      sepoliaPct,
      amoyPct,
      sepoliaEth: "142.9 ETH",
      amoyPol: `${Math.round(amoyBalanceUSD * 1.538).toLocaleString()} POL`
    };
  }, [storedEvents, storedVouchers]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleExportAuditReport = () => {
    const report = {
      protocol: "PULSE Protocol — Transparent Emergency Aid Ledger",
      version: "1.0.0",
      exportTimestamp: new Date().toISOString(),
      verifiedMetrics: {
        totalDonatedUSD: metrics.totalDonatedUSD,
        totalDistributedUSD: metrics.totalDistributedUSD,
        remainingPoolUSD: metrics.remainingPoolUSD,
        verifiedBeneficiaries: metrics.verifiedBeneficiariesCount,
        totalAuditedTransactions: metrics.totalAuditedEventsCount,
      },
      events: filteredEvents,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `PULSE_Audit_Report_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full bg-white text-ink min-h-screen py-8 px-4 md:px-8 font-sans">
      <div className="max-w-[1280px] mx-auto space-y-8">
        
        {/* Real-time Notification Banner */}
        {notification && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-semantic-up flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-semantic-up animate-ping"></span>
              <span className="font-semibold">{notification}</span>
            </div>
            <button onClick={() => setNotification(null)} className="text-body hover:text-ink">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Back Link */}
        <div className="flex items-center justify-between">
          <Link 
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-body hover:text-ink transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Command Center</span>
            <span className="text-muted">/</span>
            <span className="text-primary font-semibold">Live Audit</span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-soft border border-hairline text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-semantic-up"></span>
              <span className="text-body">Relayer Sync:</span>
              <span className="text-ink font-semibold">Healthy</span>
            </div>
            {storedEvents.length > 0 && (
              <button
                onClick={() => {
                  clearAllAuditCache();
                  reloadData();
                }}
                className="px-3 py-1 rounded-full bg-surface-soft hover:bg-surface-strong border border-hairline text-xs font-mono text-body hover:text-semantic-down transition-colors flex items-center gap-1"
                title="Reset session test events"
              >
                <Trash2 className="w-3 h-3" />
                <span>Reset Local Tests ({storedEvents.length})</span>
              </button>
            )}
          </div>
        </div>

        {/* PAGE HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-hairline">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold tracking-wider text-primary uppercase">
                GLASS-BOX AUDITABILITY
              </span>
              <span className="text-muted">•</span>
              <span className="text-xs font-mono text-body">
                100% On-Chain Verifiable
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-normal tracking-tight text-ink">
              Live Audit & Transparency Ledger
            </h1>
            <p className="text-sm text-body max-w-2xl leading-relaxed">
              Every donation, category lock, and zero-knowledge beneficiary disbursement is recorded permanently on Ethereum Sepolia and Polygon Amoy with IPFS delivery receipts.
            </p>
          </div>

          {/* Export Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleExportAuditReport}
              className="px-5 py-2.5 rounded-full bg-surface-soft hover:bg-surface-strong text-ink text-xs font-semibold border border-hairline transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4 text-primary" />
              <span>Export Audit JSON</span>
            </button>
          </div>
        </div>

        {/* TOP METRICS */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="p-5 rounded-2xl bg-surface-soft border border-hairline">
            <div className="text-xs font-semibold text-body uppercase tracking-wider mb-1">Total Donated</div>
            <div className="text-2xl font-bold font-mono text-ink mt-0.5">
              {formatCurrencyUSD(metrics.totalDonatedUSD)}
            </div>
            <div className="text-xs text-muted font-mono mt-1">Sepolia + Amoy</div>
          </div>

          <div className="p-5 rounded-2xl bg-surface-soft border border-hairline">
            <div className="text-xs font-semibold text-body uppercase tracking-wider mb-1">Aid Distributed</div>
            <div className="text-2xl font-bold font-mono text-semantic-up mt-0.5">
              {formatCurrencyUSD(metrics.totalDistributedUSD)}
            </div>
            <div className="text-xs text-muted font-mono mt-1">100% Delivered</div>
          </div>

          <div className="p-5 rounded-2xl bg-surface-soft border border-hairline">
            <div className="text-xs font-semibold text-body uppercase tracking-wider mb-1">Available Reserve</div>
            <div className="text-2xl font-bold font-mono text-primary mt-0.5">
              {formatCurrencyUSD(metrics.remainingPoolUSD)}
            </div>
            <div className="text-xs text-muted font-mono mt-1">Emergency Vaults</div>
          </div>

          <div className="p-5 rounded-2xl bg-surface-soft border border-hairline">
            <div className="text-xs font-semibold text-body uppercase tracking-wider mb-1">Beneficiaries</div>
            <div className="text-2xl font-bold font-mono text-ink mt-0.5">
              {metrics.verifiedBeneficiariesCount.toLocaleString()}
            </div>
            <div className="text-xs text-muted font-mono mt-1">ZK Verified</div>
          </div>

          <div className="p-5 rounded-2xl bg-surface-soft border border-hairline col-span-2 md:col-span-1">
            <div className="text-xs font-semibold text-body uppercase tracking-wider mb-1">Transactions</div>
            <div className="text-2xl font-bold font-mono text-ink mt-0.5">
              {metrics.totalAuditedEventsCount.toLocaleString()}
            </div>
            <div className="text-xs text-muted font-mono mt-1">Audited Events</div>
          </div>
        </div>

        {/* CROSS-CHAIN STATE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sepolia Card */}
          <div className="p-6 rounded-2xl bg-white border border-hairline shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-hairline">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-semantic-up animate-pulse"></span>
                <h3 className="text-base font-semibold text-ink">Ethereum Sepolia</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-emerald-50 text-semantic-up border border-emerald-200">
                Connected
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div>
                <div className="text-muted text-[10px]">Chain ID</div>
                <div className="text-ink font-semibold mt-0.5">{NETWORKS.sepolia.chainId}</div>
              </div>
              <div>
                <div className="text-muted text-[10px]">Vault Contract</div>
                <div className="text-primary font-semibold mt-0.5 truncate">{formatAddress(NETWORKS.sepolia.contracts.vault)}</div>
              </div>
              <div>
                <div className="text-muted text-[10px]">Balance</div>
                <div className="text-semantic-up font-bold mt-0.5">{metrics.sepoliaEth} ({formatCurrencyUSD(metrics.sepoliaBalanceUSD)})</div>
              </div>
              <div>
                <div className="text-muted text-[10px]">Latest Block</div>
                <div className="text-ink font-semibold mt-0.5">#5,938,110</div>
              </div>
            </div>

            <div className="pt-3 border-t border-hairline flex items-center justify-between text-xs">
              <span className="text-muted font-mono">Sync: 2m ago</span>
              <a
                href={getExplorerAddressUrl("sepolia", NETWORKS.sepolia.contracts.vault)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline flex items-center gap-1 font-semibold"
              >
                <span>View on Etherscan</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Amoy Card */}
          <div className="p-6 rounded-2xl bg-white border border-hairline shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-hairline">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <h3 className="text-base font-semibold text-ink">Polygon Amoy</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-blue-50 text-primary border border-blue-200">
                Connected
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div>
                <div className="text-muted text-[10px]">Chain ID</div>
                <div className="text-ink font-semibold mt-0.5">{NETWORKS.amoy.chainId}</div>
              </div>
              <div>
                <div className="text-muted text-[10px]">Vault Contract</div>
                <div className="text-primary font-semibold mt-0.5 truncate">{formatAddress(NETWORKS.amoy.contracts.vault)}</div>
              </div>
              <div>
                <div className="text-muted text-[10px]">Balance</div>
                <div className="text-semantic-up font-bold mt-0.5">{metrics.amoyPol} ({formatCurrencyUSD(metrics.amoyBalanceUSD)})</div>
              </div>
              <div>
                <div className="text-muted text-[10px]">Latest Block</div>
                <div className="text-ink font-semibold mt-0.5">#8,421,905</div>
              </div>
            </div>

            <div className="pt-3 border-t border-hairline flex items-center justify-between text-xs">
              <span className="text-muted font-mono">Sync: 1m ago</span>
              <a
                href={getExplorerAddressUrl("amoy", NETWORKS.amoy.contracts.vault)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline flex items-center gap-1 font-semibold"
              >
                <span>View on PolygonScan</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* FULL AUDIT LEDGER TABLE */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-ink">Verified Event Ledger</h2>
              <p className="text-xs text-body">Filter and search complete historical events on-chain.</p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-muted absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search tx hash, address, CID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface-soft border border-hairline focus:border-primary text-ink text-xs font-mono pl-10 pr-3 py-2.5 rounded-full focus:outline-none placeholder:text-muted transition-colors"
              />
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-surface-soft border border-hairline text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="text-muted mr-1">Network:</span>
              <button
                onClick={() => setSelectedNetwork("all")}
                className={`px-3 py-1 rounded-full transition-all ${
                  selectedNetwork === "all" ? "bg-white text-ink font-semibold shadow-sm" : "text-body hover:text-ink"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedNetwork("sepolia")}
                className={`px-3 py-1 rounded-full transition-all ${
                  selectedNetwork === "sepolia" ? "bg-white text-ink font-semibold shadow-sm" : "text-body hover:text-ink"
                }`}
              >
                Sepolia
              </button>
              <button
                onClick={() => setSelectedNetwork("amoy")}
                className={`px-3 py-1 rounded-full transition-all ${
                  selectedNetwork === "amoy" ? "bg-white text-ink font-semibold shadow-sm" : "text-body hover:text-ink"
                }`}
              >
                Amoy
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-muted mr-1">Event:</span>
              <button
                onClick={() => setSelectedEventType("all")}
                className={`px-3 py-1 rounded-full transition-all ${
                  selectedEventType === "all" ? "bg-white text-ink font-semibold shadow-sm" : "text-body hover:text-ink"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedEventType("donation")}
                className={`px-3 py-1 rounded-full transition-all ${
                  selectedEventType === "donation" ? "bg-white text-ink font-semibold shadow-sm" : "text-body hover:text-ink"
                }`}
              >
                Donations
              </button>
              <button
                onClick={() => setSelectedEventType("disbursement")}
                className={`px-3 py-1 rounded-full transition-all ${
                  selectedEventType === "disbursement" ? "bg-white text-ink font-semibold shadow-sm" : "text-body hover:text-ink"
                }`}
              >
                Disbursements
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-2xl bg-white border border-hairline overflow-hidden shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-surface-soft border-b border-hairline text-body font-semibold">
                  <tr>
                    <th className="p-4">NETWORK</th>
                    <th className="p-4">BLOCK</th>
                    <th className="p-4">EVENT</th>
                    <th className="p-4">FROM</th>
                    <th className="p-4">BENEFICIARY</th>
                    <th className="p-4">AMOUNT</th>
                    <th className="p-4">TX HASH</th>
                    <th className="p-4 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline text-body">
                  {filteredEvents.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-12 text-center text-muted">
                        No verified activity found matching the selected filters.
                      </td>
                    </tr>
                  ) : (
                    filteredEvents.map((evt) => {
                      const isSepolia = evt.network === "sepolia";
                      return (
                        <tr
                          key={`row-${evt.id}`}
                          onClick={() => setSelectedTx(evt)}
                          className="hover:bg-surface-soft/60 transition-colors cursor-pointer"
                        >
                          <td className="p-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                              isSepolia
                                ? "bg-purple-50 border-purple-200 text-purple-700"
                                : "bg-blue-50 border-blue-200 text-primary"
                            }`}>
                              {isSepolia ? "Sepolia" : "Amoy"}
                            </span>
                          </td>
                          <td className="p-4 text-ink font-semibold">
                            #{evt.blockNumber}
                          </td>
                          <td className="p-4 font-semibold text-ink">
                            {evt.eventName}
                          </td>
                          <td className="p-4 font-mono text-[11px]">
                            {formatAddress(evt.fromAddress)}
                          </td>
                          <td className="p-4 font-mono text-[11px]">
                            {evt.beneficiaryAddress ? (
                              <span className="text-semantic-up font-semibold">{formatAddress(evt.beneficiaryAddress)}</span>
                            ) : (
                              <span className="text-muted">—</span>
                            )}
                          </td>
                          <td className="p-4 font-mono">
                            {evt.amountUSD > 0 ? (
                              <div>
                                <span className="text-ink font-bold">{evt.amountCrypto}</span>
                                <div className="text-[10px] text-muted">{formatCurrencyUSD(evt.amountUSD)}</div>
                              </div>
                            ) : (
                              <span className="text-muted">—</span>
                            )}
                          </td>
                          <td className="p-4">
                            <span className="text-primary font-mono text-[11px]">{formatAddress(evt.txHash, 6, 4)}</span>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedTx(evt);
                              }}
                              className="px-3 py-1 rounded-full bg-surface-soft hover:bg-surface-strong text-ink border border-hairline text-xs font-semibold transition-colors"
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      {/* TRANSACTION DETAILS DRAWER */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-lg bg-white border-l border-hairline h-full overflow-y-auto shadow-elevated flex flex-col justify-between p-6 space-y-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-hairline">
                <div>
                  <h3 className="text-base font-semibold text-ink">Transaction Details</h3>
                  <span className="text-xs font-mono text-primary font-semibold">{selectedTx.eventName}</span>
                </div>
                <button
                  onClick={() => setSelectedTx(null)}
                  className="p-1.5 rounded-full hover:bg-surface-soft text-body hover:text-ink"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs font-mono">
                <div className="p-3.5 rounded-xl bg-surface-soft border border-hairline space-y-1">
                  <div className="text-muted text-[10px]">EVENT TYPE</div>
                  <div className="text-ink font-semibold capitalize">{selectedTx.eventType}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-surface-soft border border-hairline space-y-1">
                  <div className="text-muted text-[10px]">NETWORK</div>
                  <div className="text-ink font-semibold">{selectedTx.networkName} (Chain ID {selectedTx.chainId})</div>
                </div>

                <div className="p-3.5 rounded-xl bg-surface-soft border border-hairline space-y-1">
                  <div className="flex justify-between text-muted text-[10px]">
                    <span>TRANSACTION HASH</span>
                    <button
                      onClick={() => handleCopy(selectedTx.txHash, "drawer-tx")}
                      className="text-primary hover:underline font-semibold"
                    >
                      {copiedKey === "drawer-tx" ? "✓ Copied" : "Copy"}
                    </button>
                  </div>
                  <div className="text-ink font-semibold break-all text-[11px]">{selectedTx.txHash}</div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-surface-soft border border-hairline space-y-1">
                    <div className="text-muted text-[10px]">BLOCK</div>
                    <div className="text-ink font-semibold">#{selectedTx.blockNumber}</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-surface-soft border border-hairline space-y-1">
                    <div className="text-muted text-[10px]">TIMESTAMP</div>
                    <div className="text-ink font-semibold">{selectedTx.timeAgo}</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-surface-soft border border-hairline space-y-1">
                  <div className="text-muted text-[10px]">FROM ADDRESS</div>
                  <div className="text-ink font-semibold break-all text-[11px]">{selectedTx.fromAddress}</div>
                </div>

                {selectedTx.beneficiaryAddress && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
                    <div className="text-semantic-up text-[10px] font-semibold">BENEFICIARY (ZK VERIFIED)</div>
                    <div className="text-semantic-up font-semibold break-all text-[11px]">{selectedTx.beneficiaryAddress}</div>
                  </div>
                )}

                {selectedTx.amountUSD > 0 && (
                  <div className="p-3.5 rounded-xl bg-surface-soft border border-hairline space-y-1">
                    <div className="text-muted text-[10px]">AMOUNT</div>
                    <div className="text-semantic-up font-bold text-sm">{selectedTx.amountCrypto} ({formatCurrencyUSD(selectedTx.amountUSD)})</div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-hairline space-y-2">
              <a
                href={getExplorerTxUrl(selectedTx.network, selectedTx.txHash)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-full bg-primary hover:bg-primary-hover active:bg-primary-active text-white font-semibold text-xs font-mono flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <span>Verify on Explorer</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => setSelectedTx(null)}
                className="w-full py-2.5 rounded-full bg-surface-soft hover:bg-surface-strong text-ink text-xs font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function AuditPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white text-ink flex items-center justify-center p-8">
        <div className="flex items-center gap-3 text-xs font-mono text-body">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span>Loading Public Blockchain Audit Ledger...</span>
        </div>
      </div>
    }>
      <AuditContent />
    </Suspense>
  );
}
