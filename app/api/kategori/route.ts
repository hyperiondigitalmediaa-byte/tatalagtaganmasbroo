import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { articles: true }
        }
      },
      orderBy: { name: "asc" }
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Check if slug already exists
    const existing = await prisma.category.findUnique({
      where: { slug: body.slug }
    })

    if (existing) {
      return NextResponse.json(
        { error: "Slug sudah digunakan" },
        { status: 400 }
      )
    }

    const category = await prisma.category.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description || null
      }
    })

    // Revalidate pages that use categories
    revalidatePath("/", "layout")

    return NextResponse.json(category)
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    )
  }
}
