"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Check, Crown, Gem, Star } from "lucide-react"
import { useWallet } from "@/contexts/wallet-context"
import { useToast } from "@/hooks/use-toast"

interface SubscriptionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface SubscriptionTier {
  id: number
  name: string
  price: number
  features: string[]
  icon: React.ReactNode
}

export function SubscriptionDialog({ open, onOpenChange }: SubscriptionDialogProps) {
  const [selectedTier, setSelectedTier] = useState<number>(1)
  const [duration, setDuration] = useState<number>(1)
  const [isProcessing, setIsProcessing] = useState(false)

  const { walletState, purchaseSubscription, formatSuiAmount } = useWallet()
  const { toast } = useToast()

  // Subscription tiers
  const tiers: SubscriptionTier[] = [
    {
      id: 1,
      name: "Basic",
      price: 1,
      features: [
        "Access to all basic content",
        "720p streaming quality",
        "Watch on one device at a time",
        "Ad-supported experience",
      ],
      icon: <Star className="h-6 w-6 text-blue-400" />,
    },
    {
      id: 2,
      name: "Premium",
      price: 2.5,
      features: [
        "Access to all premium content",
        "1080p streaming quality",
        "Watch on two devices at a time",
        "Ad-free experience",
        "Download for offline viewing",
      ],
      icon: <Gem className="h-6 w-6 text-purple-400" />,
    },
    {
      id: 3,
      name: "Ultimate",
      price: 5,
      features: [
        "Access to all exclusive content",
        "4K streaming quality",
        "Watch on four devices at a time",
        "Ad-free experience",
        "Download for offline viewing",
        "Early access to new releases",
        "Exclusive NFT collectibles",
      ],
      icon: <Crown className="h-6 w-6 text-yellow-400" />,
    },
  ]

  // Duration options
  const durations = [
    { value: 1, label: "1 Month" },
    { value: 3, label: "3 Months", discount: 10 },
    { value: 6, label: "6 Months", discount: 15 },
    { value: 12, label: "12 Months", discount: 20 },
  ]

  // Calculate price with discount
  const calculatePrice = (basePrice: number, months: number) => {
    const duration = durations.find((d) => d.value === months)
    if (duration && duration.discount) {
      const discount = duration.discount / 100
      return basePrice * months * (1 - discount)
    }
    return basePrice * months
  }

  // Handle subscription purchase
  const handleSubscribe = async () => {
    if (!walletState.connected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to purchase a subscription",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      // Convert price to MIST (1 SUI = 10^9 MIST)
      const success = await purchaseSubscription(selectedTier, duration)

      if (success) {
        onOpenChange(false)
      }
    } catch (error) {
      console.error("Error purchasing subscription:", error)

      toast({
        title: "Subscription Failed",
        description: "There was an error processing your subscription",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Choose Your Subscription Plan</DialogTitle>
          <DialogDescription>
            Subscribe to SuiStream to unlock premium content and exclusive features.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Tier Selection */}
          <div className="grid gap-4">
            <h3 className="text-lg font-medium">Select Tier</h3>
            <RadioGroup
              value={selectedTier.toString()}
              onValueChange={(value) => setSelectedTier(Number.parseInt(value))}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {tiers.map((tier) => (
                <div key={tier.id} className="relative">
                  <RadioGroupItem value={tier.id.toString()} id={`tier-${tier.id}`} className="peer sr-only" />
                  <Label
                    htmlFor={`tier-${tier.id}`}
                    className="flex flex-col gap-2 p-4 rounded-lg border-2 border-muted bg-popover hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {tier.icon}
                        <span className="font-semibold">{tier.name}</span>
                      </div>
                      <span className="text-lg font-bold">{tier.price} SUI/mo</span>
                    </div>
                    <ul className="text-sm space-y-1 mt-2">
                      {tier.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="h-4 w-4 mt-0.5 text-green-500 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Duration Selection */}
          <div className="grid gap-4">
            <h3 className="text-lg font-medium">Select Duration</h3>
            <RadioGroup
              value={duration.toString()}
              onValueChange={(value) => setDuration(Number.parseInt(value))}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {durations.map((d) => (
                <div key={d.value} className="relative">
                  <RadioGroupItem value={d.value.toString()} id={`duration-${d.value}`} className="peer sr-only" />
                  <Label
                    htmlFor={`duration-${d.value}`}
                    className="flex flex-col items-center gap-1 p-3 rounded-lg border-2 border-muted bg-popover hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                  >
                    <span className="font-semibold">{d.label}</span>
                    {d.discount && <span className="text-xs text-green-500">Save {d.discount}%</span>}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Summary */}
          <div className="mt-4 p-4 rounded-lg bg-muted">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-semibold">
                  {tiers.find((t) => t.id === selectedTier)?.name} Plan - {duration} Month
                  {duration > 1 ? "s" : ""}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {durations.find((d) => d.value === duration)?.discount
                    ? `${durations.find((d) => d.value === duration)?.discount}% discount applied`
                    : "No discount applied"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">
                  {calculatePrice(tiers.find((t) => t.id === selectedTier)?.price || 0, duration).toFixed(2)} SUI
                </p>
                <p className="text-sm text-muted-foreground">{formatSuiAmount(walletState.balance)} SUI available</p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleSubscribe}
            disabled={isProcessing || !walletState.connected}
            className="w-full"
            size="lg"
          >
            {isProcessing ? "Processing..." : walletState.connected ? "Subscribe Now" : "Connect Wallet to Subscribe"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
