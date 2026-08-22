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
      statusColor: "text-red-400 border-red-900/50 bg-red-950/20",
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
      statusColor: "text-amber-400 border-amber-900/50 bg-amber-950/20",
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
      statusColor: "text-blue-400 border-blue-900/50 bg-blue-950/20",
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
    <div className="w-full bg-canvas text-ink min-h-screen">
      {/* PROTOCOL STATS HEADER */}
      <section className="pt-10 pb-8 px-4 md:px-8 border-b border-hairline bg-canvas">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[11px] font-mono tracking-eyebrow text-ink-subtle uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-semantic-success animate-pulse"></span>
                <span>Crisis Command Center</span>
                <span className="text-hairline-strong">•</span>
                <span className="text-primary font-medium">Live Telemetry</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-ink">
                Cross-Chain Emergency Aid Protocol
              </h1>
              <p className="text-xs md:text-sm text-ink-subtle max-w-xl leading-relaxed">
                Multi-chain liquidity vaults automatically unlocked via Gemini AI telemetry and disbursed directly to verified victims with zero gas fees.
              </p>
            </div>

            {/* Quick Action CTAs */}
            <div className="flex items-center gap-2">
              <Link
                href="/crisis/turkey-earthquake-2026"
                className="px-3.5 py-1.5 rounded-md bg-primary hover:bg-primary-hover active:bg-primary-focus text-white text-xs font-medium tracking-button flex items-center gap-1.5 transition-colors"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Donate to Active Crisis</span>
              </Link>
              <Link
                href="/audit"
                className="px-3.5 py-1.5 rounded-md bg-surface-1 hover:bg-surface-2 text-ink text-xs font-medium border border-hairline hover:border-hairline-strong flex items-center gap-1.5 transition-colors"
              >
                <Search className="w-3.5 h-3.5 text-ink-subtle" />
                <span>Live Audit Ledger</span>
              </Link>
            </div>
          </div>

          {/* 4 Protocol Stat Tiles */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-lg bg-surface-1 border border-hairline">
              <div className="text-[11px] font-mono text-ink-tertiary uppercase mb-1">Aggregated Vault Liquidity</div>
              <div className="text-lg font-mono font-semibold text-ink">$1,240,500</div>
              <div className="text-[10px] font-mono text-semantic-success mt-0.5">ETH Sepolia + Polygon Amoy</div>
            </div>
            <div className="p-3.5 rounded-lg bg-surface-1 border border-hairline">
              <div className="text-[11px] font-mono text-ink-tertiary uppercase mb-1">Direct Aid Disbursed</div>
              <div className="text-lg font-mono font-semibold text-primary">$980,000</div>
              <div className="text-[10px] font-mono text-ink-subtle mt-0.5">100% to verified victims</div>
            </div>
            <div className="p-3.5 rounded-lg bg-surface-1 border border-hairline">
              <div className="text-[11px] font-mono text-ink-tertiary uppercase mb-1">Verified Beneficiaries</div>
              <div className="text-lg font-mono font-semibold text-ink">14,280</div>
              <div className="text-[10px] font-mono text-ink-subtle mt-0.5">Gasless Merkle claims</div>
            </div>
            <div className="p-3.5 rounded-lg bg-surface-1 border border-hairline">
              <div className="text-[11px] font-mono text-ink-tertiary uppercase mb-1">AI Triggers Active</div>
              <div className="text-lg font-mono font-semibold text-semantic-success">3 / 3 Vaults</div>
              <div className="text-[10px] font-mono text-ink-subtle mt-0.5">Gemini 2.5 Flash Oracle</div>
            </div>
          </div>
        </div>
      </section>

      {/* ACTIVE CRISIS SECTION */}
      <section className="py-12 px-4 md:px-8 max-w-[1280px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg md:text-xl font-semibold tracking-tight text-ink flex items-center gap-2">
              <Radio className="w-4 h-4 text-primary" /> Active Disaster Liquidity Vaults
            </h2>
            <p className="text-xs text-ink-subtle mt-0.5">
              Live multi-chain emergency pools receiving global liquidity and disbursing direct victim aid.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-md bg-surface-1 border border-hairline text-xs font-mono">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-2.5 py-1 rounded transition-colors ${
                activeTab === "all" ? "bg-surface-3 text-ink font-medium" : "text-ink-subtle hover:text-ink"
              }`}
            >
              All ({crises.length})
            </button>
            <button
              onClick={() => setActiveTab("earthquake")}
              className={`px-2.5 py-1 rounded transition-colors ${
                activeTab === "earthquake" ? "bg-surface-3 text-ink font-medium" : "text-ink-subtle hover:text-ink"
              }`}
            >
              Earthquake
            </button>
            <button
              onClick={() => setActiveTab("flood")}
              className={`px-2.5 py-1 rounded transition-colors ${
                activeTab === "flood" ? "bg-surface-3 text-ink font-medium" : "text-ink-subtle hover:text-ink"
              }`}
            >
              Flood
            </button>
            <button
              onClick={() => setActiveTab("drought")}
              className={`px-2.5 py-1 rounded transition-colors ${
                activeTab === "drought" ? "bg-surface-3 text-ink font-medium" : "text-ink-subtle hover:text-ink"
              }`}
            >
              Drought
            </button>
          </div>
        </div>

        {/* ACTIVE CRISIS LIVE TELEMETRY BANNER (7 KEY METRICS) */}
        <div className="mb-8 p-5 rounded-lg bg-surface-1 border border-hairline/80 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 mb-3.5 border-b border-hairline">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-semantic-success animate-pulse" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-ink">
                Priority Active Crisis Live Telemetry Stream
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-pill bg-red-950/40 text-red-400 border border-red-900/50">
                CRITICAL DISPATCH
              </span>
            </div>
            <div className="text-xs font-mono text-ink-subtle flex items-center gap-1.5">
              <span>🔄 Last Updated:</span>
              <strong className="text-ink font-semibold">3 sec ago</strong>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5 font-mono text-xs">
            <div className="p-2.5 rounded bg-canvas border border-hairline">
              <div className="text-[10px] text-ink-tertiary uppercase">🟢 Status</div>
              <div className="text-emerald-400 font-semibold text-[11px] mt-0.5 truncate">Active — Critical</div>
            </div>
            <div className="p-2.5 rounded bg-canvas border border-hairline">
              <div className="text-[10px] text-ink-tertiary uppercase">🕐 Started</div>
              <div className="text-ink font-semibold text-[11px] mt-0.5">14:32 UTC</div>
            </div>
            <div className="p-2.5 rounded bg-canvas border border-hairline">
              <div className="text-[10px] text-ink-tertiary uppercase">📈 Severity</div>
              <div className="text-red-400 font-semibold text-[11px] mt-0.5">9.4/10</div>
            </div>
            <div className="p-2.5 rounded bg-canvas border border-hairline">
              <div className="text-[10px] text-ink-tertiary uppercase">👥 People Affected</div>
              <div className="text-ink font-semibold text-[11px] mt-0.5">2.4M</div>
            </div>
            <div className="p-2.5 rounded bg-canvas border border-hairline">
              <div className="text-[10px] text-ink-tertiary uppercase">🚨 Immediate Aid</div>
              <div className="text-primary font-semibold text-[11px] mt-0.5">842K</div>
            </div>
            <div className="p-2.5 rounded bg-canvas border border-hairline">
              <div className="text-[10px] text-ink-tertiary uppercase">🗺️ Affected Area</div>
              <div className="text-ink font-semibold text-[11px] mt-0.5 truncate">18,420 km²</div>
            </div>
            <div className="p-2.5 rounded bg-canvas border border-hairline">
              <div className="text-[10px] text-ink-tertiary uppercase">🔄 Last Updated</div>
              <div className="text-ink font-semibold text-[11px] mt-0.5">3 sec ago</div>
            </div>
          </div>
        </div>

        {/* Crisis Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {filteredCrises.map((crisis) => {
            const percent = Math.min(100, Math.round((crisis.raisedUSD / crisis.targetUSD) * 100));
            return (
              <div
                key={crisis.id}
                className="flex flex-col justify-between p-5 rounded-lg bg-surface-1 border border-hairline hover:border-hairline-strong transition-all"
              >
                <div>
                  {/* Top Status & Severity Pill */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`px-2 py-0.5 rounded-pill text-[10px] font-mono uppercase border ${crisis.statusColor}`}>
                      {crisis.severityStatus} • {crisis.severity}
                    </span>
                    <span className="text-[11px] font-mono text-ink-subtle">
                      {crisis.categoryName}
                    </span>
                  </div>

                  {/* Crisis Title & Location */}
                  <h3 className="text-base font-semibold tracking-tight text-ink mb-1">
                    {crisis.title}
                  </h3>
                  <div className="text-xs text-ink-subtle flex items-center gap-1 mb-3">
                    <Globe className="w-3.5 h-3.5 text-ink-tertiary" />
                    <span>{crisis.location}</span>
                  </div>

                  {/* Incident Quick Metrics Grid (7 Points) */}
                  <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono mb-3.5 p-2 rounded bg-canvas border border-hairline">
                    <div className="flex items-center justify-between">
                      <span className="text-ink-tertiary">🟢 Status:</span>
                      <span className="text-ink font-medium">{crisis.status}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-ink-tertiary">🕐 Started:</span>
                      <span className="text-ink font-medium">{crisis.started}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-ink-tertiary">👥 Affected:</span>
                      <span className="text-ink font-medium">{crisis.peopleAffected}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-ink-tertiary">🚨 Aid Req:</span>
                      <span className="text-primary font-medium">{crisis.immediateAidRequired}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-ink-tertiary">🗺️ Area:</span>
                      <span className="text-ink font-medium">{crisis.affectedArea}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-ink-tertiary">🔄 Updated:</span>
                      <span className="text-ink-subtle">{crisis.lastUpdated}</span>
                    </div>
                  </div>

                  {/* Telemetry strip */}
                  <div className="p-2.5 rounded bg-surface-2 border border-hairline text-[11px] font-mono text-ink-subtle mb-4">
                    <div className="text-ink-tertiary text-[10px] uppercase mb-0.5">Live Sensor Telemetry:</div>
                    <div className="text-ink-muted">{crisis.telemetry}</div>
                  </div>

                  {/* Funding Progress */}
                  <div className="space-y-1.5 mb-4">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-ink-subtle">Aggregated Pool:</span>
                      <span className="text-ink font-medium">${crisis.raisedUSD.toLocaleString()} / ${crisis.targetUSD.toLocaleString()}</span>
                    </div>
                    <div className="w-full h-1.5 bg-surface-3 rounded-pill overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-pill transition-all"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-ink-tertiary">
                      <span>{percent}% Funded</span>
                      <span>${crisis.disbursedUSD.toLocaleString()} Disbursed</span>
                    </div>
                  </div>

                  {/* Multi-Chain Vaults */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-3 border-t border-hairline mb-4">
                    <div className="p-2 rounded bg-canvas border border-hairline">
                      <div className="text-ink-tertiary text-[10px]">ETH Sepolia:</div>
                      <div className="text-ink font-mono">{crisis.vaultAddresses.sepolia}</div>
                    </div>
                    <div className="p-2 rounded bg-canvas border border-hairline">
                      <div className="text-ink-tertiary text-[10px]">Polygon Amoy:</div>
                      <div className="text-ink font-mono">{crisis.vaultAddresses.amoy}</div>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Link
                    href={`/crisis/${crisis.id}`}
                    className="py-2 px-3 rounded-md bg-primary hover:bg-primary-hover active:bg-primary-focus text-white text-xs font-medium tracking-button text-center flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <HeartHandshake className="w-3.5 h-3.5" />
                    <span>Open Vault</span>
                  </Link>
                  <Link
                    href="/audit"
                    className="py-2 px-3 rounded-md bg-surface-2 hover:bg-surface-3 text-ink text-xs font-medium border border-hairline text-center flex items-center justify-center gap-1 transition-colors"
                  >
                    <span>Audit Flow</span>
                    <ArrowRight className="w-3 h-3 text-ink-subtle" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* REAL-TIME TELEMETRY & LIVE TRANSACTIONS */}
      <section className="py-10 px-4 md:px-8 border-t border-hairline bg-surface-1/50">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Gemini AI Severity Engine Box */}
          <div className="p-5 rounded-lg bg-surface-1 border border-hairline">
            <div className="flex items-center justify-between pb-3 border-b border-hairline mb-4">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold uppercase font-mono text-ink">Gemini 2.5 Flash Oracle</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-pill bg-semantic-success/10 text-semantic-success border border-semantic-success/30">
                ACTIVE
              </span>
            </div>

            <p className="text-xs text-ink-subtle leading-relaxed mb-4">
              Real-time seismic Richter telemetry and satellite optical damage layers are continuously ingested. Automated smart contract release activates when severity &ge; 7.0.
            </p>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded bg-canvas border border-hairline flex items-center justify-between">
                <span className="text-ink-subtle">Seismic Severity Model:</span>
                <span className="text-red-400 font-semibold">9.4 / 10 (Critical)</span>
              </div>
              <div className="p-2.5 rounded bg-canvas border border-hairline flex items-center justify-between">
                <span className="text-ink-subtle">Automated Contingency:</span>
                <span className="text-semantic-success font-semibold">20% Unlocked</span>
              </div>
            </div>

            <Link
              href="/oracle"
              className="mt-4 w-full py-2 px-3 rounded-md bg-canvas hover:bg-surface-2 text-ink text-xs font-medium border border-hairline flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Test AI Oracle Simulator</span>
              <ArrowRight className="w-3 h-3 text-ink-subtle" />
            </Link>
          </div>

          {/* Live Protocol Stream (2 Cols) */}
          <div className="lg:col-span-2 p-5 rounded-lg bg-surface-1 border border-hairline">
            <div className="flex items-center justify-between pb-3 border-b border-hairline mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold uppercase font-mono text-ink">Live On-Chain Transaction Stream</span>
              </div>
              <span className="text-[10px] font-mono text-ink-tertiary">Real-Time WebSocket</span>
            </div>

            <div className="space-y-2 font-mono text-xs">
              {liveTransactions.map((tx, i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded bg-canvas border border-hairline hover:border-hairline-strong transition-colors gap-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-surface-2 border border-hairline text-ink-muted">
                      {tx.chainBadge}
                    </span>
                    <span className="text-ink-muted">{tx.hash}</span>
                    <span className="text-ink-tertiary">•</span>
                    <span className="text-ink font-medium">{tx.type}</span>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 text-[11px]">
                    <span className="text-primary font-medium">{tx.amount}</span>
                    <span className="text-ink-subtle">{tx.target}</span>
                    <span className="text-ink-tertiary">{tx.time}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-ink-subtle pt-2 border-t border-hairline">
              <span>All transfers verifiable on Blockscout & Sepolia Etherscan.</span>
              <Link href="/audit" className="text-primary hover:underline flex items-center gap-1 font-mono text-[11px]">
                Full Audit Flow <ArrowRight className="w-3 h-3" />
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
