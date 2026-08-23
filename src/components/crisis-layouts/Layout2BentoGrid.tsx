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
  FileCheck,
  Wallet,
  Lock,
  Sparkles,
  Zap,
  TrendingUp,
  Activity,
  Globe2,
  Clock,
  Compass,
} from "lucide-react";
import { LayoutProps, EthereumIcon, PolygonIcon } from "./types";

export default function Layout2BentoGrid(props: LayoutProps) {
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

  // Split posts into Hero and Bento Grid items
  const heroPost = posts[0];
  const gridPosts = posts.slice(1);

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 antialiased p-4 sm:p-8 space-y-8 font-sans">
      {/* Bento Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Crisis Intelligence Matrix</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Global Triage & Verified Aid Dispatch
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time multi-sensor telemetry with instantaneous gasless on-chain victim disbursements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-sm">
              {posts.length}
            </div>
            <div className="text-xs">
              <span className="font-bold text-white block">Active Zones</span>
              <span className="text-slate-500 text-[11px]">USGS &bull; EMSC &bull; NASA</span>
            </div>
          </div>
          <Link
            href="/audit"
            className="px-4 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-blue-600/20"
          >
            <span>Public Ledger</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {loading && posts.length === 0 ? (
        <div className="py-24 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto" />
          <p className="text-xs text-slate-400">Streaming crisis intelligence grid...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top Hero 2x2 Bento Card (For the highest urgency event) */}
          {heroPost && (
            <div className="rounded-3xl bg-gradient-to-br from-[#121A2D] via-[#0F172A] to-[#14122B] border border-blue-500/30 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
                <div className="lg:col-span-8 space-y-4">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping"></span>
                      Highest Urgency &bull; {heroPost.magnitude}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                      Source: {heroPost.source}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{heroPost.timeAgo}</span>
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                    {heroPost.headlineTitle}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {heroPost.fullDescription[0]}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                    <div className="flex items-center gap-2">
                      <img
                        src={heroPost.author.logoSrc}
                        alt={heroPost.author.name}
                        className="w-6 h-6 rounded-lg object-contain bg-slate-800 p-0.5"
                      />
                      <span className="font-semibold text-slate-200">{heroPost.author.name}</span>
                    </div>
                    <span>&bull;</span>
                    <span>Depth: <strong className="text-amber-300">{heroPost.depth}</strong></span>
                    <span>&bull;</span>
                    <span>Approved Aid: <strong className="text-emerald-400">+${getApprovedAidAmount(heroPost)} USDC</strong></span>
                  </div>
                </div>

                {/* Hero Actions Panel */}
                <div className="lg:col-span-4 p-5 rounded-2xl bg-slate-900/90 border border-slate-700/80 space-y-3.5 shadow-xl">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-bold text-slate-300">
                    <span>Rapid Action Dispatch</span>
                    <span className="text-emerald-400 font-mono">+${getApprovedAidAmount(heroPost)} USDC</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => toggleInlineDonate(heroPost.id)}
                      className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                    >
                      <Heart className="w-3.5 h-3.5 fill-white/20" />
                      <span>Donate</span>
                    </button>
                    <button
                      onClick={() => toggleInlineClaim(heroPost.id)}
                      className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Claim Aid</span>
                    </button>
                  </div>

                  {/* Inline Hero Donation/Claim Modals */}
                  {inlineDonateId === heroPost.id && (
                    <div className="pt-2 border-t border-slate-800 space-y-2">
                      <input
                        type="number"
                        min="1"
                        value={donateAmount}
                        onChange={(e) => setDonateAmount(e.target.value)}
                        placeholder="Amount in USD"
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs font-bold text-white focus:outline-none"
                      />
                      <button
                        onClick={() => handleConfirmDonation(heroPost)}
                        disabled={isSubmittingDonation || !donateAmount}
                        className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs disabled:opacity-50"
                      >
                        {isSubmittingDonation ? "Sending..." : `Confirm $${donateAmount || "0"} (${donateToken})`}
                      </button>
                    </div>
                  )}

                  {inlineClaimId === heroPost.id && (
                    <div className="pt-2 border-t border-slate-800 space-y-2">
                      <p className="text-[11px] text-slate-400">Zero-knowledge proof verification ready.</p>
                      <button
                        onClick={() => handleConfirmClaim(heroPost)}
                        disabled={isSubmittingClaim}
                        className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs disabled:opacity-50"
                      >
                        {isSubmittingClaim ? "Disbursing Aid..." : `Claim $${getApprovedAidAmount(heroPost)} USDC`}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Grid of Bento Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {gridPosts.map((post) => {
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
                  className="rounded-3xl bg-[#0F1626]/90 hover:bg-[#131C31] border border-slate-800/80 hover:border-slate-700 p-5 sm:p-6 transition-all shadow-lg hover:shadow-2xl space-y-4 flex flex-col justify-between group"
                >
                  <div className="space-y-3.5">
                    {/* Top Row */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={post.author.logoSrc}
                          alt={post.author.name}
                          className="w-9 h-9 rounded-xl object-contain bg-slate-900 border border-slate-800 p-1 shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-white block truncate">
                            {post.author.name}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {post.source} &bull; {post.timeAgo}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 ${
                          post.severityLevel === "CRITICAL"
                            ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                            : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        }`}
                      >
                        {post.magnitude}
                      </span>
                    </div>

                    {/* Headline */}
                    <h3 className="text-sm font-semibold text-slate-100 leading-snug group-hover:text-blue-300 transition-colors">
                      {post.headlineTitle}
                    </h3>

                    {/* Description preview */}
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {post.fullDescription[0]}
                    </p>

                    {/* Metric Pills */}
                    <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                      <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800/80">
                        <span className="text-slate-500 block text-[9px]">DEPTH</span>
                        <span className="text-slate-200 font-bold">{post.depth}</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800/80">
                        <span className="text-slate-500 block text-[9px]">GRANT AID</span>
                        <span className="text-emerald-400 font-bold">+${claimAmount} USDC</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Inline Drawers */}
                  <div className="space-y-3 pt-3 border-t border-slate-800/80">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleInlineDonate(post.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isDonating
                              ? "bg-slate-800 text-white"
                              : "bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20"
                          }`}
                        >
                          {isDonating ? "Close" : "Donate Aid"}
                        </button>

                        <button
                          onClick={() => toggleInlineClaim(post.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isClaiming
                              ? "bg-emerald-800 text-white"
                              : "bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/50"
                          }`}
                        >
                          {isClaiming ? "Close" : "Claim"}
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleCopyLink(post.id)}
                          className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white transition-colors"
                          title="Share"
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
                          className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-blue-400 transition-colors"
                          title="Official Sensor Source"
                        >
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>

                    {/* Inline Donation Form */}
                    {isDonating && (
                      <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 animate-in fade-in">
                        {isDonated ? (
                          <div className="text-center space-y-1 py-1">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" />
                            <p className="text-xs font-bold text-emerald-300">Donation Successful!</p>
                            {donationCids[post.id] && (
                              <Link
                                href={`/receipt?cid=${encodeURIComponent(donationCids[post.id])}`}
                                className="text-[11px] text-blue-400 hover:underline block"
                              >
                                View Filecoin Receipt →
                              </Link>
                            )}
                          </div>
                        ) : (
                          <>
                            <div className="flex gap-2">
                              <input
                                type="number"
                                min="1"
                                value={donateAmount}
                                onChange={(e) => setDonateAmount(e.target.value)}
                                placeholder="Amount USD"
                                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none"
                              />
                              <button
                                onClick={() => handleConfirmDonation(post)}
                                disabled={isSubmittingDonation || !donateAmount}
                                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold disabled:opacity-50 shrink-0"
                              >
                                {isSubmittingDonation ? "Sending..." : "Send"}
                              </button>
                            </div>
                            <div className="flex justify-between text-[10px] text-slate-400">
                              <span>Tokens:</span>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setDonateToken("ETH")}
                                  className={`font-bold ${donateToken === "ETH" ? "text-blue-400" : ""}`}
                                >
                                  ETH
                                </button>
                                <button
                                  onClick={() => setDonateToken("POL")}
                                  className={`font-bold ${donateToken === "POL" ? "text-purple-400" : ""}`}
                                >
                                  POL
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {/* Inline Claim Form */}
                    {isClaiming && (
                      <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-800/60 space-y-2 animate-in fade-in">
                        {isClaimed ? (
                          <div className="text-center space-y-1 py-1">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" />
                            <p className="text-xs font-bold text-emerald-200">Aid Claimed Successfully!</p>
                            {claimCids[post.id] && (
                              <Link
                                href={`/receipt?cid=${encodeURIComponent(claimCids[post.id])}`}
                                className="text-[11px] text-cyan-300 hover:underline block"
                              >
                                Sealed Filecoin Proof →
                              </Link>
                            )}
                          </div>
                        ) : (
                          <>
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-bold text-emerald-300">ZK Victim Grant</span>
                              <span className="font-mono font-bold text-emerald-400">+${claimAmount} USDC</span>
                            </div>
                            <button
                              onClick={() => handleConfirmClaim(post)}
                              disabled={isSubmittingClaim}
                              className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all disabled:opacity-50"
                            >
                              {isSubmittingClaim ? "Generating Proof..." : `Confirm Claim $${claimAmount}`}
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
