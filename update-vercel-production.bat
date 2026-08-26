@echo off
echo Updating Vercel Environment Variables for Production...
echo.

REM NEXTAUTH_URL
echo Updating NEXTAUTH_URL...
vercel env rm NEXTAUTH_URL production --yes
echo https://news-dusky-delta.vercel.app | vercel env add NEXTAUTH_URL production

REM NEXT_PUBLIC_SITE_URL
echo Updating NEXT_PUBLIC_SITE_URL...
vercel env rm NEXT_PUBLIC_SITE_URL production --yes
echo https://news-dusky-delta.vercel.app | vercel env add NEXT_PUBLIC_SITE_URL production

REM Google OAuth
echo Updating GOOGLE_CLIENT_ID...
vercel env rm GOOGLE_CLIENT_ID production --yes
echo 899111055025-ei4vjieupvgak2g2mikd5s4ljdpj1im4.apps.googleusercontent.com | vercel env add GOOGLE_CLIENT_ID production

echo Updating GOOGLE_CLIENT_SECRET...
vercel env rm GOOGLE_CLIENT_SECRET production --yes
echo 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 | vercel env add GOOGLE_CLIENT_SECRET production

echo.
echo ✅ Environment variables updated!
echo.
echo 🚀 Now redeploy with: vercel --prod
pause
