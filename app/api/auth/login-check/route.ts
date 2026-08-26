import { NextRequest, NextResponse } from "next/server"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"

// POST /api/auth/login-check - Check rate limit before login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: "Email required" },
        { status: 400 }
      )
    }

    // Check rate limit by email
    const rateLimit = await checkRateLimit(email, "login")

    if (!rateLimit.success) {
      const waitMinutes = Math.ceil((rateLimit.reset - Date.now()) / 1000 / 60)
      return NextResponse.json(
        {
          allowed: false,
          error: `Terlalu banyak percobaan login. Coba lagi dalam ${waitMinutes} menit`,
          remaining: rateLimit.remaining,
          reset: rateLimit.reset,
        },
        { status: 429 }
      )
    }

    return NextResponse.json({
      allowed: true,
      remaining: rateLimit.remaining,
      limit: rateLimit.limit,
    })
  } catch (error) {
    console.error("Login check error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
