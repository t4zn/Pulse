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
  Fuel,
  Heart,
  Baby,
  Home as HomeIcon,
  Droplets,
  Stethoscope,
  Users,
  Quote,
  Check
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
      humanImpact: "8,420 Families Sheltered in Sub-Zero Weather",
      reliefItems: ["Thermal Tents", "Heated Blankets", "Infant Nutrition"],
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
      humanImpact: "4,180 Clean Drinking Water Vouchers Redeemed",
      reliefItems: ["Water Purification", "Emergency Rations", "First Aid"],
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
      humanImpact: "1,680 Pastoralist Households Supplied with Drought Aid",
      reliefItems: ["High-Protein Food", "Livestock Fodder", "Water Tankers"],
      vaultAddresses: {
        sepolia: "0x55C1...3d99",
        amoy: "0x22F4...7e11",
      },
      telemetry: "NDVI Satellite Index: -0.42 • Precipitation deficit: 68%",
    },
  ];

  const filteredCrises = activeTab === "all" ? crises : crises.filter((c) => c.category === activeTab);



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
      desc: "Victims verify aid eligibility via privacy-preserving Keccak256 Merkle proofs for direct instant payout.",
      href: "/beneficiary",
      icon: ShieldCheck,
      badge: "ZK-VERIFIED",
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

  const humanMilestones = [
    {
      icon: HomeIcon,
      count: "8,420",
      label: "Displaced Families Sheltered",
      detail: "Supplied with thermal all-weather insulated tents & heaters in freezing temperatures.",
      accent: "text-rose-600 bg-rose-50 border-rose-100",
    },
    {
      icon: Droplets,
      count: "320,000L",
      label: "Safe Drinking Water Delivered",
      detail: "Distributed through decentralized offline voucher verification in flooded zones.",
      accent: "text-sky-600 bg-sky-50 border-sky-100",
    },
    {
      icon: Baby,
      count: "4,120",
      label: "Infant Nutrition Kits",
      detail: "Essential medical formulas and pediatric emergency packets dispatched directly to mothers.",
      accent: "text-amber-600 bg-amber-50 border-amber-100",
    },
    {
      icon: Stethoscope,
      count: "100%",
      label: "Direct Transfer",
      detail: "Full aid allocation transferred directly to verified recipient wallets with zero cuts.",
      accent: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
  ];

  const journeySteps = [
    {
      step: "01",
      title: "Compassionate Donor Giving",
      desc: "Donors worldwide deposit ETH, POL, or USDC into auditable smart contracts with 0% administrative cuts.",
      icon: Heart,
    },
    {
      step: "02",
      title: "Gemini AI Sensor Trigger",
      desc: "When earthquake or flood sensors breach critical thresholds, smart contracts unlock instant emergency liquidity.",
      icon: Cpu,
    },
    {
      step: "03",
      title: "Zero-Knowledge Victim Claim",
      desc: "Victims prove eligibility via privacy-preserving Merkle proofs and receive instant direct aid.",
      icon: ShieldCheck,
    },
    {
      step: "04",
      title: "Permanent Proof on IPFS",
      desc: "Aid delivery receipts and ground photos are pinned immutably, giving donors 100% visual public transparency.",
      icon: FileCheck2,
    },
  ];

  return (
    <div className="w-full bg-[#FFFFFF] text-[#0F172A] min-h-screen selection:bg-blue-100 selection:text-blue-900 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* ────────────────────────────────────────────────────────────────────────
          1. HERO SECTION (Spacious, Heartwarming & Technologically Clear)
          ──────────────────────────────────────────────────────────────────────── */}
      <section className="pt-20 pb-16 px-4 md:px-8 bg-gradient-to-b from-[#FFFFFF] via-[#F8FAFC] to-[#FFFFFF] relative overflow-hidden">
        {/* Ambient Warm Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[480px] bg-gradient-to-b from-blue-50/70 via-rose-50/30 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-[1240px] mx-auto text-center space-y-8">
          
          {/* Eyebrow Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E2E8F0] shadow-sm text-xs text-[#475569] hover:border-blue-300 transition-colors font-medium">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16A34A] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#16A34A]"></span>
            </span>
            <span className="font-bold text-[#0F172A]">Direct Humanitarian Aid Protocol</span>
            <span className="text-[#CBD5E1]">|</span>
            <span className="text-[#2563EB] font-semibold flex items-center gap-1">
              <Heart className="w-3 h-3 fill-[#2563EB] text-[#2563EB]" /> 100% Verifiable On-Chain
            </span>
          </div>

          {/* Hero Main Headline */}
          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#0F172A] leading-[1.12]">
              Compassion Delivered at <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] via-[#38BDF8] to-[#1D4ED8]">
                The Speed of Blockchain
              </span>
            </h1>
            <p className="text-base sm:text-lg text-[#475569] max-w-2xl mx-auto leading-relaxed font-normal">
              Autonomous emergency vaults triggered by Gemini AI telemetry. Delivering zero-fee, privacy-protected emergency liquidity directly into the hands of families displaced by disaster.
            </p>
          </div>

          {/* Hero CTA Button Group: Exactly 2 clean buttons (Donate & Claim) */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <Link
              href="/crisis"
              className="px-8 py-3.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white text-sm font-bold flex items-center gap-2 shadow-[0_4px_14px_rgba(37,99,235,0.25)] hover:-translate-y-0.5 transition-all"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>Donate Relief</span>
            </Link>

            <Link
              href="/beneficiary"
              className="px-8 py-3.5 rounded-full bg-white hover:bg-[#F8FAFC] text-[#0F172A] text-sm font-bold border border-[#E2E8F0] hover:border-[#CBD5E1] shadow-xs flex items-center gap-2 hover:-translate-y-0.5 transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
              <span>Claim Aid</span>
            </Link>
          </div>

          {/* Minimal Swap Modal */}
          <SwapModal isOpen={swapModalOpen} onClose={() => setSwapModalOpen(false)} />

          {/* ──────────────────────────────────────────────────────────────────
              Hero Telemetry Frame with Human Transparency Metric Strip
              ────────────────────────────────────────────────────────────────── */}
          <div className="pt-6">
            <div className="p-3 sm:p-4 rounded-[28px] bg-gradient-to-b from-[#F1F5F9] to-white border border-[#E2E8F0] shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
              <div className="rounded-[22px] bg-white border border-[#E2E8F0] p-6 sm:p-8 space-y-6 text-left">
                
                {/* Visual Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F1F5F9]">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB] shadow-xs">
                      <HeartHandshake className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs text-[#64748B] uppercase tracking-wider font-bold">LIVE HUMANITARIAN VAULT STATE</div>
                      <div className="text-base sm:text-lg font-bold text-[#0F172A]">Unified Cross-Chain Emergency Reserve</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-[#16A34A] border border-emerald-200 font-bold flex items-center gap-1.5 shadow-xs">
                      <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-ping"></span>
                      100% Verifiable &bull; 0% Overhead
                    </span>
                  </div>
                </div>

                {/* 4 Protocol Key Metrics Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-blue-200 transition-colors">
                    <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
                      Aggregated Vaults
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                      $1,240,500
                    </div>
                    <div className="text-xs text-[#16A34A] font-semibold mt-1 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-[#16A34A]" /> Sepolia + Amoy Unified
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-blue-200 transition-colors">
                    <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
                      Aid Disbursed
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-[#2563EB] tracking-tight">
                      $980,000
                    </div>
                    <div className="text-xs text-[#64748B] font-medium mt-1">
                      100% to verified victims
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-blue-200 transition-colors">
                    <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
                      Verified Beneficiaries
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                      14,280
                    </div>
                    <div className="text-xs text-[#64748B] font-medium mt-1">
                      Verified Merkle claims
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-blue-200 transition-colors">
                    <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
                      AI Triggers Active
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-[#16A34A] tracking-tight">
                      3 / 3 Vaults
                    </div>
                    <div className="text-xs text-[#64748B] font-medium mt-1">
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
          2. HEARTWARMING HUMAN IMPACT SECTION (Real Stories & Field Milestones)
          ──────────────────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-white via-[#F8FAFC] to-white border-b border-[#E2E8F0]">
        <div className="max-w-[1240px] mx-auto space-y-12">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              REAL-WORLD HUMAN IMPACT
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A]">
              Where Your Help Directly Reaches
            </h2>
            <p className="text-sm sm:text-base text-[#475569]">
              Every single dollar is tracked through cryptographic proofs directly to on-ground humanitarian relief.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {humanMilestones.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div 
                  key={idx}
                  className="p-7 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${item.accent} shadow-xs`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="text-3xl font-extrabold text-[#0F172A] tracking-tight">
                      {item.count}
                    </div>
                    <div className="text-base font-bold text-[#0F172A]">
                      {item.label}
                    </div>
                    <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                      {item.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Heartwarming Field Quote */}
          <div className="p-8 rounded-3xl bg-[#EFF6FF] border border-[#BFDBFE] flex flex-col md:flex-row items-center gap-6 text-left">
            <div className="w-14 h-14 rounded-2xl bg-white border border-blue-200 flex items-center justify-center text-[#2563EB] shrink-0 shadow-sm">
              <Quote className="w-7 h-7 fill-blue-50" />
            </div>
            <div className="space-y-1">
              <p className="text-sm sm:text-base font-medium text-[#0F172A] italic leading-relaxed">
                &ldquo;In sub-zero temperatures following the 7.8M earthquake, families in Gaziantep received immediate emergency cash aid in under 4 minutes — with zero bureaucracy and zero transaction fees deducted.&rdquo;
              </p>
              <div className="text-xs font-semibold text-[#2563EB]">
                &mdash; On-Ground Relief Coordination &bull; Verified Merkle Delivery Proofs
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────────
          3. HOW IT WORKS: THE 4-STEP HUMAN JOURNEY
          ──────────────────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 md:px-8 bg-[#F8FAFC]">
        <div className="max-w-[1240px] mx-auto space-y-12">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB]">
              TRANSPARENT LIFE CYCLE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A]">
              From Your Wallet to a Family&apos;s Hands
            </h2>
            <p className="text-sm text-[#475569]">
              How autonomous smart contracts turn global empathy into immediate survival resources.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {journeySteps.map((s) => {
              const StepIcon = s.icon;
              return (
                <div
                  key={s.step}
                  className="p-7 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm hover:border-blue-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB] shadow-xs">
                        <StepIcon className="w-6 h-6" />
                      </div>
                      <span className="text-2xl font-extrabold text-[#CBD5E1]">
                        {s.step}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-[#0F172A]">
                      {s.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────────
          4. CORE EMERGENCY MODULES (Feature Grid)
          ──────────────────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 md:px-8 bg-white border-t border-[#E2E8F0]">
        <div className="max-w-[1240px] mx-auto space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB]">
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
                  className="group p-6 sm:p-7 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-white hover:border-blue-300 hover:shadow-[0_12px_30px_rgba(37,99,235,0.08)] transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-[#E2E8F0] flex items-center justify-center text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white transition-colors duration-300 shadow-sm">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${mod.badgeColor}`}>
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

                  <div className="pt-4 mt-4 border-t border-[#E2E8F0] flex items-center gap-1 text-xs font-semibold text-[#2563EB] group-hover:translate-x-1 transition-transform">
                    <span>Access Module</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              );
            })}
          </div>

        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────────────
          5. ACTIVE DISASTER VAULTS (Compact, Sleek & Minimal)
          ──────────────────────────────────────────────────────────────────────── */}
      <section className="py-14 px-4 md:px-8 bg-[#F8FAFC] border-t border-[#E2E8F0]">
        <div className="max-w-[1240px] mx-auto space-y-6">
          
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F172A]">
                  Active Disaster Liquidity Vaults
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
                Real-time emergency pools triggered by live USGS and NASA sensor telemetry.
              </p>
            </div>

            <Link
              href="/crisis"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors self-start sm:self-auto"
            >
              <span>View Full Crisis Feed</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Compact 3-Card Minimal Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                id: "mexico-quake",
                title: "M 4.5 Puerto Madero Quake",
                location: "Chiapas, Mexico",
                source: "USGS Station MEX-08",
                raised: "$125,000",
                status: "CRITICAL",
                statusColor: "bg-rose-50 text-rose-700 border-rose-200",
                ngo: "Mexican Red Cross (Cruz Roja)",
                time: "Live USGS",
              },
              {
                id: "japan-quake",
                title: "M 5.2 Honshu Offshore Tectonic",
                location: "Honshu, Japan",
                source: "JMA Seismograph Station",
                raised: "$340,000",
                status: "ACTIVE",
                statusColor: "bg-blue-50 text-blue-700 border-blue-200",
                ngo: "Japanese Red Cross Society",
                time: "Live JMA",
              },
              {
                id: "california-quake",
                title: "M 4.1 Southern California Tremor",
                location: "Imperial, California",
                source: "USGS Station CI-114",
                raised: "$210,000",
                status: "ELEVATED",
                statusColor: "bg-amber-50 text-amber-700 border-amber-200",
                ngo: "American Red Cross Disaster Ops",
                time: "Live USGS",
              },
            ].map((vault) => (
              <div
                key={vault.id}
                className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs hover:border-[#CBD5E1] transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${vault.statusColor}`}>
                      {vault.status}
                    </span>
                    <span className="text-[11px] font-medium text-[#64748B]">
                      {vault.time}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-[#0F172A] leading-snug">
                      {vault.title}
                    </h3>
                    <div className="text-xs text-[#64748B] flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-[#94A3B8]" />
                      <span>{vault.location}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#F1F5F9] text-xs space-y-1">
                    <div className="text-[11px] text-[#94A3B8]">Deploying NGO:</div>
                    <div className="text-[#0F172A] font-semibold">{vault.ngo}</div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-[#94A3B8] uppercase block">Emergency Pool</span>
                    <span className="text-sm font-bold text-[#0F172A]">{vault.raised} USDC</span>
                  </div>

                  <Link
                    href="/crisis"
                    className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1"
                  >
                    <span>Donate Aid</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>



      {/* ────────────────────────────────────────────────────────────────────────
          7. CALL TO ACTION SECTION (High-Impact & Heartwarming)
          ──────────────────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-[#F8FAFC] to-white">
        <div className="max-w-[1240px] mx-auto">
          <div className="p-8 sm:p-14 rounded-[32px] bg-gradient-to-br from-[#EFF6FF] via-[#F8FAFC] to-[#EFF6FF] border border-[#BFDBFE] text-center space-y-6 shadow-sm relative overflow-hidden">
            
            <div className="w-14 h-14 rounded-2xl bg-white border border-blue-200 flex items-center justify-center text-[#2563EB] mx-auto shadow-sm">
              <Heart className="w-7 h-7 fill-[#2563EB]" />
            </div>

            <div className="space-y-3 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A]">
                Every Second Counts in Disaster Relief
              </h2>
              <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
                Connect your wallet to allocate multi-chain emergency aid directly to verified ground-zero families, with 100% cryptographic proof and zero middlemen fees.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
              <Link
                href="/crisis"
                className="px-8 py-3.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white text-sm font-bold flex items-center gap-2 shadow-[0_4px_14px_rgba(37,99,235,0.25)] hover:-translate-y-0.5 transition-all"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>Donate Relief</span>
              </Link>
              <Link
                href="/beneficiary"
                className="px-8 py-3.5 rounded-full bg-white hover:bg-[#F8FAFC] text-[#0F172A] text-sm font-semibold border border-[#CBD5E1] shadow-sm flex items-center gap-2 hover:-translate-y-0.5 transition-all"
              >
                <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
                <span>Claim Aid</span>
              </Link>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
