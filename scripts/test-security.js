#!/usr/bin/env node

/**
 * Script untuk test security features
 * Jalankan: node scripts/test-security.js
 */

const crypto = require('crypto');

console.log('\n🔒 SECURITY TEST\n');
console.log('='.repeat(60));

// Test 1: Check CRON_SECRET strength
console.log('\n📋 Test 1: CRON_SECRET Strength');
console.log('-'.repeat(60));

const cronSecret = process.env.CRON_SECRET || '';

if (!cronSecret) {
  console.log('❌ FAILED: CRON_SECRET tidak ditemukan');
} else if (cronSecret.length < 32) {
  console.log(`⚠️  WARNING: CRON_SECRET terlalu pendek (${cronSecret.length} karakter)`);
  console.log('   Rekomendasi: Minimal 32 karakter');
} else if (cronSecret.includes('secret') || cronSecret.includes('password') || cronSecret.includes('key')) {
  console.log('⚠️  WARNING: CRON_SECRET mengandung kata umum');
  console.log('   Rekomendasi: Gunakan random string');
} else {
  console.log(`✅ PASSED: CRON_SECRET kuat (${cronSecret.length} karakter)`);
}

// Test 2: Check NEXTAUTH_SECRET strength
console.log('\n📋 Test 2: NEXTAUTH_SECRET Strength');
console.log('-'.repeat(60));

const nextAuthSecret = process.env.NEXTAUTH_SECRET || '';

if (!nextAuthSecret) {
  console.log('❌ FAILED: NEXTAUTH_SECRET tidak ditemukan');
} else if (nextAuthSecret.length < 32) {
  console.log(`⚠️  WARNING: NEXTAUTH_SECRET terlalu pendek (${nextAuthSecret.length} karakter)`);
  console.log('   Rekomendasi: Minimal 32 karakter');
} else {
  console.log(`✅ PASSED: NEXTAUTH_SECRET kuat (${nextAuthSecret.length} karakter)`);
}

// Test 3: Check Database URL
console.log('\n📋 Test 3: Database Connection');
console.log('-'.repeat(60));

const dbUrl = process.env.DATABASE_URL || '';

if (!dbUrl) {
  console.log('❌ FAILED: DATABASE_URL tidak ditemukan');
} else if (dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1')) {
  console.log('⚠️  WARNING: Database masih localhost');
} else if (dbUrl.includes('password') || dbUrl.includes('admin123')) {
  console.log('⚠️  WARNING: Database password lemah');
} else {
  console.log('✅ PASSED: Database URL configured');
}

// Test 4: Check Cloudinary secrets
console.log('\n📋 Test 4: Cloudinary Configuration');
console.log('-'.repeat(60));

const cloudinarySecret = process.env.CLOUDINARY_API_SECRET || '';

if (!cloudinarySecret) {
  console.log('❌ FAILED: CLOUDINARY_API_SECRET tidak ditemukan');
} else if (cloudinarySecret.length < 20) {
  console.log('⚠️  WARNING: CLOUDINARY_API_SECRET terlalu pendek');
} else {
  console.log('✅ PASSED: Cloudinary configured');
}

// Test 5: Check Turnstile secrets
console.log('\n📋 Test 5: Turnstile CAPTCHA');
console.log('-'.repeat(60));

const turnstileSecret = process.env.TURNSTILE_SECRET_KEY || '';

if (!turnstileSecret) {
  console.log('❌ FAILED: TURNSTILE_SECRET_KEY tidak ditemukan');
} else if (turnstileSecret.startsWith('1x0000')) {
  console.log('⚠️  WARNING: Menggunakan test key (jangan untuk production!)');
} else {
  console.log('✅ PASSED: Turnstile configured');
}

// Test 6: Check Redis (optional)
console.log('\n📋 Test 6: Redis Cache (Optional)');
console.log('-'.repeat(60));

const redisUrl = process.env.UPSTASH_REDIS_REST_URL || '';

if (!redisUrl) {
  console.log('⚠️  INFO: Redis tidak dikonfigurasi (rate limiting pakai in-memory)');
} else {
  console.log('✅ PASSED: Redis configured');
}

// Summary
console.log('\n' + '='.repeat(60));
console.log('\n📊 SUMMARY\n');

let passed = 0;
let failed = 0;
let warnings = 0;

// Count results (simplified)
if (cronSecret && cronSecret.length >= 32) passed++; else failed++;
if (nextAuthSecret && nextAuthSecret.length >= 32) passed++; else failed++;
if (dbUrl && !dbUrl.includes('localhost')) passed++; else warnings++;
if (cloudinarySecret && cloudinarySecret.length >= 20) passed++; else warnings++;
if (turnstileSecret && !turnstileSecret.startsWith('1x0000')) passed++; else warnings++;

console.log(`✅ Passed: ${passed}`);
console.log(`⚠️  Warnings: ${warnings}`);
console.log(`❌ Failed: ${failed}`);

if (failed === 0 && warnings === 0) {
  console.log('\n🎉 EXCELLENT! Security configuration sempurna!');
} else if (failed === 0) {
  console.log('\n✅ GOOD! Security configuration bagus, ada beberapa warning.');
} else {
  console.log('\n⚠️  ATTENTION! Ada masalah yang harus diperbaiki!');
}

console.log('\n💡 Tips:');
console.log('   - Generate secret baru: node scripts/generate-secrets.js');
console.log('   - Update di Vercel: vercel env add CRON_SECRET');
console.log('   - Jangan commit .env ke Git!');
console.log('');
