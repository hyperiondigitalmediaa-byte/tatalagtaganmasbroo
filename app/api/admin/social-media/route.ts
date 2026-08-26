import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

// GET - Fetch all social media
export async function GET() {
  try {
    const socialMedia = await (prisma as any).socialMedia.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    })

    return NextResponse.json(socialMedia)
  } catch (error) {
    console.error("Error fetching social media:", error)
    return NextResponse.json(
      { error: "Failed to fetch social media" },
      { status: 500 }
    )
  }
}

// POST - Create new social media
export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { platform, url, isActive, order } = body

    if (!platform || !url) {
      return NextResponse.json(
        { error: "Platform and URL are required" },
        { status: 400 }
      )
    }

    const socialMedia = await (prisma as any).socialMedia.create({
      data: {
        platform,
        url,
        isActive: isActive ?? true,
        order: order ?? 0,
      },
    })

    return NextResponse.json(socialMedia)
  } catch (error) {
    console.error("Error creating social media:", error)
    return NextResponse.json(
      { error: "Failed to create social media" },
      { status: 500 }
    )
  }
}
