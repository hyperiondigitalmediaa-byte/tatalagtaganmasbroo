import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function resetTheme() {
  try {
    console.log('🔄 Menghapus theme lama dari database...')
    
    // Hapus semua theme settings
    const deleted = await prisma.siteSettings.deleteMany({
      where: {
        category: 'theme',
      },
    })
    
    console.log(`✅ Berhasil menghapus ${deleted.count} theme settings`)
    
    console.log('🎨 Mengisi theme default (merah)...')
    
    // Insert theme default merah
    const defaultTheme = [
      { key: 'primaryColor', value: '#dc2626', category: 'theme' },
      { key: 'secondaryColor', value: '#10b981', category: 'theme' },
      { key: 'accentColor', value: '#f59e0b', category: 'theme' },
      { key: 'backgroundColor', value: '#ffffff', category: 'theme' },
      { key: 'textColor', value: '#1f2937', category: 'theme' },
      { key: 'fontFamily', value: 'Inter', category: 'theme' },
    ]
    
    for (const setting of defaultTheme) {
      await prisma.siteSettings.create({
        data: setting,
      })
      console.log(`  ✓ ${setting.key}: ${setting.value}`)
    }
    
    console.log('\n✨ Theme berhasil direset ke warna merah default!')
    console.log('🔄 Silakan refresh browser Anda (Ctrl+Shift+R atau Cmd+Shift+R)')
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

resetTheme()
