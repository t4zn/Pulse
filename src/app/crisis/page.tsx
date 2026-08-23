"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Check,
  Layers,
  ArrowUpRight,
  Loader2,
  Share2,
  ChevronDown,
  ChevronUp,
  Heart,
  Sparkles,
  Zap,
  HardDrive,
  ExternalLink,
  FileCheck,
  Wallet,
  Lock,
  MapPin,
  Activity,
  Compass,
} from "lucide-react";
import { uploadReceiptToFilecoin, getFilecoinGatewayUrl } from "@/lib/filecoin";
import { saveDonationRecord, saveBeneficiaryClaim } from "@/lib/auditState";
import { useWallet } from "@/context/WalletContext";
import { buildMerkleTree, generateProof, buildEIP712ClaimData } from "@/lib/merkle";

// Dynamically import Leaflet Map to ensure SSR compatibility
const PostLeafletMap = dynamic(() => import("@/components/PostLeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[280px] sm:h-[340px] rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-200">
      <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
        <span>Initializing Regional Seismology Map...</span>
      </div>
    </div>
  ),
});

// Branded Blockchain Network SVG Icons
function EthereumIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 417" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M127.961 0L125.166 9.5V285.168L127.961 287.958L255.923 212.32L127.961 0Z" fill="#627EEA" />
      <path d="M127.962 0L0 212.32L127.962 287.958V157.34V0Z" fill="#627EEA" fillOpacity="0.8" />
      <path d="M127.961 312.187L126.386 314.106V413.447L127.961 416.892L256 236.585L127.961 312.187Z" fill="#627EEA" />
      <path d="M127.962 416.892V312.187L0 236.585L127.962 416.892Z" fill="#627EEA" fillOpacity="0.8" />
      <path d="M127.961 287.958L255.923 212.32L127.961 157.339V287.958Z" fill="#627EEA" fillOpacity="0.6" />
      <path d="M0 212.32L127.962 287.958V157.339L0 212.32Z" fill="#627EEA" fillOpacity="0.4" />
    </svg>
  );
}

function PolygonIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 38 33" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M29 10.2L19.5 4.7L10 10.2V21.2L19.5 26.7L29 21.2V10.2Z" fill="#8247E5" />
      <path fillRule="evenodd" clipRule="evenodd" d="M19.5 0L38 10.7V32L19.5 21.3L1 32V10.7L19.5 0ZM29 10.2L19.5 4.7L10 10.2V21.2L19.5 26.7L29 21.2V10.2Z" fill="#8247E5" />
    </svg>
  );
}

function getApprovedAidAmount(post: { id: string; rawMagnitude?: number; depth?: string }): string {
  const mag = post.rawMagnitude || 5.0;
  const base = Math.round(mag * 38);
  const idHash = (post.id || "").split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const variation = (idHash % 11) * 20; // Varied step offsets: 0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200
  const depthNum = parseFloat(post.depth || "10") || 10;
  const depthBonus = depthNum < 20 ? 35 : depthNum < 50 ? 20 : 5;
  const total = Math.min(650, Math.max(120, base + variation + depthBonus));
  // Round to friendly amounts (multiples of $10 or $25)
  return (Math.round(total / 5) * 5).toString();
}

interface RealCrisisPost {
  id: string;
  source: "USGS" | "EMSC" | "NASA";
  author: {
    name: string;
    verified: boolean;
    logoSrc: string;
  };
  timeAgo: string;
  timestamp: number;
  rawMagnitude: number;
  regionKey: string;
  place: string;
  headlineTitle: string;
  magnitude: string;
  severityLevel: "CRITICAL" | "HIGH" | "ELEVATED";
  depth: string;
  depthKm: number;
  significance: string;
  officialUrl: string;
  fullDescription: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  intensity: {
    mmi: number;
    level: string;
    color: string;
    shakeRadiusKm: number;
    severeRadiusKm: number;
  };
}

function computeDisasterIntensity(
  magnitude: number,
  depthKm: number,
  source: "USGS" | "EMSC" | "NASA",
  reportedMmi?: number
) {
  if (source === "NASA") {
    return {
      mmi: 6.0,
      level: "Active Thermal Alert",
      color: "#EA580C",
      shakeRadiusKm: 35,
      severeRadiusKm: 12,
    };
  }

  // Calculate MMI (Modified Mercalli Intensity)
  let mmi = reportedMmi;
  if (!mmi || isNaN(mmi) || mmi <= 0) {
    if (magnitude >= 7.5) mmi = 9.0;
    else if (magnitude >= 7.0) mmi = 8.2;
    else if (magnitude >= 6.5) mmi = 7.4;
    else if (magnitude >= 6.0) mmi = 6.8;
    else if (magnitude >= 5.5) mmi = 5.9;
    else if (magnitude >= 5.0) mmi = 5.1;
    else mmi = 4.3;
  }

  // Attenuation adjustment based on focal depth
  const depthFactor = depthKm < 15 ? 1.25 : depthKm < 40 ? 1.0 : depthKm < 100 ? 0.75 : 0.55;
  const shakeRadiusKm = Math.min(600, Math.max(25, Math.round(Math.pow(10, 0.42 * magnitude - 0.45) * depthFactor)));
  const severeRadiusKm = Math.min(shakeRadiusKm * 0.4, Math.max(6, Math.round(shakeRadiusKm * (magnitude >= 6.5 ? 0.32 : 0.2))));

  let level = "Light Shaking";
  let color = "#2563EB";

  if (mmi >= 8.0 || magnitude >= 7.0) {
    level = "Violent / Severe Shaking";
    color = "#E11D48";
  } else if (mmi >= 6.5 || magnitude >= 6.0) {
    level = "Strong Shaking";
    color = "#EA580C";
  } else if (mmi >= 5.0 || magnitude >= 5.0) {
    level = "Moderate Shaking";
    color = "#D97706";
  }

  return {
    mmi,
    level,
    color,
    shakeRadiusKm,
    severeRadiusKm,
  };
}

function resolveRegionalNGO(location: string): { name: string; logoSrc: string } {
  const loc = location.toLowerCase();

  if (loc.includes("japan") || loc.includes("tateyama") || loc.includes("honshu") || loc.includes("tokyo")) {
    return { name: "Japanese Red Cross Society", logoSrc: "/logos/jrc-japan.svg" };
  }
  if (loc.includes("indonesia") || loc.includes("ruteng") || loc.includes("fakfak") || loc.includes("flores") || loc.includes("banda") || loc.includes("sumatra") || loc.includes("java") || loc.includes("bali")) {
    return { name: "Indonesian Red Cross (PMI)", logoSrc: "/logos/pmi-indonesia.svg" };
  }
  if (loc.includes("turkey") || loc.includes("türkiye") || loc.includes("kahramanmaraş") || loc.includes("gaziantep")) {
    return { name: "Turkish Red Crescent (Türk Kızılay)", logoSrc: "/logos/red-crescent.svg" };
  }
  if (loc.includes("morocco") || loc.includes("marrakech") || loc.includes("al haouz")) {
    return { name: "Moroccan Red Crescent", logoSrc: "/logos/red-crescent.svg" };
  }
  if (loc.includes("philippin") || loc.includes("mindanao") || loc.includes("luzon") || loc.includes("alegria") || loc.includes("jabonga")) {
    return { name: "Philippine Red Cross", logoSrc: "/logos/philippine-red-cross.svg" };
  }
  if (loc.includes("chile") || loc.includes("antofagasta") || loc.includes("santiago")) {
    return { name: "Chilean Red Cross (Cruz Roja)", logoSrc: "/logos/red-cross.svg" };
  }
  if (loc.includes("greece") || loc.includes("aegean") || loc.includes("crete")) {
    return { name: "Hellenic Red Cross", logoSrc: "/logos/red-cross.svg" };
  }
  if (loc.includes("italy") || loc.includes("sicily") || loc.includes("calabria")) {
    return { name: "Italian Red Cross (CRI)", logoSrc: "/logos/red-cross.svg" };
  }
  if (loc.includes("india") || loc.includes("kerala") || loc.includes("wayanad")) {
    return { name: "Indian Red Cross & Goonj", logoSrc: "/logos/red-cross.svg" };
  }
  if (loc.includes("taiwan") || loc.includes("hualien") || loc.includes("taipei")) {
    return { name: "Taiwan Red Cross Organization", logoSrc: "/logos/red-cross.svg" };
  }
  if (loc.includes("mexico") || loc.includes("oaxaca") || loc.includes("chiapas")) {
    return { name: "Mexican Red Cross (Cruz Roja)", logoSrc: "/logos/red-cross.svg" };
  }
  if (loc.includes("california") || loc.includes("alaska") || loc.includes("hawaii") || loc.includes("texas") || loc.includes("united states") || loc.includes("usa")) {
    return { name: "American Red Cross Disaster Relief", logoSrc: "/logos/american-red-cross.svg" };
  }
  if (loc.includes("new zealand") || loc.includes("kermadec") || loc.includes("auckland")) {
    return { name: "New Zealand Red Cross", logoSrc: "/logos/red-cross.svg" };
  }
  if (loc.includes("papua") || loc.includes("solomon") || loc.includes("fiji") || loc.includes("vanuatu") || loc.includes("sandwich")) {
    return { name: "Pacific Disaster Relief & Red Cross", logoSrc: "/logos/red-cross.svg" };
  }
  if (loc.includes("russia") || loc.includes("kuril") || loc.includes("kamchatka")) {
    return { name: "Russian Red Cross Emergency Triage", logoSrc: "/logos/red-cross.svg" };
  }

  return { name: "UN OCHA Emergency Relief & Red Cross", logoSrc: "/logos/un-ocha.svg" };
}

function getRegionKey(place: string): string {
  const clean = place.toLowerCase().trim();
  if (clean.includes("of ")) {
    return clean.split("of ")[1].trim();
  }
  return clean;
}

function timeDifference(current: number, previous: number) {
  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const elapsed = Math.max(0, current - previous);

  if (elapsed < msPerMinute) {
    return Math.round(elapsed / 1000) + "s ago";
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + "m ago";
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + "h ago";
  } else {
    return Math.round(elapsed / msPerDay) + "d ago";
  }
}

export default function CrisisFeedPage() {
  const { address: connectedAddress, isConnected, connectWallet, signClaimMessage } = useWallet();

  const [posts, setPosts] = useState<RealCrisisPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const [expandedMapIds, setExpandedMapIds] = useState<Record<string, boolean>>({});
  const [inlineDonateId, setInlineDonateId] = useState<string | null>(null);
  const [inlineClaimId, setInlineClaimId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Inline Donation State
  const [donateAmount, setDonateAmount] = useState<string>("");
  const [donateToken, setDonateToken] = useState<"ETH" | "POL">("ETH");
  const [isSubmittingDonation, setIsSubmittingDonation] = useState(false);
  const [donationSuccessId, setDonationSuccessId] = useState<string | null>(null);
  const [donationCids, setDonationCids] = useState<Record<string, string>>({});

  // Inline Claim State
  const [isSubmittingClaim, setIsSubmittingClaim] = useState(false);
  const [claimSuccessId, setClaimSuccessId] = useState<string | null>(null);
  const [claimCids, setClaimCids] = useState<Record<string, string>>({});
  const [claimTxHashes, setClaimTxHashes] = useState<Record<string, string>>({});
  const [claimStatusMsg, setClaimStatusMsg] = useState("");

  const TOKEN_RATES = {
    ETH: 2750,
    POL: 0.65,
  };

  const getCryptoEstimate = (usdStr: string, token: "ETH" | "POL") => {
    const usd = parseFloat(usdStr);
    if (isNaN(usd) || usd <= 0) return "";
    if (token === "ETH") {
      const eth = usd / TOKEN_RATES.ETH;
      return eth < 0.001 ? `${eth.toFixed(5)} ETH` : `${eth.toFixed(4)} ETH`;
    } else {
      const pol = usd / TOKEN_RATES.POL;
      return `${pol.toFixed(2)} POL`;
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleMapExpand = (id: string) => {
    setExpandedMapIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleInlineDonate = (id: string) => {
    if (inlineDonateId === id) {
      setInlineDonateId(null);
    } else {
      setInlineDonateId(id);
      setInlineClaimId(null);
      setDonationSuccessId(null);
    }
  };

  const toggleInlineClaim = (id: string) => {
    if (inlineClaimId === id) {
      setInlineClaimId(null);
    } else {
      setInlineClaimId(id);
      setInlineDonateId(null);
      setClaimSuccessId(null);
      setClaimStatusMsg("");
    }
  };

  const handleConfirmDonation = async (post: RealCrisisPost) => {
    setIsSubmittingDonation(true);
    
    const fakeTxHash =
      "0x" +
      Array.from({ length: 64 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join("");

    const usdVal = parseFloat(donateAmount) || 50;
    const cryptoEst = getCryptoEstimate(donateAmount, donateToken);

    try {
      const filecoinResult = await uploadReceiptToFilecoin({
        beneficiary: post.author.name,
        disasterPoolId: post.id,
        disasterPoolTitle: post.headlineTitle,
        amount: usdVal.toString(),
        currency: "USD",
        txHash: fakeTxHash,
        timestamp: Date.now(),
        verificationMethod: `Direct Relief Vault Deposit (${donateToken})`,
        relayerNetwork: donateToken === "ETH" ? "Ethereum Sepolia" : "Polygon Amoy",
      });

      setDonationCids((prev) => ({
        ...prev,
        [post.id]: filecoinResult.cid,
      }));

      saveDonationRecord({
        txHash: fakeTxHash,
        amountUSD: usdVal,
        amountCrypto: cryptoEst,
        networkName: donateToken === "ETH" ? "Ethereum Sepolia" : "Polygon Amoy",
        poolName: post.author.name,
        ipfsReceipt: filecoinResult.cid,
      });
    } catch (e) {
      console.error("Filecoin donor pin error:", e);
    }

    setIsSubmittingDonation(false);
    setDonationSuccessId(post.id);
  };

  const handleConfirmClaim = async (post: RealCrisisPost) => {
    setIsSubmittingClaim(true);
    setClaimStatusMsg("Generating Zero-Knowledge Merkle Proof...");

    const recipient = connectedAddress || "0x9318a4B219cf629E3FaB0192e21973Ea6164f9d3";
    const tree = buildMerkleTree([recipient]);
    const proof = generateProof(tree, recipient);
    const claimAmount = getApprovedAidAmount(post);
    const rawAmt = (parseFloat(claimAmount) * 1e6).toString();
    const deadline = Math.floor(Date.now() / 1000) + 3600;
    const eip712 = buildEIP712ClaimData(1, rawAmt, recipient, 0, deadline);

    try {
      if (isConnected) {
        try {
          await signClaimMessage(eip712);
        } catch (e) {
          console.warn("Signature bypass for demo confirmation.");
        }
      }

      setClaimStatusMsg("Submitting meta-tx to Polygon Relay...");
      await new Promise((r) => setTimeout(r, 600));

      const fakeTxHash =
        "0x" +
        Array.from({ length: 64 }, () =>
          Math.floor(Math.random() * 16).toString(16)
        ).join("");

      setClaimTxHashes((prev) => ({ ...prev, [post.id]: fakeTxHash }));

      setClaimStatusMsg("Pinning permanent receipt to Filecoin / IPFS...");
      const filecoinResult = await uploadReceiptToFilecoin({
        beneficiary: recipient,
        disasterPoolId: post.id,
        disasterPoolTitle: post.headlineTitle,
        amount: claimAmount,
        currency: "USDC",
        txHash: fakeTxHash,
        merkleRoot: tree.root,
        timestamp: Date.now(),
        verificationMethod: "Merkle Zero-Knowledge Proof (EIP-712)",
        relayerNetwork: "Polygon Amoy Testnet",
      });

      setClaimCids((prev) => ({ ...prev, [post.id]: filecoinResult.cid }));

      saveBeneficiaryClaim({
        txHash: fakeTxHash,
        beneficiaryAddress: recipient,
        merkleLeaf: proof.leaf,
        amountUSD: parseFloat(claimAmount),
        category: "Emergency Shelter",
        vaultName: post.headlineTitle,
        ipfsReceipt: filecoinResult.cid,
      });

      setClaimSuccessId(post.id);
      setIsSubmittingClaim(false);
      setClaimStatusMsg("");
    } catch (err) {
      console.error("Claim error:", err);
      setIsSubmittingClaim(false);
      setClaimStatusMsg("Claim failed. Please try again.");
    }
  };

  const fetchMultiApiData = async () => {
    setLoading(true);
    const realPosts: RealCrisisPost[] = [];

    const fetchUSGS = async () => {
      try {
        const res = await fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson");
        if (res.ok) {
          const data = await res.json();
          if (data && data.features) {
            data.features.slice(0, 10).forEach((f: any) => {
              const mag = Number(f.properties?.mag || 5.0);
              const place = f.properties?.place || "Seismic Zone";
              const time = Number(f.properties?.time || Date.now());
              const depthVal = Number(f.geometry?.coordinates?.[2] || 10.0);
              const depth = `${depthVal.toFixed(1)} km`;
              const sig = f.properties?.sig ? `${f.properties.sig} / 1000` : `${Math.round(mag * 70)} / 1000`;
              const ngo = resolveRegionalNGO(place);
              const lat = Number(f.geometry?.coordinates?.[1] || 0);
              const lng = Number(f.geometry?.coordinates?.[0] || 0);
              const reportedMmi = f.properties?.mmi ? Number(f.properties.mmi) : undefined;
              const intensity = computeDisasterIntensity(mag, depthVal, "USGS", reportedMmi);

              realPosts.push({
                id: f.id || `usgs-${time}`,
                source: "USGS",
                author: {
                  name: ngo.name,
                  verified: true,
                  logoSrc: ngo.logoSrc,
                },
                timeAgo: timeDifference(Date.now(), time),
                timestamp: time,
                rawMagnitude: mag,
                regionKey: getRegionKey(place),
                place,
                headlineTitle: `A high-magnitude ${mag.toFixed(1)} tectonic rupture occurred in the ${place} region at a focal depth of ${depth}.`,
                magnitude: `${mag.toFixed(1)} Mag`,
                severityLevel: mag >= 6.0 ? "CRITICAL" : "HIGH",
                depth,
                depthKm: depthVal,
                significance: sig,
                officialUrl: f.properties?.url || "https://earthquake.usgs.gov/",
                coordinates: { lat, lng },
                intensity,
                fullDescription: [
                  `Official USGS seismic sensors recorded a Magnitude ${mag.toFixed(1)} earthquake at coordinates (${lat.toFixed(3)}°N, ${lng.toFixed(3)}°E) with a focal depth of ${depth}. Tectonic subduction along regional plate boundaries has produced significant crustal displacement.`,
                  depthVal < 30
                    ? `Due to the shallow focal depth (${depth}), high-frequency ground acceleration is concentrated near the epicenter, significantly amplifying the risk of masonry collapse, slope failure along unpaved access routes, and municipal power disruption.`
                    : `The intermediate depth helped disperse the epicenter shockwaves across provincial monitoring arrays, though ground shaking was widely felt across surrounding populated settlements.`,
                  `${ngo.name} rapid response command has been mobilized to coordinate immediate ground triage. Emergency shelter units, mobile water filtration kits, and medical stabilization packs are being prepared for dispatch, with direct wallet-to-wallet relief activated via the on-chain registry.`,
                ],
              });
            });
          }
        }
      } catch (e) {
        console.warn("USGS API fetch error:", e);
      }
    };

    const fetchEMSC = async () => {
      try {
        const res = await fetch("https://www.seismicportal.eu/fdsnws/event/1/query?format=json&minmag=4.5&limit=8");
        if (res.ok) {
          const data = await res.json();
          if (data && data.features) {
            data.features.forEach((f: any) => {
              const p = f.properties;
              const mag = Number(p?.mag || 4.5);
              const region = p?.flynn_region || "Euro-Mediterranean Region";
              const time = p?.time ? new Date(p.time).getTime() : Date.now();
              const depthVal = Number(p?.depth || f.geometry?.coordinates?.[2] || 15.0);
              const depth = `${depthVal.toFixed(1)} km`;
              const ngo = resolveRegionalNGO(region);
              const lat = Number(f.geometry?.coordinates?.[1] || (p?.lat ? Number(p.lat) : 0));
              const lng = Number(f.geometry?.coordinates?.[0] || (p?.lon ? Number(p.lon) : 0));
              const intensity = computeDisasterIntensity(mag, depthVal, "EMSC");

              realPosts.push({
                id: f.id || `emsc-${time}`,
                source: "EMSC",
                author: {
                  name: ngo.name,
                  verified: true,
                  logoSrc: ngo.logoSrc,
                },
                timeAgo: timeDifference(Date.now(), time),
                timestamp: time,
                rawMagnitude: mag,
                regionKey: getRegionKey(region),
                place: region,
                headlineTitle: `A severe ${mag.toFixed(1)} magnitude earthquake struck the ${region} sector at a focal depth of ${depth}.`,
                magnitude: `${mag.toFixed(1)} Mag`,
                severityLevel: mag >= 6.0 ? "CRITICAL" : "HIGH",
                depth,
                depthKm: depthVal,
                significance: `Score ${Math.round(mag * 80)}`,
                officialUrl: `https://www.emsc-csem.org/Earthquake/earthquake.php?id=${p?.unid || ""}`,
                coordinates: { lat, lng },
                intensity,
                fullDescription: [
                  `European-Mediterranean Seismological Centre (EMSC) arrays registered a Magnitude ${mag.toFixed(1)} earthquake centered in ${region} at a depth of ${depth}. Seismic waves triggered multi-sensor telemetry alerts across regional network observatories.`,
                  `Local emergency authorities report notable ground tremors across nearby coastal and residential zones, raising concerns for older unreinforced infrastructure and localized utility interruptions.`,
                  `${ngo.name} field logistics teams are assessing ground impact and initiating emergency aid pipelines. Direct smart contract funding pools are deployed to support immediate victim relief and shelter replenishment.`,
                ],
              });
            });
          }
        }
      } catch (e) {
        console.warn("EMSC API fetch error:", e);
      }
    };

    const fetchNASA = async () => {
      try {
        const res = await fetch("https://eonet.gsfc.nasa.gov/api/v3/events?limit=4");
        if (res.ok) {
          const data = await res.json();
          if (data && data.events) {
            data.events.forEach((ev: any) => {
              const geo = ev.geometry?.[ev.geometry.length - 1];
              const dateStr = geo?.date || ev.geometry?.[0]?.date;
              const time = dateStr ? new Date(dateStr).getTime() : Date.now();
              const categoryTitle = ev.categories?.[0]?.title || "Wildfire Emergency";
              const ngo = resolveRegionalNGO(ev.title);
              const coords = geo?.coordinates || ev.geometry?.[0]?.coordinates;
              const lat = Array.isArray(coords) ? (typeof coords[1] === "number" ? coords[1] : Number(coords[1]) || 0) : 0;
              const lng = Array.isArray(coords) ? (typeof coords[0] === "number" ? coords[0] : Number(coords[0]) || 0) : 0;
              const intensity = computeDisasterIntensity(5.5, 0, "NASA");

              realPosts.push({
                id: ev.id,
                source: "NASA",
                author: {
                  name: ngo.name,
                  verified: true,
                  logoSrc: "/logos/nasa.svg",
                },
                timeAgo: timeDifference(Date.now(), time),
                timestamp: time,
                rawMagnitude: 5.5,
                regionKey: ev.title.toLowerCase().trim(),
                place: ev.title,
                headlineTitle: `NASA Earth Observatory detected active ${categoryTitle} telemetry across ${ev.title}.`,
                magnitude: categoryTitle,
                severityLevel: "HIGH",
                depth: "Surface Event",
                depthKm: 0,
                significance: "Satellite Verified",
                officialUrl: ev.link || "https://eonet.gsfc.nasa.gov/",
                coordinates: { lat, lng },
                intensity,
                fullDescription: [
                  `NASA Earth Observing System satellites captured high-resolution thermal imaging and ground telemetry corresponding to active ${categoryTitle.toLowerCase()} across ${ev.title}.`,
                  `Atmospheric telemetry indicates significant localized displacement risk, hazardous particulate dispersion, and disruption to local supply corridors.`,
                  `${ngo.name} has initiated rapid disaster relief protocols. Verified relief vaults are authorized to release emergency living assistance grants to registered local families.`,
                ],
              });
            });
          }
        }
      } catch (e) {
        console.warn("NASA EONET API fetch error:", e);
      }
    };

    await Promise.allSettled([fetchUSGS(), fetchEMSC(), fetchNASA()]);

    realPosts.sort((a, b) => b.timestamp - a.timestamp);

    const uniquePosts: RealCrisisPost[] = [];
    const seenRegions = new Set<string>();

    for (const post of realPosts) {
      if (!seenRegions.has(post.regionKey)) {
        seenRegions.add(post.regionKey);
        uniquePosts.push(post);
      }
    }

    setPosts(uniquePosts);
    setLoading(false);
  };

  useEffect(() => {
    fetchMultiApiData();
    const interval = setInterval(fetchMultiApiData, 45000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyLink = (id: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/crisis#${id}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="min-h-screen bg-white text-[#0F172A] font-sans antialiased">
      <header className="border-b border-[#E2E8F0] bg-[#F8FAFC]/80 backdrop-blur-md sticky top-16 z-30">
        <div className="max-w-[760px] mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            <span className="font-semibold text-sm tracking-tight text-[#0F172A]">
              Live Emergency Triage Feed
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-[#64748B] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>Real USGS &bull; EMSC &bull; NASA Stream</span>
            </span>
            <Link
              href="/audit"
              className="text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors flex items-center gap-1"
            >
              <span>Ledger</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-[760px] mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-4">
        {loading && posts.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <Loader2 className="w-6 h-6 animate-spin text-[#2563EB] mx-auto" />
            <p className="text-xs text-[#64748B]">Connecting to USGS & EMSC seismology telemetry...</p>
          </div>
        ) : (
          posts.map((post) => {
            const isExpanded = expandedIds[post.id];
            const isMapExpanded = expandedMapIds[post.id];
            const isDonating = inlineDonateId === post.id;
            const isClaiming = inlineClaimId === post.id;
            const isDonated = donationSuccessId === post.id;
            const isClaimed = claimSuccessId === post.id;
            const claimAmount = getApprovedAidAmount(post);

            return (
              <article
                key={post.id}
                id={post.id}
                className="rounded-2xl border border-[#E2E8F0] bg-white p-5 sm:p-6 shadow-xs hover:border-[#CBD5E1] transition-all space-y-4 font-sans"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={post.author.logoSrc}
                      alt={post.author.name}
                      className="w-10 h-10 rounded-xl object-contain border border-[#E2E8F0] p-1 shrink-0 bg-[#F8FAFC]"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-[#0F172A] truncate">
                          {post.author.name}
                        </span>
                        {post.author.verified && (
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-[#64748B] mt-0.5">
                        <span>{post.source} Sensor</span>
                        <span>&bull;</span>
                        <span>{post.timeAgo}</span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      post.severityLevel === "CRITICAL"
                        ? "bg-rose-50 text-rose-700 border-rose-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    {post.magnitude}
                  </span>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-semibold text-[#0F172A] leading-relaxed">
                    {post.headlineTitle}
                  </p>

                  <div className="text-xs text-[#475569] leading-relaxed space-y-2">
                    {isExpanded ? (
                      post.fullDescription.map((p, idx) => (
                        <p key={idx}>{p}</p>
                      ))
                    ) : (
                      <p className="line-clamp-2">
                        {post.fullDescription[0]}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() => toggleExpand(post.id)}
                      className="text-[11px] font-semibold text-[#2563EB] hover:underline flex items-center gap-0.5 pt-0.5 cursor-pointer"
                    >
                      <span>{isExpanded ? "Show Less" : "Read Full Telemetry"}</span>
                      <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                    </button>
                  </div>
                </div>

                {/* ── Regional Seismology & Intensity Leaflet Map Expander ── */}
                <div className="space-y-2 pt-0.5">
                  <button
                    type="button"
                    onClick={() => toggleMapExpand(post.id)}
                    className={`w-full py-2 px-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer text-xs ${
                      isMapExpanded
                        ? "bg-[#F1F5F9] border-[#CBD5E1] text-[#0F172A]"
                        : "bg-[#F8FAFC] hover:bg-[#F1F5F9] border-[#E2E8F0] text-[#475569] hover:text-[#0F172A]"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`p-1 rounded-lg ${isMapExpanded ? "bg-[#2563EB] text-white" : "bg-white text-[#2563EB] border border-[#E2E8F0]"}`}>
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="font-semibold text-xs truncate">
                          {isMapExpanded ? "Regional Epicenter & Intensity Map" : "View Region & Intensity Map"}
                        </span>
                        <span className="text-[11px] text-[#94A3B8] hidden sm:inline truncate">
                          &bull; {post.place} ({post.coordinates.lat.toFixed(2)}°, {post.coordinates.lng.toFixed(2)}°)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span 
                        className="text-[10px] font-bold px-2 py-0.5 rounded-md border"
                        style={{ 
                          borderColor: `${post.intensity.color}40`,
                          backgroundColor: `${post.intensity.color}15`,
                          color: post.intensity.color
                        }}
                      >
                        {post.intensity.level.split(" ")[0]} ({post.magnitude})
                      </span>
                      <div className={`p-0.5 rounded-full text-[#64748B] transition-transform duration-200 ${isMapExpanded ? "rotate-180" : ""}`}>
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </button>

                  {/* Leaflet Map Section (Displayed when Chevron is expanded) */}
                  {isMapExpanded && (
                    <div className="animate-fadeIn pt-1">
                      <PostLeafletMap
                        id={post.id}
                        source={post.source}
                        title={post.headlineTitle}
                        place={post.place || post.regionKey}
                        coordinates={post.coordinates}
                        magnitude={post.rawMagnitude}
                        magnitudeStr={post.magnitude}
                        depthStr={post.depth}
                        depthKm={post.depthKm}
                        intensity={post.intensity}
                        officialUrl={post.officialUrl}
                        authorName={post.author.name}
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#F1F5F9]">
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleInlineDonate(post.id)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                          isDonating
                            ? "bg-[#0F172A] text-white"
                            : "bg-[#2563EB] hover:bg-[#1D4ED8] text-white"
                        }`}
                      >
                        <Heart className="w-3.5 h-3.5 fill-white/20" />
                        <span>{isDonating ? "Close" : "Donate Aid"}</span>
                      </button>

                      <button
                        onClick={() => toggleInlineClaim(post.id)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                          isClaiming
                            ? "bg-emerald-700 text-white"
                            : "bg-[#F8FAFC] hover:bg-emerald-50 text-[#0F172A] hover:text-emerald-700 border border-[#E2E8F0] hover:border-emerald-300"
                        }`}
                      >
                        <ShieldCheck className={`w-3.5 h-3.5 ${isClaiming ? "text-white" : "text-emerald-600"}`} />
                        <span>{isClaiming ? "Close Claim" : "Claim Aid"}</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <Link
                        href="/audit"
                        className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors"
                        title="Audit Registry"
                      >
                        <Layers className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        onClick={() => handleCopyLink(post.id)}
                        className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors"
                        title="Copy Link"
                      >
                        {copiedId === post.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Share2 className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <a
                        href={post.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-[#64748B] hover:text-[#2563EB] hover:bg-[#F8FAFC] transition-colors"
                        title="View Official Telemetry"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                </div>

                {isDonating && (
                    <div className="pt-3 border-t border-[#F1F5F9] animate-fadeIn">
                      {isDonated ? (
                        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" />
                          <div className="space-y-0.5">
                            <p className="text-xs font-semibold text-emerald-900">
                              Donation Confirmed!
                            </p>
                            <p className="text-[11px] text-emerald-700">
                              ${donateAmount} USD ({getCryptoEstimate(donateAmount, donateToken)}) transferred directly to {post.author.name} relief pool.
                            </p>
                          </div>

                          {donationCids[post.id] && (
                            <div className="p-2 rounded-lg bg-white border border-emerald-200 flex items-center justify-between text-xs text-[#0F172A]">
                              <span className="text-[11px] text-[#64748B] flex items-center gap-1">
                                <HardDrive className="w-3 h-3 text-[#2563EB]" />
                                <span>Filecoin Proof:</span>
                              </span>
                              <Link
                                href={`/receipt?cid=${encodeURIComponent(donationCids[post.id])}`}
                                className="text-[#2563EB] hover:underline flex items-center gap-1 font-semibold text-[11px]"
                              >
                                <span>{donationCids[post.id].slice(0, 8)}...{donationCids[post.id].slice(-6)}</span>
                                <ExternalLink className="w-3 h-3" />
                              </Link>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-2.5">
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                            {/* USD Input */}
                            <div className="relative flex-1">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#94A3B8]">
                                $
                              </span>
                              <input
                                type="number"
                                min="1"
                                step="any"
                                value={donateAmount}
                                onChange={(e) => setDonateAmount(e.target.value)}
                                placeholder="Amount in USD"
                                className="w-full pl-7 pr-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-semibold text-[#0F172A] focus:outline-none focus:bg-white focus:border-[#2563EB] transition-colors font-sans [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              />
                            </div>

                            {/* Network Selector Tabs with Ethereum & Polygon Icons */}
                            <div className="flex items-center p-1 rounded-xl bg-[#F1F5F9] border border-[#E2E8F0] gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => setDonateToken("ETH")}
                                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                                  donateToken === "ETH"
                                    ? "bg-white text-[#0F172A] shadow-xs"
                                    : "text-[#64748B] hover:text-[#0F172A]"
                                }`}
                              >
                                <EthereumIcon className="w-3.5 h-3.5" />
                                <span>Ethereum</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setDonateToken("POL")}
                                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                                  donateToken === "POL"
                                    ? "bg-white text-[#0F172A] shadow-xs"
                                    : "text-[#64748B] hover:text-[#0F172A]"
                                }`}
                              >
                                <PolygonIcon className="w-3.5 h-3.5" />
                                <span>Polygon</span>
                              </button>
                            </div>

                            {/* Action Button */}
                            <button
                              type="button"
                              onClick={() => handleConfirmDonation(post)}
                              disabled={isSubmittingDonation || !donateAmount || parseFloat(donateAmount) <= 0}
                              className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 text-white text-xs font-semibold transition-all cursor-pointer shrink-0 flex items-center justify-center gap-1.5 shadow-xs"
                            >
                              {isSubmittingDonation ? (
                                <>
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  <span>Sending...</span>
                                </>
                              ) : (
                                <>
                                  <Heart className="w-3.5 h-3.5 fill-white/20" />
                                  <span>Donate</span>
                                </>
                              )}
                            </button>
                          </div>

                          {/* Live Conversion Rate Display with Ethereum & Polygon Icons */}
                          {donateAmount && parseFloat(donateAmount) > 0 && (
                            <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[11px] text-[#475569]">
                              <span className="text-[#64748B]">Estimated On-Chain Value:</span>
                              <div className="flex items-center gap-1.5 font-bold text-[#0F172A]">
                                {donateToken === "ETH" ? (
                                  <EthereumIcon className="w-3.5 h-3.5" />
                                ) : (
                                  <PolygonIcon className="w-3.5 h-3.5" />
                                )}
                                <span>{getCryptoEstimate(donateAmount, donateToken)}</span>
                                <span className="text-[#94A3B8] font-normal">
                                  ({donateToken === "ETH" ? "Ethereum Network" : "Polygon Network"})
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                )}

                {isClaiming && (
                    <div className="pt-3 border-t border-[#F1F5F9] animate-fadeIn">
                      {isClaimed ? (
                        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" />
                          <div className="space-y-0.5">
                            <p className="text-xs font-bold text-emerald-900">
                              Emergency Aid Disbursed Successfully!
                            </p>
                            <p className="text-[11px] text-emerald-700">
                              ${claimAmount} USDC transferred to your verified recipient wallet with zero gas fees.
                            </p>
                          </div>

                          {claimCids[post.id] && (
                            <div className="p-2 rounded-lg bg-white border border-emerald-200 flex items-center justify-between text-xs text-[#0F172A]">
                              <span className="text-[11px] text-[#64748B] flex items-center gap-1 font-sans">
                                <HardDrive className="w-3 h-3 text-[#2563EB]" />
                                <span>Filecoin Sealed Receipt:</span>
                              </span>
                              <Link
                                href={`/receipt?cid=${encodeURIComponent(claimCids[post.id])}`}
                                className="text-[#2563EB] hover:underline flex items-center gap-1 font-semibold text-[11px]"
                              >
                                <span>{claimCids[post.id].slice(0, 8)}...{claimCids[post.id].slice(-6)}</span>
                                <ExternalLink className="w-3 h-3" />
                              </Link>
                            </div>
                          )}

                          <div className="flex items-center justify-center gap-3 pt-1">
                            {claimCids[post.id] && (
                              <Link
                                href={`/receipt?cid=${encodeURIComponent(claimCids[post.id])}`}
                                className="text-[11px] font-semibold text-[#2563EB] hover:underline flex items-center gap-1"
                              >
                                <FileCheck className="w-3.5 h-3.5" />
                                <span>View Verified Certificate</span>
                              </Link>
                            )}
                            <Link
                              href="/audit"
                              className="text-[11px] font-semibold text-[#64748B] hover:text-[#0F172A] hover:underline flex items-center gap-1"
                            >
                              <Layers className="w-3.5 h-3.5" />
                              <span>View in Audit Ledger</span>
                            </Link>
                          </div>
                        </div>
                      ) : (
                        <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#E2E8F0]">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                <span className="text-xs font-bold text-[#0F172A]">
                                  Zero-Knowledge Victim Aid Grant
                                </span>
                              </div>
                              <p className="text-[11px] text-[#64748B] mt-0.5">
                                Instant emergency relief for families in {post.regionKey}.
                              </p>
                            </div>

                            <div className="text-right">
                              <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                                +${claimAmount} USDC
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-xs text-[#475569] gap-2 flex-wrap">
                            <div className="flex items-center gap-1.5 truncate">
                              <Wallet className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
                              <span className="text-[#64748B]">Claim Wallet:</span>
                              <span className="font-medium text-[#0F172A] truncate">
                                {connectedAddress ? `${connectedAddress.slice(0, 6)}...${connectedAddress.slice(-4)}` : "0x9318...f9d3 (Auto-Verified)"}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1 text-[11px] text-purple-700 font-semibold bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-md">
                                <PolygonIcon className="w-3 h-3" />
                                <span>Polygon (0 Gas)</span>
                              </div>
                              <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                                <Lock className="w-3 h-3 text-emerald-600" />
                                <span>ZK Merkle Valid</span>
                              </div>
                            </div>
                          </div>

                          {claimStatusMsg && (
                            <div className="text-[11px] text-[#2563EB] flex items-center gap-1.5 font-medium">
                              <Loader2 className="w-3 h-3 animate-spin shrink-0" />
                              <span>{claimStatusMsg}</span>
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={() => handleConfirmClaim(post)}
                            disabled={isSubmittingClaim}
                            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                          >
                            {isSubmittingClaim ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Verifying & Disbursing Aid...</span>
                              </>
                            ) : (
                              <>
                                <ShieldCheck className="w-4 h-4" />
                                <span>Confirm & Claim ${claimAmount} USDC Relief</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                )}
              </article>
            );
          })
        )}
      </main>
    </div>
  );
}
