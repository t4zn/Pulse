"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from "react";
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

const DISCONNECT_STORAGE_KEY = "pulse_wallet_disconnected_manually";

const CHAIN_PARAMS: Record<"sepolia" | "amoy", any> = {
  sepolia: {
    chainId: "0xaa36a7", // 11155111 in hex
    chainName: "Ethereum Sepolia Testnet",
    nativeCurrency: {
      name: "Sepolia Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://ethereum-sepolia-rpc.publicnode.com", "https://rpc.sepolia.org"],
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

function getEthereumProvider(): any {
  if (typeof window === "undefined") return null;
  const anyWindow = window as any;
  if (anyWindow.ethereum) {
    if (anyWindow.ethereum.providers && anyWindow.ethereum.providers.length > 0) {
      const metaMaskProvider = anyWindow.ethereum.providers.find((p: any) => p.isMetaMask);
      if (metaMaskProvider) return metaMaskProvider;
    }
    return anyWindow.ethereum;
  }
  return null;
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [chainId, setChainId] = useState<number | null>(null);
  const [balance, setBalance] = useState<string>("0.0000");
  const [balanceRaw, setBalanceRaw] = useState<bigint | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasMetaMask, setHasMetaMask] = useState<boolean>(false);

  const addressRef = useRef<string | null>(null);
  addressRef.current = address;

  useEffect(() => {
    const eth = getEthereumProvider();
    if (eth) {
      setHasMetaMask(true);
    }
  }, []);

  // Update balance directly from MetaMask + public testnet RPC fallback
  const updateBalance = useCallback(async (account: string) => {
    if (typeof window === "undefined" || !account) return;
    try {
      const eth = getEthereumProvider();
      let currentChainId = 11155111;

      if (eth) {
        try {
          const hexChain = await eth.request({ method: "eth_chainId" });
          if (hexChain) {
            currentChainId = parseInt(hexChain, 16);
            setChainId(currentChainId);
          }
        } catch (e) {}
      }

      let balBigInt: bigint | null = null;

      // 1. Try querying balance directly from MetaMask provider
      if (eth) {
        try {
          const hexBal = await eth.request({
            method: "eth_getBalance",
            params: [account, "latest"],
          });
          if (hexBal !== undefined && hexBal !== null) {
            balBigInt = BigInt(hexBal);
          }
        } catch (ethErr) {
          console.warn("MetaMask eth_getBalance call error:", ethErr);
        }
      }

      // 2. If MetaMask returned 0 or failed, verify with direct public JSON-RPC node
      if (balBigInt === null || balBigInt === BigInt(0)) {
        try {
          const rpcUrl = currentChainId === 80002 
            ? "https://rpc-amoy.polygon.technology" 
            : "https://ethereum-sepolia-rpc.publicnode.com";
          const directProvider = new ethers.JsonRpcProvider(rpcUrl);
          const rpcBal = await directProvider.getBalance(account);
          if (rpcBal > BigInt(0) || balBigInt === null) {
            balBigInt = rpcBal;
          }
        } catch (rpcErr) {}
      }

      if (balBigInt !== null) {
        setBalanceRaw(balBigInt);
        const formatted = ethers.formatEther(balBigInt);
        const num = parseFloat(formatted);
        setBalance(num.toFixed(4));
      }
    } catch (err) {
      console.warn("Could not fetch wallet balance:", err);
    }
  }, []);

  // Refresh active chain & account
  const refreshAccount = useCallback(async () => {
    const eth = getEthereumProvider();
    if (!eth) return;
    try {
      const hexChainId = await eth.request({ method: "eth_chainId" });
      if (hexChainId) {
        setChainId(parseInt(hexChainId, 16));
      }

      const isManuallyDisconnected = typeof window !== "undefined" && localStorage.getItem(DISCONNECT_STORAGE_KEY) === "true";
      if (isManuallyDisconnected) {
        setAddress(null);
        setBalance("0.0000");
        setBalanceRaw(null);
        return;
      }

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
    const eth = getEthereumProvider();
    if (!eth) {
      if (typeof window !== "undefined") {
        window.open("https://metamask.io/download/", "_blank");
      }
      return null;
    }

    setIsConnecting(true);
    setError(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(DISCONNECT_STORAGE_KEY);
    }

    try {
      let accounts: string[] = [];
      try {
        accounts = await eth.request({ method: "eth_requestAccounts" });
      } catch (reqErr: any) {
        if (reqErr.code === -32002) {
          // Request already pending, fetch available accounts
          accounts = await eth.request({ method: "eth_accounts" });
        } else {
          throw reqErr;
        }
      }

      if (!accounts || accounts.length === 0) {
        accounts = await eth.request({ method: "eth_accounts" });
      }
      
      if (accounts && accounts.length > 0) {
        const activeAddr = accounts[0];
        setAddress(activeAddr);

        try {
          const hexChainId = await eth.request({ method: "eth_chainId" });
          if (hexChainId) {
            setChainId(parseInt(hexChainId, 16));
          }
        } catch (e) {}

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

  // Disconnect Wallet
  const disconnectWallet = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(DISCONNECT_STORAGE_KEY, "true");
    }
    setAddress(null);
    setBalance("0.0000");
    setBalanceRaw(null);
  }, []);

  // Switch network between Sepolia and Amoy
  const switchNetwork = useCallback(async (target: "sepolia" | "amoy"): Promise<boolean> => {
    const eth = getEthereumProvider();
    if (!eth) return false;

    const params = CHAIN_PARAMS[target];
    try {
      await eth.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: params.chainId }],
      });
      await refreshAccount();
      return true;
    } catch (switchError: any) {
      if (switchError.code === 4902 || switchError?.data?.originalError?.code === 4902) {
        try {
          await eth.request({
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
    const eth = getEthereumProvider();
    if (!eth || !addressRef.current) {
      return { success: false, error: "Wallet not connected" };
    }

    try {
      const provider = new ethers.BrowserProvider(eth);
      const signer = await provider.getSigner();

      const tx = await signer.sendTransaction({
        to: toAddress,
        value: ethers.parseEther(amountEth),
      });

      const receipt = await tx.wait(1);
      if (addressRef.current) {
        await updateBalance(addressRef.current);
      }

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
  }, [updateBalance]);

  // Real EIP-712 Typed Data Signing via MetaMask
  const signClaimMessage = useCallback(async (
    typedData: any
  ): Promise<{ success: boolean; signature?: string; error?: string }> => {
    const eth = getEthereumProvider();
    if (!eth || !addressRef.current) {
      return { success: false, error: "Wallet not connected" };
    }

    try {
      const provider = new ethers.BrowserProvider(eth);
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
  }, []);

  // Listen to MetaMask events once on mount & set up balance polling
  useEffect(() => {
    const eth = getEthereumProvider();
    if (!eth) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length > 0) {
        if (typeof window !== "undefined") {
          localStorage.removeItem(DISCONNECT_STORAGE_KEY);
        }
        setAddress(accounts[0]);
        updateBalance(accounts[0]);
      } else {
        if (typeof window !== "undefined") {
          localStorage.setItem(DISCONNECT_STORAGE_KEY, "true");
        }
        setAddress(null);
        setBalance("0.0000");
        setBalanceRaw(null);
      }
    };

    const handleChainChanged = (newHexChainId: string) => {
      if (newHexChainId) {
        setChainId(parseInt(newHexChainId, 16));
      }
      if (addressRef.current) {
        updateBalance(addressRef.current);
      }
    };

    eth.on("accountsChanged", handleAccountsChanged);
    eth.on("chainChanged", handleChainChanged);

    // Initial check on mount
    refreshAccount();

    // Auto-poll balance every 3 seconds if connected
    const interval = setInterval(() => {
      if (addressRef.current) {
        updateBalance(addressRef.current);
      }
    }, 3000);

    return () => {
      clearInterval(interval);
      if (eth.removeListener) {
        eth.removeListener("accountsChanged", handleAccountsChanged);
        eth.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, [refreshAccount, updateBalance]);

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
