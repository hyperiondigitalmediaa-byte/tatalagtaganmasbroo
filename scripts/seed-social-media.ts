import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding social media...")

  const defaultSocialMedia = [
    {
      platform: "facebook",
      url: "https://facebook.com/portalberita",
      isActive: true,
      order: 1,
    },
    {
      platform: "twitter",
      url: "https://twitter.com/portalberita",
      isActive: true,
      order: 2,
    },
    {
      platform: "instagram",
      url: "https://instagram.com/portalberita",
      isActive: true,
      order: 3,
    },
    {
      platform: "youtube",
      url: "https://youtube.com/@portalberita",
      isActive: true,
      order: 4,
    },
  ]

  for (const social of defaultSocialMedia) {
    await (prisma as any).socialMedia.upsert({
      where: {
        id: `seed-${social.platform}`,
      },
      update: {},
      create: {
        id: `seed-${social.platform}`,
        ...social,
      },
    })
  }

  console.log("✅ Social media seeded successfully!")
}

main()
  .catch((e) => {
    console.error("❌ Error seeding social media:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
