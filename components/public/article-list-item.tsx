import Link from "next/link"
import Image from "next/image"
import { Calendar, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ArticleListItemProps {
  article: {
    slug: string
    title: string
    excerpt: string | null
    featuredImage: string | null
    publishedAt: Date | null
    views: number
    category: {
      name: string
      slug: string
    }
    author: {
      name: string
    }
  }
}

export function ArticleListItem({ article }: ArticleListItemProps) {
  // Strip HTML tags from excerpt
  const cleanExcerpt = article.excerpt?.replace(/<[^>]*>/g, '').trim() || ''

  return (
    <Link
      href={`/${article.slug}`}
      className="group flex gap-4 py-4 border-b border-gray-200 hover:bg-gray-50 transition-colors"
    >
      {/* Image - Left Side */}
      <div className="relative w-56 h-36 flex-shrink-0 overflow-hidden rounded-sm">
        {article.featuredImage ? (
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500" />
        )}
        {/* Category Badge on Image */}
        <Badge className="absolute top-3 left-3 text-xs px-3 py-1" style={{ backgroundColor: 'var(--color-primary)' }}>
          {article.category.name}
        </Badge>
      </div>

      {/* Content - Right Side */}
      <div className="flex-1 min-w-0 py-2">
        <h3 className="text-xl font-bold text-gray-900 group-hover:opacity-80 transition-opacity line-clamp-2 mb-3 leading-tight">
          {article.title}
        </h3>
        
        {/* Meta Info */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          <span>
            {article.publishedAt && new Date(article.publishedAt).toLocaleDateString('id-ID', {
              weekday: 'short',
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })} - {article.publishedAt && new Date(article.publishedAt).toLocaleTimeString('id-ID', {
              hour: '2-digit',
              minute: '2-digit'
            })} Wib
          </span>
        </div>
      </div>

      {/* Arrow Icon */}
      <div className="flex-shrink-0 flex items-center">
        <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center transition-colors">
          <svg className="w-5 h-5 text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  )
}
