import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const menus = await prisma.menu.findMany({
      include: {
        children: {
          orderBy: { order: "asc" }
        }
      },
      orderBy: { order: "asc" }
    })

    return NextResponse.json(menus)
  } catch (error) {
    console.error("Error fetching menus:", error)
    return NextResponse.json(
      { error: "Failed to fetch menus" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const menu = await prisma.menu.create({
      data: {
        label: body.label,
        url: body.url,
        type: body.type,
        parentId: body.parentId || null,
        isActive: body.isActive,
        order: body.order,
        openNewTab: body.openNewTab
      }
    })

    // Revalidate all pages that use menu
    revalidatePath("/", "layout")

    return NextResponse.json(menu)
  } catch (error) {
    console.error("Error creating menu:", error)
    return NextResponse.json(
      { error: "Failed to create menu" },
      { status: 500 }
    )
  }
}
