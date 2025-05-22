import type { Metadata } from "next"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

export const metadata: Metadata = {
  title: "About SuiStream | Decentralized Streaming Platform",
  description: "Learn about SuiStream, the first decentralized streaming platform built on the Sui blockchain",
}

export default function AboutPage() {
  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold">About SuiStream</h1>
        <p className="text-xl text-muted-foreground mt-4">
          The first decentralized streaming platform built on the Sui blockchain
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-muted-foreground">
              SuiStream is revolutionizing the streaming industry by creating a decentralized platform that empowers
              both creators and viewers. We believe in fair compensation for content creators and transparent, secure
              transactions for all users.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">Why Blockchain?</h2>
            <p className="text-muted-foreground">
              By leveraging the Sui blockchain, we eliminate intermediaries, reduce costs, and create a direct
              connection between creators and their audience. Smart contracts ensure automatic and fair revenue
              distribution, while NFT technology enables unique content ownership.
            </p>
          </CardContent>
        </Card>
      </div>

      <Separator className="max-w-5xl mx-auto" />

      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-semibold mb-6 text-center">Our Story</h2>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p>
            SuiStream began in 2023 when a group of blockchain enthusiasts and media professionals recognized the need
            for a more equitable streaming platform. Traditional streaming services often take large cuts from creators'
            earnings and lack transparency in their algorithms and payment structures.
          </p>
          <p>
            Our founding team combined expertise in blockchain development, content creation, and user experience design
            to build a platform that addresses these issues. After months of development and testing, SuiStream launched
            with a mission to transform how digital content is distributed, consumed, and monetized.
          </p>
          <p>
            Today, SuiStream continues to grow, adding new features and expanding our content library while maintaining
            our commitment to decentralization, transparency, and fair compensation for creators.
          </p>
        </div>
      </div>

      <Separator className="max-w-5xl mx-auto" />

      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-semibold mb-6 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary">1</span>
            </div>
            <h3 className="text-xl font-medium mb-2">Connect Your Wallet</h3>
            <p className="text-muted-foreground">
              Link your Sui wallet to access the platform and manage your subscriptions and purchases.
            </p>
          </div>

          <div className="text-center p-4">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary">2</span>
            </div>
            <h3 className="text-xl font-medium mb-2">Subscribe or Purchase</h3>
            <p className="text-muted-foreground">
              Choose between subscribing to the platform or purchasing individual content using SUI tokens.
            </p>
          </div>

          <div className="text-center p-4">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary">3</span>
            </div>
            <h3 className="text-xl font-medium mb-2">Stream & Enjoy</h3>
            <p className="text-muted-foreground">
              Access your content library anytime, anywhere, with the security and transparency of blockchain.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-muted p-8 rounded-lg max-w-5xl mx-auto text-center">
        <h2 className="text-2xl font-semibold mb-4">Join the Revolution</h2>
        <p className="text-lg mb-6">Be part of the future of decentralized entertainment</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/login">
            <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-md">
              Get Started
            </button>
          </Link>
          <Link href="/contact">
            <button className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-6 py-2 rounded-md">
              Contact Us
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
