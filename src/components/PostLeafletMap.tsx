"use client";

import React, { useEffect, useRef, useState } from "react";
import { 
  MapPin, 
  Layers, 
  RotateCcw, 
  Activity, 
  Radio, 
  ShieldAlert, 
  ExternalLink,
  Info,
  Navigation,
  Compass
} from "lucide-react";

export interface PostMapProps {
  id: string;
  source: "USGS" | "EMSC" | "NASA";
  title: string;
  place: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  magnitude: number;
  magnitudeStr: string;
  depthStr: string;
  depthKm: number;
  intensity: {
    mmi: number;
    level: string;
    color: string;
    shakeRadiusKm: number;
    severeRadiusKm: number;
  };
  officialUrl?: string;
  authorName: string;
}

type TileTheme = "voyager" | "dark" | "satellite";

const TILE_PROVIDERS: Record<TileTheme, { url: string; attribution: string; name: string }> = {
  voyager: {
    name: "Detailed Carto",
    url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  },
  dark: {
    name: "Dark Operations",
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  },
  satellite: {
    name: "Satellite Topo",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: '&copy; <a href="https://www.esri.com/">Esri</a>, Earthstar Geographics',
  },
};

export default function PostLeafletMap({
  id,
  source,
  title,
  place,
  coordinates,
  magnitude,
  magnitudeStr,
  depthStr,
  depthKm,
  intensity,
  officialUrl,
  authorName,
}: PostMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);

  const [activeTheme, setActiveTheme] = useState<TileTheme>("voyager");
  const [isMapReady, setIsMapReady] = useState(false);

  const { lat, lng } = coordinates;

  // Initialize Leaflet map
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (typeof window === "undefined" || !mapContainerRef.current) return;

      // Dynamically load leaflet library safely in client
      const L = (await import("leaflet")).default;

      if (!isMounted) return;

      // If map instance already exists, remove it first to avoid re-init error
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Initial zoom based on shaking radius
      const initialZoom = intensity.shakeRadiusKm > 200 ? 6 : intensity.shakeRadiusKm > 80 ? 7 : 8;

      const map = L.map(mapContainerRef.current, {
        center: [lat, lng],
        zoom: initialZoom,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false,
      });

      mapInstanceRef.current = map;

      // Add Tile Layer
      const currentTile = TILE_PROVIDERS[activeTheme];
      const tileLayer = L.tileLayer(currentTile.url, {
        attribution: currentTile.attribution,
        maxZoom: 18,
        subdomains: "abcd",
      }).addTo(map);

      tileLayerRef.current = tileLayer;

      // Add Concentric Shaking Intensity Rings (Isoseismal zones)
      // 1. Outer Felt / Perceptible Shaking Radius
      if (intensity.shakeRadiusKm > 0) {
        const outerCircle = L.circle([lat, lng], {
          radius: intensity.shakeRadiusKm * 1000,
          color: "#3B82F6",
          weight: 1.5,
          dashArray: "4, 6",
          fillColor: "#60A5FA",
          fillOpacity: 0.1,
        }).addTo(map);

        outerCircle.bindTooltip(
          `<div class="text-[11px] font-sans font-semibold text-slate-800">
            <span class="text-blue-600 font-bold">● Light to Moderate Shaking Zone</span><br/>
            <span>Radius: ~${Math.round(intensity.shakeRadiusKm)} km</span><br/>
            <span class="text-slate-500 font-normal">Perceptible ground tremors</span>
          </div>`,
          { sticky: true, className: "rounded-lg border border-blue-200 shadow-md p-1.5" }
        );
      }

      // 2. Intermediate Strong Shaking Radius
      const midRadiusKm = Math.max(12, Math.round(intensity.shakeRadiusKm * 0.55));
      const midCircle = L.circle([lat, lng], {
        radius: midRadiusKm * 1000,
        color: "#F59E0B",
        weight: 2,
        dashArray: "3, 4",
        fillColor: "#FBBF24",
        fillOpacity: 0.16,
      }).addTo(map);

      midCircle.bindTooltip(
        `<div class="text-[11px] font-sans font-semibold text-slate-800">
          <span class="text-amber-600 font-bold">● Strong Shaking (MMI VI)</span><br/>
          <span>Radius: ~${midRadiusKm} km</span><br/>
          <span class="text-slate-500 font-normal">Dishes break, minor non-structural damage</span>
        </div>`,
        { sticky: true, className: "rounded-lg border border-amber-200 shadow-md p-1.5" }
      );

      // 3. Inner Severe / Epicentral High Intensity Zone
      const innerRadiusKm = Math.max(5, intensity.severeRadiusKm || Math.round(intensity.shakeRadiusKm * 0.25));
      const innerCircle = L.circle([lat, lng], {
        radius: innerRadiusKm * 1000,
        color: "#EF4444",
        weight: 2.5,
        fillColor: "#F87171",
        fillOpacity: 0.28,
      }).addTo(map);

      innerCircle.bindTooltip(
        `<div class="text-[11px] font-sans font-semibold text-slate-800">
          <span class="text-rose-600 font-bold">● Severe Shaking Core (${intensity.level})</span><br/>
          <span>Radius: ~${innerRadiusKm} km</span><br/>
          <span class="text-slate-500 font-normal">High acceleration & masonry hazard</span>
        </div>`,
        { sticky: true, className: "rounded-lg border border-rose-200 shadow-md p-1.5" }
      );

      // Custom Epicenter Pulsing Beacon Pin (DivIcon)
      const isCritical = magnitude >= 6.0 || intensity.mmi >= 7.0;
      const beaconColor = isCritical ? "#E11D48" : "#EA580C";
      const ringColor = isCritical ? "rgba(225, 29, 72, 0.4)" : "rgba(234, 88, 12, 0.4)";

      const epicenterHtml = `
        <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2 cursor-pointer group">
          <!-- Outer Radar Pulse Waves -->
          <div class="absolute w-12 h-12 rounded-full animate-ping opacity-75" style="background-color: ${ringColor};"></div>
          <div class="absolute w-8 h-8 rounded-full animate-pulse opacity-85" style="background-color: ${ringColor};"></div>
          
          <!-- Inner Core Epicenter Badge -->
          <div class="relative z-10 flex items-center gap-1 px-2 py-0.5 rounded-full shadow-lg border-2 border-white text-white font-bold text-[10px] tracking-tight whitespace-nowrap transition-transform duration-200 group-hover:scale-110" style="background-color: ${beaconColor};">
            <span class="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
            <span>${source === "NASA" ? "🔥" : "⚡"} ${magnitudeStr}</span>
          </div>

          <!-- Bottom Anchor Dot -->
          <div class="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full border border-white shadow-xs" style="background-color: ${beaconColor};"></div>
        </div>
      `;

      const epicenterIcon = L.divIcon({
        html: epicenterHtml,
        className: "custom-epicenter-marker",
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      const epicenterMarker = L.marker([lat, lng], { icon: epicenterIcon }).addTo(map);

      // Popup with rich scientific and humanitarian telemetry
      const popupContent = `
        <div class="p-3.5 space-y-2.5 font-sans min-w-[240px] text-[#0F172A]">
          <div class="flex items-center justify-between border-b border-slate-200 pb-2">
            <span class="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${
              isCritical ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"
            }">
              ${source} Verified Epicenter
            </span>
            <span class="text-[11px] font-bold text-slate-500">${intensity.level.split(" ")[0]}</span>
          </div>

          <div class="space-y-1">
            <h4 class="text-xs font-bold text-slate-900 leading-tight">${place}</h4>
            <p class="text-[11px] text-slate-600">Coordinates: <b>${lat.toFixed(3)}°N, ${lng.toFixed(3)}°E</b></p>
          </div>

          <div class="grid grid-cols-2 gap-1.5 pt-1 text-[10px]">
            <div class="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
              <span class="text-slate-500 block">Magnitude</span>
              <span class="font-bold text-slate-900 text-xs">${magnitudeStr}</span>
            </div>
            <div class="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
              <span class="text-slate-500 block">Focal Depth</span>
              <span class="font-bold text-slate-900 text-xs">${depthStr}</span>
            </div>
            <div class="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
              <span class="text-slate-500 block">Estimated MMI</span>
              <span class="font-bold ${isCritical ? "text-rose-600" : "text-amber-600"} text-xs">MMI ${intensity.mmi.toFixed(1)}</span>
            </div>
            <div class="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
              <span class="text-slate-500 block">Felt Radius</span>
              <span class="font-bold text-blue-600 text-xs">~${Math.round(intensity.shakeRadiusKm)} km</span>
            </div>
          </div>

          <div class="pt-1 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Disaster Relief: <b>${authorName}</b></span>
          </div>
        </div>
      `;

      epicenterMarker.bindPopup(popupContent, {
        className: "custom-crisis-popup",
        maxWidth: 280,
      });

      // Invalidate size once to ensure tiles paint properly
      setTimeout(() => {
        if (map && isMounted) {
          map.invalidateSize();
          setIsMapReady(true);
        }
      }, 150);
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lng, magnitude, depthStr, intensity, source, place, authorName]);

  // Handle tile theme switch
  const changeTileTheme = async (theme: TileTheme) => {
    setActiveTheme(theme);
    if (!mapInstanceRef.current) return;
    const L = (await import("leaflet")).default;
    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }
    const newTile = TILE_PROVIDERS[theme];
    const newLayer = L.tileLayer(newTile.url, {
      attribution: newTile.attribution,
      maxZoom: 18,
      subdomains: "abcd",
    }).addTo(mapInstanceRef.current);
    tileLayerRef.current = newLayer;
  };

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      const targetZoom = intensity.shakeRadiusKm > 200 ? 6 : intensity.shakeRadiusKm > 80 ? 7 : 8;
      mapInstanceRef.current.setView([lat, lng], targetZoom, { animate: true });
    }
  };

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-[#E2E8F0] bg-[#F8FAFC] shadow-sm font-sans">
      {/* Map Canvas Container */}
      <div 
        ref={mapContainerRef} 
        className="w-full h-[280px] sm:h-[340px] z-10 cursor-grab active:cursor-grabbing"
      />

      {/* Top Left HUD: Seismic / Disaster Intensity Meter */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 max-w-[calc(100%-120px)] sm:max-w-xs pointer-events-none">
        <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-slate-200/80 shadow-xs pointer-events-auto">
          <span 
            className="w-2.5 h-2.5 rounded-full shrink-0 animate-pulse"
            style={{ backgroundColor: intensity.color }}
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-[#0F172A] truncate">
                {intensity.level}
              </span>
              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-700">
                MMI {intensity.mmi.toFixed(1)}
              </span>
            </div>
            <p className="text-[10px] text-[#64748B] truncate">
              Epicenter: {lat.toFixed(2)}°N, {lng.toFixed(2)}°E &bull; Depth {depthStr}
            </p>
          </div>
        </div>
      </div>

      {/* Top Right Controls: Layers & Recenter */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-white/95 backdrop-blur-md p-1 rounded-xl border border-slate-200/80 shadow-xs">
        <button
          type="button"
          onClick={handleRecenter}
          title="Recenter on Epicenter"
          className="p-1.5 rounded-lg text-[#64748B] hover:text-[#2563EB] hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => {
            const nextTheme: Record<TileTheme, TileTheme> = {
              voyager: "dark",
              dark: "satellite",
              satellite: "voyager",
            };
            changeTileTheme(nextTheme[activeTheme]);
          }}
          title={`Layer: ${TILE_PROVIDERS[activeTheme].name} (Click to switch)`}
          className="p-1.5 rounded-lg text-[#64748B] hover:text-[#2563EB] hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-medium"
        >
          <Layers className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-[10px] uppercase font-bold tracking-wider">
            {activeTheme === "voyager" ? "Topo" : activeTheme === "dark" ? "Dark" : "Sat"}
          </span>
        </button>
      </div>

      {/* Bottom Right: Zoom Controls */}
      <div className="absolute bottom-3 right-3 z-20 flex flex-col gap-1 bg-white/95 backdrop-blur-md p-0.5 rounded-xl border border-slate-200/80 shadow-xs">
        <button
          type="button"
          onClick={handleZoomIn}
          title="Zoom In"
          className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-700 hover:text-blue-600 hover:bg-slate-100 text-sm font-bold transition-colors cursor-pointer"
        >
          +
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          title="Zoom Out"
          className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-700 hover:text-blue-600 hover:bg-slate-100 text-sm font-bold transition-colors cursor-pointer"
        >
          −
        </button>
      </div>

      {/* Bottom Left Legend: Shaking Isoseismal Radii */}
      <div className="absolute bottom-3 left-3 z-20 hidden sm:flex items-center gap-2 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-slate-200/80 shadow-xs text-[10px] text-slate-600">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-rose-500"></span>
          <span>Severe (~{Math.max(5, intensity.severeRadiusKm || Math.round(intensity.shakeRadiusKm * 0.25))}km)</span>
        </div>
        <span>&bull;</span>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          <span>Strong (~{Math.max(12, Math.round(intensity.shakeRadiusKm * 0.55))}km)</span>
        </div>
        <span>&bull;</span>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          <span>Felt (~{Math.round(intensity.shakeRadiusKm)}km)</span>
        </div>
      </div>
    </div>
  );
}
