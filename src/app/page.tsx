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
  Radio,
  ExternalLink
} from "lucide-react";

export default function CommandCenterHome() {
  const [activeTab, setActiveTab] = useState<"all" | "earthquake" | "flood" | "drought">("all");

  const crises = [
    {
      id: "turkey-earthquake-2026",
      title: "Turkey-Syria 7.8M Earthquake Emergency",
      category: "earthquake",
      categoryName: "Earthquake",
      location: "Kahramanmaraş & Gaziantep, Turkey",
      status: "Active — Critical",
      started: "14:32 UTC",
      severity: "9.4/10",
      peopleAffected: "2.4M",
      immediateAidRequired: "842K",
      affectedArea: "18,420 km²",
      lastUpdated: "3 sec ago",
      raisedUSD: 684200,
      targetUSD: 1000000,
      severityIndex: 9.4,
      severityStatus: "CRITICAL",
      statusBadge: "bg-red-50 text-semantic-down border-red-200",
      victimsVerified: 8420,
      disbursedUSD: 540000,
      vaultAddresses: {
        sepolia: "0x3A9F...8b21",
        amoy: "0x7E12...4c09",
      },
      telemetry: "USGS Station TUR-042 • Depth: 17.9km • PGA: 0.72g",
    },
    {
      id: "kerala-flood-2026",
      title: "South Asia Monsoon Flash Flood Relief",
      category: "flood",
      categoryName: "Flood",
      location: "Wayanad, Kerala, India",
      status: "Active — High Alert",
      started: "06:15 UTC",
      severity: "8.1/10",
      peopleAffected: "1.1M",
      immediateAidRequired: "320K",
      affectedArea: "4,200 km²",
      lastUpdated: "12 sec ago",
      raisedUSD: 342100,
      targetUSD: 500000,
      severityIndex: 8.1,
      severityStatus: "HIGH ALERT",
      statusBadge: "bg-amber-50 text-amber-700 border-amber-200",
      victimsVerified: 4180,
      disbursedUSD: 280000,
      vaultAddresses: {
        sepolia: "0x11B9...6e44",
        amoy: "0x98D2...1a33",
      },
      telemetry: "CWC Sensor IND-09 • River Level +4.2m above danger",
    },
    {
      id: "horn-of-africa-2026",
      title: "Horn of Africa Severe Drought Crisis",
      category: "drought",
      categoryName: "Drought",
      location: "Somalia & Eastern Ethiopia",
      status: "Active — Elevated",
      started: "03:40 UTC",
      severity: "7.6/10",
      peopleAffected: "4.8M",
      immediateAidRequired: "1.2M",
      affectedArea: "65,000 km²",
      lastUpdated: "45 sec ago",
      raisedUSD: 214200,
      targetUSD: 400000,
      severityIndex: 7.6,
      severityStatus: "ELEVATED",
      statusBadge: "bg-blue-50 text-primary border-blue-200",
      victimsVerified: 1680,
      disbursedUSD: 160000,
      vaultAddresses: {
        sepolia: "0x55C1...3d99",
        amoy: "0x22F4...7e11",
      },
      telemetry: "NDVI Satellite Index: -0.42 • Precipitation deficit: 68%",
    },
  ];

  const filteredCrises = activeTab === "all" ? crises : crises.filter((c) => c.category === activeTab);

  const liveTransactions = [
    {
      hash: "0x9f1a...4b22",
      chainBadge: "POL",
      type: "Donation",
      amount: "$2,500 POL",
      target: "Turkey Relief Vault",
      time: "12s ago",
    },
    {
      hash: "0x4c88...1d09",
      chainBadge: "ETH",
      type: "Aid Payout",
      amount: "$150 USDC",
      target: "Victim #Merkle-8831 (Gasless)",
      time: "34s ago",
    },
    {
      hash: "0x1b77...8e34",
      chainBadge: "POL",
      type: "AI Release",
      amount: "$50,000 POL",
      target: "Gemini 2.5 Auto Unlock (20%)",
      time: "1m ago",
    },
    {
      hash: "0x82e0...5f11",
      chainBadge: "ETH",
      type: "Donation",
      amount: "1.5 ETH ($4,120)",
      target: "Kerala Flood Pool",
      time: "2m ago",
    },
  ];

  return (
    <div className="w-full bg-white text-ink min-h-screen">
      {/* HERO & PROTOCOL STATS */}
      <section className="pt-14 pb-12 px-4 md:px-8 border-b border-hairline bg-white">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-soft border border-hairline text-xs font-mono text-body">
                <span className="w-2 h-2 rounded-full bg-semantic-up animate-pulse"></span>
                <span>Crisis Command Center</span>
                <span className="text-hairline">|</span>
                <span className="text-primary font-medium">Real-Time Telemetry</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-normal tracking-tight text-ink">
                Autonomous Disaster Liquidity Vaults
              </h1>
              <p className="text-sm md:text-base text-body max-w-xl leading-relaxed">
                Multi-chain emergency pools triggered automatically via Gemini AI seismic telemetry and disbursed to verified victims with zero gas fees.
              </p>
            </div>

            {/* Quick Action CTAs */}
            <div className="flex items-center gap-3">
              <Link
                href="/crisis/turkey-earthquake-2026"
                className="px-6 py-3 rounded-full bg-primary hover:bg-primary-hover active:bg-primary-active text-white text-sm font-semibold flex items-center gap-2 transition-all shadow-sm"
              >
                <Zap className="w-4 h-4" />
                <span>Donate to Active Crisis</span>
              </Link>
              <Link
                href="/audit"
                className="px-5 py-3 rounded-full bg-surface-soft hover:bg-surface-strong text-ink text-sm font-semibold border border-hairline flex items-center gap-2 transition-colors"
              >
                <Search className="w-4 h-4 text-body" />
                <span>Live Audit Ledger</span>
              </Link>
            </div>
          </div>

          {/* 4 Protocol Stat Tiles */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-surface-soft border border-hairline">
              <div className="text-xs font-semibold text-body uppercase tracking-wider mb-1">Aggregated Vaults</div>
              <div className="text-2xl font-mono font-semibold text-ink">$1,240,500</div>
              <div className="text-xs font-mono text-semantic-up mt-1">Sepolia + Amoy Unified</div>
            </div>
            <div className="p-5 rounded-2xl bg-surface-soft border border-hairline">
              <div className="text-xs font-semibold text-body uppercase tracking-wider mb-1">Aid Disbursed</div>
              <div className="text-2xl font-mono font-semibold text-primary">$980,000</div>
              <div className="text-xs font-mono text-body mt-1">100% to verified victims</div>
            </div>
            <div className="p-5 rounded-2xl bg-surface-soft border border-hairline">
              <div className="text-xs font-semibold text-body uppercase tracking-wider mb-1">Verified Beneficiaries</div>
              <div className="text-2xl font-mono font-semibold text-ink">14,280</div>
              <div className="text-xs font-mono text-body mt-1">Gasless Merkle claims</div>
            </div>
            <div className="p-5 rounded-2xl bg-surface-soft border border-hairline">
              <div className="text-xs font-semibold text-body uppercase tracking-wider mb-1">AI Triggers Active</div>
              <div className="text-2xl font-mono font-semibold text-semantic-up">3 / 3 Vaults</div>
              <div className="text-xs font-mono text-body mt-1">Gemini 2.5 Flash Oracle</div>
            </div>
          </div>
        </div>
      </section>

      {/* ACTIVE CRISIS SECTION */}
      <section className="py-14 px-4 md:px-8 max-w-[1280px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl md:text-2xl font-normal tracking-tight text-ink flex items-center gap-2">
              <Radio className="w-5 h-5 text-primary" /> Active Disaster Liquidity Vaults
            </h2>
            <p className="text-sm text-body mt-1">
              Live emergency pools receiving global liquidity and disbursing direct victim aid.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-surface-soft border border-hairline text-xs font-medium">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-1.5 rounded-full transition-colors ${
                activeTab === "all" ? "bg-white text-ink font-semibold shadow-sm" : "text-body hover:text-ink"
              }`}
            >
              All ({crises.length})
            </button>
            <button
              onClick={() => setActiveTab("earthquake")}
              className={`px-4 py-1.5 rounded-full transition-colors ${
                activeTab === "earthquake" ? "bg-white text-ink font-semibold shadow-sm" : "text-body hover:text-ink"
              }`}
            >
              Earthquake
            </button>
            <button
              onClick={() => setActiveTab("flood")}
              className={`px-4 py-1.5 rounded-full transition-colors ${
                activeTab === "flood" ? "bg-white text-ink font-semibold shadow-sm" : "text-body hover:text-ink"
              }`}
            >
              Flood
            </button>
            <button
              onClick={() => setActiveTab("drought")}
              className={`px-4 py-1.5 rounded-full transition-colors ${
                activeTab === "drought" ? "bg-white text-ink font-semibold shadow-sm" : "text-body hover:text-ink"
              }`}
            >
              Drought
            </button>
          </div>
        </div>

        {/* Priority Telemetry Strip */}
        <div className="mb-8 p-5 rounded-2xl bg-surface-soft border border-hairline shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-3 border-b border-hairline">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-semantic-up animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider text-ink">
                Priority Active Crisis Telemetry
              </span>
              <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-red-50 text-semantic-down border border-red-200">
                CRITICAL
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono text-body">
              <div>Updated: <strong className="text-ink">3s ago</strong></div>
              <Link
                href="/crisis/turkey-earthquake-2026#live-crisis-map"
                className="text-primary hover:underline font-semibold flex items-center gap-1"
              >
                <span>Live Map</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-white border border-hairline">
              <div className="text-[10px] text-body uppercase font-medium">Status</div>
              <div className="text-semantic-down font-semibold mt-0.5">Active — Critical</div>
            </div>
            <div className="p-3 rounded-xl bg-white border border-hairline">
              <div className="text-[10px] text-body uppercase font-medium">Started</div>
              <div className="text-ink font-semibold mt-0.5">14:32 UTC</div>
            </div>
            <div className="p-3 rounded-xl bg-white border border-hairline">
              <div className="text-[10px] text-body uppercase font-medium">Severity</div>
              <div className="text-semantic-down font-semibold mt-0.5">9.4 / 10</div>
            </div>
            <div className="p-3 rounded-xl bg-white border border-hairline">
              <div className="text-[10px] text-body uppercase font-medium">Affected</div>
              <div className="text-ink font-semibold mt-0.5">2.4M People</div>
            </div>
            <div className="p-3 rounded-xl bg-white border border-hairline">
              <div className="text-[10px] text-body uppercase font-medium">Immediate Aid</div>
              <div className="text-primary font-semibold mt-0.5">842K Needed</div>
            </div>
            <div className="p-3 rounded-xl bg-white border border-hairline">
              <div className="text-[10px] text-body uppercase font-medium">Area</div>
              <div className="text-ink font-semibold mt-0.5">18,420 km²</div>
            </div>
          </div>
        </div>

        {/* Crisis Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {filteredCrises.map((crisis) => {
            const percent = Math.min(100, Math.round((crisis.raisedUSD / crisis.targetUSD) * 100));
            return (
              <div
                key={crisis.id}
                className="flex flex-col justify-between p-6 rounded-2xl bg-white border border-hairline hover:shadow-card hover:border-hairline transition-all"
              >
                <div>
                  {/* Top Status & Category Badge */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase border ${crisis.statusBadge}`}>
                      {crisis.severityStatus} • {crisis.severity}
                    </span>
                    <span className="text-xs font-medium text-body">
                      {crisis.categoryName}
                    </span>
                  </div>

                  {/* Crisis Title & Location */}
                  <h3 className="text-base font-semibold text-ink mb-1.5">
                    {crisis.title}
                  </h3>
                  <div className="text-xs text-body flex items-center gap-1 mb-4">
                    <Globe className="w-3.5 h-3.5 text-muted" />
                    <span>{crisis.location}</span>
                  </div>

                  {/* Telemetry strip */}
                  <div className="p-3 rounded-xl bg-surface-soft border border-hairline text-xs font-mono text-body mb-5">
                    <div className="text-[10px] text-muted uppercase font-semibold mb-0.5">Live Sensor:</div>
                    <div className="text-ink">{crisis.telemetry}</div>
                  </div>

                  {/* Funding Progress */}
                  <div className="space-y-2 mb-5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-body">Pool Raised:</span>
                      <span className="text-ink font-semibold">${crisis.raisedUSD.toLocaleString()} / ${crisis.targetUSD.toLocaleString()}</span>
                    </div>
                    <div className="w-full h-2 bg-surface-strong rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-xs font-mono text-muted">
                      <span>{percent}% Funded</span>
                      <span>${crisis.disbursedUSD.toLocaleString()} Disbursed</span>
                    </div>
                  </div>

                  {/* Multi-Chain Vaults */}
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-4 border-t border-hairline mb-5">
                    <div className="p-2 rounded-lg bg-surface-soft border border-hairline">
                      <div className="text-[10px] text-muted">Sepolia Vault:</div>
                      <div className="text-ink font-mono">{crisis.vaultAddresses.sepolia}</div>
                    </div>
                    <div className="p-2 rounded-lg bg-surface-soft border border-hairline">
                      <div className="text-[10px] text-muted">Amoy Vault:</div>
                      <div className="text-ink font-mono">{crisis.vaultAddresses.amoy}</div>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Link
                    href={`/crisis/${crisis.id}`}
                    className="py-2.5 px-4 rounded-full bg-primary hover:bg-primary-hover active:bg-primary-active text-white text-xs font-semibold text-center flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <HeartHandshake className="w-3.5 h-3.5" />
                    <span>Open Vault</span>
                  </Link>
                  <Link
                    href="/audit"
                    className="py-2.5 px-4 rounded-full bg-surface-soft hover:bg-surface-strong text-ink text-xs font-semibold border border-hairline text-center flex items-center justify-center gap-1 transition-colors"
                  >
                    <span>Audit Flow</span>
                    <ArrowRight className="w-3 h-3 text-body" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* REAL-TIME TELEMETRY & LIVE TRANSACTIONS */}
      <section className="py-14 px-4 md:px-8 border-t border-hairline bg-surface-soft">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Gemini AI Severity Engine Box */}
          <div className="p-6 rounded-2xl bg-white border border-hairline">
            <div className="flex items-center justify-between pb-3 border-b border-hairline mb-4">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold uppercase text-ink">Gemini 2.5 Flash Oracle</span>
              </div>
              <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-semantic-up border border-emerald-200">
                ACTIVE
              </span>
            </div>

            <p className="text-xs text-body leading-relaxed mb-4">
              Real-time seismic Richter telemetry is continuously ingested. Automated smart contract release activates when severity &ge; 7.0.
            </p>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-3 rounded-xl bg-surface-soft border border-hairline flex items-center justify-between">
                <span className="text-body">Seismic Severity:</span>
                <span className="text-semantic-down font-semibold">9.4 / 10 (Critical)</span>
              </div>
              <div className="p-3 rounded-xl bg-surface-soft border border-hairline flex items-center justify-between">
                <span className="text-body">Contingency Release:</span>
                <span className="text-semantic-up font-semibold">20% Unlocked</span>
              </div>
            </div>

            <Link
              href="/oracle"
              className="mt-5 w-full py-2.5 px-4 rounded-full bg-surface-soft hover:bg-surface-strong text-ink text-xs font-semibold border border-hairline flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Test AI Oracle Simulator</span>
              <ArrowRight className="w-3.5 h-3.5 text-body" />
            </Link>
          </div>

          {/* Live Protocol Stream (2 Cols) */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-hairline">
            <div className="flex items-center justify-between pb-3 border-b border-hairline mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold uppercase text-ink">Live On-Chain Stream</span>
              </div>
              <span className="text-xs font-mono text-muted">Real-Time WebSocket</span>
            </div>

            <div className="space-y-2 font-mono text-xs">
              {liveTransactions.map((tx, i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-surface-soft border border-hairline hover:bg-surface-strong transition-colors gap-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-white border border-hairline text-ink font-semibold">
                      {tx.chainBadge}
                    </span>
                    <span className="text-body">{tx.hash}</span>
                    <span className="text-hairline">•</span>
                    <span className="text-ink font-medium">{tx.type}</span>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
                    <span className="text-primary font-semibold">{tx.amount}</span>
                    <span className="text-body">{tx.target}</span>
                    <span className="text-muted">{tx.time}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-body pt-3 border-t border-hairline">
              <span>Verifiable on PolygonScan & Sepolia Etherscan.</span>
              <Link href="/audit" className="text-primary hover:underline font-semibold flex items-center gap-1">
                Full Audit Flow <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK LINKS SECTION TO ALL MODULES */}
      <QuickLinksSection />
    </div>
  );
}
