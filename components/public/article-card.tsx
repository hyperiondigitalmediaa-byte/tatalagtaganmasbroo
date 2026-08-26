import Link from "next/link"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { id as idLocale } from "date-fns/locale"
import { Eye, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ArticleCardProps {
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
  featured?: boolean
}

export function ArticleCard({ article, featured = false }: ArticleCardProps) {
  const readingTime = Math.ceil((article.excerpt?.length || 0) / 200)
  
  // Strip HTML tags from excerpt
  const cleanExcerpt = article.excerpt?.replace(/<[^>]*>/g, '').trim() || ''

  if (featured) {
    return (
      <Link
        href={`/${article.slug}`}
        className="group block relative overflow-hidden rounded-sm shadow-lg hover:shadow-2xl transition-all duration-300"
      >
        {/* Image */}
        <div className="relative h-[500px] w-full">
          {article.featuredImage ? (
            <Image
              src={article.featuredImage}
              alt={article.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <Badge className="mb-3" style={{ backgroundColor: 'var(--color-primary)' }}>
            {article.category.name}
          </Badge>
          <h2 className="text-3xl font-bold mb-3 line-clamp-2 transition-colors">
            {article.title}
          </h2>
          {cleanExcerpt && (
            <p className="text-gray-200 mb-4 line-clamp-2">
              {cleanExcerpt}
            </p>
          )}
          <div className="flex items-center gap-4 text-sm text-gray-300">
            <span>{article.author.name}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {article.publishedAt && formatDistanceToNow(new Date(article.publishedAt), {
                addSuffix: true,
                locale: idLocale,
              })}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {article.views}
            </span>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={`/${article.slug}`}
      className="group block bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
    >
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden">
        {article.featuredImage ? (
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500" />
        )}
        <Badge className="absolute top-3 left-3" style={{ backgroundColor: 'var(--color-primary)' }}>
          {article.category.name}
        </Badge>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:opacity-80 transition-opacity">
          {article.title}
        </h3>
        {cleanExcerpt && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {cleanExcerpt}
          </p>
        )}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-700">{article.author.name}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {readingTime} min
            </span>
          </div>
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {article.views}
          </span>
        </div>
      </div>
    </Link>
  )
}
