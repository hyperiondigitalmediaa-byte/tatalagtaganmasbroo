import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const session = await auth()

    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "100")
    const action = searchParams.get("action")
    const status = searchParams.get("status")

    const where: any = {}
    if (action) where.action = action
    if (status) where.status = status

    const logs = await (prisma as any).auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
    })

    return NextResponse.json(logs)
  } catch (error) {
    console.error("Error fetching audit logs:", error)
    return NextResponse.json(
      { error: "Failed to fetch audit logs" },
      { status: 500 }
    )
  }
}
