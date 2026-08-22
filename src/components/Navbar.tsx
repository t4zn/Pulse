"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Activity, 
  ShieldCheck, 
  Search, 
  Cpu, 
  HeartHandshake, 
  Wallet, 
  Zap, 
  ExternalLink, 
  Menu, 
  X, 
  Check, 
  Globe,
  Radio
} from "lucide-react";
import { NETWORKS } from "@/lib/contracts";

export function Navbar() {
  const pathname = usePathname();
  const [isConnected, setIsConnected] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeNetworkModal, setActiveNetworkModal] = useState<"sepolia" | "amoy" | null>(null);

  const navLinks = [
    { name: "Command Center", href: "/", icon: Activity },
    { name: "Active Crises", href: "/crisis/turkey-earthquake-2026", icon: HeartHandshake },
    { name: "Beneficiary Claim", href: "/beneficiary", icon: ShieldCheck },
    { name: "Live Audit", href: "/audit", icon: Search },
    { name: "AI Oracle", href: "/oracle", icon: Cpu },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-[#070B12]/95 backdrop-blur-md border-b border-white/[0.08] transition-colors">
        <div className="max-w-[1360px] mx-auto px-4 md:px-8 h-14 flex items-center justify-between">
          {/* Brand Mark & Wordmark */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-6 h-6 rounded-md bg-[#101824] border border-white/[0.08] flex items-center justify-center text-sky-400 group-hover:border-sky-400/60 transition-colors">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-tight text-[#F8FAFC]">
                  PULSE
                </span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#101824] text-[#94A3B8] border border-white/[0.08]">
                  v1.0
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      isActive
                        ? "text-sky-300 bg-sky-500/10 border border-sky-500/30 shadow-[0_0_12px_rgba(56,189,248,0.12)]"
                        : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#101824] border border-transparent"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? "text-sky-400" : "text-[#64748B]"}`} />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Action Controls & Interactive Network Indicators */}
          <div className="flex items-center gap-2">
            {/* Interactive Network Indicators */}
            <div className="hidden sm:flex items-center gap-1 bg-[#101824] p-1 rounded-lg border border-white/[0.08] text-[11px] font-mono">
              <button
                onClick={() => setActiveNetworkModal("sepolia")}
                className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/[0.06] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
                title="Inspect Ethereum Sepolia RPC & Contract"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Sepolia</span>
              </button>
              <span className="text-white/20">|</span>
              <button
                onClick={() => setActiveNetworkModal("amoy")}
                className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/[0.06] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
                title="Inspect Polygon Amoy RPC & Contract"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse"></span>
                <span>Amoy</span>
              </button>
            </div>

            {/* Wallet Button */}
            <button
              onClick={() => setIsConnected(!isConnected)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#101824] hover:bg-white/[0.06] text-[#F8FAFC] text-xs font-medium border border-white/[0.08] hover:border-white/20 transition-all"
            >
              <Wallet className="w-3.5 h-3.5 text-sky-400" />
              <span className="font-mono text-[11px]">
                {isConnected ? "0x7F23...B39a" : "Connect"}
              </span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-md bg-[#101824] text-[#94A3B8] hover:text-[#F8FAFC] border border-white/[0.08]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 py-3 border-b border-white/[0.08] bg-[#0B111A] flex flex-col gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium ${
                    isActive 
                      ? "bg-sky-500/10 text-sky-300 border border-sky-500/30" 
                      : "text-[#94A3B8] hover:text-[#F8FAFC]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5 text-sky-400" />
                    <span>{link.name}</span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-[#64748B]" />
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Interactive Network Inspector Modal */}
      {activeNetworkModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#101824] border border-white/[0.12] rounded-xl overflow-hidden shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <h3 className="text-sm font-semibold text-[#F8FAFC]">
                  {NETWORKS[activeNetworkModal].name} Network State
                </h3>
              </div>
              <button
                onClick={() => setActiveNetworkModal(null)}
                className="p-1 rounded bg-white/[0.04] text-[#94A3B8] hover:text-[#F8FAFC]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex justify-between p-2 rounded bg-[#070B12] border border-white/[0.04]">
                <span className="text-[#94A3B8]">Chain ID:</span>
                <span className="text-[#F8FAFC] font-bold">{NETWORKS[activeNetworkModal].chainId}</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-[#070B12] border border-white/[0.04]">
                <span className="text-[#94A3B8]">Native Token:</span>
                <span className="text-sky-400 font-bold">{NETWORKS[activeNetworkModal].nativeCurrency.symbol}</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-[#070B12] border border-white/[0.04]">
                <span className="text-[#94A3B8]">Vault Contract:</span>
                <span className="text-[#F8FAFC] truncate max-w-[180px]">{NETWORKS[activeNetworkModal].contracts.vault}</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-[#070B12] border border-white/[0.04]">
                <span className="text-[#94A3B8]">RPC Endpoint:</span>
                <span className="text-[#94A3B8] truncate max-w-[180px]">{NETWORKS[activeNetworkModal].rpcUrl}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <a
                href={NETWORKS[activeNetworkModal].explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-sky-400 hover:underline flex items-center gap-1"
              >
                <span>Open {NETWORKS[activeNetworkModal].explorerName}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <button
                onClick={() => setActiveNetworkModal(null)}
                className="px-3 py-1.5 rounded-md bg-sky-500 hover:bg-sky-400 text-black text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
