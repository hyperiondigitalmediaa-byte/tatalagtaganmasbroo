import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Redis } from "@upstash/redis"
import { cacheKeys, CACHE_TTL } from "@/lib/cache"

// Protect this endpoint with secret
const CRON_SECRET = process.env.CRON_SECRET

export async function GET(request: NextRequest) {
  // Verify secret
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })

    // Get all published articles
    const articles = await prisma.article.findMany({
      where: { status: "PUBLISHED" },
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
      },
      orderBy: { views: "desc" }, // Cache most viewed first
      take: 100 // Cache top 100 articles
    })

    // Cache each article
    const cached = []
    for (const article of articles) {
      const key = cacheKeys.article(article.slug)
      await redis.setex(key, CACHE_TTL.article, article)
      cached.push(article.slug)
    }

    return NextResponse.json({
      success: true,
      message: `Cached ${cached.length} articles`,
      articles: cached
    })
  } catch (error) {
    console.error("Warm cache error:", error)
    return NextResponse.json(
      { error: "Failed to warm cache" },
      { status: 500 }
    )
  }
}
