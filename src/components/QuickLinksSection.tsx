import React from "react";
import Link from "next/link";
import { ShieldCheck, Search, Cpu, HeartHandshake, ArrowRight } from "lucide-react";

export function QuickLinksSection() {
  const modules = [
    {
      title: "Disaster Vaults",
      desc: "Deposit into unified multi-chain emergency liquidity pools with automated contingency release.",
      href: "/crisis/turkey-earthquake-2026",
      icon: HeartHandshake,
      badge: "ACTIVE VAULTS",
      badgeColor: "text-semantic-up bg-semantic-up/10",
    },
    {
      title: "Zero-Knowledge Claims",
      desc: "Victims verify aid eligibility via privacy-preserving Keccak256 Merkle proofs for direct instant payout.",
      href: "/beneficiary",
      icon: ShieldCheck,
      badge: "ZK-VERIFIED",
      badgeColor: "text-primary bg-primary/10",
    },
    {
      title: "How It Works Guide",
      desc: "Step-by-step lifecycle from fiat on-ramping with MetaMask to ZK victim cash retrieval.",
      href: "/#how-it-works",
      icon: ShieldCheck,
      badge: "LIFECYCLE",
      badgeColor: "text-primary bg-primary/10",
    },
    {
      title: "Live Audit Ledger",
      desc: "Track every dollar from donor wallet to beneficiary with IPFS-pinned delivery photo receipts.",
      href: "/audit",
      icon: Search,
      badge: "100% AUDITABLE",
      badgeColor: "text-semantic-up bg-semantic-up/10",
    },
  ];

  return (
    <section className="py-16 px-4 md:px-8 bg-surface-soft border-t border-hairline">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-primary mb-1 block">
              PROTOCOL CAPABILITIES
            </span>
            <h2 className="text-2xl md:text-3xl font-normal tracking-tight text-ink">
              Core Emergency Modules
            </h2>
          </div>
          <p className="text-sm text-body max-w-md mt-2 md:mt-0">
            Engineered for autonomous crisis response with institutional-grade cryptographic verifiability.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.map((mod) => {
            const Icon = mod.icon;
            return (
              <Link
                key={mod.title}
                href={mod.href}
                className="group p-6 rounded-2xl bg-white border border-hairline hover:border-primary/40 hover:shadow-card transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-full bg-surface-strong flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full ${mod.badgeColor}`}>
                      {mod.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-ink mb-1.5 group-hover:text-primary transition-colors">
                    {mod.title}
                  </h3>

                  <p className="text-xs text-body leading-relaxed mb-4">
                    {mod.desc}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-semibold text-primary pt-2 border-t border-hairline group-hover:gap-2 transition-all">
                  <span>Open Module</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
