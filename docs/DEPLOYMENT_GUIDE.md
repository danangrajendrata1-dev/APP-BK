# DEPLOYMENT_GUIDE.md - Aplikasi BK Sederhana

## Tujuan

Panduan ini menyiapkan deployment frontend Next.js ke Vercel dengan backend Supabase yang sudah aman, sesuai PRD, technical design, schema, dan security rules project ini.

---

## 1. Arsitektur Deployment

- Frontend: Vercel
- Database: Supabase PostgreSQL
- Auth: Supabase Auth
- Storage: Supabase Storage

Folder yang dideploy ke Vercel:

```txt
frontend/
```

---

## 2. Environment Variable

Environment variable yang wajib disiapkan di Vercel:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Sumber nilainya:

- `NEXT_PUBLIC_SUPABASE_URL`: `Project URL` dari dashboard Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `anon public key` dari dashboard Supabase

Aturan penting:

- Jangan hardcode URL atau key di source code.
- Jangan commit `.env.local`.
- Jangan menyimpan service role key di frontend atau di Vercel frontend env.
- Samakan nilai env di lokal dan di Vercel agar hasil testing konsisten.

---

## 3. Checklist Supabase Sebelum Deploy

Pastikan langkah berikut sudah selesai:

- [ ] Project Supabase sudah dibuat.
- [ ] Migration schema utama sudah dijalankan.
- [ ] Migration RLS policy sudah dijalankan.
- [ ] Migration auth profile trigger sudah dijalankan.
- [ ] Tabel utama tersedia: `profiles`, `students`, `school_attendance`, `bk_service_attendance`, `counseling_records`, `student_assistances`, `class_assistances`, `documents`, `home_visits`, `confession_box`, `assessment_files`.
- [ ] RLS aktif di semua tabel utama.
- [ ] Tidak ada policy berbahaya seperti `using (true)` untuk data sensitif.
- [ ] Bucket storage sudah dibuat:
  - `assessment-files`
  - `document-files`
  - `home-visit-files`
- [ ] Bucket sensitif tidak diset public sembarangan.
- [ ] Policy storage membatasi akses file sensitif hanya untuk role yang sesuai.
- [ ] Signed URL dipakai untuk akses file sensitif bila diperlukan.
- [ ] Role default user baru tetap `siswa`.

SQL migration yang perlu dipastikan sudah dijalankan manual di Supabase SQL Editor:

- `supabase/migrations/001_initial_schema.sql`
- `supabase/migrations/002_rls_policies.sql`
- `supabase/migrations/003_auth_profiles.sql`

---

## 4. Checklist Vercel

Saat import project ke Vercel:

- [ ] Import repository yang benar.
- [ ] Root Directory di-set ke `frontend`.
- [ ] Framework terdeteksi sebagai Next.js.
- [ ] Build Command: `npm run build`
- [ ] Install Command: `npm install`
- [ ] Output Directory: default Vercel untuk Next.js
- [ ] Tambahkan environment variable:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Deploy ke environment yang sesuai, minimal `Preview` dan `Production`.

Catatan:

- Jika env diubah setelah deploy, lakukan redeploy agar nilai baru dipakai aplikasi.
- Jangan menaruh credential Supabase lain di project settings frontend jika tidak dibutuhkan.

---

## 5. Checklist Repository

Pastikan repository aman sebelum deploy:

- [ ] `.env.local` tidak ter-commit.
- [ ] `frontend/.env.local` tidak ter-commit.
- [ ] File contoh env yang boleh dibagikan hanya `frontend/.env.local.example`.
- [ ] Tidak ada credential asli di source code, README, atau file SQL.

Saat ini ignore rule yang relevan sudah tersedia di:

- `.gitignore`
- `frontend/.gitignore`

---

## 6. Final Verification Sebelum Production

Jalankan verifikasi lokal:

```bash
cd frontend
npm run lint
npm run build
```

Checklist functional setelah deploy:

- [ ] Halaman `/login` bisa dibuka.
- [ ] Halaman `/register` bisa dibuka.
- [ ] Login berhasil.
- [ ] Logout benar-benar membersihkan session.
- [ ] User belum login diarahkan ke `/login`.
- [ ] Role `siswa` hanya bisa mengakses `/confession-box`.
- [ ] Role `guru_bk` bisa membuka modul BK sesuai PRD.
- [ ] Role `admin` bisa membuka seluruh menu.
- [ ] Dashboard bisa dibuka oleh role yang berhak.
- [ ] Upload asesmen berhasil.
- [ ] Upload surat & dokumen berhasil.
- [ ] Upload home visit berhasil.
- [ ] Signed URL file sensitif berfungsi.
- [ ] Data curhat digital siswa tidak terbuka ke siswa lain.
- [ ] Tampilan mobile tetap rapi.

---

## 7. Uji Supabase Pasca Deploy

Lakukan pengecekan berikut di Supabase:

- [ ] User baru yang register otomatis masuk ke `profiles` dengan role `siswa`.
- [ ] RLS pada `students` menolak akses dari role `siswa`.
- [ ] RLS pada `confession_box` hanya memperbolehkan siswa melihat data miliknya sendiri jika fitur riwayat digunakan.
- [ ] Admin tetap bisa mengelola data penuh.
- [ ] Guru BK tetap bisa mengakses data BK sesuai policy.
- [ ] File `documents` dan `home_visits` tidak bisa dibuka publik tanpa akses yang valid.

---

## 8. Ringkasan Deploy Singkat

Urutan deploy yang disarankan:

1. Siapkan env lokal dari `frontend/.env.local.example`.
2. Jalankan migration SQL di Supabase.
3. Buat bucket storage dan policy storage.
4. Jalankan `npm run lint`.
5. Jalankan `npm run build`.
6. Push repository ke GitHub.
7. Import ke Vercel dengan root `frontend`.
8. Isi env Vercel.
9. Deploy.
10. Jalankan final verification untuk login, role, upload, dan route protection.
