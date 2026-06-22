# AGENTS.md - Aturan Kerja Codex untuk Aplikasi BK Sederhana

## 1. Tujuan Dokumen

Dokumen ini adalah aturan kerja untuk AI coding assistant seperti Codex agar pengembangan Aplikasi BK Sederhana tetap aman, rapi, hemat token, dan tidak keluar dari permintaan klien.

Codex wajib mengikuti dokumen berikut:

1. `README.md`
2. `PRD.md`
3. `TECHNICAL_DESIGN.md`
4. `DATABASE_SCHEMA.md`
5. `SECURITY_RULES.md`
6. `AGENTS.md`

Jika terjadi konflik, prioritasnya:

1. Permintaan user terbaru
2. `PRD.md`
3. `SECURITY_RULES.md`
4. `DATABASE_SCHEMA.md`
5. `TECHNICAL_DESIGN.md`
6. `README.md`
7. `AGENTS.md`

---

## 2. Prinsip Utama

Codex wajib:

- Mengikuti PRD final.
- Tidak menambah fitur di luar PRD tanpa izin.
- Tidak mengurangi fitur, field, dropdown, laporan, atau grafik yang diminta klien.
- Tidak melakukan refactor besar tanpa persetujuan.
- Tidak menghapus file sembarangan.
- Tidak mengganti struktur besar project tanpa alasan kuat dan izin user.
- Tidak mengubah database schema tanpa instruksi jelas.
- Tidak mengubah security policy tanpa memperhatikan `SECURITY_RULES.md`.
- Menulis kode yang clean, modular, dan mudah dipelihara.
- Hemat token dan fokus pada task yang diminta.

---

## 3. Batasan Penting

Codex dilarang:

- Menambahkan modul baru di luar 12 menu PRD.
- Menghapus modul dari PRD.
- Mengubah nama menu utama tanpa izin.
- Menghapus field yang diminta klien.
- Menghapus RLS atau membuat policy terbuka seperti `using (true)` pada data sensitif.
- Menggunakan Supabase service role key di frontend.
- Meng-hardcode Supabase URL atau anon key.
- Menyimpan password manual di database aplikasi.
- Mengubah flow login/register secara besar tanpa izin.
- Melakukan `npm audit fix --force` tanpa izin.
- Melakukan upgrade/downgrade besar dependency tanpa izin.
- Melakukan perubahan massal yang tidak diminta.
- Mengubah UI besar-besaran jika user hanya meminta bug fix kecil.

---

## 4. Modul yang Wajib Diikuti

Menu utama aplikasi harus tetap:

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

---

## 5. Tech Stack yang Digunakan

Frontend:

- Next.js
- TypeScript
- Tailwind CSS
- Supabase Client

Backend / Database:

- Supabase PostgreSQL
- Supabase Auth
- Supabase Storage
- Supabase RLS

Deployment:

- Vercel untuk frontend
- Supabase untuk database, auth, dan storage

---

## 6. Struktur Kerja yang Disarankan

Sebelum mengubah kode, Codex harus:

1. Membaca task user dengan teliti.
2. Cek file terkait saja.
3. Jelaskan rencana singkat jika task cukup besar.
4. Lakukan perubahan kecil dan terarah.
5. Hindari menyentuh file yang tidak terkait.
6. Setelah perubahan, jelaskan file yang diubah dan alasannya.
7. Berikan langkah testing manual.

---

## 7. Aturan Clean Code

Kode harus:

- Memiliki nama variabel dan fungsi yang jelas.
- Menggunakan komponen kecil dan single responsibility.
- Memisahkan logic query Supabase ke service.
- Memisahkan schema validasi jika digunakan.
- Menghindari duplikasi logic.
- Menggunakan TypeScript type/interface yang jelas.
- Menggunakan error handling yang mudah dipahami.
- Menggunakan loading state dan empty state pada halaman data.
- Menghindari inline style berlebihan.
- Mengikuti pola komponen yang sudah ada.

---

## 8. Aturan Frontend

Codex wajib:

- Menggunakan route sesuai `TECHNICAL_DESIGN.md`.
- Menggunakan sidebar sesuai 12 menu PRD.
- Menggunakan komponen reusable jika sudah tersedia.
- Menggunakan Tailwind secara konsisten.
- Menjaga tampilan desktop dan mobile tetap responsif.
- Menambahkan horizontal scroll untuk tabel lebar di mobile.
- Tidak membuat halaman baru yang tidak ada di PRD tanpa izin.
- Tidak mengubah theme besar-besaran tanpa instruksi.

---

## 9. Aturan Supabase Query

Codex wajib:

- Menaruh query Supabase di service file jika memungkinkan.
- Tidak menulis query kompleks langsung tersebar di komponen.
- Menggunakan pagination untuk data besar.
- Menggunakan filter bulan/tahun/kelas jika relevan.
- Tidak mengambil seluruh data jika tidak perlu.
- Menangani error dari Supabase dengan pesan yang aman.

---

## 10. Aturan Database

Codex wajib:

- Mengikuti `DATABASE_SCHEMA.md`.
- Tidak membuat tabel baru tanpa instruksi.
- Tidak menghapus tabel tanpa izin.
- Tidak rename tabel tanpa izin.
- Tidak rename column tanpa migrasi jelas.
- Menambahkan index jika data besar dan query sering difilter.
- Membuat migration yang aman dan bisa ditinjau.

---

## 11. Aturan Security

Codex wajib:

- Mengikuti `SECURITY_RULES.md`.
- Memastikan route protected.
- Memastikan role siswa hanya bisa akses Kotak Curhat Digital.
- Memastikan guru BK dan admin hanya akses sesuai aturan.
- Tidak membuat policy RLS terbuka untuk data sensitif.
- Tidak menyimpan secrets di source code.
- Tidak menaruh service role key di frontend.
- Tidak membuat bucket file sensitif menjadi public tanpa alasan dan izin.

---

## 12. Aturan Auth dan Role

- Login/register menggunakan Supabase Auth.
- Role disimpan di tabel `profiles`.
- Default role user baru adalah `siswa` jika belum ada aturan lain.
- Role admin tidak boleh dipilih bebas saat registrasi publik.
- Middleware/proteksi route harus memeriksa user dan role.
- Logout harus membersihkan session.

---

## 13. Aturan Upload File

Modul upload file:

- Inventori dan Asesmen
- Surat & Dokumen
- Home Visit

Codex wajib:

- Menggunakan Supabase Storage.
- Menggunakan path file yang terstruktur.
- Menyimpan `file_url` dan/atau `file_path` di database.
- Membatasi tipe file jika memungkinkan.
- Tidak membuka akses file sensitif sembarangan.

---

## 14. Aturan Responsive Design

Desktop:

- Sidebar tampil penuh.
- Tabel boleh lebar.
- Filter dapat sejajar.

Mobile:

- Sidebar menjadi drawer.
- Tabel lebar harus horizontal scroll.
- Form satu kolom.
- Tombol mudah ditekan.
- Tidak boleh ada konten keluar layar.

---

## 15. Aturan Testing Manual

Setelah perubahan, Codex harus menyarankan testing manual yang relevan.

Contoh:

- Login sebagai admin.
- Login sebagai guru BK.
- Login sebagai siswa.
- Cek siswa tidak bisa membuka menu selain Kotak Curhat Digital.
- Tambah data siswa.
- Edit data siswa.
- Filter data berdasarkan kelas.
- Tambah presensi sekolah.
- Tambah catatan konseling.
- Upload dokumen.
- Cek tampilan mobile.

---

## 16. Format Jawaban Codex

Saat selesai mengerjakan task, Codex harus menjawab ringkas dengan format:

```md
Selesai.

File yang diubah:
- path/file1.tsx
- path/file2.ts

Yang dilakukan:
- ...
- ...

Testing manual:
- ...
- ...

Catatan:
- ...
```

Jika task belum bisa diselesaikan, Codex harus jujur menjelaskan kendalanya.

---

## 17. Mode Hemat Token

Codex harus hemat token dengan cara:

- Jangan membaca semua file jika tidak perlu.
- Fokus pada file terkait task.
- Jangan menjelaskan ulang hal yang tidak diminta.
- Jangan membuat refactor besar.
- Jangan membuat banyak file baru tanpa kebutuhan.
- Tanyakan atau beri instruksi manual jika perubahan kecil lebih aman dilakukan user.

---

## 18. Catatan Khusus Project Ini

Project ini harus mengikuti permintaan klien yang sederhana. Jangan membuat aplikasi menjadi terlalu kompleks.

Prioritas:

1. Sesuai PRD.
2. Aman.
3. Rapi.
4. Mudah digunakan Guru BK.
5. Responsif desktop dan mobile.
6. Mudah dikembangkan bertahap.
