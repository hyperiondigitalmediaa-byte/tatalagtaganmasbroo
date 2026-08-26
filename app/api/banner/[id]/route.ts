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
    
    const banner = await prisma.banner.update({
      where: { id },
      data: {
        title: body.title,
        type: body.type || "IMAGE",
        imageUrl: body.type === "IMAGE" ? body.imageUrl : null,
        adCode: body.type === "SCRIPT" ? body.adCode : null,
        linkUrl: body.type === "IMAGE" ? (body.linkUrl || null) : null,
        position: body.position,
        isActive: body.isActive,
        order: body.order
      }
    })

    // Revalidate all pages that use banners
    revalidatePath("/", "layout")

    return NextResponse.json(banner)
  } catch (error) {
    console.error("Error updating banner:", error)
    return NextResponse.json(
      { error: "Failed to update banner" },
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
    await prisma.banner.delete({
      where: { id }
    })

    // Revalidate all pages that use banners
    revalidatePath("/", "layout")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting banner:", error)
    return NextResponse.json(
      { error: "Failed to delete banner" },
      { status: 500 }
    )
  }
}
