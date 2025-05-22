"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useWallet } from "@/contexts/wallet-context"
import { Wallet, Copy, ExternalLink, LogOut } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface WalletConnectProps {
  open: boolean
  onClose: () => void
}

export default function WalletConnect({ open, onClose }: WalletConnectProps) {
  const [activeTab, setActiveTab] = useState("connect")
  const { walletState, connect, disconnect, formatSuiAmount } = useWallet()
  const { toast } = useToast()

  // Update active tab based on wallet connection status
  useEffect(() => {
    if (walletState.connected) {
      setActiveTab("account")
    } else {
      setActiveTab("connect")
    }
  }, [walletState.connected])

  // Copy address to clipboard
  const copyAddress = () => {
    if (walletState.address) {
      navigator.clipboard.writeText(walletState.address)
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      })
    }
  }

  // Format address for display
  const formatAddress = (address: string | null) => {
    if (!address) return ""
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  // Handle disconnect
  const handleDisconnect = () => {
    disconnect()
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Wallet</DialogTitle>
          <DialogDescription>Connect your Sui wallet to access premium features and content.</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="connect" disabled={walletState.connected}>
              Connect
            </TabsTrigger>
            <TabsTrigger value="account" disabled={!walletState.connected}>
              Account
            </TabsTrigger>
          </TabsList>

          <TabsContent value="connect" className="py-4">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Connect your wallet to purchase content, subscribe to premium tiers, and access your owned content.
              </p>

              <div className="grid gap-4">
                <Button
                  variant="outline"
                  className="flex items-center justify-between h-auto p-4"
                  onClick={connect}
                  disabled={walletState.isLoading}
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src="/images/sui-wallet-logo.png"
                      alt="Sui Wallet"
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <div className="text-left">
                      <p className="font-medium">Sui Wallet</p>
                      <p className="text-xs text-muted-foreground">Connect to your Sui Wallet extension</p>
                    </div>
                  </div>
                  {walletState.isLoading ? (
                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Wallet className="h-5 w-5 text-muted-foreground" />
                  )}
                </Button>

                <Button variant="outline" className="flex items-center justify-between h-auto p-4" disabled>
                  <div className="flex items-center gap-3">
                    <Image
                      src="/images/ethos-wallet-logo.png"
                      alt="Ethos Wallet"
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <div className="text-left">
                      <p className="font-medium">Ethos Wallet</p>
                      <p className="text-xs text-muted-foreground">Coming soon</p>
                    </div>
                  </div>
                  <Wallet className="h-5 w-5 text-muted-foreground" />
                </Button>

                <Button variant="outline" className="flex items-center justify-between h-auto p-4" disabled>
                  <div className="flex items-center gap-3">
                    <Image
                      src="/images/suiet-wallet-logo.png"
                      alt="Suiet Wallet"
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <div className="text-left">
                      <p className="font-medium">Suiet Wallet</p>
                      <p className="text-xs text-muted-foreground">Coming soon</p>
                    </div>
                  </div>
                  <Wallet className="h-5 w-5 text-muted-foreground" />
                </Button>
              </div>

              <p className="text-xs text-center text-muted-foreground mt-6">
                Don't have a wallet?{" "}
                <a
                  href="https://chrome.google.com/webstore/detail/sui-wallet/opcgpfmipidbgpofldcgdbkabmpjhpnm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center"
                >
                  Install Sui Wallet
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </p>
            </div>
          </TabsContent>

          <TabsContent value="account" className="py-4">
            {walletState.connected && (
              <div className="space-y-6">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Wallet Address</h3>
                    <Button variant="ghost" size="icon" onClick={copyAddress}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm font-mono bg-muted p-2 rounded">{walletState.address}</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Balance</h3>
                  <p className="text-2xl font-bold">{formatSuiAmount(walletState.balance)} SUI</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Owned Content</h3>
                  <p className="text-lg font-semibold">{walletState.ownedContent.length} items</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Subscription</h3>
                  {walletState.subscriptions.length > 0 ? (
                    <div>
                      {walletState.subscriptions.map((sub, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold">Tier {sub.tier}</p>
                            <p className="text-sm text-muted-foreground">
                              Expires: {new Date(sub.endTime * 1000).toLocaleDateString()}
                            </p>
                          </div>
                          <div className={sub.active ? "text-green-500" : "text-red-500"}>
                            {sub.active ? "Active" : "Expired"}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <p className="text-muted-foreground">No active subscription</p>
                      <Button
                        size="sm"
                        onClick={() => {
                          onClose()
                          document.dispatchEvent(new CustomEvent("open-subscription-dialog"))
                        }}
                      >
                        Subscribe
                      </Button>
                    </div>
                  )}
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={onClose}>
                    Close
                  </Button>
                  <Button variant="destructive" onClick={handleDisconnect}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Disconnect
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
