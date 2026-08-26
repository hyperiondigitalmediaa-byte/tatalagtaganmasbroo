import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()
    const { status } = body

    if (!["PENDING", "APPROVED", "REJECTED", "SPAM"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    // Update comment status
    const comment = await prisma.comment.update({
      where: { id },
      data: { status }
    })

    // Update user reputation
    if (status === "APPROVED") {
      await prisma.user.update({
        where: { id: comment.userId },
        data: { reputation: { increment: 1 } }
      })
    } else if (status === "REJECTED" || status === "SPAM") {
      await prisma.user.update({
        where: { id: comment.userId },
        data: { reputation: { decrement: 2 } }
      })
    }

    return NextResponse.json({ success: true, comment })

  } catch (error) {
    console.error("Update comment error:", error)
    return NextResponse.json({ error: "Failed to update comment" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { id } = await params

    await prisma.comment.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error("Delete comment error:", error)
    return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 })
  }
}
