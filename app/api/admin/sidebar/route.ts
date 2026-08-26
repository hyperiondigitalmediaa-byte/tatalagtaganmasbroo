import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidateSidebar } from "@/lib/revalidate-helper"

// GET /api/admin/sidebar - Get all widgets and settings
export async function GET() {
  try {
    const session = await auth()
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const [widgets, settings] = await Promise.all([
      prisma.sidebarWidget.findMany({
        orderBy: { order: "asc" }
      }),
      prisma.sidebarSettings.findFirst()
    ])

    // Create default settings if not exists
    let sidebarSettings = settings
    if (!sidebarSettings) {
      sidebarSettings = await prisma.sidebarSettings.create({
        data: {
          isActive: true,
          isSticky: true
        }
      })
    }

    return NextResponse.json({
      widgets,
      settings: sidebarSettings
    })
  } catch (error) {
    console.error("Error fetching sidebar:", error)
    return NextResponse.json(
      { error: "Failed to fetch sidebar" },
      { status: 500 }
    )
  }
}

// POST /api/admin/sidebar - Create new widget
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { type, title, isActive, config } = body

    // Get max order
    const maxOrder = await prisma.sidebarWidget.findFirst({
      orderBy: { order: "desc" },
      select: { order: true }
    })

    const widget = await prisma.sidebarWidget.create({
      data: {
        type,
        title,
        isActive: isActive ?? true,
        order: (maxOrder?.order ?? -1) + 1,
        config: config || {}
      }
    })

    // Auto-revalidate homepage
    await revalidateSidebar()

    return NextResponse.json(widget)
  } catch (error) {
    console.error("Error creating widget:", error)
    return NextResponse.json(
      { error: "Failed to create widget" },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/sidebar - Update settings
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth()
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { isActive, isSticky } = body

    const settings = await prisma.sidebarSettings.findFirst()

    let updatedSettings
    if (settings) {
      updatedSettings = await prisma.sidebarSettings.update({
        where: { id: settings.id },
        data: { isActive, isSticky }
      })
    } else {
      updatedSettings = await prisma.sidebarSettings.create({
        data: { isActive, isSticky }
      })
    }

    // Auto-revalidate homepage
    await revalidateSidebar()

    return NextResponse.json(updatedSettings)
  } catch (error) {
    console.error("Error updating settings:", error)
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    )
  }
}
