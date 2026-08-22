import React from "react";
import Link from "next/link";
import { Activity, HeartHandshake, ShieldCheck, Search, Cpu, ArrowRight, CheckCircle2 } from "lucide-react";

export function QuickLinksSection() {
  const pages = [
    {
      id: "crisis-matrix",
      title: "Active Crisis Vaults",
      route: "/crisis/turkey-earthquake-2026",
      icon: HeartHandshake,
      eyebrow: "EMERGENCY LIQUIDITY",
      badge: "3 Active Vaults",
      description: "Direct cross-chain disaster liquidity pools supporting Sepolia ETH and Polygon Amoy POL with category lock allocation.",
      features: ["Polygon Amoy + Ethereum Sepolia", "Category Lock Allocation", "Instant On-Chain Receipts"],
      cta: "Open Crisis Terminal",
    },
    {
      id: "beneficiary-portal",
      title: "Beneficiary Claim Portal",
      route: "/beneficiary",
      icon: ShieldCheck,
      eyebrow: "ZERO-KNOWLEDGE AID",
      badge: "Gasless Merkle Payout",
      description: "Disaster victims claim aid directly to their wallets with 0 gas fees using EIP-712 meta-transactions and Keccak256 Merkle proofs.",
      features: ["EIP-712 Relayer (0 Gas Fees)", "Merkle Tree ZK Privacy", "NGO Field Verification Console"],
      cta: "Enter Claim Portal",
    },
    {
      id: "audit-ledger",
      title: "Live Transparent Audit",
      route: "/audit",
      icon: Search,
      eyebrow: "100% VISIBILITY",
      badge: "On-Chain Flow",
      description: "End-to-end verification tracking donor contributions through multi-chain vaults directly to verified beneficiary wallet disbursements.",
      features: ["Donor → Vault → Victim Flow", "IPFS Field Delivery Receipts", "Cryptographic Data Export"],
      cta: "Inspect Audit Ledger",
    },
    {
      id: "ai-oracle",
      title: "Gemini AI Severity Oracle",
      route: "/oracle",
      icon: Cpu,
      eyebrow: "AUTOMATED TRIGGERS",
      badge: "Gemini 2.5 Flash",
      description: "Real-time seismic and flood sensor feeds evaluated by Gemini 2.5 Flash. Scores ≥ 7.0 automatically trigger 20% emergency reserve release.",
      features: ["Gemini 2.5 Flash Vision API", "Seismic Richter Threshold Oracle", "Automated Contingency Unlock"],
      cta: "Launch Oracle Simulator",
    },
  ];

  return (
    <section className="w-full py-16 px-4 md:px-8 border-t border-hairline bg-canvas">
      <div className="max-w-[1280px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-start gap-2 mb-8">
          <div className="flex items-center gap-1.5 text-[11px] font-mono tracking-eyebrow text-ink-subtle uppercase">
            <span>Protocol Architecture</span>
            <span className="text-hairline-strong">•</span>
            <span className="text-primary font-medium">Core Modules</span>
          </div>
          <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-ink">
            Verifiable Disaster Relief Infrastructure
          </h2>
          <p className="text-xs md:text-sm text-ink-subtle max-w-xl leading-relaxed">
            Every module operates trustlessly on-chain with minimal latency and cryptographic validation.
          </p>
        </div>

        {/* Quick Links Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {pages.map((page) => {
            const Icon = page.icon;
            return (
              <div
                key={page.id}
                className="group flex flex-col justify-between p-5 rounded-lg bg-surface-1 border border-hairline hover:border-hairline-strong hover:bg-surface-2 transition-all"
              >
                <div>
                  {/* Top Bar inside Card */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-mono tracking-wider text-ink-tertiary">
                      {page.eyebrow}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-pill bg-surface-2 text-ink-muted border border-hairline">
                      {page.badge}
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <div className="w-7 h-7 rounded-md bg-canvas border border-hairline flex items-center justify-center text-primary group-hover:border-primary/40 transition-colors">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <h3 className="text-sm font-medium tracking-tight text-ink group-hover:text-white transition-colors">
                      {page.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-ink-subtle leading-relaxed mb-4">
                    {page.description}
                  </p>

                  {/* Features List */}
                  <div className="flex flex-col gap-1.5 mb-5 pt-3 border-t border-hairline">
                    {page.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[11px] font-mono text-ink-muted">
                        <CheckCircle2 className="w-3 h-3 text-primary shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card CTA Link */}
                <Link
                  href={page.route}
                  className="w-full py-2 px-3 rounded-md bg-canvas hover:bg-surface-3 text-ink text-xs font-medium border border-hairline hover:border-hairline-strong flex items-center justify-between transition-colors group/btn"
                >
                  <span className="text-[11px] font-medium">{page.cta}</span>
                  <ArrowRight className="w-3 h-3 text-ink-subtle group-hover/btn:text-ink group-hover/btn:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
