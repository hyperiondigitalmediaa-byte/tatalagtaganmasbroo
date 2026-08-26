import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"

// GET /api/cron/publish-scheduled - Auto-publish scheduled articles
export async function GET(request: NextRequest) {
  try {
    // Rate limiting - prevent abuse
    const ip = getClientIp(request)
    const rateLimit = await checkRateLimit(ip, "api")
    
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      )
    }

    // Verify cron secret for security
    const authHeader = request.headers.get("authorization")
    const cronSecret = process.env.CRON_SECRET
    
    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const now = new Date()

    // Find all scheduled articles that should be published
    const scheduledArticles = await (prisma.article.findMany as any)({
      where: {
        status: "SCHEDULED",
        scheduledAt: {
          lte: now
        }
      },
      select: {
        id: true,
        title: true,
        scheduledAt: true
      }
    })

    if (scheduledArticles.length === 0) {
      return NextResponse.json({
        message: "No articles to publish",
        count: 0
      })
    }

    // Update all scheduled articles to published
    const result = await (prisma.article.updateMany as any)({
      where: {
        status: "SCHEDULED",
        scheduledAt: {
          lte: now
        }
      },
      data: {
        status: "PUBLISHED",
        publishedAt: now
      }
    })

    console.log(`✅ Published ${result.count} scheduled article(s)`)

    return NextResponse.json({
      message: `Successfully published ${result.count} article(s)`,
      count: result.count,
      articles: scheduledArticles
    })
  } catch (error) {
    console.error("Error publishing scheduled articles:", error)
    return NextResponse.json(
      { error: "Failed to publish scheduled articles" },
      { status: 500 }
    )
  }
}
