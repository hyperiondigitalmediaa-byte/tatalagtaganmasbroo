import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Only allow ADMIN and EDITOR
    const userRole = (session.user as any).role
    if (userRole !== "ADMIN" && userRole !== "EDITOR") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get pending comments (last 10)
    const pendingComments = await prisma.comment.findMany({
      where: {
        status: "PENDING"
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        user: {
          select: {
            name: true
          }
        },
        article: {
          select: {
            title: true,
            slug: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 10
    })

    // Count total pending comments
    const unreadCount = await prisma.comment.count({
      where: {
        status: "PENDING"
      }
    })

    return NextResponse.json({
      notifications: pendingComments,
      unreadCount
    })
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    )
  }
}
