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
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id: commentId } = await params
    const body = await request.json()
    const { reason } = body

    if (!reason || reason.trim().length < 5) {
      return NextResponse.json(
        { error: "Alasan laporan terlalu pendek" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Check if already reported
    const existingReport = await prisma.commentReport.findUnique({
      where: {
        commentId_userId: {
          commentId,
          userId: user.id
        }
      }
    })

    if (existingReport) {
      return NextResponse.json(
        { error: "Anda sudah melaporkan komentar ini" },
        { status: 400 }
      )
    }

    // Create report
    await prisma.commentReport.create({
      data: {
        commentId,
        userId: user.id,
        reason: reason.trim()
      }
    })

    // Check if comment has multiple reports (auto-hide if >= 3)
    const reportCount = await prisma.commentReport.count({
      where: { commentId }
    })

    if (reportCount >= 3) {
      await prisma.comment.update({
        where: { id: commentId },
        data: { status: "PENDING" }
      })
    }

    return NextResponse.json({
      success: true,
      message: "Terima kasih atas laporannya. Tim kami akan meninjau komentar ini."
    })

  } catch (error) {
    console.error("Report comment error:", error)
    return NextResponse.json(
      { error: "Gagal melaporkan komentar" },
      { status: 500 }
    )
  }
}
