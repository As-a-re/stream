"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Film, Trash2, Tv } from "lucide-react"
import Link from "next/link"

// Mock data for watch history
const mockWatchHistory = [
  {
    id: "123",
    title: "Inception",
    type: "movie",
    poster: "/placeholder.svg?height=150&width=100",
    watchedAt: "2023-05-10T14:30:00Z",
    progress: 85,
  },
  {
    id: "456",
    title: "Stranger Things",
    type: "tv",
    poster: "/placeholder.svg?height=150&width=100",
    watchedAt: "2023-05-09T20:15:00Z",
    progress: 60,
    season: 2,
    episode: 5,
  },
  {
    id: "789",
    title: "The Dark Knight",
    type: "movie",
    poster: "/placeholder.svg?height=150&width=100",
    watchedAt: "2023-05-08T19:00:00Z",
    progress: 100,
  },
  {
    id: "101",
    title: "Breaking Bad",
    type: "tv",
    poster: "/placeholder.svg?height=150&width=100",
    watchedAt: "2023-05-07T21:30:00Z",
    progress: 40,
    season: 4,
    episode: 8,
  },
]

export function WatchHistory() {
  const [watchHistory, setWatchHistory] = useState(mockWatchHistory)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const removeFromHistory = (id: string) => {
    setWatchHistory(watchHistory.filter((item) => item.id !== id))
  }

  const clearHistory = () => {
    setWatchHistory([])
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Watch History</CardTitle>
          <CardDescription>Your recently watched content</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={clearHistory} disabled={watchHistory.length === 0}>
          <Trash2 className="h-4 w-4 mr-2" />
          Clear History
        </Button>
      </CardHeader>
      <CardContent>
        {watchHistory.length === 0 ? (
          <div className="text-center py-10">
            <Clock className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No watch history</h3>
            <p className="text-sm text-muted-foreground mt-1">Your watch history will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {watchHistory.map((item) => (
              <div key={item.id} className="flex gap-4">
                <Link href={`/title/${item.type}/${item.id}`} className="shrink-0">
                  <img
                    src={item.poster || "/placeholder.svg"}
                    alt={item.title}
                    className="h-24 w-16 object-cover rounded-md"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {item.type === "movie" ? (
                      <Film className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Tv className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="text-xs text-muted-foreground">{item.type === "movie" ? "Movie" : "TV Show"}</span>
                  </div>
                  <Link href={`/title/${item.type}/${item.id}`}>
                    <h4 className="font-medium truncate">{item.title}</h4>
                  </Link>
                  {item.type === "tv" && (
                    <p className="text-sm text-muted-foreground">
                      Season {item.season}, Episode {item.episode}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-xs text-muted-foreground">Watched on {formatDate(item.watchedAt)}</div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromHistory(item.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove from history</span>
                    </Button>
                  </div>
                  <div className="w-full h-1 bg-secondary mt-2 rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${item.progress}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
