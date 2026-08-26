#!/bin/bash

# Script untuk update Vercel environment variables ke Supabase
# Run: bash scripts/update-vercel-env.sh

echo "🔧 Updating Vercel Environment Variables..."
echo ""

# Database URLs
echo "📦 Updating DATABASE_URL..."
vercel env rm DATABASE_URL production --yes
echo "postgresql://postgres.mybuzevyifgwmysacchc:tagegband12@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres" | vercel env add DATABASE_URL production

echo "📦 Updating DIRECT_DATABASE_URL..."
vercel env rm DIRECT_DATABASE_URL production --yes
echo "postgresql://postgres.mybuzevyifgwmysacchc:tagegband12@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres" | vercel env add DIRECT_DATABASE_URL production

# Site URLs
echo "📦 Updating NEXTAUTH_URL..."
vercel env rm NEXTAUTH_URL production --yes
echo "https://news-dusky-delta.vercel.app" | vercel env add NEXTAUTH_URL production

echo "📦 Updating NEXT_PUBLIC_SITE_URL..."
vercel env rm NEXT_PUBLIC_SITE_URL production --yes
echo "https://news-dusky-delta.vercel.app" | vercel env add NEXT_PUBLIC_SITE_URL production

echo ""
echo "✅ Environment variables updated!"
echo ""
echo "🚀 Now redeploy with: vercel --prod"
