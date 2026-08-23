"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  Share2,
  Check,
  Layers,
  ArrowUpRight,
  Loader2,
  Heart,
  HardDrive,
  Terminal,
  TrendingUp,
  DollarSign,
  Zap,
  Activity,
  Maximize2,
} from "lucide-react";
import { LayoutProps, EthereumIcon, PolygonIcon } from "./types";

export default function Layout5BloombergTerminal(props: LayoutProps) {
  const {
    posts,
    loading,
    expandedIds,
    toggleExpand,
    inlineDonateId,
    inlineClaimId,
    toggleInlineDonate,
    toggleInlineClaim,
    donateAmount,
    setDonateAmount,
    donateToken,
    setDonateToken,
    isSubmittingDonation,
    donationSuccessId,
    donationCids,
    handleConfirmDonation,
    isSubmittingClaim,
    claimSuccessId,
    claimCids,
    claimStatusMsg,
    handleConfirmClaim,
    getCryptoEstimate,
    getApprovedAidAmount,
    handleCopyLink,
    copiedId,
    connectedAddress,
  } = props;

  const [activeRowId, setActiveRowId] = useState<string | null>(posts[0]?.id || null);
  const activePost = posts.find((p) => p.id === activeRowId) || posts[0];

  return (
    <div className="min-h-screen bg-[#07090E] text-[#E0A800] font-mono text-xs antialiased p-3 sm:p-6 space-y-4">
      {/* Bloomberg Header Bar */}
      <div className="border border-[#E0A800]/40 bg-[#0C101A] p-3 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-2 shadow-lg shadow-amber-950/30">
        <div className="flex items-center gap-3">
          <div className="px-2.5 py-1 bg-[#E0A800] text-black font-black text-xs rounded tracking-wider">
            BLOOMBERG // RELIEF DESK
          </div>
          <span className="text-white font-bold">EMERGENCY LIQUIDITY & DISBURSEMENT TERMINAL</span>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-slate-400">
          <div>
            ETH/USD: <span className="text-emerald-400 font-bold">$2,750.00</span>
          </div>
          <div>
            POL/USD: <span className="text-emerald-400 font-bold">$0.65</span>
          </div>
          <div>
            GAS: <span className="text-cyan-400 font-bold">0 GWEI (POLYGON RELAY)</span>
          </div>
        </div>
      </div>

      {loading && posts.length === 0 ? (
        <div className="py-24 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#E0A800] mx-auto" />
          <p className="tracking-widest uppercase">FETCHING REAL-TIME DISASTER TICKS...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Main High-Density Tabular Event Matrix (7 Cols) */}
          <div className="lg:col-span-7 border border-[#E0A800]/30 rounded-xl bg-[#090D15] p-3 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#E0A800]/20 text-white font-bold">
              <span>DISASTER EVENT ORDERBOOK ({posts.length})</span>
              <span className="text-[10px] text-slate-500">SELECT ROW FOR RAPID SETTLEMENT</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[10px] text-slate-400">
                    <th className="py-2 px-2">SEV</th>
                    <th className="py-2 px-2">MAG</th>
                    <th className="py-2 px-2">LOCATION / REGION</th>
                    <th className="py-2 px-2">DEPTH</th>
                    <th className="py-2 px-2">AID POOL</th>
                    <th className="py-2 px-2">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => {
                    const isSelected = post.id === activePost?.id;
                    const claimAmt = getApprovedAidAmount(post);

                    return (
                      <tr
                        key={post.id}
                        onClick={() => setActiveRowId(post.id)}
                        className={`border-b border-slate-900 cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-[#E0A800]/20 text-white"
                            : "hover:bg-slate-800/50 text-slate-300"
                        }`}
                      >
                        <td className="py-2.5 px-2">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                              post.severityLevel === "CRITICAL"
                                ? "bg-rose-950 text-rose-300 border border-rose-600"
                                : "bg-amber-950 text-amber-300 border border-amber-600"
                            }`}
                          >
                            {post.severityLevel.slice(0, 4)}
                          </span>
                        </td>
                        <td className="py-2.5 px-2 font-bold text-white">{post.magnitude}</td>
                        <td className="py-2.5 px-2 truncate max-w-[160px] font-sans">
                          {post.regionKey.toUpperCase()}
                        </td>
                        <td className="py-2.5 px-2 text-slate-400">{post.depth}</td>
                        <td className="py-2.5 px-2 font-bold text-emerald-400">
                          +${claimAmt}
                        </td>
                        <td className="py-2.5 px-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleInlineDonate(post.id);
                            }}
                            className="px-2 py-1 bg-[#E0A800] hover:bg-amber-400 text-black font-bold text-[10px] rounded cursor-pointer"
                          >
                            DISPATCH
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right: Active Event Dossier & Quick Execution Terminal (5 Cols) */}
          <div className="lg:col-span-5 border border-[#E0A800]/40 rounded-xl bg-[#0B0F19] p-4 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-white font-bold flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-[#E0A800]" />
                ACTIVE DISPATCH TERMINAL
              </span>
              <span className="text-[10px] text-slate-400">ID: {activePost?.id}</span>
            </div>

            {activePost && (
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-black/60 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-500">HEADLINE TELEMETRY</span>
                  <p className="text-white font-sans text-xs font-semibold leading-relaxed">
                    {activePost.headlineTitle}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 rounded bg-black/40 border border-slate-800">
                    <span className="text-[9px] text-slate-500 block">SOURCE / SENSOR</span>
                    <span className="text-white font-bold">{activePost.source} SENSOR</span>
                  </div>
                  <div className="p-2.5 rounded bg-black/40 border border-slate-800">
                    <span className="text-[9px] text-slate-500 block">TIME ELAPSED</span>
                    <span className="text-amber-400 font-bold">{activePost.timeAgo}</span>
                  </div>
                  <div className="p-2.5 rounded bg-black/40 border border-slate-800">
                    <span className="text-[9px] text-slate-500 block">AUTHORIZED NGO</span>
                    <span className="text-cyan-300 font-bold truncate block">{activePost.author.name}</span>
                  </div>
                  <div className="p-2.5 rounded bg-black/40 border border-slate-800">
                    <span className="text-[9px] text-slate-500 block">DISBURSEMENT AID</span>
                    <span className="text-emerald-400 font-bold">+${getApprovedAidAmount(activePost)} USDC</span>
                  </div>
                </div>

                {/* Direct Donation Terminal Input */}
                <div className="p-3.5 rounded-lg bg-black/80 border border-[#E0A800]/40 space-y-3">
                  <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider block">
                    1-CLICK AID VAULT EXECUTION
                  </span>

                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="1"
                      value={donateAmount}
                      onChange={(e) => setDonateAmount(e.target.value)}
                      placeholder="USD Value"
                      className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-[#E0A800]"
                    />

                    <button
                      onClick={() => handleConfirmDonation(activePost)}
                      disabled={isSubmittingDonation || !donateAmount}
                      className="px-4 py-2 bg-[#E0A800] hover:bg-amber-400 text-black font-bold text-xs rounded transition-all cursor-pointer disabled:opacity-50 shrink-0"
                    >
                      {isSubmittingDonation ? "SENDING..." : "EXECUTE"}
                    </button>
                  </div>

                  {donationSuccessId === activePost.id && (
                    <div className="p-2 rounded bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-[11px] text-center font-bold">
                      TRANSACTION SETTLED ON-CHAIN!
                    </div>
                  )}

                  {/* Gasless Claim Button */}
                  <button
                    onClick={() => handleConfirmClaim(activePost)}
                    disabled={isSubmittingClaim}
                    className="w-full py-2.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSubmittingClaim
                      ? "PROVING ZK MERKLE RELAY..."
                      : `CLAIM $${getApprovedAidAmount(activePost)} USDC (GASLESS)`}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
