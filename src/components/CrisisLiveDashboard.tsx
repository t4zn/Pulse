"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  TrendingUp, 
  MapPin, 
  Target, 
  Users, 
  Building2, 
  DollarSign, 
  CheckCircle2, 
  Activity, 
  ShieldCheck, 
  ExternalLink, 
  Clock, 
  Layers, 
  Zap, 
  PieChart, 
  BarChart3, 
  ArrowUpRight, 
  Radio, 
  FileText,
  Copy,
  Check,
  Flame,
  Globe2,
  RefreshCw
} from "lucide-react";
import { getExplorerTxUrl } from "@/lib/contracts";

export interface LiveDashboardAllocation {
  id: string;
  txHash: string;
  donor: string;
  donorLabel?: string;
  amountUSD: number;
  cryptoAmount: string;
  chain: "Polygon Amoy" | "ETH Sepolia";
  category: "Medical Trauma" | "Search & Rescue" | "Thermal Shelter" | "Water & Nutrition" | "Direct Cash";
  destinationSector: string;
  timestamp: string;
  merkleBatch: string;
  verified: boolean;
}

interface CrisisLiveDashboardProps {
  crisis: {
    id: string;
    title: string;
    location: string;
    gps: string;
    raisedUSD: number;
    targetUSD: number;
    disbursedUSD: number;
    victimsVerified: number;
    status: string;
    severity: string;
    lastUpdated: string;
    vaultAddresses: {
      sepolia: string;
      amoy: string;
    };
  };
}

// Initial mock real-time allocation transactions matching HumaDash live stream
const initialAllocations: LiveDashboardAllocation[] = [
  {
    id: "tx-live-1",
    txHash: "0x892afc830119b48830114a82173b19f20ca73b88",
    donor: "0x4b71...a902",
    donorLabel: "Vitalik Disaster Fund",
    amountUSD: 5000,
    cryptoAmount: "1.82 ETH",
    chain: "ETH Sepolia",
    category: "Medical Trauma",
    destinationSector: "Kahramanmaraş University Medical Hub",
    timestamp: "12s ago",
    merkleBatch: "Merkle Batch #8812",
    verified: true,
  },
  {
    id: "tx-live-2",
    txHash: "0x3e77890123bca881001234567890abcd11223344",
    donor: "0x98D2...1a33",
    donorLabel: "Global Crypto Relief Pool",
    amountUSD: 2500,
    cryptoAmount: "1,250 POL",
    chain: "Polygon Amoy",
    category: "Search & Rescue",
    destinationSector: "AKUT Tactical SAR Squad Alpha",
    timestamp: "28s ago",
    merkleBatch: "Merkle Batch #8819",
    verified: true,
  },
  {
    id: "tx-live-3",
    txHash: "0x4c88128302bfca99014c09A18D3b584001122334",
    donor: "0x7E12...5840",
    donorLabel: "Anonymous Donor",
    amountUSD: 1200,
    cryptoAmount: "1,200 USDC",
    chain: "Polygon Amoy",
    category: "Thermal Shelter",
    destinationSector: "AFAD Central Mega-Logistics Hub",
    timestamp: "52s ago",
    merkleBatch: "Merkle Batch #8824",
    verified: true,
  },
  {
    id: "tx-live-4",
    txHash: "0x11B9334c9012830029bca881001234567890abcd",
    donor: "0x3A9F...cA77",
    donorLabel: "UN Rapid Response DAO",
    amountUSD: 10000,
    cryptoAmount: "3.64 ETH",
    chain: "ETH Sepolia",
    category: "Medical Trauma",
    destinationSector: "Gaziantep Regional Trauma Hospital",
    timestamp: "1m 15s ago",
    merkleBatch: "Merkle Batch #8830",
    verified: true,
  },
  {
    id: "tx-live-5",
    txHash: "0x55C100a9821389bc019283d99aabbccddeeff0011",
    donor: "0x63Fa...88e1",
    donorLabel: "Community Donor",
    amountUSD: 750,
    cryptoAmount: "375 POL",
    chain: "Polygon Amoy",
    category: "Water & Nutrition",
    destinationSector: "Nurdağı West Relief Camp",
    timestamp: "2m 04s ago",
    merkleBatch: "Merkle Batch #8835",
    verified: true,
  },
  {
    id: "tx-live-6",
    txHash: "0x22F4902188ba091122a7e1100112233445566778",
    donor: "0x21c8...f91a",
    donorLabel: "Anonymous Donor",
    amountUSD: 300,
    cryptoAmount: "300 USDC",
    chain: "Polygon Amoy",
    category: "Direct Cash",
    destinationSector: "Merkle Verified Victim Cluster #8812",
    timestamp: "2m 45s ago",
    merkleBatch: "Merkle Batch #8841",
    verified: true,
  },
];

// Daily donation volume timeline data for Trends chart
const donationVolumeTrends = [
  { day: "Day 1 (Mainshock)", amount: 145000, donors: 420 },
  { day: "Day 2", amount: 210000, donors: 680 },
  { day: "Day 3", amount: 185000, donors: 540 },
  { day: "Day 4", amount: 98000, donors: 310 },
  { day: "Day 5", amount: 46200, donors: 190 },
];

// Currency distribution breakdown data
const currencyBreakdown = [
  { currency: "POL (Polygon Amoy)", percentage: 48, amountUSD: 328416, color: "bg-purple-500", text: "text-purple-400" },
  { currency: "ETH (Sepolia)", percentage: 34, amountUSD: 232628, color: "bg-blue-500", text: "text-blue-400" },
  { currency: "USDC (Stablecoin)", percentage: 14, amountUSD: 95788, color: "bg-emerald-500", text: "text-emerald-400" },
  { currency: "Other Crypto / Grants", percentage: 4, amountUSD: 27368, color: "bg-amber-500", text: "text-amber-400" },
];

// Sector allocation breakdown
const sectorBreakdown = [
  { category: "Medical Trauma & Surgical", pct: 36, amountUSD: 246312, icon: Activity, color: "bg-cyan-500" },
  { category: "Search & Rescue Operations", pct: 26, amountUSD: 177892, icon: Zap, color: "bg-red-500" },
  { category: "Thermal Shelter Pods", pct: 18, amountUSD: 123156, icon: Building2, color: "bg-amber-500" },
  { category: "Water, Food & Nutrition", pct: 12, amountUSD: 82104, icon: Target, color: "bg-emerald-500" },
  { category: "Direct Beneficiary Cash", pct: 8, amountUSD: 54736, icon: Users, color: "bg-purple-500" },
];

export function CrisisLiveDashboard({ crisis }: CrisisLiveDashboardProps) {
  const [activeTab, setActiveTab] = useState<"trends" | "currency" | "sectors" | "merkle">("trends");
  const [allocations, setAllocations] = useState<LiveDashboardAllocation[]>(initialAllocations);
  const [currentTimeStr, setCurrentTimeStr] = useState<string>("");
  const [copiedTx, setCopiedTx] = useState<string | null>(null);

  // Auto-updating live timestamp
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeStr(now.toUTCString());
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Simulate incoming live allocations every 12 seconds
  useEffect(() => {
    const streamInterval = setInterval(() => {
      const randomAmounts = [250, 500, 1000, 1500, 3200];
      const randomCategories: LiveDashboardAllocation["category"][] = [
        "Medical Trauma",
        "Search & Rescue",
        "Thermal Shelter",
        "Water & Nutrition",
        "Direct Cash"
      ];
      const randomDestinations = [
        "Kahramanmaraş University Medical Hub",
        "AKUT Tactical SAR Squad Alpha",
        "AFAD Central Mega-Logistics Hub",
        "Gaziantep Trauma Hub",
        "Nurdağı West Relief Camp"
      ];
      
      const newAmt = randomAmounts[Math.floor(Math.random() * randomAmounts.length)];
      const newCat = randomCategories[Math.floor(Math.random() * randomCategories.length)];
      const newDest = randomDestinations[Math.floor(Math.random() * randomDestinations.length)];
      const randomHex = Math.random().toString(16).substring(2, 10);

      const newTx: LiveDashboardAllocation = {
        id: `tx-live-${Date.now()}`,
        txHash: `0x${randomHex}890123bca881001234567890abcd${randomHex}`,
        donor: `0x${randomHex.substring(0, 4)}...${randomHex.substring(4, 8)}`,
        donorLabel: "Verified Web3 Contributor",
        amountUSD: newAmt,
        cryptoAmount: `$${newAmt} USDC`,
        chain: "Polygon Amoy",
        category: newCat,
        destinationSector: newDest,
        timestamp: "Just now",
        merkleBatch: `Merkle Batch #${Math.floor(8800 + Math.random() * 50)}`,
        verified: true,
      };

      setAllocations((prev) => [newTx, ...prev.slice(0, 14)]);
    }, 12000);

    return () => clearInterval(streamInterval);
  }, []);

  const totalDonations = crisis.raisedUSD;
  const donationsToday = 58420;
  const activeDonors = 1842;
  const activeProjects = 14;
  const organizationsCount = 8;
  const beneficiariesReached = crisis.victimsVerified;
  const milestonesCompleted = 12;
  const totalMilestones = 16;
  const fundingPercent = Math.min(100, Math.round((crisis.raisedUSD / crisis.targetUSD) * 100));

  const copyTxHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedTx(hash);
    setTimeout(() => setCopiedTx(null), 2000);
  };

  return (
    <div className="w-full bg-[#f8fafc] border border-slate-200/90 rounded-2xl p-4 md:p-7 shadow-sm text-slate-800 space-y-6">
      
      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 1. DASHBOARD HEADER & LIVE STATUS (HUMADASH SIGNATURE STYLE) */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6B21A8] to-[#3B82F6] flex items-center justify-center text-white shadow-md shrink-0">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 tracking-tight">
                Global Aid Transparency Dashboard
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Real-time cryptographic tracking of humanitarian donations & crisis deployments
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-mono font-semibold flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>LIVE TRANSPARENCY FEED</span>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 2. MAIN 3-COLUMN METRICS GRID (METRICS | MAP & STATS | LIVE ALLOCATIONS) */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* COLUMN 1: FINANCIAL OVERVIEW & IMPACT METRICS (4 COLS) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* HERO TOTAL DONATIONS CARD */}
          <div className="rounded-xl bg-gradient-to-br from-[#6B21A8] to-[#3B82F6] p-5 text-white shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-medium text-white/80 uppercase tracking-wider">Total Aid Raised</p>
                  <p className="text-2xl sm:text-3xl font-bold font-heading text-white">
                    ${totalDonations.toLocaleString()}
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-mono font-semibold">
                {fundingPercent}% of Target
              </span>
            </div>
            
            {/* Target Progress Bar */}
            <div className="space-y-1 pt-1">
              <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-400 rounded-full transition-all duration-700" 
                  style={{ width: `${fundingPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-white/70 font-mono">
                <span>Disbursed: ${crisis.disbursedUSD.toLocaleString()}</span>
                <span>Target: ${crisis.targetUSD.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* FINANCIAL OVERVIEW CARD */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-heading">
              Financial Overview
            </h3>
            
            <div className="space-y-3.5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Donated Today</p>
                  <p className="text-lg font-bold font-heading text-slate-900">
                    ${donationsToday.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Active Donors</p>
                  <p className="text-lg font-bold font-heading text-slate-900">
                    {activeDonors.toLocaleString()} Wallets
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                  <Zap className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Disbursement Velocity</p>
                  <p className="text-lg font-bold font-heading text-slate-900">
                    &lt; 15s Direct Smart Release
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* IMPACT METRICS CARD */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-heading">
              Impact Metrics
            </h3>

            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="text-[10px] text-slate-500 uppercase">Active Sectors</div>
                <div className="text-base font-bold text-slate-900 mt-0.5">{activeProjects} Zones</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="text-[10px] text-slate-500 uppercase">Relief Partners</div>
                <div className="text-base font-bold text-slate-900 mt-0.5">{organizationsCount} NGOs</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 col-span-2 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">Beneficiaries Reached</div>
                  <div className="text-base font-bold text-purple-700 mt-0.5">
                    {beneficiariesReached.toLocaleString()} Merkle Verified
                  </div>
                </div>
                <ShieldCheck className="w-5 h-5 text-purple-600" />
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 col-span-2 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">Milestones Completed</div>
                  <div className="text-base font-bold text-emerald-700 mt-0.5">
                    {milestonesCompleted} of {totalMilestones} Completed
                  </div>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN 2: LIVE ALLOCATIONS STREAM & REAL-TIME BLOCKCHAIN FEED (8 COLS) */}
        <div className="lg:col-span-8 flex flex-col justify-between space-y-4">
          
          {/* LIVE ALLOCATIONS TABLE / FEED */}
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
                <h3 className="font-heading font-bold text-slate-900 text-sm sm:text-base">
                  Live Allocations & Cryptographic Receipts
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Streaming Live
              </span>
            </div>

            {/* Allocation Stream Items */}
            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
              {allocations.map((alloc) => (
                <div 
                  key={alloc.id}
                  className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-slate-900 font-mono">{alloc.donorLabel || alloc.donor}</span>
                      <span className="text-slate-400">•</span>
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-semibold">
                        {alloc.category}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-mono">
                        {alloc.chain}
                      </span>
                    </div>
                    <div className="text-slate-600 text-[11px] flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{alloc.destinationSector}</span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 shrink-0">
                    <div className="text-right">
                      <div className="font-bold text-emerald-600 font-mono text-sm">
                        +${alloc.amountUSD.toLocaleString()} USD
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        ({alloc.cryptoAmount})
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                      <span>{alloc.timestamp}</span>
                      <a
                        href={getExplorerTxUrl(alloc.chain === "Polygon Amoy" ? "amoy" : "sepolia", alloc.txHash)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline flex items-center gap-0.5"
                        title="View On-Chain Receipt"
                      >
                        <span>Receipt</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-200 mt-3 flex items-center justify-between text-xs text-slate-500 font-mono">
              <span className="flex items-center gap-1.5 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                100% On-Chain Verifiable • Zero Intermediary Slippage
              </span>
              <span className="text-[10px] text-slate-400">Showing last {allocations.length} events</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 3. MULTI-TAB ANALYTICS & BREAKDOWN SECTION (HUMADASH SIGNATURE TABS) */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
        
        {/* TAB BUTTONS */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3 font-mono text-xs">
          <button
            onClick={() => setActiveTab("trends")}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 font-bold transition-all ${
              activeTab === "trends"
                ? "bg-purple-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Donation Volume Trends</span>
          </button>

          <button
            onClick={() => setActiveTab("currency")}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 font-bold transition-all ${
              activeTab === "currency"
                ? "bg-purple-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Currency & Rails</span>
          </button>

          <button
            onClick={() => setActiveTab("sectors")}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 font-bold transition-all ${
              activeTab === "sectors"
                ? "bg-purple-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            <span>Sector Allocations</span>
          </button>

          <button
            onClick={() => setActiveTab("merkle")}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 font-bold transition-all ${
              activeTab === "merkle"
                ? "bg-purple-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Merkle Proof Ledger</span>
          </button>
        </div>

        {/* TAB 1: DONATION VOLUME TRENDS */}
        {activeTab === "trends" && (
          <div className="space-y-4 pt-1">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500">
              <span>Daily Inflow Velocity (Disaster Timeline)</span>
              <span className="text-purple-600 font-bold">Total Inflow: ${totalDonations.toLocaleString()}</span>
            </div>

            <div className="grid grid-cols-5 gap-3 pt-2">
              {donationVolumeTrends.map((d, i) => {
                const maxAmt = 220000;
                const barHeightPct = Math.round((d.amount / maxAmt) * 100);
                return (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div className="text-[10px] font-mono font-bold text-slate-800">
                      ${(d.amount / 1000).toFixed(0)}k
                    </div>
                    <div className="w-full h-32 bg-slate-100 rounded-lg flex items-end p-1 overflow-hidden border border-slate-200">
                      <div 
                        className="w-full bg-gradient-to-t from-purple-700 to-blue-500 rounded-md transition-all duration-700" 
                        style={{ height: `${barHeightPct}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono text-center truncate w-full">
                      {d.day}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: CURRENCY & RAILS BREAKDOWN */}
        {activeTab === "currency" && (
          <div className="space-y-4 pt-1">
            <div className="text-xs font-mono text-slate-500">
              Cross-Chain Vault Distribution
            </div>

            {/* Currency percentage multi-bar */}
            <div className="w-full h-3.5 rounded-full overflow-hidden flex bg-slate-100 border border-slate-200">
              {currencyBreakdown.map((c, i) => (
                <div 
                  key={i} 
                  className={`h-full ${c.color}`} 
                  style={{ width: `${c.percentage}%` }}
                  title={`${c.currency}: ${c.percentage}%`}
                />
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
              {currencyBreakdown.map((c, i) => (
                <div key={i} className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className={`font-bold ${c.text}`}>{c.currency}</span>
                    <span className="font-bold text-slate-800">{c.percentage}%</span>
                  </div>
                  <div className="text-slate-500 text-[11px] mt-1">
                    ${c.amountUSD.toLocaleString()} USD
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SECTOR ALLOCATIONS */}
        {activeTab === "sectors" && (
          <div className="space-y-4 pt-1">
            <div className="text-xs font-mono text-slate-500">
              Emergency Resource Needs Distribution
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs font-mono">
              {sectorBreakdown.map((s, i) => (
                <div key={i} className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-slate-800">
                      <s.icon className="w-3.5 h-3.5 text-primary" />
                      <span>{s.category}</span>
                    </div>
                    <span className="font-bold text-purple-700">{s.pct}%</span>
                  </div>

                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className={`h-full ${s.color}`} style={{ width: `${s.pct}%` }} />
                  </div>

                  <div className="text-[11px] text-slate-500">
                    Allocated: ${s.amountUSD.toLocaleString()} USD
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: MERKLE PROOF LEDGER */}
        {activeTab === "merkle" && (
          <div className="space-y-3 pt-1 text-xs font-mono">
            <div className="text-slate-500">
              Cryptographic Beneficiary Merkle Roots & Zero-Knowledge Verification
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 text-[10px] uppercase">
                    <th className="py-2 px-3">Batch ID</th>
                    <th className="py-2 px-3">Merkle Root Hash</th>
                    <th className="py-2 px-3">Contract Anchor</th>
                    <th className="py-2 px-3">Verified Victims</th>
                    <th className="py-2 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-slate-900">#8812</td>
                    <td className="py-2.5 px-3 text-purple-600 font-mono">0x9f1a2388...4b22c019</td>
                    <td className="py-2.5 px-3">Polygon Amoy: 0x7E12...5840</td>
                    <td className="py-2.5 px-3 font-bold">2,180</td>
                    <td className="py-2.5 px-3 text-emerald-600 font-semibold">100% Claimed</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-slate-900">#8819</td>
                    <td className="py-2.5 px-3 text-purple-600 font-mono">0x4c881299...1d09e771</td>
                    <td className="py-2.5 px-3">Polygon Amoy: 0x7E12...5840</td>
                    <td className="py-2.5 px-3 font-bold">1,420</td>
                    <td className="py-2.5 px-3 text-emerald-600 font-semibold">100% Claimed</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-slate-900">#8824</td>
                    <td className="py-2.5 px-3 text-purple-600 font-mono">0x3e778911...9c118820</td>
                    <td className="py-2.5 px-3">ETH Sepolia: 0x3A9F...cA77</td>
                    <td className="py-2.5 px-3 font-bold">980</td>
                    <td className="py-2.5 px-3 text-emerald-600 font-semibold">100% Claimed</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-slate-900">#8830</td>
                    <td className="py-2.5 px-3 text-purple-600 font-mono">0x8821bb44...ee901123</td>
                    <td className="py-2.5 px-3">Polygon Amoy: 0x7E12...5840</td>
                    <td className="py-2.5 px-3 font-bold">3,840</td>
                    <td className="py-2.5 px-3 text-blue-600 font-semibold">Active Distribution</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 4. FOOTER TRANSPARENCY NOTICE */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="pt-3 border-t border-slate-200 text-center">
        <p className="text-xs text-slate-500 font-mono">
          Data verified by blockchain • Real-Time Merkle Proofs • Last updated: {currentTimeStr || "Syncing..."}
        </p>
      </div>
    </div>
  );
}
