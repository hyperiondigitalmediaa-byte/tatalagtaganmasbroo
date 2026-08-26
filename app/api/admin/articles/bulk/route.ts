import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { createAuditLog } from "@/lib/audit-log"

// POST /api/admin/articles/bulk - Bulk actions on articles
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { action, articleIds } = body

    if (!action || !articleIds || !Array.isArray(articleIds) || articleIds.length === 0) {
      return NextResponse.json(
        { error: "Invalid request. Provide action and articleIds array" },
        { status: 400 }
      )
    }

    let result

    switch (action) {
      case "publish":
        result = await prisma.article.updateMany({
          where: { id: { in: articleIds } },
          data: {
            status: "PUBLISHED",
            publishedAt: new Date()
          }
        })
        
        await createAuditLog({
          userId: (session.user as any).id,
          action: "PUBLISH_ARTICLE",
          resource: "article",
          details: { articleIds, count: result.count, bulkAction: true },
          status: "SUCCESS"
        })
        break

      case "draft":
        result = await prisma.article.updateMany({
          where: { id: { in: articleIds } },
          data: {
            status: "DRAFT",
            publishedAt: null
          }
        })
        
        await createAuditLog({
          userId: (session.user as any).id,
          action: "UPDATE_ARTICLE",
          resource: "article",
          details: { articleIds, count: result.count, bulkAction: true, newStatus: "DRAFT" },
          status: "SUCCESS"
        })
        break

      case "archive":
        result = await prisma.article.updateMany({
          where: { id: { in: articleIds } },
          data: { status: "ARCHIVED" }
        })
        
        await createAuditLog({
          userId: (session.user as any).id,
          action: "UPDATE_ARTICLE",
          resource: "article",
          details: { articleIds, count: result.count, bulkAction: true, newStatus: "ARCHIVED" },
          status: "SUCCESS"
        })
        break

      case "delete":
        // Get articles to extract images before deletion
        const articles = await prisma.article.findMany({
          where: { id: { in: articleIds } },
          select: { id: true, title: true }
        })

        result = await prisma.article.deleteMany({
          where: { id: { in: articleIds } }
        })
        
        await createAuditLog({
          userId: (session.user as any).id,
          action: "DELETE_ARTICLE",
          resource: "article",
          details: { articles, count: result.count, bulkAction: true },
          status: "SUCCESS"
        })
        break

      default:
        return NextResponse.json(
          { error: "Invalid action. Use: publish, draft, archive, or delete" },
          { status: 400 }
        )
    }

    return NextResponse.json({
      message: `Successfully ${action}ed ${result.count} article(s)`,
      count: result.count
    })
  } catch (error) {
    console.error("Error performing bulk action:", error)
    return NextResponse.json(
      { error: "Failed to perform bulk action" },
      { status: 500 }
    )
  }
}
