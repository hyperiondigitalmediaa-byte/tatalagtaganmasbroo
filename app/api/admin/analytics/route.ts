import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()

    // Allow ADMIN and EDITOR to access analytics
    const userRole = (session?.user as any)?.role
    
    if (!session?.user || (userRole !== "ADMIN" && userRole !== "EDITOR")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get date 7 days ago
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    // Total statistics
    const [
      totalArticles,
      publishedArticles,
      totalViews,
      totalComments,
      totalUsers,
      recentArticles,
    ] = await Promise.all([
      prisma.article.count(),
      prisma.article.count({ where: { status: "PUBLISHED" } }),
      prisma.article.aggregate({ _sum: { views: true } }),
      prisma.comment.count({ where: { status: "APPROVED" } }),
      prisma.user.count(),
      prisma.article.count({
        where: {
          createdAt: { gte: sevenDaysAgo },
        },
      }),
    ])

    // Top 5 most viewed articles
    const topArticles = await prisma.article.findMany({
      take: 5,
      orderBy: { views: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        views: true,
        publishedAt: true,
        category: {
          select: { name: true },
        },
      },
      where: { status: "PUBLISHED" },
    })

    // Articles by category
    const articlesByCategory = await prisma.category.findMany({
      select: {
        name: true,
        _count: {
          select: { articles: true },
        },
      },
      orderBy: {
        articles: {
          _count: "desc",
        },
      },
      take: 5,
    })

    // Views by day (last 7 days)
    const viewsByDay = await prisma.$queryRaw<
      Array<{ date: Date; views: number }>
    >`
      SELECT 
        DATE(a."publishedAt") as date,
        SUM(a.views) as views
      FROM "Article" a
      WHERE a."publishedAt" >= ${sevenDaysAgo}
        AND a.status = 'PUBLISHED'
      GROUP BY DATE(a."publishedAt")
      ORDER BY date ASC
    `

    // Recent comments
    const recentComments = await prisma.comment.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        content: true,
        createdAt: true,
        user: {
          select: { name: true },
        },
        article: {
          select: { title: true, slug: true },
        },
      },
      where: { status: "APPROVED" },
    })

    // Article status breakdown
    const articlesByStatus = await prisma.article.groupBy({
      by: ["status"],
      _count: true,
    })

    return NextResponse.json({
      overview: {
        totalArticles,
        publishedArticles,
        totalViews: totalViews._sum.views || 0,
        totalComments,
        totalUsers,
        recentArticles,
      },
      topArticles,
      articlesByCategory: articlesByCategory.map((cat) => ({
        name: cat.name,
        count: cat._count.articles,
      })),
      viewsByDay: viewsByDay.map((day) => ({
        date: day.date.toISOString().split("T")[0],
        views: Number(day.views),
      })),
      recentComments,
      articlesByStatus: articlesByStatus.map((item) => ({
        status: item.status,
        count: item._count,
      })),
    })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    )
  }
}
