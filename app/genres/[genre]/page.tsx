import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ContentGrid } from "@/components/content-grid"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

// Define available genres
const availableGenres = [
  "action",
  "adventure",
  "animation",
  "comedy",
  "crime",
  "documentary",
  "drama",
  "family",
  "fantasy",
  "history",
  "horror",
  "music",
  "mystery",
  "romance",
  "science-fiction",
  "thriller",
  "war",
  "western",
]

// Genre name formatting
const formatGenreName = (genre: string) => {
  return genre
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

// Generate metadata
export async function generateMetadata({ params }: { params: { genre: string } }): Promise<Metadata> {
  const genre = params.genre

  if (!availableGenres.includes(genre)) {
    return {
      title: "Genre Not Found | SuiStream",
    }
  }

  const formattedGenre = formatGenreName(genre)

  return {
    title: `${formattedGenre} Movies & TV Shows | SuiStream`,
    description: `Discover the best ${formattedGenre.toLowerCase()} movies and TV shows on SuiStream`,
  }
}

export default async function GenrePage({ params }: { params: { genre: string } }) {
  const { genre } = params

  // Check if genre exists
  if (!availableGenres.includes(genre)) {
    notFound()
  }

  const formattedGenre = formatGenreName(genre)

  // Mock data - in a real app, you would fetch this from an API
  const movies = Array(8)
    .fill(null)
    .map((_, i) => ({
      id: `movie-${i + 1}`,
      title: `${formattedGenre} Movie ${i + 1}`,
      type: "movie",
      poster: `/placeholder.svg?height=450&width=300&text=${formattedGenre}+Movie+${i + 1}`,
      year: 2023 - Math.floor(Math.random() * 10),
      rating: (Math.random() * 2 + 3).toFixed(1),
    }))

  const tvShows = Array(8)
    .fill(null)
    .map((_, i) => ({
      id: `tv-${i + 1}`,
      title: `${formattedGenre} TV Show ${i + 1}`,
      type: "tv",
      poster: `/placeholder.svg?height=450&width=300&text=${formattedGenre}+TV+${i + 1}`,
      year: 2023 - Math.floor(Math.random() * 10),
      rating: (Math.random() * 2 + 3).toFixed(1),
    }))

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div>
        <Link href="/" className="inline-flex items-center">
          <Button variant="ghost" size="sm" className="h-8 pl-0">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        <h1 className="text-3xl font-bold mt-2">{formattedGenre}</h1>
        <p className="text-muted-foreground">Discover the best {formattedGenre.toLowerCase()} content on SuiStream</p>
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Movies</h2>
          <ContentGrid content={movies} />
        </div>

        <Separator />

        <div>
          <h2 className="text-2xl font-semibold mb-4">TV Shows</h2>
          <ContentGrid content={tvShows} />
        </div>
      </div>
    </div>
  )
}
