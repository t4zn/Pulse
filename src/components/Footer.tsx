import React from "react";
import Link from "next/link";
import { Zap, ExternalLink, Shield, Cpu, Lock, Github, Globe } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-canvas border-t border-hairline py-16 px-4 md:px-8 text-ink-subtle">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-5 gap-10">
        {/* Brand Column */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
              <Zap className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-ink text-base tracking-tight">PULSE PROTOCOL</span>
          </div>
          <p className="text-sm text-ink-subtle leading-relaxed max-w-sm">
            Cross-chain disaster emergency vault, automated AI severity releases with Gemini 2.5 Flash, and zero-knowledge victim aid distribution.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-1 border border-hairline text-xs font-mono text-ink-muted">
              <span className="w-2 h-2 rounded-full bg-semantic-success animate-pulse"></span>
              <span>Sepolia & Polygon Amoy Live</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-1 border border-hairline text-xs font-mono text-ink-muted">
              <Lock className="w-3 h-3 text-primary" />
              <span>Merkle ZK Proofs</span>
            </div>
          </div>
        </div>

        {/* Quick Links Column 1: Core Pages */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-mono tracking-wider uppercase text-ink font-semibold">Application Pages</h4>
          <ul className="flex flex-col gap-2.5 text-sm">
            <li>
              <Link href="/" className="hover:text-ink transition-colors flex items-center gap-1">
                Global Command Center
              </Link>
            </li>
            <li>
              <Link href="/crisis/turkey-earthquake-2026" className="hover:text-ink transition-colors flex items-center gap-1">
                Crisis Donation Terminal
              </Link>
            </li>
            <li>
              <Link href="/beneficiary" className="hover:text-ink transition-colors flex items-center gap-1">
                Beneficiary & Merkle Claim
              </Link>
            </li>
            <li>
              <Link href="/audit" className="hover:text-ink transition-colors flex items-center gap-1">
                Glass-Box Live Audit
              </Link>
            </li>
            <li>
              <Link href="/oracle" className="hover:text-ink transition-colors flex items-center gap-1">
                AI Severity Oracle Simulator
              </Link>
            </li>
          </ul>
        </div>

        {/* Quick Links Column 2: Protocol Architecture */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-mono tracking-wider uppercase text-ink font-semibold">Protocol Infrastructure</h4>
          <ul className="flex flex-col gap-2.5 text-sm">
            <li className="hover:text-ink cursor-pointer flex items-center gap-1">
              Polygon Amoy Vault Contract <ExternalLink className="w-3 h-3" />
            </li>
            <li className="hover:text-ink cursor-pointer flex items-center gap-1">
              Ethereum Sepolia Vault <ExternalLink className="w-3 h-3" />
            </li>
            <li className="hover:text-ink cursor-pointer flex items-center gap-1">
              Gemini 2.5 Flash Oracle API <ExternalLink className="w-3 h-3" />
            </li>
            <li className="hover:text-ink cursor-pointer flex items-center gap-1">
              EIP-712 Meta-Tx Sponsor <ExternalLink className="w-3 h-3" />
            </li>
            <li className="hover:text-ink cursor-pointer flex items-center gap-1">
              IPFS Delivery Receipts <ExternalLink className="w-3 h-3" />
            </li>
          </ul>
        </div>

        {/* Quick Links Column 3: Hackathon Metadata */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-mono tracking-wider uppercase text-ink font-semibold">Hackathon Submission</h4>
          <ul className="flex flex-col gap-2.5 text-sm">
            <li className="hover:text-ink cursor-pointer">Project Masterplan</li>
            <li className="hover:text-ink cursor-pointer">Design System (DESIGN.md)</li>
            <li className="hover:text-ink cursor-pointer">Smart Contract Specs</li>
            <li className="hover:text-ink cursor-pointer">1-Click Judge Demo Guide</li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-[1280px] mx-auto mt-12 pt-6 border-t border-hairline flex flex-col sm:flex-row items-center justify-between text-xs text-ink-tertiary gap-4">
        <div>
          © 2026 Pulse Protocol • Replicating Linear Design Craft (`#010102` Canvas)
        </div>
        <div className="flex items-center gap-6">
          <span className="hover:text-ink cursor-pointer">Privacy First</span>
          <span className="hover:text-ink cursor-pointer">Zero Gas Fee Payouts</span>
          <span className="hover:text-ink cursor-pointer">Verifiable Aid</span>
        </div>
      </div>
    </footer>
  );
}
