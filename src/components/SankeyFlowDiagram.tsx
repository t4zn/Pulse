"use client";

import React, { useState } from "react";
import { 
  ArrowRight, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  Building2, 
  Users, 
  Stethoscope, 
  Home as HomeIcon, 
  Droplets,
  ExternalLink,
  ChevronRight,
  Info,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { formatCurrencyUSD } from "@/lib/contracts";

export interface SankeyFlowDiagramProps {
  onSelectNgo?: (ngoName: string) => void;
  onOpenIpfs?: (cid: string, title: string) => void;
}

export function SankeyFlowDiagram({ onOpenIpfs }: SankeyFlowDiagramProps) {
  const [activeFilter, setActiveFilter] = useState<"all" | "medical" | "food" | "shelter">("all");
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Nodes data
  const inflows = [
    { id: "sepolia", name: "Ethereum Sepolia", amount: 428700, crypto: "142.9 ETH", color: "from-purple-500 to-indigo-600", border: "border-purple-200", bg: "bg-purple-50" },
    { id: "amoy", name: "Polygon Amoy", amount: 597600, crypto: "919,109 POL", color: "from-blue-500 to-cyan-600", border: "border-blue-200", bg: "bg-blue-50" },
  ];

  const totalVault = 1026300;
  const disbursedTotal = 540000;
  const contingencyReserve = 486300;

  const categories = [
    {
      id: "medical",
      name: "Medical Care & Trauma (40%)",
      amount: 216000,
      icon: Stethoscope,
      color: "text-rose-600",
      bg: "bg-rose-50",
      border: "border-rose-200",
      activeNgos: ["UN OCHA Medical Hub", "Indian Red Cross", "Japanese Red Cross"],
      families: 5200,
      cid: "QmY9aX781b2c45e89d1234567890abcdef31x8",
    },
    {
      id: "food",
      name: "Food Security & Water (30%)",
      amount: 162000,
      icon: Droplets,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-200",
      activeNgos: ["Goonj Relief", "Philippine Red Cross", "UN WFP Logistics"],
      families: 4300,
      cid: "QmZ3398412984012e98712390481239840129384e",
    },
    {
      id: "shelter",
      name: "Emergency Shelter (30%)",
      amount: 162000,
      icon: HomeIcon,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      activeNgos: ["Turkish Red Crescent", "Ahbap Network", "Peace Winds Japan"],
      families: 3100,
      cid: "QmPRC3398412984012e98712390481239840129384e",
    },
  ];

  const ngos = [
    { id: "kizilay", name: "Turkish Red Crescent", category: "shelter", amount: 280000, zone: "Turkey/Syria", cid: "QmY9aX781b2c45e89d1234567890abcdef31x8" },
    { id: "ircs", name: "Indian Red Cross", category: "medical", amount: 160000, zone: "Wayanad, India", cid: "QmZ11902bcda44188c2901847192837482910c" },
    { id: "jrc", name: "Japanese Red Cross", category: "medical", amount: 120000, zone: "Honshu, Japan", cid: "QmJRC8812984012e98712390481239840129384e" },
    { id: "prc", name: "Philippine Red Cross", category: "food", amount: 110000, zone: "Surigao, Philippines", cid: "QmPRC3398412984012e98712390481239840129384e" },
    { id: "ahbap", name: "Ahbap Humanitarian", category: "shelter", amount: 100000, zone: "Gaziantep", cid: "QmA4412984012e98712390481239840129384e" },
    { id: "wfp", name: "UN WFP & OCHA", category: "food", amount: 205000, zone: "Cross-Archipelago", cid: "QmWFP9912984012e98712390481239840129384e" },
  ];

  const filteredCategories = activeFilter === "all" ? categories : categories.filter(c => c.id === activeFilter);
  const filteredNgos = activeFilter === "all" ? ngos : ngos.filter(n => n.category === activeFilter);

  return (
    <div className="rounded-3xl bg-white border border-[#E2E8F0] shadow-sm p-6 md:p-8 space-y-6">
      
      {/* Top Header & Filter Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200 text-xs font-mono font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              INTERACTIVE SANKEY FUND FLOW
            </span>
            <span className="text-[#CBD5E1]">•</span>
            <span className="text-xs text-[#64748B] font-mono">100% Visual Accountability</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#0F172A]">
            End-to-End Visual Fund Liquidity Pipeline
          </h2>
          <p className="text-xs md:text-sm text-[#475569] max-w-2xl leading-relaxed">
            Trace how every dollar moves in real-time: Multi-chain Inflows $\rightarrow$ Unified Smart Vault $\rightarrow$ Category Locks (Medical / Food / Shelter) $\rightarrow$ Verified Field NGOs $\rightarrow$ Beneficiary IPFS Receipts.
          </p>
        </div>

        {/* Category Focus Filter */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-mono self-start lg:self-auto">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-3 py-1.5 rounded-xl transition-all font-semibold ${
              activeFilter === "all" ? "bg-[#0F172A] text-white shadow-xs" : "text-[#64748B] hover:text-[#0F172A]"
            }`}
          >
            All Flows
          </button>
          <button
            onClick={() => setActiveFilter("medical")}
            className={`px-3 py-1.5 rounded-xl transition-all font-semibold ${
              activeFilter === "medical" ? "bg-rose-600 text-white shadow-xs" : "text-rose-700 hover:bg-rose-50"
            }`}
          >
            Medical
          </button>
          <button
            onClick={() => setActiveFilter("food")}
            className={`px-3 py-1.5 rounded-xl transition-all font-semibold ${
              activeFilter === "food" ? "bg-amber-600 text-white shadow-xs" : "text-amber-700 hover:bg-amber-50"
            }`}
          >
            Food & Water
          </button>
          <button
            onClick={() => setActiveFilter("shelter")}
            className={`px-3 py-1.5 rounded-xl transition-all font-semibold ${
              activeFilter === "shelter" ? "bg-emerald-600 text-white shadow-xs" : "text-emerald-700 hover:bg-emerald-50"
            }`}
          >
            Shelter
          </button>
        </div>
      </div>

      {/* SANKEY FLOW COLUMNS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
        
        {/* COLUMN 1: MULTI-CHAIN INFLOWS */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-[#64748B] pb-1 border-b border-[#E2E8F0]">
            <span className="font-bold text-[#0F172A] flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-blue-100 text-[#2563EB] flex items-center justify-center text-[10px]">1</span>
              MULTI-CHAIN INFLOWS
            </span>
            <span className="text-[10px] text-emerald-600 font-bold">100% On-Chain</span>
          </div>

          <div className="space-y-2.5">
            {inflows.map((item) => (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredNode(item.id)}
                onMouseLeave={() => setHoveredNode(null)}
                className={`p-4 rounded-2xl bg-white border ${item.border} shadow-2xs hover:shadow-xs transition-all space-y-1 relative overflow-hidden group cursor-pointer`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#0F172A]">{item.name}</span>
                  <span className="font-mono text-[11px] text-[#64748B]">{item.crypto}</span>
                </div>
                <div className="text-base font-bold font-mono text-[#0F172A]">
                  {formatCurrencyUSD(item.amount)}
                </div>
                <div className="text-[10px] text-[#94A3B8] font-mono flex items-center gap-1">
                  <span>Verified Deposit Lock</span>
                  <ArrowRight className="w-3 h-3 text-[#2563EB] group-hover:translate-x-1 transition-transform ml-auto" />
                </div>
              </div>
            ))}

            <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[11px] text-[#64748B] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Zero-Intermediary Fee Policy: 100% of crypto reaches vault.</span>
            </div>
          </div>
        </div>

        {/* COLUMN 2: UNIFIED VAULT ESCROW */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-[#64748B] pb-1 border-b border-[#E2E8F0]">
            <span className="font-bold text-[#0F172A] flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-blue-100 text-[#2563EB] flex items-center justify-center text-[10px]">2</span>
              PULSE SMART VAULT
            </span>
            <span className="text-[10px] text-[#2563EB] font-bold">Dual-Chain</span>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1E293B] to-[#0F172A] text-white space-y-3.5 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-300">TOTAL POOL ASSETS</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 text-[10px] font-mono">
                Auto-Triage Active
              </span>
            </div>

            <div>
              <div className="text-2xl font-bold font-mono text-white">
                {formatCurrencyUSD(totalVault)}
              </div>
              <div className="text-xs text-slate-400 font-mono mt-0.5">Ethereum Sepolia + Polygon Amoy</div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Aid Disbursed:</span>
                <span className="text-emerald-400 font-bold">{formatCurrencyUSD(disbursedTotal)} (52.6%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Emergency Reserve:</span>
                <span className="text-blue-300 font-bold">{formatCurrencyUSD(contingencyReserve)} (47.4%)</span>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 leading-snug pt-1">
              Triggered autonomously by Google Gemini 2.5 Flash Oracle when Richter $\ge$ 7.0.
            </div>
          </div>
        </div>

        {/* COLUMN 3: CATEGORY LOCKS */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-[#64748B] pb-1 border-b border-[#E2E8F0]">
            <span className="font-bold text-[#0F172A] flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-blue-100 text-[#2563EB] flex items-center justify-center text-[10px]">3</span>
              CATEGORY LOCKS
            </span>
            <span className="text-[10px] text-purple-600 font-bold">Smart Lock</span>
          </div>

          <div className="space-y-2.5">
            {filteredCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.id}
                  onClick={() => setActiveFilter(activeFilter === cat.id ? "all" : cat.id as any)}
                  className={`p-3.5 rounded-2xl bg-white border ${cat.border} shadow-2xs hover:border-[#2563EB] transition-all space-y-1.5 cursor-pointer group`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className={`p-1 rounded-lg ${cat.bg}`}>
                        <Icon className={`w-3.5 h-3.5 ${cat.color}`} />
                      </div>
                      <span className="text-xs font-bold text-[#0F172A]">{cat.name}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between font-mono text-xs pt-1">
                    <span className="font-bold text-[#0F172A]">{formatCurrencyUSD(cat.amount)}</span>
                    <span className="text-[10px] text-emerald-600 font-semibold">{cat.families.toLocaleString()} Families</span>
                  </div>

                  <div className="text-[10px] text-[#94A3B8] flex items-center justify-between pt-1 border-t border-[#F1F5F9]">
                    <span>{cat.activeNgos.length} NGO Partners</span>
                    <span className="text-[#2563EB] font-semibold flex items-center gap-0.5">
                      Trace <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* COLUMN 4: ACTIVE NGOS & VERIFIED IPFS DELIVERY */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-[#64748B] pb-1 border-b border-[#E2E8F0]">
            <span className="font-bold text-[#0F172A] flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-blue-100 text-[#2563EB] flex items-center justify-center text-[10px]">4</span>
              FIELD NGOS & VICTIMS
            </span>
            <span className="text-[10px] text-emerald-600 font-bold">100% Delivered</span>
          </div>

          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
            {filteredNgos.map((ngo) => (
              <div
                key={ngo.id}
                className="p-3 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs hover:border-[#2563EB] transition-all space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0F172A]">{ngo.name}</span>
                  <span className="text-[10px] font-mono text-emerald-600 font-bold">{formatCurrencyUSD(ngo.amount)}</span>
                </div>
                <div className="text-[11px] text-[#64748B] flex items-center justify-between">
                  <span>Zone: {ngo.zone}</span>
                  <button
                    onClick={() => onOpenIpfs?.(ngo.cid, `${ngo.name} — ${ngo.zone}`)}
                    className="text-[#2563EB] hover:underline font-mono text-[10px] flex items-center gap-0.5"
                  >
                    <span>IPFS Photo Receipt</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-mono text-emerald-800 flex items-center justify-between">
            <span className="font-bold">Total Beneficiaries:</span>
            <span className="text-sm font-bold text-emerald-700">12,600 Families</span>
          </div>
        </div>

      </div>

      {/* FOOTER SUMMARY STRIP */}
      <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 font-mono text-[#64748B]">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Every transaction shown above has an on-chain cryptographic transaction hash and decentralized IPFS proof.</span>
        </div>

        <button
          onClick={() => setActiveFilter("all")}
          className="text-[#2563EB] hover:underline font-semibold font-mono text-xs flex items-center gap-1"
        >
          <span>Reset Filter</span>
        </button>
      </div>

    </div>
  );
}
