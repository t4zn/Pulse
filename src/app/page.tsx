"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SwapModal } from "@/components/SwapModal";
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
  ExternalLink,
  ArrowDownUp,
  TrendingUp,
  Layers,
  Sparkles,
  MapPin,
  Clock,
  ChevronRight,
  Shield,
  FileCheck2,
  BadgeCheck,
  Fuel
} from "lucide-react";

export default function CommandCenterHome() {
  const [activeTab, setActiveTab] = useState<"all" | "earthquake" | "flood" | "drought">("all");
  const [swapModalOpen, setSwapModalOpen] = useState(false);

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
      statusBadge: "bg-rose-50 text-rose-700 border-rose-200",
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
      statusBadge: "bg-blue-50 text-blue-700 border-blue-200",
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

  const coreModules = [
    {
      title: "Disaster Vaults",
      desc: "Deposit into unified multi-chain emergency liquidity pools with automated contingency release.",
      href: "/crisis/turkey-earthquake-2026",
      icon: HeartHandshake,
      badge: "ACTIVE VAULTS",
      badgeColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
    },
    {
      title: "Zero-Knowledge Claims",
      desc: "Victims verify aid eligibility via Keccak256 Merkle proofs with $0 gas fees sponsored by Pulse Relayer.",
      href: "/beneficiary",
      icon: ShieldCheck,
      badge: "ZERO-GAS",
      badgeColor: "text-blue-700 bg-blue-50 border-blue-200",
    },
    {
      title: "AI Severity Oracle",
      desc: "Simulate real-time seismic sensor ingestion and trigger automated 20% emergency reserve unlocks.",
      href: "/oracle",
      icon: Cpu,
      badge: "GEMINI 2.5",
      badgeColor: "text-indigo-700 bg-indigo-50 border-indigo-200",
    },
    {
      title: "Live Audit Ledger",
      desc: "Track every dollar from donor wallet to beneficiary with IPFS-pinned delivery photo receipts.",
      href: "/audit",
      icon: Search,
      badge: "100% AUDITABLE",
      badgeColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
    },
  ];

  return (
    <div className="w-full bg-[#FFFFFF] text-[#0F172A] min-h-screen selection:bg-blue-100 selection:text-blue-900 font-sans">
      
      {/* ────────────────────────────────────────────────────────────────────────
          1. HERO SECTION (APIQ-Inspired Centered Typography & Spacious Layout)
          ──────────────────────────────────────────────────────────────────────── */}
      <section className="pt-20 pb-16 px-4 md:px-8 bg-gradient-to-b from-[#FFFFFF] via-[#F8FAFC] to-[#FFFFFF] relative overflow-hidden">
        {/* Subtle Background Mesh Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-b from-blue-50/60 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-[1240px] mx-auto text-center space-y-8">
          
          {/* Eyebrow Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E2E8F0] shadow-sm text-xs font-mono text-[#475569] hover:border-blue-300 transition-colors">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
            <span className="font-medium text-[#0F172A]">Crisis Command Center</span>
            <span className="text-[#CBD5E1]">|</span>
            <span className="text-[#2563EB] font-semibold">Real-Time Telemetry</span>
          </div>

          {/* Hero Main Headline */}
          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#0F172A] leading-[1.12]">
              Autonomous Disaster <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] via-[#38BDF8] to-[#1D4ED8]">
                Liquidity Vaults
              </span>
            </h1>
            <p className="text-base md:text-lg text-[#475569] max-w-2xl mx-auto leading-relaxed font-normal">
              Multi-chain emergency pools triggered automatically via Gemini AI seismic telemetry and disbursed to verified victims with zero gas fees.
            </p>
          </div>

          {/* Hero CTA Button Group */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <Link
              href="/crisis/turkey-earthquake-2026"
              className="px-7 py-3.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white text-sm font-semibold flex items-center gap-2 shadow-[0_4px_14px_rgba(37,99,235,0.25)] hover:-translate-y-0.5 transition-all"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Donate to Active Crisis</span>
            </Link>

            <button
              onClick={() => setSwapModalOpen(true)}
              className="px-6 py-3.5 rounded-full bg-white hover:bg-[#F8FAFC] text-[#0F172A] text-sm font-semibold border border-[#E2E8F0] hover:border-[#CBD5E1] shadow-sm flex items-center gap-2 hover:-translate-y-0.5 transition-all"
            >
              <ArrowDownUp className="w-4 h-4 text-[#2563EB]" />
              <span>Swap Currency</span>
            </button>

            <Link
              href="/audit"
              className="px-6 py-3.5 rounded-full bg-white hover:bg-[#F8FAFC] text-[#0F172A] text-sm font-semibold border border-[#E2E8F0] hover:border-[#CBD5E1] shadow-sm flex items-center gap-2 hover:-translate-y-0.5 transition-all"
            >
              <Search className="w-4 h-4 text-[#64748B]" />
              <span>Live Audit</span>
            </Link>
          </div>

          {/* Minimal Swap Modal */}
          <SwapModal isOpen={swapModalOpen} onClose={() => setSwapModalOpen(false)} />

          {/* ──────────────────────────────────────────────────────────────────
              Hero Visual Display Card (APIQ-Inspired Clean Glass/Border Frame)
              ────────────────────────────────────────────────────────────────── */}
          <div className="pt-6">
            <div className="p-3 sm:p-4 rounded-[28px] bg-gradient-to-b from-[#F1F5F9] to-white border border-[#E2E8F0] shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
              <div className="rounded-[20px] bg-white border border-[#E2E8F0] p-6 sm:p-8 space-y-6 text-left">
                
                {/* Visual Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F1F5F9]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB]">
                      <Radio className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <div className="text-xs font-mono text-[#64748B] uppercase tracking-wider">LIVE TELEMETRY STREAM</div>
                      <div className="text-base font-bold text-[#0F172A]">Unified Cross-Chain Emergency Reserve</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-[#16A34A] border border-emerald-200 font-semibold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-ping"></span>
                      Oracles Synchronized
                    </span>
                    <span className="px-3 py-1 rounded-full bg-slate-50 text-[#475569] border border-[#E2E8F0]">
                      Sepolia &bull; Amoy
                    </span>
                  </div>
                </div>

                {/* 4 Protocol Key Metrics Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-blue-200 transition-colors">
                    <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
                      Aggregated Vaults
                    </div>
                    <div className="text-2xl sm:text-3xl font-mono font-bold text-[#0F172A]">
                      $1,240,500
                    </div>
                    <div className="text-xs font-mono text-[#16A34A] font-medium mt-1">
                      Sepolia + Amoy Unified
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-blue-200 transition-colors">
                    <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
                      Aid Disbursed
                    </div>
                    <div className="text-2xl sm:text-3xl font-mono font-bold text-[#2563EB]">
                      $980,000
                    </div>
                    <div className="text-xs font-mono text-[#64748B] mt-1">
                      100% to verified victims
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-blue-200 transition-colors">
                    <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
                      Verified Beneficiaries
                    </div>
                    <div className="text-2xl sm:text-3xl font-mono font-bold text-[#0F172A]">
                      14,280
                    </div>
                    <div className="text-xs font-mono text-[#64748B] mt-1">
                      Gasless Merkle claims
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-blue-200 transition-colors">
                    <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
                      AI Triggers Active
                    </div>
                    <div className="text-2xl sm:text-3xl font-mono font-bold text-[#16A34A]">
                      3 / 3 Vaults
                    </div>
                    <div className="text-xs font-mono text-[#64748B] mt-1">
                      Gemini 2.5 Flash Oracle
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────────
          2. CORE EMERGENCY MODULES (APIQ-Inspired Feature Cards & Bento Style)
          ──────────────────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 md:px-8 bg-[#F8FAFC] border-y border-[#E2E8F0]">
        <div className="max-w-[1240px] mx-auto space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold font-mono uppercase tracking-widest text-[#2563EB]">
                PROTOCOL CAPABILITIES
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#0F172A]">
                Core Emergency Modules
              </h2>
            </div>
            <p className="text-sm text-[#475569] max-w-md">
              Engineered for autonomous crisis response with institutional-grade cryptographic verifiability.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreModules.map((mod) => {
              const Icon = mod.icon;
              return (
                <Link
                  key={mod.title}
                  href={mod.href}
                  className="group p-6 sm:p-7 rounded-2xl bg-white border border-[#E2E8F0] hover:border-blue-300 hover:shadow-[0_12px_30px_rgba(37,99,235,0.08)] transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white transition-colors duration-300 shadow-sm">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${mod.badgeColor}`}>
                        {mod.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                        {mod.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#475569] leading-relaxed mt-2">
                        {mod.desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] pt-5 mt-4 border-t border-[#F1F5F9] group-hover:gap-2 transition-all">
                    <span>Open Module</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              );
            })}
          </div>

        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────────
          3. ACTIVE CRISES GLIMPSE (Ultra-Minimal 3-Card Streamlined Preview)
          ──────────────────────────────────────────────────────────────────────── */}
      <section className="py-14 px-4 md:px-8 bg-white">
        <div className="max-w-[1240px] mx-auto space-y-6">
          
          {/* Minimal Section Header */}
          <div className="flex items-center justify-between gap-4 pb-1">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F172A] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
                <span>Active Disaster Vaults</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#475569] mt-0.5">
                Live liquidity pools actively disbursing zero-gas victim aid.
              </p>
            </div>

            <Link
              href="/crisis/turkey-earthquake-2026"
              className="text-xs sm:text-sm font-semibold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1 shrink-0"
            >
              <span>Explore All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Minimal 3-Card Glimpse Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {crises.map((crisis) => {
              const percent = Math.min(100, Math.round((crisis.raisedUSD / crisis.targetUSD) * 100));
              return (
                <Link
                  key={crisis.id}
                  href={`/crisis/${crisis.id}`}
                  className="group p-5 rounded-2xl bg-[#F8FAFC] hover:bg-white border border-[#E2E8F0] hover:border-blue-300 hover:shadow-[0_8px_24px_rgba(15,23,42,0.06)] transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${crisis.statusBadge}`}>
                        {crisis.severityStatus} &bull; {crisis.severity}
                      </span>
                      <span className="text-[11px] font-mono text-[#64748B]">{crisis.categoryName}</span>
                    </div>

                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors line-clamp-1">
                        {crisis.title}
                      </h3>
                      <div className="text-xs text-[#64748B] flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 text-[#94A3B8]" />
                        <span>{crisis.location}</span>
                      </div>
                    </div>

                    {/* Compact Progress Bar */}
                    <div className="space-y-1.5 pt-1">
                      <div className="w-full h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#2563EB] rounded-full"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-mono text-[#64748B]">
                        <span>${crisis.raisedUSD.toLocaleString()} raised</span>
                        <span className="font-semibold text-[#0F172A]">{percent}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#E2E8F0]/60 text-xs font-semibold text-[#2563EB]">
                    <span>Open Vault</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>

        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────────
          4. AI ORACLE & LIVE PROTOCOL STREAM (Split Section)
          ──────────────────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 md:px-8 bg-[#F8FAFC] border-t border-[#E2E8F0]">
        <div className="max-w-[1240px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Gemini AI Severity Engine Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB]">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
                    Gemini 2.5 Flash Oracle
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#16A34A] border border-emerald-200">
                  ACTIVE
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                Real-time seismic Richter telemetry is continuously ingested. Automated smart contract release activates when severity &ge; 7.0.
              </p>

              <div className="space-y-2.5 text-xs font-mono pt-1">
                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                  <span className="text-[#475569]">Seismic Severity:</span>
                  <span className="text-rose-600 font-bold">9.4 / 10 (Critical)</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                  <span className="text-[#475569]">Contingency Release:</span>
                  <span className="text-[#16A34A] font-bold">20% Unlocked</span>
                </div>
              </div>
            </div>

            <Link
              href="/oracle"
              className="w-full py-3 px-4 rounded-full bg-[#F8FAFC] hover:bg-white text-[#0F172A] hover:text-[#2563EB] text-xs font-semibold border border-[#E2E8F0] hover:border-blue-300 shadow-sm flex items-center justify-center gap-2 transition-all"
            >
              <span>Test AI Oracle Simulator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Live Protocol Stream (2 Cols) */}
          <div className="lg:col-span-2 p-6 sm:p-8 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB]">
                    <Activity className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
                    Live On-Chain Stream
                  </span>
                </div>
                <span className="text-xs font-mono text-[#64748B] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse"></span>
                  Real-Time WebSocket
                </span>
              </div>

              <div className="space-y-2.5 font-mono text-xs">
                {liveTransactions.map((tx, i) => (
                  <div
                    key={i}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-white hover:border-blue-200 transition-colors gap-2"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="px-2 py-0.5 rounded-md text-[10px] bg-white border border-[#E2E8F0] text-[#0F172A] font-bold shadow-xs">
                        {tx.chainBadge}
                      </span>
                      <span className="text-[#475569]">{tx.hash}</span>
                      <span className="text-[#CBD5E1]">&bull;</span>
                      <span className="text-[#0F172A] font-semibold">{tx.type}</span>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
                      <span className="text-[#2563EB] font-bold">{tx.amount}</span>
                      <span className="text-[#475569]">{tx.target}</span>
                      <span className="text-[#94A3B8] text-[11px]">{tx.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-[#475569] pt-4 border-t border-[#F1F5F9]">
              <span>Verifiable on PolygonScan & Sepolia Etherscan.</span>
              <Link href="/audit" className="text-[#2563EB] hover:underline font-semibold flex items-center gap-1">
                <span>Full Audit Flow</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────────
          5. CALL TO ACTION SECTION (APIQ-Style High-Impact Card)
          ──────────────────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 md:px-8 bg-white">
        <div className="max-w-[1240px] mx-auto">
          <div className="p-8 sm:p-14 rounded-[32px] bg-gradient-to-br from-[#EFF6FF] via-[#F8FAFC] to-[#EFF6FF] border border-[#BFDBFE] text-center space-y-6 shadow-sm relative overflow-hidden">
            
            <div className="w-12 h-12 rounded-2xl bg-white border border-blue-200 flex items-center justify-center text-[#2563EB] mx-auto shadow-sm">
              <Zap className="w-6 h-6 fill-[#2563EB]" />
            </div>

            <div className="space-y-3 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0F172A]">
                Empowering Verifiable Crisis Aid
              </h2>
              <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
                Connect your wallet to allocate multi-chain emergency liquidity directly to ground zero, with 100% cryptographic transparency.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/crisis/turkey-earthquake-2026"
                className="px-8 py-3.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white text-sm font-semibold shadow-[0_4px_14px_rgba(37,99,235,0.25)] hover:-translate-y-0.5 transition-all"
              >
                Donate to Active Crisis
              </Link>
              <Link
                href="/audit"
                className="px-8 py-3.5 rounded-full bg-white hover:bg-[#F8FAFC] text-[#0F172A] text-sm font-semibold border border-[#CBD5E1] shadow-sm hover:-translate-y-0.5 transition-all"
              >
                Explore Public Audit Ledger
              </Link>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
