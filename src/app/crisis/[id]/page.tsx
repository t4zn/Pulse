"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HeartHandshake, ArrowLeft, ShieldCheck, ExternalLink, Globe, Zap, CheckCircle2 } from "lucide-react";

export default function CrisisPage({ params }: { params: { id: string } }) {
  const [selectedChain, setSelectedChain] = useState<"sepolia" | "amoy">("amoy");
  const [donationAmount, setDonationAmount] = useState("100");
  const [category, setCategory] = useState("general");
  const [donating, setDonating] = useState(false);
  const [txSuccess, setTxSuccess] = useState(false);

  const handleDonate = () => {
    setDonating(true);
    setTimeout(() => {
      setDonating(false);
      setTxSuccess(true);
    }, 1200);
  };

  return (
    <div className="w-full bg-canvas text-ink min-h-screen py-12 px-4 md:px-8">
      <div className="max-w-[1280px] mx-auto">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-mono text-ink-subtle hover:text-ink mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Global Command Center
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info Panel */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-8 rounded-xl bg-surface-1 border border-hairline">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2.5 py-0.5 rounded-pill bg-primary/10 border border-primary/30 text-primary text-xs font-mono">
                  ACTIVE CRISIS VAULT
                </span>
                <span className="px-2.5 py-0.5 rounded-pill bg-red-950 text-red-400 border border-red-800/50 text-xs font-mono">
                  MAGNITUDE 7.8
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-semibold tracking-headline text-ink mb-4">
                Turkey-Syria 7.8M Earthquake Relief
              </h1>
              <p className="text-ink-subtle text-base leading-relaxed">
                Direct cross-chain liquidity allocation for earthquake immediate rescue, field trauma kits, food rations, and winterized emergency shelters.
              </p>

              {/* Category Breakdown */}
              <div className="mt-8 pt-6 border-t border-hairline">
                <h3 className="text-xs font-mono uppercase tracking-wider text-ink-subtle mb-4">Category Allocation Blueprint</h3>
                <div className="grid grid-cols-3 gap-4 font-mono text-xs">
                  <div className="p-3 rounded-md bg-surface-2 border border-hairline">
                    <div className="text-ink-tertiary">MEDICAL CARE</div>
                    <div className="text-lg text-ink font-bold mt-1">40%</div>
                  </div>
                  <div className="p-3 rounded-md bg-surface-2 border border-hairline">
                    <div className="text-ink-tertiary">FOOD RATIONS</div>
                    <div className="text-lg text-primary font-bold mt-1">30%</div>
                  </div>
                  <div className="p-3 rounded-md bg-surface-2 border border-hairline">
                    <div className="text-ink-tertiary">EMERGENCY SHELTER</div>
                    <div className="text-lg text-semantic-success font-bold mt-1">30%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Donation Terminal Box */}
          <div className="p-6 rounded-xl bg-surface-1 border border-hairline flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-hairline mb-6">
                <div className="flex items-center gap-2">
                  <HeartHandshake className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-ink text-base">Donation Terminal</span>
                </div>
                <span className="text-xs font-mono text-semantic-success flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-semantic-success animate-pulse"></span> Instant Receipt
                </span>
              </div>

              {/* Chain Selector */}
              <div className="space-y-2 mb-6">
                <label className="text-xs font-mono text-ink-subtle">SELECT BLOCKCHAIN NETWORK</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedChain("amoy")}
                    className={`py-2 px-3 rounded-md text-xs font-mono border transition-all ${
                      selectedChain === "amoy" ? "bg-primary/20 text-primary border-primary" : "bg-surface-2 text-ink-subtle border-hairline"
                    }`}
                  >
                    Polygon Amoy (POL)
                  </button>
                  <button
                    onClick={() => setSelectedChain("sepolia")}
                    className={`py-2 px-3 rounded-md text-xs font-mono border transition-all ${
                      selectedChain === "sepolia" ? "bg-primary/20 text-primary border-primary" : "bg-surface-2 text-ink-subtle border-hairline"
                    }`}
                  >
                    Eth Sepolia (ETH)
                  </button>
                </div>
              </div>

              {/* Amount Input */}
              <div className="space-y-2 mb-6">
                <label className="text-xs font-mono text-ink-subtle">AMOUNT ({selectedChain === "amoy" ? "POL" : "ETH"})</label>
                <div className="relative">
                  <input
                    type="number"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    className="w-full bg-surface-2 border border-hairline focus:border-primary text-ink px-4 py-2.5 rounded-md text-lg font-mono focus:outline-none"
                  />
                  <span className="absolute right-3 top-3 text-xs font-mono text-ink-subtle">
                    ≈ ${(Number(donationAmount || 0) * (selectedChain === "amoy" ? 0.65 : 2750)).toLocaleString()} USD
                  </span>
                </div>
              </div>

              {/* Category Lock Selector */}
              <div className="space-y-2 mb-6">
                <label className="text-xs font-mono text-ink-subtle">DESIGNATE CATEGORY (OPTIONAL)</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-surface-2 border border-hairline text-ink px-3 py-2 rounded-md text-xs font-mono focus:outline-none"
                >
                  <option value="general">General Relief Pool (Auto-Balance)</option>
                  <option value="medical">Medical & Field Trauma</option>
                  <option value="food">Food Rations & Water</option>
                  <option value="shelter">Emergency Winter Shelter</option>
                </select>
              </div>
            </div>

            {/* Execute Button */}
            {txSuccess ? (
              <div className="p-4 rounded-md bg-semantic-success/10 border border-semantic-success/30 text-semantic-success text-center font-mono text-xs space-y-2">
                <div className="flex items-center justify-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4" /> Transaction Confirmed!
                </div>
                <div className="text-[11px] text-ink-subtle">Hash: 0x9f1a...4b22 (Polygon Amoy Block #842109)</div>
                <Link href="/audit" className="inline-block text-primary underline pt-1">
                  View in Live Audit Ledger →
                </Link>
              </div>
            ) : (
              <button
                onClick={handleDonate}
                disabled={donating}
                className="w-full py-3 px-4 rounded-md bg-primary hover:bg-primary-hover active:bg-primary-focus text-white text-sm font-medium tracking-button transition-all shadow-[0_0_20px_rgba(94,106,210,0.3)] flex items-center justify-center gap-2"
              >
                {donating ? (
                  <span className="font-mono text-xs animate-pulse">Broadcasting Tx to {selectedChain}...</span>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Execute Instant Donation</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
