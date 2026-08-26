/**
 * Auto-run cron job setiap 5 menit (untuk development)
 * 
 * Usage:
 *   npm run auto-cron
 * 
 * Tekan Ctrl+C untuk stop
 */

import dotenv from 'dotenv'

dotenv.config()

const CRON_SECRET = process.env.CRON_SECRET || "your-secret-key"
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
const INTERVAL = 5 * 60 * 1000 // 5 menit

async function runCron() {
  console.log(`⏰ [${new Date().toLocaleTimeString('id-ID')}] Running cron job...`)
  
  try {
    const response = await fetch(`${BASE_URL}/api/cron/publish-scheduled`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${CRON_SECRET}`
      }
    })

    const data = await response.json()

    if (response.ok) {
      if (data.count > 0) {
        console.log(`✅ Published ${data.count} article(s)`)
        data.articles.forEach((article: any) => {
          console.log(`   - ${article.title}`)
        })
      } else {
        console.log(`💤 No articles to publish`)
      }
    } else {
      console.log(`❌ Error: ${data.error}`)
    }
  } catch (error) {
    console.error("❌ Error:", error)
  }
  
  console.log(`⏳ Next run in 5 minutes...\n`)
}

console.log('🚀 Auto-cron started!')
console.log(`📍 URL: ${BASE_URL}/api/cron/publish-scheduled`)
console.log(`⏱️  Interval: Every 5 minutes`)
console.log(`🛑 Press Ctrl+C to stop\n`)

// Run immediately
runCron()

// Then run every 5 minutes
setInterval(runCron, INTERVAL)
