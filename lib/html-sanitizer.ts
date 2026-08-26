/**
 * HTML Sanitizer using DOMPurify
 * Prevents XSS attacks by sanitizing HTML content
 */

import DOMPurify from 'isomorphic-dompurify'

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param dirty - Untrusted HTML string
 * @param options - DOMPurify configuration options
 * @returns Sanitized HTML string safe for rendering
 */
export function sanitizeHtml(
  dirty: string,
  options?: {
    allowedTags?: string[]
    allowedAttributes?: Record<string, string[]>
    allowIframes?: boolean
  }
): string {
  if (!dirty) return ''

  // Default configuration - allows common HTML tags used in articles
  const defaultConfig = {
    ALLOWED_TAGS: [
      // Text formatting
      'p', 'br', 'strong', 'em', 'u', 's', 'mark', 'small', 'del', 'ins', 'sub', 'sup',
      // Headings
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      // Lists
      'ul', 'ol', 'li',
      // Links and media
      'a', 'img', 'figure', 'figcaption',
      // Code
      'code', 'pre', 'blockquote',
      // Tables
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      // Divs and spans for styling
      'div', 'span',
      // Line breaks
      'hr',
    ],
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'title', 'class', 'id', 'style',
      'width', 'height', 'target', 'rel', 'loading', 'decoding'
    ],
    ALLOW_DATA_ATTR: false,
    ALLOW_UNKNOWN_PROTOCOLS: false,
    SAFE_FOR_TEMPLATES: true,
  } as const

  // Build config based on options
  const config: any = { ...defaultConfig }
  
  // Allow iframes if specified (for embedded content like YouTube)
  if (options?.allowIframes) {
    config.ALLOWED_TAGS = [...config.ALLOWED_TAGS, 'iframe']
    config.ALLOWED_ATTR = [...config.ALLOWED_ATTR, 'frameborder', 'allowfullscreen', 'allow']
  }

  // Merge custom options
  if (options?.allowedTags) {
    config.ALLOWED_TAGS = options.allowedTags
  }
  if (options?.allowedAttributes) {
    config.ALLOWED_ATTR = Object.values(options.allowedAttributes).flat()
  }

  // Sanitize and return
  const sanitized = DOMPurify.sanitize(dirty, config)
  return typeof sanitized === 'string' ? sanitized : String(sanitized)
}

/**
 * Sanitize HTML for article content
 * More permissive for rich content
 */
export function sanitizeArticleContent(html: string): string {
  return sanitizeHtml(html, {
    allowIframes: true, // Allow YouTube embeds, etc.
  })
}

/**
 * Sanitize HTML for comments
 * More restrictive - only basic formatting
 */
export function sanitizeCommentContent(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ['p', 'br', 'strong', 'em', 'u', 'a', 'code'],
    allowedAttributes: {
      a: ['href', 'title', 'rel', 'target'],
    },
  })
}

/**
 * Strip all HTML tags - for plain text
 */
export function stripHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  })
}

/**
 * Sanitize user input for safe display
 * Very restrictive - removes all HTML
 */
export function sanitizeUserInput(input: string): string {
  return stripHtml(input).trim()
}
