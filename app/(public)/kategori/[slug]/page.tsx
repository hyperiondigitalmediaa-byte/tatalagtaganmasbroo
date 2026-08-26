import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { Breadcrumb } from "@/components/public/breadcrumb"
import { Badge } from "@/components/ui/badge"
import { Clock, Eye, Calendar, FolderOpen } from "lucide-react"
import { calculateReadingTime, formatReadingTime } from "@/lib/reading-time"
import { stripHtml } from "@/lib/strip-html"

// ISR for category pages
export const revalidate = 300 // Revalidate every 5 minutes
export const dynamicParams = true

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const category = await prisma.category.findUnique({
    where: { slug },
  })

  if (!category) {
    return {
      title: "Kategori Tidak Ditemukan",
    }
  }

  return {
    title: `${category.name} - Kategori Berita`,
    description:
      category.description ||
      `Baca artikel terbaru seputar ${category.name}`,
  }
}

async function getCategory(slug: string) {
  const category = await prisma.category.findUnique({
    where: { slug },
  })

  return category
}

async function getCategoryArticles(categoryId: string) {
  const articles = await prisma.article.findMany({
    where: {
      categoryId,
      status: "PUBLISHED",
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

  return articles
}

// Removed generateStaticParams to avoid build-time database queries
// Pages will be generated on-demand and cached with ISR

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const category = await getCategory(slug)

  if (!category) {
    notFound()
  }

  const articles = await getCategoryArticles(category.id)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 xl:px-24 py-6">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb items={[{ label: category.name }]} />
        </div>

        {/* Category Header */}
        <div className="mb-8 pb-6 border-b">
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              <FolderOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                {category.name}
              </h1>
              {category.description && (
                <p className="text-gray-600 mt-1">{category.description}</p>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-500">
            {articles.length} artikel ditemukan
          </p>
        </div>

        {/* Articles Grid */}
        {articles.length === 0 ? (
          <div className="text-center py-16">
            <FolderOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Belum Ada Artikel
            </h2>
            <p className="text-gray-600 mb-6">
              Kategori ini belum memiliki artikel yang dipublikasikan
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors"
              style={{
                backgroundColor: "var(--color-primary)",
                color: "white",
              }}
            >
              Kembali ke Beranda
            </Link>
          </div>
        ) : (
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
                          new Date(article.publishedAt).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                      </span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>
                        {formatReadingTime(
                          calculateReadingTime(article.content)
                        )}
                      </span>
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
        )}
      </div>
    </div>
  )
}
