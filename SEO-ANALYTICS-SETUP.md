# SEO, Analytics, Backup & Email Setup Guide

## ✅ Fitur yang Sudah Diimplementasikan

### 1. SEO Optimization

#### A. Sitemap.xml
- **URL**: `/sitemap.xml`
- **Auto-generated** dari database (artikel, kategori, halaman)
- **Update otomatis** setiap ada perubahan data
- **Submit ke Google Search Console**: https://search.google.com/search-console

#### B. Robots.txt
- **URL**: `/robots.txt`
- **Mengizinkan** semua bot untuk crawl
- **Memblokir** `/admin/` dan `/api/`
- **Sitemap reference** sudah included

#### C. Meta Tags (SEO)
Setiap halaman artikel sudah punya:
- ✅ Title & Description (custom atau auto-generate)
- ✅ Open Graph tags (Facebook, LinkedIn)
- ✅ Twitter Card tags
- ✅ Canonical URL
- ✅ Author & Published Date
- ✅ Keywords & Category

**Cara Set Custom Meta:**
1. Edit artikel di admin
2. Isi field "Meta Title" dan "Meta Description"
3. Kalau kosong, akan pakai judul & excerpt artikel

---

### 2. Google Analytics

#### Setup Google Analytics:

1. **Buat Property di Google Analytics**
   - Buka https://analytics.google.com/
   - Klik "Admin" > "Create Property"
   - Pilih "Web" platform
   - Copy **Measurement ID** (format: G-XXXXXXXXXX)

2. **Tambahkan ke .env**
   ```env
   NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
   ```

3. **Restart Server**
   ```bash
   npm run dev
   ```

4. **Test**
   - Buka website
   - Buka Google Analytics Real-Time
   - Lihat visitor muncul

#### Fitur Analytics yang Tracked:
- ✅ Page views
- ✅ User sessions
- ✅ Traffic sources
- ✅ Device & browser info
- ✅ Geographic location

---

### 3. Database Backup & Restore

#### Cara Backup:

1. Login sebagai **ADMIN**
2. Buka menu **"Backup"** di sidebar
3. Klik **"Download Backup"**
4. File JSON akan terdownload (format: `backup-timestamp.json`)
5. Simpan di tempat aman (Google Drive, Dropbox, dll)

#### Cara Restore:

1. Login sebagai **ADMIN**
2. Buka menu **"Backup"**
3. Klik **"Upload Backup File"**
4. Pilih file backup JSON
5. Tunggu proses selesai
6. Data akan ter-restore

#### ⚠️ Peringatan Restore:
- Restore akan **menimpa data existing**
- **Backup dulu** sebelum restore
- Test di development dulu sebelum production

#### Backup Schedule (Rekomendasi):
- **Harian**: Otomatis via cron job (setup di server)
- **Manual**: Sebelum update besar atau migrasi
- **Retention**: Simpan 7 backup terakhir

---

### 4. Email Notification

#### Setup Email (Gmail):

1. **Enable 2-Factor Authentication**
   - Buka https://myaccount.google.com/security
   - Enable "2-Step Verification"

2. **Generate App Password**
   - Buka https://myaccount.google.com/apppasswords
   - Pilih "Mail" dan "Other (Custom name)"
   - Ketik "Portal Berita"
   - Copy password yang di-generate (16 karakter)

3. **Update .env**
   ```env
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT="587"
   SMTP_SECURE="false"
   SMTP_USER="your-email@gmail.com"
   SMTP_PASS="your-16-char-app-password"
   SMTP_FROM_NAME="Portal Berita"
   SMTP_FROM_EMAIL="noreply@portalberita.com"
   ADMIN_EMAIL="admin@portalberita.com"
   ```

4. **Restart Server**

#### Email yang Dikirim:

**A. Komentar Baru (ke Admin)**
- Trigger: User submit komentar
- Recipient: ADMIN_EMAIL
- Content: Info komentar + link moderasi

**B. Komentar Disetujui (ke User)**
- Trigger: Admin approve komentar
- Recipient: User email
- Content: Notifikasi approval + link artikel

#### Troubleshooting Email:

**Email tidak terkirim?**
1. Cek SMTP credentials di .env
2. Cek Gmail App Password valid
3. Cek firewall tidak block port 587
4. Cek log server untuk error

**Email masuk spam?**
1. Setup SPF record di DNS
2. Setup DKIM di email provider
3. Gunakan domain email sendiri (bukan Gmail)
4. Warm up email (kirim bertahap)

---

### 5. Performance Optimization

#### Sudah Diimplementasikan:
- ✅ Next.js Image optimization (auto WebP)
- ✅ Static page generation (ISR)
- ✅ Database query optimization
- ✅ Lazy loading images
- ✅ Code splitting otomatis

#### Rekomendasi Production:
1. **Enable Caching**
   - Redis untuk session & cache
   - CDN untuk static assets

2. **Database Optimization**
   - Index pada kolom yang sering di-query
   - Connection pooling (sudah ada di Prisma)

3. **Monitoring**
   - Vercel Analytics (built-in)
   - Sentry untuk error tracking
   - Uptime monitoring (UptimeRobot)

---

## Production Checklist

Sebelum deploy production:

### Environment Variables
- [ ] Update `NEXT_PUBLIC_SITE_URL` dengan domain production
- [ ] Update `NEXTAUTH_URL` dengan domain production
- [ ] Set `NEXTAUTH_SECRET` yang kuat (random 32 char)
- [ ] Set `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`
- [ ] Set `NEXT_PUBLIC_GA_ID` (Google Analytics)
- [ ] Set SMTP credentials untuk email
- [ ] Set `ADMIN_EMAIL` untuk notifikasi

### SEO
- [ ] Submit sitemap ke Google Search Console
- [ ] Submit sitemap ke Bing Webmaster Tools
- [ ] Verify domain ownership
- [ ] Setup Google Analytics property
- [ ] Install Google Tag Manager (optional)

### Security
- [ ] Enable HTTPS (SSL certificate)
- [ ] Setup CORS policy
- [ ] Rate limiting untuk API
- [ ] Content Security Policy (CSP)
- [ ] Regular security updates

### Backup
- [ ] Setup automated daily backup
- [ ] Test restore procedure
- [ ] Setup off-site backup storage
- [ ] Document recovery process

### Monitoring
- [ ] Setup uptime monitoring
- [ ] Setup error tracking (Sentry)
- [ ] Setup performance monitoring
- [ ] Setup log aggregation

---

## Support & Maintenance

### Regular Tasks:
- **Daily**: Check analytics & error logs
- **Weekly**: Review comments & moderate
- **Monthly**: Database backup & cleanup
- **Quarterly**: Security audit & updates

### Resources:
- Next.js Docs: https://nextjs.org/docs
- Prisma Docs: https://www.prisma.io/docs
- Google Analytics: https://analytics.google.com/
- Search Console: https://search.google.com/search-console
