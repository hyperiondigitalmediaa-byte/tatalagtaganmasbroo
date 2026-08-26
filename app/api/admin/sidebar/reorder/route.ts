import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

// POST /api/admin/sidebar/reorder - Reorder widgets
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { widgets } = body // Array of { id, order }

    // Update all widgets order
    await Promise.all(
      widgets.map((widget: { id: string; order: number }) =>
        prisma.sidebarWidget.update({
          where: { id: widget.id },
          data: { order: widget.order }
        })
      )
    )

    return NextResponse.json({ message: "Widgets reordered successfully" })
  } catch (error) {
    console.error("Error reordering widgets:", error)
    return NextResponse.json(
      { error: "Failed to reorder widgets" },
      { status: 500 }
    )
  }
}
