import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkDatabase() {
  try {
    console.log('🔍 Memeriksa tabel SiteSettings...\n')
    
    // Cek apakah tabel ada dengan mencoba query
    const settings = await prisma.siteSettings.findMany({
      take: 5,
    })
    
    console.log('✅ Tabel SiteSettings ditemukan!')
    console.log(`📊 Total records: ${settings.length}\n`)
    
    if (settings.length > 0) {
      console.log('📋 Sample data:')
      settings.forEach(setting => {
        console.log(`  - ${setting.key} (${setting.category}): ${setting.value}`)
      })
    } else {
      console.log('ℹ️  Tabel kosong (belum ada data)')
    }
    
    console.log('\n✨ Database siap digunakan untuk fitur Logo & Favicon!')
    
  } catch (error: any) {
    console.error('❌ Error:', error.message)
    
    if (error.code === 'P2021') {
      console.log('\n⚠️  Tabel SiteSettings tidak ditemukan!')
      console.log('💡 Solusi: Jalankan migration Prisma')
      console.log('   Command: npx prisma migrate dev')
    }
  } finally {
    await prisma.$disconnect()
  }
}

checkDatabase()
