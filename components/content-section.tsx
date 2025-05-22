"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import ContentCard from "@/components/content-card"
import type { ContentItem, TMDBResponse } from "@/types/tmdb"
import { fetchMoreContent } from "@/lib/tmdb"

interface ContentSectionProps {
  title: string
  endpoint: string
  initialData: TMDBResponse
  filter?: string
}

export default function ContentSection({ title, endpoint, initialData, filter }: ContentSectionProps) {
  // Ensure initialData and results are valid
  const safeInitialData = initialData || { results: [], page: 1, total_pages: 1, total_results: 0 }
  const initialResults = safeInitialData.results || []

  const [contents, setContents] = useState<ContentItem[]>(initialResults)
  const [page, setPage] = useState(safeInitialData.page || 1)
  const [hasMore, setHasMore] = useState((safeInitialData.total_pages || 1) > 1)
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [containerWidth, setContainerWidth] = useState(0)
  const [contentWidth, setContentWidth] = useState(0)

  // Filter content if needed (e.g., for exclusive content)
  const filteredContents =
    filter === "exclusive" ? (contents || []).filter((item) => item && item.vote_average > 7.5) : contents || []

  // Update scroll measurements
  useEffect(() => {
    const updateMeasurements = () => {
      if (scrollRef.current) {
        setContainerWidth(scrollRef.current.clientWidth)
        setContentWidth(scrollRef.current.scrollWidth)
      }
    }

    updateMeasurements()
    window.addEventListener("resize", updateMeasurements)

    return () => window.removeEventListener("resize", updateMeasurements)
  }, [contents])

  // Handle scroll event
  const handleScroll = () => {
    if (scrollRef.current) {
      setScrollPosition(scrollRef.current.scrollLeft)
    }
  }

  // Add scroll event listener
  useEffect(() => {
    const container = scrollRef.current
    if (container) {
      container.addEventListener("scroll", handleScroll)
      return () => container.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Load more content
  const loadMore = async () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    try {
      const nextPage = page + 1
      const moreContent = await fetchMoreContent(endpoint, nextPage)

      if (moreContent && moreContent.results) {
        setContents((prev) => [...(prev || []), ...(moreContent.results || [])])
        setPage(nextPage)
        setHasMore(nextPage < (moreContent.total_pages || 1))
      }
    } catch (error) {
      console.error(`Error loading more content for ${endpoint}:`, error)
    } finally {
      setIsLoading(false)
    }
  }

  // Scroll the container
  const scroll = (direction: "left" | "right") => {
    const container = scrollRef.current
    if (!container) return

    const scrollAmount = direction === "left" ? -container.clientWidth / 2 : container.clientWidth / 2

    container.scrollBy({ left: scrollAmount, behavior: "smooth" })
  }

  // Calculate if scroll buttons should be shown
  const showLeftButton = scrollPosition > 10
  const showRightButton = scrollPosition < contentWidth - containerWidth - 10

  // If we have no content, show a message
  if (!filteredContents || filteredContents.length === 0) {
    return (
      <section className="py-8 relative">
        <h2 className="text-2xl font-semibold mb-4">{title}</h2>
        <div className="p-8 text-center text-muted-foreground">No content available at this time.</div>
      </section>
    )
  }

  return (
    <section className="py-8 relative">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>

      <div className="relative group">
        {showLeftButton && (
          <Button
            variant="secondary"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full opacity-80 hover:opacity-100"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        )}

        <div
          ref={scrollRef}
          className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          onScroll={handleScroll}
        >
          {Array.isArray(filteredContents) &&
            filteredContents.map(
              (content) =>
                content && (
                  <div
                    key={`${content.media_type || "unknown"}-${content.id || Math.random()}`}
                    className="flex-none w-[180px] md:w-[200px]"
                  >
                    <ContentCard content={content} />
                  </div>
                ),
            )}

          {hasMore && (
            <div className="flex-none w-[180px] md:w-[200px] flex items-center justify-center">
              <Button
                variant="outline"
                onClick={loadMore}
                disabled={isLoading}
                className="h-full w-full aspect-[2/3] flex flex-col gap-2"
              >
                {isLoading ? "Loading..." : "Load More"}
                {!isLoading && <ChevronRight className="h-6 w-6" />}
              </Button>
            </div>
          )}
        </div>

        {showRightButton && (
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full opacity-80 hover:opacity-100"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        )}
      </div>
    </section>
  )
}
