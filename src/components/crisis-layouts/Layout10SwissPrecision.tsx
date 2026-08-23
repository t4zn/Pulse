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
  Code2,
  Sliders,
  Maximize2,
} from "lucide-react";
import { LayoutProps, EthereumIcon, PolygonIcon } from "./types";

export default function Layout10SwissPrecision(props: LayoutProps) {
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

  const [viewJsonId, setViewJsonId] = useState<string | null>(null);

  const toggleJson = (id: string) => {
    setViewJsonId(viewJsonId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-white text-black antialiased p-4 sm:p-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Swiss Grid Masthead */}
        <div className="border-b-4 border-black pb-6 space-y-4">
          <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest">
            <span>SWISS INTERNATIONAL TELEMETRY INDEX</span>
            <span className="bg-black text-white px-2 py-0.5">FIG. 10 &bull; PRECISION SPEC</span>
            <span>SYSTEM 01</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end pt-2">
            <div className="md:col-span-8">
              <h1 className="text-4xl sm:text-6xl font-black tracking-tighter uppercase leading-none">
                Earthquake & Tectonic Registry
              </h1>
            </div>
            <div className="md:col-span-4 text-xs font-mono text-neutral-600 space-y-1">
              <div>ACTIVE TELEMETRY NODES: <strong>{posts.length}</strong></div>
              <div>ORACLE SPECIFICATION: <strong>USGS-EMSC-NASA</strong></div>
              <div>CHAIN RELAY: <strong>POLYGON-ETHEREUM</strong></div>
            </div>
          </div>
        </div>

        {loading && posts.length === 0 ? (
          <div className="py-24 text-center space-y-3 font-mono">
            <Loader2 className="w-8 h-8 animate-spin text-black mx-auto" />
            <p className="text-xs font-bold uppercase tracking-widest">PROCESSING GEOPHYSICAL DATASETS...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map((post, idx) => {
              const isExpanded = expandedIds[post.id];
              const isDonating = inlineDonateId === post.id;
              const isClaiming = inlineClaimId === post.id;
              const isDonated = donationSuccessId === post.id;
              const isClaimed = claimSuccessId === post.id;
              const isJsonOpen = viewJsonId === post.id;
              const claimAmount = getApprovedAidAmount(post);

              return (
                <div
                  key={post.id}
                  id={post.id}
                  className="border-2 border-black p-6 sm:p-8 space-y-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-0.5"
                >
                  {/* Item Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-black pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-black text-white font-black flex items-center justify-center text-sm">
                        {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm uppercase tracking-tight">{post.author.name}</span>
                          {post.author.verified && <span className="text-[10px] font-bold bg-neutral-200 px-1.5 py-0.2">VERIFIED</span>}
                        </div>
                        <span className="text-xs font-mono text-neutral-500">
                          {post.source} &bull; {post.timeAgo} &bull; DEPTH {post.depth}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 font-mono">
                      <span className="px-3 py-1 bg-black text-white font-black text-xs uppercase tracking-wider">
                        MAG {post.magnitude}
                      </span>
                      <span className="px-3 py-1 border-2 border-black font-bold text-xs">
                        +{claimAmount} USD
                      </span>
                    </div>
                  </div>

                  {/* Headline & Dossier */}
                  <div className="space-y-3">
                    <h2 className="text-lg sm:text-xl font-bold tracking-tight text-black leading-snug">
                      {post.headlineTitle}
                    </h2>

                    <div className="text-xs sm:text-sm text-neutral-700 leading-relaxed space-y-2">
                      {isExpanded ? (
                        post.fullDescription.map((p, i) => <p key={i}>{p}</p>)
                      ) : (
                        <p>{post.fullDescription[0]}</p>
                      )}
                    </div>
                  </div>

                  {/* Precision Data Matrix Table */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs border-y-2 border-black py-3">
                    <div>
                      <span className="text-[10px] text-neutral-500 block">SEVERITY LEVEL</span>
                      <span className="font-bold">{post.severityLevel}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-500 block">ENERGY INDEX</span>
                      <span className="font-bold">{post.significance}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-500 block">SETTLEMENT RELAY</span>
                      <span className="font-bold">POLYGON AMOY</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-500 block">STORAGE ARCHIVE</span>
                      <span className="font-bold">FILECOIN IPFS</span>
                    </div>
                  </div>

                  {/* Actions & JSON View Button */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleInlineDonate(post.id)}
                        className="px-5 py-2.5 bg-black hover:bg-neutral-800 text-white font-black text-xs uppercase tracking-wider transition-all cursor-pointer"
                      >
                        {isDonating ? "Close" : "Direct Aid Deposit"}
                      </button>

                      <button
                        onClick={() => toggleInlineClaim(post.id)}
                        className="px-5 py-2.5 border-2 border-black hover:bg-neutral-100 text-black font-black text-xs uppercase tracking-wider transition-all cursor-pointer"
                      >
                        {isClaiming ? "Close" : `Claim Grant $${claimAmount}`}
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleJson(post.id)}
                        className="px-3 py-2 border border-neutral-400 hover:border-black text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                      >
                        <Code2 className="w-3.5 h-3.5" />
                        <span>{isJsonOpen ? "Hide JSON" : "Raw JSON"}</span>
                      </button>

                      <button
                        onClick={() => handleCopyLink(post.id)}
                        className="p-2 border border-neutral-400 hover:border-black"
                        title="Copy Link"
                      >
                        {copiedId === post.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Raw JSON Inspector */}
                  {isJsonOpen && (
                    <pre className="p-4 bg-neutral-900 text-emerald-400 rounded text-[11px] font-mono overflow-x-auto border border-black animate-in fade-in">
                      {JSON.stringify(post, null, 2)}
                    </pre>
                  )}

                  {/* Inline Donation Form */}
                  {isDonating && (
                    <div className="p-4 bg-neutral-100 border-2 border-black space-y-3 animate-in fade-in font-mono">
                      {isDonated ? (
                        <p className="font-bold text-xs text-emerald-700 text-center">
                          TRANSACTION CONFIRMED & COMMITTED TO DISASTER VAULT.
                        </p>
                      ) : (
                        <div className="flex gap-2">
                          <input
                            type="number"
                            min="1"
                            value={donateAmount}
                            onChange={(e) => setDonateAmount(e.target.value)}
                            placeholder="USD Amount"
                            className="w-full px-3 py-2 bg-white border-2 border-black text-xs font-bold"
                          />
                          <button
                            onClick={() => handleConfirmDonation(post)}
                            disabled={isSubmittingDonation || !donateAmount}
                            className="px-6 py-2 bg-black text-white font-black text-xs uppercase"
                          >
                            {isSubmittingDonation ? "Sending..." : "Submit"}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Inline Claim Form */}
                  {isClaiming && (
                    <div className="p-4 bg-neutral-100 border-2 border-black space-y-3 animate-in fade-in font-mono">
                      {isClaimed ? (
                        <p className="font-bold text-xs text-emerald-700 text-center">
                          RELIEF GRANT DISBURSED: ${claimAmount} USDC
                        </p>
                      ) : (
                        <button
                          onClick={() => handleConfirmClaim(post)}
                          disabled={isSubmittingClaim}
                          className="w-full py-2.5 bg-black text-white font-black text-xs uppercase"
                        >
                          Confirm & Disburse ${claimAmount} USDC
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
