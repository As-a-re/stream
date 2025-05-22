"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, X, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useWallet } from "@/contexts/wallet-context"
import WalletConnect from "@/components/wallet-connect"
import { SubscriptionDialog } from "@/components/subscription-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Navbar() {
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { walletState, disconnectWallet } = useWallet()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Listen for wallet modal events
  useEffect(() => {
    const handleOpenWalletModal = () => setShowWalletModal(true)
    document.addEventListener("open-wallet-modal", handleOpenWalletModal)
    return () => document.removeEventListener("open-wallet-modal", handleOpenWalletModal)
  }, [])

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="rounded-full bg-primary p-1 w-8 h-8 flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold">SuiStream</span>
            </Link>
            <nav className="ml-6 hidden md:flex space-x-4">
              <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/movies" className="text-sm font-medium hover:text-primary transition-colors">
                Movies
              </Link>
              <Link href="/tv" className="text-sm font-medium hover:text-primary transition-colors">
                TV Shows
              </Link>
              <Link href="/library" className="text-sm font-medium hover:text-primary transition-colors">
                Library
              </Link>
              <Link href="/watchlist" className="text-sm font-medium hover:text-primary transition-colors">
                Watchlist
              </Link>
              <Link href="/reviews" className="text-sm font-medium hover:text-primary transition-colors">
                Reviews
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/search">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
            </Link>
            <SubscriptionDialog />
            {walletState.connected ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>Wallet Connected</span>
                      <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {walletState.address}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/library">Library</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/watchlist">Watchlist</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/reviews">Reviews</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={disconnectWallet}>Disconnect Wallet</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <WalletConnect />
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {showMobileMenu && (
          <div className="md:hidden bg-background border-t">
            <div className="py-4 px-4 space-y-3">
              <form onSubmit={handleSearch} className="flex relative mb-4">
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button type="submit" size="icon" variant="ghost" className="absolute right-0 top-0 h-full">
                  <Search className="h-4 w-4" />
                </Button>
              </form>

              <Link
                href="/"
                className="block py-2 px-2 rounded-md hover:bg-accent"
                onClick={() => setShowMobileMenu(false)}
              >
                Home
              </Link>
              <Link
                href="/movies"
                className="block py-2 px-2 rounded-md hover:bg-accent"
                onClick={() => setShowMobileMenu(false)}
              >
                Movies
              </Link>
              <Link
                href="/tv"
                className="block py-2 px-2 rounded-md hover:bg-accent"
                onClick={() => setShowMobileMenu(false)}
              >
                TV Shows
              </Link>
              <Link
                href="/collection"
                className="block py-2 px-2 rounded-md hover:bg-accent"
                onClick={() => setShowMobileMenu(false)}
              >
                My Collection
              </Link>

              {!walletState.connected && (
                <Button
                  variant="default"
                  onClick={() => {
                    setShowWalletModal(true)
                    setShowMobileMenu(false)
                  }}
                  className="w-full mt-2"
                >
                  Connect Wallet
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
