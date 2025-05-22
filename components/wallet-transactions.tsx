"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowDownLeft, ArrowUpRight, Filter } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock data for transactions
const mockTransactions = [
  {
    id: "tx1",
    type: "purchase",
    title: "Premium Subscription",
    amount: 50,
    token: "SUI",
    timestamp: "2023-05-15T10:30:00Z",
    status: "completed",
  },
  {
    id: "tx2",
    type: "purchase",
    title: "Movie: Inception",
    amount: 5,
    token: "SUI",
    timestamp: "2023-05-12T14:20:00Z",
    status: "completed",
  },
  {
    id: "tx3",
    type: "reward",
    title: "Referral Bonus",
    amount: 10,
    token: "SUI",
    timestamp: "2023-05-10T09:15:00Z",
    status: "completed",
  },
  {
    id: "tx4",
    type: "purchase",
    title: "Creator Subscription: FilmMaster",
    amount: 15,
    token: "SUI",
    timestamp: "2023-05-05T16:45:00Z",
    status: "completed",
  },
  {
    id: "tx5",
    type: "reward",
    title: "Watch Streak Bonus",
    amount: 2,
    token: "SUI",
    timestamp: "2023-05-01T20:10:00Z",
    status: "completed",
  },
]

type TransactionType = "purchase" | "reward"

export function WalletTransactions() {
  const [transactions, setTransactions] = useState(mockTransactions)
  const [filters, setFilters] = useState<TransactionType[]>(["purchase", "reward"])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const toggleFilter = (type: TransactionType) => {
    if (filters.includes(type)) {
      setFilters(filters.filter((t) => t !== type))
    } else {
      setFilters([...filters, type])
    }
  }

  const filteredTransactions = transactions.filter((tx) => filters.includes(tx.type as TransactionType))

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Wallet Transactions</CardTitle>
          <CardDescription>Your recent SUI token transactions</CardDescription>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuCheckboxItem
              checked={filters.includes("purchase")}
              onCheckedChange={() => toggleFilter("purchase")}
            >
              Purchases
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.includes("reward")}
              onCheckedChange={() => toggleFilter("reward")}
            >
              Rewards
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-10">
            <ArrowUpRight className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No transactions</h3>
            <p className="text-sm text-muted-foreground mt-1">Your transactions will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${tx.type === "purchase" ? "bg-red-100" : "bg-green-100"}`}>
                    {tx.type === "purchase" ? (
                      <ArrowUpRight
                        className={`h-5 w-5 ${tx.type === "purchase" ? "text-red-600" : "text-green-600"}`}
                      />
                    ) : (
                      <ArrowDownLeft
                        className={`h-5 w-5 ${tx.type === "purchase" ? "text-red-600" : "text-green-600"}`}
                      />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium">{tx.title}</h4>
                    <p className="text-xs text-muted-foreground">{formatDate(tx.timestamp)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-medium ${tx.type === "purchase" ? "text-red-600" : "text-green-600"}`}>
                    {tx.type === "purchase" ? "-" : "+"}
                    {tx.amount} {tx.token}
                  </div>
                  <Badge variant={tx.status === "completed" ? "outline" : "secondary"} className="mt-1">
                    {tx.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
