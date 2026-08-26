import { PrismaClient } from "@prisma/client"
import { v2 as cloudinary } from "cloudinary"

const prisma = new PrismaClient()

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

async function cleanupOrphanedImages() {
  console.log("🔍 Scanning for orphaned Cloudinary images...\n")

  try {
    // Get all articles with images
    const articles = await prisma.article.findMany({
      select: {
        featuredImage: true,
        content: true,
      }
    })

    // Collect all image URLs used in articles
    const usedImages = new Set<string>()

    articles.forEach(article => {
      // Featured images
      if (article.featuredImage?.includes('cloudinary.com')) {
        const publicId = extractCloudinaryPublicId(article.featuredImage)
        if (publicId) usedImages.add(publicId)
      }

      // Content images
      if (article.content) {
        const imgRegex = /https:\/\/res\.cloudinary\.com\/[^\/]+\/image\/upload\/[^\s"')]+/g
        const contentImages = article.content.match(imgRegex) || []
        contentImages.forEach(url => {
          const publicId = extractCloudinaryPublicId(url)
          if (publicId) usedImages.add(publicId)
        })
      }
    })

    console.log(`✅ Found ${usedImages.size} image(s) in use\n`)

    // Get all images from Cloudinary
    console.log("📡 Fetching images from Cloudinary...")
    const cloudinaryImages: string[] = []
    
    let nextCursor: string | undefined = undefined
    do {
      const result = await cloudinary.api.resources({
        type: 'upload',
        prefix: 'news/',
        max_results: 500,
        next_cursor: nextCursor
      })

      result.resources.forEach((resource: any) => {
        cloudinaryImages.push(resource.public_id)
      })

      nextCursor = result.next_cursor
    } while (nextCursor)

    console.log(`✅ Found ${cloudinaryImages.length} image(s) in Cloudinary\n`)

    // Find orphaned images
    const orphanedImages = cloudinaryImages.filter(img => !usedImages.has(img))

    if (orphanedImages.length === 0) {
      console.log("✨ No orphaned images found! Everything is clean.")
      return
    }

    console.log(`🗑️ Found ${orphanedImages.length} orphaned image(s):\n`)
    orphanedImages.forEach((img, index) => {
      console.log(`${index + 1}. ${img}`)
    })

    // Ask for confirmation
    console.log("\n⚠️  WARNING: This will permanently delete these images!")
    console.log("Press Ctrl+C to cancel, or wait 5 seconds to continue...\n")
    
    await new Promise(resolve => setTimeout(resolve, 5000))

    // Delete orphaned images
    console.log("🗑️ Deleting orphaned images...\n")
    let deletedCount = 0

    for (const publicId of orphanedImages) {
      try {
        await cloudinary.uploader.destroy(publicId)
        console.log(`✅ Deleted: ${publicId}`)
        deletedCount++
      } catch (error: any) {
        console.error(`❌ Failed to delete ${publicId}:`, error.message)
      }
    }

    console.log(`\n✅ Cleanup complete! Deleted ${deletedCount}/${orphanedImages.length} image(s)`)

  } catch (error) {
    console.error("❌ Error during cleanup:", error)
  } finally {
    await prisma.$disconnect()
  }
}

function extractCloudinaryPublicId(url: string): string | null {
  try {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.\w+)?$/)
    if (match && match[1]) {
      return match[1].replace(/\.\w+$/, '')
    }
    return null
  } catch (error) {
    return null
  }
}

cleanupOrphanedImages()
