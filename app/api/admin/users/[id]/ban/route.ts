import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const adminUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!adminUser || adminUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { id: userEmail } = await params

    // Ban user
    const user = await prisma.user.update({
      where: { email: userEmail },
      data: { 
        isBanned: true,
        reputation: 0
      }
    })

    // Reject all pending comments from this user
    await prisma.comment.updateMany({
      where: {
        userId: user.id,
        status: "PENDING"
      },
      data: {
        status: "REJECTED"
      }
    })

    return NextResponse.json({ success: true, user })

  } catch (error) {
    console.error("Ban user error:", error)
    return NextResponse.json({ error: "Failed to ban user" }, { status: 500 })
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

    const adminUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!adminUser || adminUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { id: userEmail } = await params

    // Unban user
    const user = await prisma.user.update({
      where: { email: userEmail },
      data: { isBanned: false }
    })

    return NextResponse.json({ success: true, user })

  } catch (error) {
    console.error("Unban user error:", error)
    return NextResponse.json({ error: "Failed to unban user" }, { status: 500 })
  }
}
