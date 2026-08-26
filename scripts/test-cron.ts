/**
 * Test script untuk cron job publish scheduled articles
 * 
 * Usage:
 *   npm run test-cron
 */

import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const CRON_SECRET = process.env.CRON_SECRET || "your-secret-key"
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

async function testCronJob() {
  console.log("🧪 Testing Cron Job: Publish Scheduled Articles\n")
  console.log(`📍 URL: ${BASE_URL}/api/cron/publish-scheduled`)
  console.log(`🔑 Secret: ${CRON_SECRET}\n`)

  try {
    const response = await fetch(`${BASE_URL}/api/cron/publish-scheduled`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${CRON_SECRET}`
      }
    })

    const data = await response.json()

    if (response.ok) {
      console.log("✅ Success!")
      console.log(`📊 Result:`, data)
      
      if (data.count > 0) {
        console.log(`\n📝 Published Articles:`)
        data.articles.forEach((article: any, index: number) => {
          console.log(`   ${index + 1}. ${article.title}`)
          console.log(`      Scheduled: ${new Date(article.scheduledAt).toLocaleString('id-ID')}`)
        })
      } else {
        console.log("\n💡 No articles to publish at this time")
      }
    } else {
      console.log("❌ Failed!")
      console.log(`Error: ${data.error}`)
    }
  } catch (error) {
    console.error("❌ Error:", error)
  }
}

testCronJob()
