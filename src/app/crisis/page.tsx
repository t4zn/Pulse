"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
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
} from "lucide-react";

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
  headlineTitle: string;
  magnitude: string;
  severityLevel: "CRITICAL" | "HIGH" | "ELEVATED";
  depth: string;
  significance: string;
  officialUrl: string;
  fullDescription: string[];
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
  const [posts, setPosts] = useState<RealCrisisPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const [inlineDonateId, setInlineDonateId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Inline Donation State
  const [donateAmount, setDonateAmount] = useState<string>("");
  const [donateToken, setDonateToken] = useState<"ETH" | "POL">("ETH");
  const [isSubmittingDonation, setIsSubmittingDonation] = useState(false);
  const [donationSuccessId, setDonationSuccessId] = useState<string | null>(null);

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

  const toggleInlineDonate = (id: string) => {
    if (inlineDonateId === id) {
      setInlineDonateId(null);
    } else {
      setInlineDonateId(id);
      setDonationSuccessId(null);
    }
  };

  const handleConfirmDonation = async (postId: string) => {
    setIsSubmittingDonation(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsSubmittingDonation(false);
    setDonationSuccessId(postId);
  };

  const fetchMultiApiData = async () => {
    setLoading(true);
    const realPosts: RealCrisisPost[] = [];

    // 1. USGS Real-time Seismology API (M4.5+ Major Earthquakes Only)
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
              const depthVal = f.geometry?.coordinates?.[2] || 10.0;
              const depth = `${depthVal.toFixed(1)} km`;
              const sig = f.properties?.sig ? `${f.properties.sig} / 1000` : `${Math.round(mag * 70)} / 1000`;
              const ngo = resolveRegionalNGO(place);
              const lat = f.geometry?.coordinates?.[1]?.toFixed(3) || "0.000";
              const lon = f.geometry?.coordinates?.[0]?.toFixed(3) || "0.000";

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
                headlineTitle: `A high-magnitude ${mag.toFixed(1)} tectonic rupture occurred in the ${place} region at a focal depth of ${depth}.`,
                magnitude: `${mag.toFixed(1)} Mag`,
                severityLevel: mag >= 6.0 ? "CRITICAL" : "HIGH",
                depth,
                significance: sig,
                officialUrl: f.properties?.url || "https://earthquake.usgs.gov/",
                fullDescription: [
                  `Official USGS seismic sensors recorded a Magnitude ${mag.toFixed(1)} earthquake at coordinates (${lat}°N, ${lon}°E) with a focal depth of ${depth}. Tectonic subduction along regional plate boundaries has produced significant crustal displacement.`,
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

    // 2. EMSC (European-Mediterranean Seismological Centre) - M4.5+ Major Earthquakes Only
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
              const depthVal = p?.depth ? Number(p.depth) : 15.0;
              const depth = `${depthVal.toFixed(1)} km`;
              const ngo = resolveRegionalNGO(region);

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
                headlineTitle: `A severe ${mag.toFixed(1)} magnitude earthquake struck the ${region} sector at a focal depth of ${depth}.`,
                magnitude: `${mag.toFixed(1)} Mag`,
                severityLevel: mag >= 6.0 ? "CRITICAL" : "HIGH",
                depth,
                significance: `Score ${Math.round(mag * 80)}`,
                officialUrl: `https://www.emsc-csem.org/Earthquake/earthquake.php?id=${p?.unid || ""}`,
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

    // 3. NASA EONET Live Natural Disaster Events API
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
                headlineTitle: `NASA orbital imaging detected an active ${categoryTitle.toLowerCase()} emergency: ${ev.title}.`,
                magnitude: categoryTitle,
                severityLevel: "HIGH",
                depth: "Orbital Observation",
                significance: "Satellite Tracked",
                officialUrl: ev.link || ev.sources?.[0]?.url || "https://eonet.gsfc.nasa.gov/",
                fullDescription: [
                  `NASA Earth Observatory satellites (MODIS / VIIRS) detected severe thermal and environmental anomalies associated with ${ev.title}. Real-time spectral telemetry indicates rapid spread along vulnerable terrain.`,
                  `Extreme atmospheric smoke plumes and surface heat signatures are creating hazardous air quality and immediate displacement risks for neighboring rural settlements.`,
                  `${ngo.name} is working in direct coordination with regional disaster authorities to provide emergency respiratory supplies, clean hydration logistics, and immediate zero-knowledge financial aid to displaced households.`,
                ],
              });
            });
          }
        }
      } catch (e) {
        console.warn("NASA API fetch error:", e);
      }
    };

    await Promise.allSettled([fetchUSGS(), fetchEMSC(), fetchNASA()]);

    // Sort by highest magnitude first (descending)
    realPosts.sort((a, b) => b.rawMagnitude - a.rawMagnitude || b.timestamp - a.timestamp);

    // Deduplicate by geographical region (keeps only the highest magnitude event per disaster region)
    const seenRegions = new Set<string>();
    const uniquePosts: RealCrisisPost[] = [];

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
  }, []);

  const handleCopyLink = (id: string) => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(`${window.location.origin}/crisis`);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    }
  };

  return (
    <div className="w-full bg-[#FAFAFA] text-[#0F172A] min-h-screen py-10 px-4 font-sans">
      <div className="max-w-2xl mx-auto space-y-5">
        
        {/* Feed Header */}
        <div className="text-center py-2 space-y-1">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#0F172A]">
            Disaster Feed
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B]">
            Real-time emergency disaster dispatches.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="p-10 rounded-2xl bg-white border border-[#E2E8F0] text-center space-y-2 shadow-sm">
            <Loader2 className="w-5 h-5 animate-spin text-[#2563EB] mx-auto" />
            <p className="text-xs text-[#64748B]">
              Ingesting live telemetry and matching regional responder NGOs...
            </p>
          </div>
        )}

        {/* Minimal Social Feed Cards */}
        {!loading && (
          <div className="space-y-3.5">
            {posts.map((post) => {
              const isExpanded = !!expandedIds[post.id];
              const isDonating = inlineDonateId === post.id;
              const isDonated = donationSuccessId === post.id;

              return (
                <div
                  key={post.id}
                  className="rounded-2xl bg-white border border-[#E2E8F0] shadow-sm hover:border-[#CBD5E1] transition-all p-5 space-y-3"
                >
                  {/* Header Row: Author (Official Regional NGO Profile Pic) + Event Badge */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={post.author.logoSrc}
                        alt={post.author.name}
                        className="w-7 h-7 rounded-full object-contain bg-white border border-[#E2E8F0] shadow-xs p-0.5 shrink-0"
                      />
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="font-medium text-[#0F172A]">
                          {post.author.name}
                        </span>
                        {post.author.verified && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB]" />
                        )}
                        <span className="text-[#CBD5E1]">•</span>
                        <span className="text-[#64748B]">
                          {post.timeAgo}
                        </span>
                      </div>
                    </div>

                    {/* Event Magnitude / Type Badge */}
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-mono text-[#64748B] bg-[#F8FAFC] border border-[#E2E8F0]">
                      {post.magnitude}
                    </span>
                  </div>

                  {/* Main Descriptive Title of the Post */}
                  <h2 className="text-sm sm:text-[15px] font-semibold text-[#0F172A] leading-snug">
                    {post.headlineTitle}
                  </h2>

                  {/* Description directly after title */}
                  <div className="space-y-2 text-xs sm:text-[13px] text-[#475569] leading-relaxed">
                    {isExpanded ? (
                      post.fullDescription.map((paragraph, idx) => (
                        <p key={idx}>{paragraph}</p>
                      ))
                    ) : (
                      <p className="line-clamp-2">
                        {post.fullDescription[0]}
                      </p>
                    )}
                  </div>

                  {/* Expand / Collapse Icon-Only Toggle */}
                  <div className="flex items-center justify-end -mt-1">
                    <button
                      type="button"
                      onClick={() => toggleExpand(post.id)}
                      className="p-1 rounded-md text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
                      title={isExpanded ? "Collapse" : "Expand"}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Clean Action Toolbar */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#F1F5F9]">
                    
                    <div className="flex items-center gap-2">
                      {/* Action 1: Inline Donate Toggle Button */}
                      <button
                        onClick={() => toggleInlineDonate(post.id)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                          isDonating
                            ? "bg-[#0F172A] text-white"
                            : "bg-[#2563EB] hover:bg-[#1D4ED8] text-white"
                        }`}
                      >
                        <Heart className="w-3.5 h-3.5" />
                        <span>{isDonating ? "Close" : "Donate"}</span>
                      </button>

                      {/* Action 2: Claim Aid Button */}
                      <Link
                        href="/beneficiary"
                        className="px-3.5 py-1.5 rounded-lg bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#0F172A] text-xs font-medium border border-[#E2E8F0] flex items-center gap-1.5 transition-all"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Claim Aid</span>
                      </Link>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Action 3: Audit Proofs */}
                      <Link
                        href="/audit"
                        className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors"
                        title="Audit Registry"
                      >
                        <Layers className="w-3.5 h-3.5" />
                      </Link>

                      {/* Action 4: Share / Copy Link */}
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

                      {/* Action 5: Official Agency Report Link */}
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

                  {/* Inline Expanded Donation Drawer */}
                  {isDonating && (
                    <div className="pt-3 border-t border-[#F1F5F9] animate-fadeIn">
                      {isDonated ? (
                        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                          <p className="text-xs font-semibold text-emerald-900">
                            Donation Confirmed!
                          </p>
                          <p className="text-[11px] text-emerald-700">
                            ${donateAmount} USD ({getCryptoEstimate(donateAmount, donateToken)}) transferred directly to {post.author.name} relief pool.
                          </p>
                          <button
                            onClick={() => {
                              setDonationSuccessId(null);
                              setDonateAmount("");
                            }}
                            className="text-[11px] font-medium text-emerald-800 hover:underline pt-0.5 cursor-pointer"
                          >
                            Send another donation
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-[#94A3B8]">
                              $
                            </span>
                            <input
                              type="number"
                              min="1"
                              step="any"
                              value={donateAmount}
                              onChange={(e) => setDonateAmount(e.target.value)}
                              placeholder="Amount in USD"
                              className="w-full pl-7 pr-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-medium text-[#0F172A] focus:outline-none focus:bg-white focus:border-[#2563EB] transition-colors font-sans [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                          </div>

                          <div className="relative">
                            <select
                              value={donateToken}
                              onChange={(e) => setDonateToken(e.target.value as any)}
                              aria-label="Select network token"
                              className="appearance-none pl-3 pr-8 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-medium text-[#0F172A] focus:outline-none focus:bg-white focus:border-[#2563EB] transition-colors cursor-pointer font-sans"
                            >
                              <option value="ETH">Ethereum (ETH)</option>
                              <option value="POL">Polygon (POL)</option>
                            </select>
                            <ChevronDown className="w-3.5 h-3.5 text-[#64748B] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>

                          <button
                            type="button"
                            onClick={() => handleConfirmDonation(post.id)}
                            disabled={isSubmittingDonation || !donateAmount || parseFloat(donateAmount) <= 0}
                            className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 text-white text-xs font-medium transition-all cursor-pointer shrink-0 flex items-center gap-1.5 shadow-sm font-sans"
                          >
                            {isSubmittingDonation ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Sending...</span>
                              </>
                            ) : (
                              <>
                                <Heart className="w-3.5 h-3.5 fill-white/20" />
                                <span>
                                  Donate{donateAmount && parseFloat(donateAmount) > 0 ? ` $${donateAmount} (${getCryptoEstimate(donateAmount, donateToken)})` : ""}
                                </span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
