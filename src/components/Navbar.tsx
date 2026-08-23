"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Copy, 
  Check, 
  LogOut, 
  ChevronDown, 
  ArrowUpRight, 
  Menu, 
  X,
  Wallet,
  Globe,
} from "lucide-react";
import { getExplorerAddressUrl } from "@/lib/contracts";
import { useWallet } from "@/context/WalletContext";

// Branded Blockchain Network SVG Icons
function EthereumIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 417" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M127.961 0L125.166 9.5V285.168L127.961 287.958L255.923 212.32L127.961 0Z" fill="#627EEA" />
      <path d="M127.962 0L0 212.32L127.962 287.958V157.34V0Z" fill="#627EEA" fillOpacity="0.8" />
      <path d="M127.961 312.187L126.386 314.106V413.447L127.961 416.892L256 236.585L127.961 312.187Z" fill="#627EEA" />
      <path d="M127.962 416.892V312.187L0 236.585L127.962 416.892Z" fill="#627EEA" fillOpacity="0.8" />
      <path d="M127.961 287.958L255.923 212.32L127.961 157.339V287.958Z" fill="#627EEA" fillOpacity="0.6" />
      <path d="M0 212.32L127.962 287.958V157.339L0 212.32Z" fill="#627EEA" fillOpacity="0.4" />
    </svg>
  );
}

function PolygonIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 38 33" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M29 10.2L19.5 4.7L10 10.2V21.2L19.5 26.7L29 21.2V10.2Z" fill="#8247E5" />
      <path fillRule="evenodd" clipRule="evenodd" d="M19.5 0L38 10.7V32L19.5 21.3L1 32V10.7L19.5 0ZM29 10.2L19.5 4.7L10 10.2V21.2L19.5 26.7L29 21.2V10.2Z" fill="#8247E5" />
    </svg>
  );
}

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
    { name: "Overview", href: "/" },
    { name: "Crisis Feed", href: "/crisis" },
    { name: "Aid Claims", href: "/beneficiary" },
    { name: "How It Works", href: "/#how-it-works" },
    { name: "Audit Ledger", href: "/audit" },
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
  const chainLabel = isAmoy ? "Polygon" : "Ethereum";
  const tokenSymbol = isAmoy ? "POL" : "ETH";

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-xl border-b border-[#E2E8F0] transition-all shadow-[0_1px_3px_rgba(0,0,0,0.02)] font-sans">
      <div className="w-full px-6 sm:px-10 lg:px-14 h-16 flex items-center justify-between relative">
        
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/" className="flex items-center gap-2.5 group">
            <img
              src="/ico.png"
              alt="Pulse"
              className="w-8 h-8 rounded-xl object-contain shadow-xs transition-transform group-hover:scale-105"
            />
            <span className="font-bold text-lg tracking-tight text-[#0F172A]">
              Pulse
            </span>
          </Link>
        </div>

        {/* Center: Desktop Navigation Links (Centered, Large & Darkened on active) */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-10 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[15px] tracking-[-0.01em] transition-colors py-1.5 ${
                  isActive
                    ? "text-[#0F172A] font-bold"
                    : "text-[#64748B] font-medium hover:text-[#0F172A]"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right: Pill Actions & Wallet */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative" ref={dropdownRef}>
            {isConnected ? (
              <button
                onClick={() => setWalletDropdownOpen(!walletDropdownOpen)}
                className="h-10 px-3.5 rounded-full bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] text-[#0F172A] text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                {isAmoy ? (
                  <div className="w-5 h-5 rounded-full bg-[#8247E5]/10 flex items-center justify-center shrink-0">
                    <PolygonIcon className="w-3.5 h-3.5" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full bg-[#627EEA]/10 flex items-center justify-center shrink-0">
                    <EthereumIcon className="w-3.5 h-3.5" />
                  </div>
                )}
                <span className="font-semibold text-xs text-[#0F172A]">{chainLabel}</span>
                <span className="text-[#CBD5E1]">•</span>
                <span className="font-semibold text-xs text-[#0F172A]">{balance} {tokenSymbol}</span>
                <span className="text-[#CBD5E1]">•</span>
                <span className="font-medium text-xs text-[#64748B]">{shortAddress}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-[#64748B] transition-transform ${walletDropdownOpen ? "rotate-180" : ""}`} />
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
                className="h-10 px-5 rounded-full bg-[#0F172A] hover:bg-black text-white text-xs font-semibold tracking-tight transition-all shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Wallet className="w-3.5 h-3.5" />
                <span>{isConnecting ? "Connecting..." : "Connect Wallet"}</span>
              </button>
            )}

            {/* Apple-style Wallet Popover */}
            {walletDropdownOpen && isConnected && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-xl p-4 space-y-3.5 z-50 animate-in fade-in zoom-in-95 duration-100 font-sans">
                
                {/* Connected Account */}
                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#F1F5F9] flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <div className="text-[10px] text-[#94A3B8] uppercase font-semibold">Connected Wallet</div>
                    <div className="text-xs font-medium text-[#0F172A] truncate mt-0.5">{address}</div>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="p-1.5 rounded-lg bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer"
                    title="Copy Address"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Network Switcher */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-bold text-[#94A3B8] uppercase px-1">Network Selector</div>
                  <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[#F8FAFC] border border-[#F1F5F9] text-xs">
                    <button
                      onClick={() => switchNetwork("sepolia")}
                      className={`py-2 px-2.5 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        isSepolia
                          ? "bg-white text-[#0F172A] font-bold shadow-xs border border-[#E2E8F0]"
                          : "text-[#64748B] hover:text-[#0F172A]"
                      }`}
                    >
                      <EthereumIcon className="w-4 h-4 shrink-0" />
                      <span>Ethereum</span>
                    </button>
                    <button
                      onClick={() => switchNetwork("amoy")}
                      className={`py-2 px-2.5 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        isAmoy
                          ? "bg-white text-[#0F172A] font-bold shadow-xs border border-[#E2E8F0]"
                          : "text-[#64748B] hover:text-[#0F172A]"
                      }`}
                    >
                      <PolygonIcon className="w-4 h-4 shrink-0" />
                      <span>Polygon</span>
                    </button>
                  </div>
                </div>

                {/* Balance */}
                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#F1F5F9] flex items-center justify-between text-xs">
                  <span className="text-[#94A3B8]">Available Balance:</span>
                  <span className="font-bold text-[#0F172A] text-sm">{balance} {tokenSymbol}</span>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-[#F1F5F9] space-y-1 text-xs font-medium">
                  {address && (
                    <a
                      href={getExplorerAddressUrl(isAmoy ? "amoy" : "sepolia", address)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 px-2.5 rounded-xl hover:bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A] flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5" />
                        <span>View on Block Explorer</span>
                      </div>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#94A3B8]" />
                    </a>
                  )}

                  <button
                    onClick={() => {
                      disconnectWallet();
                      setWalletDropdownOpen(false);
                    }}
                    className="w-full py-2 px-2.5 rounded-xl hover:bg-rose-50 text-rose-600 flex items-center gap-2 transition-colors font-medium cursor-pointer"
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
            className="md:hidden p-2 rounded-xl hover:bg-[#F8FAFC] text-[#0F172A] border border-[#E2E8F0]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 py-3 border-b border-[#E2E8F0] bg-white flex flex-col gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3.5 py-2.5 rounded-xl text-base transition-colors ${
                  isActive 
                    ? "text-[#0F172A] font-bold bg-[#F8FAFC]" 
                    : "text-[#64748B] font-medium hover:text-[#0F172A] hover:bg-[#F8FAFC]"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
