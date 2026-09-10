import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // Security Headers
  
  // Prevent clickjacking attacks
  response.headers.set("X-Frame-Options", "SAMEORIGIN")
  
  // Prevent MIME type sniffing
  response.headers.set("X-Content-Type-Options", "nosniff")
  
  // Enable XSS protection
  response.headers.set("X-XSS-Protection", "1; mode=block")
  
  // Control referrer information
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  
  // Permissions Policy (formerly Feature Policy)
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()"
  )
  
  // Content Security Policy (CSP)
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://challenges.cloudflare.com https://www.googletagmanager.com https://www.google-analytics.com https://pagead2.googlesyndication.com https://adservice.google.com https://googleads.g.doubleclick.net;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' data: blob: https: http:;
    font-src 'self' data: https://fonts.gstatic.com;
    connect-src 'self' https://challenges.cloudflare.com https://www.google-analytics.com https://res.cloudinary.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://*.google.com https://*.doubleclick.net;
    frame-src 'self' https://challenges.cloudflare.com https://googleads.g.doubleclick.net https://tpc.googlesyndication.com;
    child-src 'self' https://challenges.cloudflare.com https://googleads.g.doubleclick.net;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'self';
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim()
  
  response.headers.set("Content-Security-Policy", cspHeader)
  
  // CORS Headers for API routes
  const { pathname } = request.nextUrl
  if (pathname.startsWith("/api/")) {
    // Allow specific origins (adjust based on your needs)
    const origin = request.headers.get("origin")
    const allowedOrigins = [
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
      "http://localhost:3000",
      "http://localhost:3001"
    ]
    
    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set("Access-Control-Allow-Origin", origin)
    }
    
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")
    response.headers.set("Access-Control-Max-Age", "86400")
    
    // Handle preflight requests
    if (request.method === "OPTIONS") {
      return new NextResponse(null, { status: 200, headers: response.headers })
    }
  }
  
  // Admin route protection - redirect to login if no session cookie
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const sessionCookie = request.cookies.get("authjs.session-token") || 
                          request.cookies.get("__Secure-authjs.session-token")
    
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
