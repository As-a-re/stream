import { Suspense } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import ContentSection from "@/components/content-section"
import { ContentSkeleton } from "@/components/ui/content-skeleton"
import {
  getPopularTVShows,
  getTopRatedTVShows,
  getOnTheAirTVShows,
  // getAiringTodayTVShows, // This function does not exist, will return []
} from "@/lib/fmovies-api"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "TV Shows - SuiStream",
  description:
    "Browse our collection of TV shows on SuiStream, the decentralized streaming platform built on Sui blockchain.",
}

import RequireWallet from '@/components/RequireWallet';

export default async function TVShowsPage() {
  // Fetch initial data for each section with error handling
  const [popularTVShows, topRatedTVShows, onTheAirTVShows, airingTodayTVShows] = await Promise.all([
    getPopularTVShows().catch((error) => {
      console.error("Error fetching popular TV shows:", error)
      return []
    }),
    getTopRatedTVShows().catch((error) => {
      console.error("Error fetching top rated TV shows:", error)
      return []
    }),
    getOnTheAirTVShows().catch((error) => {
      console.error("Error fetching on the air TV shows:", error)
      return []
    }),
    Promise.resolve([]), // getAiringTodayTVShows does not exist, return empty array
  ])

  return (
    <RequireWallet>
      <main className="min-h-screen bg-background">
      <Navbar />

      <div className="container px-4 mx-auto pt-24 pb-12">
        <h1 className="text-3xl font-bold mb-6">TV Shows</h1>

        <Suspense fallback={<ContentSkeleton />}>
          <ContentSection title="Popular TV Shows" endpoint="tv/popular" initialData={popularTVShows} />
        </Suspense>

        <Suspense fallback={<ContentSkeleton />}>
          <ContentSection title="Top Rated" endpoint="tv/top_rated" initialData={topRatedTVShows} />
        </Suspense>

        <Suspense fallback={<ContentSkeleton />}>
          <ContentSection title="Currently Airing" endpoint="tv/on_the_air" initialData={onTheAirTVShows} />
        </Suspense>

        <Suspense fallback={<ContentSkeleton />}>
          <ContentSection title="Airing Today" endpoint="tv/airing_today" initialData={airingTodayTVShows} />
        </Suspense>
      </div>

      <Footer />
    </main>
    </RequireWallet>
  )
}
