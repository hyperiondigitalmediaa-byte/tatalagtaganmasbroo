import { Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { Search, Clock, Eye, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { calculateReadingTime, formatReadingTime } from "@/lib/reading-time"
import { stripHtml } from "@/lib/strip-html"

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "Pencarian Artikel",
  description: "Cari artikel berita terkini",
}

async function searchArticles(query: string) {
  if (!query || query.trim().length < 2) {
    return []
  }

  const searchTerm = query.trim()

  const articles = await prisma.article.findMany({
    where: {
      status: "PUBLISHED" as any,
      OR: [
        {
          title: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          excerpt: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
      ],
    },
    include: {
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
      author: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      publishedAt: "desc",
    },
    take: 50,
  })

  console.log(`🔍 Search query: "${searchTerm}" - Found: ${articles.length} articles`)

  return articles
}

async function SearchResultsContent({ query }: { query: string }) {
  const articles = await searchArticles(query)

  if (!query || query.trim().length < 2) {
    return (
      <div className="text-center py-16">
        <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Cari Artikel
        </h2>
        <p className="text-gray-600">
          Masukkan kata kunci minimal 2 karakter untuk mencari artikel
        </p>
      </div>
    )
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-16">
        <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Tidak Ada Hasil
        </h2>
        <p className="text-gray-600 mb-6">
          Tidak ditemukan artikel untuk kata kunci &quot;{query}&quot;
        </p>
        <p className="text-sm text-gray-500">
          Tips: Coba kata kunci lain atau lebih umum
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Search Info */}
      <div className="mb-8 pb-6 border-b">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Hasil Pencarian
        </h1>
        <p className="text-gray-600">
          Ditemukan <span className="font-semibold">{articles.length}</span>{" "}
          artikel untuk &quot;{query}&quot;
        </p>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/${article.slug}`}
            className="group bg-white rounded-sm shadow-sm hover:shadow-lg transition-all border border-gray-100 overflow-hidden"
          >
            {/* Featured Image */}
            {article.featuredImage && (
              <div className="relative w-full h-48 overflow-hidden bg-gray-100">
                <Image
                  src={article.featuredImage}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            )}

            <div className="p-4">
              {/* Category Badge */}
              <Badge
                className="mb-2"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                {article.category.name}
              </Badge>

              {/* Title */}
              <h2 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                {article.title}
              </h2>

              {/* Excerpt */}
              {article.excerpt && (
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                  {stripHtml(article.excerpt, 150)}
                </p>
              )}

              {/* Meta Info */}
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {article.publishedAt &&
                      new Date(article.publishedAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                  </span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatReadingTime(calculateReadingTime(article.content))}</span>
                </div>
                {article.showViews && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      <span>{article.views.toLocaleString()}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const params = await searchParams
  const query = params.q || ""

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 xl:px-24 py-8">
        <Suspense
          fallback={
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4 text-gray-600">Mencari...</p>
            </div>
          }
        >
          <SearchResultsContent query={query} />
        </Suspense>
      </div>
    </div>
  )
}
