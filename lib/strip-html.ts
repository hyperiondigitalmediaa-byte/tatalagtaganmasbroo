/**
 * Strip HTML tags from string
 * @param html - HTML string
 * @param maxLength - Maximum length of output (optional)
 * @returns Plain text without HTML tags
 */
export function stripHtml(html: string, maxLength?: number): string {
  if (!html) return ''
  
  // Remove HTML tags
  let text = html.replace(/<[^>]*>/g, '')
  
  // Decode HTML entities
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
  
  // Remove extra whitespace
  text = text.replace(/\s+/g, ' ').trim()
  
  // Truncate if maxLength specified
  if (maxLength && text.length > maxLength) {
    text = text.substring(0, maxLength) + '...'
  }
  
  return text
}

/**
 * Get excerpt from content
 * @param content - Full content (may contain HTML)
 * @param length - Desired length (default: 150)
 * @returns Plain text excerpt
 */
export function getExcerpt(content: string, length: number = 150): string {
  return stripHtml(content, length)
}
