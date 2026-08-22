"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Search, 
  ArrowLeft, 
  ExternalLink, 
  Download, 
  ShieldCheck, 
  Filter, 
  CheckCircle2, 
  Lock, 
  FileText, 
  Sparkles, 
  Globe, 
  Activity, 
  Clock, 
  Database,
  ArrowRight,
  X,
  MapPin,
  Camera,
  Layers
} from "lucide-react";

interface AuditTransaction {
  id: string;
  txHash: string;
  chain: "Polygon Amoy" | "Eth Sepolia";
  chainBadge: "POL" | "ETH";
  blockNumber: number;
  donor: string;
  vault: string;
  victimMerkleHash: string;
  category: "Medical Care" | "Food Rations" | "Emergency Shelter";
  amountUSD: number;
  cryptoAmount: string;
  timestamp: string;
  ipfsHash: string;
  deliveryLocation: string;
  deliveryImage: string;
  fieldNotes: string;
  gasSponsorTx: string;
  verifiedBy: string;
}

export default function AuditPage() {
  const [selectedChain, setSelectedChain] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTx, setSelectedTx] = useState<AuditTransaction | null>(null);
  const [activeFlowNode, setActiveFlowNode] = useState<string>("all");
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const transactions: AuditTransaction[] = [
    {
      id: "tx-1",
      txHash: "0x8f119a2b8e34c990a012bcf45612349078abcedf12",
      chain: "Polygon Amoy",
      chainBadge: "POL",
      blockNumber: 8421902,
      donor: "0x7F223190b...3B9a",
      vault: "Turkey 7.8M Earthquake Vault",
      victimMerkleHash: "0xMerkle_8831_Kahramanmaraş",
      category: "Medical Care",
      amountUSD: 2500,
      cryptoAmount: "3,846 POL",
      timestamp: "2026-08-22 11:14:02 UTC",
      ipfsHash: "QmY9aX781b2c45e89d1234567890abcdef31x8",
      deliveryLocation: "Field Hospital Unit 4, Kahramanmaraş",
      deliveryImage: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80",
      fieldNotes: "Delivered 24x trauma surgical kits and emergency suture packages to on-ground pediatric triage unit.",
      gasSponsorTx: "0x9812aa... sponsored via EIP-712 Meta-Tx",
      verifiedBy: "Red Crescent Verified Field ID #RC-9021",
    },
    {
      id: "tx-2",
      txHash: "0x3c2244bb11a98071e44bcda12349876543210fedcba",
      chain: "Eth Sepolia",
      chainBadge: "ETH",
      blockNumber: 5938102,
      donor: "0x98A13410f...4e11",
      vault: "Kerala Monsoon Flood Emergency",
      victimMerkleHash: "0xMerkle_1402_Wayanad",
      category: "Food Rations",
      amountUSD: 1200,
      cryptoAmount: "0.44 ETH",
      timestamp: "2026-08-22 10:48:19 UTC",
      ipfsHash: "QmZ11902bcda44188c2901847192837482910c",
      deliveryLocation: "Relief Camp 12, Meppadi, Wayanad",
      deliveryImage: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80",
      fieldNotes: "Distributed 180x family dry ration packs containing clean drinking water, high-calorie meal bars, and infant formula.",
      gasSponsorTx: "0x44bc01... sponsored via EIP-712 Meta-Tx",
      verifiedBy: "State Disaster Management Authority #KSDMA-441",
    },
    {
      id: "tx-3",
      txHash: "0x1d4499aa77e98123bcdef09876543210fedcba8765",
      chain: "Polygon Amoy",
      chainBadge: "POL",
      blockNumber: 8421890,
      donor: "0x11B890cc1...99d0",
      vault: "Horn of Africa Severe Drought",
      victimMerkleHash: "0xMerkle_9081_Somalia",
      category: "Emergency Shelter",
      amountUSD: 3400,
      cryptoAmount: "5,230 POL",
      timestamp: "2026-08-22 09:30:44 UTC",
      ipfsHash: "QmA4412984012e98712390481239840129384e",
      deliveryLocation: "Baidoa Displacement Camp Sector C",
      deliveryImage: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=800&q=80",
      fieldNotes: "Assembled 40x thermal-insulated weather shelter pods with solar power backup charging lamps.",
      gasSponsorTx: "0x77ee91... sponsored via EIP-712 Meta-Tx",
      verifiedBy: "UNHCR Certified Field Partner #HOA-771",
    },
    {
      id: "tx-4",
      txHash: "0x55f981290384aa12309876123490871234fedcab12",
      chain: "Eth Sepolia",
      chainBadge: "ETH",
      blockNumber: 5938091,
      donor: "0x334411ee...8812",
      vault: "Turkey 7.8M Earthquake Vault",
      victimMerkleHash: "0xMerkle_4419_Antakya",
      category: "Emergency Shelter",
      amountUSD: 4500,
      cryptoAmount: "1.65 ETH",
      timestamp: "2026-08-22 08:15:30 UTC",
      ipfsHash: "QmE8831902bcda44188c2901847192837482910c",
      deliveryLocation: "Defne District Emergency Zone, Hatay",
      deliveryImage: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80",
      fieldNotes: "Deployed winter-grade family tents and thermal sleeping mats for 60 displaced earthquake survivors.",
      gasSponsorTx: "0x11cc22... sponsored via EIP-712 Meta-Tx",
      verifiedBy: "AKUT Search & Rescue Logistics #AK-4402",
    },
    {
      id: "tx-5",
      txHash: "0x77b812903847291837492817293847192837491823",
      chain: "Polygon Amoy",
      chainBadge: "POL",
      blockNumber: 8421876,
      donor: "0x8899aabb...1122",
      vault: "Kerala Monsoon Flood Emergency",
      victimMerkleHash: "0xMerkle_7712_Chooralmala",
      category: "Medical Care",
      amountUSD: 1850,
      cryptoAmount: "2,846 POL",
      timestamp: "2026-08-22 07:42:11 UTC",
      ipfsHash: "QmK992182938471928374918293847192837491823",
      deliveryLocation: "Emergency Mobile Clinic 3, Chooralmala",
      deliveryImage: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80",
      fieldNotes: "Administered anti-tetanus shots, clean water purification kits, and pediatric IV fluids.",
      gasSponsorTx: "0x88bb33... sponsored via EIP-712 Meta-Tx",
      verifiedBy: "Indian Red Cross Field Mission #IRC-883",
    }
  ];

  // Filtering Logic
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesChain = selectedChain === "all" || 
        (selectedChain === "amoy" && tx.chain === "Polygon Amoy") ||
        (selectedChain === "sepolia" && tx.chain === "Eth Sepolia");

      const matchesCategory = selectedCategory === "all" || 
        (selectedCategory === "medical" && tx.category === "Medical Care") ||
        (selectedCategory === "food" && tx.category === "Food Rations") ||
        (selectedCategory === "shelter" && tx.category === "Emergency Shelter");

      const matchesFlowNode = activeFlowNode === "all" ||
        (activeFlowNode === "medical" && tx.category === "Medical Care") ||
        (activeFlowNode === "food" && tx.category === "Food Rations") ||
        (activeFlowNode === "shelter" && tx.category === "Emergency Shelter") ||
        (activeFlowNode === "amoy" && tx.chain === "Polygon Amoy") ||
        (activeFlowNode === "sepolia" && tx.chain === "Eth Sepolia");

      const matchesSearch = searchQuery === "" || 
        tx.txHash.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.donor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.vault.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.victimMerkleHash.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.ipfsHash.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.deliveryLocation.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesChain && matchesCategory && matchesFlowNode && matchesSearch;
    });
  }, [selectedChain, selectedCategory, activeFlowNode, searchQuery, transactions]);

  // 1-Click Cryptographic Audit JSON Export
  const handleExportJSON = () => {
    const auditPackage = {
      protocol: "PULSE Protocol v1.0",
      exportTimestamp: new Date().toISOString(),
      verifiedVaults: [
        { chain: "Polygon Amoy", address: "0x7E124c0988771234567890abcdef1234567890ab", status: "Active Escrow" },
        { chain: "Ethereum Sepolia", address: "0x3A9F8b2109876543210fedcba09876543210fedc", status: "Active Escrow" }
      ],
      totalFundsAuditedUSD: 1240500,
      middlemanFeeLossRate: "0.00%",
      recordsCount: filteredTransactions.length,
      transactions: filteredTransactions,
      verificationEngine: {
        privacyProof: "Keccak256 Merkle Tree",
        metaTxSponsor: "EIP-712 Gasless Protocol",
        storageProvider: "IPFS (Pinata Protocol Pinning)"
      }
    };

    const blob = new Blob([JSON.stringify(auditPackage, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `PULSE_Live_Audit_Proof_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="w-full bg-canvas text-ink min-h-screen py-12 px-4 md:px-8">
      <div className="max-w-[1280px] mx-auto">
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-mono text-ink-subtle hover:text-ink mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Global Command Center
        </Link>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-semantic-success animate-pulse"></span>
              <span className="text-xs font-mono tracking-eyebrow text-semantic-success uppercase">
                100% VISUAL ON-CHAIN AUDITABILITY
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-semibold tracking-headline text-ink mb-3">
              Glass-Box Live Audit Ledger
            </h1>
            <p className="text-ink-subtle text-base max-w-2xl leading-relaxed">
              Every donation, category allocation, and zero-knowledge beneficiary disbursement is committed permanently to the blockchain with attached IPFS delivery photo receipts.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={handleExportJSON}
              className="px-4 py-2.5 rounded-md bg-surface-1 hover:bg-surface-2 text-ink text-xs font-mono border border-hairline hover:border-hairline-strong transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Download className="w-4 h-4 text-primary" />
              <span>{downloadSuccess ? "✓ Proof JSON Downloaded!" : "Export Cryptographic Audit (JSON)"}</span>
            </button>
          </div>
        </div>

        {/* 4-KPI SUMMARY RIBBON */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="p-5 rounded-lg bg-surface-1 border border-hairline">
            <div className="flex items-center justify-between text-xs font-mono text-ink-subtle mb-1">
              <span>TOTAL CAPITAL AUDITED</span>
              <Database className="w-4 h-4 text-primary" />
            </div>
            <div className="text-2xl md:text-3xl font-semibold text-ink font-mono">$1,240,500.00</div>
            <div className="text-[11px] text-ink-tertiary mt-1">Multi-Chain Sepolia + Amoy</div>
          </div>

          <div className="p-5 rounded-lg bg-surface-1 border border-hairline">
            <div className="flex items-center justify-between text-xs font-mono text-ink-subtle mb-1">
              <span>MIDDLEMAN FEE LOSS</span>
              <ShieldCheck className="w-4 h-4 text-semantic-success" />
            </div>
            <div className="text-2xl md:text-3xl font-semibold text-semantic-success font-mono">0.00%</div>
            <div className="text-[11px] text-ink-tertiary mt-1">Vs. 28.5% Traditional NGO Loss</div>
          </div>

          <div className="p-5 rounded-lg bg-surface-1 border border-hairline">
            <div className="flex items-center justify-between text-xs font-mono text-ink-subtle mb-1">
              <span>VERIFIED AID DELIVERIES</span>
              <CheckCircle2 className="w-4 h-4 text-primary" />
            </div>
            <div className="text-2xl md:text-3xl font-semibold text-ink font-mono">14,280 Families</div>
            <div className="text-[11px] text-ink-tertiary mt-1">ZK Merkle Keccak256 Proofs</div>
          </div>

          <div className="p-5 rounded-lg bg-surface-1 border border-hairline">
            <div className="flex items-center justify-between text-xs font-mono text-ink-subtle mb-1">
              <span>AVG. DISBURSEMENT TIME</span>
              <Clock className="w-4 h-4 text-primary" />
            </div>
            <div className="text-2xl md:text-3xl font-semibold text-ink font-mono">&lt; 2.4 Seconds</div>
            <div className="text-[11px] text-ink-tertiary mt-1">Instant Gasless Payouts</div>
          </div>
        </div>

        {/* INTERACTIVE SANKEY FUND FLOW PIPELINE */}
        <div className="p-8 rounded-xl bg-surface-1 border border-hairline mb-10 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-hairline">
            <div>
              <div className="text-xs font-mono text-primary flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>INTERACTIVE FUND FLOW PIPELINE (SANKEY VISUALIZER)</span>
              </div>
              <h2 className="text-xl font-medium tracking-card text-ink">
                Live Capital Journey: Donors ➔ Vault Escrow ➔ Category Allocations ➔ Verified Victims
              </h2>
            </div>
            <div className="text-xs font-mono text-ink-subtle bg-surface-2 px-3 py-1.5 rounded border border-hairline self-start sm:self-auto">
              Click any node to filter audit records below
            </div>
          </div>

          {/* 4-Tier Interactive Sankey Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
            {/* Stage 1: Multi-Chain Inflow */}
            <div className="flex flex-col gap-3">
              <div className="text-xs font-mono text-ink-tertiary uppercase tracking-wider">
                STAGE 1 • INFLOW
              </div>
              <button
                onClick={() => setActiveFlowNode(activeFlowNode === "amoy" ? "all" : "amoy")}
                className={`p-4 rounded-lg text-left transition-all border ${
                  activeFlowNode === "amoy" 
                    ? "bg-primary/20 border-primary text-white" 
                    : "bg-surface-2 hover:bg-surface-3 border-hairline text-ink"
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono text-ink-subtle mb-1">
                  <span>POLYGON AMOY</span>
                  <span className="text-primary font-bold">POL</span>
                </div>
                <div className="text-lg font-bold font-mono">$720,500</div>
                <div className="text-[11px] text-ink-tertiary mt-1">3,420 Donations</div>
              </button>

              <button
                onClick={() => setActiveFlowNode(activeFlowNode === "sepolia" ? "all" : "sepolia")}
                className={`p-4 rounded-lg text-left transition-all border ${
                  activeFlowNode === "sepolia" 
                    ? "bg-primary/20 border-primary text-white" 
                    : "bg-surface-2 hover:bg-surface-3 border-hairline text-ink"
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono text-ink-subtle mb-1">
                  <span>ETH SEPOLIA</span>
                  <span className="text-primary font-bold">ETH</span>
                </div>
                <div className="text-lg font-bold font-mono">$520,000</div>
                <div className="text-[11px] text-ink-tertiary mt-1">2,000 Donations</div>
              </button>
            </div>

            {/* Stage 2: Vault Escrow */}
            <div className="flex flex-col gap-3">
              <div className="text-xs font-mono text-ink-tertiary uppercase tracking-wider">
                STAGE 2 • SMART ESCROW
              </div>
              <button
                onClick={() => setActiveFlowNode("all")}
                className={`p-6 rounded-lg text-left transition-all border h-full flex flex-col justify-between ${
                  activeFlowNode === "all" 
                    ? "bg-surface-2 border-hairline-strong linear-top-highlight" 
                    : "bg-surface-2/60 hover:bg-surface-2 border-hairline"
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-semantic-success mb-2">
                    <Lock className="w-3.5 h-3.5" />
                    <span>PULSE DISASTER VAULT</span>
                  </div>
                  <div className="text-2xl font-bold font-mono text-ink">$1,240,500</div>
                  <p className="text-xs text-ink-subtle mt-2 leading-relaxed">
                    100% locked in immutable Solidity smart contract escrow. Zero administrative fees deducted.
                  </p>
                </div>
                <div className="pt-4 border-t border-hairline text-[11px] font-mono text-primary flex items-center justify-between">
                  <span>Relayer Sync Status:</span>
                  <span className="text-semantic-success font-bold">Live Synced</span>
                </div>
              </button>
            </div>

            {/* Stage 3: Category Allocation */}
            <div className="flex flex-col gap-2.5">
              <div className="text-xs font-mono text-ink-tertiary uppercase tracking-wider">
                STAGE 3 • ALLOCATION
              </div>
              <button
                onClick={() => setActiveFlowNode(activeFlowNode === "medical" ? "all" : "medical")}
                className={`p-3 rounded-lg text-left transition-all border ${
                  activeFlowNode === "medical" 
                    ? "bg-primary/20 border-primary text-white" 
                    : "bg-surface-2 hover:bg-surface-3 border-hairline text-ink"
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono text-ink-subtle">
                  <span>🩺 Medical Care (40%)</span>
                  <span className="font-bold text-ink">$496,200</span>
                </div>
              </button>

              <button
                onClick={() => setActiveFlowNode(activeFlowNode === "food" ? "all" : "food")}
                className={`p-3 rounded-lg text-left transition-all border ${
                  activeFlowNode === "food" 
                    ? "bg-primary/20 border-primary text-white" 
                    : "bg-surface-2 hover:bg-surface-3 border-hairline text-ink"
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono text-ink-subtle">
                  <span>🍞 Food Rations (30%)</span>
                  <span className="font-bold text-ink">$372,150</span>
                </div>
              </button>

              <button
                onClick={() => setActiveFlowNode(activeFlowNode === "shelter" ? "all" : "shelter")}
                className={`p-3 rounded-lg text-left transition-all border ${
                  activeFlowNode === "shelter" 
                    ? "bg-primary/20 border-primary text-white" 
                    : "bg-surface-2 hover:bg-surface-3 border-hairline text-ink"
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono text-ink-subtle">
                  <span>⛺ Emergency Shelter (30%)</span>
                  <span className="font-bold text-ink">$372,150</span>
                </div>
              </button>
            </div>

            {/* Stage 4: Verified Beneficiaries */}
            <div className="flex flex-col gap-3">
              <div className="text-xs font-mono text-ink-tertiary uppercase tracking-wider">
                STAGE 4 • VERIFIED PAYOUTS
              </div>
              <div className="p-6 rounded-lg bg-surface-2 border border-hairline h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-semantic-success mb-2">
                    <ShieldCheck className="w-4 h-4 text-semantic-success" />
                    <span>ZK MERKLE RECIPIENTS</span>
                  </div>
                  <div className="text-2xl font-bold font-mono text-ink">14,280 Families</div>
                  <p className="text-xs text-ink-subtle mt-2 leading-relaxed">
                    Zero-knowledge cryptographic verification. Victim identities remain fully protected from public exposure.
                  </p>
                </div>
                <div className="pt-4 border-t border-hairline text-[11px] font-mono text-ink-muted">
                  Gas Fees Paid: <span className="text-primary font-bold">$0.00</span> (Protocol Sponsored)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SEARCH & FILTER CONTROLS */}
        <div className="rounded-xl bg-surface-1 border border-hairline mb-8 overflow-hidden">
          <div className="p-4 bg-surface-2 border-b border-hairline flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-ink-tertiary absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search Tx Hash, Donor, Merkle Proof Hash, IPFS CID, or Location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-canvas border border-hairline focus:border-primary text-ink text-xs font-mono pl-9 pr-4 py-2.5 rounded-md focus:outline-none placeholder:text-ink-tertiary"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              {/* Chain Filter */}
              <div className="flex items-center gap-1 bg-canvas p-1 rounded-md border border-hairline">
                <button
                  onClick={() => setSelectedChain("all")}
                  className={`px-2.5 py-1 rounded transition-all ${
                    selectedChain === "all" ? "bg-surface-2 text-ink" : "text-ink-subtle hover:text-ink"
                  }`}
                >
                  All Chains
                </button>
                <button
                  onClick={() => setSelectedChain("amoy")}
                  className={`px-2.5 py-1 rounded transition-all ${
                    selectedChain === "amoy" ? "bg-surface-2 text-primary font-bold" : "text-ink-subtle hover:text-ink"
                  }`}
                >
                  Amoy (POL)
                </button>
                <button
                  onClick={() => setSelectedChain("sepolia")}
                  className={`px-2.5 py-1 rounded transition-all ${
                    selectedChain === "sepolia" ? "bg-surface-2 text-primary font-bold" : "text-ink-subtle hover:text-ink"
                  }`}
                >
                  Sepolia (ETH)
                </button>
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-1 bg-canvas p-1 rounded-md border border-hairline">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-2.5 py-1 rounded transition-all ${
                    selectedCategory === "all" ? "bg-surface-2 text-ink" : "text-ink-subtle hover:text-ink"
                  }`}
                >
                  All Categories
                </button>
                <button
                  onClick={() => setSelectedCategory("medical")}
                  className={`px-2.5 py-1 rounded transition-all ${
                    selectedCategory === "medical" ? "bg-surface-2 text-ink font-bold" : "text-ink-subtle hover:text-ink"
                  }`}
                >
                  Medical
                </button>
                <button
                  onClick={() => setSelectedCategory("food")}
                  className={`px-2.5 py-1 rounded transition-all ${
                    selectedCategory === "food" ? "bg-surface-2 text-ink font-bold" : "text-ink-subtle hover:text-ink"
                  }`}
                >
                  Food
                </button>
                <button
                  onClick={() => setSelectedCategory("shelter")}
                  className={`px-2.5 py-1 rounded transition-all ${
                    selectedCategory === "shelter" ? "bg-surface-2 text-ink font-bold" : "text-ink-subtle hover:text-ink"
                  }`}
                >
                  Shelter
                </button>
              </div>
            </div>
          </div>

          {/* LIVE AUDIT TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-canvas border-b border-hairline text-ink-tertiary">
                <tr>
                  <th className="p-4">TX HASH & CHAIN</th>
                  <th className="p-4">DONOR ADDRESS</th>
                  <th className="p-4">DISASTER VAULT</th>
                  <th className="p-4">BENEFICIARY MERKLE HASH</th>
                  <th className="p-4">CATEGORY</th>
                  <th className="p-4">DISBURSED AMOUNT</th>
                  <th className="p-4 text-right">IPFS DELIVERY PROOF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline text-ink-subtle">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-ink-tertiary">
                      No matching verified transactions found for the selected filter query.
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((tx) => (
                    <tr 
                      key={tx.id} 
                      onClick={() => setSelectedTx(tx)}
                      className="hover:bg-surface-2/80 transition-colors cursor-pointer group"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded bg-canvas border border-hairline flex items-center justify-center text-[10px] text-primary font-bold">
                            {tx.chainBadge}
                          </span>
                          <div>
                            <div className="text-primary font-semibold group-hover:text-primary-hover flex items-center gap-1">
                              <span>{tx.txHash.slice(0, 10)}...{tx.txHash.slice(-6)}</span>
                            </div>
                            <div className="text-[10px] text-ink-tertiary">Block #{tx.blockNumber}</div>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 text-ink-muted">
                        {tx.donor}
                      </td>

                      <td className="p-4 text-ink font-medium">
                        {tx.vault}
                      </td>

                      <td className="p-4 text-ink-muted">
                        <div className="flex items-center gap-1">
                          <Lock className="w-3 h-3 text-primary shrink-0" />
                          <span className="text-ink">{tx.victimMerkleHash}</span>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded bg-surface-3 border border-hairline text-ink">
                          {tx.category}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="text-semantic-success font-bold font-mono">
                          ${tx.amountUSD.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-ink-tertiary">
                          {tx.cryptoAmount}
                        </div>
                      </td>

                      <td className="p-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTx(tx);
                          }}
                          className="px-2.5 py-1 rounded bg-surface-3 hover:bg-primary hover:text-white text-ink-muted border border-hairline text-[11px] font-mono transition-all inline-flex items-center gap-1"
                        >
                          <Camera className="w-3 h-3" />
                          <span>View Photo Proof</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* IPFS DELIVERY PROOF INSPECTOR MODAL */}
        {selectedTx && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-surface-1 border border-hairline-strong rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
              {/* Modal Header */}
              <div className="p-5 bg-surface-2 border-b border-hairline flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-ink">IPFS Proof of Aid Delivery</h3>
                    <span className="text-[11px] font-mono text-ink-tertiary">Pinned on Decentralized Storage: {selectedTx.ipfsHash}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTx(null)}
                  className="p-1 rounded bg-surface-3 hover:bg-surface-4 text-ink-subtle hover:text-ink border border-hairline"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto space-y-6">
                {/* Delivery Photo */}
                <div className="relative h-64 rounded-lg overflow-hidden bg-surface-2 border border-hairline">
                  <img
                    src={selectedTx.deliveryImage}
                    alt="On-ground delivery proof"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-pill bg-canvas/90 backdrop-blur-md text-semantic-success text-xs font-mono border border-hairline flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Cryptographically Verified Delivery</span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 p-2 rounded bg-canvas/90 backdrop-blur-md text-ink text-xs font-mono border border-hairline flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    <span>{selectedTx.deliveryLocation}</span>
                  </div>
                </div>

                {/* Field Notes */}
                <div className="p-4 rounded-lg bg-canvas border border-hairline space-y-2">
                  <span className="text-xs font-mono text-ink-tertiary uppercase">Field NGO Handover Log</span>
                  <p className="text-sm text-ink leading-relaxed">
                    {selectedTx.fieldNotes}
                  </p>
                  <div className="text-[11px] font-mono text-primary pt-1">
                    {selectedTx.verifiedBy}
                  </div>
                </div>

                {/* Transaction Cryptographic Proof Specs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 rounded bg-surface-2 border border-hairline">
                    <div className="text-ink-tertiary">ON-CHAIN TX HASH</div>
                    <div className="text-ink font-semibold mt-1 break-all">{selectedTx.txHash}</div>
                  </div>
                  <div className="p-3 rounded bg-surface-2 border border-hairline">
                    <div className="text-ink-tertiary">ZERO-KNOWLEDGE RECIPIENT</div>
                    <div className="text-semantic-success font-semibold mt-1">{selectedTx.victimMerkleHash}</div>
                  </div>
                  <div className="p-3 rounded bg-surface-2 border border-hairline">
                    <div className="text-ink-tertiary">BLOCKCHAIN NETWORK</div>
                    <div className="text-ink font-semibold mt-1">{selectedTx.chain} (Block #{selectedTx.blockNumber})</div>
                  </div>
                  <div className="p-3 rounded bg-surface-2 border border-hairline">
                    <div className="text-ink-tertiary">GASLESS SPONSOR</div>
                    <div className="text-primary font-semibold mt-1">{selectedTx.gasSponsorTx}</div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-surface-2 border-t border-hairline flex items-center justify-between">
                <span className="text-xs font-mono text-ink-subtle">IPFS Gateway: ipfs.io/ipfs/{selectedTx.ipfsHash.slice(0, 12)}...</span>
                <button
                  onClick={() => setSelectedTx(null)}
                  className="px-4 py-1.5 rounded bg-primary hover:bg-primary-hover text-white text-xs font-medium tracking-button transition-all"
                >
                  Close Inspector
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
