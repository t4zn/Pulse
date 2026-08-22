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
    }, 1800);
  };

  return (
    <div className="w-full bg-canvas text-ink min-h-screen py-12 px-4 md:px-8">
      <div className="max-w-[1280px] mx-auto">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-mono text-ink-subtle hover:text-ink mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Global Command Center
        </Link>

        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-pill bg-primary/10 border border-primary/30 mb-4 text-xs font-mono text-primary">
            <Cpu className="w-3.5 h-3.5" /> Powered by Google Gemini 2.5 Flash
          </div>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-headline text-ink mb-4">
            AI Disaster Severity Oracle Simulator
          </h1>
          <p className="text-ink-subtle text-base max-w-xl">
            Simulate real-time seismic sensor telemetry and satellite imagery evaluated by <strong>Gemini 2.5 Flash</strong>. When magnitude exceeds <strong>7.0</strong>, the smart contract automatically releases 20% emergency contingency reserves.
          </p>
        </div>

        <div className="max-w-3xl mx-auto p-8 rounded-xl bg-surface-1 border border-hairline space-y-8">
          {/* Controls Box */}
          <div className="space-y-4">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-ink-subtle flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-primary" /> SIMULATED EARTHQUAKE RICHTER MAGNITUDE
              </span>
              <span className={`font-bold text-sm ${richterMagnitude >= 7.0 ? "text-red-400" : "text-ink"}`}>
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
              className="w-full h-2 bg-surface-3 rounded-lg appearance-none cursor-pointer accent-primary"
            />

            <div className="flex items-center justify-between text-[11px] font-mono text-ink-tertiary">
              <span>4.0 (Minor Tremor)</span>
              <span className="text-red-400 font-bold">7.0 (Emergency Trigger Threshold)</span>
              <span>9.5 (Catastrophic)</span>
            </div>
          </div>

          {/* AI Decision Preview Box */}
          <div className="p-6 rounded-lg bg-canvas border border-hairline space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-hairline">
              <span className="text-ink font-semibold">Gemini 2.5 Flash Inference Engine</span>
              <span className="text-primary font-mono text-[11px]">Model: gemini-2.5-flash</span>
            </div>

            <div className="flex items-center justify-between text-ink-subtle">
              <span>Seismic Telemetry Risk Index:</span>
              <span className={richterMagnitude >= 7.0 ? "text-red-400 font-bold" : "text-semantic-success font-bold"}>
                {(richterMagnitude * 1.05).toFixed(2)} / 10.0
              </span>
            </div>

            <div className="flex items-center justify-between text-ink-subtle">
              <span>Auto Contingency Unlock:</span>
              <span className={richterMagnitude >= 7.0 ? "text-red-400 font-bold" : "text-ink-tertiary"}>
                {richterMagnitude >= 7.0 ? "ELIGIBLE (20% Reserve Release)" : "LOCKED (Below 7.0 Threshold)"}
              </span>
            </div>
          </div>

          {/* Trigger Action */}
          {triggered ? (
            <div className="p-6 rounded-lg bg-red-950/30 border border-red-800/50 text-red-300 text-center font-mono text-xs space-y-3">
              <AlertTriangle className="w-8 h-8 text-red-400 mx-auto animate-bounce" />
              <div className="font-bold text-base text-red-400">CRITICAL EMERGENCY UNLOCK EXECUTED!</div>
              <div>Smart Contract method <code>triggerEmergencyUnlock()</code> invoked successfully.</div>
              <div className="p-3 rounded bg-canvas border border-hairline text-ink-muted text-[11px]">
                $248,100 (20% Vault Reserve) unlocked instantly for field emergency rescue.
              </div>
              <Link href="/audit" className="inline-block text-primary underline pt-1">
                View On-Chain Receipt in Audit Ledger →
              </Link>
            </div>
          ) : (
            <button
              onClick={handleTrigger}
              disabled={triggering || richterMagnitude < 7.0}
              className={`w-full py-4 px-6 rounded-md text-sm font-medium tracking-button transition-all flex items-center justify-center gap-2 ${
                richterMagnitude >= 7.0
                  ? "bg-red-600 hover:bg-red-500 text-white shadow-[0_0_24px_rgba(220,38,38,0.4)] cursor-pointer"
                  : "bg-surface-2 text-ink-tertiary border border-hairline cursor-not-allowed"
              }`}
            >
              {triggering ? (
                <span className="font-mono text-xs animate-pulse">Broadcasting Gemini Oracle Alert to Smart Contract...</span>
              ) : richterMagnitude >= 7.0 ? (
                <>
                  <Zap className="w-4 h-4" />
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
