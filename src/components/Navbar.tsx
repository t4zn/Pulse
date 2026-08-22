"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Zap, 
  Copy, 
  Check, 
  LogOut, 
  ChevronDown, 
  ArrowUpRight, 
  ExternalLink, 
  Menu, 
  X,
  Wallet,
  Globe,
  Home,
  Flame,
  ShieldCheck,
  Search,
  Cpu
} from "lucide-react";
import { getExplorerAddressUrl } from "@/lib/contracts";
import { useWallet } from "@/context/WalletContext";

export function Navbar() {
  const pathname = usePathname();
  const {
    address,
    shortAddress,
    isConnected,
    isConnecting,
    chainId,
    balance,
    connectWallet,
    disconnectWallet,
    switchNetwork,
  } = useWallet();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [walletDropdownOpen, setWalletDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Crisis", href: "/crisis/turkey-earthquake-2026", icon: Flame },
    { name: "Claims", href: "/beneficiary", icon: ShieldCheck },
    { name: "Audit", href: "/audit", icon: Search },
    { name: "Oracle", href: "/oracle", icon: Cpu },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setWalletDropdownOpen(false);
      }
    }
    if (walletDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [walletDropdownOpen]);

  const handleCopy = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const isSepolia = chainId === 11155111;
  const isAmoy = chainId === 80002;
  const chainLabel = isAmoy ? "Amoy" : "Sepolia";
  const tokenSymbol = isAmoy ? "POL" : "ETH";

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-xl border-b border-hairline transition-all shadow-[0_1px_3px_rgba(0,0,0,0.03)] font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="w-full px-6 sm:px-10 lg:px-14 h-16 flex items-center justify-between relative">
        
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center text-white transition-all shadow-xs group-hover:scale-105">
              <Zap className="w-4 h-4 fill-white" />
            </div>
            <span className="font-['Space_Grotesk',sans-serif] font-bold text-xl tracking-tight text-ink">
              PULSE
            </span>
          </Link>
        </div>

        {/* Center: Desktop Navigation Links Centered with icons & balanced distance */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-10 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 text-[15px] tracking-[-0.01em] font-semibold whitespace-nowrap transition-colors py-1.5 px-1 relative group ${
                  isActive
                    ? "text-ink font-bold"
                    : "text-body hover:text-ink"
                }`}
              >
                <Icon className={`w-4 h-4 transition-colors ${isActive ? "text-primary" : "text-muted group-hover:text-primary"}`} />
                <span>{link.name}</span>
                {isActive && (
                  <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-primary rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: Wallet Profile Button & Dropdown */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="relative" ref={dropdownRef}>
            {isConnected ? (
              <button
                onClick={() => setWalletDropdownOpen(!walletDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-surface-soft text-ink text-xs font-semibold border border-hairline transition-all shadow-xs group whitespace-nowrap"
              >
                <span className={`w-2 h-2 rounded-full ${isAmoy ? "bg-primary" : "bg-semantic-up"} animate-pulse shrink-0`}></span>
                <span className="font-mono text-muted text-[11px] font-medium">{chainLabel}</span>
                <span className="text-hairline">/</span>
                <span className="font-mono text-ink font-bold text-[11px]">{balance} {tokenSymbol}</span>
                <span className="text-hairline">/</span>
                <span className="font-mono text-body text-[11px]">{shortAddress}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-muted group-hover:text-ink transition-transform ${walletDropdownOpen ? "rotate-180" : ""}`} />
              </button>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  connectWallet();
                }}
                disabled={isConnecting}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover active:bg-primary-active text-white text-xs font-bold tracking-tight transition-all shadow-sm hover:shadow-md hover:shadow-primary/20 disabled:opacity-50 whitespace-nowrap cursor-pointer hover:-translate-y-0.5"
              >
                <Wallet className="w-3.5 h-3.5" />
                <span>{isConnecting ? "Connecting..." : "Connect Wallet"}</span>
              </button>
            )}

            {/* SaaS Dropdown Popover */}
            {walletDropdownOpen && isConnected && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-hairline rounded-2xl overflow-hidden shadow-elevated p-4 space-y-3.5 z-50 animate-in fade-in zoom-in-95 duration-100 font-sans">
                
                {/* Account Card */}
                <div className="p-3 rounded-xl bg-surface-soft border border-hairline flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <div className="text-[10px] font-mono text-muted uppercase font-semibold">Connected Address</div>
                    <div className="text-xs font-mono font-semibold text-ink truncate mt-0.5">{address}</div>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="p-1.5 rounded-lg bg-white border border-hairline text-body hover:text-ink hover:border-primary/40 transition-colors shrink-0"
                    title="Copy Address"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-semantic-up" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* 1-Click Network Selector */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-semibold text-muted uppercase px-1">Network Selector</div>
                  <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-surface-soft border border-hairline text-xs font-mono">
                    <button
                      onClick={() => switchNetwork("sepolia")}
                      className={`py-2 px-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                        isSepolia
                          ? "bg-white text-ink font-semibold shadow-xs"
                          : "text-muted hover:text-ink"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isSepolia ? "bg-semantic-up" : "bg-muted"}`}></span>
                      <span>Sepolia</span>
                    </button>
                    <button
                      onClick={() => switchNetwork("amoy")}
                      className={`py-2 px-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                        isAmoy
                          ? "bg-white text-ink font-semibold shadow-xs"
                          : "text-muted hover:text-ink"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isAmoy ? "bg-primary" : "bg-muted"}`}></span>
                      <span>Amoy</span>
                    </button>
                  </div>
                </div>

                {/* Balance Display */}
                <div className="p-3 rounded-xl bg-surface-soft border border-hairline flex items-center justify-between text-xs font-mono">
                  <span className="text-muted">Available Balance:</span>
                  <span className="text-semantic-up font-bold text-sm">{balance} {tokenSymbol}</span>
                </div>

                {/* Actions */}
                <div className="space-y-1 pt-2 border-t border-hairline text-xs font-medium">
                  {address && (
                    <a
                      href={getExplorerAddressUrl(isAmoy ? "amoy" : "sepolia", address)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 px-2.5 rounded-xl hover:bg-surface-soft text-body hover:text-ink flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5 text-muted" />
                        <span>View on Explorer</span>
                      </div>
                      <ArrowUpRight className="w-3.5 h-3.5 text-muted" />
                    </a>
                  )}

                  <button
                    onClick={() => {
                      disconnectWallet();
                      setWalletDropdownOpen(false);
                    }}
                    className="w-full py-2 px-2.5 rounded-xl hover:bg-red-50 text-semantic-down flex items-center gap-2 transition-colors font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Disconnect Wallet</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-surface-soft text-body hover:text-ink border border-hairline"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 py-3 border-b border-hairline bg-white flex flex-col gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isActive 
                    ? "bg-primary/10 text-primary font-bold" 
                    : "text-body hover:text-ink hover:bg-surface-soft"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-muted" />
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
