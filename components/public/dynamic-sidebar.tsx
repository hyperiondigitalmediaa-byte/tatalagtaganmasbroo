import { prisma } from "@/lib/prisma"
import { SidebarClient } from "./sidebar-client"

async function getSidebarData() {
  const [widgets, settings, popularArticles, latestArticles, categories] = await Promise.all([
    // Get active widgets
    prisma.sidebarWidget.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" }
    }),

    // Get sidebar settings
    prisma.sidebarSettings.findFirst(),

    // Popular articles (for trending widget)
    prisma.article.findMany({
      where: { status: "PUBLISHED" },
      select: {
        id: true,
        slug: true,
        title: true,
        views: true,
        featuredImage: true
      },
      orderBy: { views: "desc" },
      take: 10
    }),

    // Latest articles
    prisma.article.findMany({
      where: { status: "PUBLISHED" },
      select: {
        id: true,
        slug: true,
        title: true,
        featuredImage: true,
        publishedAt: true
      },
      orderBy: { publishedAt: "desc" },
      take: 10
    }),

    // Popular categories
    prisma.category.findMany({
      where: {
        articles: {
          some: {
            status: "PUBLISHED"
          }
        }
      },
      include: {
        _count: {
          select: {
            articles: {
              where: {
                status: "PUBLISHED"
              }
            }
          }
        }
      },
      orderBy: {
        articles: {
          _count: "desc"
        }
      },
      take: 10
    })
  ])

  return {
    widgets,
    settings: settings || { isActive: true, isSticky: true },
    data: {
      popularArticles,
      latestArticles,
      categories
    }
  }
}

export async function DynamicSidebar() {
  const { widgets, settings, data } = await getSidebarData()

  // If sidebar is disabled, don't render
  if (!settings.isActive) {
    return null
  }

  return (
    <SidebarClient
      widgets={widgets}
      isSticky={settings.isSticky}
      data={data}
    />
  )
}
