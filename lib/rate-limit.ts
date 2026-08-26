import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

// Create Redis client
const redis = process.env.UPSTASH_REDIS_REST_URL
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null

// Rate limiters for different endpoints
export const rateLimiters = {
  // Login attempts: 5 per 15 minutes
  login: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, "15 m"),
        analytics: true,
        prefix: "@ratelimit/login",
      })
    : null,

  // API calls: 100 per minute
  api: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(100, "1 m"),
        analytics: true,
        prefix: "@ratelimit/api",
      })
    : null,

  // Comment posting: 10 per hour
  comment: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10, "1 h"),
        analytics: true,
        prefix: "@ratelimit/comment",
      })
    : null,

  // File upload: 20 per hour
  upload: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(20, "1 h"),
        analytics: true,
        prefix: "@ratelimit/upload",
      })
    : null,

  // Admin actions: 200 per minute
  admin: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(200, "1 m"),
        analytics: true,
        prefix: "@ratelimit/admin",
      })
    : null,
}

// In-memory fallback for development (when Redis is not configured)
const inMemoryLimiter = new Map<string, { count: number; resetAt: number }>()

export async function checkRateLimit(
  identifier: string,
  type: keyof typeof rateLimiters
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  const limiter = rateLimiters[type]

  // If Redis is configured, use Upstash
  if (limiter) {
    const result = await limiter.limit(identifier)
    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
    }
  }

  // Fallback to in-memory limiter for development
  const limits: Record<string, { max: number; window: number }> = {
    login: { max: 5, window: 15 * 60 * 1000 },
    api: { max: 100, window: 60 * 1000 },
    comment: { max: 10, window: 60 * 60 * 1000 },
    upload: { max: 20, window: 60 * 60 * 1000 },
    admin: { max: 200, window: 60 * 1000 },
  }

  const config = limits[type]
  const key = `${type}:${identifier}`
  const now = Date.now()
  const entry = inMemoryLimiter.get(key)

  if (!entry || now > entry.resetAt) {
    inMemoryLimiter.set(key, {
      count: 1,
      resetAt: now + config.window,
    })
    return {
      success: true,
      limit: config.max,
      remaining: config.max - 1,
      reset: now + config.window,
    }
  }

  if (entry.count >= config.max) {
    return {
      success: false,
      limit: config.max,
      remaining: 0,
      reset: entry.resetAt,
    }
  }

  entry.count++
  return {
    success: true,
    limit: config.max,
    remaining: config.max - entry.count,
    reset: entry.resetAt,
  }
}

// Get client IP from request
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  const realIp = request.headers.get("x-real-ip")
  
  if (forwarded) {
    return forwarded.split(",")[0].trim()
  }
  
  if (realIp) {
    return realIp
  }
  
  return "unknown"
}
