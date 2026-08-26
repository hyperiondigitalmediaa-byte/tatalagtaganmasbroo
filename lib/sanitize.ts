import DOMPurify from "isomorphic-dompurify"
import validator from "validator"

// Sanitize HTML content (for rich text editor)
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "p",
      "br",
      "strong",
      "em",
      "u",
      "s",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "ul",
      "ol",
      "li",
      "blockquote",
      "a",
      "img",
      "code",
      "pre",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
      "div",
      "span",
    ],
    ALLOWED_ATTR: [
      "href",
      "src",
      "alt",
      "title",
      "class",
      "id",
      "target",
      "rel",
      "width",
      "height",
    ],
    ALLOW_DATA_ATTR: false,
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
  })
}

// Sanitize plain text (for comments, titles, etc)
export function sanitizeText(text: string): string {
  return validator.escape(text.trim())
}

// Validate and sanitize email
export function sanitizeEmail(email: string): string | null {
  const trimmed = email.trim().toLowerCase()
  if (!validator.isEmail(trimmed)) {
    return null
  }
  return validator.normalizeEmail(trimmed) || trimmed
}

// Validate and sanitize URL
export function sanitizeUrl(url: string): string | null {
  const trimmed = url.trim()
  if (!validator.isURL(trimmed, { require_protocol: true })) {
    return null
  }
  return trimmed
}

// Sanitize slug (for URLs)
export function sanitizeSlug(slug: string): string {
  return slug
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special chars
    .replace(/[\s_-]+/g, "-") // Replace spaces/underscores with hyphens
    .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
}

// Validate file upload
export function validateFile(
  file: File,
  options: {
    maxSize?: number // in bytes
    allowedTypes?: string[]
    allowedExtensions?: string[]
  } = {}
): { valid: boolean; error?: string } {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"],
    allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"],
  } = options

  // Check file size
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File terlalu besar. Maksimal ${maxSize / 1024 / 1024}MB`,
    }
  }

  // Check MIME type
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Tipe file tidak diizinkan. Hanya: ${allowedTypes.join(", ")}`,
    }
  }

  // Check file extension
  const extension = file.name.toLowerCase().substring(file.name.lastIndexOf("."))
  if (!allowedExtensions.includes(extension)) {
    return {
      valid: false,
      error: `Ekstensi file tidak diizinkan. Hanya: ${allowedExtensions.join(", ")}`,
    }
  }

  return { valid: true }
}

// Remove potentially dangerous characters from filename
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, "_") // Replace special chars with underscore
    .replace(/_{2,}/g, "_") // Replace multiple underscores with single
    .substring(0, 255) // Limit length
}

// Validate and sanitize phone number
export function sanitizePhone(phone: string): string | null {
  const cleaned = phone.replace(/\D/g, "")
  if (cleaned.length < 10 || cleaned.length > 15) {
    return null
  }
  return cleaned
}

// Check for SQL injection patterns (additional layer)
export function containsSqlInjection(input: string): boolean {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/gi,
    /(UNION.*SELECT)/gi,
    /(--|\#|\/\*|\*\/)/g,
    /(\bOR\b.*=.*)/gi,
    /(\bAND\b.*=.*)/gi,
  ]

  return sqlPatterns.some((pattern) => pattern.test(input))
}

// Check for XSS patterns
export function containsXss(input: string): boolean {
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi, // onclick, onload, etc
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
  ]

  return xssPatterns.some((pattern) => pattern.test(input))
}

// Comprehensive input validation
export function validateInput(
  input: string,
  type: "text" | "html" | "email" | "url" | "slug" = "text"
): { valid: boolean; sanitized?: string; error?: string } {
  if (!input || typeof input !== "string") {
    return { valid: false, error: "Input tidak valid" }
  }

  // Check for SQL injection
  if (containsSqlInjection(input)) {
    return { valid: false, error: "Input mengandung karakter berbahaya" }
  }

  // Check for XSS (except for HTML type which will be sanitized)
  if (type !== "html" && containsXss(input)) {
    return { valid: false, error: "Input mengandung karakter berbahaya" }
  }

  // Sanitize based on type
  let sanitized: string | null = null

  switch (type) {
    case "html":
      sanitized = sanitizeHtml(input)
      break
    case "email":
      sanitized = sanitizeEmail(input)
      if (!sanitized) {
        return { valid: false, error: "Format email tidak valid" }
      }
      break
    case "url":
      sanitized = sanitizeUrl(input)
      if (!sanitized) {
        return { valid: false, error: "Format URL tidak valid" }
      }
      break
    case "slug":
      sanitized = sanitizeSlug(input)
      break
    case "text":
    default:
      sanitized = sanitizeText(input)
      break
  }

  return { valid: true, sanitized }
}
