import { Suspense } from "react"
import Navbar from "@/components/navbar"
import HeroSection from "@/components/hero-section"
import ContentSection from "@/components/content-section"
import FeatureSection from "@/components/feature-section"
import Footer from "@/components/footer"
import { ContentSkeleton } from "@/components/ui/content-skeleton"
import { fetchTrending, fetchPopularMovies, fetchPopularTVShows } from "@/lib/tmdb"

export default async function Home() {
  // Default empty response structure
  const emptyResponse = { results: [], page: 1, total_pages: 1, total_results: 0 }

  // Fetch data in parallel with error handling
  const [trendingData, moviesData, tvShowsData] = await Promise.all([
    fetchTrending().catch((error) => {
      console.error("Error fetching trending data:", error)
      return emptyResponse
    }),
    fetchPopularMovies().catch((error) => {
      console.error("Error fetching movies data:", error)
      return emptyResponse
    }),
    fetchPopularTVShows().catch((error) => {
      console.error("Error fetching TV shows data:", error)
      return emptyResponse
    }),
  ])

  // Ensure we have valid results arrays
  const trendingResults = trendingData?.results || []
  const moviesResults = moviesData?.results || []
  const tvShowsResults = tvShowsData?.results || []

  // Get featured content (first trending item with backdrop)
  const featuredContent = trendingResults.find((item) => item?.backdrop_path) ||
    trendingResults[0] || {
      id: 1,
      title: "SuiStream Exclusive Content",
      backdrop_path: "/placeholder.svg?height=1080&width=1920",
      poster_path: "/placeholder.svg?height=500&width=300",
      overview: "Welcome to SuiStream, the decentralized streaming platform built on Sui blockchain.",
      vote_average: 9.5,
      media_type: "movie",
    }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <Suspense fallback={<div className="h-[60vh] bg-gradient-to-b from-background/80 to-background animate-pulse" />}>
        <HeroSection content={featuredContent} />
      </Suspense>

      <div className="container px-4 mx-auto">
        <Suspense fallback={<ContentSkeleton />}>
          <ContentSection
            title="Trending Now"
            endpoint="trending/all/week"
            initialData={trendingData || emptyResponse}
          />
        </Suspense>

        <Suspense fallback={<ContentSkeleton />}>
          <ContentSection title="Popular Movies" endpoint="movie/popular" initialData={moviesData || emptyResponse} />
        </Suspense>

        <Suspense fallback={<ContentSkeleton />}>
          <ContentSection title="Popular TV Shows" endpoint="tv/popular" initialData={tvShowsData || emptyResponse} />
        </Suspense>

        <Suspense fallback={<ContentSkeleton />}>
          <ContentSection
            title="NFT Exclusive Content"
            endpoint="trending/all/week"
            filter="exclusive"
            initialData={trendingData || emptyResponse}
          />
        </Suspense>
      </div>

      <FeatureSection />
      <Footer />
    </main>
  )
}
