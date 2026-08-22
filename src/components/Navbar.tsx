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
  ExternalLink, 
  Menu, 
  X, 
  Zap,
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
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-hairline transition-colors">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          {/* Brand Mark & Wordmark */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white transition-transform group-hover:scale-105">
                <Zap className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-base tracking-tight text-ink">
                  PULSE
                </span>
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-surface-strong text-body border border-hairline">
                  PROTOCOL
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      isActive
                        ? "text-primary bg-primary/10 font-semibold"
                        : "text-body hover:text-ink hover:bg-surface-soft"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Action Controls & Interactive Network Indicators */}
          <div className="flex items-center gap-3">
            {/* Interactive Network Indicators */}
            <div className="hidden sm:flex items-center gap-1 bg-surface-soft p-1 rounded-full border border-hairline text-xs font-mono">
              <button
                onClick={() => setActiveNetworkModal("sepolia")}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full hover:bg-surface-strong text-body hover:text-ink transition-colors"
                title="Ethereum Sepolia Status"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-semantic-up animate-pulse"></span>
                <span>Sepolia</span>
              </button>
              <span className="text-hairline">|</span>
              <button
                onClick={() => setActiveNetworkModal("amoy")}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full hover:bg-surface-strong text-body hover:text-ink transition-colors"
                title="Polygon Amoy Status"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                <span>Amoy</span>
              </button>
            </div>

            {/* Wallet Button - Coinbase Primary Pill */}
            <button
              onClick={() => setIsConnected(!isConnected)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary hover:bg-primary-hover active:bg-primary-active text-white text-sm font-semibold transition-all shadow-sm"
            >
              <Wallet className="w-4 h-4" />
              <span className="font-mono text-xs">
                {isConnected ? "0x7F23...B39a" : "Connect"}
              </span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full bg-surface-soft text-body hover:text-ink border border-hairline"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 py-4 border-b border-hairline bg-white flex flex-col gap-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium ${
                    isActive 
                      ? "bg-primary/10 text-primary font-semibold" 
                      : "text-body hover:text-ink hover:bg-surface-soft"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? "text-primary" : "text-muted"}`} />
                    <span>{link.name}</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-muted" />
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Network Modal */}
      {activeNetworkModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-hairline rounded-2xl overflow-hidden shadow-elevated p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-hairline">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-semantic-up animate-pulse"></span>
                <h3 className="text-base font-semibold text-ink">
                  {NETWORKS[activeNetworkModal].name} Network
                </h3>
              </div>
              <button
                onClick={() => setActiveNetworkModal(null)}
                className="p-1 rounded-full hover:bg-surface-soft text-muted hover:text-ink"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between p-2.5 rounded-xl bg-surface-soft border border-hairline">
                <span className="text-body">Chain ID:</span>
                <span className="text-ink font-semibold">{NETWORKS[activeNetworkModal].chainId}</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-surface-soft border border-hairline">
                <span className="text-body">Native Asset:</span>
                <span className="text-primary font-semibold">{NETWORKS[activeNetworkModal].nativeCurrency.symbol}</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-surface-soft border border-hairline">
                <span className="text-body">Vault Contract:</span>
                <span className="text-ink truncate max-w-[200px]">{NETWORKS[activeNetworkModal].contracts.vault}</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-surface-soft border border-hairline">
                <span className="text-body">RPC Gateway:</span>
                <span className="text-body truncate max-w-[200px]">{NETWORKS[activeNetworkModal].rpcUrl}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <a
                href={NETWORKS[activeNetworkModal].explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
              >
                <span>View on {NETWORKS[activeNetworkModal].explorerName}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <button
                onClick={() => setActiveNetworkModal(null)}
                className="px-4 py-1.5 rounded-full bg-primary hover:bg-primary-hover text-white text-xs font-semibold"
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
