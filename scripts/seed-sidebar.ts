import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function seedSidebar() {
  console.log("🌱 Seeding sidebar widgets...")

  try {
    // Create default settings
    const settings = await prisma.sidebarSettings.upsert({
      where: { id: "default" },
      update: {},
      create: {
        id: "default",
        isActive: true,
        isSticky: true
      }
    })

    console.log("✅ Sidebar settings created")

    // Create default widgets
    const defaultWidgets = [
      {
        type: "search",
        title: "Cari Artikel",
        isActive: true,
        order: 0,
        config: {}
      },
      {
        type: "trending",
        title: "Artikel Trending",
        isActive: true,
        order: 1,
        config: { limit: 6 }
      },
      {
        type: "categories",
        title: "Kategori Populer",
        isActive: true,
        order: 2,
        config: { limit: 8 }
      },
      {
        type: "latest",
        title: "Artikel Terbaru",
        isActive: false,
        order: 3,
        config: { limit: 5 }
      },
      {
        type: "newsletter",
        title: "Newsletter",
        isActive: false,
        order: 4,
        config: {}
      }
    ]

    for (const widget of defaultWidgets) {
      await prisma.sidebarWidget.create({
        data: widget
      })
      console.log(`✅ Created widget: ${widget.title}`)
    }

    console.log("\n🎉 Sidebar seeding completed!")
    console.log("\n📊 Summary:")
    console.log(`- Settings: ${settings ? "Created" : "Already exists"}`)
    console.log(`- Widgets: ${defaultWidgets.length} created`)
    console.log("\n🔗 Access: http://localhost:3000/admin/sidebar")

  } catch (error) {
    console.error("❌ Error seeding sidebar:", error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

seedSidebar()
