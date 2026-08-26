import { prisma } from "../lib/prisma"
import { Redis } from "@upstash/redis"
import { cacheKeys, CACHE_TTL } from "../lib/cache"

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

async function warmCache() {
  console.log("🔥 Warming up cache...")

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
    take: 50 // Warm up 50 most recent articles
  })

  console.log(`Found ${articles.length} articles to cache`)

  // Cache each article
  for (const article of articles) {
    const key = cacheKeys.article(article.slug)
    await redis.setex(key, CACHE_TTL.article, article)
    console.log(`✓ Cached: ${article.slug}`)
  }

  console.log("✅ Cache warmed up!")
  process.exit(0)
}

warmCache().catch((error) => {
  console.error("Error warming cache:", error)
  process.exit(1)
})
