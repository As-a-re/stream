import { Skeleton } from "@/components/ui/skeleton"

export default function HelpLoading() {
  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="text-center max-w-3xl mx-auto">
        <Skeleton className="h-10 w-64 mx-auto" />
        <Skeleton className="h-6 w-96 mx-auto mt-4" />
      </div>

      <div className="max-w-2xl mx-auto">
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="max-w-4xl mx-auto">
        <Skeleton className="h-10 w-full mb-6" />

        <div className="space-y-4">
          {Array(6)
            .fill(null)
            .map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
