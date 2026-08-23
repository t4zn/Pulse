"use client";

import React from "react";
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
  Clock,
  Activity,
  AlertCircle,
  FileCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { LayoutProps, EthereumIcon, PolygonIcon } from "./types";

export default function Layout3ChronicleStream(props: LayoutProps) {
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

  return (
    <div className="min-h-screen bg-[#0A0D14] text-slate-100 antialiased p-4 sm:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Stream Header */}
        <div className="text-center space-y-2 py-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>Chronological Time-Stream</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Live Global Crisis Timeline
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Sequential disaster events tracked directly from seismic stations and earth observation satellites.
          </p>
        </div>

        {loading && posts.length === 0 ? (
          <div className="py-24 text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-amber-500 mx-auto" />
            <p className="text-xs text-slate-400">Loading chronological time nodes...</p>
          </div>
        ) : (
          <div className="relative pl-6 sm:pl-10 border-l-2 border-slate-800 space-y-8 my-6">
            {posts.map((post, idx) => {
              const isExpanded = expandedIds[post.id];
              const isDonating = inlineDonateId === post.id;
              const isClaiming = inlineClaimId === post.id;
              const isDonated = donationSuccessId === post.id;
              const isClaimed = claimSuccessId === post.id;
              const claimAmount = getApprovedAidAmount(post);

              return (
                <div key={post.id} id={post.id} className="relative group">
                  {/* Glowing Node on Timeline */}
                  <div
                    className={`absolute -left-[31px] sm:-left-[47px] top-4 w-6 sm:w-8 h-6 sm:h-8 rounded-full border-4 border-[#0A0D14] flex items-center justify-center shadow-lg transition-all ${
                      post.severityLevel === "CRITICAL"
                        ? "bg-rose-500 text-white shadow-rose-500/50"
                        : "bg-amber-500 text-black shadow-amber-500/40"
                    }`}
                  >
                    <span className="text-[9px] font-black">{idx + 1}</span>
                  </div>

                  {/* Timeline Event Card */}
                  <div className="rounded-2xl bg-[#111622] border border-slate-800/80 hover:border-slate-700 p-5 sm:p-6 transition-all shadow-xl space-y-4">
                    {/* Top Row with timestamp */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                      <div className="flex items-center gap-3">
                        <img
                          src={post.author.logoSrc}
                          alt={post.author.name}
                          className="w-9 h-9 rounded-xl object-contain bg-slate-900 border border-slate-700 p-1"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-white">{post.author.name}</span>
                            {post.author.verified && (
                              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {post.source} Sensor Stream
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 text-xs font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
                          <Clock className="w-3 h-3" />
                          {post.timeAgo}
                        </span>
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-black uppercase font-mono ${
                            post.severityLevel === "CRITICAL"
                              ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                              : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          }`}
                        >
                          {post.magnitude}
                        </span>
                      </div>
                    </div>

                    {/* Headline */}
                    <div className="space-y-2">
                      <h2 className="text-base font-bold text-slate-100 leading-snug">
                        {post.headlineTitle}
                      </h2>
                      <div className="text-xs text-slate-300 leading-relaxed space-y-2">
                        {isExpanded ? (
                          post.fullDescription.map((p, i) => (
                            <p key={i} className="text-slate-300">
                              {p}
                            </p>
                          ))
                        ) : (
                          <p className="text-slate-400 line-clamp-2">
                            {post.fullDescription[0]}
                          </p>
                        )}
                        <button
                          onClick={() => toggleExpand(post.id)}
                          className="text-amber-400 hover:text-amber-300 text-xs font-semibold inline-flex items-center gap-1 pt-1"
                        >
                          <span>{isExpanded ? "Collapse Record" : "Expand Full Field Report"}</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Metric strip */}
                    <div className="flex items-center gap-4 text-xs font-mono text-slate-400 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/60 flex-wrap">
                      <div>
                        <span>FOCAL DEPTH: </span>
                        <strong className="text-white">{post.depth}</strong>
                      </div>
                      <span>&bull;</span>
                      <div>
                        <span>SEVERITY SCORE: </span>
                        <strong className="text-amber-400">{post.significance}</strong>
                      </div>
                      <span>&bull;</span>
                      <div>
                        <span>ZK RELIEF GRANT: </span>
                        <strong className="text-emerald-400">+${claimAmount} USDC</strong>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-between gap-2 pt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleInlineDonate(post.id)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isDonating
                              ? "bg-slate-800 text-white"
                              : "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-md"
                          }`}
                        >
                          <Heart className="w-3.5 h-3.5 inline mr-1.5 fill-white/20" />
                          <span>{isDonating ? "Close" : "Donate Aid"}</span>
                        </button>

                        <button
                          onClick={() => toggleInlineClaim(post.id)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isClaiming
                              ? "bg-emerald-800 text-white"
                              : "bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-600/50"
                          }`}
                        >
                          <ShieldCheck className="w-3.5 h-3.5 inline mr-1.5" />
                          <span>{isClaiming ? "Close" : `Claim $${claimAmount}`}</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleCopyLink(post.id)}
                          className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
                          title="Share event link"
                        >
                          {copiedId === post.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Share2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <a
                          href={post.officialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-amber-400"
                          title="Official Sensor Source"
                        >
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>

                    {/* Inline Donation Box */}
                    {isDonating && (
                      <div className="p-3.5 rounded-2xl bg-slate-900 border border-amber-500/30 space-y-2 animate-in fade-in">
                        {isDonated ? (
                          <div className="text-center space-y-1 py-1">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" />
                            <p className="text-xs font-bold text-emerald-300">Donation Verified!</p>
                            {donationCids[post.id] && (
                              <Link
                                href={`/receipt?cid=${encodeURIComponent(donationCids[post.id])}`}
                                className="text-xs text-amber-400 hover:underline block"
                              >
                                View Filecoin Sealed Receipt →
                              </Link>
                            )}
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <input
                              type="number"
                              min="1"
                              value={donateAmount}
                              onChange={(e) => setDonateAmount(e.target.value)}
                              placeholder="Amount in USD"
                              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                            />
                            <button
                              onClick={() => handleConfirmDonation(post)}
                              disabled={isSubmittingDonation || !donateAmount}
                              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shrink-0 disabled:opacity-50"
                            >
                              {isSubmittingDonation ? "Sending..." : "Confirm"}
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Inline Claim Box */}
                    {isClaiming && (
                      <div className="p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-600/40 space-y-2 animate-in fade-in">
                        {isClaimed ? (
                          <div className="text-center space-y-1 py-1">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" />
                            <p className="text-xs font-bold text-emerald-200">Disbursed ${claimAmount} USDC!</p>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleConfirmClaim(post)}
                            disabled={isSubmittingClaim}
                            className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs disabled:opacity-50"
                          >
                            {isSubmittingClaim ? "Verifying ZK Merkle Proof..." : `Confirm Claim $${claimAmount} USDC`}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
