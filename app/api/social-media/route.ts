import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET - Fetch active social media for public
export async function GET() {
  try {
    const socialMedia = await prisma.socialMedia.findMany({
      where: { isActive: true },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      select: {
        id: true,
        platform: true,
        url: true,
        order: true,
      },
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
