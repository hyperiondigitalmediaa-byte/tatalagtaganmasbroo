import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidateSidebar } from "@/lib/revalidate-helper"

// PATCH /api/admin/sidebar/[id] - Update widget
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { type, title, isActive, order, config } = body

    const widget = await prisma.sidebarWidget.update({
      where: { id },
      data: {
        ...(type !== undefined && { type }),
        ...(title !== undefined && { title }),
        ...(isActive !== undefined && { isActive }),
        ...(order !== undefined && { order }),
        ...(config !== undefined && { config })
      }
    })

    // Auto-revalidate homepage
    await revalidateSidebar()

    return NextResponse.json(widget)
  } catch (error) {
    console.error("Error updating widget:", error)
    return NextResponse.json(
      { error: "Failed to update widget" },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/sidebar/[id] - Delete widget
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    await prisma.sidebarWidget.delete({
      where: { id }
    })

    // Auto-revalidate homepage
    await revalidateSidebar()

    return NextResponse.json({ message: "Widget deleted successfully" })
  } catch (error) {
    console.error("Error deleting widget:", error)
    return NextResponse.json(
      { error: "Failed to delete widget" },
      { status: 500 }
    )
  }
}
