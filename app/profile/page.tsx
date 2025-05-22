import type { Metadata } from "next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { WatchHistory } from "@/components/watch-history"
import { WalletTransactions } from "@/components/wallet-transactions"
import { getWalletState } from "@/lib/sui-wallet"

export const metadata: Metadata = {
  title: "Profile | SuiStream",
  description: "Manage your SuiStream profile, watch history, and wallet transactions",
}

export default async function ProfilePage() {
  const walletState = await getWalletState()

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <Card className="w-full md:w-1/3">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Manage your account details</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Profile" />
              <AvatarFallback>US</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="text-xl font-medium">
                {walletState?.address
                  ? walletState.address.slice(0, 6) + "..." + walletState.address.slice(-4)
                  : "User"}
              </h3>
              <p className="text-sm text-muted-foreground">Member since May 2023</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="outline">Edit Profile</Button>
          </CardFooter>
        </Card>

        <div className="w-full md:w-2/3">
          <Tabs defaultValue="history" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="history">Watch History</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            </TabsList>
            <TabsContent value="history" className="mt-4">
              <WatchHistory />
            </TabsContent>
            <TabsContent value="transactions" className="mt-4">
              <WalletTransactions />
            </TabsContent>
            <TabsContent value="subscriptions" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Your Subscriptions</CardTitle>
                  <CardDescription>Manage your content subscriptions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Premium Plan</h4>
                        <p className="text-sm text-muted-foreground">Active until June 15, 2023</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </div>
                    <div className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Creator Channel: FilmMaster</h4>
                        <p className="text-sm text-muted-foreground">Subscribed on April 10, 2023</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
