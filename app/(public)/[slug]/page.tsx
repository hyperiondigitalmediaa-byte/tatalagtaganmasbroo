import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { getCached, cacheKeys, CACHE_TTL } from "@/lib/cache"
import { Breadcrumb } from "@/components/public/breadcrumb"
import { ShareButtons } from "@/components/public/share-buttons"
import { BannerAd } from "@/components/public/banner-ad"
import { ArticleContentWithAds } from "@/components/public/article-content-with-ads"
import { DynamicSidebar } from "@/components/public/dynamic-sidebar"
import { CommentSection } from "@/components/public/comment-section"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

import { Eye, Clock } from "lucide-react"
import { calculateReadingTime, formatReadingTime } from "@/lib/reading-time"
import { ReadingProgress } from "@/components/reading-progress"

// ISR with revalidation - SEO friendly + fast
export const revalidate = 300 // Revalidate every 5 minutes (faster updates)
export const dynamicParams = true
export const dynamic = 'force-static' // Force static generation for speed

// Generate static params for popular articles (pre-generate for speed)
export async function generateStaticParams() {
  try {
    // Only generate top 50 most viewed articles at build time
    const articles = await prisma.article.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true },
      orderBy: { views: "desc" },
      take: 50
    })
    
    return articles.map((article) => ({
      slug: article.slug
    }))
  } catch (error) {
    // If database not available during build, return empty array
    console.log("Skipping static generation (database not available)")
    return []
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const article = await prisma.article.findUnique({
    where: { slug, status: "PUBLISHED" },
    include: {
      author: { select: { name: true } },
      category: { select: { name: true } },
    }
  })

  if (!article) {
    return {
      title: "Artikel Tidak Ditemukan",
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  const articleUrl = `${baseUrl}/${article.slug}`

  // SEO: Use custom values or fallback to defaults
  const seoTitle = article.metaTitle || article.title
  const seoDescription =
    article.metaDescription || article.excerpt || article.title
  const ogTitle = (article as any).ogTitle || article.metaTitle || article.title
  const ogDescription =
    (article as any).ogDescription ||
    article.metaDescription ||
    article.excerpt ||
    article.title
  const ogImage = (article as any).ogImage || article.featuredImage
  const canonicalUrl = (article as any).canonicalUrl || articleUrl

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: [
      article.category.name,
      (article as any).focusKeyword,
      ...article.title.split(" ").slice(0, 5),
    ]
      .filter(Boolean)
      .join(", "),
    authors: [{ name: article.author.name }],
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: articleUrl,
      siteName: "Portal Berita",
      images: ogImage
        ? [
            {
              url: ogImage,
              width: 1200,
              height: 630,
              alt: article.title,
            },
          ]
        : [],
      locale: "id_ID",
      type: "article",
      publishedTime: article.publishedAt?.toISOString(),
      modifiedTime: article.updatedAt.toISOString(),
      authors: [article.author.name],
      section: article.category.name,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: ogImage ? [ogImage] : [],
    },
    alternates: {
      canonical: canonicalUrl,
    },
  }
}

async function getArticle(slug: string) {
  // Use cache for article data
  const article = await getCached(
    cacheKeys.article(slug),
    async () => {
      const data = await prisma.article.findUnique({
        where: { slug, status: "PUBLISHED" },
        include: {
          author: {
            select: { name: true, email: true }
          },
          category: {
            select: { name: true, slug: true }
          },
          tags: {
            include: {
              tag: {
                select: { name: true, slug: true }
              }
            }
          }
        }
      })
      return data
    },
    CACHE_TTL.article
  )

  if (!article) {
    return null
  }

  // Increment view count (don't await to avoid blocking)
  prisma.article.update({
    where: { id: article.id },
    data: { views: { increment: 1 } }
  }).catch(err => console.error("View count error:", err))

  return article
}



async function getRelatedArticles(
  categoryId: string,
  currentArticleId: string
) {
  const articles = await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      categoryId,
      NOT: { id: currentArticleId },
    },
    select: {
      id: true,
      title: true,
      slug: true,
      featuredImage: true,
      content: true,
      views: true,
      showViews: true,
      author: { select: { name: true } },
      category: { select: { name: true, slug: true } },
    },
    orderBy: { publishedAt: "desc" },
    take: 3,
  })

  return articles
}

async function getDetailArticleBanners() {
  const banners = await prisma.banner.findMany({
    where: {
      isActive: true,
      position: "DETAIL_ARTIKEL"
    },
    orderBy: { order: "asc" }
  })

  return banners
}

// Removed generateStaticParams to avoid build-time database queries
// Pages will be generated on-demand and cached with ISR

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getArticle(slug)

  if (!article) {
    notFound()
  }

  const [relatedArticles, detailBanners] = await Promise.all([
    getRelatedArticles(article.categoryId, article.id),
    getDetailArticleBanners()
  ])
  
  const articleUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/${article.slug}`

  return (
    <>
      <ReadingProgress />
      <div className="min-h-screen bg-gray-50">
      {/* Main Content with Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 xl:px-24 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Main Article Content - 8 columns */}
          <article className="lg:col-span-8">
            {/* Breadcrumb */}
            <div className="mb-4 sm:mb-6">
              <Breadcrumb
                items={[
                  { label: article.category.name, href: `/kategori/${article.category.slug}` },
                  { label: article.title }
                ]}
              />
            </div>

            {/* Banner Atas (order 0) */}
            {detailBanners[0] && (
              <div className="mb-4 sm:mb-6">
                <BannerAd banner={detailBanners[0]} variant="horizontal" />
              </div>
            )}

            {/* Title */}
            <h1 className="article-title text-xl sm:text-2xl lg:text-4xl text-gray-900 mb-4 sm:mb-6 leading-tight">
              {article.title}
            </h1>

            {/* Meta Info with Author Avatar */}
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                <AvatarFallback
                  className="text-white text-xs sm:text-sm font-bold"
                  style={{ backgroundColor: "var(--color-primary)" }}
                >
                  {article.author.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="font-bold text-sm sm:text-base text-gray-900">
                  {article.author.name}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 flex flex-wrap items-center gap-2">
                  <span>
                    {article.publishedAt &&
                      new Date(article.publishedAt).toLocaleDateString(
                        "id-ID",
                        {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}{" "}
                    -{" "}
                    {article.publishedAt &&
                      new Date(article.publishedAt).toLocaleTimeString(
                        "id-ID",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}{" "}
                    WIB
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatReadingTime(calculateReadingTime(article.content))}
                  </span>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            {article.featuredImage && (
              <div className="mb-4 sm:mb-6">
                <div className="relative w-full h-[200px] sm:h-[300px] lg:h-[500px] bg-white rounded-sm shadow-sm overflow-hidden">
                  <Image
                    src={article.featuredImage}
                    alt={article.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            )}

            {/* Share Buttons */}
            <div className="mb-4 sm:mb-6">
              <ShareButtons url={articleUrl} title={article.title} />
            </div>

            {/* View Count Stats */}
            {article.showViews && (
              <div className="mb-6 sm:mb-8">
                <div className="flex items-center gap-1.5 text-gray-600 text-sm">
                  <Eye className="h-4 w-4" />
                  <span>{article.views.toLocaleString('id-ID')} Pembaca</span>
                </div>
              </div>
            )}

            {/* Banner Sebelum Konten (order 1) */}
            {detailBanners.filter(b => b.order === 1).map(banner => (
              <div key={banner.id} className="my-8">
                <BannerAd banner={banner} variant="horizontal" />
              </div>
            ))}

            {/* Content with In-Content Ads (order 100-199) */}
            <ArticleContentWithAds 
              content={article.content} 
              banners={detailBanners}
            />

            {/* Banner Setelah Konten (order 2) */}
            {detailBanners.filter(b => b.order === 2).map(banner => (
              <div key={banner.id} className="my-8">
                <BannerAd banner={banner} variant="horizontal" />
              </div>
            ))}

            {/* Tags */}
            {article.tags.length > 0 && (
              <div className="mt-8 sm:mt-10 lg:mt-12 pt-6 sm:pt-8 border-t border-gray-300">
                <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((articleTag) => (
                    <Link
                      key={articleTag.tag.slug}
                      href={`/tag/${articleTag.tag.slug}`}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white hover:bg-blue-600 hover:text-white rounded-full text-xs sm:text-sm font-medium transition-colors shadow-sm"
                    >
                      #{articleTag.tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Banner Bawah (order 3) */}
            {detailBanners[3] && (
              <div className="my-8">
                <BannerAd banner={detailBanners[3]} variant="horizontal" />
              </div>
            )}

            {/* Share Again */}
            <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-300">
              <ShareButtons url={articleUrl} title={article.title} />
            </div>

            {/* Comment Section */}
            <CommentSection articleId={article.id} />

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <div className="mt-6 sm:mt-8">
                <div className="border-l-4 pl-3 sm:pl-4 mb-4 sm:mb-6" style={{ borderColor: 'var(--color-primary)' }}>
                  <h2 className="sidebar-title text-xl sm:text-2xl text-gray-900">Baca Juga</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                  {relatedArticles.map((relatedArticle) => (
                    <Link
                      key={relatedArticle.id}
                      href={`/${relatedArticle.slug}`}
                      className="group bg-white rounded-sm shadow-sm overflow-hidden hover:shadow-lg transition-all border border-gray-100"
                    >
                      {relatedArticle.featuredImage && (
                        <div className="relative w-full h-40 sm:h-44 lg:h-48 overflow-hidden">
                          <Image
                            src={relatedArticle.featuredImage}
                            alt={relatedArticle.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="p-3 sm:p-4">
                        <Badge
                          className="mb-1.5 sm:mb-2 text-xs"
                          style={{ backgroundColor: "var(--color-primary)" }}
                        >
                          {relatedArticle.category.name}
                        </Badge>
                        <h3 className="popular-article-title text-sm sm:text-base text-gray-900 group-hover:opacity-80 transition-opacity line-clamp-2 mb-2">
                          {relatedArticle.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>
                            {formatReadingTime(
                              calculateReadingTime(relatedArticle.content)
                            )}
                          </span>
                          {relatedArticle.showViews && (
                            <>
                              <span>•</span>
                              <Eye className="h-3 w-3" />
                              <span>{relatedArticle.views.toLocaleString()}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Sidebar - 4 columns */}
          <div className="lg:col-span-4">
            <DynamicSidebar />
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
