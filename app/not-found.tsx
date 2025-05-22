import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Film } from "lucide-react"

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <Film className="h-24 w-24 text-primary mb-6" />
      <h1 className="text-4xl font-bold tracking-tight mb-2">404 - Page Not Found</h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-md">
        The content you're looking for has gone missing. It might be on another streaming service.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button size="lg" asChild>
          <Link href="/">Return Home</Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link href="/movies">Browse Movies</Link>
        </Button>
      </div>
    </div>
  )
}
