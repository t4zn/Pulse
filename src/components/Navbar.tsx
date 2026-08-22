"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, ShieldCheck, Search, Cpu, HeartHandshake, Wallet, Zap, ExternalLink, Menu, X, Radio } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Command Center", href: "/", icon: Activity },
    { name: "Active Crises", href: "/crisis/turkey-earthquake-2026", icon: HeartHandshake },
    { name: "Beneficiary Claim", href: "/beneficiary", icon: ShieldCheck },
    { name: "Live Audit", href: "/audit", icon: Search },
    { name: "AI Oracle", href: "/oracle", icon: Cpu },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-canvas/95 backdrop-blur-md border-b border-hairline transition-colors">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 h-14 flex items-center justify-between">
        {/* Brand Mark & Wordmark */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-6 h-6 rounded-md bg-surface-2 border border-hairline flex items-center justify-center text-primary group-hover:border-primary/60 transition-colors">
              <Zap className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm tracking-tight text-ink">
                PULSE
              </span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-surface-2 text-ink-subtle border border-hairline">
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
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? "text-ink bg-surface-2 border border-hairline-strong"
                      : "text-ink-subtle hover:text-ink hover:bg-surface-1 border border-transparent"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-primary" : "text-ink-tertiary"}`} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Live Protocol Status Pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-pill bg-surface-1 border border-hairline text-[11px] font-mono text-ink-subtle">
            <span className="w-1.5 h-1.5 rounded-full bg-semantic-success animate-pulse"></span>
            <span>Sepolia • Amoy</span>
          </div>

          {/* Wallet Button */}
          <button
            onClick={() => setIsConnected(!isConnected)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-surface-1 hover:bg-surface-2 text-ink text-xs font-medium border border-hairline hover:border-hairline-strong transition-all"
          >
            <Wallet className="w-3.5 h-3.5 text-primary" />
            <span className="font-mono text-[11px]">
              {isConnected ? "0x7F...3B9a" : "Connect"}
            </span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-md bg-surface-1 text-ink-subtle hover:text-ink border border-hairline"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 py-3 border-b border-hairline bg-surface-1 flex flex-col gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium ${
                  isActive ? "bg-surface-2 text-ink border border-hairline-strong" : "text-ink-subtle hover:text-ink"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5 text-primary" />
                  <span>{link.name}</span>
                </div>
                <ExternalLink className="w-3 h-3 text-ink-tertiary" />
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
