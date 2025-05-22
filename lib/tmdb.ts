import { cache } from "react"
import type { ContentItem, TMDBResponse, ContentCredits } from "@/types/tmdb"

// TMDB API configuration
const API_KEY = process.env.TMDB_API_KEY || "e8600999e10a7ace8d8f0c0fcdeadaae"
const BASE_URL = "https://api.themoviedb.org/3"

// Helper function for API requests with error handling and retries
async function fetchTMDB(endpoint: string, params: Record<string, string> = {}, retries = 3) {
  // Add API key to params
  const queryParams = new URLSearchParams({
    api_key: API_KEY,
    ...params,
  }).toString()

  // Ensure endpoint starts with /
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`
  const url = `${BASE_URL}${path}?${queryParams}`

  let lastError
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch(url, {
        next: { revalidate: 3600 }, // Cache for 1 hour
      })

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`Attempt ${attempt + 1} failed for ${url}:`, error)
      lastError = error

      // Wait before retrying (exponential backoff)
      if (attempt < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, attempt)))
      }
    }
  }

  console.error(`API request failed after retries:`, lastError)
  throw lastError
}

// Cached API functions to prevent redundant requests
export const fetchTrending = cache(async (): Promise<TMDBResponse> => {
  try {
    const data = await fetchTMDB("/trending/all/week")

    // Ensure each item has a media_type
    const results = data.results.map((item: any) => ({
      ...item,
      media_type: item.media_type || (item.first_air_date ? "tv" : "movie"),
    }))

    return {
      ...data,
      results,
    }
  } catch (error) {
    console.error("Error fetching trending content:", error)
    throw error
  }
})

export const fetchPopularMovies = cache(async (): Promise<TMDBResponse> => {
  try {
    const data = await fetchTMDB("/movie/popular")

    // Add media_type to each item
    const results = data.results.map((item: any) => ({
      ...item,
      media_type: "movie",
    }))

    return {
      ...data,
      results,
    }
  } catch (error) {
    console.error("Error fetching popular movies:", error)
    throw error
  }
})

export const fetchTopRatedMovies = cache(async (): Promise<TMDBResponse> => {
  try {
    const data = await fetchTMDB("/movie/top_rated")

    // Add media_type to each item
    const results = data.results.map((item: any) => ({
      ...item,
      media_type: "movie",
    }))

    return {
      ...data,
      results,
    }
  } catch (error) {
    console.error("Error fetching top rated movies:", error)
    throw error
  }
})

export const fetchUpcomingMovies = cache(async (): Promise<TMDBResponse> => {
  try {
    const data = await fetchTMDB("/movie/upcoming")

    // Add media_type to each item
    const results = data.results.map((item: any) => ({
      ...item,
      media_type: "movie",
    }))

    return {
      ...data,
      results,
    }
  } catch (error) {
    console.error("Error fetching upcoming movies:", error)
    throw error
  }
})

export const fetchNowPlayingMovies = cache(async (): Promise<TMDBResponse> => {
  try {
    const data = await fetchTMDB("/movie/now_playing")

    // Add media_type to each item
    const results = data.results.map((item: any) => ({
      ...item,
      media_type: "movie",
    }))

    return {
      ...data,
      results,
    }
  } catch (error) {
    console.error("Error fetching now playing movies:", error)
    throw error
  }
})

export const fetchPopularTVShows = cache(async (): Promise<TMDBResponse> => {
  try {
    const data = await fetchTMDB("/tv/popular")

    // Add media_type to each item
    const results = data.results.map((item: any) => ({
      ...item,
      media_type: "tv",
      title: item.name, // Ensure title is set for consistency
    }))

    return {
      ...data,
      results,
    }
  } catch (error) {
    console.error("Error fetching popular TV shows:", error)
    throw error
  }
})

export const fetchTopRatedTVShows = cache(async (): Promise<TMDBResponse> => {
  try {
    const data = await fetchTMDB("/tv/top_rated")

    // Add media_type to each item
    const results = data.results.map((item: any) => ({
      ...item,
      media_type: "tv",
      title: item.name, // Ensure title is set for consistency
    }))

    return {
      ...data,
      results,
    }
  } catch (error) {
    console.error("Error fetching top rated TV shows:", error)
    throw error
  }
})

export const fetchOnTheAirTVShows = cache(async (): Promise<TMDBResponse> => {
  try {
    const data = await fetchTMDB("/tv/on_the_air")

    // Add media_type to each item
    const results = data.results.map((item: any) => ({
      ...item,
      media_type: "tv",
      title: item.name, // Ensure title is set for consistency
    }))

    return {
      ...data,
      results,
    }
  } catch (error) {
    console.error("Error fetching on the air TV shows:", error)
    throw error
  }
})

export const fetchAiringTodayTVShows = cache(async (): Promise<TMDBResponse> => {
  try {
    const data = await fetchTMDB("/tv/airing_today")

    // Add media_type to each item
    const results = data.results.map((item: any) => ({
      ...item,
      media_type: "tv",
      title: item.name, // Ensure title is set for consistency
    }))

    return {
      ...data,
      results,
    }
  } catch (error) {
    console.error("Error fetching airing today TV shows:", error)
    throw error
  }
})

export const fetchContentDetails = cache(async (type: string, id: number): Promise<ContentItem> => {
  try {
    const data = await fetchTMDB(`/${type}/${id}`, { append_to_response: "videos,images" })

    // Ensure consistent properties
    return {
      ...data,
      media_type: type,
      title: data.title || data.name,
    }
  } catch (error) {
    console.error(`Error fetching ${type} details:`, error)
    throw error
  }
})

export const fetchContentVideos = cache(async (type: string, id: number) => {
  try {
    return await fetchTMDB(`/${type}/${id}/videos`)
  } catch (error) {
    console.error(`Error fetching ${type} videos:`, error)
    throw error
  }
})

export const fetchSimilarContent = cache(async (type: string, id: number): Promise<TMDBResponse> => {
  try {
    const data = await fetchTMDB(`/${type}/${id}/similar`)

    // Add media_type to each item
    const results = data.results.map((item: any) => ({
      ...item,
      media_type: type,
      title: item.title || item.name, // Ensure title is set for consistency
    }))

    return {
      ...data,
      results,
    }
  } catch (error) {
    console.error(`Error fetching similar ${type} content:`, error)
    throw error
  }
})

export const fetchContentCredits = cache(async (type: string, id: number): Promise<ContentCredits> => {
  try {
    return await fetchTMDB(`/${type}/${id}/credits`)
  } catch (error) {
    console.error(`Error fetching ${type} credits:`, error)
    throw error
  }
})

export const searchContent = cache(async (query: string, page = 1): Promise<TMDBResponse> => {
  try {
    const data = await fetchTMDB("/search/multi", {
      query: query,
      page: page.toString(),
    })

    // Filter out person results and ensure consistent properties
    const results = data.results
      .filter((item: any) => item.media_type === "movie" || item.media_type === "tv")
      .map((item: any) => ({
        ...item,
        title: item.title || item.name, // Ensure title is set for consistency
      }))

    return {
      ...data,
      results,
    }
  } catch (error) {
    console.error("Error searching content:", error)
    throw error
  }
})

export const fetchMoreContent = cache(async (endpoint: string, page: number): Promise<TMDBResponse> => {
  try {
    const data = await fetchTMDB(endpoint, { page: page.toString() })

    // Determine media type from endpoint
    let mediaType = "movie"
    if (endpoint.includes("tv/") || endpoint === "tv") {
      mediaType = "tv"
    } else if (endpoint.includes("trending") || endpoint.includes("search/multi")) {
      mediaType = "" // Will use the media_type from the response
    }

    // Add media_type to each item if not already present
    const results = data.results.map((item: any) => ({
      ...item,
      media_type: item.media_type || mediaType,
      title: item.title || item.name, // Ensure title is set for consistency
    }))

    return {
      ...data,
      results,
    }
  } catch (error) {
    console.error(`Error fetching more content for ${endpoint}:`, error)
    throw error
  }
})

// Get content by genre
export const fetchContentByGenre = cache(
  async (mediaType: string, genreId: number, page = 1): Promise<TMDBResponse> => {
    try {
      const data = await fetchTMDB(`/discover/${mediaType}`, {
        with_genres: genreId.toString(),
        page: page.toString(),
      })

      // Add media_type to each item
      const results = data.results.map((item: any) => ({
        ...item,
        media_type: mediaType,
        title: item.title || item.name, // Ensure title is set for consistency
      }))

      return {
        ...data,
        results,
      }
    } catch (error) {
      console.error(`Error fetching ${mediaType} by genre ${genreId}:`, error)
      throw error
    }
  },
)

// Get all genres
export const fetchGenres = cache(async (mediaType: string) => {
  try {
    return await fetchTMDB(`/genre/${mediaType}/list`)
  } catch (error) {
    console.error(`Error fetching ${mediaType} genres:`, error)
    throw error
  }
})

// Get streaming providers
export const fetchWatchProviders = cache(async (type: string, id: number) => {
  try {
    return await fetchTMDB(`/${type}/${id}/watch/providers`)
  } catch (error) {
    console.error(`Error fetching ${type} watch providers:`, error)
    throw error
  }
})
