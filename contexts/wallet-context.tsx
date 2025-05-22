"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import {
  connectWallet,
  getWalletState,
  purchaseContent,
  purchaseSubscription,
  isContentOwned,
  hasActiveSubscription,
  getSubscriptionTier,
  formatSuiAmount,
  getTransactionHistory,
} from "@/lib/sui-wallet"
import { useToast } from "@/hooks/use-toast"

// Define wallet state type
interface WalletState {
  connected: boolean
  address: string | null
  balance: string
  ownedContent: string[]
  subscriptions: any[]
  isLoading: boolean
}

// Define wallet context type
interface WalletContextType {
  walletState: WalletState
  connect: () => Promise<void>
  disconnect: () => void
  refreshWallet: () => Promise<void>
  purchaseContent: (contentId: string, price: string) => Promise<boolean>
  purchaseSubscription: (tier: number, durationMonths: number) => Promise<boolean>
  isContentOwned: (contentId: string) => boolean
  hasActiveSubscription: () => boolean
  getSubscriptionTier: () => number
  formatSuiAmount: (amount: string) => string
  getTransactionHistory: () => Promise<any[]>
}

// Create context
const WalletContext = createContext<WalletContextType | undefined>(undefined)

// Initial wallet state
const initialWalletState: WalletState = {
  connected: false,
  address: null,
  balance: "0",
  ownedContent: [],
  subscriptions: [],
  isLoading: true,
}

// Wallet provider component
export function WalletProvider({ children }: { children: ReactNode }) {
  const [walletState, setWalletState] = useState<WalletState>(initialWalletState)
  const { toast } = useToast()

  // Initialize wallet state from localStorage and connect if previously connected
  useEffect(() => {
    const initWallet = async () => {
      try {
        // Check if wallet was previously connected
        const wasConnected = localStorage.getItem("walletConnected") === "true"

        if (wasConnected) {
          // Try to reconnect
          await handleConnect()
        } else {
          // Just set loading to false
          setWalletState((prev) => ({ ...prev, isLoading: false }))
        }
      } catch (error) {
        console.error("Failed to initialize wallet:", error)
        setWalletState((prev) => ({ ...prev, isLoading: false }))
      }
    }

    initWallet()

    // Listen for wallet events
    const handleAccountChange = () => {
      // Refresh wallet state when account changes
      refreshWallet()
    }

    if (typeof window !== "undefined") {
      window.addEventListener("sui_accountChanged", handleAccountChange)
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("sui_accountChanged", handleAccountChange)
      }
    }
  }, [])

  // Connect wallet
  const handleConnect = async () => {
    setWalletState((prev) => ({ ...prev, isLoading: true }))

    try {
      // Connect to wallet
      const { connected, address } = await connectWallet()

      if (connected && address) {
        // Get full wallet state
        const state = await getWalletState()

        // Update state
        setWalletState({
          connected: true,
          address: state.address,
          balance: state.balance,
          ownedContent: state.ownedContent,
          subscriptions: state.subscriptions,
          isLoading: false,
        })

        // Save connection state
        localStorage.setItem("walletConnected", "true")

        toast({
          title: "Wallet Connected",
          description: `Connected to ${address.slice(0, 6)}...${address.slice(-4)}`,
        })
      } else {
        setWalletState((prev) => ({ ...prev, isLoading: false }))

        toast({
          title: "Connection Failed",
          description: "Failed to connect wallet",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error connecting wallet:", error)

      setWalletState((prev) => ({ ...prev, isLoading: false }))

      toast({
        title: "Connection Error",
        description: "Error connecting to wallet",
        variant: "destructive",
      })
    }
  }

  // Disconnect wallet
  const handleDisconnect = () => {
    setWalletState({
      ...initialWalletState,
      isLoading: false,
    })

    // Clear connection state
    localStorage.removeItem("walletConnected")

    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    })
  }

  // Refresh wallet state
  const refreshWallet = async () => {
    if (!walletState.connected) return

    try {
      const state = await getWalletState()

      setWalletState({
        connected: state.connected,
        address: state.address,
        balance: state.balance,
        ownedContent: state.ownedContent,
        subscriptions: state.subscriptions,
        isLoading: false,
      })
    } catch (error) {
      console.error("Error refreshing wallet:", error)
    }
  }

  // Handle content purchase
  const handlePurchaseContent = async (contentId: string, price: string) => {
    if (!walletState.connected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to make a purchase",
        variant: "destructive",
      })
      return false
    }

    try {
      const success = await purchaseContent(contentId, price)

      if (success) {
        // Refresh wallet state
        await refreshWallet()

        toast({
          title: "Purchase Successful",
          description: "Content purchased successfully",
        })
      } else {
        toast({
          title: "Purchase Failed",
          description: "Failed to purchase content",
          variant: "destructive",
        })
      }

      return success
    } catch (error) {
      console.error("Error purchasing content:", error)

      toast({
        title: "Purchase Error",
        description: "Error processing purchase",
        variant: "destructive",
      })

      return false
    }
  }

  // Handle subscription purchase
  const handlePurchaseSubscription = async (tier: number, durationMonths: number) => {
    if (!walletState.connected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to purchase a subscription",
        variant: "destructive",
      })
      return false
    }

    try {
      const success = await purchaseSubscription(tier, durationMonths)

      if (success) {
        // Refresh wallet state
        await refreshWallet()

        toast({
          title: "Subscription Purchased",
          description: `Tier ${tier} subscription purchased for ${durationMonths} month${durationMonths > 1 ? "s" : ""}`,
        })
      } else {
        toast({
          title: "Subscription Failed",
          description: "Failed to purchase subscription",
          variant: "destructive",
        })
      }

      return success
    } catch (error) {
      console.error("Error purchasing subscription:", error)

      toast({
        title: "Subscription Error",
        description: "Error processing subscription",
        variant: "destructive",
      })

      return false
    }
  }

  // Check if content is owned
  const checkContentOwned = (contentId: string) => {
    return isContentOwned(contentId, walletState.ownedContent)
  }

  // Check if user has active subscription
  const checkActiveSubscription = () => {
    return hasActiveSubscription(walletState.subscriptions)
  }

  // Get subscription tier
  const getActiveTier = () => {
    return getSubscriptionTier(walletState.subscriptions)
  }

  // Get transaction history
  const getWalletTransactionHistory = async () => {
    if (!walletState.connected || !walletState.address) return []

    try {
      return await getTransactionHistory(walletState.address)
    } catch (error) {
      console.error("Error getting transaction history:", error)
      return []
    }
  }

  // Context value
  const value = {
    walletState,
    connect: handleConnect,
    disconnect: handleDisconnect,
    refreshWallet,
    purchaseContent: handlePurchaseContent,
    purchaseSubscription: handlePurchaseSubscription,
    isContentOwned: checkContentOwned,
    hasActiveSubscription: checkActiveSubscription,
    getSubscriptionTier: getActiveTier,
    formatSuiAmount,
    getTransactionHistory: getWalletTransactionHistory,
  }

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

// Hook to use wallet context
export function useWallet() {
  const context = useContext(WalletContext)

  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }

  return context
}
