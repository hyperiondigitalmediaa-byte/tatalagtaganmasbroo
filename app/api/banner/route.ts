import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: [
        { position: "asc" },
        { order: "asc" }
      ]
    })

    return NextResponse.json(banners)
  } catch (error) {
    console.error("Error fetching banners:", error)
    return NextResponse.json(
      { error: "Failed to fetch banners" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const banner = await prisma.banner.create({
      data: {
        title: body.title,
        type: body.type || "IMAGE",
        imageUrl: body.type === "IMAGE" ? body.imageUrl : null,
        adCode: body.type === "SCRIPT" ? body.adCode : null,
        linkUrl: body.type === "IMAGE" ? (body.linkUrl || null) : null,
        position: body.position,
        isActive: body.isActive,
        order: body.order
      }
    })

    // Revalidate all pages that use banners
    revalidatePath("/", "layout")

    return NextResponse.json(banner)
  } catch (error) {
    console.error("Error creating banner:", error)
    return NextResponse.json(
      { error: "Failed to create banner" },
      { status: 500 }
    )
  }
}
