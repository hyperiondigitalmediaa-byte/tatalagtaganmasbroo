# 🚀 CARA DEPLOY PALING MUDAH (5 MENIT)

## ✅ Solusi Termudah: Upload Folder via Dashboard

### **Step 1: Buka Vercel Dashboard**
1. Buka browser: https://vercel.com/new
2. Login dengan akun Anda

### **Step 2: Pilih "Browse" untuk Upload Folder**
1. Di halaman "Import Git Repository", scroll ke bawah
2. Cari tulisan **"Or, deploy a Template or select a folder"**
3. Klik **"Browse"** atau **"Select a folder"**
4. Pilih folder `C:\news` (folder project ini)
5. Klik **"Upload"**

### **Step 3: Configure Project**
Vercel akan otomatis detect Next.js. Pastikan:
- **Framework Preset:** Next.js ✅
- **Build Command:** `next build` ✅
- **Output Directory:** (kosongkan) ✅
- **Install Command:** `npm install` ✅

Klik **"Deploy"**

### **Step 4: Tunggu Build (2-3 menit)**
- Vercel akan build project
- Jika ada error database, itu normal (belum ada env vars)
- Lanjut ke step berikutnya

---

## 🔧 Step 5: Tambahkan Environment Variables

Setelah deploy (meskipun error), tambahkan env vars:

### **Cara:**
1. Di dashboard project, klik tab **"Settings"**
2. Klik **"Environment Variables"** di sidebar kiri
3. Tambahkan satu per satu (copy dari bawah):

### **Environment Variables:**

**Database:**
```
Name: DATABASE_URL
Value: postgresql://neondb_owner:npg_C2i9HaYJxVQh@ep-ancient-fire-a1xfw43f-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
Environment: Production, Preview, Development
```

```
Name: DIRECT_DATABASE_URL
Value: postgresql://neondb_owner:npg_C2i9HaYJxVQh@ep-ancient-fire-a1xfw43f.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
Environment: Production, Preview, Development
```

**NextAuth:**
```
Name: NEXTAUTH_SECRET
Value: vVsEMfl5EC1O3c4neRB3T3/NtlW50jyU6630WFxGlkA=
Environment: Production, Preview, Development
```

```
Name: NEXTAUTH_URL
Value: https://your-project-name.vercel.app
Environment: Production
```
⚠️ **GANTI** `your-project-name` dengan URL project Anda!

**Google OAuth:**
```
Name: GOOGLE_CLIENT_ID
Value: 899111055025-ei4vjieupvgak2g2mikd5s4ljdpj1im4.apps.googleusercontent.com
Environment: Production, Preview, Development
```

```
Name: GOOGLE_CLIENT_SECRET
Value: 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
Environment: Production, Preview, Development
```

**Cloudinary:**
```
Name: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
Value: droqacd9z
Environment: Production, Preview, Development
```

```
Name: CLOUDINARY_API_KEY
Value: 684392861579935
Environment: Production, Preview, Development
```

```
Name: CLOUDINARY_API_SECRET
Value: fK_q8tLtPWOU5eXQLl7fix00JYQ
Environment: Production, Preview, Development
```

**Turnstile (CAPTCHA):**
```
Name: NEXT_PUBLIC_TURNSTILE_SITE_KEY
Value: 0x4AAAAAAB_dlZwPvXBU8UKw
Environment: Production, Preview, Development
```

```
Name: TURNSTILE_SECRET_KEY
Value: 0x4AAAAAAB_dlXE_WzvGmr25WHUkzT9celk
Environment: Production, Preview, Development
```

**Cron & Analytics:**
```
Name: CRON_SECRET
Value: cron-secret-portal-berita-2024-secure-key-xyz789
Environment: Production, Preview, Development
```

```
Name: NEXT_PUBLIC_GA_ID
Value: G-JTPLZKCR8Z
Environment: Production, Preview, Development
```

**Site Config:**
```
Name: NEXT_PUBLIC_SITE_URL
Value: https://your-project-name.vercel.app
Environment: Production
```
⚠️ **GANTI** `your-project-name` dengan URL project Anda!

```
Name: NEXT_PUBLIC_SITE_NAME
Value: Portal Berita
Environment: Production, Preview, Development
```

---

## 🔄 Step 6: Redeploy

Setelah semua env vars ditambahkan:

1. Klik tab **"Deployments"**
2. Klik **"..."** (titik tiga) pada deployment terakhir
3. Klik **"Redeploy"**
4. Centang **"Use existing Build Cache"** (optional)
5. Klik **"Redeploy"**
6. Tunggu 2-3 menit

---

## ✅ Step 7: Update Google OAuth

Setelah deploy berhasil:

1. Buka: https://console.cloud.google.com/apis/credentials
2. Pilih OAuth 2.0 Client ID Anda
3. Di **"Authorized redirect URIs"**, tambahkan:
   ```
   https://your-project-name.vercel.app/api/auth/callback/google
   ```
4. Klik **"Save"**

---

## 🎉 SELESAI!

Website Anda sekarang live di:
```
https://your-project-name.vercel.app
```

### **Test:**
- [ ] Buka homepage
- [ ] Login admin: `/admin/login`
- [ ] Buat artikel baru
- [ ] Test search
- [ ] Test comment

---

## 🐛 Jika Ada Error:

### **Error: "Database connection failed"**
- Cek apakah `DATABASE_URL` dan `DIRECT_DATABASE_URL` sudah benar
- Redeploy lagi

### **Error: "NEXTAUTH_SECRET missing"**
- Cek apakah `NEXTAUTH_SECRET` sudah ditambahkan
- Redeploy lagi

### **Error: "Google OAuth not working"**
- Update redirect URI di Google Cloud Console
- Pastikan `NEXTAUTH_URL` sudah benar (pakai URL production)

---

## 💡 Tips:

1. **Simpan URL project Anda** untuk update env vars
2. **Screenshot setiap step** jika ada error
3. **Jangan panik** - semua bisa diperbaiki
4. **Tanya saya** jika ada yang tidak jelas

---

**Good luck! 🚀**

Cara ini 100% berhasil karena tidak pakai CLI, langsung upload via dashboard.
