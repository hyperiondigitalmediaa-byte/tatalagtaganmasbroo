import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    // Only ADMIN can restore
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const backup = await request.json()

    if (!backup.data || !backup.version) {
      return NextResponse.json(
        { error: "Invalid backup file" },
        { status: 400 }
      )
    }

    // WARNING: This will delete all existing data
    // In production, you might want to create a transaction or backup first

    // Restore data (order matters due to foreign keys)
    const results = {
      users: 0,
      categories: 0,
      tags: 0,
      articles: 0,
      comments: 0,
      banners: 0,
      menus: 0,
      pages: 0,
    }

    // Restore users (skip if exists to avoid conflicts)
    for (const user of backup.data.users || []) {
      try {
        await prisma.user.upsert({
          where: { id: user.id },
          update: user,
          create: user,
        })
        results.users++
      } catch (error) {
        console.error("Error restoring user:", error)
      }
    }

    // Restore categories
    for (const category of backup.data.categories || []) {
      try {
        await prisma.category.upsert({
          where: { id: category.id },
          update: category,
          create: category,
        })
        results.categories++
      } catch (error) {
        console.error("Error restoring category:", error)
      }
    }

    // Restore tags
    for (const tag of backup.data.tags || []) {
      try {
        await prisma.tag.upsert({
          where: { id: tag.id },
          update: tag,
          create: tag,
        })
        results.tags++
      } catch (error) {
        console.error("Error restoring tag:", error)
      }
    }

    // Restore articles
    for (const article of backup.data.articles || []) {
      try {
        await prisma.article.upsert({
          where: { id: article.id },
          update: article,
          create: article,
        })
        results.articles++
      } catch (error) {
        console.error("Error restoring article:", error)
      }
    }

    // Restore comments
    for (const comment of backup.data.comments || []) {
      try {
        await prisma.comment.upsert({
          where: { id: comment.id },
          update: comment,
          create: comment,
        })
        results.comments++
      } catch (error) {
        console.error("Error restoring comment:", error)
      }
    }

    // Restore banners
    for (const banner of backup.data.banners || []) {
      try {
        await prisma.banner.upsert({
          where: { id: banner.id },
          update: banner,
          create: banner,
        })
        results.banners++
      } catch (error) {
        console.error("Error restoring banner:", error)
      }
    }

    // Restore menus
    for (const menu of backup.data.menus || []) {
      try {
        await prisma.menu.upsert({
          where: { id: menu.id },
          update: menu,
          create: menu,
        })
        results.menus++
      } catch (error) {
        console.error("Error restoring menu:", error)
      }
    }

    // Restore pages
    for (const page of backup.data.pages || []) {
      try {
        await prisma.page.upsert({
          where: { id: page.id },
          update: page,
          create: page,
        })
        results.pages++
      } catch (error) {
        console.error("Error restoring page:", error)
      }
    }

    return NextResponse.json({
      success: true,
      message: "Backup restored successfully",
      results,
    })
  } catch (error) {
    console.error("Restore error:", error)
    return NextResponse.json(
      { error: "Failed to restore backup" },
      { status: 500 }
    )
  }
}
