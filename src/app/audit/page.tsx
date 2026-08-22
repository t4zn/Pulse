"use client";

export const dynamic = "force-dynamic";

import React, { useState, useMemo, useEffect, Suspense, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { 
  Search, 
  ArrowLeft, 
  ExternalLink, 
  Download, 
  ShieldCheck, 
  CheckCircle2, 
  Activity, 
  ArrowRight, 
  X, 
  Copy, 
  Trash2, 
  ArrowUpRight,
  MapPin,
  Building2,
  FileCheck,
  ChevronDown,
  ChevronUp,
  Radio,
  Layers,
  Eye,
  FileText,
  AlertTriangle,
  BadgeCheck,
  Compass,
  Heart,
  Wallet,
  Sparkles,
  Check,
  QrCode,
  Share2,
  Camera,
} from "lucide-react";
import { useWallet } from "@/context/WalletContext";
import { SankeyFlowDiagram } from "@/components/SankeyFlowDiagram";
import { IPFSDeliveryModal } from "@/components/IPFSDeliveryModal";
import {
  getExplorerTxUrl,
  getExplorerAddressUrl,
  getIpfsGatewayUrl,
  formatAddress,
  formatCurrencyUSD,
} from "@/lib/contracts";
import {
  getStoredAuditEvents,
  getStoredCommittedRoots,
  getStoredVoucherBatches,
  clearAllAuditCache,
  SEED_AUDIT_EVENTS,
  type AuditEvent,
  type CommittedRootRecord,
  type VoucherBatchRecord,
} from "@/lib/auditState";

// ─── TYPES ───────────────────────────────────────────────────────────────────

export interface ActiveNGO {
  id: string;
  name: string;
  logoSrc: string;
  verifiedOnChain: boolean;
  role: string;
  fieldZone: string;
  walletAddress: string;
  fundsDisbursedUSD: number;
  fundsDisbursedCrypto: string;
  beneficiariesServed: number;
  status: "Active Field Deployment" | "Aid Disbursing" | "Standby Triage" | "Logistics Hub";
  auditProofCid: string;
  latestDeliveryProof: string;
  focalContact?: string;
}

export interface DisasterAuditBlock {
  id: string;
  title: string;
  category: "earthquake" | "flood" | "wildfire" | "storm" | "drought";
  categoryLabel: string;
  location: string;
  coordinates: string;
  severityLevel: "CRITICAL" | "HIGH" | "ELEVATED";
  severityScore: string;
  magnitudeMetric: string;
  timeAgo: string;
  telemetrySource: string;
  fullDescription: string[];
  totalAllocatedUSD: number;
  targetUSD: number;
  disbursedUSD: number;
  reserveUSD: number;
  verifiedBeneficiariesCount: number;
  zkClaimsRedeemedCount: number;
  vaultAddresses: {
    sepolia: string;
    amoy: string;
  };
  merkleRoot: string;
  ipfsManifestCid: string;
  activeNGOs: ActiveNGO[];
  recentDisasterTxs: {
    id: string;
    txHash: string;
    network: "sepolia" | "amoy";
    blockNumber: number;
    beneficiaryAddress: string;
    amountUSD: number;
    amountCrypto: string;
    category: "Medical Care" | "Food Rations" | "Emergency Shelter";
    timestamp: string;
    timeAgo: string;
    ipfsReceipt: string;
  }[];
}

// ─── SAMPLE DONOR TRACKING DATA ──────────────────────────────────────────────

interface DonorTrackRecord {
  id: string;
  donorAddress: string;
  donorLabel: string;
  amountUSD: number;
  amountCrypto: string;
  network: "sepolia" | "amoy";
  txHash: string;
  disasterTitle: string;
  disasterLocation: string;
  assignedNGO: string;
  ngoRole: string;
  aidCategory: string;
  impactSummary: string;
  beneficiaryCount: number;
  deliveryStatus: "100% Delivered & Verified" | "In Field Transit" | "Allocated to Vault";
  ipfsReceiptCid: string;
  timestamp: string;
  timeAgo: string;
}

const SAMPLE_DONOR_TRACKS: DonorTrackRecord[] = [
  {
    id: "track-1",
    donorAddress: "0x7F23190bA8812c45e89d1234567890abcdefB39a",
    donorLabel: "Institutional Partner (0x7F23...B39a)",
    amountUSD: 2460.00,
    amountCrypto: "0.82 ETH",
    network: "sepolia",
    txHash: "0x83a19b22e11a98071e44bcda12349876543210fedcba9901847192837482910c",
    disasterTitle: "Turkey-Syria 7.8M Tectonic Rupture Emergency",
    disasterLocation: "Kahramanmaraş & Hatay, Turkey",
    assignedNGO: "Turkish Red Crescent (Türk Kızılay)",
    ngoRole: "Emergency Winterization & Heated Shelter Command",
    aidCategory: "Emergency Shelter & Heated Bedding",
    impactSummary: "Funded 16 Insulated Sub-Zero Family Tents + 48 Thermal Blankets for 16 displaced households.",
    beneficiaryCount: 16,
    deliveryStatus: "100% Delivered & Verified",
    ipfsReceiptCid: "QmY9aX781b2c45e89d1234567890abcdef31x8",
    timestamp: "2026-08-22T10:35:12Z",
    timeAgo: "2h ago",
  },
  {
    id: "track-2",
    donorAddress: "0x334411ee8812c45e89d1234567890abcdef8812",
    donorLabel: "Community Contributor (0x3344...8812)",
    amountUSD: 4950.00,
    amountCrypto: "1.65 ETH",
    network: "sepolia",
    txHash: "0x55f981290384aa12309876123490871234fedcab1288c290184719283748291",
    disasterTitle: "South Asia Monsoon Flash Flood & Landslide Relief",
    disasterLocation: "Wayanad, Kerala, India",
    assignedNGO: "Indian Red Cross Society & Goonj",
    ngoRole: "Clean Hydration Desalination & Mobile Paramedics",
    aidCategory: "Clean Water Logistics & First Aid",
    impactSummary: "Provided 10,000 Liters of Mobile Clean Water Filtration + 65 Emergency Medical Ration Kits.",
    beneficiaryCount: 65,
    deliveryStatus: "100% Delivered & Verified",
    ipfsReceiptCid: "QmZ3398412984012e98712390481239840129384e",
    timestamp: "2026-08-22T08:15:30Z",
    timeAgo: "4h ago",
  },
  {
    id: "track-3",
    donorAddress: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    donorLabel: "Micro-Grant Aid Donor (0x7099...79C8)",
    amountUSD: 150.00,
    amountCrypto: "230.7 POL",
    network: "amoy",
    txHash: "0x8f119a2b8e34c990a012bcf45612349078abcedf1244bcda12349876543210fe",
    disasterTitle: "Typhoon Category 4 Coastal Surge Relief",
    disasterLocation: "Surigao del Norte, Philippines",
    assignedNGO: "Philippine Red Cross",
    ngoRole: "High-Energy Infant Nutrition & Ready-to-Eat Rations",
    aidCategory: "Food Rations & Infant Milk",
    impactSummary: "Delivered 14-day high-calorie emergency ration boxes to 2 isolated island families.",
    beneficiaryCount: 2,
    deliveryStatus: "100% Delivered & Verified",
    ipfsReceiptCid: "QmPRC3398412984012e98712390481239840129384e",
    timestamp: "2026-08-22T10:28:44Z",
    timeAgo: "8m ago",
  },
];

// ─── DISASTER AUDIT DATA ─────────────────────────────────────────────────────

const INITIAL_DISASTER_BLOCKS: DisasterAuditBlock[] = [
  {
    id: "turkey-syria-earthquake-2026",
    title: "Turkey-Syria 7.8M Tectonic Rupture Emergency Relief",
    category: "earthquake",
    categoryLabel: "Earthquake Emergency",
    location: "Kahramanmaraş, Gaziantep & Hatay, Turkey",
    coordinates: "37.174° N, 37.032° E • Depth: 17.9 km",
    severityLevel: "CRITICAL",
    severityScore: "9.4 / 10",
    magnitudeMetric: "7.8 Magnitude",
    timeAgo: "Active Field Triage • Live",
    telemetrySource: "USGS Station TUR-042 & EMSC Observatories",
    fullDescription: [
      "Official USGS & EMSC seismology observatories recorded a massive 7.8 magnitude tectonic rupture along the East Anatolian Fault line.",
      "Extreme sub-zero winter temperatures have intensified exposure risks for displaced families. The Pulse Smart Vault autonomously triggered liquidity within 3 minutes.",
      "Certified NGO frontline units are actively distributing zero-knowledge cryptographic vouchers for heated emergency shelter and rapid medical triage."
    ],
    totalAllocatedUSD: 684200,
    targetUSD: 1000000,
    disbursedUSD: 540000,
    reserveUSD: 144200,
    verifiedBeneficiariesCount: 8420,
    zkClaimsRedeemedCount: 5420,
    vaultAddresses: {
      sepolia: "0x3A9F112bC4782019b8830114a82173B19f20cA7",
      amoy: "0x7E1209a88201198302bfca99014c09A18D3b584",
    },
    merkleRoot: "0x98f2a1b9487c91e847192837491829384719283749182344bcda123498765432",
    ipfsManifestCid: "QmZ11902bcda44188c2901847192837482910c",
    activeNGOs: [
      {
        id: "ngo-kizilay",
        name: "Turkish Red Crescent (Türk Kızılay)",
        logoSrc: "/logos/red-crescent.svg",
        verifiedOnChain: true,
        role: "Ground Logistics, Heated Tents & Mobile Kitchens",
        fieldZone: "Kahramanmaraş Base & Antakya Sector 4",
        walletAddress: "0x7F23190bA8812c45e89d1234567890abcdefB39a",
        fundsDisbursedUSD: 280000,
        fundsDisbursedCrypto: "93.3 ETH ($280,000)",
        beneficiariesServed: 4620,
        status: "Active Field Deployment",
        auditProofCid: "QmY9aX781b2c45e89d1234567890abcdef31x8",
        latestDeliveryProof: "1,200 Thermal Tent Kits verified via Merkle Leaf #0x82a",
        focalContact: "Dr. M. Eren (AFAD/Kızılay Taskforce)"
      },
      {
        id: "ngo-un-ocha-syria",
        name: "UN OCHA Emergency Relief",
        logoSrc: "/logos/un-ocha.svg",
        verifiedOnChain: true,
        role: "Cross-Border Medical Aid & Water Logistics",
        fieldZone: "Bab al-Hawa Border & Idlib Medical Corridor",
        walletAddress: "0x334411ee8812c45e89d1234567890abcdef8812",
        fundsDisbursedUSD: 160000,
        fundsDisbursedCrypto: "246,153 POL ($160,000)",
        beneficiariesServed: 2450,
        status: "Aid Disbursing",
        auditProofCid: "QmK992182938471928374918293847192837491823",
        latestDeliveryProof: "45 Mobile Dialysis Units cleared via Bab al-Hawa",
        focalContact: "S. Al-Hassan (UN OCHA Lead)"
      },
      {
        id: "ngo-ahbap-relief",
        name: "Ahbap Humanitarian Network",
        logoSrc: "/logos/red-cross.svg",
        verifiedOnChain: true,
        role: "Direct Family Emergency Cash & Shelter Units",
        fieldZone: "Gaziantep & Nurdağı Rural Villages",
        walletAddress: "0x90214c0988771234567890abcdef1234567890ab",
        fundsDisbursedUSD: 100000,
        fundsDisbursedCrypto: "33.3 ETH ($100,000)",
        beneficiariesServed: 1350,
        status: "Active Field Deployment",
        auditProofCid: "QmA4412984012e98712390481239840129384e",
        latestDeliveryProof: "380 Insulated Living Containers dispatched to Nurdağı",
        focalContact: "H. Levent (Ahbap Triage)"
      }
    ],
    recentDisasterTxs: [
      {
        id: "tx-turk-1",
        txHash: "0x83a19b22e11a98071e44bcda12349876543210fedcba9901847192837482910c",
        network: "sepolia",
        blockNumber: 5938110,
        beneficiaryAddress: "0x7F23190bA8812c45e89d1234567890abcdefB39a",
        amountUSD: 2460.00,
        amountCrypto: "0.82 ETH",
        category: "Emergency Shelter",
        timestamp: "2026-08-22T10:35:12Z",
        timeAgo: "2h ago",
        ipfsReceipt: "QmY9aX781b2c45e89d1234567890abcdef31x8"
      },
      {
        id: "tx-turk-2",
        txHash: "0x8f119a2b8e34c990a012bcf45612349078abcedf1244bcda12349876543210fe",
        network: "amoy",
        blockNumber: 8421905,
        beneficiaryAddress: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        amountUSD: 150.00,
        amountCrypto: "230.7 POL",
        category: "Medical Care",
        timestamp: "2026-08-22T10:28:44Z",
        timeAgo: "8m ago",
        ipfsReceipt: "QmY9aX781b2c45e89d1234567890abcdef31x8"
      }
    ]
  },
  {
    id: "kerala-wayanad-flood-2026",
    title: "South Asia Monsoon Flash Flood & Landslide Relief",
    category: "flood",
    categoryLabel: "Flood & Landslide",
    location: "Wayanad & Meppadi, Kerala, India",
    coordinates: "11.605° N, 76.083° E • Water Level: +4.2m",
    severityLevel: "HIGH",
    severityScore: "8.1 / 10",
    magnitudeMetric: "Monsoon Surge (+4.2m)",
    timeAgo: "Active Field Triage • Live",
    telemetrySource: "Central Water Commission IND-09 & IMD Doppler",
    fullDescription: [
      "Torrential monsoon downpours triggered catastrophic multi-tier landslides across hillside hamlets in Wayanad.",
      "Partner NGOs and disaster teams have deployed boat rescue teams, high-capacity mobile water purification units, and zero-knowledge food aid vouchers."
    ],
    totalAllocatedUSD: 342100,
    targetUSD: 500000,
    disbursedUSD: 280000,
    reserveUSD: 62100,
    verifiedBeneficiariesCount: 4180,
    zkClaimsRedeemedCount: 3120,
    vaultAddresses: {
      sepolia: "0x11B933aA88201198302bfca99014c09A18D3b584",
      amoy: "0x98D209a88201198302bfca99014c09A18D31a33",
    },
    merkleRoot: "0x44ab771920384719283749182938471928374918293847192837491829384719",
    ipfsManifestCid: "QmZ3398412984012e98712390481239840129384e",
    activeNGOs: [
      {
        id: "ngo-indian-red-cross",
        name: "Indian Red Cross Society",
        logoSrc: "/logos/red-cross.svg",
        verifiedOnChain: true,
        role: "Evacuation, Paramedic Triage & Water Purification",
        fieldZone: "Meppadi Rescue Camp & Chooralmala",
        walletAddress: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
        fundsDisbursedUSD: 160000,
        fundsDisbursedCrypto: "53.3 ETH ($160,000)",
        beneficiariesServed: 2420,
        status: "Active Field Deployment",
        auditProofCid: "QmZ11902bcda44188c2901847192837482910c",
        latestDeliveryProof: "5,000 L/Hr Mobile Water Filtration deployed",
        focalContact: "R. Nair (IRCS Kerala Division)"
      },
      {
        id: "ngo-goonj-relief",
        name: "Goonj Disaster Relief",
        logoSrc: "/logos/red-cross.svg",
        verifiedOnChain: true,
        role: "Family Ration Kits, Hygiene Packs & Clothing",
        fieldZone: "Vythiri & Mananthavady Hubs",
        walletAddress: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
        fundsDisbursedUSD: 120000,
        fundsDisbursedCrypto: "184,615 POL ($120,000)",
        beneficiariesServed: 1760,
        status: "Aid Disbursing",
        auditProofCid: "QmX8a77192038471928374918293847192837491823",
        latestDeliveryProof: "1,760 Family Dignity & Ration Kits distributed",
        focalContact: "A. Gupta (Goonj Rahat)"
      }
    ],
    recentDisasterTxs: [
      {
        id: "tx-ker-1",
        txHash: "0x3c2244bb11a98071e44bcda12349876543210fedcba88c290184719283748291",
        network: "sepolia",
        blockNumber: 5938060,
        beneficiaryAddress: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
        amountUSD: 1320.00,
        amountCrypto: "0.44 ETH",
        category: "Food Rations",
        timestamp: "2026-08-22T06:30:00Z",
        timeAgo: "4h ago",
        ipfsReceipt: "QmZ11902bcda44188c2901847192837482910c"
      }
    ]
  },
  {
    id: "japan-honshu-earthquake-2026",
    title: "Honshu Coast Seismic Displacement Relief",
    category: "earthquake",
    categoryLabel: "Offshore Earthquake",
    location: "Off Coast of Honshu & Chiba, Japan",
    coordinates: "34.982° N, 139.845° E • Depth: 32.4 km",
    severityLevel: "HIGH",
    severityScore: "7.6 / 10",
    magnitudeMetric: "6.4 Magnitude",
    timeAgo: "Active Monitoring • Live",
    telemetrySource: "JMA Seismograph Network & USGS",
    fullDescription: [
      "A 6.4 magnitude earthquake shook coastal Chiba and Greater Tokyo.",
      "The Japanese Red Cross Society and Peace Winds Japan deployed emergency auxiliary power generators and geriatric welfare supplies."
    ],
    totalAllocatedUSD: 290000,
    targetUSD: 400000,
    disbursedUSD: 185000,
    reserveUSD: 105000,
    verifiedBeneficiariesCount: 2310,
    zkClaimsRedeemedCount: 1890,
    vaultAddresses: {
      sepolia: "0x88F112bC4782019b8830114a82173B19f20cA7",
      amoy: "0x22A109a88201198302bfca99014c09A18D3b584",
    },
    merkleRoot: "0x77ee1290384729183749281729384719283749182344bcda12349876543210fe",
    ipfsManifestCid: "QmJRC8812984012e98712390481239840129384e",
    activeNGOs: [
      {
        id: "ngo-jrc-japan",
        name: "Japanese Red Cross Society",
        logoSrc: "/logos/jrc-japan.svg",
        verifiedOnChain: true,
        role: "Geriatric Welfare Care, Generators & Medical Kits",
        fieldZone: "Chiba Southern Command & Tateyama",
        walletAddress: "0x44aa11ee8812c45e89d1234567890abcdef9911",
        fundsDisbursedUSD: 120000,
        fundsDisbursedCrypto: "40.0 ETH ($120,000)",
        beneficiariesServed: 1540,
        status: "Active Field Deployment",
        auditProofCid: "QmJRC8812984012e98712390481239840129384e",
        latestDeliveryProof: "24 Mobile Generator Sets & 1,500 Care Bundles deployed",
        focalContact: "K. Takahashi (JRC Tokyo HQ)"
      },
      {
        id: "ngo-peace-winds",
        name: "Peace Winds Japan",
        logoSrc: "/logos/red-cross.svg",
        verifiedOnChain: true,
        role: "Search & Rescue Teams, Satellite Comms Trailers",
        fieldZone: "Minamiboso Coastal Villages",
        walletAddress: "0x66bb22ee8812c45e89d1234567890abcdef2233",
        fundsDisbursedUSD: 65000,
        fundsDisbursedCrypto: "100,000 POL ($65,000)",
        beneficiariesServed: 770,
        status: "Logistics Hub",
        auditProofCid: "QmPWJ4412984012e98712390481239840129384e",
        latestDeliveryProof: "Starlink Mobile Terminals & Emergency Medical Comms",
        focalContact: "Y. Onishi (ARROWS Unit)"
      }
    ],
    recentDisasterTxs: [
      {
        id: "tx-jap-1",
        txHash: "0x1d4499aa77e98123bcdef09876543210fedcba876544bcda12349876543210",
        network: "amoy",
        blockNumber: 8421890,
        beneficiaryAddress: "0x90214c0988771234567890abcdef1234567890ab",
        amountUSD: 1850.00,
        amountCrypto: "2,846.1 POL",
        category: "Emergency Shelter",
        timestamp: "2026-08-22T09:55:20Z",
        timeAgo: "42m ago",
        ipfsReceipt: "QmA4412984012e98712390481239840129384e"
      }
    ]
  },
  {
    id: "philippines-mindanao-typhoon-2026",
    title: "Typhoon Category 4 Coastal Surge Relief",
    category: "storm",
    categoryLabel: "Typhoon / Cyclone",
    location: "Surigao del Norte & Siargao, Philippines",
    coordinates: "9.791° N, 125.495° E • Winds: 215 km/h",
    severityLevel: "CRITICAL",
    severityScore: "8.9 / 10",
    magnitudeMetric: "Cat 4 Super Typhoon",
    timeAgo: "Active Field Operations • Live",
    telemetrySource: "PAGASA & NASA Earth Observatory",
    fullDescription: [
      "Super Typhoon tore through coastal island communities with sustained 215 km/h gusts.",
      "Philippine Red Cross and UN WFP mobilized emergency shelter tarpaulins and high-energy rations."
    ],
    totalAllocatedUSD: 240000,
    targetUSD: 350000,
    disbursedUSD: 155000,
    reserveUSD: 85000,
    verifiedBeneficiariesCount: 3100,
    zkClaimsRedeemedCount: 2200,
    vaultAddresses: {
      sepolia: "0x55E933aA88201198302bfca99014c09A18D3b584",
      amoy: "0x77F209a88201198302bfca99014c09A18D31a33",
    },
    merkleRoot: "0x33bb771920384719283749182938471928374918293847192837491829384719",
    ipfsManifestCid: "QmPRC3398412984012e98712390481239840129384e",
    activeNGOs: [
      {
        id: "ngo-ph-red-cross",
        name: "Philippine Red Cross",
        logoSrc: "/logos/philippine-red-cross.svg",
        verifiedOnChain: true,
        role: "Search & Rescue, Tarpaulin Roofing & Emergency Rations",
        fieldZone: "Siargao Port & Dinagat Islands",
        walletAddress: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        fundsDisbursedUSD: 110000,
        fundsDisbursedCrypto: "36.6 ETH ($110,000)",
        beneficiariesServed: 2150,
        status: "Active Field Deployment",
        auditProofCid: "QmPRC3398412984012e98712390481239840129384e",
        latestDeliveryProof: "850 Tarpaulin Kits & 2,000 Ready-to-Eat Food Packs",
        focalContact: "M. Santos (PRC Surigao Chapter)"
      },
      {
        id: "ngo-un-wfp",
        name: "UN World Food Programme",
        logoSrc: "/logos/un-ocha.svg",
        verifiedOnChain: true,
        role: "Emergency Telecommunications & Helicopter Logistics",
        fieldZone: "Surigao City Staging Ground",
        walletAddress: "0x123411ee8812c45e89d1234567890abcdef4455",
        fundsDisbursedUSD: 45000,
        fundsDisbursedCrypto: "69,230 POL ($45,000)",
        beneficiariesServed: 950,
        status: "Logistics Hub",
        auditProofCid: "QmWFP9912984012e98712390481239840129384e",
        latestDeliveryProof: "Airbridge flight completed 6 tons of high-energy biscuits",
        focalContact: "J. Dela Cruz (WFP Logistics)"
      }
    ],
    recentDisasterTxs: [
      {
        id: "tx-ph-1",
        txHash: "0x8f119a2b8e34c990a012bcf45612349078abcedf1244bcda12349876543210fe",
        network: "amoy",
        blockNumber: 8421905,
        beneficiaryAddress: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        amountUSD: 150.00,
        amountCrypto: "230.7 POL",
        category: "Food Rations",
        timestamp: "2026-08-22T10:28:44Z",
        timeAgo: "8m ago",
        ipfsReceipt: "QmPRC3398412984012e98712390481239840129384e"
      }
    ]
  }
];

function AuditContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || searchParams.get("tx") || "";
  const initialNetwork = searchParams.get("network") || "all";

  const { address: connectedAddress } = useWallet();

  // Data & sync state
  const [storedEvents, setStoredEvents] = useState<AuditEvent[]>([]);
  const [, setStoredRoots] = useState<CommittedRootRecord[]>([]);
  const [storedVouchers, setStoredVouchers] = useState<VoucherBatchRecord[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Active Disasters State
  const [disasterBlocks] = useState<DisasterAuditBlock[]>(INITIAL_DISASTER_BLOCKS);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<string, boolean>>({});
  const [expandedTechDetails, setExpandedTechDetails] = useState<Record<string, boolean>>({});

  // Donor Tracking Top State
  const [selectedDonorTrack, setSelectedDonorTrack] = useState<DonorTrackRecord>(SAMPLE_DONOR_TRACKS[0]);
  const [customTrackInput, setCustomTrackInput] = useState<string>("");
  const [trackingError, setTrackingError] = useState<string | null>(null);

  // UI Tabs: "sankey" vs "disasters" vs "ledger"
  const [activeViewTab, setActiveViewTab] = useState<"sankey" | "disasters" | "ledger">("sankey");

  // Filters & search
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [selectedNetwork, setSelectedNetwork] = useState<string>(initialNetwork);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedEventType, setSelectedEventType] = useState<string>("all");

  // Drawers & Modals
  const [selectedTx, setSelectedTx] = useState<AuditEvent | null>(null);
  const [selectedNgoModal, setSelectedNgoModal] = useState<{ ngo: ActiveNGO; disasterTitle: string } | null>(null);
  const [selectedProofModal, setSelectedProofModal] = useState<{
    title: string;
    cid: string;
    root?: string;
    details: Record<string, any>;
  } | null>(null);

  // IPFS Photo Delivery Modal State
  const [ipfsPhotoModal, setIpfsPhotoModal] = useState<{
    isOpen: boolean;
    cid: string;
    title: string;
    disasterLocation?: string;
    ngoName?: string;
  }>({
    isOpen: false,
    cid: "",
    title: "",
  });

  const reloadData = useCallback(() => {
    const events = getStoredAuditEvents();
    const roots = getStoredCommittedRoots();
    const vouchers = getStoredVoucherBatches();
    setStoredEvents(events);
    setStoredRoots(roots);
    setStoredVouchers(vouchers);
  }, []);

  useEffect(() => {
    reloadData();
    const handleSync = () => reloadData();
    window.addEventListener("pulse:audit_sync", handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener("pulse:audit_sync", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, [reloadData]);

  const allEvents = useMemo(() => {
    return [...storedEvents, ...SEED_AUDIT_EVENTS];
  }, [storedEvents]);

  // If user connects wallet, check if there's a matching donation
  useEffect(() => {
    if (connectedAddress) {
      const match = SAMPLE_DONOR_TRACKS.find(
        (t) => t.donorAddress.toLowerCase() === connectedAddress.toLowerCase()
      );
      if (match) {
        setSelectedDonorTrack(match);
      }
    }
  }, [connectedAddress]);

  const handleTrackSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setTrackingError(null);
    const q = customTrackInput.trim().toLowerCase();
    if (!q) return;

    // Check sample tracks
    const match = SAMPLE_DONOR_TRACKS.find(
      (t) =>
        t.donorAddress.toLowerCase().includes(q) ||
        t.txHash.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q)
    );

    if (match) {
      setSelectedDonorTrack(match);
      return;
    }

    // Check stored or seed events
    const evtMatch = allEvents.find(
      (evt) =>
        evt.txHash.toLowerCase().includes(q) ||
        evt.fromAddress.toLowerCase().includes(q) ||
        (evt.beneficiaryAddress && evt.beneficiaryAddress.toLowerCase().includes(q))
    );

    if (evtMatch) {
      setSelectedDonorTrack({
        id: `track-found-${evtMatch.id}`,
        donorAddress: evtMatch.fromAddress,
        donorLabel: `Verified On-Chain Donor (${formatAddress(evtMatch.fromAddress)})`,
        amountUSD: evtMatch.amountUSD || 150,
        amountCrypto: evtMatch.amountCrypto || "0.05 ETH",
        network: evtMatch.network,
        txHash: evtMatch.txHash,
        disasterTitle: "Emergency Relief Vault Deployment",
        disasterLocation: "Verified Disaster Zone",
        assignedNGO: "Accredited Humanitarian Partner",
        ngoRole: "Ground Logistics & Direct Aid Disbursement",
        aidCategory: evtMatch.category || "Emergency Relief Assistance",
        impactSummary: `100% of $${(evtMatch.amountUSD || 150).toFixed(2)} deployed directly with zero middleman deductions.`,
        beneficiaryCount: 1,
        deliveryStatus: "100% Delivered & Verified",
        ipfsReceiptCid: evtMatch.ipfsCid || "QmY9aX781b2c45e89d1234567890abcdef31x8",
        timestamp: evtMatch.timestamp,
        timeAgo: evtMatch.timeAgo,
      });
      return;
    }

    setTrackingError("No on-chain transaction matching that address or tx hash was found. Try clicking one of the demo donations below.");
  };

  // Filtered Events for Ledger Table
  const filteredEvents = useMemo(() => {
    return allEvents.filter((evt) => {
      const matchesNetwork = selectedNetwork === "all" || evt.network === selectedNetwork;
      const matchesType = selectedEventType === "all" || evt.eventType === selectedEventType;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = q === "" ||
        evt.txHash.toLowerCase().includes(q) ||
        evt.fromAddress.toLowerCase().includes(q) ||
        (evt.beneficiaryAddress && evt.beneficiaryAddress.toLowerCase().includes(q)) ||
        evt.eventName.toLowerCase().includes(q);

      return matchesNetwork && matchesType && matchesSearch;
    });
  }, [allEvents, selectedNetwork, selectedEventType, searchQuery]);

  // Filtered Disaster Blocks
  const filteredDisasterBlocks = useMemo(() => {
    return disasterBlocks.filter((block) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesCategory = selectedCategory === "all" || block.category === selectedCategory;
      const matchesSearch = q === "" ||
        block.title.toLowerCase().includes(q) ||
        block.location.toLowerCase().includes(q) ||
        block.activeNGOs.some((ngo) => ngo.name.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [disasterBlocks, selectedCategory, searchQuery]);

  // Protocol-wide Metrics
  const metrics = useMemo(() => {
    const sepoliaDonationsUSD = 428700.00;
    const amoyDonationsUSD = 597600.00;
    const additionalClaimsUSD = storedEvents.reduce((acc, e) => acc + (e.eventType === "disbursement" ? e.amountUSD : 0), 0);

    const totalDonatedUSD = sepoliaDonationsUSD + amoyDonationsUSD;
    const totalDistributedUSD = 540000.00 + additionalClaimsUSD;
    const remainingPoolUSD = Math.max(0, totalDonatedUSD - totalDistributedUSD);
    const verifiedBeneficiariesCount = 12600 + storedEvents.filter(e => e.eventType === "disbursement").length + (storedVouchers.reduce((acc, v) => acc + v.count, 0));
    const totalActiveNGOsCount = disasterBlocks.reduce((acc, d) => acc + d.activeNGOs.length, 0);

    return {
      totalDonatedUSD,
      totalDistributedUSD,
      remainingPoolUSD,
      verifiedBeneficiariesCount,
      totalActiveNGOsCount,
    };
  }, [storedEvents, storedVouchers, disasterBlocks]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const toggleDescription = (id: string) => {
    setExpandedDescriptions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleTechDetails = (id: string) => {
    setExpandedTechDetails((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleOpenIpfsPhoto = (cid: string, title: string, location?: string, ngo?: string) => {
    setIpfsPhotoModal({
      isOpen: true,
      cid,
      title,
      disasterLocation: location,
      ngoName: ngo,
    });
  };

  const handleExportAuditReport = () => {
    const report = {
      protocol: "PULSE Protocol — Transparent Emergency Aid & Field NGO Ledger",
      version: "2.2.0",
      exportTimestamp: new Date().toISOString(),
      verifiedMetrics: metrics,
      donorTrackingExample: selectedDonorTrack,
      disasterReliefZones: disasterBlocks,
      onChainTransactions: filteredEvents,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `PULSE_Transparency_Report_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full bg-[#FAFAFA] text-[#0F172A] min-h-screen py-8 px-4 md:px-8 font-sans">
      <div className="max-w-[1240px] mx-auto space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link 
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#64748B] hover:text-[#0F172A] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Command Center</span>
            <span className="text-[#CBD5E1]">/</span>
            <span className="text-[#2563EB] font-semibold">Live Transparency & Audit</span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E2E8F0] text-xs font-mono shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[#64748B]">100% On-Chain Verifiable</span>
            </div>
            {storedEvents.length > 0 && (
              <button
                onClick={() => {
                  clearAllAuditCache();
                  reloadData();
                }}
                className="px-3 py-1 rounded-full bg-white hover:bg-rose-50 border border-[#E2E8F0] hover:border-rose-200 text-xs font-mono text-[#64748B] hover:text-rose-700 transition-colors flex items-center gap-1"
                aria-label="Reset test events"
              >
                <Trash2 className="w-3 h-3" />
                <span>Reset Local Tests ({storedEvents.length})</span>
              </button>
            )}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════════
            🌟 TOP HERO SECTION: DONOR TRANSPARENCY & FUND JOURNEY TRACKER
        ══════════════════════════════════════════════════════════════════════════ */}
        <section className="rounded-3xl bg-gradient-to-b from-[#1E293B] to-[#0F172A] text-white p-6 md:p-8 shadow-xl relative overflow-hidden space-y-6">
          
          {/* Background Decorative Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#2563EB]/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#2563EB]/30 border border-[#2563EB]/50 text-blue-300 text-xs font-mono font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  FULL DONOR TRANSPARENCY
                </span>
                <span className="text-slate-400 text-xs">•</span>
                <span className="text-slate-300 text-xs font-mono">0% Intermediary Cuts</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                Track Where Every Cent of Your Donation Goes
              </h1>
              <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                See the exact lifecycle of your donated funds: from your crypto transaction into the smart vault, assigned to an on-ground NGO, and delivered to verified disaster victims with photographic IPFS proof.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleExportAuditReport}
                className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all flex items-center gap-2 shadow-xs"
              >
                <Download className="w-4 h-4 text-blue-400" />
                <span>Export Audit Proof</span>
              </button>
            </div>
          </div>

          {/* Donor Search / Select Bar */}
          <div className="space-y-3 relative z-10">
            <form onSubmit={handleTrackSearch} className="flex flex-col sm:flex-row gap-2 max-w-2xl">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Enter your wallet address (0x...) or transaction hash..."
                  value={customTrackInput}
                  onChange={(e) => setCustomTrackInput(e.target.value)}
                  className="w-full bg-slate-800/90 border border-slate-700 focus:border-blue-500 text-white text-xs font-mono pl-10 pr-3 py-2.5 rounded-xl focus:outline-none placeholder:text-slate-400"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-sm shrink-0"
              >
                <Wallet className="w-3.5 h-3.5" />
                <span>Track Donation</span>
              </button>
            </form>

            {trackingError && (
              <p className="text-xs text-rose-400 font-mono">{trackingError}</p>
            )}

            {/* Quick Demo Donor Selectors */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 text-xs">Quick Demo Donors:</span>
              {SAMPLE_DONOR_TRACKS.map((track) => (
                <button
                  key={track.id}
                  onClick={() => {
                    setSelectedDonorTrack(track);
                    setCustomTrackInput("");
                    setTrackingError(null);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-mono transition-all flex items-center gap-1.5 ${
                    selectedDonorTrack.id === track.id
                      ? "bg-blue-600 text-white font-bold shadow-xs border border-blue-400"
                      : "bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700"
                  }`}
                >
                  <span>{track.amountCrypto}</span>
                  <span className="text-slate-400">({formatCurrencyUSD(track.amountUSD)})</span>
                </button>
              ))}
            </div>
          </div>

          {/* ACTIVE DONATION JOURNEY CARD */}
          {selectedDonorTrack && (
            <div className="bg-slate-900/90 rounded-2xl border border-slate-700/80 p-5 md:p-6 space-y-5 relative z-10">
              
              {/* Header inside card */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div className="space-y-0.5">
                  <div className="text-xs font-mono text-slate-400">VERIFIED DONATION RECEIPT</div>
                  <div className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                    <span>{selectedDonorTrack.amountCrypto}</span>
                    <span className="text-emerald-400 font-mono text-base font-semibold">({formatCurrencyUSD(selectedDonorTrack.amountUSD)})</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-medium ml-1">
                      {selectedDonorTrack.deliveryStatus}
                    </span>
                  </div>
                </div>

                <div className="text-xs font-mono text-right">
                  <div className="text-slate-400">DONOR ADDRESS</div>
                  <div className="text-blue-300 font-semibold flex items-center gap-1 justify-end">
                    <span>{formatAddress(selectedDonorTrack.donorAddress)}</span>
                    <button
                      onClick={() => handleCopy(selectedDonorTrack.donorAddress, "donor-addr")}
                      className="text-slate-400 hover:text-white"
                      aria-label="Copy Address"
                    >
                      {copiedKey === "donor-addr" ? "✓" : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* The 4-Step Transparent Flow */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Step 1 */}
                <div className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700/60 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-blue-400 font-semibold">
                    <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center text-[10px]">1</span>
                    <span>VAULT DEPOSIT</span>
                  </div>
                  <div className="text-xs font-semibold text-white">{selectedDonorTrack.disasterTitle}</div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                    <span>{selectedDonorTrack.disasterLocation}</span>
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono pt-1">
                    ✓ 100% Allocated (0% Fee)
                  </div>
                </div>

                {/* Step 2 */}
                <div className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700/60 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-blue-400 font-semibold">
                    <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center text-[10px]">2</span>
                    <span>FIELD NGO PARTNER</span>
                  </div>
                  <div className="text-xs font-semibold text-white">{selectedDonorTrack.assignedNGO}</div>
                  <div className="text-[11px] text-slate-400 leading-snug">{selectedDonorTrack.ngoRole}</div>
                  <div className="text-[10px] text-blue-300 font-mono pt-1">
                    ✓ Multisig Authorized
                  </div>
                </div>

                {/* Step 3 */}
                <div className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700/60 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-blue-400 font-semibold">
                    <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center text-[10px]">3</span>
                    <span>AID PURCHASED</span>
                  </div>
                  <div className="text-xs font-semibold text-white">{selectedDonorTrack.aidCategory}</div>
                  <div className="text-[11px] text-slate-300 leading-snug">{selectedDonorTrack.impactSummary}</div>
                  <div className="text-[10px] text-emerald-400 font-mono pt-1">
                    ✓ {selectedDonorTrack.beneficiaryCount} Displaced Families Reached
                  </div>
                </div>

                {/* Step 4 */}
                <div className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700/60 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-blue-400 font-semibold">
                    <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center text-[10px]">4</span>
                    <span>PROOF OF DELIVERY</span>
                  </div>
                  <div className="text-xs font-semibold text-white">Cryptographic IPFS Photo</div>
                  <button
                    onClick={() => handleOpenIpfsPhoto(
                      selectedDonorTrack.ipfsReceiptCid,
                      selectedDonorTrack.disasterTitle,
                      selectedDonorTrack.disasterLocation,
                      selectedDonorTrack.assignedNGO
                    )}
                    className="text-[11px] text-purple-300 hover:text-white hover:underline flex items-center gap-1 font-mono break-all text-left cursor-pointer"
                  >
                    <Camera className="w-3 h-3 text-purple-400 shrink-0" />
                    <span>{formatAddress(selectedDonorTrack.ipfsReceiptCid, 8, 6)}</span>
                  </button>
                  <div className="text-[10px] text-emerald-400 font-mono pt-1">
                    ✓ ZK-Verified Voucher Claimed
                  </div>
                </div>

              </div>

              {/* On-Chain Confirmation Hash Footer */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="text-slate-500">TX HASH:</span>
                  <span className="text-white font-semibold">{formatAddress(selectedDonorTrack.txHash, 10, 8)}</span>
                  <a
                    href={getExplorerTxUrl(selectedDonorTrack.network, selectedDonorTrack.txHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline flex items-center gap-1 ml-1"
                  >
                    <span>View on {selectedDonorTrack.network === "sepolia" ? "Etherscan" : "Polygonscan"}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="text-slate-400 text-[11px]">
                  Confirmed {selectedDonorTrack.timeAgo} • Chain: <span className="text-white font-bold capitalize">{selectedDonorTrack.network}</span>
                </div>
              </div>

            </div>
          )}

        </section>

        {/* ══════════════════════════════════════════════════════════════════════════
            GLOBAL METRICS SUMMARY
        ══════════════════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs">
            <div className="text-xs font-semibold text-[#64748B] uppercase">Total Donated</div>
            <div className="text-xl font-bold font-mono text-[#0F172A] mt-0.5">
              {formatCurrencyUSD(metrics.totalDonatedUSD)}
            </div>
            <div className="text-[11px] text-[#94A3B8] font-mono mt-0.5">Ethereum + Polygon</div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs">
            <div className="text-xs font-semibold text-[#64748B] uppercase">Aid Disbursed</div>
            <div className="text-xl font-bold font-mono text-emerald-600 mt-0.5">
              {formatCurrencyUSD(metrics.totalDistributedUSD)}
            </div>
            <div className="text-[11px] text-emerald-600/80 font-mono mt-0.5">100% Delivered with Proofs</div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs">
            <div className="text-xs font-semibold text-[#64748B] uppercase">Active Field NGOs</div>
            <div className="text-xl font-bold font-mono text-[#0F172A] mt-0.5">
              {metrics.totalActiveNGOsCount} Organizations
            </div>
            <div className="text-[11px] text-[#94A3B8] font-mono mt-0.5">Multisig Vetted</div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs">
            <div className="text-xs font-semibold text-[#64748B] uppercase">Verified Beneficiaries</div>
            <div className="text-xl font-bold font-mono text-[#2563EB] mt-0.5">
              {metrics.verifiedBeneficiariesCount.toLocaleString()} Families
            </div>
            <div className="text-[11px] text-[#94A3B8] font-mono mt-0.5">ZK Identity Protected</div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════════
            VIEW TABS & SEARCH
        ══════════════════════════════════════════════════════════════════════════ */}
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* View Selector Tabs (Sankey, Disasters, Ledger) */}
            <div className="flex flex-wrap items-center p-1 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs">
              <button
                onClick={() => setActiveViewTab("sankey")}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                  activeViewTab === "sankey"
                    ? "bg-[#2563EB] text-white shadow-xs"
                    : "text-[#64748B] hover:text-[#0F172A]"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Visual Sankey Fund Flow (Interactive)</span>
              </button>

              <button
                onClick={() => setActiveViewTab("disasters")}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                  activeViewTab === "disasters"
                    ? "bg-[#2563EB] text-white shadow-xs"
                    : "text-[#64748B] hover:text-[#0F172A]"
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Disaster Relief Zones & NGOs ({filteredDisasterBlocks.length})</span>
              </button>

              <button
                onClick={() => setActiveViewTab("ledger")}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                  activeViewTab === "ledger"
                    ? "bg-[#2563EB] text-white shadow-xs"
                    : "text-[#64748B] hover:text-[#0F172A]"
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>On-Chain Event Ledger ({filteredEvents.length})</span>
              </button>
            </div>

            {/* Filter Search */}
            <div className="relative w-full lg:w-72">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search disaster, NGO or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#E2E8F0] focus:border-[#2563EB] text-[#0F172A] text-xs pl-10 pr-3 py-2.5 rounded-full focus:outline-none placeholder:text-[#94A3B8] transition-colors shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-2.5 text-[#94A3B8] hover:text-[#0F172A]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Sub-Filters (for Disaster view) */}
          {activeViewTab === "disasters" && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[#64748B]">Category:</span>
              {[
                { id: "all", label: "All Disasters" },
                { id: "earthquake", label: "Earthquakes" },
                { id: "flood", label: "Floods" },
                { id: "storm", label: "Typhoons & Storms" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-3 py-1 rounded-full transition-all ${
                    selectedCategory === tab.id
                      ? "bg-[#0F172A] text-white font-semibold"
                      : "bg-white text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ══════════════════════════════════════════════════════════════════════════
            TAB 1: INTERACTIVE SANKEY FUND FLOW (Innovation 6 in Masterplan)
        ══════════════════════════════════════════════════════════════════════════ */}
        {activeViewTab === "sankey" && (
          <div className="space-y-6">
            <SankeyFlowDiagram
              onOpenIpfs={(cid, title) => handleOpenIpfsPhoto(cid, title)}
            />
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════════
            TAB 2: DISASTER RELIEF ZONES & ACTIVE FIELD NGOS
        ══════════════════════════════════════════════════════════════════════════ */}
        {activeViewTab === "disasters" && (
          <div className="space-y-6">
            {filteredDisasterBlocks.map((disaster) => {
              const isDescExpanded = !!expandedDescriptions[disaster.id];
              const isTechExpanded = !!expandedTechDetails[disaster.id];
              const pctDisbursed = Math.min(100, Math.round((disaster.disbursedUSD / disaster.targetUSD) * 100));

              return (
                <div
                  key={disaster.id}
                  className="rounded-3xl bg-white border border-[#E2E8F0] shadow-sm hover:border-[#CBD5E1] transition-all overflow-hidden space-y-5 p-6 md:p-7"
                >
                  {/* Top Header: Title, Category & Location */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full font-mono text-[11px] font-semibold border ${
                          disaster.severityLevel === "CRITICAL"
                            ? "bg-rose-50 border-rose-200 text-rose-700"
                            : "bg-amber-50 border-amber-200 text-amber-700"
                        }`}>
                          {disaster.categoryLabel}
                        </span>
                        <span className="text-[#CBD5E1]">•</span>
                        <span className="text-xs text-[#64748B] font-mono">{disaster.telemetrySource}</span>
                      </div>

                      <span className="text-xs font-mono text-[#64748B]">{disaster.timeAgo}</span>
                    </div>

                    <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#0F172A]">
                      {disaster.title}
                    </h2>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#475569]">
                      <span className="flex items-center gap-1 font-semibold text-[#0F172A]">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                        {disaster.location}
                      </span>
                      <span className="text-[#CBD5E1]">|</span>
                      <span className="text-[#64748B] font-mono">{disaster.coordinates}</span>
                      <span className="text-[#CBD5E1]">|</span>
                      <span className="text-[#2563EB] font-mono font-semibold">{disaster.magnitudeMetric}</span>
                    </div>
                  </div>

                  {/* Situation Summary (Clean & Readable) */}
                  <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs sm:text-sm text-[#475569] leading-relaxed space-y-2">
                    {isDescExpanded ? (
                      disaster.fullDescription.map((para, pIdx) => (
                        <p key={pIdx}>{para}</p>
                      ))
                    ) : (
                      <p>{disaster.fullDescription[0]}</p>
                    )}

                    {disaster.fullDescription.length > 1 && (
                      <button
                        onClick={() => toggleDescription(disaster.id)}
                        className="text-xs font-semibold text-[#2563EB] hover:text-blue-700 flex items-center gap-1 pt-1 cursor-pointer"
                      >
                        <span>{isDescExpanded ? "Show Less" : "Read Full Situation Brief"}</span>
                        {isDescExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>

                  {/* Clean Liquidity Bar */}
                  <div className="space-y-2 p-4 rounded-2xl bg-white border border-[#E2E8F0]">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                      <div>
                        <span className="text-[#64748B]">AID DISBURSED: </span>
                        <span className="font-bold text-emerald-600">{formatCurrencyUSD(disaster.disbursedUSD)}</span>
                        <span className="text-[#94A3B8]"> / Target {formatCurrencyUSD(disaster.targetUSD)}</span>
                      </div>
                      <div>
                        <span className="text-[#64748B]">CONTINGENCY RESERVE: </span>
                        <span className="font-bold text-[#2563EB]">{formatCurrencyUSD(disaster.reserveUSD)}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2.5 bg-[#F1F5F9] rounded-full overflow-hidden flex">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${pctDisbursed}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[11px] font-mono text-[#64748B]">
                      <span>{pctDisbursed}% of Target Dispatched to Field</span>
                      <span className="text-[#0F172A] font-semibold">{disaster.verifiedBeneficiariesCount.toLocaleString()} Families Helped</span>
                    </div>
                  </div>

                  {/* ACTIVE NGOS IN THIS AREA */}
                  <div className="space-y-3 pt-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-[#2563EB]" />
                        <h3 className="text-sm md:text-base font-bold text-[#0F172A]">
                          Active Verified NGOs in this Disaster Area ({disaster.activeNGOs.length})
                        </h3>
                      </div>
                      <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        100% Vetted Responders
                      </span>
                    </div>

                    {/* NGO Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {disaster.activeNGOs.map((ngo) => (
                        <div
                          key={ngo.id}
                          className="p-4 rounded-2xl bg-[#FAFAFA] border border-[#E2E8F0] hover:border-[#CBD5E1] transition-all space-y-2.5"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={ngo.logoSrc}
                                alt={ngo.name}
                                className="w-8 h-8 rounded-lg object-contain bg-white border border-[#E2E8F0] p-1 shrink-0"
                              />
                              <div>
                                <div className="text-xs font-bold text-[#0F172A] leading-tight flex items-center gap-1">
                                  <span>{ngo.name}</span>
                                  {ngo.verifiedOnChain && (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                                  )}
                                </div>
                                <div className="text-[11px] text-[#64748B] flex items-center gap-1 mt-0.5">
                                  <MapPin className="w-2.5 h-2.5 text-[#94A3B8]" />
                                  <span className="truncate max-w-[150px]">{ngo.fieldZone}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="text-xs text-[#475569] leading-snug">
                            <span className="text-[10px] font-mono text-[#94A3B8] block uppercase">Role:</span>
                            <span>{ngo.role}</span>
                          </div>

                          <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-xs font-mono">
                            <div>
                              <div className="text-[10px] text-[#94A3B8]">AID DELIVERED</div>
                              <div className="font-bold text-emerald-600">{formatCurrencyUSD(ngo.fundsDisbursedUSD)}</div>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleOpenIpfsPhoto(ngo.auditProofCid, `${ngo.name} — ${disaster.title}`, disaster.location, ngo.name)}
                                className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-xs font-semibold text-[#2563EB] transition-colors flex items-center gap-1"
                                title="Inspect Field Photo"
                              >
                                <Camera className="w-3 h-3" />
                                <span>Photo</span>
                              </button>

                              <button
                                onClick={() => setSelectedNgoModal({ ngo, disasterTitle: disaster.title })}
                                className="px-2.5 py-1 rounded-lg bg-white border border-[#E2E8F0] hover:bg-[#F1F5F9] text-xs font-semibold text-[#0F172A] transition-colors"
                              >
                                Details
                              </button>
                            </div>
                          </div>

                        </div>
                      ))}
                    </div>
                  </div>

                  {/* COLLAPSIBLE TECHNICAL BLOCKCHAIN DETAILS */}
                  <div className="pt-2 border-t border-[#F1F5F9]">
                    <button
                      onClick={() => toggleTechDetails(disaster.id)}
                      className="text-xs font-mono text-[#64748B] hover:text-[#0F172A] flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Layers className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>{isTechExpanded ? "Hide Technical Smart Contract & Merkle Hashes" : "Inspect On-Chain Contracts & Merkle Roots"}</span>
                      {isTechExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>

                    {isTechExpanded && (
                      <div className="mt-3 p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3 text-xs font-mono">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                          <div>
                            <span className="text-[#94A3B8] text-[10px] block">SEPOLIA VAULT:</span>
                            <a
                              href={getExplorerAddressUrl("sepolia", disaster.vaultAddresses.sepolia)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#2563EB] hover:underline font-semibold flex items-center gap-1"
                            >
                              <span>{formatAddress(disaster.vaultAddresses.sepolia)}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>

                          <div>
                            <span className="text-[#94A3B8] text-[10px] block">AMOY VAULT:</span>
                            <a
                              href={getExplorerAddressUrl("amoy", disaster.vaultAddresses.amoy)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#2563EB] hover:underline font-semibold flex items-center gap-1"
                            >
                              <span>{formatAddress(disaster.vaultAddresses.amoy)}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>

                          <div>
                            <span className="text-[#94A3B8] text-[10px] block">MERKLE ROOT:</span>
                            <span className="text-[#0F172A] font-semibold">{formatAddress(disaster.merkleRoot, 6, 6)}</span>
                          </div>

                          <div>
                            <span className="text-[#94A3B8] text-[10px] block">IPFS MANIFEST:</span>
                            <button
                              onClick={() => handleOpenIpfsPhoto(disaster.ipfsManifestCid, `Disaster Manifest — ${disaster.title}`, disaster.location)}
                              className="text-purple-600 hover:underline font-semibold flex items-center gap-1"
                            >
                              <span>{formatAddress(disaster.ipfsManifestCid, 6, 4)}</span>
                              <Camera className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        <div className="pt-2 flex justify-end">
                          <button
                            onClick={() => setSelectedProofModal({
                              title: `Merkle Proof: ${disaster.title}`,
                              cid: disaster.ipfsManifestCid,
                              root: disaster.merkleRoot,
                              details: {
                                crisisId: disaster.id,
                                allocatedUSD: disaster.totalAllocatedUSD,
                                disbursedUSD: disaster.disbursedUSD,
                                verifiedFamilies: disaster.verifiedBeneficiariesCount,
                              }
                            })}
                            className="px-3 py-1.5 rounded-lg bg-white border border-[#E2E8F0] hover:bg-[#F1F5F9] text-xs font-semibold text-[#0F172A] flex items-center gap-1"
                          >
                            <BadgeCheck className="w-3.5 h-3.5 text-[#2563EB]" />
                            <span>View Raw Cryptographic JSON</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════════
            TAB 3: GLOBAL VERIFIED TRANSACTION LEDGER
        ══════════════════════════════════════════════════════════════════════════ */}
        {activeViewTab === "ledger" && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-white border border-[#E2E8F0] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-semibold">
                    <tr>
                      <th className="p-4">NETWORK</th>
                      <th className="p-4">BLOCK</th>
                      <th className="p-4">EVENT</th>
                      <th className="p-4">FROM</th>
                      <th className="p-4">BENEFICIARY</th>
                      <th className="p-4">AMOUNT</th>
                      <th className="p-4">IPFS PROOF</th>
                      <th className="p-4 text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F5F9] text-[#475569]">
                    {filteredEvents.map((evt) => {
                      const isSepolia = evt.network === "sepolia";
                      return (
                        <tr
                          key={`row-${evt.id}`}
                          onClick={() => setSelectedTx(evt)}
                          className="hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                        >
                          <td className="p-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                              isSepolia
                                ? "bg-purple-50 border-purple-200 text-purple-700"
                                : "bg-blue-50 border-blue-200 text-[#2563EB]"
                            }`}>
                              {isSepolia ? "Sepolia" : "Amoy"}
                            </span>
                          </td>
                          <td className="p-4 text-[#0F172A] font-semibold">#{evt.blockNumber}</td>
                          <td className="p-4 font-semibold text-[#0F172A]">{evt.eventName}</td>
                          <td className="p-4">{formatAddress(evt.fromAddress)}</td>
                          <td className="p-4">
                            {evt.beneficiaryAddress ? (
                              <span className="text-emerald-600 font-semibold">{formatAddress(evt.beneficiaryAddress)}</span>
                            ) : (
                              <span className="text-[#CBD5E1]">—</span>
                            )}
                          </td>
                          <td className="p-4">
                            {evt.amountUSD > 0 ? (
                              <div>
                                <span className="text-[#0F172A] font-bold">{evt.amountCrypto}</span>
                                <div className="text-[10px] text-[#94A3B8]">{formatCurrencyUSD(evt.amountUSD)}</div>
                              </div>
                            ) : (
                              <span className="text-[#CBD5E1]">—</span>
                            )}
                          </td>
                          <td className="p-4">
                            {evt.ipfsCid ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenIpfsPhoto(evt.ipfsCid!, `${evt.eventName} Proof Receipt`);
                                }}
                                className="text-purple-600 hover:underline flex items-center gap-1 font-mono text-[11px]"
                              >
                                <Camera className="w-3 h-3" />
                                <span>{formatAddress(evt.ipfsCid, 6, 4)}</span>
                              </button>
                            ) : (
                              <span className="text-[#CBD5E1]">—</span>
                            )}
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedTx(evt);
                              }}
                              className="px-3 py-1 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F172A] border border-[#E2E8F0] text-xs font-semibold"
                            >
                              Verify
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ══════════════════════════════════════════════════════════════════════════
          TRANSACTION DETAILS DRAWER
      ══════════════════════════════════════════════════════════════════════════ */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-white border-l border-[#E2E8F0] h-full overflow-y-auto shadow-2xl flex flex-col justify-between p-6 space-y-6">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
                <div>
                  <h3 className="text-base font-bold text-[#0F172A]">Transaction Receipt</h3>
                  <span className="text-xs font-mono text-[#2563EB] font-semibold">{selectedTx.eventName}</span>
                </div>
                <button
                  onClick={() => setSelectedTx(null)}
                  className="p-1.5 rounded-full hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                  <div className="text-[#94A3B8] text-[10px]">NETWORK</div>
                  <div className="text-[#0F172A] font-semibold">{selectedTx.networkName}</div>
                </div>

                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                  <div className="text-[#94A3B8] text-[10px]">TRANSACTION HASH</div>
                  <div className="text-[#0F172A] font-semibold break-all text-[11px]">{selectedTx.txHash}</div>
                </div>

                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                  <div className="text-[#94A3B8] text-[10px]">SENDER ADDRESS</div>
                  <div className="text-[#0F172A] font-semibold break-all text-[11px]">{selectedTx.fromAddress}</div>
                </div>

                {selectedTx.beneficiaryAddress && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
                    <div className="text-emerald-800 text-[10px] font-semibold">VERIFIED BENEFICIARY</div>
                    <div className="text-emerald-700 font-semibold break-all text-[11px]">{selectedTx.beneficiaryAddress}</div>
                  </div>
                )}

                {selectedTx.amountUSD > 0 && (
                  <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                    <div className="text-[#94A3B8] text-[10px]">AMOUNT DISBURSED</div>
                    <div className="text-emerald-600 font-bold text-sm">{selectedTx.amountCrypto} ({formatCurrencyUSD(selectedTx.amountUSD)})</div>
                  </div>
                )}

                {selectedTx.ipfsCid && (
                  <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 space-y-1">
                    <div className="text-purple-800 text-[10px] font-semibold">IPFS PROOF OF DELIVERY</div>
                    <button
                      onClick={() => handleOpenIpfsPhoto(selectedTx.ipfsCid!, `${selectedTx.eventName} Receipt`)}
                      className="text-purple-700 hover:underline font-semibold break-all text-[11px] flex items-center gap-1 text-left"
                    >
                      <Camera className="w-3.5 h-3.5 shrink-0" />
                      <span>Inspect Photo & Details ({selectedTx.ipfsCid.slice(0, 12)}...)</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-[#E2E8F0] space-y-2">
              <a
                href={getExplorerTxUrl(selectedTx.network, selectedTx.txHash)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-full bg-[#2563EB] hover:bg-blue-600 text-white font-semibold text-xs font-mono flex items-center justify-center gap-2"
              >
                <span>View on Explorer</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => setSelectedTx(null)}
                className="w-full py-2 rounded-full bg-[#F1F5F9] text-[#0F172A] text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          NGO CREDENTIALS MODAL
      ══════════════════════════════════════════════════════════════════════════ */}
      {selectedNgoModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-[#E2E8F0] p-6 shadow-2xl space-y-4 animate-in fade-in duration-200">
            <div className="flex items-start justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-3">
                <img
                  src={selectedNgoModal.ngo.logoSrc}
                  alt={selectedNgoModal.ngo.name}
                  className="w-10 h-10 rounded-xl object-contain bg-white border border-[#E2E8F0] p-1"
                />
                <div>
                  <h3 className="text-base font-bold text-[#0F172A]">{selectedNgoModal.ngo.name}</h3>
                  <p className="text-xs text-[#64748B]">{selectedNgoModal.disasterTitle}</p>
                </div>
              </div>
              <button onClick={() => setSelectedNgoModal(null)} className="p-1 rounded-full hover:bg-[#F1F5F9]">
                <X className="w-5 h-5 text-[#64748B]" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <span className="text-emerald-800 font-semibold">ON-CHAIN ACCREDITATION</span>
                <span className="text-emerald-700 font-bold">✓ Verified Multisig Keyed</span>
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="text-[#94A3B8] text-[10px]">MISSION FOCUS</div>
                <div className="text-[#0F172A] font-semibold mt-0.5">{selectedNgoModal.ngo.role}</div>
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="text-[#94A3B8] text-[10px]">FIELD DEPLOYMENT ZONE</div>
                <div className="text-[#0F172A] font-semibold mt-0.5">{selectedNgoModal.ngo.fieldZone}</div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <div className="text-[#94A3B8] text-[10px]">AID DELIVERED</div>
                  <div className="text-emerald-600 font-bold mt-0.5">{formatCurrencyUSD(selectedNgoModal.ngo.fundsDisbursedUSD)}</div>
                </div>
                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <div className="text-[#94A3B8] text-[10px]">FAMILIES HELPED</div>
                  <div className="text-[#0F172A] font-bold mt-0.5">{selectedNgoModal.ngo.beneficiariesServed.toLocaleString()}</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="text-[#94A3B8] text-[10px]">CONTRACT / WALLET ADDRESS</div>
                <div className="text-[#0F172A] font-semibold break-all text-[11px] mt-0.5">{selectedNgoModal.ngo.walletAddress}</div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => {
                  const n = selectedNgoModal.ngo;
                  setSelectedNgoModal(null);
                  handleOpenIpfsPhoto(n.auditProofCid, `${n.name} Proof of Delivery`, n.fieldZone, n.name);
                }}
                className="px-4 py-2 rounded-full bg-blue-50 hover:bg-blue-100 text-[#2563EB] text-xs font-semibold flex items-center gap-1"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Inspect Field Photo</span>
              </button>

              <button
                onClick={() => setSelectedNgoModal(null)}
                className="px-5 py-2 rounded-full bg-[#0F172A] text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          CRYPTOGRAPHIC PROOF MODAL
      ══════════════════════════════════════════════════════════════════════════ */}
      {selectedProofModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-[#E2E8F0] p-6 shadow-2xl space-y-4 animate-in fade-in duration-200">
            <div className="flex items-start justify-between pb-3 border-b border-[#E2E8F0]">
              <div>
                <h3 className="text-base font-bold text-[#0F172A]">{selectedProofModal.title}</h3>
                <p className="text-xs text-[#64748B]">Cryptographic Merkle Root & IPFS Dossier</p>
              </div>
              <button onClick={() => setSelectedProofModal(null)} className="p-1 rounded-full hover:bg-[#F1F5F9]">
                <X className="w-5 h-5 text-[#64748B]" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              {selectedProofModal.root && (
                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <div className="text-[#94A3B8] text-[10px]">ON-CHAIN MERKLE ROOT</div>
                  <div className="text-[#0F172A] font-semibold break-all text-[11px] mt-0.5">{selectedProofModal.root}</div>
                </div>
              )}

              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="text-[#94A3B8] text-[10px]">IPFS MANIFEST CID</div>
                <div className="text-[#2563EB] font-semibold break-all text-[11px] mt-0.5">{selectedProofModal.cid}</div>
              </div>

              <pre className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[11px] overflow-x-auto text-[#0F172A]">
                {JSON.stringify(selectedProofModal.details, null, 2)}
              </pre>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <a
                href={getIpfsGatewayUrl(selectedProofModal.cid)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full bg-[#2563EB] text-white text-xs font-semibold flex items-center gap-1"
              >
                <span>Open in IPFS</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => setSelectedProofModal(null)}
                className="px-5 py-2 rounded-full bg-[#0F172A] text-white text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          📷 IPFS PHOTO DELIVERY RECEIPT & INSPECTION MODAL (Innovation 4 & 6)
      ══════════════════════════════════════════════════════════════════════════ */}
      <IPFSDeliveryModal
        isOpen={ipfsPhotoModal.isOpen}
        onClose={() => setIpfsPhotoModal(prev => ({ ...prev, isOpen: false }))}
        cid={ipfsPhotoModal.cid}
        title={ipfsPhotoModal.title}
        disasterLocation={ipfsPhotoModal.disasterLocation}
        ngoName={ipfsPhotoModal.ngoName}
      />

    </div>
  );
}

export default function AuditPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAFAFA] text-[#0F172A] flex items-center justify-center p-8">
        <div className="flex items-center gap-3 text-xs font-mono text-[#64748B]">
          <div className="w-4 h-4 border-2 border-[#2563EB] border-t-transparent rounded-full animate-spin"></div>
          <span>Loading Public Blockchain Audit Ledger & Donor Transparency...</span>
        </div>
      </div>
    }>
      <AuditContent />
    </Suspense>
  );
}
