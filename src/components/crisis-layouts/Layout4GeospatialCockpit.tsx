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
  MapPin,
  Compass,
  Navigation,
  Globe2,
  Maximize,
  Radio,
} from "lucide-react";
import { LayoutProps, EthereumIcon, PolygonIcon } from "./types";

export default function Layout4GeospatialCockpit(props: LayoutProps) {
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

  const [selectedPostId, setSelectedPostId] = useState<string | null>(
    posts[0]?.id || null
  );

  const selectedPost = posts.find((p) => p.id === selectedPostId) || posts[0];

  return (
    <div className="min-h-screen bg-[#070E1A] text-slate-100 antialiased p-3 sm:p-6 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">
        {/* Left Pane: Geospatial Radar & Interactive Map HUD (5 Cols) */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-36">
          <div className="rounded-3xl bg-[#0F1C33] border border-teal-500/30 p-5 space-y-4 shadow-2xl relative overflow-hidden">
            {/* Top Cockpit Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-teal-400 animate-spin-slow" />
                <span className="font-bold text-xs uppercase tracking-wider text-teal-300">
                  GEOSPATIAL RADAR COCKPIT
                </span>
              </div>
              <span className="text-[10px] font-mono bg-teal-950 text-teal-300 px-2 py-0.5 rounded-md border border-teal-700">
                LIVE LAT/LON TRACKING
              </span>
            </div>

            {/* Interactive World Map / Coordinate Canvas */}
            <div className="relative h-64 rounded-2xl bg-[#060D17] border border-slate-800 overflow-hidden flex items-center justify-center">
              {/* World Grid lines */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(20,184,166,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(20,184,166,0.06)_1px,transparent_1px)] bg-[size:28px_28px]"></div>

              {/* Equator & Prime Meridian Lines */}
              <div className="absolute w-full h-[1px] bg-teal-500/20 top-1/2"></div>
              <div className="absolute h-full w-[1px] bg-teal-500/20 left-1/2"></div>

              {/* Multi-node epicenter dots mapped */}
              {posts.slice(0, 8).map((p, idx) => {
                const isCurrent = p.id === selectedPost?.id;
                // Generate pseudo-random positions based on post id
                const leftPercent = 20 + ((idx * 27) % 65);
                const topPercent = 20 + ((idx * 33) % 60);

                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPostId(p.id)}
                    style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all group z-10 cursor-pointer ${
                      isCurrent ? "scale-125 z-20" : "hover:scale-110"
                    }`}
                    title={p.headlineTitle}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                        isCurrent
                          ? "bg-teal-400 text-slate-950 ring-4 ring-teal-500/40 shadow-lg shadow-teal-500/50 font-bold"
                          : p.severityLevel === "CRITICAL"
                          ? "bg-rose-500 text-white"
                          : "bg-amber-500 text-black"
                      }`}
                    >
                      <span className="text-[9px] font-black">{idx + 1}</span>
                    </div>

                    {/* Ping ring for selected */}
                    {isCurrent && (
                      <span className="absolute -inset-2 rounded-full border-2 border-teal-400 animate-ping pointer-events-none"></span>
                    )}
                  </button>
                );
              })}

              {/* Selected Node Overlay Badge */}
              <div className="absolute bottom-2 left-2 right-2 p-2 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span className="text-slate-200 font-bold truncate">
                    {selectedPost?.regionKey.toUpperCase() || "GLOBAL"}
                  </span>
                </div>
                <span className="font-mono text-teal-300 text-[11px] shrink-0 font-bold">
                  {selectedPost?.magnitude || "N/A"}
                </span>
              </div>
            </div>

            {/* Selected Event Details Panel */}
            {selectedPost && (
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300 truncate">
                    {selectedPost.author.name}
                  </span>
                  <span className="text-emerald-400 font-mono font-bold">
                    +${getApprovedAidAmount(selectedPost)} USDC Aid
                  </span>
                </div>

                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                  {selectedPost.fullDescription[0]}
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2 rounded-xl bg-[#0B1527] border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">DEPTH</span>
                    <span className="text-white font-bold">{selectedPost.depth}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#0B1527] border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">ORACLE SOURCE</span>
                    <span className="text-teal-300 font-bold">{selectedPost.source} SENSOR</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => toggleInlineDonate(selectedPost.id)}
                    className="py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-teal-600/30"
                  >
                    <Heart className="w-3.5 h-3.5 fill-black/20" />
                    <span>Donate</span>
                  </button>

                  <button
                    onClick={() => toggleInlineClaim(selectedPost.id)}
                    className="py-2.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-600/50 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Claim Aid</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Pane: Live Streaming Queue (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between text-xs px-1 text-slate-400 font-mono">
            <span className="font-bold text-teal-400 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
              COCKPIT INCIDENT QUEUE ({posts.length})
            </span>
            <span>AUTO-SYNC ENABLED</span>
          </div>

          {loading && posts.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <Loader2 className="w-7 h-7 animate-spin text-teal-400 mx-auto" />
              <p className="text-xs text-slate-400">Locking geospatial coordinates...</p>
            </div>
          ) : (
            posts.map((post, idx) => {
              const isSelected = post.id === selectedPost?.id;
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
                  onClick={() => setSelectedPostId(post.id)}
                  className={`rounded-2xl border transition-all p-5 space-y-4 cursor-pointer ${
                    isSelected
                      ? "bg-[#0E1E38] border-teal-400 shadow-xl shadow-teal-950/50 ring-1 ring-teal-500/30"
                      : "bg-[#0B1526]/80 hover:bg-[#0E1E38]/70 border-slate-800"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-teal-950 border border-teal-700/50 flex items-center justify-center font-mono font-bold text-xs text-teal-300">
                        #{idx + 1}
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white">{post.author.name}</span>
                          {post.author.verified && (
                            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {post.source} &bull; {post.timeAgo}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        post.severityLevel === "CRITICAL"
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      }`}
                    >
                      {post.magnitude}
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-slate-100 leading-snug">
                    {post.headlineTitle}
                  </p>

                  <div className="text-xs text-slate-300 leading-relaxed">
                    {isExpanded ? (
                      post.fullDescription.map((p, i) => (
                        <p key={i} className="mt-1">
                          {p}
                        </p>
                      ))
                    ) : (
                      <p className="line-clamp-2 text-slate-400">{post.fullDescription[0]}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleInlineDonate(post.id);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold text-xs cursor-pointer"
                      >
                        Donate
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleInlineClaim(post.id);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/50 font-bold text-xs cursor-pointer"
                      >
                        Claim Aid
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyLink(post.id);
                        }}
                        className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                      <a
                        href={post.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-teal-400"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  {/* Inline Donation Flow */}
                  {isDonating && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 animate-in fade-in"
                    >
                      {isDonated ? (
                        <p className="text-xs font-bold text-emerald-400 text-center">
                          Donation verified on-chain!
                        </p>
                      ) : (
                        <div className="flex gap-2">
                          <input
                            type="number"
                            min="1"
                            value={donateAmount}
                            onChange={(e) => setDonateAmount(e.target.value)}
                            placeholder="USD Amount"
                            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                          />
                          <button
                            onClick={() => handleConfirmDonation(post)}
                            disabled={isSubmittingDonation || !donateAmount}
                            className="px-3 py-2 rounded-lg bg-teal-500 text-slate-950 font-bold text-xs"
                          >
                            Send
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Inline Claim Flow */}
                  {isClaiming && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="p-3.5 rounded-2xl bg-emerald-950 border border-emerald-700/50 space-y-2 animate-in fade-in"
                    >
                      {isClaimed ? (
                        <p className="text-xs font-bold text-emerald-300 text-center">
                          Aid Disbursed Successfully!
                        </p>
                      ) : (
                        <button
                          onClick={() => handleConfirmClaim(post)}
                          disabled={isSubmittingClaim}
                          className="w-full py-2 rounded-lg bg-emerald-600 text-white font-bold text-xs"
                        >
                          Disburse ${claimAmount} USDC
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
