"use client"

import dynamic from "next/dynamic"

const ArticleSliderDynamic = dynamic(
  () => import("@/components/public/article-slider").then(mod => ({ default: mod.ArticleSlider })),
  { 
    ssr: false,
    loading: () => (
      <div className="relative h-[400px] bg-gray-200 rounded-2xl animate-pulse flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    )
  }
)

interface Article {
  id: string
  slug: string
  title: string
  featuredImage: string | null
  publishedAt: string | Date | null
  category: {
    name: string
    slug: string
  }
}

interface ArticleSliderClientProps {
  articles: Article[]
}

export function ArticleSliderClient({ articles }: ArticleSliderClientProps) {
  return <ArticleSliderDynamic articles={articles} />
}
