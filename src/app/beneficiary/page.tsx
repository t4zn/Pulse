"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShieldCheck, ArrowLeft, CheckCircle2, Lock, FileText, Upload, Sparkles } from "lucide-react";

export default function BeneficiaryPage() {
  const [claimCode, setClaimCode] = useState("TURKEY-ZK-8821-SAFE");
  const [verifying, setVerifying] = useState(false);
  const [claimed, setClaimed] = useState(false);

  const handleClaim = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setClaimed(true);
    }, 1500);
  };

  return (
    <div className="w-full bg-canvas text-ink min-h-screen py-12 px-4 md:px-8">
      <div className="max-w-[1280px] mx-auto">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-mono text-ink-subtle hover:text-ink mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Global Command Center
        </Link>

        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-pill bg-surface-1 border border-hairline mb-4 text-xs font-mono text-semantic-success">
            <Lock className="w-3.5 h-3.5" /> Zero-Knowledge Privacy Payouts
          </div>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-headline text-ink mb-4">
            Beneficiary & Gasless Claim Portal
          </h1>
          <p className="text-ink-subtle text-base max-w-xl">
            Disaster victims receive direct emergency aid with <strong>0 gas fees</strong> (sponsored via EIP-712 meta-transactions). Beneficiary identities remain cryptographically protected via Keccak256 Merkle Roots.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Claim Box for Victims */}
          <div className="p-8 rounded-xl bg-surface-1 border border-hairline flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-md bg-canvas border border-hairline flex items-center justify-center text-semantic-success">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-medium tracking-card text-ink">Victim Aid Claim</h2>
                  <span className="text-xs font-mono text-ink-subtle">Zero Gas Fees • Direct Wallet Transfer</span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <label className="text-xs font-mono text-ink-subtle">ENTER MERKLE VOUCHER CLAIM CODE</label>
                <input
                  type="text"
                  value={claimCode}
                  onChange={(e) => setClaimCode(e.target.value)}
                  className="w-full bg-surface-2 border border-hairline focus:border-semantic-success text-ink px-4 py-2.5 rounded-md text-sm font-mono focus:outline-none"
                />
              </div>

              <div className="p-4 rounded-md bg-canvas border border-hairline text-xs font-mono text-ink-subtle space-y-2 mb-6">
                <div className="flex items-center justify-between text-ink">
                  <span>Cryptographic Proof:</span>
                  <span className="text-semantic-success font-semibold">Merkle Root Verified</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Sponsorship Fee:</span>
                  <span className="text-primary font-semibold">$0.00 (Pulse Relayer)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Payout Allocation:</span>
                  <span className="text-ink">$150.00 USDC</span>
                </div>
              </div>
            </div>

            {claimed ? (
              <div className="p-4 rounded-md bg-semantic-success/10 border border-semantic-success/30 text-semantic-success text-center font-mono text-xs space-y-2">
                <CheckCircle2 className="w-6 h-6 mx-auto" />
                <div className="font-bold text-sm">Aid Transferred Successfully!</div>
                <div className="text-[11px] text-ink-subtle">Receipt pinned on IPFS: QmX8a...92b1</div>
              </div>
            ) : (
              <button
                onClick={handleClaim}
                disabled={verifying}
                className="w-full py-3 px-4 rounded-md bg-semantic-success hover:bg-emerald-600 text-white text-sm font-medium tracking-button transition-all shadow-[0_0_20px_rgba(39,166,68,0.3)] flex items-center justify-center gap-2"
              >
                {verifying ? (
                  <span className="font-mono text-xs animate-pulse">Verifying ZK Merkle Proof...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Claim $150 Aid (0 Gas Fees)</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* NGO Field Console Box */}
          <div className="p-8 rounded-xl bg-surface-1 border border-hairline flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-md bg-canvas border border-hairline flex items-center justify-center text-primary">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-medium tracking-card text-ink">Relief NGO Admin Console</h2>
                  <span className="text-xs font-mono text-ink-subtle">Register Beneficiary List</span>
                </div>
              </div>

              <p className="text-xs text-ink-subtle leading-relaxed mb-6">
                Field workers physically verify victims, upload anonymized hashes, compute 32-byte Merkle Roots, and commit them on-chain.
              </p>

              <div className="border-2 border-dashed border-hairline hover:border-hairline-strong rounded-lg p-6 text-center bg-canvas text-xs text-ink-subtle cursor-pointer mb-6 transition-all">
                <Upload className="w-6 h-6 mx-auto text-ink-tertiary mb-2" />
                <span className="text-ink font-semibold">Click to upload victim list (.csv)</span>
                <p className="text-[11px] text-ink-tertiary mt-1">Generates Keccak256 Merkle Tree automatically</p>
              </div>
            </div>

            <button className="w-full py-2.5 px-4 rounded-md bg-surface-2 hover:bg-surface-3 text-ink text-xs font-mono border border-hairline transition-all">
              Generate Printable Offline QR Vouchers
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
