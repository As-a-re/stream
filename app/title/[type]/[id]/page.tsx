import { Suspense } from "react"
import { notFound } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import RequireWallet from "@/components/RequireWallet"
import BuyOrWatch from "@/components/BuyOrWatch"
import type { Metadata } from "next"

interface TitlePageProps {
  params: {
    type: string
    id: string
  }
  searchParams: {
    auth_required?: string
  }
}

export async function generateMetadata({ params }: TitlePageProps): Promise<Metadata> {
  const { type, id } = params

  if (type !== "movie" && type !== "tv") {
    return {
      title: "Content Not Found - SuiStream",
    }
  }

  try {
    const content = await fetchContentDetails(type, Number.parseInt(id))

    return {
      title: `${content.title || content.name} - SuiStream`,
      description: content.overview,
      openGraph: {
        images: content.backdrop_path ? [`https://image.tmdb.org/t/p/w1280${content.backdrop_path}`] : undefined,
      },
    }
  } catch (error) {
    return {
      title: "Content Not Found - SuiStream",
    }
  }
}

export default async function TitlePage({ params }: TitlePageProps) {
  const { type, id } = params
  // Validate content type
  if (type !== "movie" && type !== "tv") {
    notFound()
  }

  // Construct m4uhd URL for this item (example pattern)
  const m4uhdUrl = `https://m4uhd.onl/${type}/${id}`;

  // The stream URL would be fetched by the BuyOrWatch component after ownership is verified

  return (
    <RequireWallet>
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="container px-4 mx-auto pt-20 pb-12">
          <BuyOrWatch
            movieId={m4uhdUrl}
            infoUrl={m4uhdUrl}
            streamUrl={m4uhdUrl} // This will be fetched/used by BuyOrWatch
          />
        </div>
        <Footer />
      </main>
    </RequireWallet>
  )
}

