// Calculate estimated reading time from content
export function calculateReadingTime(content: string): number {
  // Remove HTML tags
  const text = content.replace(/<[^>]*>/g, "")
  
  // Count words
  const words = text.trim().split(/\s+/).length
  
  // Average reading speed: 200 words per minute
  const minutes = Math.ceil(words / 200)
  
  return minutes
}

// Format reading time for display
export function formatReadingTime(minutes: number): string {
  if (minutes < 1) return "< 1 menit"
  if (minutes === 1) return "1 menit"
  return `${minutes} menit`
}
