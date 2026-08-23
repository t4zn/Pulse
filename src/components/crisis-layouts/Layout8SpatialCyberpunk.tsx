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
  ExternalLink,
  Sparkles,
  Zap,
  Radio,
  Activity,
  Cpu,
} from "lucide-react";
import { LayoutProps, EthereumIcon, PolygonIcon } from "./types";

export default function Layout8SpatialCyberpunk(props: LayoutProps) {
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
    <div className="min-h-screen bg-[#06040A] text-slate-100 antialiased p-4 sm:p-8 relative overflow-hidden font-sans">
      {/* Neon Ambient Background Glows */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-pink-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* Cyber Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-500/20 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold mb-2">
              <Cpu className="w-3.5 h-3.5" />
              <span>SPATIAL GLASSMORPHIC NODE</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">
              Cyberpunk Disaster Matrix
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <span className="text-slate-300">Neural Telemetry Synced</span>
            </div>
          </div>
        </div>

        {loading && posts.length === 0 ? (
          <div className="py-24 text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-purple-400 mx-auto" />
            <p className="text-xs text-purple-300">Synthesizing holographic grid...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => {
              const isExpanded = expandedIds[post.id];
              const isDonating = inlineDonateId === post.id;
              const isClaiming = inlineClaimId === post.id;
              const isDonated = donationSuccessId === post.id;
              const isClaimed = claimSuccessId === post.id;
              const claimAmount = getApprovedAidAmount(post);

              return (
                <div
                  key={post.id}
                  id={post.id}
                  className="rounded-3xl bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-2xl border border-white/10 hover:border-purple-500/50 p-6 transition-all duration-300 shadow-2xl hover:shadow-purple-500/20 space-y-5 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    {/* Top Row with Glass Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={post.author.logoSrc}
                          alt={post.author.name}
                          className="w-10 h-10 rounded-2xl object-contain bg-black/40 border border-white/10 p-1.5 shadow-lg"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                              {post.author.name}
                            </span>
                            {post.author.verified && (
                              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {post.source} &bull; {post.timeAgo}
                          </span>
                        </div>
                      </div>

                      <div
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase font-mono tracking-wider shadow-lg ${
                          post.severityLevel === "CRITICAL"
                            ? "bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-rose-600/30"
                            : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-purple-600/30"
                        }`}
                      >
                        {post.magnitude}
                      </div>
                    </div>

                    {/* Headline */}
                    <h3 className="text-sm font-semibold text-slate-100 leading-snug">
                      {post.headlineTitle}
                    </h3>

                    {/* Description preview */}
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {post.fullDescription[0]}
                    </p>

                    {/* Cyber Audio / Seismic Frequency Bars */}
                    <div className="p-3 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-purple-300">SEISMIC FREQUENCY:</span>
                      <div className="flex items-end gap-1 h-4">
                        <span className="w-1 bg-cyan-400 h-2 rounded-full animate-pulse"></span>
                        <span className="w-1 bg-purple-400 h-4 rounded-full animate-pulse delay-75"></span>
                        <span className="w-1 bg-pink-400 h-3 rounded-full animate-pulse delay-150"></span>
                        <span className="w-1 bg-cyan-400 h-4 rounded-full animate-pulse"></span>
                        <span className="w-1 bg-purple-400 h-2 rounded-full animate-pulse delay-100"></span>
                      </div>
                    </div>
                  </div>

                  {/* Action Bars & Drawers */}
                  <div className="space-y-3 pt-3 border-t border-white/10">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleInlineDonate(post.id)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-lg ${
                            isDonating
                              ? "bg-white/20 text-white"
                              : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-purple-600/30"
                          }`}
                        >
                          <Heart className="w-3 h-3 inline mr-1 fill-white/20" />
                          <span>{isDonating ? "Close" : "Donate Aid"}</span>
                        </button>

                        <button
                          onClick={() => toggleInlineClaim(post.id)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isClaiming
                              ? "bg-emerald-800 text-white"
                              : "bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40"
                          }`}
                        >
                          <ShieldCheck className="w-3 h-3 inline mr-1" />
                          <span>{isClaiming ? "Close" : `Claim $${claimAmount}`}</span>
                        </button>
                      </div>

                      <button
                        onClick={() => handleCopyLink(post.id)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Inline Donation Box */}
                    {isDonating && (
                      <div className="p-3.5 rounded-2xl bg-black/80 border border-purple-500/40 space-y-2 animate-in fade-in">
                        {isDonated ? (
                          <p className="text-xs font-bold text-emerald-300 text-center">
                            Donation Confirmed on Filecoin!
                          </p>
                        ) : (
                          <div className="flex gap-2">
                            <input
                              type="number"
                              min="1"
                              value={donateAmount}
                              onChange={(e) => setDonateAmount(e.target.value)}
                              placeholder="Amount USD"
                              className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                            />
                            <button
                              onClick={() => handleConfirmDonation(post)}
                              disabled={isSubmittingDonation || !donateAmount}
                              className="px-3 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-bold shrink-0 disabled:opacity-50"
                            >
                              Send
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Inline Claim Box */}
                    {isClaiming && (
                      <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-600/40 space-y-2 animate-in fade-in">
                        {isClaimed ? (
                          <p className="text-xs font-bold text-emerald-300 text-center">
                            Disbursed ${claimAmount} USDC!
                          </p>
                        ) : (
                          <button
                            onClick={() => handleConfirmClaim(post)}
                            disabled={isSubmittingClaim}
                            className="w-full py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs disabled:opacity-50"
                          >
                            Disburse ${claimAmount} USDC
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
