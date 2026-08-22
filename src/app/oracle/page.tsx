"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Cpu, ArrowLeft, Zap, AlertTriangle, CheckCircle2, Sliders, Activity } from "lucide-react";

export default function OraclePage() {
  const [richterMagnitude, setRichterMagnitude] = useState(7.4);
  const [triggering, setTriggering] = useState(false);
  const [triggered, setTriggered] = useState(false);

  const handleTrigger = () => {
    setTriggering(true);
    setTimeout(() => {
      setTriggering(false);
      setTriggered(true);
    }, 1500);
  };

  return (
    <div className="w-full bg-canvas text-ink min-h-screen py-8 px-4 md:px-8">
      <div className="max-w-[1280px] mx-auto">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-mono text-ink-subtle hover:text-ink mb-6 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Command Center
        </Link>

        {/* Page Header */}
        <div className="flex flex-col items-start gap-2 mb-8">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-pill bg-surface-1 border border-hairline text-[10px] font-mono text-primary">
            <Cpu className="w-3 h-3" /> Powered by Google Gemini 2.5 Flash
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-ink">
            AI Disaster Severity Oracle Simulator
          </h1>
          <p className="text-xs md:text-sm text-ink-subtle max-w-xl leading-relaxed">
            Simulate real-time seismic sensor telemetry and satellite imagery evaluated by <strong>Gemini 2.5 Flash</strong>. When magnitude &ge; <strong>7.0</strong>, the smart contract automatically releases 20% emergency contingency reserves.
          </p>
        </div>

        <div className="max-w-2xl p-6 rounded-lg bg-surface-1 border border-hairline space-y-6">
          {/* Controls Box */}
          <div className="space-y-3">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-ink-subtle flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-primary" /> SIMULATED RICHTER MAGNITUDE
              </span>
              <span className={`font-semibold ${richterMagnitude >= 7.0 ? "text-red-400" : "text-ink"}`}>
                Magnitude {richterMagnitude.toFixed(1)}
              </span>
            </div>

            <input
              type="range"
              min="4.0"
              max="9.5"
              step="0.1"
              value={richterMagnitude}
              onChange={(e) => setRichterMagnitude(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-surface-3 rounded-full appearance-none cursor-pointer accent-primary"
            />

            <div className="flex items-center justify-between text-[10px] font-mono text-ink-tertiary">
              <span>4.0 (Minor)</span>
              <span className="text-red-400 font-semibold">7.0 (Emergency Trigger Threshold)</span>
              <span>9.5 (Catastrophic)</span>
            </div>
          </div>

          {/* AI Decision Preview Box */}
          <div className="p-4 rounded bg-canvas border border-hairline space-y-2.5 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-hairline">
              <span className="text-ink font-semibold">Gemini 2.5 Flash Inference Engine</span>
              <span className="text-primary text-[10px]">Model: gemini-2.5-flash</span>
            </div>

            <div className="flex items-center justify-between text-ink-subtle">
              <span>Seismic Risk Index:</span>
              <span className={richterMagnitude >= 7.0 ? "text-red-400 font-semibold" : "text-semantic-success font-semibold"}>
                {(richterMagnitude * 1.05).toFixed(2)} / 10.0
              </span>
            </div>

            <div className="flex items-center justify-between text-ink-subtle">
              <span>Auto Contingency Unlock:</span>
              <span className={richterMagnitude >= 7.0 ? "text-red-400 font-semibold" : "text-ink-tertiary"}>
                {richterMagnitude >= 7.0 ? "ELIGIBLE (20% Reserve Release)" : "LOCKED (Below 7.0 Threshold)"}
              </span>
            </div>
          </div>

          {/* Trigger Action */}
          {triggered ? (
            <div className="p-4 rounded bg-surface-2 border border-red-900/50 text-red-300 text-center font-mono text-xs space-y-2">
              <div className="font-semibold text-sm text-red-400 flex items-center justify-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-400" /> Emergency Unlock Executed
              </div>
              <div className="text-[11px] text-ink-subtle">Method <code>triggerEmergencyUnlock()</code> invoked successfully.</div>
              <div className="p-2 rounded bg-canvas border border-hairline text-ink-muted text-[10px]">
                $248,100 (20% Vault Reserve) unlocked instantly for field rescue.
              </div>
              <Link href="/audit" className="inline-block text-primary hover:underline text-[11px] pt-1">
                View Receipt in Audit Ledger →
              </Link>
            </div>
          ) : (
            <button
              onClick={handleTrigger}
              disabled={triggering || richterMagnitude < 7.0}
              className={`w-full py-2.5 px-4 rounded-md text-xs font-medium tracking-button transition-colors flex items-center justify-center gap-2 ${
                richterMagnitude >= 7.0
                  ? "bg-red-600 hover:bg-red-500 text-white cursor-pointer"
                  : "bg-surface-2 text-ink-tertiary border border-hairline cursor-not-allowed"
              }`}
            >
              {triggering ? (
                <span className="font-mono text-xs animate-pulse">Broadcasting Gemini Oracle Alert to Smart Contract...</span>
              ) : richterMagnitude >= 7.0 ? (
                <>
                  <Zap className="w-3.5 h-3.5" />
                  <span>Broadcast Critical Alert & Auto-Unlock 20% Fund</span>
                </>
              ) : (
                <span>Increase Magnitude &ge; 7.0 to Test Emergency Trigger</span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
