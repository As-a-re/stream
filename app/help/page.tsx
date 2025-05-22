import type { Metadata } from "next"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Help Center | SuiStream",
  description: "Get help with SuiStream - FAQs, guides, and support resources",
}

export default function HelpPage() {
  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold">Help Center</h1>
        <p className="text-xl text-muted-foreground mt-4">
          Find answers to common questions and learn how to use SuiStream
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input placeholder="Search for help..." className="pl-10" />
        </div>
      </div>

      <Tabs defaultValue="faq" className="max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="faq">FAQs</TabsTrigger>
          <TabsTrigger value="guides">Guides</TabsTrigger>
          <TabsTrigger value="wallet">Wallet Help</TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="mt-6">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>What is SuiStream?</AccordionTrigger>
              <AccordionContent>
                SuiStream is a decentralized streaming platform built on the Sui blockchain. It allows users to watch
                movies and TV shows while supporting content creators through direct blockchain transactions,
                eliminating middlemen and ensuring fair compensation.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>How do I create an account?</AccordionTrigger>
              <AccordionContent>
                To use SuiStream, you need a Sui wallet. If you don't have one, you can install the Sui Wallet browser
                extension or use a compatible wallet app. Once you have a wallet, simply connect it to SuiStream by
                clicking the "Connect Wallet" button in the top right corner of the site.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>What are the subscription options?</AccordionTrigger>
              <AccordionContent>
                SuiStream offers several subscription tiers, including a monthly plan, annual plan, and pay-per-view
                options. You can also subscribe to specific creator channels to support your favorite content producers
                directly. All subscriptions are managed through smart contracts on the Sui blockchain.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>How do payments work?</AccordionTrigger>
              <AccordionContent>
                Payments on SuiStream are made using SUI tokens, the native cryptocurrency of the Sui blockchain. When
                you subscribe or purchase content, a smart contract automatically executes the transaction, distributing
                the appropriate amount to content creators, rights holders, and the platform.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>Can I watch content offline?</AccordionTrigger>
              <AccordionContent>
                Currently, SuiStream requires an internet connection to verify ownership and stream content. However,
                we're working on implementing a secure offline viewing feature that will allow temporary downloads while
                maintaining the integrity of our blockchain-based ownership system.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger>How do I cancel my subscription?</AccordionTrigger>
              <AccordionContent>
                You can cancel your subscription at any time by visiting your Profile page, selecting the Subscriptions
                tab, and clicking "Manage" next to the subscription you wish to cancel. Follow the prompts to complete
                the cancellation. Your access will continue until the end of your current billing period.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>

        <TabsContent value="guides" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Getting Started Guide</CardTitle>
                <CardDescription>Learn the basics of using SuiStream</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="text-sm">
                    <Link href="#" className="text-primary hover:underline">
                      Creating your account
                    </Link>
                  </li>
                  <li className="text-sm">
                    <Link href="#" className="text-primary hover:underline">
                      Connecting your wallet
                    </Link>
                  </li>
                  <li className="text-sm">
                    <Link href="#" className="text-primary hover:underline">
                      Browsing content
                    </Link>
                  </li>
                  <li className="text-sm">
                    <Link href="#" className="text-primary hover:underline">
                      Making your first purchase
                    </Link>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Subscription Guide</CardTitle>
                <CardDescription>Understanding subscription options</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="text-sm">
                    <Link href="#" className="text-primary hover:underline">
                      Subscription tiers explained
                    </Link>
                  </li>
                  <li className="text-sm">
                    <Link href="#" className="text-primary hover:underline">
                      Managing your subscriptions
                    </Link>
                  </li>
                  <li className="text-sm">
                    <Link href="#" className="text-primary hover:underline">
                      Creator subscriptions
                    </Link>
                  </li>
                  <li className="text-sm">
                    <Link href="#" className="text-primary hover:underline">
                      Billing and payment history
                    </Link>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Content Playback</CardTitle>
                <CardDescription>Get the best viewing experience</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="text-sm">
                    <Link href="#" className="text-primary hover:underline">
                      Playback controls
                    </Link>
                  </li>
                  <li className="text-sm">
                    <Link href="#" className="text-primary hover:underline">
                      Video quality settings
                    </Link>
                  </li>
                  <li className="text-sm">
                    <Link href="#" className="text-primary hover:underline">
                      Subtitle and audio options
                    </Link>
                  </li>
                  <li className="text-sm">
                    <Link href="#" className="text-primary hover:underline">
                      Troubleshooting playback issues
                    </Link>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Management</CardTitle>
                <CardDescription>Manage your SuiStream account</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="text-sm">
                    <Link href="#" className="text-primary hover:underline">
                      Profile settings
                    </Link>
                  </li>
                  <li className="text-sm">
                    <Link href="#" className="text-primary hover:underline">
                      Watch history and favorites
                    </Link>
                  </li>
                  <li className="text-sm">
                    <Link href="#" className="text-primary hover:underline">
                      Notification preferences
                    </Link>
                  </li>
                  <li className="text-sm">
                    <Link href="#" className="text-primary hover:underline">
                      Privacy and security
                    </Link>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="wallet" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Wallet Basics</CardTitle>
                <CardDescription>Understanding blockchain wallets</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  A blockchain wallet is a digital tool that allows you to interact with the Sui blockchain. It stores
                  your private keys and allows you to send, receive, and manage your SUI tokens.
                </p>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="wallet-1">
                    <AccordionTrigger>What wallets are compatible with SuiStream?</AccordionTrigger>
                    <AccordionContent>
                      SuiStream currently supports the official Sui Wallet, Ethos Wallet, and Suiet Wallet. We're
                      working to add support for more wallets in the future.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="wallet-2">
                    <AccordionTrigger>How do I get SUI tokens?</AccordionTrigger>
                    <AccordionContent>
                      You can purchase SUI tokens on various cryptocurrency exchanges that list SUI. After purchasing,
                      transfer the tokens to your Sui wallet to use them on SuiStream.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="wallet-3">
                    <AccordionTrigger>Is my wallet secure?</AccordionTrigger>
                    <AccordionContent>
                      Your wallet security depends on how you manage your private keys or seed phrase. Never share these
                      with anyone. SuiStream never stores your private keys - we only interact with your wallet through
                      approved transactions that you must confirm.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Troubleshooting Wallet Issues</CardTitle>
                <CardDescription>Common wallet problems and solutions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Wallet Won't Connect</h3>
                    <p className="text-sm text-muted-foreground">
                      If you're having trouble connecting your wallet, try refreshing the page, ensuring your wallet
                      extension is up to date, and checking that you're on the correct network (Sui Mainnet).
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium">Transaction Failed</h3>
                    <p className="text-sm text-muted-foreground">
                      Failed transactions can occur due to insufficient SUI for gas fees, network congestion, or wallet
                      connection issues. Check your wallet balance and try again, or adjust gas settings if your wallet
                      allows it.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium">Wallet Disconnected Unexpectedly</h3>
                    <p className="text-sm text-muted-foreground">
                      Wallets may disconnect due to inactivity, browser settings, or extension updates. Simply reconnect
                      your wallet using the "Connect Wallet" button in the navigation bar.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-muted p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-2">Still Need Help?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                If you're still experiencing wallet issues, please contact our support team for assistance.
              </p>
              <Link href="/contact">
                <Button>Contact Support</Button>
              </Link>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
