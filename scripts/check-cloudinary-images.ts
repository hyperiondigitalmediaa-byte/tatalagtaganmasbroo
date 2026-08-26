import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function checkCloudinaryImages() {
  console.log("🔍 Checking Cloudinary images in database...\n")

  // Get all articles with Cloudinary images
  const articles = await prisma.article.findMany({
    where: {
      featuredImage: {
        contains: "cloudinary.com"
      }
    },
    select: {
      id: true,
      title: true,
      slug: true,
      featuredImage: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  if (articles.length === 0) {
    console.log("❌ No articles with Cloudinary images found")
    return
  }

  console.log(`✅ Found ${articles.length} article(s) with Cloudinary images:\n`)

  articles.forEach((article, index) => {
    console.log(`${index + 1}. ${article.title}`)
    console.log(`   Slug: /artikel/${article.slug}`)
    console.log(`   Image: ${article.featuredImage}`)
    console.log(`   Created: ${article.createdAt.toLocaleString('id-ID')}`)
    console.log("")
  })

  // Extract public IDs
  console.log("📋 Cloudinary Public IDs:")
  articles.forEach((article) => {
    const match = article.featuredImage?.match(/\/v\d+\/(.+)\.\w+$/)
    if (match) {
      console.log(`   - ${match[1]}`)
    }
  })

  await prisma.$disconnect()
}

checkCloudinaryImages()
  .catch((error) => {
    console.error("Error:", error)
    process.exit(1)
  })
