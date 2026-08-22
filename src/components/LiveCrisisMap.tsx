"use client";

import React, { useState, useMemo } from "react";
import { 
  AlertTriangle, 
  Users, 
  Crosshair, 
  Home, 
  CheckCircle2, 
  Navigation, 
  Radio, 
  Layers, 
  Search, 
  Maximize2, 
  Minimize2, 
  ZoomIn, 
  ZoomOut, 
  RefreshCw, 
  MapPin, 
  Flame, 
  ShieldAlert, 
  Activity, 
  Building2, 
  HeartHandshake, 
  Zap, 
  Info,
  ExternalLink,
  ChevronRight
} from "lucide-react";

export type MarkerCategory = 
  | "severe_damage" 
  | "trapped_priority" 
  | "hospital" 
  | "relief_center" 
  | "beneficiaries" 
  | "response_teams";

export interface MapZoneMarker {
  id: string;
  name: string;
  category: MarkerCategory;
  categoryLabel: string;
  x: number; // percentage on map (0 - 100)
  y: number; // percentage on map (0 - 100)
  lat: string;
  lng: string;
  priorityLevel: "CRITICAL P1" | "URGENT SOS P1" | "HIGH P2" | "ACTIVE FACILITY" | "LOGISTICS DEPOT" | "VERIFIED CLUSTER";
  priorityColor: string;
  damagePct: number;
  verifiedBeneficiaries: number;
  aidRequiredUSD: number;
  aidDistributedUSD: number;
  triageDetails: string;
  suppliesDeployed: string;
  contactChannel: string;
}

interface LiveCrisisMapProps {
  crisisId?: string;
  crisisTitle?: string;
  locationName?: string;
}

const mockMapZones: MapZoneMarker[] = [
  // 1. Severe Damage Zones
  {
    id: "zone-damage-1",
    name: "Kahramanmaraş Epicenter Sector Alpha",
    category: "severe_damage",
    categoryLabel: "Severe Damage Zone",
    x: 48,
    y: 36,
    lat: "37.5854° N",
    lng: "36.9372° E",
    priorityLevel: "CRITICAL P1",
    priorityColor: "text-red-400 bg-red-950/40 border-red-800/60",
    damagePct: 94,
    verifiedBeneficiaries: 3420,
    aidRequiredUSD: 450000,
    aidDistributedUSD: 290000,
    triageDetails: "Epicenter high-density collapse. Multi-story reinforced concrete failure across 48 residential buildings. Gas grid isolated.",
    suppliesDeployed: "1,200 Thermal Pods • 4 Mobile Trauma Units • 2,400 Ration Vouchers",
    contactChannel: "AFAD VHF Ch 9 • Relay Sat: TR-04",
  },
  {
    id: "zone-damage-2",
    name: "Gaziantep Historic Old City District",
    category: "severe_damage",
    categoryLabel: "Severe Damage Zone",
    x: 68,
    y: 58,
    lat: "37.0662° N",
    lng: "37.3833° E",
    priorityLevel: "CRITICAL P1",
    priorityColor: "text-red-400 bg-red-950/40 border-red-800/60",
    damagePct: 86,
    verifiedBeneficiaries: 2150,
    aidRequiredUSD: 320000,
    aidDistributedUSD: 210000,
    triageDetails: "Masonry failure in heritage quarter. Main arterial roads cleared for heavy rescue vehicles.",
    suppliesDeployed: "800 Emergency Tents • 1,500 Water Filtration Kits",
    contactChannel: "Relief Net Ch 4",
  },
  {
    id: "zone-damage-3",
    name: "Antakya Hatay Central Corridor",
    category: "severe_damage",
    categoryLabel: "Severe Damage Zone",
    x: 32,
    y: 82,
    lat: "36.2023° N",
    lng: "36.1613° E",
    priorityLevel: "CRITICAL P1",
    priorityColor: "text-red-400 bg-red-950/40 border-red-800/60",
    damagePct: 91,
    verifiedBeneficiaries: 1840,
    aidRequiredUSD: 390000,
    aidDistributedUSD: 240000,
    triageDetails: "Critical infrastructure disruption. Water mains ruptured; auxiliary generators dispatched to field triage centers.",
    suppliesDeployed: "950 Winterized Tents • 3,200 Blankets • Pediatric Surgical Units",
    contactChannel: "UN OCHA Frequency 156.8 MHz",
  },
  {
    id: "zone-damage-4",
    name: "İslahiye Residential Grid 9",
    category: "severe_damage",
    categoryLabel: "Severe Damage Zone",
    x: 42,
    y: 60,
    lat: "37.0272° N",
    lng: "36.6317° E",
    priorityLevel: "HIGH P2",
    priorityColor: "text-red-400 bg-red-950/40 border-red-800/60",
    damagePct: 82,
    verifiedBeneficiaries: 980,
    aidRequiredUSD: 190000,
    aidDistributedUSD: 120000,
    triageDetails: "Peripheral village access restored via temporary gravel bridge. 65 buildings assessed as unsafe for re-entry.",
    suppliesDeployed: "400 Food Packs • Field Medic Squad 3",
    contactChannel: "Local Mesh Net #Islahiye-2",
  },

  // 2. Trapped / Civilian Priority Zones
  {
    id: "zone-trapped-1",
    name: "Pazarcık Collapsed Apartment Cluster",
    category: "trapped_priority",
    categoryLabel: "Trapped / Civilian Priority",
    x: 56,
    y: 32,
    lat: "37.4878° N",
    lng: "37.2981° E",
    priorityLevel: "URGENT SOS P1",
    priorityColor: "text-amber-400 bg-amber-950/40 border-amber-800/60",
    damagePct: 89,
    verifiedBeneficiaries: 1420,
    aidRequiredUSD: 260000,
    aidDistributedUSD: 170000,
    triageDetails: "Acoustic life-detectors confirm 18 trapped civilians in Sector C void space. Heavy hydraulic spreaders operating continuously.",
    suppliesDeployed: "K9 Search Teams 1 & 2 • Emergency Oxygen Lines • Fiber-Optic Borescopes",
    contactChannel: "SAR Tactical Command Ch 1",
  },
  {
    id: "zone-trapped-2",
    name: "Nurdağı Highway Intersection Sector",
    category: "trapped_priority",
    categoryLabel: "Trapped / Civilian Priority",
    x: 44,
    y: 48,
    lat: "37.1775° N",
    lng: "36.7378° E",
    priorityLevel: "URGENT SOS P1",
    priorityColor: "text-amber-400 bg-amber-950/40 border-amber-800/60",
    damagePct: 78,
    verifiedBeneficiaries: 890,
    aidRequiredUSD: 180000,
    aidDistributedUSD: 110000,
    triageDetails: "Underpass structural breach with trapped transit vehicles. 3 survivor extractions completed in the last 45 minutes.",
    suppliesDeployed: "Crane Unit 12 • Paramedic Rapid Response • Thermal Cameras",
    contactChannel: "Highway Patrol Relay #09",
  },
  {
    id: "zone-trapped-3",
    name: "Adıyaman Western Sector Grid 3",
    category: "trapped_priority",
    categoryLabel: "Trapped / Civilian Priority",
    x: 76,
    y: 28,
    lat: "37.7648° N",
    lng: "38.2786° E",
    priorityLevel: "HIGH P2",
    priorityColor: "text-amber-400 bg-amber-950/40 border-amber-800/60",
    damagePct: 75,
    verifiedBeneficiaries: 760,
    aidRequiredUSD: 150000,
    aidDistributedUSD: 95000,
    triageDetails: "Secondary void exploration in basement shelter levels. Seismic micro-tremor sensors monitoring building stability.",
    suppliesDeployed: "Seismic Geophones • Emergency Light Towers • Blood Transfusion Packs",
    contactChannel: "Adıyaman Dispatch Unit 4",
  },

  // 3. Hospitals
  {
    id: "zone-hospital-1",
    name: "Kahramanmaraş University Field Trauma Hospital",
    category: "hospital",
    categoryLabel: "Hospital / Medical Center",
    x: 52,
    y: 26,
    lat: "37.5912° N",
    lng: "36.9124° E",
    priorityLevel: "ACTIVE FACILITY",
    priorityColor: "text-cyan-400 bg-cyan-950/40 border-cyan-800/60",
    damagePct: 22,
    verifiedBeneficiaries: 850,
    aidRequiredUSD: 140000,
    aidDistributedUSD: 110000,
    triageDetails: "6 operational field operating theatres. Inflatable surgical dome active. Surge capacity expanded to 350 emergency beds.",
    suppliesDeployed: "600 Surgical Trauma Kits • 1,200 IV Saline Units • 4 Backup Generators",
    contactChannel: "Medical Direct Ch 12 • MedEvac Heliport 1",
  },
  {
    id: "zone-hospital-2",
    name: "Gaziantep City Hospital Complex & Triage Wing",
    category: "hospital",
    categoryLabel: "Hospital / Medical Center",
    x: 72,
    y: 52,
    lat: "37.0589° N",
    lng: "37.3621° E",
    priorityLevel: "ACTIVE FACILITY",
    priorityColor: "text-cyan-400 bg-cyan-950/40 border-cyan-800/60",
    damagePct: 15,
    verifiedBeneficiaries: 620,
    aidRequiredUSD: 120000,
    aidDistributedUSD: 95000,
    triageDetails: "Primary tertiary referral hub. Helipad receiving airlifts from isolated mountain valleys. Blood bank replenished.",
    suppliesDeployed: "Anti-tetanus vaccines • Pediatric Orthopedic Kits • Clean Oxygen Supply",
    contactChannel: "Gaziantep MedCom Direct",
  },
  {
    id: "zone-hospital-3",
    name: "Hatay Mobile Air-Drop Field Surgical Station",
    category: "hospital",
    categoryLabel: "Hospital / Medical Center",
    x: 28,
    y: 76,
    lat: "36.2189° N",
    lng: "36.1489° E",
    priorityLevel: "ACTIVE FACILITY",
    priorityColor: "text-cyan-400 bg-cyan-950/40 border-cyan-800/60",
    damagePct: 30,
    verifiedBeneficiaries: 430,
    aidRequiredUSD: 90000,
    aidDistributedUSD: 75000,
    triageDetails: "WHO Type 2 Emergency Medical Team (EMT) deployed on stadium grounds. 120 patients triaged per hour.",
    suppliesDeployed: "Mobile X-Ray • Rapid Ultrasound (FAST) • Triage Pods",
    contactChannel: "WHO EMT Frequency #03",
  },

  // 4. Relief Centers
  {
    id: "zone-relief-1",
    name: "AFAD Central Logistics Hub Gaziantep",
    category: "relief_center",
    categoryLabel: "Relief Center / Depot",
    x: 64,
    y: 66,
    lat: "37.0421° N",
    lng: "37.4120° E",
    priorityLevel: "LOGISTICS DEPOT",
    priorityColor: "text-emerald-400 bg-emerald-950/40 border-emerald-800/60",
    damagePct: 5,
    verifiedBeneficiaries: 4200,
    aidRequiredUSD: 500000,
    aidDistributedUSD: 380000,
    triageDetails: "Primary multi-modal distribution depot receiving cross-chain vault payouts. 84 cargo trucks dispatched today.",
    suppliesDeployed: "45,000 MRE Meals • 12,000 Thermal Sleeping Bags • Clean Water Tankers",
    contactChannel: "Logistics Master Ch 1",
  },
  {
    id: "zone-relief-2",
    name: "UN WFP & Red Crescent Dispatch Camp Maraş",
    category: "relief_center",
    categoryLabel: "Relief Center / Depot",
    x: 44,
    y: 30,
    lat: "37.5689° N",
    lng: "36.9589° E",
    priorityLevel: "LOGISTICS DEPOT",
    priorityColor: "text-emerald-400 bg-emerald-950/40 border-emerald-800/60",
    damagePct: 8,
    verifiedBeneficiaries: 3100,
    aidRequiredUSD: 350000,
    aidDistributedUSD: 290000,
    triageDetails: "Community hot kitchen providing 18,000 warm meals daily. Digital QR voucher redemption station active.",
    suppliesDeployed: "Flour • Baby Formula • Clean Water Bladders (50,000L)",
    contactChannel: "WFP Feed Net #02",
  },
  {
    id: "zone-relief-3",
    name: "Thermal Pod Shelter Village Alpha (Gölbaşı)",
    category: "relief_center",
    categoryLabel: "Relief Center / Depot",
    x: 68,
    y: 22,
    lat: "37.7845° N",
    lng: "37.6412° E",
    priorityLevel: "LOGISTICS DEPOT",
    priorityColor: "text-emerald-400 bg-emerald-950/40 border-emerald-800/60",
    damagePct: 2,
    verifiedBeneficiaries: 1950,
    aidRequiredUSD: 220000,
    aidDistributedUSD: 180000,
    triageDetails: "Heated modular container village accommodating 450 displaced families with solar microgrid power.",
    suppliesDeployed: "Modular Containers • Electric Heaters • Wi-Fi Mesh Satellite Link",
    contactChannel: "Camp Admin VHF #07",
  },

  // 5. Verified Beneficiaries
  {
    id: "zone-beneficiary-1",
    name: "Merkle Verified Beneficiary Cluster (Gaziantep Hub)",
    category: "beneficiaries",
    categoryLabel: "Verified Beneficiaries",
    x: 60,
    y: 50,
    lat: "37.0712° N",
    lng: "37.3512° E",
    priorityLevel: "VERIFIED CLUSTER",
    priorityColor: "text-purple-400 bg-purple-950/40 border-purple-800/60",
    damagePct: 70,
    verifiedBeneficiaries: 1240,
    aidRequiredUSD: 124000,
    aidDistributedUSD: 124000,
    triageDetails: "100% cryptographic Merkle proof verified. Gasless EIP-712 payout completed in 2.8 seconds per beneficiary wallet.",
    suppliesDeployed: "$100 USDC Instant Direct Payouts per family",
    contactChannel: "On-Chain Amoy Contract: 0x7E12...4c09",
  },
  {
    id: "zone-beneficiary-2",
    name: "Merkle Verified Beneficiary Cluster (Maraş Central)",
    category: "beneficiaries",
    categoryLabel: "Verified Beneficiaries",
    x: 50,
    y: 42,
    lat: "37.5745° N",
    lng: "36.9212° E",
    priorityLevel: "VERIFIED CLUSTER",
    priorityColor: "text-purple-400 bg-purple-950/40 border-purple-800/60",
    damagePct: 88,
    verifiedBeneficiaries: 2180,
    aidRequiredUSD: 218000,
    aidDistributedUSD: 218000,
    triageDetails: "Field workers registered biometric hash roots. Direct aid claimed without revealing real-world identity on-chain.",
    suppliesDeployed: "Direct Smart Voucher Release (Medical & Shelter)",
    contactChannel: "Merkle Root: 0x9f1a...4b22",
  },
  {
    id: "zone-beneficiary-3",
    name: "Merkle Verified Beneficiary Cluster (Antakya South)",
    category: "beneficiaries",
    categoryLabel: "Verified Beneficiaries",
    x: 36,
    y: 88,
    lat: "36.1912° N",
    lng: "36.1724° E",
    priorityLevel: "VERIFIED CLUSTER",
    priorityColor: "text-purple-400 bg-purple-950/40 border-purple-800/60",
    damagePct: 85,
    verifiedBeneficiaries: 980,
    aidRequiredUSD: 98000,
    aidDistributedUSD: 98000,
    triageDetails: "Offline QR vouchers scanned and synced with Polygon Amoy relayer node once mesh connectivity restored.",
    suppliesDeployed: "Direct Cash Assistance & Winter Kits",
    contactChannel: "Relayer Daemon Sync #8841",
  },

  // 6. Active Response Teams
  {
    id: "zone-team-1",
    name: "AKUT Tactical Search & Rescue Squad Alpha",
    category: "response_teams",
    categoryLabel: "Active Response Team",
    x: 54,
    y: 38,
    lat: "37.5812° N",
    lng: "36.9421° E",
    priorityLevel: "URGENT SOS P1",
    priorityColor: "text-yellow-400 bg-yellow-950/40 border-yellow-800/60",
    damagePct: 92,
    verifiedBeneficiaries: 180,
    aidRequiredUSD: 65000,
    aidDistributedUSD: 65000,
    triageDetails: "18 certified SAR specialists, 4 avalanche/disaster K9s, and ultrasonic ground radar operating in Sector Alpha.",
    suppliesDeployed: "Heavy hydraulic spreaders • Thermal imaging drones",
    contactChannel: "AKUT Tactical Alpha • Radio 145.500 MHz",
  },
  {
    id: "zone-team-2",
    name: "White Helmets Paramedic Air-Bridge Unit #4",
    category: "response_teams",
    categoryLabel: "Active Response Team",
    x: 34,
    y: 72,
    lat: "36.2412° N",
    lng: "36.1924° E",
    priorityLevel: "URGENT SOS P1",
    priorityColor: "text-yellow-400 bg-yellow-950/40 border-yellow-800/60",
    damagePct: 88,
    verifiedBeneficiaries: 240,
    aidRequiredUSD: 75000,
    aidDistributedUSD: 75000,
    triageDetails: "12 combat paramedics performing rapid field tracheotomy and orthopedic stabilization before helicopter transport.",
    suppliesDeployed: "Field Trauma Bags • Emergency Blood Warmer Units",
    contactChannel: "Air-Bridge Satcom #4",
  },
];

const categoryConfig: Record<
  MarkerCategory, 
  { label: string; icon: React.ElementType; color: string; bg: string; border: string; badgeColor: string; pinBg: string; pulseColor: string }
> = {
  severe_damage: {
    label: "Severe Damage Zones",
    icon: Flame,
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    badgeColor: "bg-red-950/50 text-red-400 border-red-800/50",
    pinBg: "bg-red-500",
    pulseColor: "bg-red-500/30",
  },
  trapped_priority: {
    label: "Trapped / Civilian Priority",
    icon: AlertTriangle,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    badgeColor: "bg-amber-950/50 text-amber-400 border-amber-800/50",
    pinBg: "bg-amber-500",
    pulseColor: "bg-amber-500/30",
  },
  hospital: {
    label: "Hospitals & Triage",
    icon: Crosshair,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/30",
    badgeColor: "bg-cyan-950/50 text-cyan-400 border-cyan-800/50",
    pinBg: "bg-cyan-500",
    pulseColor: "bg-cyan-500/30",
  },
  relief_center: {
    label: "Relief Centers & Depots",
    icon: Building2,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    badgeColor: "bg-emerald-950/50 text-emerald-400 border-emerald-800/50",
    pinBg: "bg-emerald-500",
    pulseColor: "bg-emerald-500/30",
  },
  beneficiaries: {
    label: "Verified Beneficiaries",
    icon: Users,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    badgeColor: "bg-purple-950/50 text-purple-400 border-purple-800/50",
    pinBg: "bg-purple-500",
    pulseColor: "bg-purple-500/30",
  },
  response_teams: {
    label: "Active Response Teams",
    icon: Navigation,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/30",
    badgeColor: "bg-yellow-950/50 text-yellow-400 border-yellow-800/50",
    pinBg: "bg-yellow-500",
    pulseColor: "bg-yellow-500/30",
  },
};

export function LiveCrisisMap({ 
  crisisId = "turkey-earthquake-2026", 
  crisisTitle = "Turkey-Syria 7.8M Earthquake Emergency",
  locationName = "Kahramanmaraş & Gaziantep Region"
}: LiveCrisisMapProps) {
  const [selectedCategory, setSelectedCategory] = useState<"all" | MarkerCategory>("all");
  const [selectedMarker, setSelectedMarker] = useState<MapZoneMarker>(mockMapZones[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [mapMode, setMapMode] = useState<"tactical" | "satellite" | "heatmap">("tactical");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRadarScanning, setIsRadarScanning] = useState(true);

  // Filter markers based on category and search
  const filteredMarkers = useMemo(() => {
    return mockMapZones.filter((marker) => {
      const matchesCategory = selectedCategory === "all" || marker.category === selectedCategory;
      const matchesSearch = searchQuery === "" || 
        marker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        marker.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        marker.priorityLevel.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Aggregate stats across active zones
  const stats = useMemo(() => {
    const totalBeneficiaries = mockMapZones.reduce((acc, m) => acc + m.verifiedBeneficiaries, 0);
    const totalAidReq = mockMapZones.reduce((acc, m) => acc + m.aidRequiredUSD, 0);
    const totalAidDisb = mockMapZones.reduce((acc, m) => acc + m.aidDistributedUSD, 0);
    return { totalBeneficiaries, totalAidReq, totalAidDisb };
  }, []);

  return (
    <section 
      id="live-crisis-map" 
      className={`w-full rounded-xl bg-surface-1 border border-hairline transition-all overflow-hidden ${
        isFullscreen ? "fixed inset-2 z-50 bg-canvas overflow-y-auto max-h-[96vh] p-4 shadow-2xl" : "p-5 md:p-6"
      }`}
    >
      {/* MAP HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-hairline mb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[11px] font-mono tracking-eyebrow text-ink-subtle uppercase">
            <span className="w-2 h-2 rounded-full bg-semantic-success animate-pulse" />
            <span className="text-primary font-semibold">Live Geospatial Command</span>
            <span className="text-hairline-strong">•</span>
            <span>USGS / AFAD Optical Feed</span>
            <span className="text-hairline-strong">•</span>
            <span className="text-red-400 font-mono">Epicenter: 37.5854° N, 36.9372° E</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-ink flex items-center gap-2">
            <Activity className="w-5 h-5 text-red-500 animate-pulse" />
            LIVE CRISIS MAP: {locationName}
          </h2>
          <p className="text-xs text-ink-subtle">
            Interactive multi-layered casualty, infrastructure damage, triage zones, hospital networks, and on-chain Merkle beneficiary clusters.
          </p>
        </div>

        {/* Action / View Controls */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          {/* Map Layer Mode Toggle */}
          <div className="flex items-center p-1 rounded-md bg-canvas border border-hairline text-[11px]">
            <button
              onClick={() => setMapMode("tactical")}
              className={`px-2.5 py-1 rounded transition-colors ${
                mapMode === "tactical" ? "bg-surface-3 text-ink font-medium" : "text-ink-subtle hover:text-ink"
              }`}
            >
              Tactical HUD
            </button>
            <button
              onClick={() => setMapMode("heatmap")}
              className={`px-2.5 py-1 rounded transition-colors ${
                mapMode === "heatmap" ? "bg-surface-3 text-ink font-medium" : "text-ink-subtle hover:text-ink"
              }`}
            >
              Damage Heatmap
            </button>
            <button
              onClick={() => setMapMode("satellite")}
              className={`px-2.5 py-1 rounded transition-colors ${
                mapMode === "satellite" ? "bg-surface-3 text-ink font-medium" : "text-ink-subtle hover:text-ink"
              }`}
            >
              SAR Grid
            </button>
          </div>

          {/* Radar scan toggle */}
          <button
            onClick={() => setIsRadarScanning(!isRadarScanning)}
            className={`px-2.5 py-1.5 rounded-md border text-[11px] flex items-center gap-1.5 transition-colors ${
              isRadarScanning 
                ? "bg-surface-2 border-semantic-success/40 text-semantic-success" 
                : "bg-canvas border-hairline text-ink-subtle hover:text-ink"
            }`}
            title="Toggle Radar Sweep"
          >
            <Radio className={`w-3.5 h-3.5 ${isRadarScanning ? "animate-pulse" : ""}`} />
            <span className="hidden sm:inline">Radar</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-md bg-canvas hover:bg-surface-2 text-ink-subtle hover:text-ink border border-hairline transition-colors"
            title={isFullscreen ? "Exit Fullscreen" : "Expand Map Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* FILTER CATEGORY PILLS BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-2.5 py-1 rounded-pill text-[11px] border transition-colors ${
              selectedCategory === "all"
                ? "bg-surface-3 text-ink border-primary font-medium shadow-sm"
                : "bg-canvas text-ink-subtle border-hairline hover:text-ink"
            }`}
          >
            All Zones ({mockMapZones.length})
          </button>

          {(Object.keys(categoryConfig) as MarkerCategory[]).map((catKey) => {
            const cfg = categoryConfig[catKey];
            const Icon = cfg.icon;
            const count = mockMapZones.filter((m) => m.category === catKey).length;
            const isSelected = selectedCategory === catKey;

            return (
              <button
                key={catKey}
                onClick={() => setSelectedCategory(catKey)}
                className={`px-2.5 py-1 rounded-pill text-[11px] border flex items-center gap-1.5 transition-colors ${
                  isSelected
                    ? `${cfg.badgeColor} font-medium shadow-sm`
                    : "bg-canvas text-ink-subtle border-hairline hover:text-ink"
                }`}
              >
                <Icon className={`w-3 h-3 ${cfg.color}`} />
                <span>{cfg.label}</span>
                <span className="text-[10px] opacity-75 font-semibold">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Search zone query */}
        <div className="relative w-full sm:w-60">
          <Search className="w-3.5 h-3.5 text-ink-tertiary absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search sector, zone, team..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-canvas border border-hairline text-ink placeholder:text-ink-tertiary text-xs pl-8 pr-3 py-1.5 rounded-md focus:outline-none focus:border-primary font-mono"
          />
        </div>
      </div>

      {/* MAIN MAP WORKSPACE: 2-COLUMN (INTERACTIVE MAP CANVAS + ZONE INSPECTION PANEL) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* MAP CANVAS (8 COLS) */}
        <div className="lg:col-span-8 flex flex-col justify-between">
          <div className="relative w-full h-[460px] md:h-[540px] rounded-lg bg-[#07090e] border border-hairline overflow-hidden select-none">
            {/* BACKGROUND TACTICAL TOPOGRAPHY & GRID LAYER */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
                    <circle cx="20" cy="20" r="1" fill="rgba(255,255,255,0.1)" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#gridPattern)" />
              </svg>
            </div>

            {/* SEISMIC FAULT LINE & EPICENTER HEATMAP CONTOURS */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* East Anatolian Fault Line Trace */}
              <path
                d="M 15 95 Q 35 75 48 36 T 85 10"
                fill="none"
                stroke={mapMode === "heatmap" ? "rgba(239, 68, 68, 0.6)" : "rgba(239, 68, 68, 0.3)"}
                strokeWidth={mapMode === "heatmap" ? "2.5" : "1.2"}
                strokeDasharray="2 1"
              />

              {/* Epicenter Concentric Shockwave Rings */}
              <circle cx="48" cy="36" r="12" fill="none" stroke="rgba(239, 68, 68, 0.4)" strokeWidth="0.5" strokeDasharray="1 1" />
              <circle cx="48" cy="36" r="24" fill="none" stroke="rgba(239, 68, 68, 0.25)" strokeWidth="0.5" />
              <circle cx="48" cy="36" r="38" fill="none" stroke="rgba(239, 68, 68, 0.15)" strokeWidth="0.5" />

              {/* Heatmap Gradient Overlay when Heatmap Mode is Active */}
              {mapMode === "heatmap" && (
                <>
                  <circle cx="48" cy="36" r="20" fill="rgba(239, 68, 68, 0.2)" filter="blur(8px)" />
                  <circle cx="68" cy="58" r="16" fill="rgba(245, 158, 11, 0.18)" filter="blur(6px)" />
                  <circle cx="32" cy="82" r="18" fill="rgba(239, 68, 68, 0.18)" filter="blur(6px)" />
                </>
              )}
            </svg>

            {/* RADAR SWEEP BEAM ANIMATION */}
            {isRadarScanning && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div 
                  className="absolute w-[200%] h-[200%] -top-[50%] -left-[50%] animate-[spin_8s_linear_infinite]"
                  style={{
                    background: "conic-gradient(from 0deg at 50% 50%, rgba(239, 68, 68, 0.12) 0deg, rgba(239, 68, 68, 0) 60deg, transparent 360deg)"
                  }}
                />
              </div>
            )}

            {/* MAP HUD OVERLAYS & COORDINATES */}
            <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 pointer-events-none font-mono text-[10px] text-ink-subtle bg-canvas/80 backdrop-blur-sm p-2 rounded border border-hairline">
              <div className="flex items-center gap-1.5 text-red-400 font-semibold">
                <Flame className="w-3 h-3" /> EPICENTER: 7.8M Richter
              </div>
              <div>LAT/LNG: 37.5854° N / 36.9372° E</div>
              <div>DEPTH: 17.9 km • PGA: 0.72g</div>
              <div className="text-emerald-400 text-[9px]">ACTIVE MARKERS: {filteredMarkers.length} / {mockMapZones.length}</div>
            </div>

            {/* Compass Rose */}
            <div className="absolute top-3 right-3 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-canvas/80 border border-hairline font-mono text-[10px] text-ink font-bold pointer-events-none">
              <span>N ↑</span>
            </div>

            {/* INTERACTIVE MARKERS ON MAP */}
            <div className="absolute inset-0">
              {filteredMarkers.map((marker) => {
                const cfg = categoryConfig[marker.category];
                const Icon = cfg.icon;
                const isSelected = selectedMarker.id === marker.id;

                return (
                  <div
                    key={marker.id}
                    onClick={() => setSelectedMarker(marker)}
                    className="absolute cursor-pointer -translate-x-1/2 -translate-y-1/2 group transition-transform duration-200"
                    style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                  >
                    {/* Pulsing ring around marker */}
                    <div className={`absolute -inset-2 rounded-full ${cfg.pulseColor} animate-ping opacity-75`} />

                    {/* Outer marker container */}
                    <div
                      className={`relative flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full border shadow-lg transition-all ${
                        isSelected
                          ? `ring-2 ring-white scale-125 z-30 ${cfg.pinBg} text-white border-white`
                          : `bg-surface-1 ${cfg.border} ${cfg.color} hover:scale-110 hover:z-20`
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </div>

                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center pointer-events-none z-40 whitespace-nowrap">
                      <div className="px-2 py-1 rounded bg-canvas border border-hairline text-[10px] font-mono shadow-md text-ink">
                        <div className="font-semibold text-white">{marker.name}</div>
                        <div className="text-[9px] text-ink-subtle flex items-center gap-1">
                          <span className={cfg.color}>{marker.categoryLabel}</span>
                          <span>•</span>
                          <span className="text-red-400">{marker.damagePct}% Dmg</span>
                        </div>
                      </div>
                      <div className="w-1.5 h-1.5 bg-canvas border-r border-b border-hairline rotate-45 -mt-1" />
                    </div>

                    {/* Mini label below marker */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 pointer-events-none">
                      <span className="px-1 py-0.5 rounded bg-canvas/90 text-[9px] font-mono text-ink-muted border border-hairline/60 whitespace-nowrap">
                        {marker.name.split(" ")[0]}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* MAP ZOOM & CONTROLS STRIP */}
            <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1 bg-canvas/80 backdrop-blur-sm p-1 rounded border border-hairline font-mono text-xs">
              <button
                onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.25))}
                className="p-1 text-ink-subtle hover:text-ink"
                title="Zoom in"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] text-ink-tertiary px-1">{Math.round(zoomLevel * 100)}%</span>
              <button
                onClick={() => setZoomLevel(Math.max(0.75, zoomLevel - 0.25))}
                className="p-1 text-ink-subtle hover:text-ink"
                title="Zoom out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => { setZoomLevel(1); setSelectedCategory("all"); setSearchQuery(""); }}
                className="p-1 text-ink-subtle hover:text-ink border-l border-hairline pl-1.5"
                title="Reset view"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>

            {/* BOTTOM LIVE TELEMETRY TICKER */}
            <div className="absolute bottom-3 left-3 z-10 hidden sm:flex items-center gap-2 bg-canvas/85 backdrop-blur-sm px-2.5 py-1 rounded border border-hairline font-mono text-[10px] text-ink-subtle">
              <span className="w-1.5 h-1.5 rounded-full bg-semantic-success animate-pulse" />
              <span>LIVE FEED:</span>
              <span className="text-ink truncate max-w-[280px]">
                {selectedMarker.name} • {selectedMarker.priorityLevel}
              </span>
            </div>
          </div>

          {/* MAP LEGEND BAR */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mt-3 pt-3 border-t border-hairline font-mono text-[10px]">
            {(Object.keys(categoryConfig) as MarkerCategory[]).map((catKey) => {
              const cfg = categoryConfig[catKey];
              const Icon = cfg.icon;
              return (
                <div key={catKey} className="flex items-center gap-1.5 p-1.5 rounded bg-surface-2/60 border border-hairline">
                  <div className={`w-2.5 h-2.5 rounded-full ${cfg.pinBg} shrink-0`} />
                  <span className="text-ink-muted truncate">{cfg.label.split(" ")[0]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ZONE DETAILS INSPECTION PANEL (4 COLS) */}
        <div className="lg:col-span-4 flex flex-col justify-between p-5 rounded-lg bg-surface-2/90 border border-hairline space-y-4">
          <div>
            {/* Header of selected zone */}
            <div className="flex items-center justify-between pb-3 border-b border-hairline mb-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-ink-tertiary">
                  ZONE INSPECTION PANEL
                </span>
              </div>
              <span className={`px-2 py-0.5 rounded-pill text-[10px] font-mono uppercase border font-semibold ${selectedMarker.priorityColor}`}>
                {selectedMarker.priorityLevel}
              </span>
            </div>

            {/* Zone Name & Category Badge */}
            <div className="space-y-1 mb-4">
              <div className="flex items-center gap-1.5 text-xs font-mono text-primary font-medium">
                {React.createElement(categoryConfig[selectedMarker.category].icon, { className: "w-3.5 h-3.5" })}
                <span>{selectedMarker.categoryLabel}</span>
              </div>
              <h3 className="text-base font-bold tracking-tight text-ink">
                {selectedMarker.name}
              </h3>
              <div className="flex items-center gap-2 text-[11px] font-mono text-ink-tertiary">
                <MapPin className="w-3 h-3 text-ink-subtle" />
                <span>{selectedMarker.lat}, {selectedMarker.lng}</span>
              </div>
            </div>

            {/* 6 KEY METRICS REQUIRED BY USER */}
            <div className="space-y-3 font-mono text-xs mb-4">
              {/* Damage percentage */}
              <div className="p-2.5 rounded bg-canvas border border-hairline space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-ink-subtle">Damage Percentage:</span>
                  <span className="text-red-400 font-bold">{selectedMarker.damagePct}% Collapsed</span>
                </div>
                <div className="w-full h-1.5 bg-surface-3 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-500 rounded-full transition-all duration-500" 
                    style={{ width: `${selectedMarker.damagePct}%` }}
                  />
                </div>
              </div>

              {/* Verified Beneficiaries */}
              <div className="p-2.5 rounded bg-canvas border border-hairline flex items-center justify-between">
                <span className="text-ink-subtle flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-primary" /> Verified Beneficiaries:
                </span>
                <span className="text-ink font-bold text-sm">
                  {selectedMarker.verifiedBeneficiaries.toLocaleString()} victims
                </span>
              </div>

              {/* Aid Required vs Distributed */}
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 rounded bg-canvas border border-hairline">
                  <div className="text-[10px] text-ink-tertiary uppercase">Aid Required:</div>
                  <div className="text-red-400 font-bold mt-0.5">
                    ${selectedMarker.aidRequiredUSD.toLocaleString()}
                  </div>
                </div>
                <div className="p-2.5 rounded bg-canvas border border-hairline">
                  <div className="text-[10px] text-ink-tertiary uppercase">Aid Distributed:</div>
                  <div className="text-emerald-400 font-bold mt-0.5">
                    ${selectedMarker.aidDistributedUSD.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Distribution progress */}
              <div className="p-2.5 rounded bg-canvas border border-hairline space-y-1">
                <div className="flex items-center justify-between text-[10px] text-ink-subtle">
                  <span>Funding Fulfillment:</span>
                  <span className="text-ink font-medium">
                    {Math.round((selectedMarker.aidDistributedUSD / selectedMarker.aidRequiredUSD) * 100)}% Fulfilled
                  </span>
                </div>
                <div className="w-full h-1 bg-surface-3 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full" 
                    style={{ width: `${Math.min(100, Math.round((selectedMarker.aidDistributedUSD / selectedMarker.aidRequiredUSD) * 100))}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Field Triage Notes */}
            <div className="p-3 rounded bg-canvas border border-hairline text-xs space-y-1.5 mb-4">
              <div className="text-[10px] font-mono uppercase text-ink-tertiary font-semibold flex items-center gap-1">
                <Info className="w-3 h-3 text-primary" /> Tactical Triage Assessment:
              </div>
              <p className="text-xs text-ink-subtle leading-relaxed">
                {selectedMarker.triageDetails}
              </p>
              <div className="pt-2 border-t border-hairline text-[10px] font-mono text-ink-muted">
                <span className="text-ink-tertiary uppercase">Deployed: </span>
                <span>{selectedMarker.suppliesDeployed}</span>
              </div>
            </div>
          </div>

          {/* Direct CTA button to disburse / inspect */}
          <div className="space-y-2 pt-2 border-t border-hairline">
            <a
              href="#donation-terminal"
              className="w-full py-2.5 px-3 rounded-md bg-primary hover:bg-primary-hover active:bg-primary-focus text-white text-xs font-medium tracking-button flex items-center justify-center gap-1.5 transition-colors"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Direct Aid to {selectedMarker.name.split(" ")[0]}</span>
            </a>
            <div className="text-center">
              <span className="text-[10px] font-mono text-ink-tertiary">
                Committed to Merkle Root via BeneficiaryRegistry.sol
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
