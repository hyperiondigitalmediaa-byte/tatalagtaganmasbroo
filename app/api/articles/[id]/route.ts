import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { v2 as cloudinary } from "cloudinary"
import { revalidateArticle, revalidateHomepage } from "@/lib/revalidate-helper"

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// GET /api/articles/[id] - Get single article
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        author: { select: { name: true, email: true } },
        category: { select: { id: true, name: true, slug: true } },
        tags: {
          include: {
            tag: { select: { id: true, name: true, slug: true } }
          }
        }
      }
    })

    if (!article) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(article)
  } catch (error) {
    console.error("Error fetching article:", error)
    return NextResponse.json(
      { error: "Failed to fetch article" },
      { status: 500 }
    )
  }
}

// PATCH /api/articles/[id] - Update article
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const {
      title,
      slug,
      content,
      excerpt,
      categoryId,
      tags,
      featuredImage,
      metaTitle,
      metaDescription,
      status,
      scheduledAt,
      showViews
    } = body

    // Check if slug exists for other articles
    if (slug) {
      const existingArticle = await prisma.article.findFirst({
        where: {
          slug,
          NOT: { id }
        }
      })

      if (existingArticle) {
        return NextResponse.json(
          { error: "Slug already exists" },
          { status: 400 }
        )
      }
    }

    // Determine final status and dates
    let finalStatus = status
    let publishedAt = null
    let scheduledDate = null

    if (scheduledAt) {
      scheduledDate = new Date(scheduledAt)
      const now = new Date()
      
      if (scheduledDate <= now) {
        // Schedule time is in the past, publish immediately
        finalStatus = "PUBLISHED"
        publishedAt = new Date()
      } else {
        // Schedule for future
        finalStatus = "SCHEDULED"
      }
    } else if (status === "PUBLISHED") {
      // Get existing article to check if it was already published
      const existing = await prisma.article.findUnique({
        where: { id },
        select: { publishedAt: true }
      })
      publishedAt = existing?.publishedAt || new Date()
    }

    // Delete existing tags
    await prisma.articleTag.deleteMany({
      where: { articleId: id }
    })

    // Update article
    const article = await prisma.article.update({
      where: { id },
      data: {
        title,
        slug,
        content,
        excerpt,
        categoryId,
        featuredImage,
        metaTitle,
        metaDescription,
        status: finalStatus as any,
        ...(scheduledDate && { scheduledAt: scheduledDate }),
        publishedAt,
        showViews: showViews ?? true,
        tags: tags?.length ? {
          create: tags.map((tagId: string) => ({
            tag: { connect: { id: tagId } }
          }))
        } : undefined
      } as any,
      include: {
        author: { select: { name: true } },
        category: { select: { name: true } },
        tags: { include: { tag: true } }
      }
    })

    // Auto-revalidate pages
    await revalidateArticle(article.slug)

    return NextResponse.json(article)
  } catch (error) {
    console.error("Error updating article:", error)
    return NextResponse.json(
      { error: "Failed to update article" },
      { status: 500 }
    )
  }
}

// DELETE /api/articles/[id] - Delete article
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    
    // Get article to extract Cloudinary images
    const article = await prisma.article.findUnique({
      where: { id },
      select: {
        featuredImage: true,
        content: true,
      }
    })

    if (!article) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      )
    }

    // Delete article from database first
    await prisma.article.delete({
      where: { id }
    })

    // Extract and delete Cloudinary images
    const cloudinaryImages: string[] = []

    // 1. Featured image
    if (article.featuredImage?.includes('cloudinary.com')) {
      const publicId = extractCloudinaryPublicId(article.featuredImage)
      if (publicId) cloudinaryImages.push(publicId)
    }

    // 2. Images in content
    if (article.content) {
      const imgRegex = /https:\/\/res\.cloudinary\.com\/[^\/]+\/image\/upload\/[^\s"')]+/g
      const contentImages = article.content.match(imgRegex) || []
      contentImages.forEach(url => {
        const publicId = extractCloudinaryPublicId(url)
        if (publicId) cloudinaryImages.push(publicId)
      })
    }

    // Delete images from Cloudinary
    if (cloudinaryImages.length > 0) {
      console.log(`🗑️ Deleting ${cloudinaryImages.length} image(s) from Cloudinary...`)
      
      for (const publicId of cloudinaryImages) {
        try {
          await cloudinary.uploader.destroy(publicId)
          console.log(`✅ Deleted: ${publicId}`)
        } catch (error) {
          console.error(`❌ Failed to delete ${publicId}:`, error)
          // Continue deleting other images even if one fails
        }
      }
    }

    // Auto-revalidate homepage and indeks
    await revalidateHomepage()

    return NextResponse.json({ 
      message: "Article deleted successfully",
      deletedImages: cloudinaryImages.length
    })
  } catch (error) {
    console.error("Error deleting article:", error)
    return NextResponse.json(
      { error: "Failed to delete article" },
      { status: 500 }
    )
  }
}

// Helper function to extract Cloudinary public ID from URL
function extractCloudinaryPublicId(url: string): string | null {
  try {
    // Example URL: https://res.cloudinary.com/droqacd9z/image/upload/v1762411688/news/article/mzdduuhyl3tlbupkfv8w.png
    // Extract: news/article/mzdduuhyl3tlbupkfv8w
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.\w+)?$/)
    if (match && match[1]) {
      // Remove file extension if present
      return match[1].replace(/\.\w+$/, '')
    }
    return null
  } catch (error) {
    console.error("Error extracting public ID:", error)
    return null
  }
}
