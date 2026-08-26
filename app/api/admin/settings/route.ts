import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

// Default settings
const DEFAULT_SETTINGS = {
  siteName: "Portal Berita",
  siteDescription: "Website berita terkini dan terpercaya",
  logoUrl: "",
  faviconUrl: "",
}

// GET - Get current settings
export async function GET() {
  try {
    const settings = await prisma.siteSettings.findMany({
      where: {
        category: "general",
      },
    })

    const result: Record<string, string> = { ...DEFAULT_SETTINGS }

    settings.forEach((setting: any) => {
      result[setting.key] = setting.value
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json(DEFAULT_SETTINGS)
  }
}

// POST - Save settings
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { siteName, siteDescription, logoUrl, faviconUrl } = body

    // Save each setting
    const updates = [
      { key: "siteName", value: siteName || DEFAULT_SETTINGS.siteName },
      { key: "siteDescription", value: siteDescription || DEFAULT_SETTINGS.siteDescription },
      { key: "logoUrl", value: logoUrl || "" },
      { key: "faviconUrl", value: faviconUrl || "" },
    ]

    for (const update of updates) {
      await prisma.siteSettings.upsert({
        where: { key: update.key },
        update: {
          value: update.value,
          category: "general",
          updatedAt: new Date(),
        },
        create: {
          key: update.key,
          value: update.value,
          category: "general",
        },
      })
    }

    return NextResponse.json({ 
      success: true, 
      message: "Settings saved successfully" 
    })
  } catch (error) {
    console.error("Error saving settings:", error)
    return NextResponse.json(
      { error: "Failed to save settings" },
      { status: 500 }
    )
  }
}
