import { prisma } from "@/lib/prisma"
import { getCached, cacheKeys, CACHE_TTL } from "@/lib/cache"
import { ArticleCard } from "@/components/public/article-card"
import { ArticleSlider } from "@/components/public/article-slider"
import { BannerAd } from "@/components/public/banner-ad"
import { DynamicSidebar } from "@/components/public/dynamic-sidebar"
import { Badge } from "@/components/ui/badge"
import { Eye, Calendar } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// ISR for homepage - balance between fresh content and speed
export const revalidate = 180 // Revalidate every 3 minutes
export const dynamic = 'force-static' // Static generation for speed

async function getHomeData() {
  // Use Redis cache for homepage data
  return getCached(
    cacheKeys.homepage(),
    async () => {
      // Optimized: Reduce queries and data fetching
      const [latestArticles, trendingArticles, categories, banners, sidebarBanners] = await Promise.all([
    // Latest Articles - reduced from 50 to 35 (actual need: 6 + 3 + 3 + 3 + 20 = 35)
    prisma.article.findMany({
      where: { status: "PUBLISHED" },
      select: {
        id: true,
        slug: true,
        title: true,
        featuredImage: true,
        publishedAt: true,
        views: true,
        category: { select: { name: true, slug: true } }
      },
      orderBy: { publishedAt: "desc" },
      take: 35
    }),

    // Trending Articles
    prisma.article.findMany({
      where: { status: "PUBLISHED" },
      select: {
        id: true,
        slug: true,
        title: true,
        views: true
      },
      orderBy: { views: "desc" },
      take: 6
    }),

    // Categories with PUBLISHED article count only
    prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        _count: {
          select: {
            articles: {
              where: { status: "PUBLISHED" }
            }
          }
        }
      },
      orderBy: { name: "asc" }
    }),

    // Active banners for article list
    prisma.banner.findMany({
      where: {
        isActive: true,
        position: "ARTICLE_LIST"
      },
      select: {
        id: true,
        title: true,
        type: true,
        imageUrl: true,
        adCode: true,
        linkUrl: true
      },
      orderBy: { order: "asc" },
      take: 2 // Max 2 banners in article list
    }),

    // Active banners for sidebar
    prisma.banner.findMany({
      where: {
        isActive: true,
        position: "SIDEBAR"
      },
      select: {
        id: true,
        title: true,
        type: true,
        imageUrl: true,
        adCode: true,
        linkUrl: true
      },
      orderBy: { order: "asc" }
    })
  ])

  // Reuse latestArticles for slider (first 5)
  const sliderArticles = latestArticles.slice(0, 5)

  // Sort categories by article count
  const sortedCategories = [...categories]
    .filter(cat => cat._count.articles > 0)
    .sort((a, b) => b._count.articles - a._count.articles)

  // Get top 3 categories with their articles
  const categorySections = await Promise.all(
    sortedCategories.slice(0, 3).map(async (category) => {
      const articles = await prisma.article.findMany({
        where: {
          status: "PUBLISHED",
          categoryId: category.id
        },
        select: {
          id: true,
          slug: true,
          title: true,
          featuredImage: true,
          publishedAt: true,
          categoryId: true,
          category: { select: { name: true, slug: true } }
        },
        orderBy: { publishedAt: "desc" },
        take: 3
      })
      return { category, articles }
    })
  )

      return {
        latestArticles,
        trendingArticles,
        categories,
        sliderArticles,
        categorySections,
        banners,
        sidebarBanners
      }
    },
    CACHE_TTL.homepage
  )
}

export default async function HomePage() {
  const { latestArticles, trendingArticles, categories, sliderArticles, categorySections, banners, sidebarBanners } = await getHomeData()

  // Helper function to serialize dates and ensure consistent data
  const serializeArticle = (article: any) => ({
    id: article.id,
    slug: article.slug,
    title: article.title,
    featuredImage: article.featuredImage,
    publishedAt: article.publishedAt ? new Date(article.publishedAt).toISOString() : null,
    views: article.views || 0,
    category: article.category,
    author: article.author
  })

  // Serialize all dates to avoid hydration mismatch
  const serializedSliderArticles = sliderArticles.map(serializeArticle)
  const serializedLatestArticles = latestArticles.map(serializeArticle)
  const serializedTrendingArticles = trendingArticles.map(serializeArticle)
  const serializedCategorySections = categorySections.map((section: any) => ({
    ...section,
    articles: section.articles.map(serializeArticle)
  }))

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 xl:px-24 pt-4 sm:pt-6 lg:pt-8">
        {/* Single Grid Container for Hero + Berita Terkini + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
          {/* Left Column - Hero Slider + Berita Terkini (2 columns) */}
          <div className="lg:col-span-2 space-y-6 lg:space-y-8">
            {/* Hero Slider */}
            <ArticleSlider articles={serializedSliderArticles} />

            {/* Berita Terkini */}
            <div>
              {/* Section Header */}
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Berita Terkini</h2>
                <Link href="/index" className="text-xs sm:text-sm font-semibold whitespace-nowrap transition-opacity hover:opacity-80" style={{ color: 'var(--color-primary)' }}>
                  INDEKS →
                </Link>
              </div>
              {/* Articles List - First 6 with Banner */}
              <div className="space-y-4 sm:space-y-6">
                {serializedLatestArticles.slice(0, 6).map((article: any, index: number) => (
                  <div key={article.id}>
                    {/* Article */}
                    <Link
                      href={`/${article.slug}`}
                      className="group flex gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      {/* Image */}
                      <div className="relative w-24 h-24 sm:w-40 sm:h-28 lg:w-56 lg:h-36 flex-shrink-0 overflow-hidden rounded-sm">
                        {article.featuredImage ? (
                          <Image
                            src={article.featuredImage}
                            alt={article.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-500" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 py-1 sm:py-2">
                        <Badge className="mb-1 sm:mb-2 text-xs px-2 sm:px-3 py-0.5 sm:py-1" style={{ backgroundColor: 'var(--color-primary)' }}>
                          {article.category.name}
                        </Badge>
                        <h3 className="text-sm sm:text-base lg:text-xl font-bold text-gray-900 group-hover:opacity-80 transition-opacity line-clamp-2 sm:line-clamp-2 mb-2 sm:mb-3 leading-tight">
                          {article.title}
                        </h3>
                        <div className="hidden sm:flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span suppressHydrationWarning className="text-xs">
                            {article.publishedAt && new Date(article.publishedAt).toLocaleDateString('id-ID', {
                              weekday: 'short',
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })} - {article.publishedAt && new Date(article.publishedAt).toLocaleTimeString('id-ID', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })} WIB
                          </span>
                        </div>
                      </div>

                      {/* Arrow Icon */}
                      <div className="hidden sm:flex flex-shrink-0 items-center">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center transition-colors">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </Link>

                    {/* Banner after 3rd article */}
                    {index === 2 && banners[0] && (
                      <div className="my-6">
                        <BannerAd banner={banners[0]} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Category Grid Sections with Berita Terkini in between */}
            {serializedCategorySections.map((section: any, sectionIndex: number) => {
              // Only show 3 articles after category 1 and 2, not after category 3
              const shouldShow3Articles = sectionIndex < 2 // Only for index 0 and 1 (category 1 and 2)
              const startArticleIndex = 6 + (sectionIndex * 3)
              const endArticleIndex = startArticleIndex + 3
              const articlesForThisSection = shouldShow3Articles
                ? serializedLatestArticles.slice(startArticleIndex, endArticleIndex)
                : []

              return section.articles.length > 0 ? (
                <div key={section.category.id}>
                  {/* Category Section */}
                  <div className="mt-8 sm:mt-10 lg:mt-12">
                    {/* Section Header */}
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{section.category.name}</h2>
                      <Link
                        href={`/kategori/${section.category.slug}`}
                        className="text-xs sm:text-sm font-semibold uppercase whitespace-nowrap transition-opacity hover:opacity-80"
                        style={{ color: 'var(--color-primary)' }}
                      >
                        INDEKS →
                      </Link>
                    </div>

                    {/* Articles Grid - 3 Columns */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                      {section.articles.map((article: any) => (
                        <Link
                          key={article.id}
                          href={`/${article.slug}`}
                          className="group"
                        >
                          {/* Image */}
                          <div className="relative w-full h-40 sm:h-44 lg:h-48 overflow-hidden rounded-sm mb-3 sm:mb-4">
                            {article.featuredImage ? (
                              <Image
                                src={article.featuredImage}
                                alt={article.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-500" />
                            )}
                          </div>

                          {/* Content */}
                          <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:opacity-80 transition-opacity line-clamp-2 mb-2">
                            {article.title}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Calendar className="h-3 w-3" />
                            <span suppressHydrationWarning>
                              {article.publishedAt && new Date(article.publishedAt).toLocaleDateString('id-ID', {
                                weekday: 'short',
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Berita Terkini - 3 Articles after category 1 and 2 only */}
                  {shouldShow3Articles && articlesForThisSection.length > 0 && (
                    <div className="mt-8 sm:mt-10 lg:mt-12">
                      <div className="space-y-4 sm:space-y-6">
                        {articlesForThisSection.map((article: any) => (
                          <Link
                            key={article.id}
                            href={`/${article.slug}`}
                            className="group flex gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-gray-200 hover:bg-gray-50 transition-colors"
                          >
                            {/* Image */}
                            <div className="relative w-24 h-24 sm:w-40 sm:h-28 lg:w-56 lg:h-36 flex-shrink-0 overflow-hidden rounded-lg sm:rounded-xl">
                              {article.featuredImage ? (
                                <Image
                                  src={article.featuredImage}
                                  alt={article.title}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-500" />
                              )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0 py-1 sm:py-2">
                              <Badge className="mb-1 sm:mb-2 text-xs px-2 sm:px-3 py-0.5 sm:py-1" style={{ backgroundColor: 'var(--color-primary)' }}>
                                {article.category.name}
                              </Badge>
                              <h3 className="text-sm sm:text-base lg:text-xl font-bold text-gray-900 group-hover:opacity-80 transition-opacity line-clamp-2 mb-2 sm:mb-3 leading-tight">
                                {article.title}
                              </h3>
                              <div className="hidden sm:flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                                <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                                <span suppressHydrationWarning className="text-xs">
                                  {article.publishedAt && new Date(article.publishedAt).toLocaleDateString('id-ID', {
                                    weekday: 'short',
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                  })} - {article.publishedAt && new Date(article.publishedAt).toLocaleTimeString('id-ID', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })} WIB
                                </span>
                              </div>
                            </div>

                            {/* Arrow Icon */}
                            <div className="hidden sm:flex flex-shrink-0 items-center">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center transition-colors">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Banner after Category 1 */}
                  {sectionIndex === 0 && banners[1] && (
                    <div className="mt-12">
                      <BannerAd banner={banners[1]} />
                    </div>
                  )}
                </div>
              ) : null
            })}

            {/* 20 Articles after 3 category sections */}
            {(() => {
              // After 6 initial + (2 categories * 3 articles) = 6 + 6 = 12
              // Category 3 doesn't have 3 articles after it, so we start from index 12
              const startIndex = 12
              const endIndex = startIndex + 20
              const next20Articles = serializedLatestArticles.slice(startIndex, endIndex)

              return next20Articles.length > 0 && (
                <div className="mt-8 sm:mt-10 lg:mt-12">
                  <div className="space-y-4 sm:space-y-6">
                    {next20Articles.map((article: any) => (
                      <Link
                        key={article.id}
                        href={`/${article.slug}`}
                        className="group flex gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        {/* Image */}
                        <div className="relative w-24 h-24 sm:w-40 sm:h-28 lg:w-56 lg:h-36 flex-shrink-0 overflow-hidden rounded-lg sm:rounded-xl">
                          {article.featuredImage ? (
                            <Image
                              src={article.featuredImage}
                              alt={article.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-500" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 py-1 sm:py-2">
                          <Badge className="mb-1 sm:mb-2 text-xs px-2 sm:px-3 py-0.5 sm:py-1" style={{ backgroundColor: 'var(--color-primary)' }}>
                            {article.category.name}
                          </Badge>
                          <h3 className="text-sm sm:text-base lg:text-xl font-bold text-gray-900 group-hover:opacity-80 transition-opacity line-clamp-2 mb-2 sm:mb-3 leading-tight">
                            {article.title}
                          </h3>
                          <div className="hidden sm:flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span suppressHydrationWarning className="text-xs">
                              {article.publishedAt && new Date(article.publishedAt).toLocaleDateString('id-ID', {
                                weekday: 'short',
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })} - {article.publishedAt && new Date(article.publishedAt).toLocaleTimeString('id-ID', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })} WIB
                            </span>
                          </div>
                        </div>

                        {/* Arrow Icon */}
                        <div className="hidden sm:flex flex-shrink-0 items-center">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center transition-colors">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )
            })()}

          </div>

          {/* Right Column - Dynamic Sidebar (1 column) */}
          <div className="lg:col-span-1">
            <DynamicSidebar />
          </div>
        </div>

        {/* Indeks Berita Button */}
        <div className="mt-8 sm:mt-10 lg:mt-12 mb-10 sm:mb-12 lg:mb-16 flex justify-center">
          <Link
            href="/indeks"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 text-white text-sm sm:text-base font-semibold rounded-full shadow-md hover:shadow-lg transition-all hover:opacity-90"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            INDEKS BERITA
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}
