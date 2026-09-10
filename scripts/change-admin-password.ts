import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import * as readline from 'readline'

const prisma = new PrismaClient()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve)
  })
}

async function changeAdminPassword() {
  try {
    console.log('\n🔐 GANTI PASSWORD ADMIN\n')
    
    // Input email
    const email = await question('Email admin: ')
    
    if (!email) {
      console.error('❌ Email tidak boleh kosong!')
      process.exit(1)
    }
    
    // Cek apakah user ada
    const user = await prisma.user.findUnique({
      where: { email }
    })
    
    if (!user) {
      console.error(`❌ User dengan email "${email}" tidak ditemukan!`)
      process.exit(1)
    }
    
    console.log(`✅ User ditemukan: ${user.name} (${user.email})`)
    
    // Input password baru
    const newPassword = await question('\nPassword baru: ')
    
    if (!newPassword || newPassword.length < 6) {
      console.error('❌ Password minimal 6 karakter!')
      process.exit(1)
    }
    
    // Konfirmasi
    const confirm = await question(`\nYakin ganti password untuk ${email}? (y/n): `)
    
    if (confirm.toLowerCase() !== 'y') {
      console.log('❌ Dibatalkan')
      process.exit(0)
    }
    
    // Hash password
    console.log('\n🔄 Hashing password...')
    const hashedPassword = bcrypt.hashSync(newPassword, 10)
    
    // Update database
    console.log('🔄 Update database...')
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    })
    
    console.log('\n✅ PASSWORD BERHASIL DIGANTI!')
    console.log(`\n📧 Email: ${email}`)
    console.log(`🔑 Password: ${newPassword}`)
    console.log('\n⚠️  SIMPAN PASSWORD INI DI TEMPAT AMAN!\n')
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    rl.close()
    await prisma.$disconnect()
  }
}

changeAdminPassword()
