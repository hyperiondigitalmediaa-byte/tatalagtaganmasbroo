# 🕐 Setup Cron Job di Vercel - Panduan Lengkap

## 🎯 Masalah

Anda sudah punya:
- ✅ CRON_SECRET di .env lokal
- ❌ CRON_SECRET belum di Vercel Environment Variables
- ❌ Cron Job belum di-setup di Vercel

## ✅ Solusi (15 Menit)

---

## STEP 1: Tambah CRON_SECRET ke Vercel (5 menit)

### Via Vercel Dashboard:

1. **Login ke Vercel:** https://vercel.com/dashboard

2. **Pilih project Anda** (klik nama project)

3. **Klik tab "Settings"** (di bagian atas)

4. **Klik "Environment Variables"** (di sidebar kiri)

5. **Klik tombol "Add New"** atau "Create"

6. **Isi form:**
   ```
   Key: CRON_SECRET
   Value: a49d15d3f1c7dc204ea5d1cb0b093cd434956fcaa66857bd427a84ebe840db86
   ```

7. **Select Environment:**
   - ✅ Production
   - ✅ Preview
   - ✅ Development

8. **Klik "Save"**

✅ **STEP 1 SELESAI!**

---

## STEP 2: Setup Cron Job (10 menit)

### Cara 1: Via vercel.json (Recommended) ✅

**File:** `vercel.json`

Saya sudah update file ini dengan konfigurasi:

```json
{
  "crons": [
    {
      "path": "/api/cron/publish-scheduled",
      "schedule": "0 * * * *"
    }
  ]
}
```

**Penjelasan:**
- `path`: Endpoint yang akan di-trigger
- `schedule`: Cron expression (setiap jam)
  - `0 * * * *` = Setiap jam pada menit ke-0
  - Contoh: 00:00, 01:00, 02:00, dst.

**Schedule Options:**
```
0 * * * *     = Setiap jam
0 */2 * * *   = Setiap 2 jam
0 0 * * *     = Setiap hari jam 00:00
0 12 * * *    = Setiap hari jam 12:00
*/15 * * * *  = Setiap 15 menit
```

---

### Cara 2: Via Vercel Dashboard (Alternative)

Jika cara 1 tidak work, gunakan cara ini:

1. **Login ke Vercel Dashboard**

2. **Pilih project Anda**

3. **Klik tab "Settings"**

4. **Klik "Cron Jobs"** (di sidebar kiri)

5. **Klik "Add Cron Job"**

6. **Isi form:**
   ```
   Name: Publish Scheduled Articles
   Path: /api/cron/publish-scheduled
   Schedule: 0 * * * *
   ```

7. **Klik "Create"**

✅ **STEP 2 SELESAI!**

---

## STEP 3: Deploy (2 menit)

Setelah update `vercel.json`, deploy ulang:

```bash
# Commit changes
git add vercel.json
git commit -m "Setup cron job"
git push

# Atau deploy langsung
vercel --prod
```

**Tunggu deployment selesai** (1-2 menit)

✅ **STEP 3 SELESAI!**

---

## STEP 4: Verifikasi Cron Job (3 menit)

### A. Cek di Vercel Dashboard

1. **Login ke Vercel Dashboard**
2. **Pilih project Anda**
3. **Klik tab "Deployments"**
4. **Klik deployment terakhir**
5. **Scroll ke bawah** → Cari bagian "Cron Jobs"
6. **Seharusnya ada:**
   ```
   ✅ Cron Job: /api/cron/publish-scheduled
   Schedule: 0 * * * *
   Status: Active
   ```

### B. Cek Logs

1. **Vercel Dashboard** → **Project**
2. **Klik tab "Logs"**
3. **Tunggu sampai jam berikutnya** (misal sekarang 10:30, tunggu sampai 11:00)
4. **Seharusnya ada log:**
   ```
   [Cron] /api/cron/publish-scheduled
   Status: 200
   Message: Successfully published 0 article(s)
   ```

✅ **STEP 4 SELESAI!**

---

## 🧪 Test Manual (Optional)

Jika tidak mau tunggu sampai jam berikutnya, test manual:

### Test 1: Tanpa Authorization (Harus Ditolak)

```bash
curl https://your-site.vercel.app/api/cron/publish-scheduled
```

**Expected:**
```json
{
  "error": "Unauthorized"
}
```

**Status:** 401 ✅

---

### Test 2: Dengan Authorization (Harus Berhasil)

```bash
curl https://your-site.vercel.app/api/cron/publish-scheduled \
  -H "Authorization: Bearer a49d15d3f1c7dc204ea5d1cb0b093cd434956fcaa66857bd427a84ebe840db86"
```

**Expected:**
```json
{
  "message": "Successfully published 0 article(s)",
  "count": 0
}
```

**Status:** 200 ✅

---

## 📋 Checklist

- [ ] CRON_SECRET sudah di .env lokal
- [ ] CRON_SECRET sudah di Vercel Environment Variables
- [ ] vercel.json sudah di-update
- [ ] Deploy ulang ke Vercel
- [ ] Cron Job muncul di Vercel Dashboard
- [ ] Test manual berhasil
- [ ] Tunggu jam berikutnya untuk test otomatis

---

## 🆘 Troubleshooting

### Problem 1: Cron Job Tidak Muncul di Dashboard

**Solusi:**
1. Pastikan `vercel.json` sudah di-commit
2. Deploy ulang: `vercel --prod`
3. Tunggu 2-3 menit
4. Refresh dashboard

---

### Problem 2: Cron Job Error 401 Unauthorized

**Gejala:**
- Logs: "Unauthorized"
- Status: 401

**Solusi:**
1. Cek CRON_SECRET di Vercel Environment Variables
2. Pastikan tidak ada typo
3. Pastikan tidak ada spasi di awal/akhir
4. Redeploy

**Cara Cek:**
```bash
# Di terminal lokal
vercel env ls

# Seharusnya ada:
# CRON_SECRET (Production, Preview, Development)
```

---

### Problem 3: Cron Job Tidak Jalan Otomatis

**Gejala:**
- Cron Job ada di dashboard
- Tapi tidak ada logs
- Artikel scheduled tidak auto-publish

**Solusi:**
1. Cek schedule di `vercel.json`
2. Pastikan format benar: `0 * * * *`
3. Tunggu sampai jam berikutnya
4. Cek logs di Vercel

**Cara Cek Schedule:**
- `0 * * * *` = Setiap jam pada menit ke-0
- Jika sekarang jam 10:30, tunggu sampai 11:00
- Jika sekarang jam 10:55, tunggu sampai 11:00

---

### Problem 4: Rate Limit Error (429)

**Gejala:**
- Logs: "Too many requests"
- Status: 429

**Solusi:**
- Ini normal jika cron job terlalu sering
- Tunggu 1 menit
- Coba lagi

---

## 💡 Tips

### 1. Monitoring Cron Job

**Cek logs setiap hari:**
1. Vercel Dashboard → Logs
2. Filter: `/api/cron/publish-scheduled`
3. Cek apakah ada error

### 2. Adjust Schedule

**Jika artikel jarang scheduled:**
```json
{
  "schedule": "0 */2 * * *"
}
```
(Setiap 2 jam, hemat resources)

**Jika artikel sering scheduled:**
```json
{
  "schedule": "*/30 * * * *"
}
```
(Setiap 30 menit, lebih responsif)

### 3. Test Scheduled Article

**Cara test:**
1. Buat artikel baru
2. Set status: "Scheduled"
3. Set scheduled time: 5 menit dari sekarang
4. Save
5. Tunggu sampai waktu scheduled
6. Tunggu cron job jalan (max 1 jam)
7. Cek apakah artikel sudah published

---

## 🎉 Selesai!

Setelah setup ini, cron job akan:
- ✅ Jalan otomatis setiap jam
- ✅ Cek artikel yang sudah scheduled
- ✅ Auto-publish artikel yang waktunya sudah tiba
- ✅ Aman dengan CRON_SECRET

---

## 📖 Dokumentasi Tambahan

- **CRON_SECRET Explained:** `CRON-SECRET-EXPLAINED.md`
- **Security Improvements:** `SECURITY-IMPROVEMENTS-DONE.md`
- **Vercel Cron Docs:** https://vercel.com/docs/cron-jobs

---

**Butuh bantuan?** Tanya saya jika ada yang tidak jelas! 😊
