# 00_MASTER_RULES.md - Aturan Utama Codex

## Tujuan

Bangun ulang Aplikasi BK Sederhana dari awal berdasarkan PRD final klien. Semua implementasi wajib mengikuti PRD tanpa mengurangi modul, field, dropdown, struktur data, laporan, dan grafik.

## Sumber Kebenaran Utama

Urutan prioritas dokumen:

1. `PRD.md`
2. `TECHNICAL_DESIGN.md`
3. `DATABASE_SCHEMA.md`
4. `SECURITY_RULES.md`
5. `AGENTS.md`
6. File step-by-step ini

Jika ada konflik, ikuti `PRD.md` terlebih dahulu.

## Aturan Wajib

- Jangan menambah modul di luar PRD tanpa izin.
- Jangan menghapus modul dari PRD.
- Jangan mengganti nama menu utama tanpa izin.
- Jangan menghapus field yang diminta klien.
- Jangan membuat refactor besar tanpa rencana.
- Jangan hardcode Supabase URL, anon key, atau credential lain.
- Jangan commit `.env.local`.
- Gunakan clean code.
- Gunakan struktur modular.
- Gunakan TypeScript dengan tipe yang jelas.
- Gunakan validasi form.
- Gunakan service layer untuk query Supabase.
- Jangan menaruh query Supabase langsung tersebar di komponen besar.
- Pastikan route dan sidebar sama dengan PRD.
- Pastikan UI responsif desktop dan mobile.
- Pastikan data sensitif dilindungi dengan Supabase RLS.

## Menu Wajib Sesuai PRD

1. Dashboard
2. Inventori dan Asesmen
3. Data Siswa
4. Presensi Sekolah
5. Presensi Layanan BK
6. Catatan Konseling
7. Catatan Pendampingan Siswa Per Bulan
8. Daftar Pendampingan Siswa Per Kelas
9. Surat & Dokumen
10. Home Visit
11. Kotak Curhat Digital
12. Laporan dan Statistik

## Cara Kerja Codex

Untuk setiap step:

1. Baca file step yang sedang dikerjakan.
2. Baca dokumen PRD dan technical design yang relevan.
3. Jelaskan rencana perubahan singkat.
4. Kerjakan hanya bagian yang diminta pada step tersebut.
5. Jangan melompat ke step lain.
6. Setelah selesai, jalankan pengecekan build/lint jika memungkinkan.
7. Berikan ringkasan file yang dibuat/diubah.

## Larangan

- Jangan membuat fitur AI.
- Jangan membuat modul pembayaran.
- Jangan membuat sistem kompleks di luar PRD.
- Jangan mengganti stack tanpa izin.
- Jangan menghapus route yang diperlukan PRD.
- Jangan membuat data dummy permanen di production code.

## Output Setelah Setiap Step

Codex harus memberikan laporan:

```txt
Step selesai: [nama step]
File dibuat:
- ...
File diubah:
- ...
Catatan:
- ...
Perintah yang perlu dijalankan manual:
- ...
```
