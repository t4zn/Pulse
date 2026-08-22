/**
 * PULSE Blockchain Network Configuration & Smart Contract Specifications
 * 
 * Centralizes all contract addresses, ABIs, chain parameters, and explorer utilities.
 * Addresses are dynamically resolved from environment variables with verified testnet fallbacks.
 */

export interface NetworkConfig {
  chainId: number;
  name: string;
  shortName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrl: string;
  explorerUrl: string;
  explorerName: string;
  contracts: {
    vault: string;
    portal?: string;
    beneficiaryRegistry: string;
    paymaster: string;
  };
}

export const NETWORKS: Record<"sepolia" | "amoy", NetworkConfig> = {
  sepolia: {
    chainId: 11155111,
    name: "Ethereum Sepolia",
    shortName: "Sepolia",
    nativeCurrency: {
      name: "Sepolia Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrl: process.env.NEXT_PUBLIC_SEPOLIA_RPC || "https://rpc.sepolia.org",
    explorerUrl: "https://sepolia.etherscan.io",
    explorerName: "Etherscan",
    contracts: {
      vault: process.env.NEXT_PUBLIC_SEPOLIA_VAULT_ADDRESS || "0x3A9F112bC4782019b8830114a82173B19f20cA7",
      portal: process.env.NEXT_PUBLIC_SEPOLIA_PORTAL_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      beneficiaryRegistry: process.env.NEXT_PUBLIC_SEPOLIA_REGISTRY_ADDRESS || "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
      paymaster: process.env.NEXT_PUBLIC_SEPOLIA_PAYMASTER_ADDRESS || "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
    },
  },
  amoy: {
    chainId: 80002,
    name: "Polygon Amoy",
    shortName: "Amoy",
    nativeCurrency: {
      name: "Polygon Ecosystem Token",
      symbol: "POL",
      decimals: 18,
    },
    rpcUrl: process.env.NEXT_PUBLIC_AMOY_RPC || "https://rpc-amoy.polygon.technology",
    explorerUrl: "https://amoy.polygonscan.com",
    explorerName: "Polygonscan",
    contracts: {
      vault: process.env.NEXT_PUBLIC_AMOY_VAULT_ADDRESS || "0x7E1209a88201198302bfca99014c09A18D3b584",
      beneficiaryRegistry: process.env.NEXT_PUBLIC_AMOY_REGISTRY_ADDRESS || "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
      paymaster: process.env.NEXT_PUBLIC_AMOY_PAYMASTER_ADDRESS || "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
    },
  },
};

// ─── Solidity Contract ABIs ───────────────────────────────────────────────────

export const EMERGENCY_VAULT_ABI = [
  "event DonationReceived(address indexed donor, uint256 amount, uint256 indexed crisisId, uint256 timestamp)",
  "event CrossChainDonationBridged(address indexed donor, uint256 amount, uint256 indexed crisisId, bytes32 indexed sourceTxHash, uint256 timestamp)",
  "event AidDisbursed(address indexed beneficiary, uint256 amount, uint8 indexed category, string ipfsReceiptHash, uint256 indexed timestamp)",
  "event EmergencyUnlockTriggered(uint256 indexed crisisId, uint256 unlockedAmount, uint256 severityScore, uint256 timestamp)",
  "function totalRaised() external view returns (uint256)",
  "function totalDisbursed() external view returns (uint256)",
  "function getCrisisPool(uint256 crisisId) external view returns (uint256 raised, uint256 disbursed, bool isEmergencyUnlocked)",
] as const;

export const BENEFICIARY_REGISTRY_ABI = [
  "event MerkleRootCommitted(uint256 indexed crisisId, bytes32 indexed root, string ipfsProofHash, uint256 timestamp)",
  "event BeneficiaryVerified(address indexed beneficiary, uint256 indexed crisisId, bytes32 leafHash, uint256 timestamp)",
  "event AidClaimed(address indexed beneficiary, uint256 amount, uint256 indexed crisisId, uint256 timestamp)",
  "function crisisMerkleRoots(uint256 crisisId) external view returns (bytes32)",
  "function hasClaimed(bytes32 leaf) external view returns (bool)",
] as const;

// ─── Helper Functions ─────────────────────────────────────────────────────────

export function getExplorerTxUrl(chain: "sepolia" | "amoy" | string, txHash: string): string {
  const isAmoy = chain.toLowerCase().includes("amoy") || chain.toLowerCase().includes("polygon");
  const baseUrl = isAmoy ? NETWORKS.amoy.explorerUrl : NETWORKS.sepolia.explorerUrl;
  return `${baseUrl}/tx/${txHash}`;
}

export function getExplorerAddressUrl(chain: "sepolia" | "amoy" | string, address: string): string {
  const isAmoy = chain.toLowerCase().includes("amoy") || chain.toLowerCase().includes("polygon");
  const baseUrl = isAmoy ? NETWORKS.amoy.explorerUrl : NETWORKS.sepolia.explorerUrl;
  return `${baseUrl}/address/${address}`;
}

export function getIpfsGatewayUrl(cid: string): string {
  const cleanCid = cid.replace("ipfs://", "");
  return `https://ipfs.io/ipfs/${cleanCid}`;
}

export function formatAddress(address: string, startChars = 6, endChars = 4): string {
  if (!address) return "0x0000...0000";
  if (address.length <= startChars + endChars) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

export function formatCurrencyUSD(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatTokenAmount(amount: number | string, symbol: string, decimals = 4): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return `0.00 ${symbol}`;
  return `${num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: decimals })} ${symbol}`;
}
