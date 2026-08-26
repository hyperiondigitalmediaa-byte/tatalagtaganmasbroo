/**
 * Optimize Cloudinary image URLs for better performance
 */
export function optimizeCloudinaryUrl(
  url: string,
  options: {
    width?: number
    height?: number
    quality?: number
    format?: 'auto' | 'webp' | 'avif'
  } = {}
): string {
  if (!url || !url.includes('cloudinary.com')) {
    return url
  }

  const { width, height, quality = 80, format = 'auto' } = options

  // Build transformation string
  const transformations: string[] = []
  
  // Format
  transformations.push(`f_${format}`)
  
  // Quality
  transformations.push(`q_${quality}`)
  
  // Dimensions
  if (width) transformations.push(`w_${width}`)
  if (height) transformations.push(`h_${height}`)
  
  // Crop mode
  if (width || height) transformations.push('c_limit')
  
  // Fetch format
  transformations.push('fl_progressive')
  
  // Combine transformations
  const transform = transformations.join(',')
  
  // Insert transformation into URL
  // Example: https://res.cloudinary.com/demo/image/upload/v1234/sample.jpg
  // Becomes: https://res.cloudinary.com/demo/image/upload/f_auto,q_80,w_800/v1234/sample.jpg
  return url.replace('/upload/', `/upload/${transform}/`)
}

/**
 * Get optimized image URL for different use cases
 */
export const imagePresets = {
  thumbnail: (url: string) => optimizeCloudinaryUrl(url, { width: 150, quality: 70 }),
  card: (url: string) => optimizeCloudinaryUrl(url, { width: 400, quality: 75 }),
  featured: (url: string) => optimizeCloudinaryUrl(url, { width: 1200, quality: 80 }),
  hero: (url: string) => optimizeCloudinaryUrl(url, { width: 1920, quality: 85 }),
}
