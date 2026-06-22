# 15_DEPLOYMENT_GUIDE.md - Deployment Guide

## Tujuan

Menyiapkan aplikasi untuk deploy menggunakan Vercel dan Supabase.

## Supabase

Pastikan sudah tersedia:

- Project Supabase
- Database migrations sudah dijalankan
- RLS policies sudah aktif
- Bucket storage sudah dibuat
- Environment URL dan anon key tersedia

## Vercel

Deploy folder:

```txt
frontend/
```

## Environment Variable Vercel

Tambahkan:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Build Command

```bash
npm run build
```

## Output Framework

Next.js otomatis dikenali Vercel.

## Post Deployment Checklist

- [ ] Login berhasil.
- [ ] Logout berhasil.
- [ ] Dashboard bisa dibuka setelah login.
- [ ] Siswa hanya bisa buka Kotak Curhat Digital.
- [ ] Data siswa bisa ditambah.
- [ ] Presensi bisa ditambah.
- [ ] Konseling bisa ditambah.
- [ ] Curhat digital bisa dikirim.
- [ ] Upload dokumen berhasil.
- [ ] Mobile view rapi.

## Catatan

Jangan menaruh credential asli di repository. Gunakan Vercel Environment Variables.
