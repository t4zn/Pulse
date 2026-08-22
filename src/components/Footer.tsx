import React from "react";
import Link from "next/link";
import { Zap, ShieldCheck, ExternalLink, Globe } from "lucide-react";
import { NETWORKS } from "@/lib/contracts";

export function Footer() {
  return (
    <footer className="w-full bg-[#070B12] border-t border-white/[0.08] py-8 px-4 md:px-8 text-[#94A3B8]">
      <div className="max-w-[1360px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-mono">
        {/* Left: Brand & Description */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-[#101824] border border-white/[0.08] flex items-center justify-center text-sky-400">
              <Zap className="w-3 h-3" />
            </div>
            <span className="font-bold text-[#F8FAFC]">PULSE Protocol</span>
          </div>
          <span className="hidden sm:inline text-white/20">•</span>
          <span className="text-[#64748B]">Cross-Chain Emergency Aid Infrastructure</span>
        </div>

        {/* Middle: Networks & Stack */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-[#94A3B8]">
          <div className="flex items-center gap-1.5">
            <span className="text-[#64748B]">Networks:</span>
            <a 
              href={NETWORKS.sepolia.explorerUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#F8FAFC] hover:text-sky-400 transition-colors"
            >
              Sepolia
            </a>
            <span className="text-white/20">•</span>
            <a 
              href={NETWORKS.amoy.explorerUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#F8FAFC] hover:text-sky-400 transition-colors"
            >
              Polygon Amoy
            </a>
          </div>
          <span className="hidden md:inline text-white/20">|</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[#64748B]">Technology:</span>
            <span className="text-[#F8FAFC]">Solidity</span>
            <span className="text-white/20">•</span>
            <span className="text-[#F8FAFC]">ethers.js</span>
            <span className="text-white/20">•</span>
            <span className="text-[#F8FAFC]">wagmi</span>
            <span className="text-white/20">•</span>
            <span className="text-[#F8FAFC]">IPFS</span>
          </div>
        </div>

        {/* Right: Verification Guarantee */}
        <div className="text-[11px] text-[#64748B] flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Public audit data is independently verifiable on-chain.</span>
        </div>
      </div>
    </footer>
  );
}
