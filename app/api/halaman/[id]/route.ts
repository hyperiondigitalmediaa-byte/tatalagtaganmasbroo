import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    // Check if slug already exists (excluding current page)
    const existing = await prisma.page.findFirst({
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

    const page = await prisma.page.update({
      where: { id },
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
    console.error("Error updating page:", error)
    return NextResponse.json(
      { error: "Failed to update page" },
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
    
    await prisma.page.delete({
      where: { id }
    })

    // Revalidate pages
    revalidatePath("/halaman/[slug]", "page")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting page:", error)
    return NextResponse.json(
      { error: "Failed to delete page" },
      { status: 500 }
    )
  }
}
