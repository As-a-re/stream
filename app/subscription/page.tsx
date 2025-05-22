import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SubscriptionDialog } from "@/components/subscription-dialog"

export const metadata: Metadata = {
  title: "Subscription Plans | SuiStream",
  description: "Choose a subscription plan for SuiStream",
}

export default function SubscriptionPage() {
  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight">Choose Your Plan</h1>
        <p className="text-xl text-muted-foreground">
          Select the perfect streaming plan to fit your entertainment needs
        </p>
      </div>

      <Tabs defaultValue="monthly" className="w-full max-w-4xl mx-auto">
        <div className="flex justify-center mb-8">
          <TabsList>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="annual">Annual (Save 20%)</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="monthly" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>Basic</CardTitle>
                <CardDescription>For casual viewers</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">30</span>
                  <span className="text-muted-foreground ml-1">SUI/month</span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>HD streaming (1080p)</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Watch on 1 device at a time</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Access to all movies and shows</span>
                  </li>
                  <li className="flex items-start">
                    <X className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                    <span className="text-muted-foreground">No offline downloads</span>
                  </li>
                  <li className="flex items-start">
                    <X className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                    <span className="text-muted-foreground">No 4K streaming</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <SubscriptionDialog
                  plan="basic"
                  duration="monthly"
                  price={30}
                  buttonText="Subscribe"
                  buttonVariant="outline"
                />
              </CardFooter>
            </Card>

            <Card className="flex flex-col relative border-primary">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
              <CardHeader>
                <CardTitle>Standard</CardTitle>
                <CardDescription>For everyday streaming</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">50</span>
                  <span className="text-muted-foreground ml-1">SUI/month</span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>HD streaming (1080p)</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Watch on 2 devices at a time</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Access to all movies and shows</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Offline downloads</span>
                  </li>
                  <li className="flex items-start">
                    <X className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                    <span className="text-muted-foreground">No 4K streaming</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <SubscriptionDialog
                  plan="standard"
                  duration="monthly"
                  price={50}
                  buttonText="Subscribe"
                  buttonVariant="default"
                  className="w-full"
                />
              </CardFooter>
            </Card>

            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>Premium</CardTitle>
                <CardDescription>For the ultimate experience</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">80</span>
                  <span className="text-muted-foreground ml-1">SUI/month</span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>4K Ultra HD streaming</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Watch on 4 devices at a time</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Access to all movies and shows</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Unlimited offline downloads</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Early access to new releases</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <SubscriptionDialog
                  plan="premium"
                  duration="monthly"
                  price={80}
                  buttonText="Subscribe"
                  buttonVariant="outline"
                />
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="annual" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>Basic</CardTitle>
                <CardDescription>For casual viewers</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">288</span>
                  <span className="text-muted-foreground ml-1">SUI/year</span>
                  <div className="text-sm text-green-500 font-medium">Save 60 SUI</div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>HD streaming (1080p)</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Watch on 1 device at a time</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Access to all movies and shows</span>
                  </li>
                  <li className="flex items-start">
                    <X className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                    <span className="text-muted-foreground">No offline downloads</span>
                  </li>
                  <li className="flex items-start">
                    <X className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                    <span className="text-muted-foreground">No 4K streaming</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <SubscriptionDialog
                  plan="basic"
                  duration="annual"
                  price={288}
                  buttonText="Subscribe"
                  buttonVariant="outline"
                />
              </CardFooter>
            </Card>

            <Card className="flex flex-col relative border-primary">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
              <CardHeader>
                <CardTitle>Standard</CardTitle>
                <CardDescription>For everyday streaming</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">480</span>
                  <span className="text-muted-foreground ml-1">SUI/year</span>
                  <div className="text-sm text-green-500 font-medium">Save 120 SUI</div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>HD streaming (1080p)</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Watch on 2 devices at a time</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Access to all movies and shows</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Offline downloads</span>
                  </li>
                  <li className="flex items-start">
                    <X className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                    <span className="text-muted-foreground">No 4K streaming</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <SubscriptionDialog
                  plan="standard"
                  duration="annual"
                  price={480}
                  buttonText="Subscribe"
                  buttonVariant="default"
                  className="w-full"
                />
              </CardFooter>
            </Card>

            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>Premium</CardTitle>
                <CardDescription>For the ultimate experience</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">768</span>
                  <span className="text-muted-foreground ml-1">SUI/year</span>
                  <div className="text-sm text-green-500 font-medium">Save 192 SUI</div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>4K Ultra HD streaming</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Watch on 4 devices at a time</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Access to all movies and shows</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Unlimited offline downloads</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Early access to new releases</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <SubscriptionDialog
                  plan="premium"
                  duration="annual"
                  price={768}
                  buttonText="Subscribe"
                  buttonVariant="outline"
                />
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="max-w-3xl mx-auto mt-16 space-y-8">
        <h2 className="text-2xl font-bold text-center">Frequently Asked Questions</h2>

        <div className="space-y-4">
          <div className="bg-card rounded-lg p-6 border">
            <h3 className="text-lg font-semibold mb-2">How do subscription payments work?</h3>
            <p className="text-muted-foreground">
              Subscription payments are processed through the Sui blockchain using SUI tokens. When you subscribe, the
              specified amount of SUI tokens will be transferred from your wallet to our smart contract. For monthly
              subscriptions, this happens every 30 days. For annual subscriptions, the full amount is charged once per
              year.
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 border">
            <h3 className="text-lg font-semibold mb-2">Can I cancel my subscription?</h3>
            <p className="text-muted-foreground">
              Yes, you can cancel your subscription at any time. Go to your Profile page, select the Subscription tab,
              and click "Manage Subscription." Your access will continue until the end of your current billing period.
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 border">
            <h3 className="text-lg font-semibold mb-2">Can I change my subscription plan?</h3>
            <p className="text-muted-foreground">
              Yes, you can upgrade or downgrade your subscription plan at any time. If you upgrade, you'll be charged
              the prorated difference immediately. If you downgrade, the change will take effect at the end of your
              current billing period.
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 border">
            <h3 className="text-lg font-semibold mb-2">What happens if I don't have enough SUI tokens?</h3>
            <p className="text-muted-foreground">
              If you don't have enough SUI tokens in your wallet when a subscription payment is due, your subscription
              will be paused until you add more tokens and manually renew your subscription. We'll send you a
              notification before your subscription renewal date.
            </p>
          </div>
        </div>

        <div className="text-center">
          <p className="text-muted-foreground mb-4">Still have questions about our subscription plans?</p>
          <Button asChild>
            <Link href="/contact">Contact Support</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
