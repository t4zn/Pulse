"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  ChevronDown,
  Check,
  LayoutGrid,
  Radio,
  Activity,
  Compass,
  Terminal,
  Newspaper,
  Layers,
  Sliders,
  Eye,
  SlidersHorizontal,
  Zap,
} from "lucide-react";
import { LAYOUT_OPTIONS, LayoutOption } from "./types";

interface LayoutSwitcherBarProps {
  currentLayoutId: string;
  onSelectLayout: (id: string) => void;
  totalEventsCount: number;
  filterSource: string;
  onFilterSourceChange: (source: string) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Radio: <Radio className="w-4 h-4" />,
  LayoutGrid: <LayoutGrid className="w-4 h-4" />,
  Activity: <Activity className="w-4 h-4" />,
  Compass: <Compass className="w-4 h-4" />,
  Terminal: <Terminal className="w-4 h-4" />,
  Newspaper: <Newspaper className="w-4 h-4" />,
  Layers: <Layers className="w-4 h-4" />,
  Sparkles: <Sparkles className="w-4 h-4" />,
  Kanban: <SlidersHorizontal className="w-4 h-4" />,
  Sliders: <Sliders className="w-4 h-4" />,
};

export default function LayoutSwitcherBar({
  currentLayoutId,
  onSelectLayout,
  totalEventsCount,
  filterSource,
  onFilterSourceChange,
  searchQuery,
  onSearchQueryChange,
}: LayoutSwitcherBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLayout =
    LAYOUT_OPTIONS.find((l) => l.id === currentLayoutId) || LAYOUT_OPTIONS[0];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="sticky top-16 z-40 bg-[#0B0F19]/95 backdrop-blur-xl border-b border-slate-800/80 text-white shadow-2xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Left: Dropdown Trigger & Current Style Pill */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Main Layout Selector Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-white text-xs font-semibold shadow-lg hover:shadow-cyan-500/10 transition-all cursor-pointer group"
            >
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-xs">
                {ICON_MAP[currentLayout.iconName] || <Sparkles className="w-3.5 h-3.5" />}
              </div>
              <div className="text-left flex flex-col">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  UI Layout (1 of 10)
                </span>
                <span className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  {currentLayout.name}
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {currentLayout.tag}
                  </span>
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 group-hover:text-white transition-transform ml-1 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu Modal */}
            {isOpen && (
              <div className="absolute left-0 mt-2 w-[340px] sm:w-[420px] max-h-[80vh] overflow-y-auto rounded-2xl bg-[#0F172A] border border-slate-700 shadow-2xl p-2.5 space-y-1.5 animate-in fade-in zoom-in-95 z-50">
                <div className="px-3 py-2 border-b border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    Select Creative UI Experience
                  </span>
                  <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                    10 Distinct Designs
                  </span>
                </div>

                <div className="space-y-1 pt-1">
                  {LAYOUT_OPTIONS.map((layout, idx) => {
                    const isSelected = layout.id === currentLayoutId;
                    return (
                      <button
                        key={layout.id}
                        onClick={() => {
                          onSelectLayout(layout.id);
                          setIsOpen(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-3 cursor-pointer border ${
                          isSelected
                            ? "bg-gradient-to-r from-blue-950/80 to-indigo-950/80 border-blue-500/60 shadow-lg text-white"
                            : "hover:bg-slate-800/80 border-transparent text-slate-300 hover:text-white"
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                            isSelected
                              ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                              : "bg-slate-800 text-slate-400 group-hover:text-white"
                          }`}
                        >
                          {ICON_MAP[layout.iconName] || <Sparkles className="w-4 h-4" />}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1.5">
                            <span className="text-xs font-bold truncate">
                              <span className="text-slate-500 mr-1.5">#{idx + 1}</span>
                              {layout.name}
                            </span>
                            <span
                              className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-md border shrink-0 ${
                                isSelected
                                  ? "bg-blue-500/20 text-blue-300 border-blue-400/30"
                                  : "bg-slate-800 text-slate-400 border-slate-700"
                              }`}
                            >
                              {layout.tag}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                            {layout.description}
                          </p>
                        </div>

                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0 mt-1">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Quick Pill Switcher (Visible on Medium+ screens) */}
          <div className="hidden lg:flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 gap-1 overflow-x-auto max-w-[500px]">
            {LAYOUT_OPTIONS.slice(0, 5).map((l, i) => (
              <button
                key={l.id}
                onClick={() => onSelectLayout(l.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  l.id === currentLayoutId
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                }`}
                title={l.description}
              >
                #{i + 1} {l.tag}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Search & Feed Filters */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-48">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              placeholder="Filter country / mag..."
              className="w-full pl-3 pr-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Source Filter Tabs */}
          <div className="flex items-center p-0.5 rounded-lg bg-slate-900 border border-slate-800 gap-0.5">
            {["ALL", "USGS", "EMSC", "NASA"].map((src) => (
              <button
                key={src}
                onClick={() => onFilterSourceChange(src)}
                className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                  filterSource === src
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {src}
              </button>
            ))}
          </div>

          {/* Live Telemetry Ping */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-[10px] text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{totalEventsCount} Live Events</span>
          </div>
        </div>
      </div>
    </div>
  );
}
