/**
 * Merkle Tree implementation for Zero-Knowledge Beneficiary Verification.
 *
 * How it works:
 * 1. NGO field workers compile a list of verified victim wallet addresses.
 * 2. Each address is hashed: leaf = keccak256(abi.encodePacked(address)).
 * 3. Leaves are sorted and paired to build the tree bottom-up.
 * 4. Only the 32-byte Merkle Root is committed on-chain.
 * 5. At claim time, the victim provides their address + proof[].
 *    The contract verifies: MerkleProof.verify(proof, root, keccak256(sender)).
 *
 * No individual identity or address is ever stored on-chain.
 */

import { keccak256, solidityPacked, getBytes, hexlify } from "ethers";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface MerkleProofResult {
  leaf: string;
  proof: string[];
  root: string;
  index: number;
  valid: boolean;
}

export interface MerkleTreeData {
  root: string;
  leaves: string[];
  layers: string[][];
  addressCount: number;
}

// ─── Core Functions ──────────────────────────────────────────────────────────

/**
 * Hash an Ethereum address into a Merkle leaf using keccak256(abi.encodePacked(address)).
 * This mirrors the Solidity contract: `keccak256(abi.encodePacked(msg.sender))`.
 */
export function hashAddress(address: string): string {
  const packed = solidityPacked(["address"], [address.toLowerCase()]);
  return keccak256(packed);
}

/**
 * Sort-pair two hashes for deterministic tree construction.
 * OpenZeppelin MerkleProof uses sorted pairs so that proof verification
 * is order-independent: hash(min, max).
 */
function sortPairHash(a: string, b: string): string {
  const aBytes = getBytes(a);
  const bBytes = getBytes(b);

  // Compare byte-by-byte to determine sort order
  for (let i = 0; i < 32; i++) {
    if (aBytes[i] < bBytes[i]) {
      return keccak256(solidityPacked(["bytes32", "bytes32"], [a, b]));
    }
    if (aBytes[i] > bBytes[i]) {
      return keccak256(solidityPacked(["bytes32", "bytes32"], [b, a]));
    }
  }
  // Equal hashes — should not happen with unique addresses
  return a;
}

/**
 * Build a complete Merkle tree from a list of Ethereum addresses.
 *
 * @param addresses - Array of Ethereum addresses (0x-prefixed hex strings)
 * @returns MerkleTreeData with root, sorted leaves, and all layers
 */
export function buildMerkleTree(addresses: string[]): MerkleTreeData {
  if (addresses.length === 0) {
    return { root: "0x" + "0".repeat(64), leaves: [], layers: [[]], addressCount: 0 };
  }

  // Step 1: Hash each address into a leaf
  const leaves = addresses.map((addr) => hashAddress(addr));

  // Step 2: Sort leaves for deterministic tree (matches OpenZeppelin)
  const sortedLeaves = [...leaves].sort((a, b) => {
    const aBytes = getBytes(a);
    const bBytes = getBytes(b);
    for (let i = 0; i < 32; i++) {
      if (aBytes[i] < bBytes[i]) return -1;
      if (aBytes[i] > bBytes[i]) return 1;
    }
    return 0;
  });

  // Step 3: Build tree layers bottom-up
  const layers: string[][] = [sortedLeaves];
  let currentLayer = sortedLeaves;

  while (currentLayer.length > 1) {
    const nextLayer: string[] = [];
    for (let i = 0; i < currentLayer.length; i += 2) {
      if (i + 1 < currentLayer.length) {
        nextLayer.push(sortPairHash(currentLayer[i], currentLayer[i + 1]));
      } else {
        // Odd node — promote it directly
        nextLayer.push(currentLayer[i]);
      }
    }
    layers.push(nextLayer);
    currentLayer = nextLayer;
  }

  return {
    root: currentLayer[0],
    leaves: sortedLeaves,
    layers,
    addressCount: addresses.length,
  };
}

/**
 * Generate a Merkle proof for a specific address against the tree.
 *
 * @param tree - MerkleTreeData from buildMerkleTree()
 * @param address - The address to generate a proof for
 * @returns MerkleProofResult with the proof path, leaf, root, and validity
 */
export function generateProof(tree: MerkleTreeData, address: string): MerkleProofResult {
  const leaf = hashAddress(address);
  const index = tree.leaves.indexOf(leaf);

  if (index === -1) {
    return { leaf, proof: [], root: tree.root, index: -1, valid: false };
  }

  const proof: string[] = [];
  let currentIndex = index;

  for (let layerIdx = 0; layerIdx < tree.layers.length - 1; layerIdx++) {
    const layer = tree.layers[layerIdx];
    const isRight = currentIndex % 2 === 1;
    const siblingIndex = isRight ? currentIndex - 1 : currentIndex + 1;

    if (siblingIndex < layer.length) {
      proof.push(layer[siblingIndex]);
    }

    currentIndex = Math.floor(currentIndex / 2);
  }

  return { leaf, proof, root: tree.root, index, valid: true };
}

/**
 * Verify a Merkle proof against a root.
 * Mirrors OpenZeppelin MerkleProof.verify() in Solidity.
 *
 * @param proof - Array of sibling hashes
 * @param root - The expected Merkle root
 * @param leaf - The leaf hash to verify
 * @returns true if the proof is valid
 */
export function verifyProof(proof: string[], root: string, leaf: string): boolean {
  let computedHash = leaf;

  for (const proofElement of proof) {
    computedHash = sortPairHash(computedHash, proofElement);
  }

  return computedHash === root;
}

/**
 * Parse a CSV string of Ethereum addresses.
 * Supports formats: one address per line, or comma-separated.
 * Filters out invalid addresses.
 */
export function parseAddressCSV(csvContent: string): string[] {
  const addresses: string[] = [];
  const lines = csvContent.split(/[\n,]+/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (/^0x[0-9a-fA-F]{40}$/.test(trimmed)) {
      addresses.push(trimmed);
    }
  }

  // Deduplicate
  return [...new Set(addresses.map((a) => a.toLowerCase()))];
}

/**
 * Generate a deterministic voucher code from an address and crisis ID.
 * This is for the offline QR voucher system.
 */
export function generateVoucherCode(address: string, crisisId: string): string {
  const hash = keccak256(solidityPacked(["address", "string"], [address.toLowerCase(), crisisId]));
  const short = hash.slice(2, 10).toUpperCase();
  const prefix = crisisId.split("-")[0].toUpperCase().slice(0, 6);
  return `${prefix}-ZK-${short}`;
}

/**
 * Simulate EIP-712 typed data structure for gasless claims.
 * In production, this would be signed by the victim's wallet.
 */
export function buildEIP712ClaimData(
  crisisId: number,
  amount: string,
  recipient: string,
  nonce: number,
  deadline: number
) {
  return {
    domain: {
      name: "PulseBeneficiaryRegistry",
      version: "1",
      chainId: 80002, // Polygon Amoy
      verifyingContract: "0x7E1209aC93FB991fBb1e8e4e1b2930a0C4C39EC5",
    },
    types: {
      ClaimAid: [
        { name: "crisisId", type: "uint256" },
        { name: "amount", type: "uint256" },
        { name: "recipient", type: "address" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ],
    },
    value: {
      crisisId,
      amount,
      recipient,
      nonce,
      deadline,
    },
  };
}
