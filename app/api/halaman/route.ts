import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const pages = await prisma.page.findMany({
      orderBy: { updatedAt: "desc" }
    })

    return NextResponse.json(pages)
  } catch (error) {
    console.error("Error fetching pages:", error)
    return NextResponse.json(
      { error: "Failed to fetch pages" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Check if slug already exists
    const existing = await prisma.page.findUnique({
      where: { slug: body.slug }
    })

    if (existing) {
      return NextResponse.json(
        { error: "Slug sudah digunakan" },
        { status: 400 }
      )
    }

    const page = await prisma.page.create({
      data: {
        title: body.title,
        slug: body.slug,
        content: body.content,
        metaTitle: body.metaTitle || null,
        metaDescription: body.metaDescription || null,
        isActive: body.isActive
      }
    })

    // Revalidate pages
    revalidatePath("/halaman/[slug]", "page")

    return NextResponse.json(page)
  } catch (error) {
    console.error("Error creating page:", error)
    return NextResponse.json(
      { error: "Failed to create page" },
      { status: 500 }
    )
  }
}
