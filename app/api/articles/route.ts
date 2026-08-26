import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { validateData, articleSchema } from "@/lib/validation-schemas"
import { revalidateArticle } from "@/lib/revalidate-helper"

// GET /api/articles - List articles with filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || ""
    const categoryId = searchParams.get("categoryId") || ""
    const sort = searchParams.get("sort") || "createdAt"
    const order = searchParams.get("order") || "desc"

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } }
      ]
    }
    
    if (status && status !== "ALL") {
      where.status = status
    }
    
    if (categoryId) {
      where.categoryId = categoryId
    }

    // Get articles
    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        include: {
          author: {
            select: { name: true, email: true }
          },
          category: {
            select: { name: true, slug: true }
          },
          tags: {
            include: {
              tag: {
                select: { name: true, slug: true }
              }
            }
          }
        },
        orderBy: { [sort]: order },
        skip,
        take: limit
      }),
      prisma.article.count({ where })
    ])

    return NextResponse.json({
      articles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error("Error fetching articles:", error)
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    )
  }
}

// POST /api/articles - Create new article
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    
    // Validate input with Zod
    const validation = validateData(articleSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", errors: validation.errors },
        { status: 400 }
      )
    }

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
    } = validation.data

    // Check if slug already exists
    const existingArticle = await prisma.article.findUnique({
      where: { slug }
    })

    if (existingArticle) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 400 }
      )
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
      publishedAt = new Date()
    }

    // Create article
    const article = await prisma.article.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || content.substring(0, 200),
        categoryId,
        featuredImage,
        metaTitle: metaTitle || title,
        metaDescription: metaDescription || excerpt,
        status: finalStatus as any,
        ...(scheduledDate && { scheduledAt: scheduledDate }),
        publishedAt,
        authorId: (session.user as any).id,
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

    // Auto-revalidate pages if published
    if (finalStatus === 'PUBLISHED') {
      await revalidateArticle(article.slug)
    }

    return NextResponse.json(article, { status: 201 })
  } catch (error) {
    console.error("Error creating article:", error)
    return NextResponse.json(
      { error: "Failed to create article" },
      { status: 500 }
    )
  }
}
