#!/usr/bin/env node

/**
 * Script untuk generate secret keys yang aman
 * Jalankan: node scripts/generate-secrets.js
 */

const crypto = require('crypto');

console.log('\n🔐 GENERATE SECRET KEYS\n');
console.log('=' .repeat(60));

// 1. NEXTAUTH_SECRET
const nextAuthSecret = crypto.randomBytes(32).toString('base64');
console.log('\n1. NEXTAUTH_SECRET (Copy ini):');
console.log('   ' + nextAuthSecret);

// 2. CRON_SECRET
const cronSecret = crypto.randomBytes(32).toString('hex');
console.log('\n2. CRON_SECRET (Copy ini):');
console.log('   ' + cronSecret);

// 3. Alternative NEXTAUTH_SECRET (jika yang pertama tidak work)
const nextAuthSecret2 = crypto.randomBytes(32).toString('hex');
console.log('\n3. NEXTAUTH_SECRET Alternative (Copy ini):');
console.log('   ' + nextAuthSecret2);

console.log('\n' + '='.repeat(60));
console.log('\n✅ Secret keys berhasil di-generate!');
console.log('\n📋 Langkah selanjutnya:');
console.log('   1. Copy secret keys di atas');
console.log('   2. Update di Vercel Environment Variables');
console.log('   3. Update di file .env lokal');
console.log('   4. Redeploy: vercel --prod');
console.log('\n💡 Jangan share secret keys ini ke siapa pun!\n');
