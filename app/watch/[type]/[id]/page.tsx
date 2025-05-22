import { Suspense } from "react"
import { notFound, redirect } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { fetchContentDetails } from "@/lib/fmovies-api"
import { fetchStreamingUrl } from "@/lib/fmovies-api"
import VideoPlayer from "@/components/video-player"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { cookies } from "next/headers"
import type { Metadata } from "next"

interface WatchPageProps {
  params: {
    type: string
    id: string
  }
}

export async function generateMetadata({ params }: WatchPageProps): Promise<Metadata> {
  const { type, id } = params

  if (type !== "movie" && type !== "tv") {
    return {
      title: "Content Not Found - SuiStream",
    }
  }

  try {
    const content = await fetchContentDetails(type, Number.parseInt(id))

    return {
      title: `Watch ${content.title || content.name} - SuiStream`,
      description: content.overview,
    }
  } catch (error) {
    return {
      title: "Content Not Found - SuiStream",
    }
  }
}

export default async function WatchPage({ params }: WatchPageProps) {
  const { type, id } = params
  const cookieStore = cookies()
  const walletConnected = cookieStore.get("wallet_connected")?.value === "true"

  // Check if wallet is connected
  if (!walletConnected) {
    // Redirect to login page with return URL
    redirect(`/login?returnUrl=/watch/${type}/${id}`)
  }

  // Validate content type
  if (type !== "movie" && type !== "tv") {
    notFound()
  }

  try {
    // Fetch content details and streaming URL
    const [content, streamingUrl] = await Promise.all([
      fetchContentDetails(type, Number.parseInt(id)),
      fetchStreamingUrl(type, Number.parseInt(id)),
    ])

    // Get backdrop for poster
    const posterUrl = content.backdrop_path ? `https://image.tmdb.org/t/p/original${content.backdrop_path}` : undefined

    return (
      <main className="min-h-screen bg-background">
        <Navbar />

        <div className="container px-4 mx-auto pt-24 pb-12">
          <div className="mb-6 flex items-center">
            <Link href={`/title/${type}/${id}`}>
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" /> Back to details
              </Button>
            </Link>
            <h1 className="text-2xl font-bold ml-4">{content.title || content.name}</h1>
          </div>

          <Suspense fallback={<div className="w-full aspect-video bg-muted animate-pulse rounded-lg" />}>
            <VideoPlayer
              src={streamingUrl || "/videos/placeholder-video.mp4"}
              poster={posterUrl}
              title={content.title || content.name || ""}
            />
          </Suspense>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2">About {content.title || content.name}</h2>
            <p className="text-muted-foreground">{content.overview}</p>
          </div>
        </div>

        <Footer />
      </main>
    )
  } catch (error) {
    notFound()
  }
}
