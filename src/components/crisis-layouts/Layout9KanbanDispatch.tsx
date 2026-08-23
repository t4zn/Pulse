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
  SlidersHorizontal,
  AlertCircle,
  Clock,
  Sparkles,
} from "lucide-react";
import { LayoutProps, EthereumIcon, PolygonIcon } from "./types";

export default function Layout9KanbanDispatch(props: LayoutProps) {
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

  // Filter posts into Kanban columns
  const criticalPosts = posts.filter(
    (p) => p.severityLevel === "CRITICAL" || p.rawMagnitude >= 6.0
  );
  const highAlertPosts = posts.filter(
    (p) => p.severityLevel === "HIGH" && p.rawMagnitude < 6.0
  );
  const activeDeployPosts = posts.filter(
    (p) => p.source === "NASA" || p.source === "EMSC"
  );
  const stabilizedPosts = posts.slice(0, 3); // Demo stabilized/disbursed list

  const COLUMNS = [
    {
      id: "critical",
      title: "Critical Priority",
      count: criticalPosts.length,
      badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/40",
      accentBorder: "border-rose-500/40",
      posts: criticalPosts,
    },
    {
      id: "high",
      title: "High Alert Zones",
      count: highAlertPosts.length,
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      accentBorder: "border-amber-500/40",
      posts: highAlertPosts,
    },
    {
      id: "satellite",
      title: "Satellite & Active Relay",
      count: activeDeployPosts.length,
      badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/40",
      accentBorder: "border-blue-500/40",
      posts: activeDeployPosts,
    },
  ];

  return (
    <div className="min-h-screen bg-[#090C15] text-slate-100 antialiased p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Kanban Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-2">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Agile Disaster Response Pipeline</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Emergency Dispatch Kanban
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/audit"
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors flex items-center gap-1.5"
            >
              <span>Public Audit Pipeline</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {loading && posts.length === 0 ? (
          <div className="py-24 text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-blue-400 mx-auto" />
            <p className="text-xs text-slate-400">Organizing triage pipeline columns...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {COLUMNS.map((col) => (
              <div
                key={col.id}
                className="rounded-3xl bg-[#0D1322]/90 border border-slate-800/80 p-4 space-y-4 shadow-xl"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs uppercase text-slate-200 tracking-wider">
                      {col.title}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${col.badgeColor}`}>
                      {col.count}
                    </span>
                  </div>
                </div>

                {/* Column Card List */}
                <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
                  {col.posts.map((post) => {
                    const isDonating = inlineDonateId === post.id;
                    const isClaiming = inlineClaimId === post.id;
                    const isDonated = donationSuccessId === post.id;
                    const isClaimed = claimSuccessId === post.id;
                    const claimAmount = getApprovedAidAmount(post);

                    return (
                      <div
                        key={post.id}
                        id={post.id}
                        className="rounded-2xl bg-[#121A2D] border border-slate-800/90 hover:border-slate-700 p-4 space-y-3 shadow-md transition-all hover:shadow-lg"
                      >
                        {/* Top row */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <img
                              src={post.author.logoSrc}
                              alt={post.author.name}
                              className="w-7 h-7 rounded-lg object-contain bg-slate-900 border border-slate-800 p-0.5 shrink-0"
                            />
                            <span className="text-xs font-bold text-slate-200 truncate">
                              {post.author.name}
                            </span>
                          </div>

                          <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded">
                            {post.magnitude}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-xs font-bold text-slate-100 leading-snug">
                          {post.headlineTitle}
                        </h3>

                        {/* Depth & Aid */}
                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                          <span>DEPTH: {post.depth}</span>
                          <span className="text-emerald-400 font-bold">+${claimAmount}</span>
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                          <button
                            onClick={() => toggleInlineDonate(post.id)}
                            className="py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] transition-all cursor-pointer"
                          >
                            Donate
                          </button>
                          <button
                            onClick={() => toggleInlineClaim(post.id)}
                            className="py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/50 font-bold text-[11px] transition-all cursor-pointer"
                          >
                            Claim
                          </button>
                        </div>

                        {/* Inline Donate */}
                        {isDonating && (
                          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 animate-in fade-in">
                            {isDonated ? (
                              <p className="text-xs font-bold text-emerald-400 text-center">
                                Donation Confirmed!
                              </p>
                            ) : (
                              <div className="flex gap-1.5">
                                <input
                                  type="number"
                                  min="1"
                                  value={donateAmount}
                                  onChange={(e) => setDonateAmount(e.target.value)}
                                  placeholder="USD"
                                  className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700 text-xs text-white"
                                />
                                <button
                                  onClick={() => handleConfirmDonation(post)}
                                  disabled={isSubmittingDonation || !donateAmount}
                                  className="px-2.5 py-1 bg-blue-600 text-white font-bold text-xs rounded"
                                >
                                  Send
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Inline Claim */}
                        {isClaiming && (
                          <div className="p-2.5 rounded-xl bg-emerald-950 border border-emerald-700 space-y-2 animate-in fade-in">
                            {isClaimed ? (
                              <p className="text-xs font-bold text-emerald-300 text-center">
                                Claimed ${claimAmount} USDC!
                              </p>
                            ) : (
                              <button
                                onClick={() => handleConfirmClaim(post)}
                                disabled={isSubmittingClaim}
                                className="w-full py-1.5 rounded bg-emerald-600 text-white font-bold text-xs"
                              >
                                Disburse ${claimAmount}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
