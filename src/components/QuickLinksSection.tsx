import React from "react";
import Link from "next/link";
import { Activity, HeartHandshake, ShieldCheck, Search, Cpu, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

export function QuickLinksSection() {
  const pages = [
    {
      id: "command-center",
      title: "Global Command Center",
      route: "/",
      icon: Activity,
      eyebrow: "PAGE 01 • MISSION CONTROL",
      badge: "Real-Time Dashboard",
      badgeColor: "bg-surface-2 text-ink-muted border-hairline",
      description: "Live global disaster situational awareness, aggregated cross-chain vault metrics, and instant emergency dispatch monitoring.",
      features: ["4 Active Global Incidents", "$1,240,500 Aggregated Funds", "2.4s Avg Disbursement"],
      cta: "Launch Command Center",
    },
    {
      id: "crisis-terminal",
      title: "Crisis Donation Terminal",
      route: "/crisis/turkey-earthquake-2026",
      icon: HeartHandshake,
      eyebrow: "PAGE 02 • MULTI-CHAIN DONATE",
      badge: "1-Click Multi-Chain",
      badgeColor: "bg-primary/10 text-primary border-primary/30",
      description: "Direct emergency donation terminal supporting Sepolia ETH and Polygon Amoy POL with category fund allocation (Medical, Food, Shelter).",
      features: ["Polygon Amoy + Ethereum Sepolia", "Category Lock Allocation", "Instant Block Receipts"],
      cta: "Open Crisis Terminal",
    },
    {
      id: "beneficiary-portal",
      title: "Beneficiary & Gasless Claim Portal",
      route: "/beneficiary",
      icon: ShieldCheck,
      eyebrow: "PAGE 03 • ZERO-KNOWLEDGE AID",
      badge: "Gasless Merkle Payout",
      badgeColor: "bg-surface-2 text-semantic-success border-semantic-success/30",
      description: "Disaster victims claim funds instantly with zero gas fees using EIP-712 meta-transactions and cryptographic Merkle Tree identity verification.",
      features: ["EIP-712 Sponsor (0 Gas Fees)", "Merkle Tree ZK Privacy", "NGO Field Upload Console"],
      cta: "Enter Claim Portal",
    },
    {
      id: "audit-ledger",
      title: "Glass-Box Live Audit Ledger",
      route: "/audit",
      icon: Search,
      eyebrow: "PAGE 04 • 100% TRANSPARENCY",
      badge: "Visual Sankey Audit",
      badgeColor: "bg-surface-2 text-ink border-hairline-strong",
      description: "Interactive visual Sankey flow tracing every single dollar from donor multi-chain vaults straight to verified victim wallet transactions.",
      features: ["Donor → Vault → Victim Flow", "IPFS Field Delivery Receipts", "Cryptographic JSON/PDF Export"],
      cta: "Inspect Audit Ledger",
    },
    {
      id: "ai-oracle",
      title: "AI Severity Oracle Simulator",
      route: "/oracle",
      icon: Cpu,
      eyebrow: "PAGE 05 • GEMINI 2.5 FLASH",
      badge: "Automated AI Trigger",
      badgeColor: "bg-primary/20 text-primary hover:bg-primary/30 border-primary/40",
      description: "Simulate satellite and Richter seismic alerts evaluated by Google Gemini 2.5 Flash to automatically unlock emergency contingency reserves.",
      features: ["Gemini 2.5 Flash Vision Model", "Seismic & Flood Threshold Oracle", "Auto-Release 20% Emergency Fund"],
      cta: "Launch Oracle Simulator",
    },
  ];

  return (
    <section className="w-full py-20 px-4 md:px-8 border-y border-hairline bg-canvas relative overflow-hidden">
      {/* Background Subtle Gradient Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-[1280px] mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-start gap-3 mb-12">
          <div className="flex items-center gap-2 px-3 py-1 rounded-pill bg-surface-2 border border-hairline-strong text-xs font-medium text-ink-muted">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="font-mono uppercase tracking-wider text-[11px] text-ink-subtle">SYSTEM NAVIGATION</span>
            <span className="text-hairline">|</span>
            <span className="text-primary font-mono text-[11px]">5 INTERACTIVE PAGES</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-headline text-ink">
            Explore All Pulse Application Modules
          </h2>
          <p className="text-ink-subtle text-base md:text-lg max-w-2xl leading-relaxed">
            Navigate through the end-to-end disaster aid pipeline. Every module is styled with Linear's precision dark design craft (<code className="text-primary font-mono text-sm">#010102</code>).
          </p>
        </div>

        {/* Quick Links Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map((page, index) => {
            const Icon = page.icon;
            const isFeatured = page.id === "ai-oracle" || page.id === "beneficiary-portal";
            return (
              <div
                key={page.id}
                className={`group flex flex-col justify-between p-6 rounded-lg border transition-all duration-300 relative ${
                  isFeatured
                    ? "bg-surface-2 border-hairline-strong hover:border-primary/50 linear-top-highlight"
                    : "bg-surface-1 border-hairline hover:border-hairline-strong hover:bg-surface-2"
                }`}
              >
                <div>
                  {/* Top Bar inside Card */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-[11px] font-mono tracking-eyebrow text-ink-tertiary">
                      {page.eyebrow}
                    </span>
                    <span className={`text-[11px] font-mono px-2 py-0.5 rounded-pill border ${page.badgeColor}`}>
                      {page.badge}
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-md bg-canvas border border-hairline flex items-center justify-center text-primary group-hover:border-primary/50 group-hover:scale-105 transition-all">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-medium tracking-card text-ink group-hover:text-white transition-colors">
                      {page.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-ink-subtle leading-relaxed mb-6">
                    {page.description}
                  </p>

                  {/* Features List */}
                  <div className="flex flex-col gap-2 mb-6 pt-4 border-t border-hairline/60">
                    {page.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs font-mono text-ink-muted">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card CTA Link */}
                <Link
                  href={page.route}
                  className="w-full mt-2 py-2.5 px-4 rounded-md bg-canvas hover:bg-primary text-ink hover:text-white border border-hairline hover:border-primary text-xs font-medium tracking-button flex items-center justify-between transition-all group/btn"
                >
                  <span>{page.cta}</span>
                  <ArrowRight className="w-4 h-4 text-ink-subtle group-hover/btn:text-white group-hover/btn:translate-x-1 transition-all" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
