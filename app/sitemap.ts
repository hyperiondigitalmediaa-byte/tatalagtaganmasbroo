import { MetadataRoute } from "next"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

  // Get all published articles
  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    select: {
      slug: true,
      updatedAt: true,
      publishedAt: true,
    },
    orderBy: { publishedAt: "desc" },
  })

  // Get all categories
  const categories = await prisma.category.findMany({
    select: {
      slug: true,
      updatedAt: true,
    },
  })

  // Get all pages
  const pages = await prisma.page.findMany({
    where: { isActive: true },
    select: {
      slug: true,
      updatedAt: true,
    },
  })

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
  ]

  // Article pages
  const articlePages = articles.map((article) => ({
    url: `${baseUrl}/${article.slug}`,
    lastModified: article.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  // Category pages
  const categoryPages = categories.map((category) => ({
    url: `${baseUrl}/kategori/${category.slug}`,
    lastModified: category.updatedAt,
    changeFrequency: "daily" as const,
    priority: 0.7,
  }))

  // Custom pages
  const customPages = pages.map((page) => ({
    url: `${baseUrl}/${page.slug}`,
    lastModified: page.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))

  return [...staticPages, ...articlePages, ...categoryPages, ...customPages]
}
