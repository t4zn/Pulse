"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, ShieldCheck, Search, Cpu, HeartHandshake, Wallet, Zap, ExternalLink, Menu, X } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Command Center", href: "/", icon: Activity },
    { name: "Crisis Terminal", href: "/crisis/turkey-earthquake-2026", icon: HeartHandshake },
    { name: "Beneficiary Portal", href: "/beneficiary", icon: ShieldCheck },
    { name: "Live Audit Ledger", href: "/audit", icon: Search },
    { name: "AI Severity Oracle", href: "/oracle", icon: Cpu },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-canvas/90 backdrop-blur-md border-b border-hairline transition-all">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 h-14 flex items-center justify-between">
        {/* Brand Mark & Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-md bg-primary/10 border border-primary/30 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-[0_0_12px_rgba(94,106,210,0.3)]">
              <Zap className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[17px] tracking-tight text-ink group-hover:text-white transition-colors">
                PULSE
              </span>
              <span className="text-[10px] font-mono tracking-wider uppercase px-1.5 py-0.5 rounded bg-surface-2 text-ink-subtle border border-hairline">
                PROT
              </span>
            </div>
          </Link>

          {/* Navigation Items (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-medium transition-all ${
                    isActive
                      ? "text-ink bg-surface-2 border border-hairline-strong"
                      : "text-ink-subtle hover:text-ink hover:bg-surface-1 border border-transparent"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-primary" : "text-ink-subtle"}`} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Judge Demo Simulation Switch */}
          <button
            onClick={() => setIsDemoMode(!isDemoMode)}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-mono transition-all border ${
              isDemoMode
                ? "bg-primary/10 text-primary border-primary/30 hover:bg-primary/20"
                : "bg-surface-2 text-semantic-success border-semantic-success/30 hover:bg-surface-3"
            }`}
            title="Toggle between Judge Simulation Mode and Live Testnet Relayer"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isDemoMode ? "bg-primary animate-pulse" : "bg-semantic-success"}`}></span>
            <span>{isDemoMode ? "⚡ Demo Mode" : "🌐 Sepolia/Amoy"}</span>
          </button>

          {/* Wallet Button */}
          <button
            onClick={() => setIsConnected(!isConnected)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-surface-1 hover:bg-surface-2 text-ink text-[13px] font-medium border border-hairline hover:border-hairline-strong transition-all"
          >
            <Wallet className="w-3.5 h-3.5 text-primary" />
            <span className="font-mono text-[12px]">
              {isConnected ? "0x7F...3B9a" : "Connect Wallet"}
            </span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-md bg-surface-1 text-ink-subtle hover:text-ink border border-hairline"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-2 pb-4 border-b border-hairline bg-surface-1 flex flex-col gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium ${
                  isActive ? "bg-surface-2 text-ink border border-hairline-strong" : "text-ink-subtle hover:text-ink"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-primary" />
                  <span>{link.name}</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-ink-tertiary" />
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
