import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkTheme() {
  try {
    console.log('🔍 Memeriksa theme di database...\n')
    
    const settings = await prisma.siteSettings.findMany({
      where: {
        category: 'theme',
      },
      orderBy: {
        key: 'asc',
      },
    })
    
    if (settings.length === 0) {
      console.log('⚠️  Tidak ada theme settings di database')
    } else {
      console.log('📊 Theme Settings:')
      settings.forEach(setting => {
        console.log(`  ${setting.key}: ${setting.value}`)
      })
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkTheme()
