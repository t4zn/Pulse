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
  ChevronLeft,
  ChevronRight,
  Flame,
  Zap,
  Sparkles,
  RotateCw,
} from "lucide-react";
import { LayoutProps, EthereumIcon, PolygonIcon } from "./types";

export default function Layout7SwiperRescueDeck(props: LayoutProps) {
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

  const [currentIndex, setCurrentIndex] = useState(0);

  const activePost = posts[currentIndex] || posts[0];

  const handleNext = () => {
    if (currentIndex < posts.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(posts.length - 1);
    }
  };

  const isDonating = inlineDonateId === activePost?.id;
  const isClaiming = inlineClaimId === activePost?.id;
  const isDonated = donationSuccessId === activePost?.id;
  const isClaimed = claimSuccessId === activePost?.id;
  const claimAmount = activePost ? getApprovedAidAmount(activePost) : "250";

  return (
    <div className="min-h-screen bg-[#080B11] text-slate-100 antialiased p-4 sm:p-8 flex flex-col items-center justify-center font-sans">
      <div className="w-full max-w-xl space-y-6">
        {/* Top Deck Counter */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse"></span>
            <span className="font-bold text-white uppercase tracking-wider">SWIPER RESCUE DECK</span>
          </div>

          <div className="font-mono text-xs font-bold text-pink-400 bg-pink-950/80 px-3 py-1 rounded-full border border-pink-700/50">
            INCIDENT {currentIndex + 1} OF {posts.length}
          </div>
        </div>

        {loading && posts.length === 0 ? (
          <div className="py-24 text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-pink-500 mx-auto" />
            <p className="text-xs text-slate-400">Shuffling rescue deck cards...</p>
          </div>
        ) : (
          activePost && (
            <div className="relative">
              {/* Stacked background card effect */}
              <div className="absolute -inset-2 bg-gradient-to-r from-pink-600/20 to-purple-600/20 rounded-3xl blur-xl opacity-70"></div>

              {/* Main Active Card */}
              <div className="relative rounded-3xl bg-[#111726] border border-pink-500/40 p-6 sm:p-8 shadow-2xl space-y-6">
                {/* Author & Severity Pill */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={activePost.author.logoSrc}
                      alt={activePost.author.name}
                      className="w-12 h-12 rounded-2xl object-contain bg-slate-900 border border-slate-800 p-1.5 shadow-md"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-white">{activePost.author.name}</span>
                        {activePost.author.verified && (
                          <ShieldCheck className="w-4 h-4 text-blue-400" />
                        )}
                      </div>
                      <span className="text-xs text-slate-400 font-mono">
                        {activePost.source} &bull; {activePost.timeAgo}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-3.5 py-1 rounded-full text-xs font-black uppercase font-mono tracking-wider ${
                      activePost.severityLevel === "CRITICAL"
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                        : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    }`}
                  >
                    {activePost.magnitude}
                  </span>
                </div>

                {/* Headline & Description */}
                <div className="space-y-3">
                  <h2 className="text-lg sm:text-xl font-extrabold text-white leading-snug">
                    {activePost.headlineTitle}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {activePost.fullDescription[0]}
                  </p>
                </div>

                {/* Telemetry Stats */}
                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 font-mono text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px] block">FOCAL DEPTH</span>
                    <span className="text-white font-bold">{activePost.depth}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">APPROVED RELIEF</span>
                    <span className="text-emerald-400 font-bold">+${claimAmount} USDC</span>
                  </div>
                </div>

                {/* Main Action Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => toggleInlineDonate(activePost.id)}
                    className="py-3 px-4 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-pink-600/30 cursor-pointer"
                  >
                    <Heart className="w-4 h-4 fill-white/20" />
                    <span>{isDonating ? "Close Donate" : "Donate Aid"}</span>
                  </button>

                  <button
                    onClick={() => toggleInlineClaim(activePost.id)}
                    className="py-3 px-4 rounded-2xl bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-600/50 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>{isClaiming ? "Close Claim" : `Claim $${claimAmount}`}</span>
                  </button>
                </div>

                {/* Inline Donation Box */}
                {isDonating && (
                  <div className="p-4 rounded-2xl bg-slate-950 border border-pink-500/40 space-y-3 animate-in fade-in">
                    {isDonated ? (
                      <div className="text-center space-y-1 py-1">
                        <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
                        <p className="text-xs font-bold text-emerald-300">Donation Confirmed!</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <input
                          type="number"
                          min="1"
                          value={donateAmount}
                          onChange={(e) => setDonateAmount(e.target.value)}
                          placeholder="Amount in USD"
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                        />
                        <button
                          onClick={() => handleConfirmDonation(activePost)}
                          disabled={isSubmittingDonation || !donateAmount}
                          className="w-full py-2 rounded-xl bg-pink-600 text-white font-bold text-xs disabled:opacity-50"
                        >
                          Confirm & Send ${donateAmount || "0"}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Inline Claim Box */}
                {isClaiming && (
                  <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-600 space-y-3 animate-in fade-in">
                    {isClaimed ? (
                      <div className="text-center space-y-1 py-1">
                        <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
                        <p className="text-xs font-bold text-emerald-200">Aid Grant Disbursed!</p>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleConfirmClaim(activePost)}
                        disabled={isSubmittingClaim}
                        className="w-full py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs disabled:opacity-50"
                      >
                        {isSubmittingClaim ? "Validating ZK Proof..." : `Claim $${claimAmount} USDC`}
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Navigation Controls below card */}
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={handlePrev}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs flex items-center gap-1.5 border border-slate-800 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center gap-1.5">
                  {posts.slice(0, 7).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentIndex(i)}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        i === currentIndex ? "bg-pink-500 w-6" : "bg-slate-700"
                      }`}
                    ></button>
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs flex items-center gap-1.5 border border-slate-800 cursor-pointer"
                >
                  <span>Next Card</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
