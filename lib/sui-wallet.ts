import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client"
import { TransactionBlock } from "@mysten/sui.js/transactions"

// Initialize Sui client based on environment
const NETWORK = process.env.NEXT_PUBLIC_SUI_NETWORK || "testnet"
const client = new SuiClient({ url: getFullnodeUrl(NETWORK) })

// Package and module information
const PACKAGE_ID = process.env.NEXT_PUBLIC_SUISTREAM_PACKAGE_ID
const MODULE_NAME = "suistream"
const TREASURY_CAP = process.env.NEXT_PUBLIC_SUISTREAM_TREASURY_CAP

// Error handling
const handleError = (error: any, message: string) => {
  console.error(`${message}:`, error)
  throw new Error(`${message}: ${error.message || "Unknown error"}`)
}

// Connect to wallet
export async function connectWallet() {
  try {
    // Check if window.suiWallet exists (browser extension)
    if (typeof window !== "undefined" && window.suiWallet) {
      const response = await window.suiWallet.requestPermissions()
      return {
        connected: response.granted,
        address: response.granted ? await window.suiWallet.getAddress() : null,
      }
    } else {
      throw new Error("Sui wallet extension not found")
    }
  } catch (error) {
    handleError(error, "Failed to connect wallet")
    return { connected: false, address: null }
  }
}

// Get wallet state
export async function getWalletState() {
  try {
    if (typeof window !== "undefined" && window.suiWallet) {
      const isConnected = await window.suiWallet.isConnected()
      const address = isConnected ? await window.suiWallet.getAddress() : null

      let balance = "0"
      if (address) {
        const balanceResponse = await client.getBalance({
          owner: address,
          coinType: "0x2::sui::SUI",
        })
        balance = balanceResponse.totalBalance
      }

      return {
        connected: isConnected,
        address,
        balance,
        ownedContent: await getOwnedContent(address),
        subscriptions: await getSubscriptions(address),
      }
    } else {
      return {
        connected: false,
        address: null,
        balance: "0",
        ownedContent: [],
        subscriptions: [],
      }
    }
  } catch (error) {
    handleError(error, "Failed to get wallet state")
    return {
      connected: false,
      address: null,
      balance: "0",
      ownedContent: [],
      subscriptions: [],
    }
  }
}

// Get owned content
async function getOwnedContent(address: string | null) {
  if (!address || !PACKAGE_ID) return []

  try {
    // Query for ContentNFT objects owned by the address
    const objects = await client.getOwnedObjects({
      owner: address,
      filter: {
        StructType: `${PACKAGE_ID}::${MODULE_NAME}::ContentNFT`,
      },
      options: {
        showContent: true,
      },
    })

    // Extract content IDs from the objects
    return objects.data
      .filter((obj) => obj.data && obj.data.content)
      .map((obj) => {
        const content = obj.data!.content as any
        return content.fields.content_id
      })
  } catch (error) {
    console.error("Failed to get owned content:", error)
    return []
  }
}

// Get active subscriptions
async function getSubscriptions(address: string | null) {
  if (!address || !PACKAGE_ID) return []

  try {
    // Query for Subscription objects owned by the address
    const objects = await client.getOwnedObjects({
      owner: address,
      filter: {
        StructType: `${PACKAGE_ID}::${MODULE_NAME}::Subscription`,
      },
      options: {
        showContent: true,
      },
    })

    // Extract subscription details from the objects
    return objects.data
      .filter((obj) => obj.data && obj.data.content)
      .map((obj) => {
        const content = obj.data!.content as any
        const fields = content.fields
        return {
          id: obj.data!.objectId,
          tier: fields.tier,
          startTime: Number(fields.start_time),
          endTime: Number(fields.end_time),
          active: Number(fields.end_time) > Math.floor(Date.now() / 1000),
        }
      })
  } catch (error) {
    console.error("Failed to get subscriptions:", error)
    return []
  }
}

// Purchase content
export async function purchaseContent(contentId: string, price: string) {
  if (!window.suiWallet || !PACKAGE_ID) {
    throw new Error("Wallet not connected or package ID not configured")
  }

  try {
    const tx = new TransactionBlock()

    // Split the coin for payment
    const [coin] = tx.splitCoins(tx.gas, [tx.pure(price)])

    // Call the purchase_content function
    tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::purchase_content`,
      arguments: [tx.pure(contentId), coin],
    })

    // Execute the transaction
    const result = await window.suiWallet.signAndExecuteTransactionBlock({
      transactionBlock: tx,
    })

    return result.effects?.status.status === "success"
  } catch (error) {
    handleError(error, "Failed to purchase content")
    return false
  }
}

// Purchase subscription
export async function purchaseSubscription(tier: number, durationMonths: number) {
  if (!window.suiWallet || !PACKAGE_ID) {
    throw new Error("Wallet not connected or package ID not configured")
  }

  try {
    // Calculate price based on tier and duration
    const tierPrices = [0, 1000000000, 2500000000, 5000000000] // in MIST (1 SUI = 10^9 MIST)
    const price = tierPrices[tier] * durationMonths

    const tx = new TransactionBlock()

    // Split the coin for payment
    const [coin] = tx.splitCoins(tx.gas, [tx.pure(price.toString())])

    // Call the purchase_subscription function
    tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::purchase_subscription`,
      arguments: [tx.pure(tier), tx.pure(durationMonths), coin],
    })

    // Execute the transaction
    const result = await window.suiWallet.signAndExecuteTransactionBlock({
      transactionBlock: tx,
    })

    return result.effects?.status.status === "success"
  } catch (error) {
    handleError(error, "Failed to purchase subscription")
    return false
  }
}

// Get transaction history
export async function getTransactionHistory(address: string | null) {
  if (!address) return []

  try {
    const transactions = await client.queryTransactionBlocks({
      filter: {
        FromAddress: address,
      },
      options: {
        showInput: true,
        showEffects: true,
        showEvents: true,
      },
    })

    return transactions.data.map((tx) => {
      // Process transaction data to extract relevant information
      const timestamp = tx.timestampMs ? new Date(Number(tx.timestampMs)).toISOString() : ""
      const status = tx.effects?.status.status || ""
      const gasFee = tx.effects?.gasUsed.computationCost || "0"

      // Extract events related to SuiStream
      const events = tx.events?.filter((event) => event.type.includes(MODULE_NAME)) || []

      // Determine transaction type
      let type = "Unknown"
      let details = {}

      for (const event of events) {
        if (event.type.includes("ContentPurchased")) {
          type = "Content Purchase"
          details = {
            contentId: event.parsedJson?.content_id || "",
            price: event.parsedJson?.price || "0",
          }
          break
        } else if (event.type.includes("SubscriptionPurchased")) {
          type = "Subscription Purchase"
          details = {
            tier: event.parsedJson?.tier || 0,
            duration: event.parsedJson?.duration_months || 0,
            price: event.parsedJson?.price || "0",
          }
          break
        }
      }

      return {
        id: tx.digest,
        type,
        timestamp,
        status,
        gasFee,
        details,
      }
    })
  } catch (error) {
    console.error("Failed to get transaction history:", error)
    return []
  }
}

// Check if content is owned
export function isContentOwned(contentId: string, ownedContent: string[]) {
  return ownedContent.includes(contentId)
}

// Check if user has active subscription
export function hasActiveSubscription(subscriptions: any[]) {
  return subscriptions.some((sub) => sub.active)
}

// Get subscription tier
export function getSubscriptionTier(subscriptions: any[]) {
  const activeSubscriptions = subscriptions.filter((sub) => sub.active)
  if (activeSubscriptions.length === 0) return 0

  // Return the highest tier if multiple subscriptions
  return Math.max(...activeSubscriptions.map((sub) => sub.tier))
}

// Format SUI amount for display (convert from MIST to SUI)
export function formatSuiAmount(amount: string) {
  const amountInSui = Number(amount) / 1000000000
  return amountInSui.toFixed(amountInSui < 1 ? 4 : 2)
}

// Define window.suiWallet for TypeScript
declare global {
  interface Window {
    suiWallet: {
      requestPermissions: () => Promise<{ granted: boolean }>
      isConnected: () => Promise<boolean>
      getAddress: () => Promise<string>
      signAndExecuteTransactionBlock: (params: any) => Promise<any>
    }
  }
}
