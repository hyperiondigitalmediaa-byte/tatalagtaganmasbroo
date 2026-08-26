import { prisma } from "@/lib/prisma"
import { Pagination } from "@/components/public/pagination"
import { Badge } from "@/components/ui/badge"
import { DynamicSidebar } from "@/components/public/dynamic-sidebar"
import { Calendar } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// ISR for index page
export const revalidate = 300 // Revalidate every 5 minutes

const ARTICLES_PER_PAGE = 20

async function getIndexData(page: number = 1) {
  const [articles, totalCount] = await Promise.all([
    prisma.article.findMany({
      where: { status: "PUBLISHED" },
      include: {
        author: { select: { name: true } },
        category: { select: { name: true, slug: true } }
      },
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * ARTICLES_PER_PAGE,
      take: ARTICLES_PER_PAGE
    }),
    prisma.article.count({
      where: { status: "PUBLISHED" }
    })
  ])

  const totalPages = Math.ceil(totalCount / ARTICLES_PER_PAGE)

  return { articles, totalPages, totalCount }
}

interface PageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function IndexPage(props: PageProps) {
  const searchParams = await props.searchParams
  const currentPage = Number(searchParams?.page) || 1
  const { articles, totalPages, totalCount } = await getIndexData(currentPage)

  // Get sidebar data
  const [trendingArticles, sidebarBanners] = await Promise.all([
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

  // Serialize dates
  const serializedArticles = articles.map(article => ({
    ...article,
    publishedAt: article.publishedAt ? article.publishedAt.toISOString() : null
  }))

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 xl:px-24 pt-4 sm:pt-6 lg:pt-8 pb-8 sm:pb-10 lg:pb-12">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Indeks Berita</h1>
          <p className="text-sm sm:text-base text-gray-600">
            Menampilkan {totalCount.toLocaleString('id-ID')} berita terbaru • Halaman {currentPage} dari {totalPages}
          </p>
        </div>

        {/* Grid Layout: Articles + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
          {/* Left Column - Articles List (2 columns) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <div className="space-y-0">
            {serializedArticles.map((article: any) => (
              <div key={article.id} className="border-b border-gray-200 last:border-0">
              <Link
                href={`/${article.slug}`}
                className="group flex gap-3 sm:gap-4 py-4 sm:py-6 hover:bg-gray-50 transition-colors px-3 sm:px-4 -mx-3 sm:-mx-4 rounded-lg"
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
              </div>
            ))}
          </div>

              {/* Pagination */}
              <div className="mt-6 sm:mt-8">
                <Pagination currentPage={currentPage} totalPages={totalPages || 1} baseUrl="/indeks" />
              </div>
            </div>
          </div>

          {/* Right Column - Dynamic Sidebar (1 column) */}
          <div className="lg:col-span-1">
            <DynamicSidebar />
          </div>
        </div>
      </div>
    </div>
  )
}
