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
    
    const menu = await prisma.menu.update({
      where: { id },
      data: {
        label: body.label,
        url: body.url,
        type: body.type,
        parentId: body.parentId || null,
        isActive: body.isActive,
        order: body.order,
        openNewTab: body.openNewTab
      }
    })

    // Revalidate all pages that use menu
    revalidatePath("/", "layout")

    return NextResponse.json(menu)
  } catch (error) {
    console.error("Error updating menu:", error)
    return NextResponse.json(
      { error: "Failed to update menu" },
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
    
    await prisma.menu.delete({
      where: { id }
    })

    // Revalidate all pages that use menu
    revalidatePath("/", "layout")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting menu:", error)
    return NextResponse.json(
      { error: "Failed to delete menu" },
      { status: 500 }
    )
  }
}
