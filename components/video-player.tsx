"use client"

import { useRef, useState, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import { useWallet } from "@/contexts/wallet-context"

interface VideoPlayerProps {
  src: string
  poster?: string
  title: string
  contentId?: string
  requiresSubscription?: boolean
  minimumTier?: number
}

export default function VideoPlayer({
  src,
  poster,
  title,
  contentId,
  requiresSubscription = false,
  minimumTier = 0,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isBuffering, setIsBuffering] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { walletState, isContentOwned, hasActiveSubscription, getSubscriptionTier } = useWallet()

  // Check if user can watch the content
  const canWatch = () => {
    // If content requires ownership, check if user owns it
    if (contentId && !isContentOwned(contentId)) {
      return false
    }

    // If content requires subscription, check if user has active subscription with minimum tier
    if (requiresSubscription) {
      if (!hasActiveSubscription()) {
        return false
      }

      if (getSubscriptionTier() < minimumTier) {
        return false
      }
    }

    return true
  }

  // Handle play/pause
  const togglePlay = () => {
    if (!videoRef.current) return

    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
  }

  // Handle mute/unmute
  const toggleMute = () => {
    if (!videoRef.current) return

    videoRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  // Handle fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }

  // Handle seeking
  const handleSeek = (value: number[]) => {
    if (!videoRef.current) return

    const newTime = value[0]
    videoRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    if (!videoRef.current) return

    const newVolume = value[0]
    videoRef.current.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  // Format time (seconds to MM:SS)
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  // Skip forward/backward
  const skip = (seconds: number) => {
    if (!videoRef.current) return

    videoRef.current.currentTime += seconds
  }

  // Set up event listeners
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleTimeUpdate = () => setCurrentTime(video.currentTime)
    const handleLoadedMetadata = () => setDuration(video.duration)
    const handleVolumeChange = () => {
      setVolume(video.volume)
      setIsMuted(video.muted)
    }
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    const handleWaiting = () => setIsBuffering(true)
    const handlePlaying = () => setIsBuffering(false)
    const handleError = () => {
      setError("Error loading video. Please try again later.")
      setIsBuffering(false)
    }

    // Add event listeners
    video.addEventListener("play", handlePlay)
    video.addEventListener("pause", handlePause)
    video.addEventListener("timeupdate", handleTimeUpdate)
    video.addEventListener("loadedmetadata", handleLoadedMetadata)
    video.addEventListener("volumechange", handleVolumeChange)
    video.addEventListener("waiting", handleWaiting)
    video.addEventListener("playing", handlePlaying)
    video.addEventListener("error", handleError)
    document.addEventListener("fullscreenchange", handleFullscreenChange)

    // Auto-hide controls after 3 seconds of inactivity
    let timeout: NodeJS.Timeout

    const handleMouseMove = () => {
      setShowControls(true)
      clearTimeout(timeout)

      timeout = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false)
        }
      }, 3000)
    }

    containerRef.current?.addEventListener("mousemove", handleMouseMove)

    // Clean up
    return () => {
      video.removeEventListener("play", handlePlay)
      video.removeEventListener("pause", handlePause)
      video.removeEventListener("timeupdate", handleTimeUpdate)
      video.removeEventListener("loadedmetadata", handleLoadedMetadata)
      video.removeEventListener("volumechange", handleVolumeChange)
      video.removeEventListener("waiting", handleWaiting)
      video.removeEventListener("playing", handlePlaying)
      video.removeEventListener("error", handleError)
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
      containerRef.current?.removeEventListener("mousemove", handleMouseMove)
      clearTimeout(timeout)
    }
  }, [isPlaying])

  // Check if user can watch before rendering video
  if (contentId && !canWatch()) {
    return (
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
        <div className="text-center p-6">
          <h3 className="text-xl font-semibold mb-2">Content Locked</h3>
          <p className="text-muted-foreground mb-4">
            {!walletState.connected
              ? "Connect your wallet to watch this content"
              : requiresSubscription
                ? `This content requires a ${minimumTier > 0 ? `Tier ${minimumTier}` : ""} subscription`
                : "Purchase this content to watch it"}
          </p>
          <button
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md"
            onClick={() => {
              // Trigger wallet modal or subscription dialog
              if (!walletState.connected) {
                document.dispatchEvent(new CustomEvent("open-wallet-modal"))
              } else if (requiresSubscription) {
                document.dispatchEvent(new CustomEvent("open-subscription-dialog"))
              }
            }}
          >
            {!walletState.connected ? "Connect Wallet" : requiresSubscription ? "Subscribe Now" : "Purchase Content"}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="relative aspect-video bg-black rounded-lg overflow-hidden group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Video */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-contain"
        onClick={togglePlay}
        onDoubleClick={toggleFullscreen}
        playsInline
      />

      {/* Loading spinner */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="text-center p-6">
            <h3 className="text-xl font-semibold mb-2">Playback Error</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <button
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md"
              onClick={() => {
                setError(null)
                if (videoRef.current) {
                  videoRef.current.load()
                }
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Controls */}
      <div
        className={cn(
          "absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300",
          showControls ? "opacity-100" : "opacity-0",
        )}
      >
        {/* Title */}
        <div className="absolute top-4 left-4 right-4">
          <h3 className="text-white text-lg font-medium line-clamp-1">{title}</h3>
        </div>

        {/* Progress bar */}
        <div className="mb-2">
          <Slider
            value={[currentTime]}
            min={0}
            max={duration || 100}
            step={0.1}
            onValueChange={handleSeek}
            className="cursor-pointer"
          />
          <div className="flex justify-between text-xs text-white/80 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Control buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </button>

            {/* Skip backward */}
            <button
              onClick={() => skip(-10)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Skip backward 10 seconds"
            >
              <SkipBack className="h-5 w-5" />
            </button>

            {/* Skip forward */}
            <button
              onClick={() => skip(10)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Skip forward 10 seconds"
            >
              <SkipForward className="h-5 w-5" />
            </button>

            {/* Volume */}
            <div className="flex items-center gap-2 group/volume">
              <button
                onClick={toggleMute}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>
              <div className="w-0 overflow-hidden group-hover/volume:w-20 transition-all duration-300">
                <Slider
                  value={[isMuted ? 0 : volume]}
                  min={0}
                  max={1}
                  step={0.01}
                  onValueChange={handleVolumeChange}
                  className="cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            <Maximize className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Big play button (when paused) */}
      {!isPlaying && !isBuffering && !error && (
        <button onClick={togglePlay} className="absolute inset-0 flex items-center justify-center" aria-label="Play">
          <div className="bg-black/50 rounded-full p-6">
            <Play className="h-12 w-12" />
          </div>
        </button>
      )}
    </div>
  )
}
