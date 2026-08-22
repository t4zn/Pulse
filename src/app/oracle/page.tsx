"use client";

export const dynamic = "force-dynamic";

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
    <div className="w-full bg-white text-ink min-h-screen py-8 px-4 md:px-8">
      <div className="max-w-[1280px] mx-auto">
        {/* Page Header */}
        <div className="flex flex-col items-start gap-2 mb-8">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-soft border border-hairline text-xs font-mono text-primary">
            <Cpu className="w-3.5 h-3.5" /> Powered by Google Gemini 2.5 Flash
          </div>
          <h1 className="text-2xl md:text-4xl font-normal tracking-tight text-ink">
            AI Disaster Severity Oracle
          </h1>
          <p className="text-sm text-body max-w-xl leading-relaxed">
            Simulate real-time seismic sensor telemetry and satellite optical layers evaluated by <strong>Gemini 2.5 Flash</strong>. When magnitude &ge; <strong>7.0</strong>, the smart contract automatically releases 20% emergency contingency reserves.
          </p>
        </div>

        <div className="max-w-2xl p-6 rounded-2xl bg-white border border-hairline shadow-card space-y-6">
          {/* Controls Box */}
          <div className="space-y-4">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-body flex items-center gap-1.5 font-semibold">
                <Sliders className="w-4 h-4 text-primary" /> SIMULATED RICHTER MAGNITUDE
              </span>
              <span className={`font-semibold text-sm ${richterMagnitude >= 7.0 ? "text-semantic-down" : "text-ink"}`}>
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
              className="w-full h-2 bg-surface-strong rounded-full appearance-none cursor-pointer accent-primary"
            />

            <div className="flex items-center justify-between text-xs font-mono text-muted">
              <span>4.0 (Minor)</span>
              <span className="text-semantic-down font-semibold">7.0 (Threshold)</span>
              <span>9.5 (Catastrophic)</span>
            </div>
          </div>

          {/* AI Decision Preview Box */}
          <div className="p-4 rounded-xl bg-surface-soft border border-hairline space-y-2.5 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-hairline">
              <span className="text-ink font-semibold">Gemini 2.5 Flash Inference Engine</span>
              <span className="text-primary text-[10px]">Model: gemini-2.5-flash</span>
            </div>

            <div className="flex items-center justify-between text-body">
              <span>Seismic Risk Index:</span>
              <span className={richterMagnitude >= 7.0 ? "text-semantic-down font-semibold" : "text-semantic-up font-semibold"}>
                {(richterMagnitude * 1.05).toFixed(2)} / 10.0
              </span>
            </div>

            <div className="flex items-center justify-between text-body">
              <span>Auto Contingency Unlock:</span>
              <span className={richterMagnitude >= 7.0 ? "text-semantic-down font-semibold" : "text-muted"}>
                {richterMagnitude >= 7.0 ? "ELIGIBLE (20% Reserve Release)" : "LOCKED (Below 7.0 Threshold)"}
              </span>
            </div>
          </div>

          {/* Trigger Action */}
          {triggered ? (
            <div className="p-5 rounded-xl bg-red-50 border border-red-200 text-center font-mono text-xs space-y-2">
              <div className="font-semibold text-sm text-semantic-down flex items-center justify-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-semantic-down" /> Emergency Unlock Executed
              </div>
              <div className="text-xs text-body">Method <code>triggerEmergencyUnlock()</code> invoked successfully.</div>
              <div className="p-2.5 rounded-lg bg-white border border-hairline text-ink text-xs font-semibold">
                $248,100 (20% Vault Reserve) unlocked instantly for emergency search & rescue.
              </div>
              <Link href="/audit" className="inline-block text-primary hover:underline text-xs pt-1 font-semibold">
                View Receipt in Audit Ledger →
              </Link>
            </div>
          ) : (
            <button
              onClick={handleTrigger}
              disabled={triggering || richterMagnitude < 7.0}
              className={`w-full py-3 px-4 rounded-full text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
                richterMagnitude >= 7.0
                  ? "bg-primary hover:bg-primary-hover active:bg-primary-active text-white cursor-pointer shadow-sm"
                  : "bg-surface-soft text-muted border border-hairline cursor-not-allowed"
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
