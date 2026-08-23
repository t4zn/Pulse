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
  Radio,
  Activity,
  AlertTriangle,
  Zap,
  Flame,
  Globe2,
  Maximize2,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { LayoutProps, EthereumIcon, PolygonIcon } from "./types";

export default function Layout1MissionControl(props: LayoutProps) {
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

  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(
    posts[0]?.id || null
  );

  const activePost = posts.find((p) => p.id === selectedIncidentId) || posts[0];

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 font-mono antialiased p-3 sm:p-6 space-y-6">
      {/* Tactical Top Ticker Bar */}
      <div className="rounded-xl bg-[#0F172A]/90 border border-cyan-500/30 p-3 shadow-lg shadow-cyan-950/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping"></div>
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 font-bold tracking-widest text-[11px] uppercase">
              TACTICAL SEISMIC COMMAND
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-300 text-[11px]">
              SYS_STATUS: <span className="text-emerald-400 font-bold">ONLINE &bull; ORACLE SYNCED</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>USGS / EMSC / NASA SAT FEED</span>
          </div>
          <Link
            href="/audit"
            className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 font-bold"
          >
            <span>IMMUTABLE LEDGER</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {loading && posts.length === 0 ? (
        <div className="py-24 text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-400 mx-auto" />
          <p className="text-xs text-cyan-500/80 tracking-widest uppercase">
            CALIBRATING SEISMIC SENSORS & RELAY NODE...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left / Middle: Incident Battle Cards Stream (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span className="font-bold tracking-wider text-cyan-400/90 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
                ACTIVE DISASTER TELEMETRY STREAM ({posts.length})
              </span>
              <span className="text-[10px] text-slate-500">SORT: REAL-TIME CHRONO</span>
            </div>

            {posts.map((post) => {
              const isExpanded = expandedIds[post.id];
              const isDonating = inlineDonateId === post.id;
              const isClaiming = inlineClaimId === post.id;
              const isDonated = donationSuccessId === post.id;
              const isClaimed = claimSuccessId === post.id;
              const claimAmount = getApprovedAidAmount(post);
              const isSelected = activePost?.id === post.id;

              return (
                <div
                  key={post.id}
                  id={post.id}
                  onClick={() => setSelectedIncidentId(post.id)}
                  className={`rounded-2xl border transition-all cursor-pointer font-sans relative overflow-hidden ${
                    isSelected
                      ? "bg-[#0E1626] border-cyan-500 shadow-xl shadow-cyan-950/50 ring-1 ring-cyan-500/40"
                      : "bg-[#0B111E]/80 hover:bg-[#0E1626]/70 border-slate-800/90 hover:border-slate-700"
                  } p-4 sm:p-5 space-y-4`}
                >
                  {/* Top HUD Row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={post.author.logoSrc}
                          alt={post.author.name}
                          className="w-11 h-11 rounded-xl object-contain bg-slate-900 border border-slate-700 p-1.5 shadow-md"
                        />
                        <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#0B111E]"></span>
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white tracking-tight">
                            {post.author.name}
                          </span>
                          {post.author.verified && (
                            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 mt-0.5">
                          <span className="text-cyan-400">SRC: {post.source}</span>
                          <span>&bull;</span>
                          <span>{post.timeAgo}</span>
                          <span>&bull;</span>
                          <span className="text-amber-400">DEP: {post.depth}</span>
                        </div>
                      </div>
                    </div>

                    {/* Magnitude HUD Badge */}
                    <div
                      className={`px-3 py-1 rounded-xl font-mono text-xs font-black tracking-wider flex items-center gap-1.5 shadow-md border ${
                        post.severityLevel === "CRITICAL"
                          ? "bg-rose-950/80 text-rose-300 border-rose-600/50 shadow-rose-950/50"
                          : "bg-amber-950/80 text-amber-300 border-amber-600/50"
                      }`}
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{post.magnitude}</span>
                    </div>
                  </div>

                  {/* Headline & Richter Shockwave Bar */}
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-slate-100 leading-snug">
                      {post.headlineTitle}
                    </p>

                    {/* Richter visualizer bar */}
                    <div className="space-y-1 font-mono text-[10px]">
                      <div className="flex justify-between text-slate-400">
                        <span>ENERGY DISPERSION INDEX</span>
                        <span className="text-cyan-400 font-bold">{post.significance}</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden flex border border-slate-800">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-600 rounded-full"
                          style={{
                            width: `${Math.min(100, (post.rawMagnitude / 8) * 100)}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="text-xs text-slate-300 font-sans leading-relaxed pt-1">
                      {isExpanded ? (
                        post.fullDescription.map((p, idx) => (
                          <p key={idx} className="mt-1.5 text-slate-300">
                            {p}
                          </p>
                        ))
                      ) : (
                        <p className="line-clamp-2 text-slate-400">{post.fullDescription[0]}</p>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpand(post.id);
                        }}
                        className="text-cyan-400 hover:text-cyan-300 text-[11px] font-semibold mt-1 inline-flex items-center gap-1"
                      >
                        {isExpanded ? "Show Less" : "Read Tactical Dossier →"}
                      </button>
                    </div>
                  </div>

                  {/* Action Controls */}
                  <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleInlineDonate(post.id);
                        }}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono tracking-wide flex items-center gap-1.5 transition-all cursor-pointer shadow-md ${
                          isDonating
                            ? "bg-slate-800 text-white border border-slate-600"
                            : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-cyan-950/40"
                        }`}
                      >
                        <Heart className="w-3.5 h-3.5 fill-white/20" />
                        <span>{isDonating ? "CANCEL" : "DEPLOY AID"}</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleInlineClaim(post.id);
                        }}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono tracking-wide flex items-center gap-1.5 transition-all cursor-pointer shadow-md ${
                          isClaiming
                            ? "bg-emerald-800 text-white"
                            : "bg-emerald-950/70 hover:bg-emerald-900/90 text-emerald-300 border border-emerald-600/40"
                        }`}
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{isClaiming ? "CLOSE CLAIM" : `CLAIM $${claimAmount}`}</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyLink(post.id);
                        }}
                        className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                        title="Copy Tactical Link"
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
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-cyan-400 transition-colors"
                        title="Live Sensor Link"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  {/* Inline Donation HUD Form */}
                  {isDonating && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="pt-3 border-t border-cyan-500/30 font-sans space-y-3 animate-in fade-in"
                    >
                      {isDonated ? (
                        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-center space-y-2">
                          <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
                          <p className="text-xs font-bold text-emerald-200">
                            TRANSACTION CONFIRMED &bull; RELIEF FUNDS COMMITTED
                          </p>
                          <p className="text-[11px] text-emerald-400">
                            ${donateAmount} USD ({getCryptoEstimate(donateAmount, donateToken)}) routed to {post.author.name}.
                          </p>
                          {donationCids[post.id] && (
                            <Link
                              href={`/receipt?cid=${encodeURIComponent(donationCids[post.id])}`}
                              className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:underline font-mono mt-1"
                            >
                              <HardDrive className="w-3.5 h-3.5" />
                              <span>IPFS CID: {donationCids[post.id].slice(0, 12)}...</span>
                            </Link>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-3 p-3.5 rounded-xl bg-slate-900/90 border border-slate-700">
                          <div className="flex flex-col sm:flex-row gap-2">
                            <div className="relative flex-1">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                                $
                              </span>
                              <input
                                type="number"
                                min="1"
                                value={donateAmount}
                                onChange={(e) => setDonateAmount(e.target.value)}
                                placeholder="Amount in USD"
                                className="w-full pl-7 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:border-cyan-400 font-mono"
                              />
                            </div>

                            <div className="flex items-center p-1 rounded-lg bg-slate-950 border border-slate-800 gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => setDonateToken("ETH")}
                                className={`px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 ${
                                  donateToken === "ETH"
                                    ? "bg-blue-600 text-white"
                                    : "text-slate-400 hover:text-white"
                                }`}
                              >
                                <EthereumIcon className="w-3 h-3" />
                                <span>ETH</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setDonateToken("POL")}
                                className={`px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 ${
                                  donateToken === "POL"
                                    ? "bg-purple-600 text-white"
                                    : "text-slate-400 hover:text-white"
                                }`}
                              >
                                <PolygonIcon className="w-3 h-3" />
                                <span>POL</span>
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleConfirmDonation(post)}
                              disabled={isSubmittingDonation || !donateAmount || parseFloat(donateAmount) <= 0}
                              className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                            >
                              {isSubmittingDonation ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <span>CONFIRM</span>
                              )}
                            </button>
                          </div>

                          {donateAmount && parseFloat(donateAmount) > 0 && (
                            <div className="flex justify-between items-center text-[11px] font-mono text-slate-400 px-1">
                              <span>ESTIMATED ON-CHAIN ROUTE:</span>
                              <span className="text-cyan-400 font-bold">
                                {getCryptoEstimate(donateAmount, donateToken)} ({donateToken})
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Inline Claim ZK Flow */}
                  {isClaiming && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="pt-3 border-t border-emerald-500/30 font-sans space-y-3 animate-in fade-in"
                    >
                      {isClaimed ? (
                        <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-500 text-center space-y-2">
                          <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
                          <p className="text-xs font-bold text-emerald-200">
                            ZERO-KNOWLEDGE DISBURSEMENT COMPLETE!
                          </p>
                          <p className="text-[11px] text-emerald-300">
                            ${claimAmount} USDC deposited to recipient address via gasless Polygon meta-tx.
                          </p>
                          {claimCids[post.id] && (
                            <Link
                              href={`/receipt?cid=${encodeURIComponent(claimCids[post.id])}`}
                              className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:underline font-mono"
                            >
                              <FileCheck className="w-3.5 h-3.5" />
                              <span>VIEW FILECOIN CERTIFICATE</span>
                            </Link>
                          )}
                        </div>
                      ) : (
                        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-emerald-600/40 space-y-2.5">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                              <Lock className="w-3.5 h-3.5 text-emerald-400" />
                              EIP-712 ZERO-KNOWLEDGE MERKLE GRANT
                            </span>
                            <span className="text-xs font-mono font-black text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-600/50">
                              +${claimAmount} USDC
                            </span>
                          </div>

                          <div className="text-[11px] font-mono text-slate-400 flex justify-between">
                            <span>RECIPIENT:</span>
                            <span className="text-slate-200">
                              {connectedAddress
                                ? `${connectedAddress.slice(0, 6)}...${connectedAddress.slice(-4)}`
                                : "0x9318...f9d3 (ZK Validated)"}
                            </span>
                          </div>

                          {claimStatusMsg && (
                            <div className="text-[11px] text-cyan-400 flex items-center gap-1.5 font-mono">
                              <Loader2 className="w-3 h-3 animate-spin" />
                              <span>{claimStatusMsg}</span>
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={() => handleConfirmClaim(post)}
                            disabled={isSubmittingClaim}
                            className="w-full py-2 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                          >
                            {isSubmittingClaim ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>PROVING & DISBURSING...</span>
                              </>
                            ) : (
                              <span>CONFIRM & CLAIM ${claimAmount} USDC</span>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right: Tactical Radar & Active Telemetry Focus Dossier (5 Cols) */}
          <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-36">
            <div className="rounded-2xl bg-[#0F172A] border border-cyan-500/40 p-5 space-y-5 shadow-2xl shadow-cyan-950/40">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-cyan-400 flex items-center gap-2 tracking-wider uppercase">
                  <Maximize2 className="w-4 h-4 text-cyan-400" />
                  INCIDENT FOCUS RADAR
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                  ID: {activePost?.id || "N/A"}
                </span>
              </div>

              {activePost && (
                <div className="space-y-4 font-sans">
                  {/* Radar Mock Visualizer */}
                  <div className="relative h-44 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.15)_0,transparent_70%)]"></div>
                    <div className="w-32 h-32 rounded-full border border-cyan-500/20 absolute animate-ping"></div>
                    <div className="w-20 h-20 rounded-full border border-cyan-500/40 absolute"></div>
                    <div className="w-8 h-8 rounded-full bg-rose-500/80 border-2 border-white absolute shadow-lg shadow-rose-500 animate-pulse"></div>

                    {/* Overlay Grid lines */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

                    <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/80 font-mono text-[10px] text-cyan-400 border border-slate-800">
                      REGION: {activePost.regionKey.toUpperCase()}
                    </div>
                    <div className="absolute top-2 right-2 px-2 py-1 rounded bg-black/80 font-mono text-[10px] text-amber-400 border border-slate-800">
                      SEVERITY: {activePost.severityLevel}
                    </div>
                  </div>

                  {/* Telemetry Metrics */}
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
                      <span className="text-[10px] text-slate-500">PRIMARY MAGNITUDE</span>
                      <p className="text-base font-bold text-white">{activePost.magnitude}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
                      <span className="text-[10px] text-slate-500">FOCAL DEPTH</span>
                      <p className="text-base font-bold text-amber-400">{activePost.depth}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
                      <span className="text-[10px] text-slate-500">REGIONAL RESPONDER</span>
                      <p className="text-xs font-bold text-cyan-300 truncate">{activePost.author.name}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
                      <span className="text-[10px] text-slate-500">APPROVED VICTIM AID</span>
                      <p className="text-base font-bold text-emerald-400">+${getApprovedAidAmount(activePost)} USDC</p>
                    </div>
                  </div>

                  {/* Rapid Action Buttons */}
                  <div className="pt-2 flex flex-col gap-2">
                    <button
                      onClick={() => toggleInlineDonate(activePost.id)}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-mono font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-950/50"
                    >
                      <Heart className="w-4 h-4 fill-white/20" />
                      <span>DIRECT RELIEF VAULT DEPOSIT</span>
                    </button>

                    <button
                      onClick={() => toggleInlineClaim(activePost.id)}
                      className="w-full py-2.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 font-mono font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>DISBURSE EMERGENCY GRANT</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
