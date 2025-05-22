// FMovies API Integration
// This file contains functions to interact with the FMovies API

const API_BASE_URL = "https://fmoviesapi.azurewebsites.net"

// Helper function to handle API requests with error handling and retries
async function fetchWithRetry(endpoint: string, options = {}, retries = 3, delay = 1000) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    if (retries > 0) {
      console.warn(`API request failed, retrying... (${retries} attempts left)`)
      await new Promise((resolve) => setTimeout(resolve, delay))
      return fetchWithRetry(endpoint, options, retries - 1, delay * 1.5)
    }
    console.error("API request failed after retries:", error)
    throw error
  }
}

// Fallback data in case the API is unavailable
import { getFallbackMovies, getFallbackTVShows, getFallbackTrending } from "./fallback-data"

// Function to get trending content
export async function getTrending(page = 1) {
  try {
    const data = await fetchWithRetry(`/trending?page=${page}`)
    return data.results || []
  } catch (error) {
    console.error("Error fetching trending content:", error)
    return getFallbackTrending()
  }
}

// Function to get popular movies
export async function getPopularMovies(page = 1) {
  try {
    const data = await fetchWithRetry(`/movies/popular?page=${page}`)
    return data.results || []
  } catch (error) {
    console.error("Error fetching popular movies:", error)
    return getFallbackMovies("popular")
  }
}

// Function to get top rated movies
export async function getTopRatedMovies(page = 1) {
  try {
    const data = await fetchWithRetry(`/movies/top_rated?page=${page}`)
    return data.results || []
  } catch (error) {
    console.error("Error fetching top rated movies:", error)
    return getFallbackMovies("top_rated")
  }
}

// Function to get now playing movies
export async function getNowPlayingMovies(page = 1) {
  try {
    const data = await fetchWithRetry(`/movies/now_playing?page=${page}`)
    return data.results || []
  } catch (error) {
    console.error("Error fetching now playing movies:", error)
    return getFallbackMovies("now_playing")
  }
}

// Function to get upcoming movies
export async function getUpcomingMovies(page = 1) {
  try {
    const data = await fetchWithRetry(`/movies/upcoming?page=${page}`)
    return data.results || []
  } catch (error) {
    console.error("Error fetching upcoming movies:", error)
    return getFallbackMovies("upcoming")
  }
}

// Function to get popular TV shows
export async function getPopularTVShows(page = 1) {
  try {
    const data = await fetchWithRetry(`/tv/popular?page=${page}`)
    return data.results || []
  } catch (error) {
    console.error("Error fetching popular TV shows:", error)
    return getFallbackTVShows("popular")
  }
}

// Function to get top rated TV shows
export async function getTopRatedTVShows(page = 1) {
  try {
    const data = await fetchWithRetry(`/tv/top_rated?page=${page}`)
    return data.results || []
  } catch (error) {
    console.error("Error fetching top rated TV shows:", error)
    return getFallbackTVShows("top_rated")
  }
}

// Function to get on the air TV shows
export async function getOnTheAirTVShows(page = 1) {
  try {
    const data = await fetchWithRetry(`/tv/on_the_air?page=${page}`)
    return data.results || []
  } catch (error) {
    console.error("Error fetching on the air TV shows:", error)
    return getFallbackTVShows("on_the_air")
  }
}

// Function to get movie details
export async function getMovieDetails(id: string) {
  try {
    const data = await fetchWithRetry(`/movie/${id}`)
    return data
  } catch (error) {
    console.error(`Error fetching movie details for ID ${id}:`, error)
    return getFallbackMovies("details", id)
  }
}

// Function to get TV show details
export async function getTVShowDetails(id: string) {
  try {
    const data = await fetchWithRetry(`/tv/${id}`)
    return data
  } catch (error) {
    console.error(`Error fetching TV show details for ID ${id}:`, error)
    return getFallbackTVShows("details", id)
  }
}

// Function to get movie streaming links
export async function getMovieStreamingLinks(id: string) {
  try {
    const data = await fetchWithRetry(`/movie/${id}/watch`)
    return data.sources || []
  } catch (error) {
    console.error(`Error fetching movie streaming links for ID ${id}:`, error)
    return [
      {
        url: "https://example.com/fallback-stream.mp4",
        quality: "720p",
        type: "mp4",
      },
    ]
  }
}

// Function to get TV episode streaming links
export async function getTVEpisodeStreamingLinks(id: string, season: number, episode: number) {
  try {
    const data = await fetchWithRetry(`/tv/${id}/season/${season}/episode/${episode}/watch`)
    return data.sources || []
  } catch (error) {
    console.error(`Error fetching TV episode streaming links for ID ${id}, S${season}E${episode}:`, error)
    return [
      {
        url: "https://example.com/fallback-stream.mp4",
        quality: "720p",
        type: "mp4",
      },
    ]
  }
}

// Function to search for movies and TV shows
export async function searchContent(query: string, page = 1) {
  try {
    const data = await fetchWithRetry(`/search/multi?query=${encodeURIComponent(query)}&page=${page}`)
    return data.results || []
  } catch (error) {
    console.error(`Error searching for "${query}":`, error)
    return []
  }
}

// Function to get movies by genre
export async function getMoviesByGenre(genre: string, page = 1) {
  try {
    const data = await fetchWithRetry(`/discover/movie?with_genres=${genre}&page=${page}`)
    return data.results || []
  } catch (error) {
    console.error(`Error fetching movies for genre "${genre}":`, error)
    return getFallbackMovies("genre", genre)
  }
}

// Function to get TV shows by genre
export async function getTVShowsByGenre(genre: string, page = 1) {
  try {
    const data = await fetchWithRetry(`/discover/tv?with_genres=${genre}&page=${page}`)
    return data.results || []
  } catch (error) {
    console.error(`Error fetching TV shows for genre "${genre}":`, error)
    return getFallbackTVShows("genre", genre)
  }
}

// Function to get movie recommendations
export async function getMovieRecommendations(id: string, page = 1) {
  try {
    const data = await fetchWithRetry(`/movie/${id}/recommendations?page=${page}`)
    return data.results || []
  } catch (error) {
    console.error(`Error fetching movie recommendations for ID ${id}:`, error)
    return []
  }
}

// Function to get TV show recommendations
export async function getTVShowRecommendations(id: string, page = 1) {
  try {
    const data = await fetchWithRetry(`/tv/${id}/recommendations?page=${page}`)
    return data.results || []
  } catch (error) {
    console.error(`Error fetching TV show recommendations for ID ${id}:`, error)
    return []
  }
}
