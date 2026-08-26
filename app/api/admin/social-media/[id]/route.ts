import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

// PATCH - Update social media
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { platform, url, isActive, order } = body

    const socialMedia = await (prisma as any).socialMedia.update({
      where: { id },
      data: {
        ...(platform !== undefined && { platform }),
        ...(url !== undefined && { url }),
        ...(isActive !== undefined && { isActive }),
        ...(order !== undefined && { order }),
      },
    })

    return NextResponse.json(socialMedia)
  } catch (error) {
    console.error("Error updating social media:", error)
    return NextResponse.json(
      { error: "Failed to update social media" },
      { status: 500 }
    )
  }
}

// DELETE - Delete social media
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    await (prisma as any).socialMedia.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Social media deleted successfully" })
  } catch (error) {
    console.error("Error deleting social media:", error)
    return NextResponse.json(
      { error: "Failed to delete social media" },
      { status: 500 }
    )
  }
}
