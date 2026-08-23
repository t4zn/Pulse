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
  ExternalLink,
  BookOpen,
  Feather,
  Globe,
  Quote,
} from "lucide-react";
import { LayoutProps, EthereumIcon, PolygonIcon } from "./types";

export default function Layout6EditorialDispatch(props: LayoutProps) {
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

  const leadStory = posts[0];
  const dispatches = posts.slice(1);

  return (
    <div className="min-h-screen bg-[#0E1117] text-[#E6EDF3] antialiased p-4 sm:p-10 font-serif">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Magazine Masthead */}
        <div className="text-center border-b-2 border-slate-700/80 pb-6 space-y-3">
          <div className="flex items-center justify-between text-[11px] font-sans text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-2">
            <span>VOL. XXIV &bull; ISSUE NO. 88</span>
            <span className="font-bold text-rose-400">INTERNATIONAL HUMANITARIAN DISPATCH</span>
            <span>REAL-TIME SEISMIC OBSERVATORY</span>
          </div>

          <h1 className="text-3xl sm:text-6xl font-black tracking-tight text-white uppercase font-serif py-1">
            The Global Triage Chronicle
          </h1>

          <p className="text-xs sm:text-sm font-sans text-slate-400 max-w-2xl mx-auto italic">
            Direct humanitarian relief pipelines powered by zero-knowledge cryptographic verification and real USGS telemetry.
          </p>
        </div>

        {loading && posts.length === 0 ? (
          <div className="py-24 text-center font-sans space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-rose-500 mx-auto" />
            <p className="text-xs text-slate-400 tracking-wider uppercase">Typesetting live dispatch dispatches...</p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Front Page Lead Story */}
            {leadStory && (
              <div className="border-b-2 border-slate-800 pb-10 space-y-6">
                <div className="flex items-center gap-3 font-sans text-xs">
                  <span className="px-3 py-1 bg-rose-600 text-white font-bold tracking-wider uppercase rounded-sm">
                    SPECIAL INVESTIGATION &bull; {leadStory.magnitude}
                  </span>
                  <span className="text-slate-400">{leadStory.timeAgo}</span>
                  <span className="text-slate-500">|</span>
                  <span className="text-slate-300 font-semibold">{leadStory.author.name}</span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                  {leadStory.headlineTitle}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start font-sans">
                  <div className="md:col-span-8 space-y-4 text-slate-300 text-sm leading-relaxed">
                    <p className="first-letter:text-5xl first-letter:font-serif first-letter:font-black first-letter:text-rose-500 first-letter:float-left first-letter:mr-3 first-letter:leading-none">
                      {leadStory.fullDescription[0]}
                    </p>
                    {leadStory.fullDescription[1] && (
                      <p className="text-slate-400">{leadStory.fullDescription[1]}</p>
                    )}

                    {/* Pull Quote Box */}
                    <div className="p-4 rounded-xl bg-slate-900/90 border-l-4 border-rose-500 my-4 italic font-serif text-slate-200 text-base">
                      &ldquo;Tectonic displacement confirmed at focal depth of {leadStory.depth}. Immediate on-chain liquidity deployment is active for registered regional victims.&rdquo;
                    </div>
                  </div>

                  {/* Editorial Action Sidebar */}
                  <div className="md:col-span-4 p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
                      <span className="font-bold text-white uppercase tracking-wider">Aid Authorization</span>
                      <span className="text-emerald-400 font-mono font-bold">+${getApprovedAidAmount(leadStory)} USDC</span>
                    </div>

                    <div className="space-y-2">
                      <button
                        onClick={() => toggleInlineDonate(leadStory.id)}
                        className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all cursor-pointer shadow-md"
                      >
                        Donate Humanitarian Aid
                      </button>
                      <button
                        onClick={() => toggleInlineClaim(leadStory.id)}
                        className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/40 font-bold text-xs transition-all cursor-pointer"
                      >
                        Claim ${getApprovedAidAmount(leadStory)} USDC Grant
                      </button>
                    </div>

                    {inlineDonateId === leadStory.id && (
                      <div className="pt-2 border-t border-slate-800 space-y-2">
                        <input
                          type="number"
                          min="1"
                          value={donateAmount}
                          onChange={(e) => setDonateAmount(e.target.value)}
                          placeholder="Amount in USD"
                          className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                        />
                        <button
                          onClick={() => handleConfirmDonation(leadStory)}
                          disabled={isSubmittingDonation || !donateAmount}
                          className="w-full py-2 rounded-lg bg-rose-600 text-white font-bold text-xs disabled:opacity-50"
                        >
                          Confirm Donation
                        </button>
                      </div>
                    )}

                    {inlineClaimId === leadStory.id && (
                      <div className="pt-2 border-t border-slate-800 space-y-2">
                        <button
                          onClick={() => handleConfirmClaim(leadStory)}
                          disabled={isSubmittingClaim}
                          className="w-full py-2 rounded-lg bg-emerald-600 text-white font-bold text-xs disabled:opacity-50"
                        >
                          Disburse ${getApprovedAidAmount(leadStory)} USDC
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 3-Column Editorial Grid for Dispatches */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {dispatches.map((post) => {
                const isDonating = inlineDonateId === post.id;
                const isClaiming = inlineClaimId === post.id;
                const claimAmount = getApprovedAidAmount(post);

                return (
                  <article
                    key={post.id}
                    id={post.id}
                    className="border-b border-slate-800 pb-6 space-y-3 font-sans flex flex-col justify-between"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="font-serif italic">{post.regionKey}</span>
                        <span className="font-mono text-rose-400 font-bold">{post.magnitude}</span>
                      </div>

                      <h3 className="text-base font-serif font-bold text-white leading-snug hover:text-rose-300 transition-colors">
                        {post.headlineTitle}
                      </h3>

                      <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                        {post.fullDescription[0]}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 text-[11px] truncate">{post.author.name}</span>
                        <span className="text-emerald-400 font-mono font-bold">+${claimAmount}</span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleInlineDonate(post.id)}
                          className="flex-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer"
                        >
                          Donate
                        </button>
                        <button
                          onClick={() => toggleInlineClaim(post.id)}
                          className="flex-1 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/50 text-xs font-semibold cursor-pointer"
                        >
                          Claim
                        </button>
                      </div>

                      {isDonating && (
                        <div className="p-2 rounded bg-slate-900 border border-slate-700 space-y-1">
                          <input
                            type="number"
                            min="1"
                            value={donateAmount}
                            onChange={(e) => setDonateAmount(e.target.value)}
                            placeholder="USD Amount"
                            className="w-full px-2 py-1 rounded bg-black text-xs text-white"
                          />
                          <button
                            onClick={() => handleConfirmDonation(post)}
                            disabled={isSubmittingDonation || !donateAmount}
                            className="w-full py-1 bg-rose-600 text-white text-xs font-bold rounded"
                          >
                            Send Aid
                          </button>
                        </div>
                      )}

                      {isClaiming && (
                        <div className="p-2 rounded bg-emerald-950 border border-emerald-700 space-y-1">
                          <button
                            onClick={() => handleConfirmClaim(post)}
                            disabled={isSubmittingClaim}
                            className="w-full py-1 bg-emerald-600 text-white text-xs font-bold rounded"
                          >
                            Claim ${claimAmount} USDC
                          </button>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
