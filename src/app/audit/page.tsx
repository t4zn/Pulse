"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, ArrowLeft, ExternalLink, Download, ArrowRight, ShieldCheck, Filter } from "lucide-react";

export default function AuditPage() {
  const [filter, setFilter] = useState("all");

  const auditRows = [
    {
      txHash: "0x8f11...99a0",
      chain: "Polygon Amoy",
      donor: "0x7F22...3B9a",
      vault: "Turkey Relief Vault",
      victimHash: "0xMerkle...8831",
      category: "Medical Care",
      amountUSD: 2500,
      timestamp: "2026-08-22 11:14:02",
      ipfsHash: "QmY9a...31x8",
    },
    {
      txHash: "0x3c22...11b4",
      chain: "Eth Sepolia",
      donor: "0x98A1...4e11",
      vault: "Kerala Flood Pool",
      victimHash: "0xMerkle...1402",
      category: "Food Rations",
      amountUSD: 1200,
      timestamp: "2026-08-22 10:48:19",
      ipfsHash: "QmZ11...88c2",
    },
    {
      txHash: "0x1d44...77e9",
      chain: "Polygon Amoy",
      donor: "0x11B8...99d0",
      vault: "Horn of Africa Pool",
      victimHash: "0xMerkle...9081",
      category: "Emergency Shelter",
      amountUSD: 850,
      timestamp: "2026-08-22 09:30:44",
      ipfsHash: "QmA44...12e9",
    },
  ];

  return (
    <div className="w-full bg-canvas text-ink min-h-screen py-12 px-4 md:px-8">
      <div className="max-w-[1280px] mx-auto">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-mono text-ink-subtle hover:text-ink mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Global Command Center
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Search className="w-4 h-4 text-primary" />
              <span className="text-xs font-mono tracking-eyebrow text-ink-subtle uppercase">100% PUBLIC TRANSPARENCY</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-semibold tracking-headline text-ink">
              Glass-Box Live Audit Ledger
            </h1>
          </div>
          <button className="px-4 py-2 rounded-md bg-surface-1 hover:bg-surface-2 text-ink text-xs font-mono border border-hairline flex items-center gap-2 self-start md:self-auto">
            <Download className="w-4 h-4 text-primary" />
            <span>Export On-Chain Audit Proof (JSON)</span>
          </button>
        </div>

        {/* Visual Sankey Flow Diagram Preview Card */}
        <div className="p-8 rounded-xl bg-surface-1 border border-hairline mb-12">
          <h3 className="text-xs font-mono uppercase tracking-wider text-ink-subtle mb-6">Interactive Fund Flow Pipeline (Sankey Diagram)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center text-center font-mono text-xs">
            <div className="p-4 rounded-lg bg-surface-2 border border-hairline">
              <div className="text-ink-tertiary">MULTI-CHAIN DONORS</div>
              <div className="text-base text-ink font-bold mt-1">Sepolia + Amoy</div>
              <div className="text-[11px] text-primary mt-1">$1,240,500 Total</div>
            </div>

            <div className="text-ink-tertiary hidden md:block">➔</div>

            <div className="p-4 rounded-lg bg-surface-2 border border-hairline">
              <div className="text-ink-tertiary">PULSE VAULT ESCROW</div>
              <div className="text-base text-ink font-bold mt-1">Solidity Escrow</div>
              <div className="text-[11px] text-semantic-success mt-1">0% Admin Fee Loss</div>
            </div>

            <div className="text-ink-tertiary hidden md:block">➔</div>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="rounded-xl bg-surface-1 border border-hairline overflow-hidden">
          <div className="p-4 border-b border-hairline flex items-center justify-between bg-surface-2">
            <span className="text-xs font-mono font-semibold text-ink">TRANSACTION HISTORY & IPFS RECEIPTS</span>
            <div className="flex items-center gap-2 text-xs font-mono text-ink-subtle">
              <Filter className="w-3.5 h-3.5" />
              <span>Filter by All Chains</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-canvas border-b border-hairline text-ink-tertiary">
                <tr>
                  <th className="p-4">TX HASH</th>
                  <th className="p-4">CHAIN</th>
                  <th className="p-4">DONOR</th>
                  <th className="p-4">DISASTER VAULT</th>
                  <th className="p-4">CATEGORY</th>
                  <th className="p-4">AMOUNT</th>
                  <th className="p-4">IPFS RECEIPT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline text-ink-subtle">
                {auditRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-surface-2 transition-colors">
                    <td className="p-4 text-primary font-semibold">{row.txHash}</td>
                    <td className="p-4">{row.chain}</td>
                    <td className="p-4">{row.donor}</td>
                    <td className="p-4 text-ink">{row.vault}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-surface-3 border border-hairline text-ink">
                        {row.category}
                      </span>
                    </td>
                    <td className="p-4 text-semantic-success font-bold">${row.amountUSD.toLocaleString()}</td>
                    <td className="p-4 text-ink-tertiary flex items-center gap-1 hover:text-ink cursor-pointer">
                      <span>{row.ipfsHash}</span>
                      <ExternalLink className="w-3 h-3" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
