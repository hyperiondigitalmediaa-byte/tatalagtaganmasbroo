import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const categories = [
    { name: 'Politik', slug: 'politik', description: 'Berita politik terkini' },
    { name: 'Ekonomi', slug: 'ekonomi', description: 'Berita ekonomi dan bisnis' },
    { name: 'Olahraga', slug: 'olahraga', description: 'Berita olahraga dan pertandingan' },
    { name: 'Teknologi', slug: 'teknologi', description: 'Berita teknologi dan gadget' },
    { name: 'Hiburan', slug: 'hiburan', description: 'Berita hiburan dan selebriti' },
    { name: 'Kesehatan', slug: 'kesehatan', description: 'Berita kesehatan dan gaya hidup' },
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category
    })
  }

  console.log('Categories seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
