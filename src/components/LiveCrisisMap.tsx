"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { 
  Flame, 
  AlertTriangle, 
  PlusSquare, 
  Building2, 
  Users, 
  Truck, 
  Crosshair, 
  Navigation, 
  Radio, 
  Layers, 
  Search, 
  Maximize2, 
  Minimize2, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  MapPin, 
  Activity, 
  ShieldAlert, 
  ShieldCheck, 
  Zap, 
  Info, 
  ExternalLink, 
  X, 
  FileText, 
  Sun,
  Droplet,
  CheckCircle2,
  Compass,
  CircleDot,
  ChevronRight,
  ChevronDown
} from "lucide-react";

export type MarkerCategory = 
  | "severe_damage" 
  | "trapped_priority" 
  | "hospital" 
  | "relief_center" 
  | "beneficiaries" 
  | "response_teams";

export interface ZoneQuickStats {
  capacity?: string;
  emergencyBeds?: number;
  medicalSupplies?: "CRITICAL" | "LOW" | "ADEQUATE" | "SURPLUS";
  trappedEst?: number;
  searchProgress?: string;
  activeVehicles?: number;
  shelterCapacity?: number;
  shortLabel?: string;
}

export interface ZoneIncident {
  time: string;
  type: string;
  description: string;
  severity: "CRITICAL" | "HIGH" | "MODERATE";
}

export interface ZoneBlockchainTx {
  hash: string;
  chain: "Polygon Amoy" | "ETH Sepolia";
  amount: string;
  beneficiaryBatch: string;
  time: string;
}

export interface MapZoneMarker {
  id: string;
  name: string;
  shortName: string;
  sector: string;
  city: string;
  category: MarkerCategory;
  categoryLabel: string;
  // Normalized coordinate for SVG canvas (0 to 1000)
  x: number;
  y: number;
  lat: number;
  lng: number;
  priorityLevel: "CRITICAL P1" | "URGENT SOS P1" | "HIGH P2" | "ACTIVE FACILITY" | "LOGISTICS DEPOT" | "VERIFIED CLUSTER";
  priorityColor: string;
  damagePct: number;
  verifiedBeneficiaries: number;
  aidRequiredUSD: number;
  aidDistributedUSD: number;
  populationAffected: number;
  hospitalsCount: number;
  reliefCentersCount: number;
  responseTeamsCount: number;
  triageDetails: string;
  priorityAction: string;
  suppliesDeployed: string;
  contactChannel: string;
  quickStats: ZoneQuickStats;
  incidents: ZoneIncident[];
  blockchainTxs: ZoneBlockchainTx[];
  hasPulseRipple?: boolean;
}

interface LiveCrisisMapProps {
  crisisId?: string;
  crisisTitle?: string;
  locationName?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// 22 EXACT REALISTIC OPERATIONAL DISASTER MARKERS MATCHING REFERENCE IMAGE
// ─────────────────────────────────────────────────────────────────────────────

const operationalMapZones: MapZoneMarker[] = [
  // 1. Severe Damage Zones (Red Fire Markers)
  {
    id: "zone-damage-1",
    name: "Kahramanmaraş Epicenter Sector Alpha",
    shortName: "Epicenter Sector Alpha",
    sector: "Sector Alpha-1 (Central Onikişubat)",
    city: "Kahramanmaraş",
    category: "severe_damage",
    categoryLabel: "Severe Damage Zone",
    x: 500,
    y: 450,
    lat: 37.5854,
    lng: 36.9372,
    priorityLevel: "CRITICAL P1",
    priorityColor: "text-red-400 bg-red-950/60 border-red-800/80",
    damagePct: 94,
    verifiedBeneficiaries: 3420,
    aidRequiredUSD: 450000,
    aidDistributedUSD: 290000,
    populationAffected: 18762,
    hospitalsCount: 7,
    reliefCentersCount: 5,
    responseTeamsCount: 2,
    triageDetails: "Epicenter high-density collapse. Multi-story reinforced concrete failure across 48 residential buildings. Gas grid isolated. High casualty probability.",
    priorityAction: "Increase medical & search-and-rescue allocation. Deploy mobile field surgical units to Sector Alpha.",
    suppliesDeployed: "1,200 Thermal Pods • 4 Mobile Trauma Units • 2,400 Ration Vouchers",
    contactChannel: "AFAD VHF Ch 9 • Relay Sat: TR-04",
    hasPulseRipple: true,
    quickStats: {
      trappedEst: 28,
      searchProgress: "64% Cleared",
      medicalSupplies: "CRITICAL",
      shortLabel: "94% Collapsed • Gas Isolated",
    },
    incidents: [
      { time: "14:32:01 UTC", type: "Seismic Mainshock", description: "M7.8 Epicentral strike with 0.72g PGA recorded", severity: "CRITICAL" },
      { time: "14:48:20 UTC", type: "Structural Breach", description: "Collapse of 12-story residential block in Dulkadiroğlu", severity: "CRITICAL" },
    ],
    blockchainTxs: [
      { hash: "0x9f1a...4b22", chain: "Polygon Amoy", amount: "$50,000 POL", beneficiaryBatch: "Merkle Batch #8812", time: "12s ago" },
      { hash: "0x3e77...9c11", chain: "ETH Sepolia", amount: "15.0 ETH ($41,250)", beneficiaryBatch: "Trauma Unlock #01", time: "2m ago" },
    ],
  },
  {
    id: "zone-damage-2",
    name: "Gaziantep Historic Citadel Quarter",
    shortName: "Gaziantep Citadel",
    sector: "Sector Bravo-2 (Şahinbey)",
    city: "Gaziantep",
    category: "severe_damage",
    categoryLabel: "Severe Damage Zone",
    x: 770,
    y: 780,
    lat: 37.0662,
    lng: 37.3833,
    priorityLevel: "CRITICAL P1",
    priorityColor: "text-red-400 bg-red-950/60 border-red-800/80",
    damagePct: 86,
    verifiedBeneficiaries: 2150,
    aidRequiredUSD: 320000,
    aidDistributedUSD: 210000,
    populationAffected: 14200,
    hospitalsCount: 4,
    reliefCentersCount: 3,
    responseTeamsCount: 3,
    triageDetails: "Masonry failure in ancient castle quarter and perimeter multi-story apartment complexes.",
    priorityAction: "Deploy heavy crane equipment and establish secondary dust filtration corridor.",
    suppliesDeployed: "800 Emergency Tents • 1,500 Water Filtration Kits",
    contactChannel: "Relief Net Ch 4",
    quickStats: {
      trappedEst: 14,
      searchProgress: "78% Cleared",
      medicalSupplies: "LOW",
      shortLabel: "86% Collapsed • Heavy Cranes",
    },
    incidents: [
      { time: "14:41:10 UTC", type: "Heritage Damage", description: "Partial bastion collapse at historic citadel", severity: "HIGH" },
    ],
    blockchainTxs: [
      { hash: "0x4c88...1d09", chain: "Polygon Amoy", amount: "$35,000 POL", beneficiaryBatch: "Merkle Batch #8819", time: "1m ago" },
    ],
  },
  {
    id: "zone-damage-3",
    name: "North Maraş Mountain Pass (Göksun corridor)",
    shortName: "Göksun Fault Ridge",
    sector: "Sector Alpha-North",
    city: "Göksun",
    category: "severe_damage",
    categoryLabel: "Severe Damage Zone",
    x: 325,
    y: 110,
    lat: 37.8912,
    lng: 36.6512,
    priorityLevel: "CRITICAL P1",
    priorityColor: "text-red-400 bg-red-950/60 border-red-800/80",
    damagePct: 88,
    verifiedBeneficiaries: 1120,
    aidRequiredUSD: 180000,
    aidDistributedUSD: 110000,
    populationAffected: 6200,
    hospitalsCount: 1,
    reliefCentersCount: 1,
    responseTeamsCount: 1,
    triageDetails: "Mountain pass bridge rupture. Landslide blocking east artery.",
    priorityAction: "Air-drop winterized emergency shelters.",
    suppliesDeployed: "Helicopter sling payloads • Winter packs",
    contactChannel: "Mountain Radio Ch 3",
    quickStats: { trappedEst: 6, medicalSupplies: "LOW", shortLabel: "88% Collapsed • Ridge Bridge" },
    incidents: [],
    blockchainTxs: [],
  },
  {
    id: "zone-damage-4",
    name: "Pazarcık Central Fault Trench",
    shortName: "Pazarcık Fault Trench",
    sector: "Sector Gamma-1",
    city: "Pazarcık",
    category: "severe_damage",
    categoryLabel: "Severe Damage Zone",
    x: 270,
    y: 330,
    lat: 37.4878,
    lng: 37.2981,
    priorityLevel: "CRITICAL P1",
    priorityColor: "text-red-400 bg-red-950/60 border-red-800/80",
    damagePct: 92,
    verifiedBeneficiaries: 1980,
    aidRequiredUSD: 280000,
    aidDistributedUSD: 190000,
    populationAffected: 11500,
    hospitalsCount: 1,
    reliefCentersCount: 2,
    responseTeamsCount: 3,
    triageDetails: "Surface rupture offset 4.2 meters across main street. Structural collapse.",
    priorityAction: "Deploy high-power acoustic sensors.",
    suppliesDeployed: "4 Hydraulic spreaders • K9 search units",
    contactChannel: "Pazarcık Rescue Ch 2",
    quickStats: { trappedEst: 16, medicalSupplies: "CRITICAL", shortLabel: "92% Collapsed • 4.2m Offset" },
    incidents: [],
    blockchainTxs: [],
  },
  {
    id: "zone-damage-5",
    name: "Nurdağı Overpass Collapse",
    shortName: "Nurdağı Overpass",
    sector: "Sector Echo-1",
    city: "Nurdağı",
    category: "severe_damage",
    categoryLabel: "Severe Damage Zone",
    x: 260,
    y: 505,
    lat: 37.1775,
    lng: 36.7378,
    priorityLevel: "CRITICAL P1",
    priorityColor: "text-red-400 bg-red-950/60 border-red-800/80",
    damagePct: 84,
    verifiedBeneficiaries: 1450,
    aidRequiredUSD: 210000,
    aidDistributedUSD: 140000,
    populationAffected: 7800,
    hospitalsCount: 1,
    reliefCentersCount: 2,
    responseTeamsCount: 2,
    triageDetails: "Interchange bridge collapsed on transit corridor.",
    priorityAction: "Clear concrete slabs for vehicle passage.",
    suppliesDeployed: "Heavy cranes • Fuel tankers",
    contactChannel: "Highway Relay Ch 8",
    quickStats: { trappedEst: 8, medicalSupplies: "LOW", shortLabel: "84% Collapsed • Overpass" },
    incidents: [],
    blockchainTxs: [],
  },
  {
    id: "zone-damage-6",
    name: "Türkoğlu South Railway Bridge",
    shortName: "Türkoğlu Railway",
    sector: "Sector South-2",
    city: "Türkoğlu",
    category: "severe_damage",
    categoryLabel: "Severe Damage Zone",
    x: 370,
    y: 585,
    lat: 37.3812,
    lng: 36.8421,
    priorityLevel: "CRITICAL P1",
    priorityColor: "text-red-400 bg-red-950/60 border-red-800/80",
    damagePct: 80,
    verifiedBeneficiaries: 890,
    aidRequiredUSD: 160000,
    aidDistributedUSD: 105000,
    populationAffected: 5400,
    hospitalsCount: 1,
    reliefCentersCount: 1,
    responseTeamsCount: 1,
    triageDetails: "Railway tracks buckled. Industrial warehouse failure.",
    priorityAction: "Re-route logistics to secondary road.",
    suppliesDeployed: "Excavators • Track repair teams",
    contactChannel: "Rail Comms 142.1 MHz",
    quickStats: { trappedEst: 4, medicalSupplies: "ADEQUATE", shortLabel: "80% Collapsed • Rail Buckle" },
    incidents: [],
    blockchainTxs: [],
  },
  {
    id: "zone-damage-7",
    name: "İslahiye Foothill Residential Block",
    shortName: "İslahiye Foothills",
    sector: "Sector South-3",
    city: "İslahiye",
    category: "severe_damage",
    categoryLabel: "Severe Damage Zone",
    x: 330,
    y: 690,
    lat: 37.0272,
    lng: 36.6317,
    priorityLevel: "CRITICAL P1",
    priorityColor: "text-red-400 bg-red-950/60 border-red-800/80",
    damagePct: 89,
    verifiedBeneficiaries: 1620,
    aidRequiredUSD: 240000,
    aidDistributedUSD: 160000,
    populationAffected: 8900,
    hospitalsCount: 1,
    reliefCentersCount: 2,
    responseTeamsCount: 2,
    triageDetails: "Mountain slope collapse affecting 32 residential blocks.",
    priorityAction: "Deploy geo-stabilizers and urgent SAR.",
    suppliesDeployed: "Medical field squads • Tent cities",
    contactChannel: "İslahiye Relay #4",
    quickStats: { trappedEst: 11, medicalSupplies: "LOW", shortLabel: "89% Collapsed • Slope Slip" },
    incidents: [],
    blockchainTxs: [],
  },
  {
    id: "zone-damage-8",
    name: "Dulkadiroğlu Industrial Strip",
    shortName: "Dulkadiroğlu Strip",
    sector: "Sector East-1",
    city: "Dulkadiroğlu",
    category: "severe_damage",
    categoryLabel: "Severe Damage Zone",
    x: 620,
    y: 470,
    lat: 37.5612,
    lng: 36.9812,
    priorityLevel: "CRITICAL P1",
    priorityColor: "text-red-400 bg-red-950/60 border-red-800/80",
    damagePct: 91,
    verifiedBeneficiaries: 2400,
    aidRequiredUSD: 330000,
    aidDistributedUSD: 220000,
    populationAffected: 12800,
    hospitalsCount: 2,
    reliefCentersCount: 2,
    responseTeamsCount: 2,
    triageDetails: "Heavy concrete collapse in industrial sector. Chemical storage isolated.",
    priorityAction: "Inspect chemical perimeter and maintain water lines.",
    suppliesDeployed: "Hazard teams • Thermal cameras",
    contactChannel: "Dulkadiroğlu VHF #6",
    quickStats: { trappedEst: 15, medicalSupplies: "CRITICAL", shortLabel: "91% Collapsed • Industrial" },
    incidents: [],
    blockchainTxs: [],
  },
  {
    id: "zone-damage-9",
    name: "Adıyaman Western Sector",
    shortName: "Adıyaman West",
    sector: "Sector East-Adıyaman",
    city: "Adıyaman",
    category: "severe_damage",
    categoryLabel: "Severe Damage Zone",
    x: 825,
    y: 200,
    lat: 37.7648,
    lng: 38.2786,
    priorityLevel: "CRITICAL P1",
    priorityColor: "text-red-400 bg-red-950/60 border-red-800/80",
    damagePct: 85,
    verifiedBeneficiaries: 1850,
    aidRequiredUSD: 260000,
    aidDistributedUSD: 175000,
    populationAffected: 9400,
    hospitalsCount: 2,
    reliefCentersCount: 2,
    responseTeamsCount: 2,
    triageDetails: "High damage to western apartment belt. Water mains disrupted.",
    priorityAction: "Deliver potable water purification systems.",
    suppliesDeployed: "Water purification units • Emergency food",
    contactChannel: "Adıyaman OCHA #1",
    quickStats: { trappedEst: 9, medicalSupplies: "LOW", shortLabel: "85% Collapsed • Water Main" },
    incidents: [],
    blockchainTxs: [],
  },
  {
    id: "zone-damage-10",
    name: "Gaziantep North Highway Access",
    shortName: "Gaziantep North",
    sector: "Sector North-Gaziantep",
    city: "Gaziantep",
    category: "severe_damage",
    categoryLabel: "Severe Damage Zone",
    x: 700,
    y: 630,
    lat: 37.1512,
    lng: 37.3212,
    priorityLevel: "CRITICAL P1",
    priorityColor: "text-red-400 bg-red-950/60 border-red-800/80",
    damagePct: 81,
    verifiedBeneficiaries: 1400,
    aidRequiredUSD: 200000,
    aidDistributedUSD: 135000,
    populationAffected: 7200,
    hospitalsCount: 1,
    reliefCentersCount: 1,
    responseTeamsCount: 2,
    triageDetails: "Residential damage along northern arterial boulevard.",
    priorityAction: "Maintain open ambulance corridor.",
    suppliesDeployed: "Ambulance fleet • Triage tents",
    contactChannel: "Gaziantep Transit #2",
    quickStats: { trappedEst: 7, medicalSupplies: "ADEQUATE", shortLabel: "81% Collapsed • Arterial Corridor" },
    incidents: [],
    blockchainTxs: [],
  },

  // 2. Trapped / Priority Zones (Amber Warning Triangles)
  {
    id: "zone-trapped-1",
    name: "Pazarcık Subterranean Void Space",
    shortName: "Pazarcık Void SOS",
    sector: "Sector Gamma Void B-4",
    city: "Pazarcık",
    category: "trapped_priority",
    categoryLabel: "Trapped / Priority",
    x: 230,
    y: 395,
    lat: 37.4712,
    lng: 37.2812,
    priorityLevel: "URGENT SOS P1",
    priorityColor: "text-amber-400 bg-amber-950/60 border-amber-800/80",
    damagePct: 90,
    verifiedBeneficiaries: 620,
    aidRequiredUSD: 140000,
    aidDistributedUSD: 95000,
    populationAffected: 3200,
    hospitalsCount: 1,
    reliefCentersCount: 1,
    responseTeamsCount: 3,
    triageDetails: "Acoustic detection confirmed 18 trapped victims in Void B-4.",
    priorityAction: "Maintain oxygen feed and silent drilling protocol.",
    suppliesDeployed: "Borescopes • Oxygen pumps",
    contactChannel: "SAR Silent Ch 1",
    hasPulseRipple: true,
    quickStats: { trappedEst: 18, medicalSupplies: "LOW", shortLabel: "18 Trapped • Void B-4 Active" },
    incidents: [],
    blockchainTxs: [],
  },
  {
    id: "zone-trapped-2",
    name: "Onikişubat Central Apartment Void",
    shortName: "Onikişubat Void SOS",
    sector: "Sector Alpha-Center",
    city: "Kahramanmaraş",
    category: "trapped_priority",
    categoryLabel: "Trapped / Priority",
    x: 525,
    y: 240,
    lat: 37.6112,
    lng: 36.9412,
    priorityLevel: "URGENT SOS P1",
    priorityColor: "text-amber-400 bg-amber-950/60 border-amber-800/80",
    damagePct: 93,
    verifiedBeneficiaries: 840,
    aidRequiredUSD: 180000,
    aidDistributedUSD: 120000,
    populationAffected: 4500,
    hospitalsCount: 1,
    reliefCentersCount: 1,
    responseTeamsCount: 3,
    triageDetails: "Pancake collapse of 8-story block. Multiple acoustic signals detected.",
    priorityAction: "Deploy micro-tunneling rescue gear.",
    suppliesDeployed: "Micro-drills • Fiber optic cameras",
    contactChannel: "SAR Sector Ch 5",
    quickStats: { trappedEst: 12, medicalSupplies: "CRITICAL", shortLabel: "12 Trapped • Pancake Void" },
    incidents: [],
    blockchainTxs: [],
  },
  {
    id: "zone-trapped-3",
    name: "Türkoğlu South Rubble Pocket",
    shortName: "Türkoğlu Rubble Pocket",
    sector: "Sector South-1",
    city: "Türkoğlu",
    category: "trapped_priority",
    categoryLabel: "Trapped / Priority",
    x: 395,
    y: 670,
    lat: 37.3512,
    lng: 36.8712,
    priorityLevel: "URGENT SOS P1",
    priorityColor: "text-amber-400 bg-amber-950/60 border-amber-800/80",
    damagePct: 83,
    verifiedBeneficiaries: 450,
    aidRequiredUSD: 95000,
    aidDistributedUSD: 65000,
    populationAffected: 2100,
    hospitalsCount: 1,
    reliefCentersCount: 1,
    responseTeamsCount: 2,
    triageDetails: "Survivors calling from cellar void. Heavy concrete cutter required.",
    priorityAction: "Deploy diamond-blade hydraulic cutters.",
    suppliesDeployed: "Concrete cutters • Splints",
    contactChannel: "SAR Türkoğlu #1",
    quickStats: { trappedEst: 5, medicalSupplies: "ADEQUATE", shortLabel: "5 Trapped • Cellar Void" },
    incidents: [],
    blockchainTxs: [],
  },
  {
    id: "zone-trapped-4",
    name: "East Adıyaman Transit Void",
    shortName: "Adıyaman Transit Void",
    sector: "Sector East-Transit",
    city: "Adıyaman",
    category: "trapped_priority",
    categoryLabel: "Trapped / Priority",
    x: 775,
    y: 245,
    lat: 37.7412,
    lng: 38.2512,
    priorityLevel: "URGENT SOS P1",
    priorityColor: "text-amber-400 bg-amber-950/60 border-amber-800/80",
    damagePct: 87,
    verifiedBeneficiaries: 780,
    aidRequiredUSD: 150000,
    aidDistributedUSD: 100000,
    populationAffected: 3900,
    hospitalsCount: 1,
    reliefCentersCount: 1,
    responseTeamsCount: 2,
    triageDetails: "Multi-vehicle compression in transit tunnel.",
    priorityAction: "Clear tunnel mouth with heavy dozers.",
    suppliesDeployed: "Dozers • Portable ventilators",
    contactChannel: "Tunnel Rescue Ch 9",
    quickStats: { trappedEst: 7, medicalSupplies: "LOW", shortLabel: "7 Trapped • Tunnel Void" },
    incidents: [],
    blockchainTxs: [],
  },

  // 3. Hospitals & Triage (Cyan / Blue Glowing Circles with Hospital Icon)
  {
    id: "zone-hospital-1",
    name: "Kahramanmaraş University Medical Hub",
    shortName: "Maraş University Hospital",
    sector: "Sector Alpha Hospital Hub",
    city: "Kahramanmaraş",
    category: "hospital",
    categoryLabel: "Hospitals & Triage",
    x: 410,
    y: 175,
    lat: 37.5912,
    lng: 36.9124,
    priorityLevel: "ACTIVE FACILITY",
    priorityColor: "text-cyan-400 bg-cyan-950/60 border-cyan-800/80",
    damagePct: 22,
    verifiedBeneficiaries: 850,
    aidRequiredUSD: 140000,
    aidDistributedUSD: 110000,
    populationAffected: 4500,
    hospitalsCount: 1,
    reliefCentersCount: 2,
    responseTeamsCount: 3,
    triageDetails: "Main medical hub. 6 field operating theatres active. Helipad receiving airlifts.",
    priorityAction: "Replenish Type O-Negative blood and surgical trauma kits.",
    suppliesDeployed: "600 Surgical Trauma Kits • 4 Generators",
    contactChannel: "MedCom Direct Ch 12",
    hasPulseRipple: true,
    quickStats: { capacity: "82% Occupied", emergencyBeds: 14, medicalSupplies: "LOW", shortLabel: "14 Beds Free • Surge 82%" },
    incidents: [],
    blockchainTxs: [],
  },
  {
    id: "zone-hospital-2",
    name: "Onikişubat Field Triage Center",
    shortName: "Onikişubat Triage",
    sector: "Sector Alpha-East",
    city: "Onikişubat",
    category: "hospital",
    categoryLabel: "Hospitals & Triage",
    x: 470,
    y: 255,
    lat: 37.5712,
    lng: 36.9312,
    priorityLevel: "ACTIVE FACILITY",
    priorityColor: "text-cyan-400 bg-cyan-950/60 border-cyan-800/80",
    damagePct: 18,
    verifiedBeneficiaries: 520,
    aidRequiredUSD: 95000,
    aidDistributedUSD: 75000,
    populationAffected: 2800,
    hospitalsCount: 1,
    reliefCentersCount: 1,
    responseTeamsCount: 2,
    triageDetails: "Mobile inflatable surgical pods deployed in municipal park.",
    priorityAction: "Supply sterile burn dressings and IV fluids.",
    suppliesDeployed: "Triage pods • IV fluids",
    contactChannel: "Triage Net #3",
    quickStats: { capacity: "75% Occupied", emergencyBeds: 8, medicalSupplies: "ADEQUATE", shortLabel: "8 Beds Free • Inflatable Pods" },
    incidents: [],
    blockchainTxs: [],
  },
  {
    id: "zone-hospital-3",
    name: "Gaziantep Regional Trauma Hospital",
    shortName: "Gaziantep Trauma Hub",
    sector: "Sector Bravo Medical",
    city: "Gaziantep",
    category: "hospital",
    categoryLabel: "Hospitals & Triage",
    x: 720,
    y: 260,
    lat: 37.0589,
    lng: 37.3621,
    priorityLevel: "ACTIVE FACILITY",
    priorityColor: "text-cyan-400 bg-cyan-950/60 border-cyan-800/80",
    damagePct: 15,
    verifiedBeneficiaries: 620,
    aidRequiredUSD: 120000,
    aidDistributedUSD: 95000,
    populationAffected: 3800,
    hospitalsCount: 1,
    reliefCentersCount: 1,
    responseTeamsCount: 2,
    triageDetails: "Tertiary trauma referral hospital. Continuous orthopedic surgery.",
    priorityAction: "Coordinate regional air ambulance transfers.",
    suppliesDeployed: "Orthopedic implants • Oxygen supply",
    contactChannel: "Gaziantep MedCom",
    quickStats: { capacity: "74% Occupied", emergencyBeds: 28, medicalSupplies: "ADEQUATE", shortLabel: "28 Beds Free • Helipad Active" },
    incidents: [],
    blockchainTxs: [],
  },
  {
    id: "zone-hospital-4",
    name: "Andırın Mountain Emergency Clinic",
    shortName: "Andırın Clinic",
    sector: "Sector North-Andırın",
    city: "Andırın",
    category: "hospital",
    categoryLabel: "Hospitals & Triage",
    x: 825,
    y: 615,
    lat: 37.5812,
    lng: 36.3512,
    priorityLevel: "ACTIVE FACILITY",
    priorityColor: "text-cyan-400 bg-cyan-950/60 border-cyan-800/80",
    damagePct: 20,
    verifiedBeneficiaries: 340,
    aidRequiredUSD: 70000,
    aidDistributedUSD: 55000,
    populationAffected: 1800,
    hospitalsCount: 1,
    reliefCentersCount: 1,
    responseTeamsCount: 1,
    triageDetails: "Rural clinic serving isolated mountain hamlets.",
    priorityAction: "Deliver anti-venom and portable ultrasound.",
    suppliesDeployed: "FAST ultrasound • Splints",
    contactChannel: "Andırın VHF #2",
    quickStats: { capacity: "65% Occupied", emergencyBeds: 6, medicalSupplies: "ADEQUATE", shortLabel: "6 Beds Free • Mountain Clinic" },
    incidents: [],
    blockchainTxs: [],
  },
  {
    id: "zone-hospital-5",
    name: "İslahiye South Staging Clinic",
    shortName: "İslahiye Staging Clinic",
    sector: "Sector South-Clinic",
    city: "İslahiye",
    category: "hospital",
    categoryLabel: "Hospitals & Triage",
    x: 365,
    y: 760,
    lat: 37.0112,
    lng: 36.6112,
    priorityLevel: "ACTIVE FACILITY",
    priorityColor: "text-cyan-400 bg-cyan-950/60 border-cyan-800/80",
    damagePct: 25,
    verifiedBeneficiaries: 410,
    aidRequiredUSD: 85000,
    aidDistributedUSD: 65000,
    populationAffected: 2300,
    hospitalsCount: 1,
    reliefCentersCount: 1,
    responseTeamsCount: 1,
    triageDetails: "Staging post for crush injury stabilization before airlift.",
    priorityAction: "Replenish saline and morphine ampoules.",
    suppliesDeployed: "Emergency analgesics • Blood warmers",
    contactChannel: "Clinic Net #7",
    quickStats: { capacity: "88% Occupied", emergencyBeds: 5, medicalSupplies: "CRITICAL", shortLabel: "5 Beds Free • Crush Unit" },
    incidents: [],
    blockchainTxs: [],
  },

  // 4. Relief Centers (Green / Emerald Glowing Circles with Building Icon)
  {
    id: "zone-relief-1",
    name: "AFAD Central Mega-Logistics Hub",
    shortName: "AFAD Mega-Hub",
    sector: "Sector Alpha Logistics",
    city: "Kahramanmaraş",
    category: "relief_center",
    categoryLabel: "Relief Centers",
    x: 600,
    y: 215,
    lat: 37.5689,
    lng: 36.9589,
    priorityLevel: "LOGISTICS DEPOT",
    priorityColor: "text-emerald-400 bg-emerald-950/60 border-emerald-800/80",
    damagePct: 8,
    verifiedBeneficiaries: 4200,
    aidRequiredUSD: 500000,
    aidDistributedUSD: 380000,
    populationAffected: 25000,
    hospitalsCount: 2,
    reliefCentersCount: 1,
    responseTeamsCount: 5,
    triageDetails: "Primary distribution depot. 84 cargo trucks dispatched today.",
    priorityAction: "Accelerate night convoy security escorts.",
    suppliesDeployed: "45,000 MRE Meals • 12,000 Thermal Bags",
    contactChannel: "Logistics Master Ch 1",
    quickStats: { shelterCapacity: 12000, activeVehicles: 84, medicalSupplies: "SURPLUS", shortLabel: "84 Trucks Deployed • 12k Beds" },
    incidents: [],
    blockchainTxs: [],
  },
  {
    id: "zone-relief-2",
    name: "Nurdağı West Relief Camp",
    shortName: "Nurdağı Relief Camp",
    sector: "Sector Echo Depot",
    city: "Nurdağı",
    category: "relief_center",
    categoryLabel: "Relief Centers",
    x: 270,
    y: 560,
    lat: 37.1612,
    lng: 36.7212,
    priorityLevel: "LOGISTICS DEPOT",
    priorityColor: "text-emerald-400 bg-emerald-950/60 border-emerald-800/80",
    damagePct: 5,
    verifiedBeneficiaries: 2100,
    aidRequiredUSD: 230000,
    aidDistributedUSD: 180000,
    populationAffected: 8900,
    hospitalsCount: 1,
    reliefCentersCount: 1,
    responseTeamsCount: 2,
    triageDetails: "Tent camp providing hot soup and winter blankets.",
    priorityAction: "Install second clean water filtration bladder.",
    suppliesDeployed: "Blankets • 50,000L Water bladders",
    contactChannel: "Nurdağı Camp Admin",
    quickStats: { shelterCapacity: 5000, activeVehicles: 24, medicalSupplies: "ADEQUATE", shortLabel: "5,000 Sheltered • Hot Meals" },
    incidents: [],
    blockchainTxs: [],
  },
  {
    id: "zone-relief-3",
    name: "East Adıyaman Thermal Village",
    shortName: "Adıyaman Thermal Village",
    sector: "Sector East Village",
    city: "Adıyaman",
    category: "relief_center",
    categoryLabel: "Relief Centers",
    x: 740,
    y: 485,
    lat: 37.7845,
    lng: 37.6412,
    priorityLevel: "LOGISTICS DEPOT",
    priorityColor: "text-emerald-400 bg-emerald-950/60 border-emerald-800/80",
    damagePct: 2,
    verifiedBeneficiaries: 1950,
    aidRequiredUSD: 220000,
    aidDistributedUSD: 180000,
    populationAffected: 6200,
    hospitalsCount: 1,
    reliefCentersCount: 1,
    responseTeamsCount: 2,
    triageDetails: "Modular container village with solar microgrid.",
    priorityAction: "Deploy 50 additional insulation shells.",
    suppliesDeployed: "Electric heaters • Modular containers",
    contactChannel: "Village VHF #7",
    quickStats: { shelterCapacity: 4500, activeVehicles: 18, medicalSupplies: "ADEQUATE", shortLabel: "450 Displaced Families" },
    incidents: [],
    blockchainTxs: [],
  },
  {
    id: "zone-relief-4",
    name: "South Maraş Hot Kitchen & Depot",
    shortName: "South Maraş Depot",
    sector: "Sector South Depot",
    city: "Kahramanmaraş",
    category: "relief_center",
    categoryLabel: "Relief Centers",
    x: 545,
    y: 735,
    lat: 37.4512,
    lng: 36.9212,
    priorityLevel: "LOGISTICS DEPOT",
    priorityColor: "text-emerald-400 bg-emerald-950/60 border-emerald-800/80",
    damagePct: 6,
    verifiedBeneficiaries: 3100,
    aidRequiredUSD: 310000,
    aidDistributedUSD: 250000,
    populationAffected: 14000,
    hospitalsCount: 1,
    reliefCentersCount: 1,
    responseTeamsCount: 3,
    triageDetails: "Serving 18,000 hot meals daily with digital QR voucher redemption.",
    priorityAction: "Replenish infant nutrition formula.",
    suppliesDeployed: "Flour • Baby formula • Fuel",
    contactChannel: "Kitchen Net #2",
    quickStats: { shelterCapacity: 8000, activeVehicles: 30, medicalSupplies: "ADEQUATE", shortLabel: "18k Hot Meals Daily" },
    incidents: [],
    blockchainTxs: [],
  },

  // 5. Verified Beneficiaries (Purple Glowing Circles with User Icon)
  {
    id: "zone-beneficiary-1",
    name: "Merkle Verified Victim Cluster #8812",
    shortName: "Merkle Node #8812",
    sector: "Sector Alpha Merkle Node",
    city: "Onikişubat",
    category: "beneficiaries",
    categoryLabel: "Verified Beneficiaries",
    x: 685,
    y: 330,
    lat: 37.5745,
    lng: 36.9212,
    priorityLevel: "VERIFIED CLUSTER",
    priorityColor: "text-purple-400 bg-purple-950/60 border-purple-800/80",
    damagePct: 88,
    verifiedBeneficiaries: 2180,
    aidRequiredUSD: 218000,
    aidDistributedUSD: 218000,
    populationAffected: 7400,
    hospitalsCount: 2,
    reliefCentersCount: 3,
    responseTeamsCount: 2,
    triageDetails: "100% cryptographic Merkle proof verified. Gasless zero-fee payouts.",
    priorityAction: "Process secondary Merkle claims for orphan households.",
    suppliesDeployed: "Direct Smart Voucher Release",
    contactChannel: "Merkle Root: 0x9f1a...4b22",
    hasPulseRipple: true,
    quickStats: { searchProgress: "100% Claim Verified", medicalSupplies: "ADEQUATE", shortLabel: "2,180 Paid • Zero-Gas" },
    incidents: [],
    blockchainTxs: [],
  },
  {
    id: "zone-beneficiary-2",
    name: "Merkle Verified Victim Cluster #8829",
    shortName: "Merkle Node #8829",
    sector: "Sector East Merkle Node",
    city: "Dulkadiroğlu",
    category: "beneficiaries",
    categoryLabel: "Verified Beneficiaries",
    x: 655,
    y: 505,
    lat: 37.5512,
    lng: 37.0112,
    priorityLevel: "VERIFIED CLUSTER",
    priorityColor: "text-purple-400 bg-purple-950/60 border-purple-800/80",
    damagePct: 85,
    verifiedBeneficiaries: 1420,
    aidRequiredUSD: 142000,
    aidDistributedUSD: 142000,
    populationAffected: 4800,
    hospitalsCount: 1,
    reliefCentersCount: 2,
    responseTeamsCount: 1,
    triageDetails: "Field workers registered biometric hash roots without revealing real identities.",
    priorityAction: "Maintain relayer gas tank balance.",
    suppliesDeployed: "$100 USDC Instant Direct Payouts",
    contactChannel: "Contract: 0x7E12...4c09",
    quickStats: { searchProgress: "100% Payouts Completed", medicalSupplies: "ADEQUATE", shortLabel: "1,420 Paid • 100% On-Chain" },
    incidents: [],
    blockchainTxs: [],
  },
  {
    id: "zone-beneficiary-3",
    name: "Merkle Verified Victim Cluster #8841",
    shortName: "Merkle Node #8841",
    sector: "Sector South Merkle Node",
    city: "Türkoğlu",
    category: "beneficiaries",
    categoryLabel: "Verified Beneficiaries",
    x: 570,
    y: 630,
    lat: 37.3612,
    lng: 36.8812,
    priorityLevel: "VERIFIED CLUSTER",
    priorityColor: "text-purple-400 bg-purple-950/60 border-purple-800/80",
    damagePct: 78,
    verifiedBeneficiaries: 980,
    aidRequiredUSD: 98000,
    aidDistributedUSD: 98000,
    populationAffected: 3200,
    hospitalsCount: 1,
    reliefCentersCount: 1,
    responseTeamsCount: 1,
    triageDetails: "Polygon Amoy meta-transactions confirmed in 2.4s.",
    priorityAction: "Distribute offline NFC cards to displaced seniors.",
    suppliesDeployed: "NFC Smart Cards",
    contactChannel: "Polygon Relayer #04",
    quickStats: { searchProgress: "100% Verified", medicalSupplies: "ADEQUATE", shortLabel: "980 Paid • NFC Cards" },
    incidents: [],
    blockchainTxs: [],
  },

  // 6. Active Response Teams (Blue Glowing Circles with Truck Icon)
  {
    id: "zone-team-1",
    name: "AKUT Tactical SAR Squad Alpha",
    shortName: "AKUT Tactical Alpha",
    sector: "Sector Alpha Tactical Grid",
    city: "Onikişubat",
    category: "response_teams",
    categoryLabel: "Active Response Teams",
    x: 645,
    y: 390,
    lat: 37.5812,
    lng: 36.9421,
    priorityLevel: "URGENT SOS P1",
    priorityColor: "text-blue-400 bg-blue-950/60 border-blue-800/80",
    damagePct: 92,
    verifiedBeneficiaries: 180,
    aidRequiredUSD: 65000,
    aidDistributedUSD: 65000,
    populationAffected: 1200,
    hospitalsCount: 1,
    reliefCentersCount: 2,
    responseTeamsCount: 1,
    triageDetails: "18 certified SAR specialists, 4 disaster K9s, and ultrasonic ground radar.",
    priorityAction: "Continue delicate rubble penetration in collapse sector 4.",
    suppliesDeployed: "Heavy hydraulic spreaders • Thermal imaging drones",
    contactChannel: "AKUT Tactical Radio 145.500 MHz",
    hasPulseRipple: true,
    quickStats: { activeVehicles: 6, searchProgress: "Rubble Sector 4 Penetrating", medicalSupplies: "ADEQUATE", shortLabel: "18 Techs • 4 K9s • Radar" },
    incidents: [],
    blockchainTxs: [],
  },
  {
    id: "zone-team-2",
    name: "White Helmets Paramedic Convoy #3",
    shortName: "White Helmets Convoy",
    sector: "Sector South Tactical",
    city: "Türkoğlu",
    category: "response_teams",
    categoryLabel: "Active Response Teams",
    x: 475,
    y: 660,
    lat: 37.3412,
    lng: 36.8512,
    priorityLevel: "URGENT SOS P1",
    priorityColor: "text-blue-400 bg-blue-950/60 border-blue-800/80",
    damagePct: 84,
    verifiedBeneficiaries: 210,
    aidRequiredUSD: 70000,
    aidDistributedUSD: 70000,
    populationAffected: 1500,
    hospitalsCount: 1,
    reliefCentersCount: 1,
    responseTeamsCount: 1,
    triageDetails: "12 combat paramedics with mobile emergency field trauma packs.",
    priorityAction: "Coordinate ambulance airbridge to Adana.",
    suppliesDeployed: "Trauma kits • Mobile oxygenators",
    contactChannel: "Convoy Satcom #3",
    quickStats: { activeVehicles: 4, searchProgress: "Convoy En Route", medicalSupplies: "ADEQUATE", shortLabel: "12 Paramedics • Mobile Unit" },
    incidents: [],
    blockchainTxs: [],
  },
  {
    id: "zone-team-3",
    name: "Gaziantep Heavy Equipment Battalion",
    shortName: "Heavy Equipment Unit",
    sector: "Sector Bravo Battalion",
    city: "Gaziantep",
    category: "response_teams",
    categoryLabel: "Active Response Teams",
    x: 765,
    y: 735,
    lat: 37.0812,
    lng: 37.3712,
    priorityLevel: "URGENT SOS P1",
    priorityColor: "text-blue-400 bg-blue-950/60 border-blue-800/80",
    damagePct: 82,
    verifiedBeneficiaries: 310,
    aidRequiredUSD: 90000,
    aidDistributedUSD: 90000,
    populationAffected: 2200,
    hospitalsCount: 1,
    reliefCentersCount: 1,
    responseTeamsCount: 1,
    triageDetails: "8 heavy tracked excavators and 2 100-ton telescopic cranes clearing arterial routes.",
    priorityAction: "Lift collapsed bridge slab on highway.",
    suppliesDeployed: "100-ton Cranes • Bulldozers",
    contactChannel: "Engineers VHF #8",
    quickStats: { activeVehicles: 10, searchProgress: "Highway Route Clearing", medicalSupplies: "SURPLUS", shortLabel: "8 Excavators • 2 Cranes" },
    incidents: [],
    blockchainTxs: [],
  },
];

// Color config matching exact reference image icons & glow halos
const categoryVisuals: Record<
  MarkerCategory, 
  { label: string; icon: React.ElementType; color: string; badgeColor: string; bgGlow: string; ringColor: string; haloRgb: string }
> = {
  severe_damage: {
    label: "Severe Damage",
    icon: Flame,
    color: "text-red-400",
    badgeColor: "bg-red-950/60 text-red-400 border-red-800/80",
    bgGlow: "bg-red-600",
    ringColor: "border-red-400",
    haloRgb: "239, 68, 68",
  },
  trapped_priority: {
    label: "Trapped / Priority",
    icon: AlertTriangle,
    color: "text-amber-400",
    badgeColor: "bg-amber-950/60 text-amber-400 border-amber-800/80",
    bgGlow: "bg-amber-600",
    ringColor: "border-amber-400",
    haloRgb: "245, 158, 11",
  },
  hospital: {
    label: "Hospitals & Triage",
    icon: PlusSquare,
    color: "text-cyan-400",
    badgeColor: "bg-cyan-950/60 text-cyan-400 border-cyan-800/80",
    bgGlow: "bg-cyan-600",
    ringColor: "border-cyan-400",
    haloRgb: "6, 182, 212",
  },
  relief_center: {
    label: "Relief Centers",
    icon: Building2,
    color: "text-emerald-400",
    badgeColor: "bg-emerald-950/60 text-emerald-400 border-emerald-800/80",
    bgGlow: "bg-emerald-600",
    ringColor: "border-emerald-400",
    haloRgb: "16, 185, 129",
  },
  beneficiaries: {
    label: "Verified Beneficiaries",
    icon: Users,
    color: "text-purple-400",
    badgeColor: "bg-purple-950/60 text-purple-400 border-purple-800/80",
    bgGlow: "bg-purple-600",
    ringColor: "border-purple-400",
    haloRgb: "168, 85, 247",
  },
  response_teams: {
    label: "Response Teams",
    icon: Truck,
    color: "text-blue-400",
    badgeColor: "bg-blue-950/60 text-blue-400 border-blue-800/80",
    bgGlow: "bg-blue-600",
    ringColor: "border-blue-400",
    haloRgb: "59, 130, 246",
  },
};

export function LiveCrisisMap({ 
  crisisId = "turkey-earthquake-2026", 
  crisisTitle = "Turkey-Syria 7.8M Earthquake Emergency",
  locationName = "Kahramanmaraş & Gaziantep Region"
}: LiveCrisisMapProps) {
  const [selectedCategory, setSelectedCategory] = useState<"all" | MarkerCategory>("all");
  const [selectedMarker, setSelectedMarker] = useState<MapZoneMarker>(operationalMapZones[0]);
  const [hoveredMarker, setHoveredMarker] = useState<MapZoneMarker | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLegendOpen, setIsLegendOpen] = useState(true);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [liveEventIndex, setLiveEventIndex] = useState(0);

  // Live dynamic telemetry feed events
  const liveTickerEvents = [
    { title: "Kahramanmaraş Epicenter Sector Alpha", priority: "CRITICAL P1", event: "⚡ Aftershock detected: M4.1 • Depth: 12.4km", time: "14:32:01 UTC" },
    { title: "Pazarcık Void Space Rescue Site", priority: "URGENT SOS P1", event: "📡 Acoustic life sensor confirmed tapping in Sector C void", time: "14:32:08 UTC" },
    { title: "Hospital Kahramanmaraş University Hub", priority: "ACTIVE FACILITY", event: "🚁 MedEvac chopper landed with 4 critical survivors", time: "14:32:15 UTC" },
    { title: "AFAD Central Logistics Depot Gaziantep", priority: "LOGISTICS DEPOT", event: "🚛 Convoy of 14 winterized pod trucks departed", time: "14:32:29 UTC" },
  ];

  // Cycling timer for live telemetry feed
  useEffect(() => {
    const tickerTimer = setInterval(() => {
      setLiveEventIndex((prev) => (prev + 1) % liveTickerEvents.length);
    }, 4500);
    return () => clearInterval(tickerTimer);
  }, []);

  // Filter markers based on category and search query
  const filteredMarkers = useMemo(() => {
    return operationalMapZones.filter((marker) => {
      const matchesCategory = selectedCategory === "all" || marker.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        marker.name.toLowerCase().includes(q) ||
        marker.city.toLowerCase().includes(q) ||
        marker.sector.toLowerCase().includes(q) ||
        marker.categoryLabel.toLowerCase().includes(q) ||
        marker.priorityLevel.toLowerCase().includes(q)
      );
    });
  }, [selectedCategory, searchQuery]);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(2.4, prev + 0.25));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(0.75, prev - 0.25));
  const handleCenter = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setSelectedMarker(operationalMapZones[0]);
  };

  return (
    <section 
      id="live-crisis-map" 
      className={`w-full rounded-2xl bg-[#060a13] border border-slate-800/90 text-slate-100 transition-all ${
        isFullscreen ? "fixed inset-0 z-50 overflow-y-auto p-4 md:p-6 bg-[#04070e] shadow-2xl" : "p-4 md:p-6"
      }`}
    >
      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* MAIN CRISIS MAP INTERFACE (NASA / OPERATIONS CENTER LAYOUT) */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* MAP CANVAS (8 COLS) */}
        <div className="lg:col-span-8 flex flex-col justify-between">
          <div className="relative w-full h-[580px] md:h-[700px] rounded-2xl border border-slate-800/90 overflow-hidden bg-[#060b17] shadow-2xl select-none">
            
            {/* SVG CRISIS INTELLIGENCE MAP VECTOR CANVAS */}
            <svg 
              className="w-full h-full cursor-grab active:cursor-grabbing transition-transform duration-300"
              viewBox="0 0 1000 900"
              style={{
                transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
                transformOrigin: "center center"
              }}
            >
              <defs>
                {/* Radial Gradient for Epicenter Glow */}
                <radialGradient id="epicenterGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#dc2626" stopOpacity="0.85" />
                  <stop offset="35%" stopColor="#dc2626" stopOpacity="0.45" />
                  <stop offset="70%" stopColor="#b91c1c" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#7f1d1d" stopOpacity="0" />
                </radialGradient>

                {/* Damage Heatmap Multi-stop Gradient */}
                <radialGradient id="damageHeatmapGradient" cx="49%" cy="46%" r="55%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.55" />
                  <stop offset="28%" stopColor="#dc2626" stopOpacity="0.45" />
                  <stop offset="55%" stopColor="#ea580c" stopOpacity="0.32" />
                  <stop offset="78%" stopColor="#d97706" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#060b17" stopOpacity="0" />
                </radialGradient>

                {/* Dark Satellite Terrain Mesh Pattern */}
                <pattern id="terrainGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="0.8" />
                </pattern>

                {/* Elevation Topography Contours */}
                <filter id="glowEffect" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* 1. MAP BACKGROUND: DARK SATELLITE TERRAIN & TOPOGRAPHY */}
              <rect width="1000" height="900" fill="#070d1a" />
              <rect width="1000" height="900" fill="url(#terrainGrid)" />

              {/* Realistic Mountainous Ridge Shading (Ahır & Nur Mountains) */}
              <path d="M 0 0 Q 300 200 450 100 T 700 220 T 1000 80 L 1000 0 Z" fill="#091224" opacity="0.6" />
              <path d="M 0 350 Q 200 420 380 320 T 680 400 T 1000 280 L 1000 900 L 0 900 Z" fill="#050a14" opacity="0.4" />
              <path d="M 120 180 Q 280 120 420 220 T 720 180 T 880 320" fill="none" stroke="#13203b" strokeWidth="2.5" strokeDasharray="3, 5" opacity="0.6" />
              <path d="M 80 520 Q 260 460 480 540 T 780 480 T 920 620" fill="none" stroke="#13203b" strokeWidth="2.5" strokeDasharray="3, 5" opacity="0.6" />

              {/* Hydrography (Ceyhan & Asi Rivers) */}
              <path d="M 460 0 C 470 120 440 280 480 360 C 520 440 450 620 430 750 C 410 820 380 900 370 900" fill="none" stroke="#0e3052" strokeWidth="3" opacity="0.75" />
              <path d="M 280 900 C 310 780 330 680 300 580 C 270 480 250 380 290 280" fill="none" stroke="#0e3052" strokeWidth="2" opacity="0.6" />

              {/* 2. ROAD HIGHWAY NETWORK (D825, D360, D650 Corridor) */}
              {/* Highway D825 */}
              <path d="M 150 180 L 270 330 L 260 505 L 330 690 L 370 820" fill="none" stroke="#253858" strokeWidth="3.2" strokeLinecap="round" opacity="0.85" />
              <path d="M 150 180 L 270 330 L 260 505 L 330 690 L 370 820" fill="none" stroke="#4a6999" strokeWidth="1.2" opacity="0.7" />

              {/* Highway D360 */}
              <path d="M 500 150 L 500 450 L 620 470 L 770 780" fill="none" stroke="#253858" strokeWidth="3.2" strokeLinecap="round" opacity="0.85" />
              <path d="M 500 150 L 500 450 L 620 470 L 770 780" fill="none" stroke="#4a6999" strokeWidth="1.2" opacity="0.7" />

              {/* Highway D650 */}
              <path d="M 500 450 L 370 585 L 545 735" fill="none" stroke="#253858" strokeWidth="2.8" opacity="0.7" />

              {/* Arterial Connecting Roads */}
              <path d="M 270 330 L 500 450 L 740 485 L 825 200" fill="none" stroke="#1d2c47" strokeWidth="1.8" opacity="0.6" />
              <path d="M 260 505 L 500 450 L 655 505 L 700 630" fill="none" stroke="#1d2c47" strokeWidth="1.8" opacity="0.6" />

              {/* Highway Route Badges matching reference image */}
              <g transform="translate(190, 260)">
                <rect width="36" height="15" rx="3" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="1" />
                <text x="18" y="11" fill="#ffffff" fontSize="8.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">D825</text>
              </g>

              <g transform="translate(530, 125)">
                <rect width="36" height="15" rx="3" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="1" />
                <text x="18" y="11" fill="#ffffff" fontSize="8.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">D360</text>
              </g>

              <g transform="translate(540, 565)">
                <rect width="36" height="15" rx="3" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="1" />
                <text x="18" y="11" fill="#ffffff" fontSize="8.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">D650</text>
              </g>

              {/* 3. DAMAGE HEATMAP OVERLAY CLOUD (ORGANIC RED / ORANGE SEISMIC ZONE) */}
              <path 
                d="M 480 180 C 620 160 760 240 800 380 C 840 520 780 640 680 720 C 580 800 420 820 320 740 C 220 660 180 500 220 360 C 260 220 380 200 480 180 Z" 
                fill="url(#damageHeatmapGradient)" 
              />
              <path 
                d="M 500 240 C 590 230 680 300 700 400 C 720 500 680 580 610 630 C 540 680 430 690 360 630 C 290 570 270 470 300 380 C 330 290 420 250 500 240 Z" 
                fill="#ef4444" 
                opacity="0.22" 
              />

              {/* 4. CONCENTRIC DASHED RED IMPACT RINGS RADIATING FROM EPICENTER */}
              <circle cx="500" cy="450" r="90" fill="none" stroke="#ef4444" strokeWidth="1.8" opacity="0.85" />
              <circle cx="500" cy="450" r="170" fill="none" stroke="#ef4444" strokeWidth="1.6" strokeDasharray="6, 5" opacity="0.75" />
              <circle cx="500" cy="450" r="280" fill="none" stroke="#ef4444" strokeWidth="1.4" strokeDasharray="7, 6" opacity="0.55" />
              <circle cx="500" cy="450" r="390" fill="none" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="8, 7" opacity="0.35" />

              {/* 5. EPICENTER FOCAL POINT (MATCHING REFERENCE IMAGE) */}
              <g transform="translate(500, 450)">
                {/* Radial Glow Halo */}
                <circle cx="0" cy="0" r="75" fill="url(#epicenterGlow)" />
                
                {/* Concentric Bullseye Rings */}
                <circle cx="0" cy="0" r="28" fill="none" stroke="#ef4444" strokeWidth="2.2" opacity="0.9" />
                <circle cx="0" cy="0" r="18" fill="none" stroke="#ffffff" strokeWidth="1.8" opacity="0.9" />
                <circle cx="0" cy="0" r="8" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
                <circle cx="0" cy="0" r="3" fill="#ffffff" />

                {/* Epicenter Text Box Badge */}
                <g transform="translate(0, -42)">
                  <text x="0" y="0" fill="#fca5a5" fontSize="11" fontWeight="bold" fontFamily="monospace" textAnchor="middle" letterSpacing="1.2">
                    EPICENTER
                  </text>
                  <text x="0" y="14" fill="#ffffff" fontSize="13" fontWeight="900" fontFamily="sans-serif" textAnchor="middle">
                    M7.8
                  </text>
                </g>
              </g>

              {/* 6. GEOGRAPHIC CITY & DISTRICT LABELS (MATCHING REFERENCE IMAGE) */}
              <g fontSize="11" fontFamily="sans-serif" fontWeight="600" fill="#cbd5e1" opacity="0.9">
                {/* Kahramanmaraş */}
                <text x="320" y="245" fill="#ffffff" fontSize="13" fontWeight="bold">Kahramanmaraş</text>
                
                {/* Pazarcık */}
                <text x="185" y="355">Pazarcık</text>

                {/* Nurdağı */}
                <text x="210" y="525">Nurdağı</text>

                {/* İslahiye */}
                <text x="475" y="835">İslahiye</text>

                {/* Gaziantep */}
                <text x="785" y="810" fill="#ffffff" fontSize="13" fontWeight="bold">Gaziantep</text>

                {/* Osmaniye */}
                <text x="35" y="440" fill="#cbd5e1" fontSize="12">Osmaniye</text>

                {/* Göksun */}
                <text x="270" y="65">Göksun</text>

                {/* Andırın */}
                <text x="790" y="150">Andırın</text>

                {/* Adıyaman */}
                <text x="840" y="380">Adıyaman</text>

                {/* Onikişubat (East) */}
                <text x="555" y="425" fill="#e2e8f0" fontSize="10.5">Onikişubat</text>

                {/* Onikişiroğlu (North-East) */}
                <text x="540" y="310" fill="#e2e8f0" fontSize="10.5">Onikişiroğlu</text>

                {/* Dulkadiroğlu */}
                <text x="495" y="510" fill="#e2e8f0" fontSize="10.5">Dulkadiroğlu</text>

                {/* Türkoğlu */}
                <text x="430" y="575" fill="#e2e8f0" fontSize="10.5">Türkoğlu</text>
              </g>

              {/* 7. CIRCULAR GLOWING MAP MARKERS (MATCHING EXACT REFERENCE ICONS & COLORS) */}
              {filteredMarkers.map((marker) => {
                const cfg = categoryVisuals[marker.category];
                const isSelected = selectedMarker.id === marker.id;
                const isHovered = hoveredMarker?.id === marker.id;

                return (
                  <g 
                    key={marker.id}
                    transform={`translate(${marker.x}, ${marker.y})`}
                    className="cursor-pointer transition-transform duration-200"
                    onClick={() => setSelectedMarker(marker)}
                    onMouseEnter={() => setHoveredMarker(marker)}
                    onMouseLeave={() => setHoveredMarker(null)}
                    style={{ transformOrigin: `${marker.x}px ${marker.y}px` }}
                  >
                    {/* Outer Glowing Halo */}
                    <circle 
                      cx="0" 
                      cy="0" 
                      r={isSelected ? 26 : 20} 
                      fill={`rgba(${cfg.haloRgb}, ${isSelected ? 0.45 : isHovered ? 0.35 : 0.22})`} 
                    />

                    {/* Circular Border Ring */}
                    <circle 
                      cx="0" 
                      cy="0" 
                      r={isSelected ? 16 : 13} 
                      fill={`rgb(${cfg.haloRgb})`} 
                      stroke="#ffffff" 
                      strokeWidth={isSelected ? 2.4 : 1.6} 
                    />

                    {/* SVG Icon Centered inside Circle */}
                    <g transform="translate(-7, -7) scale(0.58)">
                      {marker.category === "severe_damage" && (
                        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" fill="#ffffff" />
                      )}

                      {marker.category === "trapped_priority" && (
                        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3ZM12 9v4M12 17h.01" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                      )}

                      {marker.category === "hospital" && (
                        <path d="M18 6v12M6 6v12M6 12h12" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" fill="none" />
                      )}

                      {marker.category === "relief_center" && (
                        <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18ZM6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2M10 6h4M10 10h4M10 14h4M10 18h4" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                      )}

                      {marker.category === "beneficiaries" && (
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                      )}

                      {marker.category === "response_teams" && (
                        <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2M14 18H8M14 18h4l4-4V9a1 1 0 0 0-1-1h-7M6 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM18 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                      )}
                    </g>
                  </g>
                );
              })}
            </svg>

            {/* TOP-LEFT: NORTH GYRO COMPASS (MATCHING REFERENCE IMAGE) */}
            <div className="absolute top-4 left-4 z-20 flex flex-col items-center">
              <div className="w-9 h-9 rounded-full bg-[#0d1527]/90 border border-slate-700/80 backdrop-blur-md flex items-center justify-center shadow-xl">
                <div className="flex flex-col items-center justify-center">
                  <span className="text-[9px] font-mono font-black text-red-400 leading-none">N</span>
                  <div className="w-0.5 h-3 bg-gradient-to-b from-red-500 to-slate-400 mt-0.5" />
                </div>
              </div>
            </div>

            {/* TOP-LEFT: VERTICAL GIS CONTROLS (+, −, ⌖) */}
            <div className="absolute top-16 left-4 z-20 flex flex-col gap-1.5 bg-[#0a1120]/90 backdrop-blur-md p-1 rounded-lg border border-slate-700/80 shadow-2xl font-mono">
              <button
                onClick={handleZoomIn}
                className="w-8 h-8 flex items-center justify-center rounded bg-[#131f36] hover:bg-[#1d2f52] text-slate-200 hover:text-white border border-slate-700/70 transition-colors"
                title="Zoom In (+)"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={handleZoomOut}
                className="w-8 h-8 flex items-center justify-center rounded bg-[#131f36] hover:bg-[#1d2f52] text-slate-200 hover:text-white border border-slate-700/70 transition-colors"
                title="Zoom Out (−)"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={handleCenter}
                className="w-8 h-8 flex items-center justify-center rounded bg-[#131f36] hover:bg-[#1d2f52] text-amber-400 hover:text-amber-300 border border-slate-700/70 transition-colors"
                title="Center Epicenter"
              >
                <Crosshair className="w-4 h-4" />
              </button>
            </div>

            {/* BOTTOM-LEFT: FLOATING HUD LEGEND CARD (MATCHING REFERENCE IMAGE) */}
            <div className="absolute bottom-4 left-4 z-20 w-60 rounded-xl bg-[#090f1d]/95 backdrop-blur-md p-3.5 border border-slate-800 shadow-2xl font-mono text-xs">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/90 text-slate-300">
                <span className="font-bold text-[11px] uppercase tracking-wider text-white">LEGEND</span>
                <button 
                  onClick={() => setIsLegendOpen(!isLegendOpen)}
                  className="text-[10px] text-slate-400 hover:text-white flex items-center gap-0.5"
                >
                  <span>{isLegendOpen ? "Hide" : "Show"}</span>
                  <ChevronRight className={`w-3 h-3 transition-transform ${isLegendOpen ? "rotate-90" : ""}`} />
                </button>
              </div>

              {isLegendOpen && (
                <div className="space-y-2 text-[11px] text-slate-300">
                  <div className="flex items-center gap-2.5">
                    <span className="text-red-400 font-bold text-sm">◎</span>
                    <span>Epicenter</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Flame className="w-3.5 h-3.5 text-red-400" />
                    <span>Severe Damage</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Trapped / Priority</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <PlusSquare className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Hospitals & Triage</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Relief Centers</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Users className="w-3.5 h-3.5 text-purple-400" />
                    <span>Verified Beneficiaries</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Truck className="w-3.5 h-3.5 text-blue-400" />
                    <span>Response Teams</span>
                  </div>

                  {/* Impact Heatmap Bar */}
                  <div className="pt-2 border-t border-slate-800/90 space-y-1">
                    <div className="text-[10px] text-slate-400">Impact Heatmap</div>
                    <div className="w-full h-2 rounded-full bg-gradient-to-r from-amber-500 via-orange-600 to-red-600 border border-slate-700" />
                    <div className="flex justify-between text-[9px] text-slate-500">
                      <span>Low</span>
                      <span>Extreme</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* BOTTOM CENTER: FLOATING LIVE FEED PILL (MATCHING REFERENCE IMAGE) */}
            <div className="absolute bottom-4 left-68 right-4 lg:left-72 lg:right-6 z-20 flex flex-col md:flex-row md:items-center justify-between gap-2 bg-[#080e1c]/95 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-800 shadow-2xl font-mono text-xs text-slate-300">
              <div className="flex items-center gap-2 truncate">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="font-bold text-white uppercase text-[11px] text-emerald-400 shrink-0">● LIVE FEED:</span>
                <span className="text-white font-medium truncate">
                  {liveTickerEvents[liveEventIndex].title}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] shrink-0">
                  {liveTickerEvents[liveEventIndex].priority}
                </span>
              </div>

              <div className="flex items-center gap-2 text-slate-400 text-[10px] shrink-0">
                <span className="text-emerald-400 font-semibold">{liveTickerEvents[liveEventIndex].event}</span>
                <span className="text-slate-600">•</span>
                <span>{liveTickerEvents[liveEventIndex].time}</span>
              </div>
            </div>

            {/* Top-Right Controls: Fullscreen Expand */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 rounded-lg bg-[#0d1527]/90 hover:bg-[#16233d] border border-slate-700/80 text-slate-300 hover:text-white transition-colors shadow-xl"
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Map"}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* RIGHT-SIDE ZONE INSPECTION PANEL (4 COLS) */}
        {/* ─────────────────────────────────────────────────────────────────── */}
        <div className="lg:col-span-4 flex flex-col justify-between p-5 rounded-2xl bg-[#080d1a] border border-slate-800/90 space-y-4 shadow-2xl">
          <div>
            {/* Category & Status Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-1.5 text-xs font-mono text-red-400 font-semibold">
                {React.createElement(categoryVisuals[selectedMarker.category].icon, { className: "w-3.5 h-3.5" })}
                <span>{selectedMarker.categoryLabel}</span>
              </div>
              <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono uppercase border font-bold ${selectedMarker.priorityColor}`}>
                {selectedMarker.priorityLevel}
              </span>
            </div>

            {/* Zone Name & Location */}
            <div className="space-y-1 mb-4">
              <h3 className="text-lg font-bold tracking-tight text-white">
                {selectedMarker.name}
              </h3>
              <div className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>{selectedMarker.lat.toFixed(4)}°N, {selectedMarker.lng.toFixed(4)}°E • {selectedMarker.sector}</span>
              </div>
            </div>

            {/* Core Metrics */}
            <div className="space-y-3.5 font-mono text-xs mb-4">
              {/* Damage Percentage Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Damage Percentage</span>
                  <span className="text-red-400 font-bold">{selectedMarker.damagePct}%</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className="h-full bg-red-600 rounded-full transition-all duration-700" 
                    style={{ width: `${selectedMarker.damagePct}%` }}
                  />
                </div>
              </div>

              {/* Verified Beneficiaries */}
              <div className="p-3 rounded-xl bg-[#0c1324] border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">Verified Beneficiaries</div>
                  <div className="text-xl font-bold text-white mt-0.5">{selectedMarker.verifiedBeneficiaries.toLocaleString()}</div>
                  <div className="text-[10px] text-slate-500">victims registered</div>
                </div>
                <Users className="w-6 h-6 text-purple-400 opacity-80" />
              </div>

              {/* Aid Required vs Distributed */}
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 rounded-xl bg-[#0c1324] border border-slate-800">
                  <div className="text-[9px] text-slate-400 uppercase">Aid Required</div>
                  <div className="text-red-400 font-bold text-sm mt-0.5">
                    ${selectedMarker.aidRequiredUSD.toLocaleString()}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#0c1324] border border-slate-800">
                  <div className="text-[9px] text-slate-400 uppercase">Aid Distributed</div>
                  <div className="text-emerald-400 font-bold text-sm mt-0.5">
                    ${selectedMarker.aidDistributedUSD.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Funding Fulfilment */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Funding Fulfilment</span>
                  <span className="text-cyan-400 font-bold">
                    {Math.round((selectedMarker.aidDistributedUSD / selectedMarker.aidRequiredUSD) * 100)}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-cyan-500 rounded-full" 
                    style={{ width: `${Math.min(100, Math.round((selectedMarker.aidDistributedUSD / selectedMarker.aidRequiredUSD) * 100))}%` }}
                  />
                </div>
              </div>

              {/* Hospital Summary */}
              <div className="p-3 rounded-xl bg-[#0c1324] border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-cyan-950/80 border border-cyan-800/80 flex items-center justify-center">
                    <PlusSquare className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-white font-bold">{selectedMarker.hospitalsCount} Hospitals</div>
                    <div className="text-[10px] text-slate-400">2 Critical Surge Status</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tactical Triage Assessment Callout */}
            <div className="p-3.5 rounded-xl bg-[#0b1222] border border-slate-800 space-y-2 text-xs font-mono">
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-cyan-400" />
                TACTICAL TRIAGE ASSESSMENT
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {selectedMarker.triageDetails}
              </p>
              
              <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-800/60 text-red-200 text-[11px] space-y-1">
                <div className="font-bold uppercase tracking-wider text-[10px] text-red-400 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-red-400" />
                  PRIORITY ACTION
                </div>
                <div className="font-sans leading-relaxed">{selectedMarker.priorityAction}</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="w-full py-2.5 px-4 rounded-xl bg-[#121c33] hover:bg-[#182747] text-cyan-300 hover:text-white border border-cyan-500/40 hover:border-cyan-400 text-xs font-mono font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>VIEW DETAILED ZONE REPORT</span>
            </button>

            <a
              href="#donation-terminal"
              className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Direct Emergency Liquidity to {selectedMarker.name.split(" ")[0]}</span>
            </a>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* DETAILED ZONE AUDIT REPORT MODAL */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-2xl bg-[#090e1c] border border-slate-700 p-6 shadow-2xl text-slate-100 font-mono space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[10px] text-cyan-400 uppercase tracking-widest font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  CRYPTOGRAPHIC ZONE AUDIT REPORT
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {selectedMarker.name}
                </h3>
                <p className="text-xs text-slate-400">
                  {selectedMarker.sector} • GPS: {selectedMarker.lat.toFixed(4)}°N, {selectedMarker.lng.toFixed(4)}°E
                </p>
              </div>

              <button
                onClick={() => setIsReportModalOpen(false)}
                className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-[#0d1424] border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase">Damage Ratio</div>
                <div className="text-red-400 font-bold text-lg mt-0.5">{selectedMarker.damagePct}%</div>
                <div className="text-[10px] text-slate-500">Structural Collapse</div>
              </div>
              <div className="p-3 rounded-lg bg-[#0d1424] border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase">Beneficiaries</div>
                <div className="text-purple-300 font-bold text-lg mt-0.5">{selectedMarker.verifiedBeneficiaries}</div>
                <div className="text-[10px] text-slate-500">Merkle Verified</div>
              </div>
              <div className="p-3 rounded-lg bg-[#0d1424] border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase">Aid Disbursed</div>
                <div className="text-emerald-400 font-bold text-lg mt-0.5">${selectedMarker.aidDistributedUSD.toLocaleString()}</div>
                <div className="text-[10px] text-slate-500">of ${selectedMarker.aidRequiredUSD.toLocaleString()} Req</div>
              </div>
              <div className="p-3 rounded-lg bg-[#0d1424] border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase">Population</div>
                <div className="text-white font-bold text-lg mt-0.5">{selectedMarker.populationAffected.toLocaleString()}</div>
                <div className="text-[10px] text-slate-500">In Impact Zone</div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[#0d1424] border border-slate-800 space-y-2 text-xs">
              <div className="font-bold text-cyan-400 uppercase text-[11px]">Triage & Field Log</div>
              <p className="text-slate-300 leading-relaxed font-sans text-xs">
                {selectedMarker.triageDetails}
              </p>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                <span className="text-slate-500 uppercase">Deployed Equipment: </span>
                <span className="text-slate-200">{selectedMarker.suppliesDeployed}</span>
              </div>
              <div className="text-[11px] text-slate-400">
                <span className="text-slate-500 uppercase">Comms Channel: </span>
                <span className="text-cyan-300">{selectedMarker.contactChannel}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs">
              <span className="text-slate-500 text-[11px]">
                Merkle Root committed to BeneficiaryRegistry.sol
              </span>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="px-4 py-2 rounded-md bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono font-medium transition-colors"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
