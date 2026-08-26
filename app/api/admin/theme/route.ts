import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// Default theme colors
const DEFAULT_THEME = {
  primaryColor: "#dc2626", // red-600 - warna merah default
  secondaryColor: "#10b981", // green-500
  accentColor: "#f59e0b", // amber-500
  backgroundColor: "#ffffff",
  textColor: "#1f2937", // gray-800
  fontFamily: "Inter",
};

// GET - Get current theme
export async function GET() {
  try {
    const settings = await prisma.siteSettings.findMany({
      where: {
        category: "theme",
      },
    });

    const theme: Record<string, string> = { ...DEFAULT_THEME };

    settings.forEach((setting: any) => {
      theme[setting.key] = setting.value;
    });

    return NextResponse.json(theme);
  } catch (error) {
    console.error("Error fetching theme:", error);
    return NextResponse.json(DEFAULT_THEME);
  }
}

// POST - Save theme
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      primaryColor,
      secondaryColor,
      accentColor,
      backgroundColor,
      textColor,
      fontFamily,
    } = body;

    // Save each setting
    const updates = [
      { key: "primaryColor", value: primaryColor },
      { key: "secondaryColor", value: secondaryColor },
      { key: "accentColor", value: accentColor },
      { key: "backgroundColor", value: backgroundColor },
      { key: "textColor", value: textColor },
      { key: "fontFamily", value: fontFamily },
    ];

    for (const update of updates) {
      await prisma.siteSettings.upsert({
        where: { key: update.key },
        update: {
          value: update.value,
          category: "theme",
          updatedAt: new Date(),
        },
        create: {
          key: update.key,
          value: update.value,
          category: "theme",
        },
      });
    }

    return NextResponse.json({ success: true, message: "Theme saved successfully" });
  } catch (error) {
    console.error("Error saving theme:", error);
    return NextResponse.json(
      { error: "Failed to save theme" },
      { status: 500 }
    );
  }
}

// DELETE - Reset to default theme
export async function DELETE() {
  try {
    const session = await auth();

    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete all theme settings
    await prisma.siteSettings.deleteMany({
      where: {
        category: "theme",
      },
    });

    // Force insert default theme to ensure it's applied immediately
    const defaultUpdates = [
      { key: "primaryColor", value: DEFAULT_THEME.primaryColor },
      { key: "secondaryColor", value: DEFAULT_THEME.secondaryColor },
      { key: "accentColor", value: DEFAULT_THEME.accentColor },
      { key: "backgroundColor", value: DEFAULT_THEME.backgroundColor },
      { key: "textColor", value: DEFAULT_THEME.textColor },
      { key: "fontFamily", value: DEFAULT_THEME.fontFamily },
    ];

    for (const update of defaultUpdates) {
      await prisma.siteSettings.create({
        data: {
          key: update.key,
          value: update.value,
          category: "theme",
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Theme reset to default",
      theme: DEFAULT_THEME,
    });
  } catch (error) {
    console.error("Error resetting theme:", error);
    return NextResponse.json(
      { error: "Failed to reset theme" },
      { status: 500 }
    );
  }
}
