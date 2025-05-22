"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, WalletIcon } from "lucide-react"
import { connectWallet, getWalletState } from "@/lib/sui-wallet"
import { setCookie } from "cookies-next"
import Image from "next/image"

export default function LoginPage() {
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnUrl = searchParams?.get("returnUrl") || "/"

  // Check if already connected
  useEffect(() => {
    const walletState = getWalletState()
    if (walletState.connected) {
      router.push(returnUrl)
    }
  }, [router, returnUrl])

  const handleConnect = async (walletType: string) => {
    setIsConnecting(true)
    setError(null)

    try {
      const success = await connectWallet(walletType)
      if (success) {
        // Set the cookie to indicate the wallet is connected
        setCookie("wallet_connected", "true", {
          maxAge: 30 * 24 * 60 * 60, // 30 days
          path: "/",
        })

        // Redirect to the return URL
        router.push(returnUrl)
      } else {
        setError("Failed to connect wallet. Please try again.")
      }
    } catch (err) {
      console.error("Error connecting wallet:", err)
      setError("Failed to connect wallet. Please try again.")
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-background/80 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Image src="/placeholder.svg?height=60&width=180" alt="SuiStream Logo" width={180} height={60} />
          </div>
          <CardTitle className="text-2xl">Welcome to SuiStream</CardTitle>
          <CardDescription>
            Connect your Sui wallet to access exclusive content, own media NFTs, and participate in the decentralized
            streaming ecosystem.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <div className="p-3 bg-red-100 border border-red-200 text-red-800 rounded-md text-sm">{error}</div>}

          <Button
            className="w-full flex items-center justify-between"
            onClick={() => handleConnect("Sui Wallet")}
            disabled={isConnecting}
          >
            <span className="flex items-center">
              <Wallet className="h-4 w-4 mr-2" />
              Sui Wallet
            </span>
            {isConnecting ? (
              <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <span className="text-xs bg-primary/20 px-2 py-1 rounded-full">Recommended</span>
            )}
          </Button>

          <Button
            variant="outline"
            className="w-full flex items-center justify-between"
            onClick={() => handleConnect("Ethos Wallet")}
            disabled={isConnecting}
          >
            <span className="flex items-center">
              <WalletIcon className="h-4 w-4 mr-2" />
              Ethos Wallet
            </span>
            {isConnecting && (
              <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
            )}
          </Button>

          <Button
            variant="outline"
            className="w-full flex items-center justify-between"
            onClick={() => handleConnect("Suiet Wallet")}
            disabled={isConnecting}
          >
            <span className="flex items-center">
              <WalletIcon className="h-4 w-4 mr-2" />
              Suiet Wallet
            </span>
            {isConnecting && (
              <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
            )}
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <p className="text-center text-sm text-muted-foreground">
            Don't have a Sui wallet?{" "}
            <a
              href="https://docs.sui.io/build/wallet"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-primary"
            >
              Get one here
            </a>
          </p>
          <p className="text-center text-xs text-muted-foreground">
            By connecting your wallet, you agree to our{" "}
            <a href="#" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </a>
            .
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
