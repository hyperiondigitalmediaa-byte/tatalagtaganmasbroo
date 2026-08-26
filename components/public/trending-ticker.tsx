"use client"

import Link from "next/link"
import { TrendingUp } from "lucide-react"

interface TrendingTickerProps {
  articles: Array<{
    slug: string
    title: string
    views: number
  }>
}

export function TrendingTicker({ articles }: TrendingTickerProps) {
  if (!articles || articles.length === 0) return null

  // Duplicate articles for seamless loop
  const duplicatedArticles = [...articles, ...articles]

  return (
    <div className="text-white py-2 overflow-hidden" style={{ backgroundColor: 'var(--color-primary)' }}>
      <div className="max-w-7xl mx-auto px-8 lg:px-16 xl:px-24 flex items-center gap-4">
        {/* Trending Label */}
        <div className="flex items-center gap-2 flex-shrink-0 font-bold text-sm uppercase tracking-wide">
          <TrendingUp className="h-4 w-4" />
          <span>Trending</span>
        </div>

        {/* Scrolling Text Container */}
        <div className="flex-1 overflow-hidden relative">
          <div className="flex animate-marquee hover:pause-marquee">
            {duplicatedArticles.map((article, index) => (
              <Link
                key={`${article.slug}-${index}`}
                href={`/${article.slug}`}
                className="flex items-center gap-2 whitespace-nowrap px-6 hover:text-yellow-300 transition-colors"
              >
                <span className="text-yellow-300">•</span>
                <span className="text-sm font-medium">{article.title}</span>
                <span className="text-xs text-white/70">({article.views.toLocaleString('id-ID')} views)</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
