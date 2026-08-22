"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { ethers } from "ethers";
import { NETWORKS } from "@/lib/contracts";

interface WalletContextType {
  address: string | null;
  shortAddress: string;
  isConnected: boolean;
  isConnecting: boolean;
  chainId: number | null;
  chainName: string;
  balance: string;
  balanceRaw: bigint | null;
  error: string | null;
  hasMetaMask: boolean;
  connectWallet: () => Promise<string | null>;
  disconnectWallet: () => void;
  switchNetwork: (target: "sepolia" | "amoy") => Promise<boolean>;
  refreshAccount: () => Promise<void>;
  sendDonation: (
    toAddress: string,
    amountEth: string
  ) => Promise<{ success: boolean; hash?: string; error?: string }>;
  signClaimMessage: (
    typedData: any
  ) => Promise<{ success: boolean; signature?: string; error?: string }>;
}

const WalletContext = createContext<WalletContextType | null>(null);

const CHAIN_PARAMS: Record<"sepolia" | "amoy", any> = {
  sepolia: {
    chainId: "0xaa36a7", // 11155111 in hex
    chainName: "Ethereum Sepolia Testnet",
    nativeCurrency: {
      name: "Sepolia Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://rpc.sepolia.org", "https://ethereum-sepolia-rpc.publicnode.com"],
    blockExplorerUrls: ["https://sepolia.etherscan.io"],
  },
  amoy: {
    chainId: "0x13882", // 80002 in hex
    chainName: "Polygon Amoy Testnet",
    nativeCurrency: {
      name: "Polygon Ecosystem Token",
      symbol: "POL",
      decimals: 18,
    },
    rpcUrls: ["https://rpc-amoy.polygon.technology", "https://polygon-amoy-bor-rpc.publicnode.com"],
    blockExplorerUrls: ["https://amoy.polygonscan.com"],
  },
};

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [chainId, setChainId] = useState<number | null>(null);
  const [balance, setBalance] = useState<string>("0.0000");
  const [balanceRaw, setBalanceRaw] = useState<bigint | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasMetaMask, setHasMetaMask] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      setHasMetaMask(true);
    }
  }, []);

  // Update balance directly from MetaMask's active provider
  const updateBalance = useCallback(async (account: string) => {
    if (typeof window === "undefined" || !(window as any).ethereum || !account) return;
    try {
      const eth = (window as any).ethereum;
      
      // Query eth_getBalance directly from MetaMask
      const hexBal = await eth.request({
        method: "eth_getBalance",
        params: [account, "latest"],
      });

      if (hexBal) {
        const balBigInt = BigInt(hexBal);
        setBalanceRaw(balBigInt);
        const formatted = ethers.formatEther(balBigInt);
        const num = parseFloat(formatted);
        setBalance(num.toFixed(4));
        return;
      }

      // Fallback via BrowserProvider
      const provider = new ethers.BrowserProvider(eth);
      const bal = await provider.getBalance(account);
      setBalanceRaw(bal);
      const formatted = ethers.formatEther(bal);
      setBalance(parseFloat(formatted).toFixed(4));
    } catch (err) {
      console.warn("Could not fetch balance from MetaMask:", err);
    }
  }, []);

  // Refresh active chain & account
  const refreshAccount = useCallback(async () => {
    if (typeof window === "undefined" || !(window as any).ethereum) return;
    try {
      const eth = (window as any).ethereum;
      
      // Get current chain directly
      const hexChainId = await eth.request({ method: "eth_chainId" });
      if (hexChainId) {
        setChainId(parseInt(hexChainId, 16));
      }

      // Get current accounts
      const accounts = await eth.request({ method: "eth_accounts" });

      if (accounts && accounts.length > 0) {
        const activeAddr = accounts[0];
        setAddress(activeAddr);
        await updateBalance(activeAddr);
      } else {
        setAddress(null);
        setBalance("0.0000");
        setBalanceRaw(null);
      }
    } catch (err) {
      console.warn("Failed to query MetaMask accounts:", err);
    }
  }, [updateBalance]);

  // Connect MetaMask Wallet
  const connectWallet = useCallback(async (): Promise<string | null> => {
    if (typeof window === "undefined" || !(window as any).ethereum) {
      setError("MetaMask is not installed. Please install MetaMask to continue.");
      return null;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const eth = (window as any).ethereum;
      const accounts = await eth.request({ method: "eth_requestAccounts" });
      
      if (accounts && accounts.length > 0) {
        const activeAddr = accounts[0];
        setAddress(activeAddr);

        const hexChainId = await eth.request({ method: "eth_chainId" });
        if (hexChainId) {
          setChainId(parseInt(hexChainId, 16));
        }

        await updateBalance(activeAddr);
        setIsConnecting(false);
        return activeAddr;
      }
      setIsConnecting(false);
      return null;
    } catch (err: any) {
      console.error("MetaMask connection failed:", err);
      setError(err?.message || "Failed to connect MetaMask.");
      setIsConnecting(false);
      return null;
    }
  }, [updateBalance]);

  // Disconnect
  const disconnectWallet = useCallback(() => {
    setAddress(null);
    setBalance("0.0000");
    setBalanceRaw(null);
    setChainId(null);
  }, []);

  // Switch network between Sepolia and Amoy
  const switchNetwork = useCallback(async (target: "sepolia" | "amoy"): Promise<boolean> => {
    if (typeof window === "undefined" || !(window as any).ethereum) return false;

    const params = CHAIN_PARAMS[target];
    try {
      await (window as any).ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: params.chainId }],
      });
      await refreshAccount();
      return true;
    } catch (switchError: any) {
      if (switchError.code === 4902 || switchError?.data?.originalError?.code === 4902) {
        try {
          await (window as any).ethereum.request({
            method: "wallet_addEthereumChain",
            params: [params],
          });
          await refreshAccount();
          return true;
        } catch (addError) {
          console.error("Failed to add network:", addError);
          return false;
        }
      }
      console.error("Failed to switch network:", switchError);
      return false;
    }
  }, [refreshAccount]);

  // Execute real on-chain donation via MetaMask
  const sendDonation = useCallback(async (
    toAddress: string,
    amountEth: string
  ): Promise<{ success: boolean; hash?: string; error?: string }> => {
    if (typeof window === "undefined" || !(window as any).ethereum || !address) {
      return { success: false, error: "Wallet not connected" };
    }

    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();

      const tx = await signer.sendTransaction({
        to: toAddress,
        value: ethers.parseEther(amountEth),
      });

      const receipt = await tx.wait(1);
      await updateBalance(address);

      return {
        success: true,
        hash: receipt?.hash || tx.hash,
      };
    } catch (err: any) {
      console.error("Donation transaction failed:", err);
      return {
        success: false,
        error: err?.message || "Transaction rejected by user",
      };
    }
  }, [address, updateBalance]);

  // Real EIP-712 Typed Data Signing via MetaMask
  const signClaimMessage = useCallback(async (
    typedData: any
  ): Promise<{ success: boolean; signature?: string; error?: string }> => {
    if (typeof window === "undefined" || !(window as any).ethereum || !address) {
      return { success: false, error: "Wallet not connected" };
    }

    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();

      const signature = await signer.signTypedData(
        typedData.domain,
        typedData.types,
        typedData.value
      );

      return {
        success: true,
        signature,
      };
    } catch (err: any) {
      console.error("EIP-712 signing failed:", err);
      return {
        success: false,
        error: err?.message || "Signature rejected by user",
      };
    }
  }, [address]);

  // Listen to MetaMask account and chain changes + Poll balance
  useEffect(() => {
    if (typeof window === "undefined" || !(window as any).ethereum) return;

    const eth = (window as any).ethereum;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length > 0) {
        setAddress(accounts[0]);
        updateBalance(accounts[0]);
      } else {
        setAddress(null);
        setBalance("0.0000");
        setBalanceRaw(null);
      }
    };

    const handleChainChanged = (newHexChainId: string) => {
      if (newHexChainId) {
        setChainId(parseInt(newHexChainId, 16));
      }
      if (address) {
        updateBalance(address);
      } else {
        refreshAccount();
      }
    };

    eth.on("accountsChanged", handleAccountsChanged);
    eth.on("chainChanged", handleChainChanged);

    // Initial check on mount
    refreshAccount();

    // Auto-poll balance every 4 seconds to ensure exact sync with MetaMask
    const interval = setInterval(() => {
      if (address) {
        updateBalance(address);
      }
    }, 4000);

    return () => {
      clearInterval(interval);
      if (eth.removeListener) {
        eth.removeListener("accountsChanged", handleAccountsChanged);
        eth.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, [address, refreshAccount, updateBalance]);

  const isConnected = !!address;
  const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";

  const chainName = useMemo(() => {
    if (chainId === 11155111) return "Sepolia";
    if (chainId === 80002) return "Polygon Amoy";
    if (chainId === 1) return "Ethereum Mainnet";
    if (chainId === 137) return "Polygon";
    if (chainId === 31337) return "Local Hardhat";
    return chainId ? `Chain #${chainId}` : "Not Connected";
  }, [chainId]);

  return (
    <WalletContext.Provider
      value={{
        address,
        shortAddress,
        isConnected,
        isConnecting,
        chainId,
        chainName,
        balance,
        balanceRaw,
        error,
        hasMetaMask,
        connectWallet,
        disconnectWallet,
        switchNetwork,
        refreshAccount,
        sendDonation,
        signClaimMessage,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
