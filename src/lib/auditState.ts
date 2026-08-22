/**
 * PULSE Audit State & Event Store
 * 
 * Manages verified blockchain audit events, live claims, Merkle root commits,
 * and cross-chain metrics across Ethereum Sepolia and Polygon Amoy.
 */

import { hashAddress } from "./merkle";
import { NETWORKS } from "./contracts";

export type AuditEventType = "donation" | "verification" | "disbursement";

export interface AuditEvent {
  id: string;
  network: "sepolia" | "amoy";
  networkName: "Ethereum Sepolia" | "Polygon Amoy";
  chainId: number;
  blockNumber: number;
  eventType: AuditEventType;
  eventName: "DonationReceived" | "CrossChainDonationInitiated" | "BeneficiaryVerified" | "MerkleRootCommitted" | "AidDisbursed" | "AidClaimed";
  txHash: string;
  fromAddress: string;
  toAddress: string;
  beneficiaryAddress?: string;
  merkleLeaf?: string;
  amountUSD: number;
  amountCrypto: string;
  timestamp: string;
  timeAgo: string;
  ipfsCid?: string;
  category?: "Medical Care" | "Food Rations" | "Emergency Shelter";
  gasUsed: number;
  gasPriceGwei: number;
  isLiveEvent?: boolean;
}

export interface CommittedRootRecord {
  id: string;
  root: string;
  txHash: string;
  ipfsCid: string;
  addressCount: number;
  crisisId: string;
  vaultName: string;
  network: "sepolia" | "amoy";
  networkName: string;
  timestamp: string;
  committedBy: string;
}

export interface VoucherBatchRecord {
  id: string;
  crisisId: string;
  count: number;
  root: string;
  allocation: string;
  timestamp: string;
}

// ─── Verified Seed Events (Directly mirroring Solidity contract events) ────────

export const SEED_AUDIT_EVENTS: AuditEvent[] = [
  {
    id: "evt-1",
    network: "sepolia",
    networkName: "Ethereum Sepolia",
    chainId: 11155111,
    blockNumber: 5938110,
    eventType: "donation",
    eventName: "DonationReceived",
    txHash: "0x83a19b22e11a98071e44bcda12349876543210fedcba9901847192837482910c",
    fromAddress: "0x7F23190bA8812c45e89d1234567890abcdefB39a",
    toAddress: NETWORKS.sepolia.contracts.vault,
    amountUSD: 2460.00,
    amountCrypto: "0.82 ETH",
    timestamp: "2026-08-22T10:35:12Z",
    timeAgo: "2m ago",
    gasUsed: 21000,
    gasPriceGwei: 18.5,
  },
  {
    id: "evt-2",
    network: "amoy",
    networkName: "Polygon Amoy",
    chainId: 80002,
    blockNumber: 8421905,
    eventType: "disbursement",
    eventName: "AidDisbursed",
    txHash: "0x8f119a2b8e34c990a012bcf45612349078abcedf1244bcda12349876543210fe",
    fromAddress: NETWORKS.amoy.contracts.vault,
    toAddress: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    beneficiaryAddress: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    merkleLeaf: hashAddress("0x70997970C51812dc3A010C7d01b50e0d17dc79C8"),
    amountUSD: 150.00,
    amountCrypto: "230.7 POL",
    timestamp: "2026-08-22T10:28:44Z",
    timeAgo: "8m ago",
    ipfsCid: "QmY9aX781b2c45e89d1234567890abcdef31x8",
    category: "Medical Care",
    gasUsed: 42810,
    gasPriceGwei: 28.5,
  },
  {
    id: "evt-3",
    network: "amoy",
    networkName: "Polygon Amoy",
    chainId: 80002,
    blockNumber: 8421890,
    eventType: "verification",
    eventName: "MerkleRootCommitted",
    txHash: "0x1d4499aa77e98123bcdef09876543210fedcba876544bcda12349876543210",
    fromAddress: "0x90214c0988771234567890abcdef1234567890ab",
    toAddress: NETWORKS.amoy.contracts.beneficiaryRegistry,
    amountUSD: 0,
    amountCrypto: "0.00 POL",
    timestamp: "2026-08-22T09:55:20Z",
    timeAgo: "42m ago",
    ipfsCid: "QmA4412984012e98712390481239840129384e",
    gasUsed: 68400,
    gasPriceGwei: 27.2,
  },
  {
    id: "evt-4",
    network: "sepolia",
    networkName: "Ethereum Sepolia",
    chainId: 11155111,
    blockNumber: 5938091,
    eventType: "donation",
    eventName: "CrossChainDonationInitiated",
    txHash: "0x55f981290384aa12309876123490871234fedcab1288c290184719283748291",
    fromAddress: "0x334411ee8812c45e89d1234567890abcdef8812",
    toAddress: NETWORKS.sepolia.contracts.portal || NETWORKS.sepolia.contracts.vault,
    amountUSD: 4950.00,
    amountCrypto: "1.65 ETH",
    timestamp: "2026-08-22T08:15:30Z",
    timeAgo: "2h ago",
    gasUsed: 44200,
    gasPriceGwei: 19.5,
  },
  {
    id: "evt-5",
    network: "amoy",
    networkName: "Polygon Amoy",
    chainId: 80002,
    blockNumber: 8421876,
    eventType: "disbursement",
    eventName: "AidDisbursed",
    txHash: "0x77b81290384729183749281729384719283749182344bcda12349876543210fe",
    fromAddress: NETWORKS.amoy.contracts.vault,
    toAddress: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    beneficiaryAddress: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    merkleLeaf: hashAddress("0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"),
    amountUSD: 300.00,
    amountCrypto: "461.5 POL",
    timestamp: "2026-08-22T07:42:11Z",
    timeAgo: "3h ago",
    ipfsCid: "QmK992182938471928374918293847192837491823",
    category: "Emergency Shelter",
    gasUsed: 39900,
    gasPriceGwei: 26.1,
  },
  {
    id: "evt-6",
    network: "sepolia",
    networkName: "Ethereum Sepolia",
    chainId: 11155111,
    blockNumber: 5938060,
    eventType: "disbursement",
    eventName: "AidClaimed",
    txHash: "0x3c2244bb11a98071e44bcda12349876543210fedcba88c290184719283748291",
    fromAddress: NETWORKS.sepolia.contracts.vault,
    toAddress: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    beneficiaryAddress: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    merkleLeaf: hashAddress("0x90F79bf6EB2c4f870365E785982E1f101E93b906"),
    amountUSD: 1320.00,
    amountCrypto: "0.44 ETH",
    timestamp: "2026-08-22T06:30:00Z",
    timeAgo: "4h ago",
    ipfsCid: "QmZ11902bcda44188c2901847192837482910c",
    category: "Food Rations",
    gasUsed: 51200,
    gasPriceGwei: 18.2,
  }
];

// ─── LocalStorage Keys ────────────────────────────────────────────────────────
const STORAGE_EVENTS_KEY = "pulse_audit_live_events";
const STORAGE_ROOTS_KEY = "pulse_audit_committed_roots";
const STORAGE_VOUCHERS_KEY = "pulse_audit_voucher_batches";
const SYNC_EVENT_NAME = "pulse:audit_sync";

// ─── State Methods ────────────────────────────────────────────────────────────

export function getStoredAuditEvents(): AuditEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_EVENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Failed to parse stored audit events:", e);
    return [];
  }
}

export function saveBeneficiaryClaim(claimData: {
  txHash: string;
  beneficiaryAddress: string;
  merkleLeaf: string;
  amountUSD?: number;
  category?: "Medical Care" | "Food Rations" | "Emergency Shelter";
  vaultName?: string;
  ipfsReceipt?: string;
}): AuditEvent {
  const amount = claimData.amountUSD || 150;
  const newEvent: AuditEvent = {
    id: `live-claim-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    network: "amoy",
    networkName: "Polygon Amoy",
    chainId: 80002,
    blockNumber: 8421910 + Math.floor(Math.random() * 50),
    eventType: "disbursement",
    eventName: "AidClaimed",
    txHash: claimData.txHash,
    fromAddress: NETWORKS.amoy.contracts.vault,
    toAddress: claimData.beneficiaryAddress,
    beneficiaryAddress: claimData.beneficiaryAddress,
    merkleLeaf: claimData.merkleLeaf || hashAddress(claimData.beneficiaryAddress),
    amountUSD: amount,
    amountCrypto: `${(amount * 1.538).toFixed(1)} POL`,
    timestamp: new Date().toISOString(),
    timeAgo: "Just now",
    ipfsCid: claimData.ipfsReceipt || "QmX8a77192038471928374918293847192837491823",
    category: claimData.category || "Medical Care",
    gasUsed: 41200 + Math.floor(Math.random() * 2000),
    gasPriceGwei: 28.0,
    isLiveEvent: true,
  };

  if (typeof window !== "undefined") {
    const existing = getStoredAuditEvents();
    const updated = [newEvent, ...existing];
    localStorage.setItem(STORAGE_EVENTS_KEY, JSON.stringify(updated));
    
    window.dispatchEvent(new CustomEvent(SYNC_EVENT_NAME, {
      detail: { type: "CLAIM_ADDED", event: newEvent }
    }));
  }

  return newEvent;
}

export function saveDonationRecord(donationData: {
  txHash: string;
  donorAddress?: string;
  amountUSD: number;
  amountCrypto: string;
  networkName: "Ethereum Sepolia" | "Polygon Amoy";
  poolName: string;
  ipfsReceipt: string;
}): AuditEvent {
  const newEvent: AuditEvent = {
    id: `live-donation-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    network: donationData.networkName.includes("Ethereum") ? "sepolia" : "amoy",
    networkName: donationData.networkName,
    chainId: donationData.networkName.includes("Ethereum") ? 11155111 : 80002,
    blockNumber: 8421950 + Math.floor(Math.random() * 50),
    eventType: "donation",
    eventName: "DonationReceived",
    txHash: donationData.txHash,
    fromAddress: donationData.donorAddress || "0x7F23190bA8812c45e89d1234567890abcdefB39a",
    toAddress: NETWORKS.amoy.contracts.vault,
    amountUSD: donationData.amountUSD,
    amountCrypto: donationData.amountCrypto,
    timestamp: new Date().toISOString(),
    timeAgo: "Just now",
    ipfsCid: donationData.ipfsReceipt,
    category: "Emergency Shelter",
    gasUsed: 21000,
    gasPriceGwei: 24.0,
    isLiveEvent: true,
  };

  if (typeof window !== "undefined") {
    const existing = getStoredAuditEvents();
    const updated = [newEvent, ...existing];
    localStorage.setItem(STORAGE_EVENTS_KEY, JSON.stringify(updated));
    
    window.dispatchEvent(new CustomEvent(SYNC_EVENT_NAME, {
      detail: { type: "DONATION_ADDED", event: newEvent }
    }));
  }

  return newEvent;
}

export function getStoredCommittedRoots(): CommittedRootRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_ROOTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Failed to parse stored committed roots:", e);
    return [];
  }
}

export function saveCommittedRoot(rootData: {
  root: string;
  txHash: string;
  ipfsCid: string;
  addressCount: number;
  crisisId?: string;
  vaultName?: string;
}): CommittedRootRecord {
  const newRoot: CommittedRootRecord = {
    id: `live-root-${Date.now()}`,
    root: rootData.root,
    txHash: rootData.txHash,
    ipfsCid: rootData.ipfsCid,
    addressCount: rootData.addressCount,
    crisisId: rootData.crisisId || "turkey-earthquake-2026",
    vaultName: rootData.vaultName || "Turkey 7.8M Earthquake Primary Escrow",
    network: "amoy",
    networkName: "Polygon Amoy",
    timestamp: new Date().toISOString(),
    committedBy: "Certified NGO Field Coordinator #RC-9021"
  };

  const newEvent: AuditEvent = {
    id: `live-root-evt-${Date.now()}`,
    network: "amoy",
    networkName: "Polygon Amoy",
    chainId: 80002,
    blockNumber: 8421915,
    eventType: "verification",
    eventName: "MerkleRootCommitted",
    txHash: rootData.txHash,
    fromAddress: "0x90214c0988771234567890abcdef1234567890ab",
    toAddress: NETWORKS.amoy.contracts.beneficiaryRegistry,
    amountUSD: 0,
    amountCrypto: "0.00 POL",
    timestamp: new Date().toISOString(),
    timeAgo: "Just now",
    ipfsCid: rootData.ipfsCid,
    gasUsed: 68400,
    gasPriceGwei: 28.0,
    isLiveEvent: true,
  };

  if (typeof window !== "undefined") {
    const existingRoots = getStoredCommittedRoots();
    localStorage.setItem(STORAGE_ROOTS_KEY, JSON.stringify([newRoot, ...existingRoots]));

    const existingEvents = getStoredAuditEvents();
    localStorage.setItem(STORAGE_EVENTS_KEY, JSON.stringify([newEvent, ...existingEvents]));

    window.dispatchEvent(new CustomEvent(SYNC_EVENT_NAME, {
      detail: { type: "ROOT_COMMITTED", root: newRoot, event: newEvent }
    }));
  }

  return newRoot;
}

export function getStoredVoucherBatches(): VoucherBatchRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_VOUCHERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveVoucherBatch(batchData: {
  crisisId: string;
  count: number;
  root: string;
  allocation: string;
}): VoucherBatchRecord {
  const newBatch: VoucherBatchRecord = {
    id: `batch-${Date.now()}`,
    crisisId: batchData.crisisId,
    count: batchData.count,
    root: batchData.root,
    allocation: batchData.allocation,
    timestamp: new Date().toISOString()
  };

  if (typeof window !== "undefined") {
    const existing = getStoredVoucherBatches();
    const updated = [newBatch, ...existing];
    localStorage.setItem(STORAGE_VOUCHERS_KEY, JSON.stringify(updated));

    window.dispatchEvent(new CustomEvent(SYNC_EVENT_NAME, {
      detail: { type: "VOUCHER_BATCH_CREATED", batch: newBatch }
    }));
  }

  return newBatch;
}

export function clearAllAuditCache() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_EVENTS_KEY);
    localStorage.removeItem(STORAGE_ROOTS_KEY);
    localStorage.removeItem(STORAGE_VOUCHERS_KEY);
    window.dispatchEvent(new CustomEvent(SYNC_EVENT_NAME, {
      detail: { type: "CACHE_CLEARED" }
    }));
  }
}
