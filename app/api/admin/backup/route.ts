import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()

    // Only ADMIN can backup
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Export all data
    const [
      users,
      categories,
      tags,
      articles,
      articleTags,
      comments,
      commentReports,
      banners,
      menus,
      pages
    ] = await Promise.all([
      prisma.user.findMany(),
      prisma.category.findMany(),
      prisma.tag.findMany(),
      prisma.article.findMany(),
      prisma.articleTag.findMany(),
      prisma.comment.findMany(),
      prisma.commentReport.findMany(),
      prisma.banner.findMany(),
      prisma.menu.findMany(),
      prisma.page.findMany(),
    ])

    const backup = {
      version: "1.0",
      timestamp: new Date().toISOString(),
      data: {
        users,
        categories,
        tags,
        articles,
        articleTags,
        comments,
        commentReports,
        banners,
        menus,
        pages,
      }
    }

    // Return as downloadable JSON
    return new NextResponse(JSON.stringify(backup, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="backup-${Date.now()}.json"`,
      },
    })
  } catch (error) {
    console.error("Backup error:", error)
    return NextResponse.json(
      { error: "Failed to create backup" },
      { status: 500 }
    )
  }
}
