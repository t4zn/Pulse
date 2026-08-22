import React from "react";
import Link from "next/link";
import { Zap, ExternalLink, Shield, Cpu, Lock, Github, Globe } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-canvas border-t border-hairline py-12 px-4 md:px-8 text-ink-subtle">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Column */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-surface-2 border border-hairline flex items-center justify-center text-primary">
              <Zap className="w-3 h-3" />
            </div>
            <span className="font-semibold text-ink text-sm tracking-tight">PULSE PROTOCOL</span>
          </div>
          <p className="text-xs text-ink-subtle leading-relaxed">
            Cross-chain disaster emergency liquidity, automated AI severity releases with Gemini 2.5 Flash, and zero-knowledge victim aid distribution.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface-1 border border-hairline text-[10px] font-mono text-ink-muted">
              <span className="w-1.5 h-1.5 rounded-full bg-semantic-success animate-pulse"></span>
              <span>Sepolia & Amoy</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface-1 border border-hairline text-[10px] font-mono text-ink-muted">
              <Lock className="w-2.5 h-2.5 text-primary" />
              <span>Merkle ZK</span>
            </div>
          </div>
        </div>

        {/* Column 1: Core Pages */}
        <div className="flex flex-col gap-2.5">
          <h4 className="text-[11px] font-mono tracking-wider uppercase text-ink font-semibold">Application</h4>
          <ul className="flex flex-col gap-2 text-xs">
            <li>
              <Link href="/" className="hover:text-ink transition-colors">
                Command Center
              </Link>
            </li>
            <li>
              <Link href="/crisis/turkey-earthquake-2026" className="hover:text-ink transition-colors">
                Active Crisis Terminal
              </Link>
            </li>
            <li>
              <Link href="/beneficiary" className="hover:text-ink transition-colors">
                Beneficiary Claim
              </Link>
            </li>
            <li>
              <Link href="/audit" className="hover:text-ink transition-colors">
                Transparent Audit Ledger
              </Link>
            </li>
            <li>
              <Link href="/oracle" className="hover:text-ink transition-colors">
                Gemini AI Severity Oracle
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 2: Protocol Architecture */}
        <div className="flex flex-col gap-2.5">
          <h4 className="text-[11px] font-mono tracking-wider uppercase text-ink font-semibold">Infrastructure</h4>
          <ul className="flex flex-col gap-2 text-xs">
            <li className="hover:text-ink transition-colors flex items-center gap-1 cursor-default">
              Polygon Amoy Vault Contract
            </li>
            <li className="hover:text-ink transition-colors flex items-center gap-1 cursor-default">
              Ethereum Sepolia Vault
            </li>
            <li className="hover:text-ink transition-colors flex items-center gap-1 cursor-default">
              Gemini 2.5 Flash Oracle API
            </li>
            <li className="hover:text-ink transition-colors flex items-center gap-1 cursor-default">
              EIP-712 Meta-Tx Sponsor
            </li>
            <li className="hover:text-ink transition-colors flex items-center gap-1 cursor-default">
              IPFS Delivery Receipts
            </li>
          </ul>
        </div>

        {/* Column 3: Trust & Verification */}
        <div className="flex flex-col gap-2.5">
          <h4 className="text-[11px] font-mono tracking-wider uppercase text-ink font-semibold">Security & Craft</h4>
          <ul className="flex flex-col gap-2 text-xs">
            <li className="text-ink-subtle">Near-black `#010102` Canvas</li>
            <li className="text-ink-subtle">Four-step Surface Ladder</li>
            <li className="text-ink-subtle">Cryptographic Keccak256 Trees</li>
            <li className="text-ink-subtle">Zero Middleman Overhead</li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-[1280px] mx-auto mt-10 pt-4 border-t border-hairline flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-ink-tertiary gap-3">
        <div>
          © 2026 Pulse Protocol • Verifiable Aid Distribution
        </div>
        <div className="flex items-center gap-4">
          <span className="hover:text-ink-subtle transition-colors cursor-pointer">Privacy First</span>
          <span className="hover:text-ink-subtle transition-colors cursor-pointer">Zero Gas Fee</span>
          <span className="hover:text-ink-subtle transition-colors cursor-pointer">100% On-Chain</span>
        </div>
      </div>
    </footer>
  );
}
