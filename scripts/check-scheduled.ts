import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkScheduledArticles() {
  console.log('🔍 Checking scheduled articles...\n')

  try {
    const articles = await prisma.article.findMany({
      where: {
        status: 'SCHEDULED' as any
      },
      select: {
        id: true,
        title: true,
        status: true,
        scheduledAt: true,
        createdAt: true
      },
      orderBy: {
        scheduledAt: 'asc'
      }
    })

    if (articles.length === 0) {
      console.log('❌ No scheduled articles found in database')
      console.log('\nPossible issues:')
      console.log('1. Article status is not "SCHEDULED"')
      console.log('2. scheduledAt field is null')
      console.log('3. Article was already published\n')
    } else {
      console.log(`✅ Found ${articles.length} scheduled article(s):\n`)
      
      const now = new Date()
      
      articles.forEach((article, index) => {
        const scheduledDate = article.scheduledAt ? new Date(article.scheduledAt) : null
        const isPast = scheduledDate && scheduledDate <= now
        
        console.log(`${index + 1}. ${article.title}`)
        console.log(`   ID: ${article.id}`)
        console.log(`   Status: ${article.status}`)
        console.log(`   Scheduled: ${scheduledDate ? scheduledDate.toLocaleString('id-ID') : 'NULL'}`)
        console.log(`   Should publish: ${isPast ? '✅ YES (past due)' : '❌ NO (future)'}`)
        console.log(`   Current time: ${now.toLocaleString('id-ID')}`)
        console.log('')
      })
    }

    // Check all articles
    const allArticles = await prisma.article.findMany({
      select: {
        id: true,
        title: true,
        status: true,
        scheduledAt: true
      },
      take: 10,
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log('\n📋 Last 10 articles (all statuses):')
    allArticles.forEach((article, index) => {
      console.log(`${index + 1}. ${article.title}`)
      console.log(`   Status: ${article.status}`)
      console.log(`   ScheduledAt: ${article.scheduledAt || 'NULL'}`)
      console.log('')
    })

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkScheduledArticles()
