"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  HeartHandshake, 
  ArrowLeft, 
  ShieldCheck, 
  ExternalLink, 
  Globe, 
  Zap, 
  CheckCircle2, 
  Cpu, 
  Radio, 
  AlertTriangle,
  Lock,
  Layers,
  Copy,
  Clock
} from "lucide-react";

interface CrisisDetail {
  id: string;
  title: string;
  category: "earthquake" | "flood" | "drought";
  categoryName: string;
  location: string;
  gps: string;
  status: string;
  started: string;
  severity: string;
  peopleAffected: string;
  immediateAidRequired: string;
  affectedArea: string;
  lastUpdated: string;
  raisedUSD: number;
  targetUSD: number;
  severityIndex: number;
  severityStatus: string;
  statusColor: string;
  victimsVerified: number;
  disbursedUSD: number;
  description: string;
  vaultAddresses: {
    sepolia: string;
    amoy: string;
  };
  telemetry: {
    sensorStation: string;
    primaryMetric: string;
    secondaryMetric: string;
    sensorStatus: string;
  };
  aiDamageReport: {
    structuralCollapsePct: number;
    roadBlockagePct: number;
    triageUrgency: string;
    geminiAssessment: string;
  };
}

const crisisDatabase: Record<string, CrisisDetail> = {
  "turkey-earthquake-2026": {
    id: "turkey-earthquake-2026",
    title: "Turkey-Syria 7.8M Earthquake Emergency",
    category: "earthquake",
    categoryName: "Earthquake Relief",
    location: "Kahramanmaraş & Gaziantep, Turkey",
    gps: "37.5854° N, 36.9372° E",
    status: "Active — Critical",
    started: "14:32 UTC",
    severity: "9.4/10",
    peopleAffected: "2.4M",
    immediateAidRequired: "842K",
    affectedArea: "18,420 km²",
    lastUpdated: "3 sec ago",
    raisedUSD: 684200,
    targetUSD: 1000000,
    severityIndex: 9.4,
    severityStatus: "CRITICAL",
    statusColor: "text-red-400 border-red-900/50 bg-red-950/20",
    victimsVerified: 8420,
    disbursedUSD: 540000,
    description: "Direct cross-chain liquidity allocation for earthquake immediate search & rescue, surgical trauma kits, winterized shelter pods, and nutrition packs.",
    vaultAddresses: {
      sepolia: "0x3A9F112bC4782019b8830114a821",
      amoy: "0x7E1209a88201198302bfca99014c09",
    },
    telemetry: {
      sensorStation: "USGS Station TUR-042 (AFAD Network)",
      primaryMetric: "Peak Ground Accel: 0.72g • Depth: 17.9km",
      secondaryMetric: "Aftershocks Recorded: 54 events (Max: 6.7M)",
      sensorStatus: "ONLINE • Real-time stream active",
    },
    aiDamageReport: {
      structuralCollapsePct: 88,
      roadBlockagePct: 74,
      triageUrgency: "LEVEL 1 (MAXIMUM IMMEDIATE AID)",
      geminiAssessment: "Satellite multi-spectral analysis confirms catastrophic structural failure in central residential sectors. Immediate thermal shelter & pediatric surgical kits required.",
    },
  },
  "kerala-flood-2026": {
    id: "kerala-flood-2026",
    title: "South Asia Monsoon Flash Flood Relief",
    category: "flood",
    categoryName: "Monsoon Flood",
    location: "Wayanad, Kerala, India",
    gps: "11.6854° N, 76.1320° E",
    status: "Active — High Alert",
    started: "06:15 UTC",
    severity: "8.1/10",
    peopleAffected: "1.1M",
    immediateAidRequired: "320K",
    affectedArea: "4,200 km²",
    lastUpdated: "12 sec ago",
    raisedUSD: 342100,
    targetUSD: 500000,
    severityIndex: 8.1,
    severityStatus: "HIGH ALERT",
    statusColor: "text-amber-400 border-amber-900/50 bg-amber-950/20",
    victimsVerified: 4180,
    disbursedUSD: 280000,
    description: "Emergency relief for flood-displaced communities, providing clean water filtration, emergency rations, and anti-venom medical kits.",
    vaultAddresses: {
      sepolia: "0x11B994190823488273619283746e44",
      amoy: "0x98D291048827361928374619281a33",
    },
    telemetry: {
      sensorStation: "CWC Sensor IND-09 (Kabini Basin)",
      primaryMetric: "Water Level: +4.2m above danger threshold",
      secondaryMetric: "Discharge Rate: 1,420 m³/sec",
      sensorStatus: "ONLINE • Alert Level Red",
    },
    aiDamageReport: {
      structuralCollapsePct: 62,
      roadBlockagePct: 81,
      triageUrgency: "LEVEL 2 (URGENT AIRLIFT & EVACUATION)",
      geminiAssessment: "Satellite SAR radar shows 42 sq km inundation. Main transportation arteries submerged. Clean water tablets and solar emergency radios prioritized.",
    },
  },
  "horn-of-africa-2026": {
    id: "horn-of-africa-2026",
    title: "Horn of Africa Severe Drought Crisis",
    category: "drought",
    categoryName: "Severe Drought",
    location: "Somalia & Eastern Ethiopia",
    gps: "5.1521° N, 46.1996° E",
    status: "Active — Elevated",
    started: "03:40 UTC",
    severity: "7.6/10",
    peopleAffected: "4.8M",
    immediateAidRequired: "1.2M",
    affectedArea: "65,000 km²",
    lastUpdated: "45 sec ago",
    raisedUSD: 214200,
    targetUSD: 400000,
    severityIndex: 7.6,
    severityStatus: "ELEVATED",
    statusColor: "text-blue-400 border-blue-900/50 bg-blue-950/20",
    victimsVerified: 1680,
    disbursedUSD: 160000,
    description: "Emergency nutrition assistance, water trucking tankers, and emergency veterinary drought subsidies for pastoralist families.",
    vaultAddresses: {
      sepolia: "0x55C192837461928374619283743d99",
      amoy: "0x22F492837461928374619283747e11",
    },
    telemetry: {
      sensorStation: "FEWS NET Sensor HO-08",
      primaryMetric: "NDVI Vegetation Anomaly: -0.42",
      secondaryMetric: "Consecutive Failed Rainy Seasons: 5",
      sensorStatus: "ONLINE • Chronic High Stress",
    },
    aiDamageReport: {
      structuralCollapsePct: 15,
      roadBlockagePct: 10,
      triageUrgency: "LEVEL 2 (CRITICAL NUTRITION DISPATCH)",
      geminiAssessment: "High-resolution optical scan shows acute water point depletion. Direct cash and fortified ration vouchers recommended.",
    },
  },
};

export default function CrisisPage({ params }: { params: { id: string } }) {
  const crisisId = params.id || "turkey-earthquake-2026";
  const crisis = crisisDatabase[crisisId] || crisisDatabase["turkey-earthquake-2026"];

  const [selectedChain, setSelectedChain] = useState<"amoy" | "sepolia">("amoy");
  const [donationAmount, setDonationAmount] = useState("100");
  const [category, setCategory] = useState("general");
  const [donating, setDonating] = useState(false);
  const [txSuccess, setTxSuccess] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const percent = Math.min(100, Math.round((crisis.raisedUSD / crisis.targetUSD) * 100));

  const handleDonate = () => {
    setDonating(true);
    setTimeout(() => {
      setDonating(false);
      setTxSuccess(true);
    }, 1200);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedAddress(key);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  return (
    <div className="w-full bg-canvas text-ink min-h-screen py-8 px-4 md:px-8">
      <div className="max-w-[1280px] mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center gap-1.5 text-xs font-mono text-ink-subtle hover:text-ink transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Command Center
          </Link>

          <div className="flex items-center gap-2 text-xs font-mono text-ink-tertiary">
            <span>VAULT ID:</span>
            <span className="text-ink-muted">{crisis.id}</span>
          </div>
        </div>

        {/* Main Grid: 2 Cols (Crisis Telemetry & Details + Donation Terminal) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info & Live Telemetry Panel (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="p-6 rounded-lg bg-surface-1 border border-hairline">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-pill text-[10px] font-mono uppercase border ${crisis.statusColor}`}>
                    {crisis.severityStatus} • {crisis.severityIndex}/10
                  </span>
                  <span className="text-xs font-mono text-ink-subtle">
                    {crisis.categoryName}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono text-ink-tertiary">
                  <Globe className="w-3.5 h-3.5" />
                  <span>{crisis.gps}</span>
                </div>
              </div>

              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-ink mb-2">
                {crisis.title}
              </h1>
              <p className="text-xs text-ink-subtle leading-relaxed mb-5">
                {crisis.description}
              </p>

              {/* Active Crisis Vital Status HUD (7 Key Operational Metrics) */}
              <div className="p-4 rounded-lg bg-surface-2/80 border border-hairline mb-6">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-3 border-b border-hairline">
                  <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase text-ink">
                    <span className="w-2 h-2 rounded-full bg-semantic-success animate-pulse" />
                    <span>Active Crisis Live Telemetry Feed</span>
                  </div>
                  <span className="text-[11px] font-mono text-ink-subtle flex items-center gap-1">
                    🔄 Last Updated: <strong className="text-ink font-semibold">{crisis.lastUpdated}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 font-mono text-xs">
                  {/* 1. Status */}
                  <div className="p-2.5 rounded bg-canvas border border-hairline">
                    <div className="text-[10px] text-ink-tertiary uppercase flex items-center gap-1">
                      <span>🟢 Status</span>
                    </div>
                    <div className="text-emerald-400 font-semibold text-[11px] mt-1 truncate">
                      {crisis.status}
                    </div>
                  </div>

                  {/* 2. Started */}
                  <div className="p-2.5 rounded bg-canvas border border-hairline">
                    <div className="text-[10px] text-ink-tertiary uppercase flex items-center gap-1">
                      <span>🕐 Started</span>
                    </div>
                    <div className="text-ink font-semibold text-[11px] mt-1">
                      {crisis.started}
                    </div>
                  </div>

                  {/* 3. Severity */}
                  <div className="p-2.5 rounded bg-canvas border border-hairline">
                    <div className="text-[10px] text-ink-tertiary uppercase flex items-center gap-1">
                      <span>📈 Severity</span>
                    </div>
                    <div className="text-red-400 font-semibold text-[11px] mt-1">
                      {crisis.severity}
                    </div>
                  </div>

                  {/* 4. People Affected */}
                  <div className="p-2.5 rounded bg-canvas border border-hairline">
                    <div className="text-[10px] text-ink-tertiary uppercase flex items-center gap-1">
                      <span>👥 People Affected</span>
                    </div>
                    <div className="text-ink font-semibold text-[11px] mt-1">
                      {crisis.peopleAffected}
                    </div>
                  </div>

                  {/* 5. Immediate Aid Required */}
                  <div className="p-2.5 rounded bg-canvas border border-hairline">
                    <div className="text-[10px] text-ink-tertiary uppercase flex items-center gap-1">
                      <span>🚨 Immediate Aid</span>
                    </div>
                    <div className="text-primary font-semibold text-[11px] mt-1">
                      {crisis.immediateAidRequired}
                    </div>
                  </div>

                  {/* 6. Affected Area */}
                  <div className="p-2.5 rounded bg-canvas border border-hairline">
                    <div className="text-[10px] text-ink-tertiary uppercase flex items-center gap-1">
                      <span>🗺️ Affected Area</span>
                    </div>
                    <div className="text-ink font-semibold text-[11px] mt-1 truncate">
                      {crisis.affectedArea}
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5 mb-6 pt-4 border-t border-hairline">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-ink-subtle">Aggregated Liquidity Vault:</span>
                  <span className="text-ink font-semibold">${crisis.raisedUSD.toLocaleString()} / ${crisis.targetUSD.toLocaleString()} ({percent}%)</span>
                </div>
                <div className="w-full h-2 bg-surface-3 rounded-pill overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-pill transition-all duration-700"
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-ink-tertiary">
                  <span>${crisis.disbursedUSD.toLocaleString()} Disbursed</span>
                  <span>{crisis.victimsVerified.toLocaleString()} Verified Beneficiaries</span>
                </div>
              </div>

              {/* On-Chain Vault Contract Addresses */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-hairline font-mono text-xs">
                <div className="p-2.5 rounded bg-canvas border border-hairline flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-ink-tertiary">ETH SEPOLIA VAULT</div>
                    <div className="text-ink-muted text-[11px] truncate max-w-[180px]">{crisis.vaultAddresses.sepolia}</div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(crisis.vaultAddresses.sepolia, "sepolia")}
                    className="p-1 text-ink-subtle hover:text-ink"
                    title="Copy Address"
                  >
                    {copiedAddress === "sepolia" ? <CheckCircle2 className="w-3.5 h-3.5 text-semantic-success" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="p-2.5 rounded bg-canvas border border-hairline flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-ink-tertiary">POLYGON AMOY VAULT</div>
                    <div className="text-primary text-[11px] truncate max-w-[180px]">{crisis.vaultAddresses.amoy}</div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(crisis.vaultAddresses.amoy, "amoy")}
                    className="p-1 text-ink-subtle hover:text-ink"
                    title="Copy Address"
                  >
                    {copiedAddress === "amoy" ? <CheckCircle2 className="w-3.5 h-3.5 text-semantic-success" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Live Telemetry & AI Severity Monitor */}
            <div className="p-6 rounded-lg bg-surface-1 border border-hairline space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-hairline">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-primary" />
                  <span className="text-xs font-semibold uppercase font-mono text-ink">Live Sensor Feeds & AI Telemetry</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-pill bg-surface-2 text-semantic-success border border-semantic-success/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-semantic-success animate-pulse"></span>
                  {crisis.telemetry.sensorStatus}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded bg-canvas border border-hairline">
                  <div className="text-[10px] text-ink-tertiary uppercase">Sensor Station:</div>
                  <div className="text-ink-muted mt-0.5">{crisis.telemetry.sensorStation}</div>
                </div>
                <div className="p-3 rounded bg-canvas border border-hairline">
                  <div className="text-[10px] text-ink-tertiary uppercase">Primary Metric:</div>
                  <div className="text-red-400 font-medium mt-0.5">{crisis.telemetry.primaryMetric}</div>
                </div>
              </div>

              {/* Gemini 2.5 Flash Damage Assessment */}
              <div className="p-4 rounded bg-canvas border border-hairline text-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-hairline font-mono">
                  <span className="text-ink font-semibold flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-primary" /> Gemini 2.5 Flash Damage Verification
                  </span>
                  <span className="text-primary text-[10px]">Model: gemini-2.5-flash</span>
                </div>

                <div className="grid grid-cols-3 gap-2 font-mono text-[11px]">
                  <div className="p-2 rounded bg-surface-1 border border-hairline">
                    <div className="text-ink-tertiary text-[10px]">COLLAPSE:</div>
                    <div className="text-ink font-semibold mt-0.5">{crisis.aiDamageReport.structuralCollapsePct}%</div>
                  </div>
                  <div className="p-2 rounded bg-surface-1 border border-hairline">
                    <div className="text-ink-tertiary text-[10px]">BLOCKAGE:</div>
                    <div className="text-ink font-semibold mt-0.5">{crisis.aiDamageReport.roadBlockagePct}%</div>
                  </div>
                  <div className="p-2 rounded bg-surface-1 border border-hairline">
                    <div className="text-ink-tertiary text-[10px]">TRIAGE:</div>
                    <div className="text-red-400 font-semibold mt-0.5 truncate">{crisis.aiDamageReport.triageUrgency}</div>
                  </div>
                </div>

                <p className="text-xs text-ink-subtle leading-relaxed">
                  {crisis.aiDamageReport.geminiAssessment}
                </p>
              </div>
            </div>

            {/* Category Blueprint Breakdown */}
            <div className="p-6 rounded-lg bg-surface-1 border border-hairline">
              <h3 className="text-xs font-mono uppercase tracking-wider text-ink-subtle mb-3">Category Allocation Blueprint</h3>
              <div className="grid grid-cols-3 gap-3 font-mono text-xs">
                <div className="p-3 rounded-md bg-canvas border border-hairline">
                  <div className="text-ink-tertiary text-[10px]">MEDICAL CARE</div>
                  <div className="text-base text-ink font-bold mt-1">40%</div>
                  <div className="text-[10px] text-ink-subtle mt-0.5">Trauma kits & surgery</div>
                </div>
                <div className="p-3 rounded-md bg-canvas border border-hairline">
                  <div className="text-ink-tertiary text-[10px]">FOOD RATIONS</div>
                  <div className="text-base text-primary font-bold mt-1">30%</div>
                  <div className="text-[10px] text-ink-subtle mt-0.5">Water & dry meals</div>
                </div>
                <div className="p-3 rounded-md bg-canvas border border-hairline">
                  <div className="text-ink-tertiary text-[10px]">EMERGENCY SHELTER</div>
                  <div className="text-base text-semantic-success font-bold mt-1">30%</div>
                  <div className="text-[10px] text-ink-subtle mt-0.5">Thermal pods & blankets</div>
                </div>
              </div>
            </div>
          </div>

          {/* Donation Terminal Box (1 Col) */}
          <div className="p-6 rounded-lg bg-surface-1 border border-hairline flex flex-col justify-between h-fit sticky top-20">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-hairline mb-5">
                <div className="flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-ink text-sm">Donation Terminal</span>
                </div>
                <span className="text-[10px] font-mono text-semantic-success flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-semantic-success animate-pulse"></span> Instant Block
                </span>
              </div>

              {/* Chain Selector */}
              <div className="space-y-1.5 mb-4">
                <label className="text-[11px] font-mono text-ink-subtle">SELECT NETWORK</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedChain("amoy")}
                    className={`py-1.5 px-3 rounded-md text-xs font-mono border transition-colors ${
                      selectedChain === "amoy" 
                        ? "bg-surface-3 text-ink border-primary font-medium" 
                        : "bg-surface-2 text-ink-subtle border-hairline hover:text-ink"
                    }`}
                  >
                    Polygon Amoy (POL)
                  </button>
                  <button
                    onClick={() => setSelectedChain("sepolia")}
                    className={`py-1.5 px-3 rounded-md text-xs font-mono border transition-colors ${
                      selectedChain === "sepolia" 
                        ? "bg-surface-3 text-ink border-primary font-medium" 
                        : "bg-surface-2 text-ink-subtle border-hairline hover:text-ink"
                    }`}
                  >
                    Eth Sepolia (ETH)
                  </button>
                </div>
              </div>

              {/* Amount Input */}
              <div className="space-y-1.5 mb-4">
                <div className="flex items-center justify-between text-[11px] font-mono text-ink-subtle">
                  <label>AMOUNT ({selectedChain === "amoy" ? "POL" : "ETH"})</label>
                  <span>≈ ${(Number(donationAmount || 0) * (selectedChain === "amoy" ? 0.65 : 2750)).toLocaleString()} USD</span>
                </div>
                <input
                  type="number"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  className="w-full bg-canvas border border-hairline focus:border-primary text-ink px-3 py-2 rounded-md text-base font-mono focus:outline-none"
                />

                {/* Preset Chips */}
                <div className="flex items-center gap-1.5 pt-1 font-mono text-[10px]">
                  {["25", "50", "100", "250"].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setDonationAmount(preset)}
                      className="px-2 py-0.5 rounded bg-surface-2 border border-hairline hover:border-hairline-strong text-ink-muted hover:text-ink transition-colors"
                    >
                      +{preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Lock Selector */}
              <div className="space-y-1.5 mb-5">
                <label className="text-[11px] font-mono text-ink-subtle">DESIGNATE AID CATEGORY</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-canvas border border-hairline text-ink px-2.5 py-1.5 rounded-md text-xs font-mono focus:outline-none"
                >
                  <option value="general">General Relief Pool (Auto-Balance)</option>
                  <option value="medical">Medical & Field Trauma</option>
                  <option value="food">Food Rations & Clean Water</option>
                  <option value="shelter">Emergency Winter Shelter</option>
                </select>
              </div>

              <div className="p-3 rounded bg-canvas border border-hairline text-[11px] font-mono text-ink-tertiary space-y-1 mb-5">
                <div className="flex items-center justify-between">
                  <span>Protocol Fee:</span>
                  <span className="text-semantic-success font-medium">0.00% (Zero Middleman)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Audit Trail:</span>
                  <span className="text-ink-muted">Glass-Box Visual Flow</span>
                </div>
              </div>
            </div>

            {/* Execute Button / Receipt */}
            {txSuccess ? (
              <div className="p-4 rounded-md bg-surface-2 border border-semantic-success/30 text-semantic-success text-center font-mono text-xs space-y-2">
                <div className="flex items-center justify-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4" /> Transaction Confirmed
                </div>
                <div className="text-[10px] text-ink-subtle">Hash: 0x9f1a...4b22 (Polygon Amoy #842109)</div>
                <Link href="/audit" className="inline-block text-primary hover:underline text-[11px] pt-1">
                  Inspect in Live Audit Ledger →
                </Link>
              </div>
            ) : (
              <button
                onClick={handleDonate}
                disabled={donating}
                className="w-full py-2.5 px-4 rounded-md bg-primary hover:bg-primary-hover active:bg-primary-focus text-white text-xs font-medium tracking-button transition-colors flex items-center justify-center gap-2"
              >
                {donating ? (
                  <span className="font-mono text-xs animate-pulse">Broadcasting Tx to {selectedChain}...</span>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5" />
                    <span>Execute Emergency Donation</span>
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
