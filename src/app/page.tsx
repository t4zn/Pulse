"use client";

import React, { useState } from "react";
import Link from "next/link";
import { QuickLinksSection } from "@/components/QuickLinksSection";
import { 
  Zap, 
  ShieldCheck, 
  Activity, 
  Search, 
  Cpu, 
  HeartHandshake, 
  ArrowRight, 
  Globe, 
  Lock, 
  CheckCircle2, 
  AlertTriangle,
  ExternalLink,
  Layers,
  Sparkles,
  TrendingUp,
  Clock,
  Users
} from "lucide-react";

export default function CommandCenterHome() {
  const [activeTab, setActiveTab] = useState<"all" | "earthquake" | "flood" | "drought">("all");

  const crises = [
    {
      id: "turkey-earthquake-2026",
      title: "Turkey-Syria 7.8M Earthquake Relief",
      category: "earthquake",
      categoryName: "Earthquake",
      location: "Kahramanmaraş, Turkey",
      raisedUSD: 684200,
      targetUSD: 1000000,
      severityIndex: 9.4,
      severityStatus: "CRITICAL RED",
      victimsVerified: 8420,
      vaultAddresses: {
        sepolia: "0x3A9F...8b21",
        amoy: "0x7E12...4c09",
      },
      image: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "kerala-flood-2026",
      title: "South Asia Emergency Monsoon Floods",
      category: "flood",
      categoryName: "Flood",
      location: "Wayanad, India",
      raisedUSD: 342100,
      targetUSD: 500000,
      severityIndex: 8.1,
      severityStatus: "HIGH ALERT",
      victimsVerified: 4180,
      vaultAddresses: {
        sepolia: "0x11B9...6e44",
        amoy: "0x98D2...1a33",
      },
      image: "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "horn-of-africa-2026",
      title: "Horn of Africa Severe Drought Crisis",
      category: "drought",
      categoryName: "Drought",
      location: "Somalia & Ethiopia",
      raisedUSD: 214200,
      targetUSD: 400000,
      severityIndex: 7.6,
      severityStatus: "ELEVATED",
      victimsVerified: 1680,
      vaultAddresses: {
        sepolia: "0x55C1...3d99",
        amoy: "0x22F4...7e11",
      },
      image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80",
    },
  ];

  const filteredCrises = activeTab === "all" ? crises : crises.filter((c) => c.category === activeTab);

  const liveTransactions = [
    {
      hash: "0x9f1a...4b22",
      chain: "Polygon Amoy",
      chainBadge: "POL",
      type: "Donation",
      amount: "$2,500 POL",
      target: "Turkey Relief Vault",
      time: "12s ago",
      verified: true,
    },
    {
      hash: "0x4c88...1d09",
      chain: "Eth Sepolia",
      chainBadge: "ETH",
      type: "Aid Payout",
      amount: "$150 USDC",
      target: "Victim #Merkle-8831 (Gasless)",
      time: "34s ago",
      verified: true,
    },
    {
      hash: "0x1b77...8e34",
      chain: "Polygon Amoy",
      chainBadge: "POL",
      type: "AI Release",
      amount: "$50,000 POL",
      target: "Gemini 2.5 Auto Unlock",
      time: "1m ago",
      verified: true,
    },
    {
      hash: "0x82e0...5f11",
      chain: "Eth Sepolia",
      chainBadge: "ETH",
      type: "Donation",
      amount: "1.5 ETH ($4,120)",
      target: "Kerala Flood Pool",
      time: "2m ago",
      verified: true,
    },
  ];

  return (
    <div className="w-full bg-canvas text-ink min-h-screen">
      {/* HERO SECTION */}
      <section className="relative pt-16 pb-20 px-4 md:px-8 border-b border-hairline overflow-hidden">
        {/* Subtle Radial Glow background matching Linear aesthetics */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/10 rounded-full blur-[160px] pointer-events-none"></div>

        <div className="max-w-[1280px] mx-auto flex flex-col items-center text-center relative z-10">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-pill bg-surface-1 border border-hairline mb-8 group hover:border-hairline-strong transition-all">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-xs font-mono tracking-eyebrow text-ink-muted">PULSE PROTOCOL v1.0</span>
            <span className="text-hairline">|</span>
            <span className="text-xs text-primary font-mono flex items-center gap-1">
              Cross-Chain Verifiable Aid <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-display-xl text-ink max-w-4xl leading-[1.05] mb-6">
            Disaster Aid Delivered in 3 Seconds. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-ink via-ink to-primary">
              Zero Middlemen. 100% Verifiable.
            </span>
          </h1>

          {/* Subhead */}
          <p className="text-base sm:text-lg md:text-xl text-ink-subtle max-w-2xl leading-relaxed tracking-subhead mb-10">
            PULSE aggregates cross-chain liquidity across Ethereum Sepolia and Polygon Amoy, uses <strong className="text-ink">Google Gemini 2.5 Flash AI</strong> for automated emergency fund triggers, and disburses gasless aid directly to cryptographically verified victims.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto mb-16">
            <Link
              href="/crisis/turkey-earthquake-2026"
              className="w-full sm:w-auto px-6 py-3 rounded-md bg-primary hover:bg-primary-hover active:bg-primary-focus text-white text-sm font-medium tracking-button flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(94,106,210,0.4)] transition-all"
            >
              <HeartHandshake className="w-4 h-4" />
              <span>Donate Emergency Funds</span>
            </Link>
            <Link
              href="/beneficiary"
              className="w-full sm:w-auto px-6 py-3 rounded-md bg-surface-1 hover:bg-surface-2 text-ink border border-hairline hover:border-hairline-strong text-sm font-medium tracking-button flex items-center justify-center gap-2 transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-semantic-success" />
              <span>Claim Aid (Zero Gas Fees)</span>
            </Link>
            <Link
              href="/oracle"
              className="w-full sm:w-auto px-6 py-3 rounded-md bg-surface-1 hover:bg-surface-2 text-ink-muted hover:text-ink border border-hairline text-sm font-medium tracking-button flex items-center justify-center gap-2 transition-all"
            >
              <Cpu className="w-4 h-4 text-primary" />
              <span>AI Oracle Simulator</span>
            </Link>
          </div>

          {/* Live Mission Ticker Banner (4-Up Card Bar) */}
          <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-xl bg-surface-1/80 border border-hairline backdrop-blur-md">
            <div className="flex flex-col items-start p-4 rounded-lg bg-surface-2/60 border border-hairline/60">
              <div className="flex items-center gap-2 text-xs font-mono text-ink-subtle mb-1">
                <span className="w-2 h-2 rounded-full bg-semantic-success animate-ping"></span>
                <span>ACTIVE CRISES</span>
              </div>
              <div className="text-2xl md:text-3xl font-semibold text-ink tracking-tight">4 Disasters</div>
              <div className="text-xs text-ink-tertiary mt-1">Live disaster pools monitored</div>
            </div>

            <div className="flex flex-col items-start p-4 rounded-lg bg-surface-2/60 border border-hairline/60">
              <div className="flex items-center gap-2 text-xs font-mono text-ink-subtle mb-1">
                <TrendingUp className="w-3.5 h-3.5 text-primary" />
                <span>MULTI-CHAIN FUNDS</span>
              </div>
              <div className="text-2xl md:text-3xl font-semibold text-primary tracking-tight">$1,240,500</div>
              <div className="text-xs text-ink-tertiary mt-1">Sepolia + Polygon Amoy</div>
            </div>

            <div className="flex flex-col items-start p-4 rounded-lg bg-surface-2/60 border border-hairline/60">
              <div className="flex items-center gap-2 text-xs font-mono text-ink-subtle mb-1">
                <Users className="w-3.5 h-3.5 text-semantic-success" />
                <span>VERIFIED VICTIMS</span>
              </div>
              <div className="text-2xl md:text-3xl font-semibold text-ink tracking-tight">14,280 Families</div>
              <div className="text-xs text-ink-tertiary mt-1">Keccak256 ZK Merkle Proofs</div>
            </div>

            <div className="flex flex-col items-start p-4 rounded-lg bg-surface-2/60 border border-hairline/60">
              <div className="flex items-center gap-2 text-xs font-mono text-ink-subtle mb-1">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span>DISBURSEMENT SPEED</span>
              </div>
              <div className="text-2xl md:text-3xl font-semibold text-ink tracking-tight">&lt; 2.4 Seconds</div>
              <div className="text-xs text-ink-tertiary mt-1">Zero bank wire delays</div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK LINKS SECTION (Explicitly required by user prompt) */}
      <QuickLinksSection />

      {/* ACTIVE EMERGENCY CRISIS POOLS GRID */}
      <section className="py-20 px-4 md:px-8 border-b border-hairline bg-canvas">
        <div className="max-w-[1280px] mx-auto">
          {/* Header & Filter Controls */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-primary" />
                <span className="text-xs font-mono tracking-eyebrow text-ink-subtle uppercase">ACTIVE EMERGENCY POOLS</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-headline text-ink">
                Live Disaster Command Center
              </h2>
            </div>

            {/* Category Tab Selector (Linear Pill Style) */}
            <div className="flex items-center gap-1.5 p-1 rounded-pill bg-surface-1 border border-hairline self-start md:self-auto">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-3 py-1.5 rounded-pill text-xs font-medium transition-all ${
                  activeTab === "all" ? "bg-surface-2 text-ink shadow-sm" : "text-ink-subtle hover:text-ink"
                }`}
              >
                All Crises (3)
              </button>
              <button
                onClick={() => setActiveTab("earthquake")}
                className={`px-3 py-1.5 rounded-pill text-xs font-medium transition-all ${
                  activeTab === "earthquake" ? "bg-surface-2 text-ink shadow-sm" : "text-ink-subtle hover:text-ink"
                }`}
              >
                Earthquakes
              </button>
              <button
                onClick={() => setActiveTab("flood")}
                className={`px-3 py-1.5 rounded-pill text-xs font-medium transition-all ${
                  activeTab === "flood" ? "bg-surface-2 text-ink shadow-sm" : "text-ink-subtle hover:text-ink"
                }`}
              >
                Floods
              </button>
              <button
                onClick={() => setActiveTab("drought")}
                className={`px-3 py-1.5 rounded-pill text-xs font-medium transition-all ${
                  activeTab === "drought" ? "bg-surface-2 text-ink shadow-sm" : "text-ink-subtle hover:text-ink"
                }`}
              >
                Droughts
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredCrises.map((crisis) => {
              const progressPct = Math.min(100, Math.round((crisis.raisedUSD / crisis.targetUSD) * 100));
              return (
                <div
                  key={crisis.id}
                  className="group rounded-lg bg-surface-1 border border-hairline hover:border-hairline-strong linear-card-hover overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Image Header with Badge Overlay */}
                    <div className="relative h-48 w-full overflow-hidden bg-surface-2">
                      <img
                        src={crisis.image}
                        alt={crisis.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-surface-1 via-transparent to-transparent"></div>

                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-pill bg-canvas/80 backdrop-blur-md text-ink text-[11px] font-mono border border-hairline">
                          {crisis.categoryName}
                        </span>
                        <span className="px-2 py-0.5 rounded-pill bg-red-950/80 text-red-400 backdrop-blur-md text-[11px] font-mono border border-red-800/50 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></span>
                          Mag {crisis.severityIndex} ({crisis.severityStatus})
                        </span>
                      </div>
                    </div>

                    {/* Content Interior */}
                    <div className="p-6">
                      <div className="text-xs font-mono text-ink-subtle mb-1">{crisis.location}</div>
                      <h3 className="text-xl font-medium tracking-card text-ink mb-4 group-hover:text-primary transition-colors">
                        {crisis.title}
                      </h3>

                      {/* Funding Progress Bar */}
                      <div className="space-y-2 mb-6">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-ink font-semibold">${crisis.raisedUSD.toLocaleString()} raised</span>
                          <span className="text-ink-subtle">Target: ${crisis.targetUSD.toLocaleString()} ({progressPct}%)</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-surface-3 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-primary-hover rounded-full transition-all duration-500"
                            style={{ width: `${progressPct}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* On-Chain Vault Addresses */}
                      <div className="p-3 rounded-md bg-canvas border border-hairline flex flex-col gap-1.5 text-xs font-mono mb-4">
                        <div className="flex items-center justify-between text-ink-subtle">
                          <span>Sepolia Vault:</span>
                          <span className="text-ink">{crisis.vaultAddresses.sepolia}</span>
                        </div>
                        <div className="flex items-center justify-between text-ink-subtle">
                          <span>Polygon Amoy:</span>
                          <span className="text-primary">{crisis.vaultAddresses.amoy}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="px-6 pb-6 pt-0 flex items-center gap-3">
                    <Link
                      href={`/crisis/${crisis.id}`}
                      className="flex-1 py-2 px-3 rounded-md bg-primary hover:bg-primary-hover text-white text-xs font-medium tracking-button text-center transition-all flex items-center justify-center gap-1.5"
                    >
                      <HeartHandshake className="w-3.5 h-3.5" />
                      <span>Donate Now</span>
                    </Link>
                    <Link
                      href="/audit"
                      className="py-2 px-3 rounded-md bg-surface-2 hover:bg-surface-3 text-ink-muted hover:text-ink text-xs font-mono border border-hairline transition-all"
                      title="View Audit Trail"
                    >
                      Audit
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PRODUCT UI SCREENSHOT / HIGH-FIDELITY FEATURE PREVIEWS */}
      <section className="py-20 px-4 md:px-8 border-b border-hairline bg-canvas">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-col items-center text-center mb-16">
            <span className="text-xs font-mono tracking-eyebrow text-primary uppercase mb-2">SYSTEM ARCHITECTURE & CRAFT</span>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-headline text-ink mb-4 max-w-3xl">
              Engineered for Speed, Privacy, and Uncompromising Auditability
            </h2>
            <p className="text-ink-subtle text-base md:text-lg max-w-2xl">
              Linear product UI framing with crisp charcoal panels, mono status indicators, and hairline execution.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Feature Panel 1: Cross-Chain Vaults */}
            <div className="p-8 rounded-xl bg-surface-1 border border-hairline hover:border-hairline-strong transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 rounded bg-primary/10 border border-primary/30 text-primary">
                    <Globe className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono text-ink-subtle">INNOVATION 01</span>
                </div>
                <h3 className="text-2xl font-semibold tracking-headline text-ink mb-3">
                  Cross-Chain Unified Liquidity Vaults
                </h3>
                <p className="text-sm text-ink-subtle leading-relaxed mb-6">
                  Donors contribute ETH on Ethereum Sepolia or POL on Polygon Amoy. Smart contracts unify multi-chain balances into a single, verifiable disaster relief reserve.
                </p>
              </div>

              {/* Mock UI Frame */}
              <div className="p-4 rounded-lg bg-canvas border border-hairline font-mono text-xs text-ink-muted space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-hairline">
                  <span className="text-ink font-semibold">Vault Bridge Sync</span>
                  <span className="text-semantic-success flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-semantic-success"></span> Live Sync
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 rounded bg-surface-2 border border-hairline">
                    <div className="text-[10px] text-ink-tertiary">SEPOLIA ETH VAULT</div>
                    <div className="text-sm text-ink font-bold mt-1">482.50 ETH</div>
                  </div>
                  <div className="p-2 rounded bg-surface-2 border border-hairline">
                    <div className="text-[10px] text-ink-tertiary">POLYGON AMOY VAULT</div>
                    <div className="text-sm text-primary font-bold mt-1">1,240,000 POL</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Panel 2: Gemini 2.5 Flash Oracle */}
            <div className="p-8 rounded-xl bg-surface-1 border border-hairline hover:border-hairline-strong transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 rounded bg-primary/10 border border-primary/30 text-primary">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono text-ink-subtle">INNOVATION 02</span>
                </div>
                <h3 className="text-2xl font-semibold tracking-headline text-ink mb-3">
                  Google Gemini 2.5 Flash Severity Oracle
                </h3>
                <p className="text-sm text-ink-subtle leading-relaxed mb-6">
                  Automated AI monitoring evaluates seismic magnitude and satellite damage photos. When severity exceeds 7.0, Gemini auto-releases 20% emergency contingency funds in seconds.
                </p>
              </div>

              {/* Mock UI Frame */}
              <div className="p-4 rounded-lg bg-canvas border border-hairline font-mono text-xs text-ink-muted space-y-2">
                <div className="flex items-center justify-between text-ink">
                  <span>Gemini Vision Model:</span>
                  <span className="text-primary font-semibold">gemini-2.5-flash</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Damage Authenticity:</span>
                  <span className="text-semantic-success font-semibold">99.4% Verified Real</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Emergency Unlock Trigger:</span>
                  <span className="text-ink-muted">Auto-Release Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE ON-CHAIN ACTIVITY STREAM */}
      <section className="py-20 px-4 md:px-8 border-b border-hairline bg-canvas">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-mono text-semantic-success flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full bg-semantic-success animate-pulse"></span>
                LIVE PUBLIC AUDIT STREAM
              </span>
              <h2 className="text-2xl md:text-3xl font-semibold tracking-headline text-ink">
                Real-Time On-Chain Transactions
              </h2>
            </div>
            <Link
              href="/audit"
              className="text-xs font-mono text-primary hover:text-primary-hover flex items-center gap-1"
            >
              <span>View Full Glass-Box Audit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="rounded-lg bg-surface-1 border border-hairline divide-y divide-hairline overflow-hidden">
            {liveTransactions.map((tx, idx) => (
              <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surface-2 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-canvas border border-hairline flex items-center justify-center text-primary font-mono text-xs">
                    {tx.chainBadge}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-ink font-semibold">
                      <span>{tx.type}</span>
                      <span className="text-ink-tertiary">•</span>
                      <span className="text-primary">{tx.amount}</span>
                    </div>
                    <div className="text-xs text-ink-subtle">{tx.target}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono text-ink-tertiary">
                  <span>{tx.time}</span>
                  <span className="text-ink-muted">{tx.hash}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-ink-subtle cursor-pointer hover:text-ink" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING CTA BANNER (Linear CTA Banner Spec) */}
      <section className="py-20 px-4 md:px-8 bg-canvas">
        <div className="max-w-[1280px] mx-auto p-10 md:p-16 rounded-xl bg-surface-1 border border-hairline relative overflow-hidden text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary mb-6">
            <Zap className="w-6 h-6" />
          </div>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-headline text-ink max-w-2xl mb-4">
            Transform Humanitarian Aid with Verifiable Precision
          </h2>
          <p className="text-ink-subtle text-base md:text-lg max-w-xl mb-8">
            Experience 100% direct-to-victim payouts with zero fees, zero delays, and transparent visual audit trails.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/crisis/turkey-earthquake-2026"
              className="px-6 py-3 rounded-md bg-primary hover:bg-primary-hover text-white text-sm font-medium tracking-button transition-all shadow-[0_0_24px_rgba(94,106,210,0.4)]"
            >
              Make Multi-Chain Donation
            </Link>
            <Link
              href="/audit"
              className="px-6 py-3 rounded-md bg-surface-2 hover:bg-surface-3 text-ink text-sm font-medium tracking-button border border-hairline transition-all"
            >
              Inspect Live Audit Ledger
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
