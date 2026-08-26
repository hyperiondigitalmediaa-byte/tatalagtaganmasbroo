import { Redis } from "@upstash/redis"

// Initialize Redis client (optional - only if env vars exist)
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null

// Cache TTL (Time To Live) in seconds
const CACHE_TTL = {
  article: 3600, // 1 hour (lebih lama = lebih jarang query DB)
  homepage: 60, // 1 minute (lebih cepat untuk homepage)
  category: 1800, // 30 minutes
  sidebar: 3600, // 1 hour
}

/**
 * Get cached data or fetch from database
 */
export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 300
): Promise<T> {
  // If Redis not configured, just fetch from database
  if (!redis) {
    return fetcher()
  }

  try {
    // Try to get from cache
    const cached = await redis.get<T>(key)
    if (cached) {
      console.log(`Cache HIT: ${key}`)
      return cached
    }

    // Cache miss - fetch from database
    console.log(`Cache MISS: ${key}`)
    const data = await fetcher()

    // Store in cache (fire and forget)
    redis.setex(key, ttl, data).catch((err) => {
      console.error("Cache set error:", err)
    })

    return data
  } catch (error) {
    console.error("Cache error:", error)
    // Fallback to database if cache fails
    return fetcher()
  }
}

/**
 * Invalidate cache by key or pattern
 */
export async function invalidateCache(keyOrPattern: string) {
  if (!redis) return

  try {
    // If it's a pattern (contains *), delete all matching keys
    if (keyOrPattern.includes("*")) {
      const keys = await redis.keys(keyOrPattern)
      if (keys.length > 0) {
        await redis.del(...keys)
        console.log(`Invalidated ${keys.length} cache keys matching: ${keyOrPattern}`)
      }
    } else {
      // Delete single key
      await redis.del(keyOrPattern)
      console.log(`Invalidated cache: ${keyOrPattern}`)
    }
  } catch (error) {
    console.error("Cache invalidation error:", error)
  }
}

/**
 * Cache key generators
 */
export const cacheKeys = {
  article: (slug: string) => `article:${slug}`,
  articleList: (page: number = 1) => `articles:list:${page}`,
  category: (slug: string) => `category:${slug}`,
  categoryArticles: (slug: string, page: number = 1) => `category:${slug}:articles:${page}`,
  homepage: () => "homepage:data",
  sidebar: () => "sidebar:widgets",
  trending: () => "articles:trending",
}

export { CACHE_TTL }
