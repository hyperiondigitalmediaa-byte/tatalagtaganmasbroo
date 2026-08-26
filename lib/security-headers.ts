export function getSecurityHeaders() {
  return {
    // Prevent clickjacking
    "X-Frame-Options": "SAMEORIGIN",
    
    // Prevent MIME type sniffing
    "X-Content-Type-Options": "nosniff",
    
    // Enable XSS protection
    "X-XSS-Protection": "1; mode=block",
    
    // Referrer policy
    "Referrer-Policy": "strict-origin-when-cross-origin",
    
    // Permissions policy
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    
    // Content Security Policy
    "Content-Security-Policy": [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https: blob:",
      "font-src 'self' data:",
      "connect-src 'self' https://www.google-analytics.com https://res.cloudinary.com",
      "frame-src 'self' https://www.youtube.com",
      "media-src 'self' https:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
      "upgrade-insecure-requests",
    ].join("; "),
    
    // HSTS - Force HTTPS (only in production)
    ...(process.env.NODE_ENV === "production" && {
      "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
    }),
  }
}

export function applySecurityHeaders(headers: Headers) {
  const securityHeaders = getSecurityHeaders()
  
  Object.entries(securityHeaders).forEach(([key, value]) => {
    headers.set(key, value)
  })
  
  return headers
}
