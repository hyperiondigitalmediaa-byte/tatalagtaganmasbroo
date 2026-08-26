import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { revalidateHomepage, revalidateCategory } from "@/lib/revalidate-helper"

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    // Check if slug already exists (excluding current category)
    const existing = await prisma.category.findFirst({
      where: {
        slug: body.slug,
        NOT: { id }
      }
    })

    if (existing) {
      return NextResponse.json(
        { error: "Slug sudah digunakan" },
        { status: 400 }
      )
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description || null
      }
    })

    // Auto-revalidate
    await revalidateHomepage()
    await revalidateCategory(category.slug)

    return NextResponse.json(category)
  } catch (error) {
    console.error("Error updating category:", error)
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Check if category has articles
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { articles: true }
        }
      }
    })

    if (category && category._count.articles > 0) {
      return NextResponse.json(
        { error: "Tidak dapat menghapus kategori yang memiliki artikel" },
        { status: 400 }
      )
    }

    await prisma.category.delete({
      where: { id }
    })

    // Auto-revalidate
    await revalidateHomepage()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    )
  }
}
