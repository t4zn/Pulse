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
  ArrowDownUp,
  ExternalLink,
  Menu,
  X,
  Wallet,
} from "lucide-react";
import { getExplorerAddressUrl } from "@/lib/contracts";
import { useWallet } from "@/context/WalletContext";
import { SwapModal } from "@/components/SwapModal";

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
  const [swapModalOpen, setSwapModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { name: "Command Center", href: "/" },
    { name: "Active Crises", href: "/crisis/turkey-earthquake-2026" },
    { name: "Beneficiary Claim", href: "/beneficiary" },
    { name: "Live Audit", href: "/audit" },
    { name: "AI Oracle", href: "/oracle" },
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
    <>
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-hairline transition-colors">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Left: Brand Logo & Wordmark */}
          <div className="flex items-center gap-8 shrink-0">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white transition-transform group-hover:scale-105 shadow-sm">
                <Zap className="w-4 h-4" />
              </div>
              <span className="font-semibold text-base tracking-tight text-ink">
                PULSE
              </span>
            </Link>

            {/* Desktop Navigation Links — Clean, Single-Line, Unwrapped */}
            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-medium whitespace-nowrap transition-colors py-1 relative ${
                      isActive
                        ? "text-ink font-semibold"
                        : "text-body hover:text-ink"
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action Controls — Unified & Ultra Minimal */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Minimal Swap Trigger */}
            <button
              onClick={() => setSwapModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full hover:bg-surface-soft text-body hover:text-ink text-xs font-semibold border border-transparent hover:border-hairline transition-all whitespace-nowrap"
              title="Instant Token Swap"
            >
              <ArrowDownUp className="w-3.5 h-3.5 text-primary" />
              <span>Swap</span>
            </button>

            {/* Unified Connected Wallet Pill */}
            <div className="relative" ref={dropdownRef}>
              {isConnected ? (
                <button
                  onClick={() => setWalletDropdownOpen(!walletDropdownOpen)}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-soft hover:bg-surface-strong text-ink text-xs font-medium border border-hairline transition-all shadow-sm group whitespace-nowrap"
                >
                  <span className={`w-2 h-2 rounded-full ${isAmoy ? "bg-primary" : "bg-semantic-up"} animate-pulse shrink-0`}></span>
                  <span className="font-mono text-body">{chainLabel}</span>
                  <span className="text-hairline">·</span>
                  <span className="font-mono text-ink font-semibold">{balance} {tokenSymbol}</span>
                  <span className="text-hairline">|</span>
                  <span className="font-mono text-body">{shortAddress}</span>
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
                  className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary hover:bg-primary-hover active:bg-primary-active text-white text-xs font-semibold transition-all shadow-sm disabled:opacity-50 whitespace-nowrap cursor-pointer"
                >
                  <Wallet className="w-3.5 h-3.5" />
                  <span>{isConnecting ? "Connecting..." : "Connect"}</span>
                </button>
              )}

              {/* Minimal Dropdown Toggle */}
              {walletDropdownOpen && isConnected && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-hairline rounded-2xl overflow-hidden shadow-elevated p-3 space-y-2.5 z-50 animate-in fade-in zoom-in-95 duration-100 font-sans">
                  
                  {/* Account Address & Copy */}
                  <div className="p-2.5 rounded-xl bg-surface-soft border border-hairline flex items-center justify-between">
                    <div className="min-w-0 pr-2">
                      <div className="text-[10px] font-mono text-muted uppercase">Connected Wallet</div>
                      <div className="text-xs font-mono font-semibold text-ink truncate">{address}</div>
                    </div>
                    <button
                      onClick={handleCopy}
                      className="p-1.5 rounded-lg bg-white border border-hairline text-body hover:text-ink hover:border-primary/40 transition-colors shrink-0"
                      title="Copy Address"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-semantic-up" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* 1-Click Network Switcher Toggle */}
                  <div className="space-y-1">
                    <div className="text-[10px] font-semibold text-muted uppercase px-1">Active Network</div>
                    <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-surface-soft border border-hairline text-xs font-mono">
                      <button
                        onClick={() => switchNetwork("sepolia")}
                        className={`py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                          isSepolia
                            ? "bg-white text-ink font-semibold shadow-sm"
                            : "text-muted hover:text-ink"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${isSepolia ? "bg-semantic-up" : "bg-muted"}`}></span>
                        <span>Sepolia</span>
                      </button>
                      <button
                        onClick={() => switchNetwork("amoy")}
                        className={`py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                          isAmoy
                            ? "bg-white text-ink font-semibold shadow-sm"
                            : "text-muted hover:text-ink"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${isAmoy ? "bg-primary" : "bg-muted"}`}></span>
                        <span>Amoy</span>
                      </button>
                    </div>
                  </div>

                  {/* Available Balance */}
                  <div className="p-2.5 rounded-xl bg-surface-soft border border-hairline flex items-center justify-between text-xs font-mono">
                    <span className="text-muted">Balance:</span>
                    <span className="text-semantic-up font-bold">{balance} {tokenSymbol}</span>
                  </div>

                  {/* Quick Dropdown Actions */}
                  <div className="space-y-0.5 pt-1 border-t border-hairline text-xs font-medium">
                    <button
                      onClick={() => {
                        setWalletDropdownOpen(false);
                        setSwapModalOpen(true);
                      }}
                      className="w-full py-2 px-2.5 rounded-xl hover:bg-surface-soft text-ink flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <ArrowDownUp className="w-3.5 h-3.5 text-primary" />
                        <span>Swap Tokens</span>
                      </div>
                      <span className="text-[10px] font-mono text-muted">Zero-Fee</span>
                    </button>

                    {address && (
                      <a
                        href={getExplorerAddressUrl(isAmoy ? "amoy" : "sepolia", address)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2 px-2.5 rounded-xl hover:bg-surface-soft text-body hover:text-ink flex items-center justify-between transition-colors"
                      >
                        <span>View on Explorer</span>
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
                      <span>Disconnect</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-full hover:bg-surface-soft text-body hover:text-ink"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden px-4 py-4 border-b border-hairline bg-white flex flex-col gap-1.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setSwapModalOpen(true);
              }}
              className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold bg-surface-soft text-ink"
            >
              <div className="flex items-center gap-2.5">
                <ArrowDownUp className="w-4 h-4 text-primary" />
                <span>Swap Tokens</span>
              </div>
            </button>
            {navLinks.map((link) => {
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
                  <span>{link.name}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-muted" />
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Minimal Swap Modal */}
      <SwapModal isOpen={swapModalOpen} onClose={() => setSwapModalOpen(false)} />
    </>
  );
}
