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
    <div className="w-full bg-canvas text-ink min-h-screen py-8 px-4 md:px-8">
      <div className="max-w-[1280px] mx-auto">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-mono text-ink-subtle hover:text-ink mb-6 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Command Center
        </Link>

        {/* Page Header */}
        <div className="flex flex-col items-start gap-2 mb-8">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-pill bg-surface-1 border border-hairline text-[10px] font-mono text-semantic-success">
            <Lock className="w-3 h-3" /> Zero-Knowledge Identity Protection
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-ink">
            Beneficiary & Gasless Claim Portal
          </h1>
          <p className="text-xs md:text-sm text-ink-subtle max-w-xl leading-relaxed">
            Disaster victims receive direct emergency aid with <strong>0 gas fees</strong> (sponsored via EIP-712 meta-transactions). Beneficiary identities remain cryptographically protected via Keccak256 Merkle Roots.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          {/* Claim Box for Victims */}
          <div className="p-6 rounded-lg bg-surface-1 border border-hairline flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-hairline">
                <div className="w-7 h-7 rounded-md bg-canvas border border-hairline flex items-center justify-center text-semantic-success">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold tracking-tight text-ink">Victim Aid Claim</h2>
                  <span className="text-[10px] font-mono text-ink-subtle">Zero Gas Fees • Direct Wallet Transfer</span>
                </div>
              </div>

              <div className="space-y-1.5 mb-4">
                <label className="text-[11px] font-mono text-ink-subtle">MERKLE VOUCHER CLAIM CODE</label>
                <input
                  type="text"
                  value={claimCode}
                  onChange={(e) => setClaimCode(e.target.value)}
                  className="w-full bg-canvas border border-hairline focus:border-primary text-ink px-3 py-2 rounded-md text-xs font-mono focus:outline-none"
                />
              </div>

              <div className="p-3 rounded-md bg-canvas border border-hairline text-[11px] font-mono text-ink-subtle space-y-1.5 mb-5">
                <div className="flex items-center justify-between text-ink">
                  <span>Cryptographic Proof:</span>
                  <span className="text-semantic-success font-medium">Merkle Root Verified</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Sponsorship Fee:</span>
                  <span className="text-primary font-medium">$0.00 (Pulse Relayer)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Payout Allocation:</span>
                  <span className="text-ink font-semibold">$150.00 USDC</span>
                </div>
              </div>
            </div>

            {claimed ? (
              <div className="p-3 rounded-md bg-surface-2 border border-semantic-success/30 text-semantic-success text-center font-mono text-xs space-y-1.5">
                <div className="flex items-center justify-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4" /> Aid Transferred Successfully
                </div>
                <div className="text-[10px] text-ink-subtle">Receipt pinned on IPFS: QmX8a...92b1</div>
              </div>
            ) : (
              <button
                onClick={handleClaim}
                disabled={verifying}
                className="w-full py-2.5 px-4 rounded-md bg-primary hover:bg-primary-hover active:bg-primary-focus text-white text-xs font-medium tracking-button transition-colors flex items-center justify-center gap-2"
              >
                {verifying ? (
                  <span className="font-mono text-xs animate-pulse">Verifying ZK Merkle Proof...</span>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Claim $150 Aid (0 Gas Fees)</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* NGO Field Console Box */}
          <div className="p-6 rounded-lg bg-surface-1 border border-hairline flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-hairline">
                <div className="w-7 h-7 rounded-md bg-canvas border border-hairline flex items-center justify-center text-primary">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold tracking-tight text-ink">Relief NGO Field Console</h2>
                  <span className="text-[10px] font-mono text-ink-subtle">Register Beneficiary List</span>
                </div>
              </div>

              <p className="text-xs text-ink-subtle leading-relaxed mb-4">
                Field workers physically verify victims, upload anonymized hashes, compute 32-byte Merkle Roots, and commit them on-chain.
              </p>

              <div className="border border-dashed border-hairline hover:border-hairline-strong rounded-md p-5 text-center bg-canvas text-xs text-ink-subtle cursor-pointer mb-5 transition-colors">
                <Upload className="w-5 h-5 mx-auto text-ink-tertiary mb-1.5" />
                <span className="text-ink font-medium text-xs">Upload Verified Beneficiaries (.csv)</span>
                <p className="text-[10px] text-ink-tertiary mt-0.5">Auto-generates Keccak256 Merkle Tree</p>
              </div>
            </div>

            <button className="w-full py-2 px-3 rounded-md bg-surface-2 hover:bg-surface-3 text-ink text-xs font-mono border border-hairline transition-colors">
              Generate Printable Offline QR Vouchers
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
