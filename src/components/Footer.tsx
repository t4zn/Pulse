import React from "react";
import Link from "next/link";
import { ExternalLink, ShieldCheck, HardDrive } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-white border-t border-[#E2E8F0] py-10 sm:py-12 px-4 md:px-8 text-sm font-sans">
      <div className="max-w-[1140px] mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
          
          {/* Brand Column */}
          <div className="space-y-3 max-w-sm">
            <Link href="/" className="flex items-center gap-2.5">
              <img
                src="/ico.png"
                alt="Pulse Protocol"
                className="w-7 h-7 rounded-lg object-contain border border-[#E2E8F0] p-0.5"
              />
              <span className="font-bold text-base tracking-tight text-[#0F172A]">
                Pulse Protocol
              </span>
            </Link>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Autonomous disaster liquidity vaults and zero-knowledge emergency aid disbursement on Ethereum &amp; Polygon.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-[#64748B]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>All Systems Operational &bull; Ethereum &amp; Polygon</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-xs text-[#0F172A] uppercase tracking-wider">
              Quick Navigation
            </h4>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
              <Link href="/" className="text-[#64748B] hover:text-[#0F172A] transition-colors">
                Overview
              </Link>
              <Link href="/crisis" className="text-[#64748B] hover:text-[#0F172A] transition-colors">
                Crisis Feed
              </Link>
              <Link href="/beneficiary" className="text-[#64748B] hover:text-[#0F172A] transition-colors">
                Aid Claims
              </Link>
              <Link href="/#how-it-works" className="text-[#64748B] hover:text-[#0F172A] transition-colors">
                How It Works
              </Link>
              <Link href="/audit" className="text-[#64748B] hover:text-[#0F172A] transition-colors">
                Audit Ledger
              </Link>
            </div>
          </div>

          {/* Live Explorers & Data */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-xs text-[#0F172A] uppercase tracking-wider">
              Verifiable Sources
            </h4>
            <div className="space-y-2 text-xs">
              <a
                href="https://polygonscan.com"
                target="_blank"
                rel="noreferrer"
                className="text-[#64748B] hover:text-[#0F172A] transition-colors flex items-center gap-1"
              >
                <span>PolygonScan Explorer</span>
                <ExternalLink className="w-3 h-3 text-[#94A3B8]" />
              </a>
              <a
                href="https://etherscan.io"
                target="_blank"
                rel="noreferrer"
                className="text-[#64748B] hover:text-[#0F172A] transition-colors flex items-center gap-1"
              >
                <span>Etherscan Explorer</span>
                <ExternalLink className="w-3 h-3 text-[#94A3B8]" />
              </a>
              <a
                href="https://earthquake.usgs.gov"
                target="_blank"
                rel="noreferrer"
                className="text-[#64748B] hover:text-[#0F172A] transition-colors flex items-center gap-1"
              >
                <span>USGS Real-time Seismology</span>
                <ExternalLink className="w-3 h-3 text-[#94A3B8]" />
              </a>
              <a
                href="https://ipfs.tech"
                target="_blank"
                rel="noreferrer"
                className="text-[#64748B] hover:text-[#0F172A] transition-colors flex items-center gap-1"
              >
                <span>Filecoin / IPFS Registry</span>
                <ExternalLink className="w-3 h-3 text-[#94A3B8]" />
              </a>
            </div>
          </div>

        </div>

        {/* Minimal Bottom Bar */}
        <div className="pt-6 border-t border-[#F1F5F9] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#94A3B8]">
          <div>
            &copy; {new Date().getFullYear()} Pulse Protocol. Non-custodial humanitarian liquidity.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Zero-Knowledge Proofs</span>
            <span>&bull;</span>
            <span>Filecoin Sealed</span>
            <span>&bull;</span>
            <span>Zero-Gas Claims</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
