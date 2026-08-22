import React from "react";
import Link from "next/link";
import { Zap, ShieldCheck, ExternalLink, Globe } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-white border-t border-hairline py-16 px-4 md:px-8 text-body text-sm">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <img
                src="/ico.png"
                alt="PULSE Protocol"
                className="w-7 h-7 rounded-lg object-contain"
              />
              <span className="font-semibold text-base tracking-tight text-ink">
                PULSE PROTOCOL
              </span>
            </div>
            <p className="text-body text-sm max-w-sm leading-relaxed">
              Institutional-grade autonomous disaster liquidity vaults. Instant AI triage, cross-chain contingency releases, and zero-knowledge beneficiary aid.
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs text-muted">
              <span className="w-2 h-2 rounded-full bg-semantic-up"></span>
              <span>All Systems Operational • Sepolia & Amoy Connected</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-xs text-ink uppercase tracking-wider">Protocol</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-ink transition-colors">Command Center</Link>
              </li>
              <li>
                <Link href="/crisis/turkey-earthquake-2026" className="hover:text-ink transition-colors">Active Vaults</Link>
              </li>
              <li>
                <Link href="/beneficiary" className="hover:text-ink transition-colors">ZK Aid Claims</Link>
              </li>
              <li>
                <Link href="/oracle" className="hover:text-ink transition-colors">AI Oracle Sim</Link>
              </li>
            </ul>
          </div>

          {/* Auditing & Verification */}
          <div className="space-y-3">
            <h4 className="font-semibold text-xs text-ink uppercase tracking-wider">Transparency</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/audit" className="hover:text-ink transition-colors">Live Audit Ledger</Link>
              </li>
              <li>
                <a href="https://ipfs.io" target="_blank" rel="noreferrer" className="hover:text-ink transition-colors flex items-center gap-1">
                  <span>IPFS Registry</span>
                  <ExternalLink className="w-3 h-3 text-muted" />
                </a>
              </li>
              <li>
                <a href="https://amoy.polygonscan.com" target="_blank" rel="noreferrer" className="hover:text-ink transition-colors flex items-center gap-1">
                  <span>PolygonScan</span>
                  <ExternalLink className="w-3 h-3 text-muted" />
                </a>
              </li>
              <li>
                <a href="https://sepolia.etherscan.io" target="_blank" rel="noreferrer" className="hover:text-ink transition-colors flex items-center gap-1">
                  <span>Etherscan</span>
                  <ExternalLink className="w-3 h-3 text-muted" />
                </a>
              </li>
            </ul>
          </div>

          {/* Governance & Field */}
          <div className="space-y-3">
            <h4 className="font-semibold text-xs text-ink uppercase tracking-wider">Field NGO</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/beneficiary" className="hover:text-ink transition-colors">Merkle Root Engine</Link>
              </li>
              <li>
                <Link href="/beneficiary" className="hover:text-ink transition-colors">QR Voucher Cards</Link>
              </li>
              <li>
                <Link href="/audit" className="hover:text-ink transition-colors">Proof of Delivery</Link>
              </li>
              <li>
                <span className="text-muted text-xs">EIP-712 Meta-Tx Relayer</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Band */}
        <div className="pt-8 border-t border-hairline flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
          <div>
            © 2026 Pulse Protocol. Decentralized Humanitarian Emergency Relief Infrastructure.
          </div>
          <div className="flex items-center gap-6">
            <span>Non-Custodial</span>
            <span>Zero-Knowledge Proofs</span>
            <span>Filecoin Storage</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
