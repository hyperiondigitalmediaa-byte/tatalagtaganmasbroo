# 🔄 Panduan Ganti Akun Neon DB

## 📋 Langkah-langkah

### 1️⃣ Buat Akun Neon DB Baru

1. Buka https://neon.tech
2. Klik **Sign Up**
3. Daftar dengan:
   - Email baru yang mudah diingat (contoh: deeaw@gmail.com)
   - Atau gunakan GitHub/Google login
4. Verifikasi email jika diminta
5. Setelah login, klik **Create Project**

### 2️⃣ Konfigurasi Project Neon

Saat membuat project:
- **Project Name**: `portal-berita` (atau nama lain)
- **Region**: Pilih `Singapore (ap-southeast-1)` untuk performa terbaik
- **Postgres Version**: Gunakan yang terbaru (default)

### 3️⃣ Dapatkan Connection Strings

Setelah project dibuat, di dashboard Neon:

1. Klik project yang baru dibuat
2. Pergi ke tab **Dashboard** atau **Connection Details**
3. Copy **2 connection strings**:

   **Pooled Connection** (untuk aplikasi):
   ```
   postgresql://[user]:[password]@[host]-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   ```

   **Direct Connection** (untuk migrations):
   ```
   postgresql://[user]:[password]@[host].ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   ```

### 4️⃣ Update File `.env`

Buka file `.env` di root project, lalu update 2 baris ini:

```env
# Ganti dengan Pooled Connection String
DATABASE_URL="postgresql://[user]:[password]@[host]-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

# Ganti dengan Direct Connection String  
DIRECT_DATABASE_URL="postgresql://[user]:[password]@[host].ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
```

**Contoh setelah diganti:**
```env
DATABASE_URL="postgresql://neondb_owner:npg_AbCd1234XyZ@ep-new-project-a1xyz-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
DIRECT_DATABASE_URL="postgresql://neondb_owner:npg_AbCd1234XyZ@ep-new-project-a1xyz.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
```

### 5️⃣ Update Environment Variables di Vercel

1. Buka https://vercel.com/bacaan-news-projects/portal-berita/settings/environment-variables
2. Cari variable `DATABASE_URL` dan `DIRECT_DATABASE_URL`
3. Klik **Edit** pada masing-masing variable
4. Paste connection string yang baru
5. Pilih environment: **Production, Preview, Development** (centang semua)
6. Klik **Save**

### 6️⃣ Jalankan Database Migration

Setelah `.env` diupdate, jalankan command berikut di terminal:

```bash
# Generate Prisma Client dengan config baru
npx prisma generate

# Push schema ke database baru (akan membuat semua tabel)
npx prisma db push

# Atau gunakan migration (lebih aman untuk production)
npx prisma migrate deploy
```

### 7️⃣ Seed Database dengan Data Awal

Jalankan seed untuk membuat:
- User admin default
- Kategori default
- Settings default
- dll

```bash
npm run seed
```

Atau jika belum ada script seed, jalankan:

```bash
npx prisma db seed
```

### 8️⃣ Verify Database

Cek apakah database sudah terisi:

```bash
# Buka Prisma Studio untuk melihat data
npx prisma studio
```

Atau langsung buka di browser: http://localhost:5555

### 9️⃣ Deploy Ulang ke Vercel

Setelah environment variables diupdate di Vercel, deploy ulang:

```bash
vercel --prod --yes
```

Atau trigger deployment dari Git:
```bash
git add .
git commit -m "Update database connection to new Neon account"
git push
```

### 🔟 Test Aplikasi

1. Buka site production: https://portal-berita-bdadpcji6-bacaan-news-projects.vercel.app
2. Coba login ke `/admin/login` dengan credentials dari seed
3. Test create artikel, kategori, dll
4. Pastikan semua berfungsi normal

## ✅ Checklist

- [ ] Buat akun Neon DB baru
- [ ] Buat project baru di Neon
- [ ] Copy 2 connection strings (pooled & direct)
- [ ] Update `.env` lokal
- [ ] Update environment variables di Vercel
- [ ] Run `npx prisma db push` atau `migrate deploy`
- [ ] Run `npm run seed`
- [ ] Verify di Prisma Studio
- [ ] Deploy ke Vercel
- [ ] Test aplikasi production

## 🎯 Credentials Default (Setelah Seed)

Jika menggunakan seed script yang ada:

**Admin Login:**
- Email: `admin@example.com` (atau sesuai seed script)
- Password: `admin123` (atau sesuai seed script)

## 📝 Notes

- Database baru = fresh start, semua data lama hilang
- Pastikan backup data lama jika masih diperlukan
- Connection string mengandung password, jangan commit ke Git
- Gunakan `.env.local` untuk development
- Vercel akan auto-deploy setelah push ke Git

## 🔒 Security Tips

- Simpan credentials Neon di password manager
- Jangan share connection string ke orang lain
- Enable 2FA di akun Neon jika tersedia
- Gunakan email yang aman dan mudah diingat

## 🆘 Troubleshooting

**Error: "Can't reach database server"**
- Cek apakah connection string benar
- Cek apakah IP tidak di-block oleh Neon
- Cek internet connection

**Error: "Authentication failed"**
- Cek username & password di connection string
- Copy ulang connection string dari Neon dashboard

**Migration failed:**
- Gunakan `npx prisma db push --force-reset` untuk reset database
- Atau drop database di Neon dashboard dan buat baru

## 🔗 Resources

- Neon Dashboard: https://console.neon.tech
- Prisma Docs: https://www.prisma.io/docs
- Vercel Dashboard: https://vercel.com/dashboard
