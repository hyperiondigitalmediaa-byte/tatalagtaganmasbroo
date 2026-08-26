import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testSearch() {
  console.log('🔍 Testing Search Functionality\n')

  // 1. Check published articles
  console.log('1️⃣ Checking published articles...')
  const publishedArticles = await prisma.article.findMany({
    where: {
      status: 'PUBLISHED'
    },
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      excerpt: true
    },
    take: 10
  })

  console.log(`✅ Found ${publishedArticles.length} published articles:\n`)
  publishedArticles.forEach((article, index) => {
    console.log(`${index + 1}. ${article.title}`)
    console.log(`   Slug: ${article.slug}`)
    console.log(`   Status: ${article.status}`)
    console.log('')
  })

  // 2. Test search with first article title
  if (publishedArticles.length > 0) {
    const testKeyword = publishedArticles[0].title.split(' ')[0] // First word
    console.log(`\n2️⃣ Testing search with keyword: "${testKeyword}"\n`)

    const searchResults = await prisma.article.findMany({
      where: {
        status: 'PUBLISHED',
        OR: [
          {
            title: {
              contains: testKeyword,
              mode: 'insensitive'
            }
          },
          {
            content: {
              contains: testKeyword,
              mode: 'insensitive'
            }
          },
          {
            excerpt: {
              contains: testKeyword,
              mode: 'insensitive'
            }
          }
        ]
      },
      select: {
        id: true,
        title: true,
        slug: true
      }
    })

    console.log(`✅ Search results: ${searchResults.length} article(s) found\n`)
    searchResults.forEach((article, index) => {
      console.log(`${index + 1}. ${article.title}`)
    })
  }

  // 3. Check all article statuses
  console.log('\n3️⃣ Article status breakdown:')
  const statusCount = await prisma.article.groupBy({
    by: ['status'],
    _count: true
  })

  statusCount.forEach(stat => {
    console.log(`   ${stat.status}: ${stat._count} articles`)
  })

  await prisma.$disconnect()
}

testSearch().catch(console.error)
