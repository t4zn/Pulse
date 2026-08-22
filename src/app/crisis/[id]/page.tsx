"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import dynamicComponent from "next/dynamic";

const LiveCrisisMap = dynamicComponent(
  () => import("@/components/LiveCrisisMap").then((mod) => mod.LiveCrisisMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-96 rounded-2xl bg-surface-soft border border-hairline flex items-center justify-center text-xs font-mono text-body">
        Loading Interactive Crisis Map...
      </div>
    ),
  }
);
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
  Clock,
  Wallet,
  Check
} from "lucide-react";
import { useWallet } from "@/context/WalletContext";
import { getExplorerTxUrl } from "@/lib/contracts";

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
  statusBadge: string;
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
    statusBadge: "bg-red-50 text-semantic-down border-red-200",
    victimsVerified: 8420,
    disbursedUSD: 540000,
    description: "Direct cross-chain liquidity allocation for earthquake immediate search & rescue, surgical trauma kits, winterized shelter pods, and nutrition packs.",
    vaultAddresses: {
      sepolia: "0x3A9F112bC4782019b8830114a82173B19f20cA7",
      amoy: "0x7E1209a88201198302bfca99014c09A18D3b584",
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
    statusBadge: "bg-amber-50 text-amber-700 border-amber-200",
    victimsVerified: 4180,
    disbursedUSD: 280000,
    description: "Emergency rescue watercraft deployment, waterborne disease prevention medical stations, and food drop coordinates.",
    vaultAddresses: {
      sepolia: "0x11B9334c9012830029bca881001234567890abcd",
      amoy: "0x98D2001ba772091183aa1a331122334455667788",
    },
    telemetry: {
      sensorStation: "CWC Sensor Station IND-09",
      primaryMetric: "River Level: +4.2m above danger mark",
      secondaryMetric: "Rainfall Rate: 240mm / 24h",
      sensorStatus: "ONLINE • Sensor calibrated",
    },
    aiDamageReport: {
      structuralCollapsePct: 42,
      roadBlockagePct: 91,
      triageUrgency: "LEVEL 2 (URGENT AIRLIFT REQUIRED)",
      geminiAssessment: "Synthetic Aperture Radar detects widespread bridge severance. Water purification & inflatable rescue rafts are priority 1.",
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
    statusBadge: "bg-blue-50 text-primary border-blue-200",
    victimsVerified: 1680,
    disbursedUSD: 160000,
    description: "Deep aquifer solar pumping infrastructure, therapeutic food distribution, and emergency pastoralist drought safety nets.",
    vaultAddresses: {
      sepolia: "0x55C100a9821389bc019283d99aabbccddeeff0011",
      amoy: "0x22F4902188ba091122a7e1100112233445566778",
    },
    telemetry: {
      sensorStation: "Copernicus NDVI Sentinel-3 Hub",
      primaryMetric: "Vegetation Index: -0.42 anomaly",
      secondaryMetric: "Soil Moisture: 4% (Severe Aridity)",
      sensorStatus: "ONLINE • Satellite sync verified",
    },
    aiDamageReport: {
      structuralCollapsePct: 5,
      roadBlockagePct: 15,
      triageUrgency: "LEVEL 2 (FAMINE PREVENTION DISPATCH)",
      geminiAssessment: "High livestock mortality detected across nomadic corridors. Immediate ready-to-use therapeutic food (RUTF) allocation required.",
    },
  },
};

export default function CrisisDetailPage({ params }: { params: { id: string } }) {
  const crisis = crisisDatabase[params.id] || crisisDatabase["turkey-earthquake-2026"];
  const {
    address,
    isConnected,
    chainId,
    balance,
    connectWallet,
    switchNetwork,
    sendDonation,
  } = useWallet();

  const [selectedChain, setSelectedChain] = useState<"sepolia" | "amoy">("amoy");
  const [donationAmount, setDonationAmount] = useState("0.01");
  const [category, setCategory] = useState("general");
  const [donating, setDonating] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [txError, setTxError] = useState<string | null>(null);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const percent = Math.min(100, Math.round((crisis.raisedUSD / crisis.targetUSD) * 100));

  // Sync selected chain with active MetaMask chain if connected
  useEffect(() => {
    if (chainId === 11155111) setSelectedChain("sepolia");
    else if (chainId === 80002) setSelectedChain("amoy");
  }, [chainId]);

  const handleDonate = async () => {
    if (!isConnected) {
      await connectWallet();
      return;
    }

    setDonating(true);
    setTxError(null);

    try {
      // Ensure user is on the right network
      const targetChainId = selectedChain === "amoy" ? 80002 : 11155111;
      if (chainId !== targetChainId) {
        const switched = await switchNetwork(selectedChain);
        if (!switched) {
          setDonating(false);
          setTxError(`Please switch your MetaMask network to ${selectedChain === "amoy" ? "Polygon Amoy" : "Ethereum Sepolia"}`);
          return;
        }
      }

      const targetVault = crisis.vaultAddresses[selectedChain];
      const result = await sendDonation(targetVault, donationAmount);

      if (result.success && result.hash) {
        setTxHash(result.hash);
      } else {
        setTxError(result.error || "Transaction was not completed.");
      }
    } catch (err: any) {
      setTxError(err?.message || "Donation failed");
    } finally {
      setDonating(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(type);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  return (
    <div className="w-full bg-white text-ink min-h-screen py-8 px-4 md:px-8">
      <div className="max-w-[1280px] mx-auto">
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-mono text-body hover:text-ink mb-6 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Command Center
        </Link>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase border ${crisis.statusBadge}`}>
                {crisis.severityStatus} • SEVERITY {crisis.severity}
              </span>
              <span className="text-xs text-body font-medium">{crisis.categoryName}</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-normal tracking-tight text-ink mb-2">
              {crisis.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-body">
              <div className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-muted" />
                <span>{crisis.location}</span>
              </div>
              <div className="flex items-center gap-1 font-mono text-muted">
                <span>GPS: {crisis.gps}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#donation-terminal"
              className="px-6 py-2.5 rounded-full bg-primary hover:bg-primary-hover active:bg-primary-active text-white text-sm font-semibold flex items-center gap-2 transition-all shadow-sm"
            >
              <Zap className="w-4 h-4" />
              <span>Donate Now</span>
            </a>
            <Link
              href="/audit"
              className="px-5 py-2.5 rounded-full bg-surface-soft hover:bg-surface-strong text-ink text-sm font-semibold border border-hairline transition-colors"
            >
              <span>Audit Ledger</span>
            </Link>
          </div>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Overview Card */}
            <div className="p-6 rounded-2xl bg-white border border-hairline">
              <h2 className="text-sm font-semibold text-ink uppercase tracking-wider mb-2">Emergency Overview</h2>
              <p className="text-sm text-body leading-relaxed mb-6">
                {crisis.description}
              </p>

              {/* 6 Key Incident Metrics */}
              <div className="mb-6">
                <div className="text-xs font-mono font-semibold uppercase text-muted mb-2">
                  Incident Parameters
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-surface-soft border border-hairline">
                    <div className="text-[10px] text-body uppercase font-medium">Status</div>
                    <div className="text-semantic-down font-semibold mt-0.5">{crisis.status}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-soft border border-hairline">
                    <div className="text-[10px] text-body uppercase font-medium">Started</div>
                    <div className="text-ink font-semibold mt-0.5">{crisis.started}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-soft border border-hairline">
                    <div className="text-[10px] text-body uppercase font-medium">Severity</div>
                    <div className="text-semantic-down font-semibold mt-0.5">{crisis.severity}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-soft border border-hairline">
                    <div className="text-[10px] text-body uppercase font-medium">People Affected</div>
                    <div className="text-ink font-semibold mt-0.5">{crisis.peopleAffected}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-soft border border-hairline">
                    <div className="text-[10px] text-body uppercase font-medium">Immediate Aid</div>
                    <div className="text-primary font-semibold mt-0.5">{crisis.immediateAidRequired}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-soft border border-hairline">
                    <div className="text-[10px] text-body uppercase font-medium">Affected Area</div>
                    <div className="text-ink font-semibold mt-0.5 truncate">{crisis.affectedArea}</div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2 mb-6 pt-4 border-t border-hairline">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-body">Aggregated Liquidity Vault:</span>
                  <span className="text-ink font-semibold">${crisis.raisedUSD.toLocaleString()} / ${crisis.targetUSD.toLocaleString()} ({percent}%)</span>
                </div>
                <div className="w-full h-2 bg-surface-strong rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-700"
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-muted">
                  <span>${crisis.disbursedUSD.toLocaleString()} Disbursed</span>
                  <span>{crisis.victimsVerified.toLocaleString()} Verified Beneficiaries</span>
                </div>
              </div>

              {/* On-Chain Vault Contract Addresses */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-hairline font-mono text-xs">
                <div className="p-3 rounded-xl bg-surface-soft border border-hairline flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-muted">ETH SEPOLIA VAULT</div>
                    <div className="text-ink text-xs truncate max-w-[180px] font-mono">{crisis.vaultAddresses.sepolia}</div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(crisis.vaultAddresses.sepolia, "sepolia")}
                    className="p-1.5 text-muted hover:text-ink rounded-full hover:bg-white"
                    title="Copy Address"
                  >
                    {copiedAddress === "sepolia" ? <Check className="w-4 h-4 text-semantic-up" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-surface-soft border border-hairline flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-muted">POLYGON AMOY VAULT</div>
                    <div className="text-primary text-xs truncate max-w-[180px] font-mono">{crisis.vaultAddresses.amoy}</div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(crisis.vaultAddresses.amoy, "amoy")}
                    className="p-1.5 text-muted hover:text-ink rounded-full hover:bg-white"
                    title="Copy Address"
                  >
                    {copiedAddress === "amoy" ? <Check className="w-4 h-4 text-semantic-up" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* LIVE CRISIS MAP */}
            <LiveCrisisMap 
              crisisId={crisis.id} 
              crisisTitle={crisis.title} 
              locationName={crisis.location} 
            />

            {/* Live Telemetry & AI Severity Monitor */}
            <div className="p-6 rounded-2xl bg-white border border-hairline space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-hairline">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-primary" />
                  <span className="text-xs font-semibold uppercase text-ink">Live Sensor Feeds & AI Telemetry</span>
                </div>
                <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-semantic-up border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-semantic-up animate-pulse"></span>
                  {crisis.telemetry.sensorStatus}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-surface-soft border border-hairline">
                  <div className="text-[10px] text-muted uppercase">Sensor Station:</div>
                  <div className="text-ink mt-0.5">{crisis.telemetry.sensorStation}</div>
                </div>
                <div className="p-3 rounded-xl bg-surface-soft border border-hairline">
                  <div className="text-[10px] text-muted uppercase">Primary Metric:</div>
                  <div className="text-semantic-down font-medium mt-0.5">{crisis.telemetry.primaryMetric}</div>
                </div>
              </div>

              {/* Gemini 2.5 Flash Damage Assessment */}
              <div className="p-4 rounded-xl bg-surface-soft border border-hairline text-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-hairline">
                  <span className="text-ink font-semibold flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-primary" /> Gemini 2.5 Flash Damage Verification
                  </span>
                  <span className="text-primary text-[10px] font-mono">Model: gemini-2.5-flash</span>
                </div>

                <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                  <div className="p-2.5 rounded-lg bg-white border border-hairline">
                    <div className="text-muted text-[10px]">COLLAPSE:</div>
                    <div className="text-ink font-semibold mt-0.5">{crisis.aiDamageReport.structuralCollapsePct}%</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-hairline">
                    <div className="text-muted text-[10px]">BLOCKAGE:</div>
                    <div className="text-ink font-semibold mt-0.5">{crisis.aiDamageReport.roadBlockagePct}%</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-hairline">
                    <div className="text-muted text-[10px]">TRIAGE:</div>
                    <div className="text-semantic-down font-semibold mt-0.5 truncate">{crisis.aiDamageReport.triageUrgency}</div>
                  </div>
                </div>

                <p className="text-xs text-body leading-relaxed">
                  {crisis.aiDamageReport.geminiAssessment}
                </p>
              </div>
            </div>

            {/* Category Blueprint Breakdown */}
            <div className="p-6 rounded-2xl bg-white border border-hairline">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-body mb-3">Category Allocation Blueprint</h3>
              <div className="grid grid-cols-3 gap-3 font-mono text-xs">
                <div className="p-4 rounded-xl bg-surface-soft border border-hairline">
                  <div className="text-muted text-[10px]">MEDICAL CARE</div>
                  <div className="text-lg text-ink font-bold mt-1">40%</div>
                  <div className="text-xs text-body mt-0.5">Trauma kits & surgery</div>
                </div>
                <div className="p-4 rounded-xl bg-surface-soft border border-hairline">
                  <div className="text-muted text-[10px]">FOOD RATIONS</div>
                  <div className="text-lg text-primary font-bold mt-1">30%</div>
                  <div className="text-xs text-body mt-0.5">Water & dry meals</div>
                </div>
                <div className="p-4 rounded-xl bg-surface-soft border border-hairline">
                  <div className="text-muted text-[10px]">EMERGENCY SHELTER</div>
                  <div className="text-lg text-semantic-up font-bold mt-1">30%</div>
                  <div className="text-xs text-body mt-0.5">Thermal pods & blankets</div>
                </div>
              </div>
            </div>
          </div>

          {/* Donation Terminal Box (1 Col) */}
          <div id="donation-terminal" className="p-6 rounded-2xl bg-white border border-hairline flex flex-col justify-between h-fit sticky top-20 shadow-card">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-hairline mb-5">
                <div className="flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-ink text-sm">Donation Terminal</span>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-semantic-up border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-semantic-up animate-pulse"></span>
                  {isConnected ? "MetaMask Active" : "Direct On-Chain"}
                </span>
              </div>

              {/* Wallet Status Banner */}
              {isConnected ? (
                <div className="p-3 rounded-xl bg-surface-soft border border-hairline mb-4 text-xs font-mono">
                  <div className="flex items-center justify-between text-body mb-1">
                    <span>Connected Wallet:</span>
                    <span className="text-semantic-up font-semibold">● Live</span>
                  </div>
                  <div className="text-ink font-semibold break-all text-[11px]">{address}</div>
                  <div className="text-[10px] text-muted mt-1">
                    Available: <strong className="text-ink">{balance} {chainId === 80002 ? "POL" : "ETH"}</strong>
                  </div>
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  className="w-full mb-4 p-3 rounded-xl bg-blue-50/50 hover:bg-blue-50 border border-blue-200 text-primary text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Wallet className="w-4 h-4" />
                  <span>Connect MetaMask to Donate</span>
                </button>
              )}

              {/* Chain Selector */}
              <div className="space-y-1.5 mb-4">
                <label className="text-xs font-semibold text-body">SELECT NETWORK</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setSelectedChain("amoy");
                      if (isConnected && chainId !== 80002) switchNetwork("amoy");
                    }}
                    className={`py-2 px-3 rounded-full text-xs font-mono font-medium border transition-colors ${
                      selectedChain === "amoy" 
                        ? "bg-primary text-white border-primary font-semibold" 
                        : "bg-surface-soft text-body border-hairline hover:text-ink"
                    }`}
                  >
                    Polygon Amoy (POL)
                  </button>
                  <button
                    onClick={() => {
                      setSelectedChain("sepolia");
                      if (isConnected && chainId !== 11155111) switchNetwork("sepolia");
                    }}
                    className={`py-2 px-3 rounded-full text-xs font-mono font-medium border transition-colors ${
                      selectedChain === "sepolia" 
                        ? "bg-primary text-white border-primary font-semibold" 
                        : "bg-surface-soft text-body border-hairline hover:text-ink"
                    }`}
                  >
                    Eth Sepolia (ETH)
                  </button>
                </div>
              </div>

              {/* Amount Input */}
              <div className="space-y-1.5 mb-4">
                <div className="flex items-center justify-between text-xs font-mono text-body">
                  <label className="font-semibold">AMOUNT ({selectedChain === "amoy" ? "POL" : "ETH"})</label>
                  <span>≈ ${(Number(donationAmount || 0) * (selectedChain === "amoy" ? 0.65 : 2750)).toFixed(2)} USD</span>
                </div>
                <input
                  type="text"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  className="w-full bg-white border border-hairline focus:border-primary text-ink px-4 py-2.5 rounded-xl text-base font-mono focus:outline-none"
                />

                {/* Preset Chips */}
                <div className="flex items-center gap-1.5 pt-1 font-mono text-xs">
                  {(selectedChain === "amoy" ? ["0.1", "0.5", "1.0", "5.0"] : ["0.005", "0.01", "0.05", "0.1"]).map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setDonationAmount(preset)}
                      className="px-3 py-1 rounded-full bg-surface-soft border border-hairline hover:bg-surface-strong text-body hover:text-ink transition-colors"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Lock Selector */}
              <div className="space-y-1.5 mb-5">
                <label className="text-xs font-semibold text-body">AID CATEGORY</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-white border border-hairline text-ink px-3 py-2 rounded-xl text-xs font-mono focus:outline-none"
                >
                  <option value="general">General Relief Pool (Auto-Balance)</option>
                  <option value="medical">Medical & Field Trauma (40%)</option>
                  <option value="food">Food Rations & Clean Water (30%)</option>
                  <option value="shelter">Emergency Winter Shelter (30%)</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-surface-soft border border-hairline text-xs font-mono text-body space-y-1 mb-5">
                <div className="flex items-center justify-between">
                  <span>Protocol Fee:</span>
                  <span className="text-semantic-up font-semibold">0.00% (Direct Vault)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Audit Trail:</span>
                  <span className="text-ink">100% On-Chain Verifiable</span>
                </div>
              </div>
            </div>

            {/* Execute Button / Receipt / Error */}
            {txError && (
              <div className="p-3 mb-3 rounded-xl bg-red-50 border border-red-200 text-semantic-down text-xs font-mono">
                {txError}
              </div>
            )}

            {txHash ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-semantic-up text-center font-mono text-xs space-y-2">
                <div className="flex items-center justify-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4" /> Real On-Chain Tx Confirmed!
                </div>
                <div className="text-xs text-body break-all">Hash: {txHash}</div>
                <div className="pt-2 flex items-center justify-center gap-3">
                  <a
                    href={getExplorerTxUrl(selectedChain, txHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline font-semibold"
                  >
                    <span>View on Explorer</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => {
                      setTxHash(null);
                    }}
                    className="text-body hover:underline text-xs"
                  >
                    New Donation
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleDonate}
                disabled={donating}
                className="w-full py-3 px-4 rounded-full bg-primary hover:bg-primary-hover active:bg-primary-active text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              >
                {donating ? (
                  <span className="font-mono text-xs animate-pulse">Confirm in MetaMask...</span>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>
                      {isConnected ? `Donate ${donationAmount} ${selectedChain === "amoy" ? "POL" : "ETH"} via MetaMask` : "Connect MetaMask to Donate"}
                    </span>
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
