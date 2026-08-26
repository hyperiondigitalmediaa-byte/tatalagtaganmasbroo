/**
 * Setup New Database Script
 * Script untuk setup database baru setelah ganti akun Neon DB
 * 
 * Langkah yang dilakukan:
 * 1. Push schema ke database
 * 2. Create admin user
 * 3. Seed categories
 * 4. Seed sidebar widgets
 * 5. Create default settings
 */

import { PrismaClient } from '@prisma/client'
import { execSync } from 'child_process'

const prisma = new PrismaClient()

async function setupDatabase() {
  console.log('🚀 Starting database setup...\n')

  try {
    // Step 1: Push schema
    console.log('📋 Step 1: Pushing database schema...')
    execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' })
    console.log('✅ Schema pushed successfully\n')

    // Step 2: Create default settings
    console.log('⚙️  Step 2: Creating default settings...')
    await createDefaultSettings()
    console.log('✅ Default settings created\n')

    // Step 3: Run existing scripts
    console.log('👤 Step 3: Creating admin user...')
    execSync('npm run create-admin', { stdio: 'inherit' })
    console.log('✅ Admin user created\n')

    console.log('📁 Step 4: Seeding categories...')
    execSync('npm run seed-categories', { stdio: 'inherit' })
    console.log('✅ Categories seeded\n')

    console.log('📊 Step 5: Seeding sidebar widgets...')
    execSync('npm run seed-sidebar', { stdio: 'inherit' })
    console.log('✅ Sidebar widgets seeded\n')

    console.log('🎉 Database setup completed successfully!')
    console.log('\n📝 Next steps:')
    console.log('   1. Run: npx prisma studio (to verify data)')
    console.log('   2. Update Vercel environment variables')
    console.log('   3. Deploy: vercel --prod --yes')
    console.log('\n🔐 Default admin credentials:')
    console.log('   Check the output from create-admin script above')

  } catch (error) {
    console.error('❌ Error during setup:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

async function createDefaultSettings() {
  // Create default site settings if not exists
  const settings = await prisma.setting.findFirst()
  
  if (!settings) {
    await prisma.setting.create({
      data: {
        siteName: 'Portal Berita',
        siteDescription: 'Portal berita terkini dan terpercaya',
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        logo: '/logo.png',
        favicon: '/favicon.ico',
        metaTitle: 'Portal Berita - Berita Terkini',
        metaDescription: 'Sumber berita terpercaya untuk informasi terkini',
        metaKeywords: 'berita, news, portal berita, informasi terkini',
        ogImage: '/og-image.png',
        enableComments: true,
        enableNewsletter: false,
        articlesPerPage: 12,
        showAuthor: true,
        showPublishDate: true,
        showCategory: true,
        headerCode: '',
        footerCode: '',
        googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID || '',
        facebookAppId: '',
        disqusShortname: '',
        contactEmail: process.env.ADMIN_EMAIL || 'admin@portalberita.com',
        contactPhone: '',
        contactAddress: '',
        socialFacebook: '',
        socialTwitter: '',
        socialInstagram: '',
        socialYoutube: '',
        maintenanceMode: false,
        maintenanceMessage: 'Website sedang dalam maintenance. Mohon coba lagi nanti.',
      }
    })
    console.log('   ✓ Default settings created')
  } else {
    console.log('   ℹ Settings already exist, skipping...')
  }

  // Create default theme settings if not exists
  const theme = await prisma.theme.findFirst()
  
  if (!theme) {
    await prisma.theme.create({
      data: {
        name: 'Default Theme',
        primaryColor: '#3b82f6',
        secondaryColor: '#8b5cf6',
        accentColor: '#ec4899',
        backgroundColor: '#ffffff',
        textColor: '#1f2937',
        linkColor: '#3b82f6',
        fontFamily: 'Inter',
        fontSize: '16',
        headerLayout: 'default',
        footerLayout: 'default',
        sidebarPosition: 'right',
        cardStyle: 'default',
        buttonStyle: 'rounded',
        customCSS: '',
        customJS: '',
        isActive: true,
      }
    })
    console.log('   ✓ Default theme created')
  } else {
    console.log('   ℹ Theme already exists, skipping...')
  }
}

// Run the setup
setupDatabase()
