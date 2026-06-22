# TECHNICAL_DESIGN.md - Aplikasi BK Sederhana

## 1. Gambaran Teknis

Aplikasi BK Sederhana adalah aplikasi web untuk administrasi dan layanan Bimbingan Konseling sekolah.

Aplikasi digunakan untuk mengelola:

- Dashboard
- Inventori dan Asesmen
- Data Siswa
- Presensi Sekolah
- Presensi Layanan BK
- Catatan Konseling
- Catatan Pendampingan Siswa Per Bulan
- Daftar Pendampingan Siswa Per Kelas
- Surat & Dokumen
- Home Visit
- Kotak Curhat Digital
- Laporan dan Statistik

Aplikasi harus dibuat sederhana, rapi, mudah digunakan, mudah dipelihara, dan mengikuti PRD final tanpa mengurangi fitur yang diminta klien.

---

## 2. Tech Stack

### Frontend

- Next.js
- TypeScript
- Tailwind CSS
- Supabase Client
- React Hook Form jika diperlukan
- Zod jika diperlukan untuk validasi form

### Backend / Database

- Supabase
  - PostgreSQL
  - Supabase Auth
  - Supabase Storage
  - Row Level Security atau RLS

### Hosting

- Frontend: Vercel
- Database: Supabase PostgreSQL
- Authentication: Supabase Auth
- Storage: Supabase Storage

---

## 3. Prinsip Pengembangan

- Mengikuti PRD final.
- Tidak menambah modul di luar permintaan klien.
- Tidak mengurangi field yang diminta klien.
- Tidak menghapus fitur yang sudah berjalan tanpa persetujuan.
- Perubahan dilakukan bertahap.
- Struktur kode dibuat rapi dan modular.
- Setiap halaman utama mengikuti layout yang konsisten.
- Setiap form memiliki validasi dasar.
- Data siswa, konseling, curhat digital, dan dokumen harus diperlakukan sebagai data sensitif.
- Tampilan harus responsif untuk desktop dan mobile.

---

## 4. Arsitektur Aplikasi

```txt
User
 |
 v
Next.js Frontend
 |
 v
Supabase Client
 |
 v
Supabase
 |-- Auth
 |-- PostgreSQL
 |-- Storage
 |-- RLS Policy
```

### Penjelasan

- User mengakses aplikasi melalui browser.
- Next.js menangani halaman, routing, komponen, form, dan interaksi pengguna.
- Supabase Client digunakan untuk membaca dan menyimpan data.
- Supabase Auth digunakan untuk login dan registrasi.
- Supabase PostgreSQL menyimpan seluruh data aplikasi.
- Supabase Storage menyimpan file asesmen, dokumen, dan dokumentasi home visit.
- RLS digunakan untuk membatasi akses data berdasarkan role.

---

## 5. Struktur Folder Frontend

```txt
frontend/
├── app/
│   ├── dashboard/
│   │   └── page.tsx
│   ├── assessments/
│   │   └── page.tsx
│   ├── students/
│   │   ├── page.tsx
│   │   ├── create/
│   │   │   └── page.tsx
│   │   └── [id]/
│   │       ├── page.tsx
│   │       └── edit/
│   │           └── page.tsx
│   ├── school-attendance/
│   │   └── page.tsx
│   ├── bk-service-attendance/
│   │   └── page.tsx
│   ├── counseling-records/
│   │   └── page.tsx
│   ├── student-assistances/
│   │   └── page.tsx
│   ├── class-assistances/
│   │   └── page.tsx
│   ├── documents/
│   │   └── page.tsx
│   ├── home-visits/
│   │   └── page.tsx
│   ├── confession-box/
│   │   └── page.tsx
│   ├── reports/
│   │   └── page.tsx
│   ├── login/
│   │   └── page.tsx
│   ├── register/
│   │   └── page.tsx
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Topbar.tsx
│   │   └── MobileSidebar.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Textarea.tsx
│   │   ├── Card.tsx
│   │   ├── Table.tsx
│   │   ├── Modal.tsx
│   │   └── Badge.tsx
│   └── shared/
│       ├── PageHeader.tsx
│       ├── EmptyState.tsx
│       ├── LoadingState.tsx
│       ├── ErrorState.tsx
│       └── ConfirmDialog.tsx
│
├── features/
│   ├── students/
│   ├── school-attendance/
│   ├── bk-service-attendance/
│   ├── counseling-records/
│   ├── student-assistances/
│   ├── class-assistances/
│   ├── documents/
│   ├── home-visits/
│   ├── confession-box/
│   ├── assessments/
│   └── reports/
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   ├── constants/
│   │   └── options.ts
│   ├── utils.ts
│   └── permissions.ts
│
├── types/
│   ├── database.ts
│   └── common.ts
│
├── middleware.ts
├── package.json
└── .env.local
```

---

## 6. Struktur Menu Aplikasi

Menu utama harus mengikuti PRD:

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

## 7. Routing Aplikasi

| Modul | Route |
|---|---|
| Dashboard | `/dashboard` |
| Inventori dan Asesmen | `/assessments` |
| Data Siswa | `/students` |
| Tambah Siswa | `/students/create` |
| Detail Siswa | `/students/[id]` |
| Edit Siswa | `/students/[id]/edit` |
| Presensi Sekolah | `/school-attendance` |
| Presensi Layanan BK | `/bk-service-attendance` |
| Catatan Konseling | `/counseling-records` |
| Catatan Pendampingan Siswa Per Bulan | `/student-assistances` |
| Daftar Pendampingan Siswa Per Kelas | `/class-assistances` |
| Surat & Dokumen | `/documents` |
| Home Visit | `/home-visits` |
| Kotak Curhat Digital | `/confession-box` |
| Laporan dan Statistik | `/reports` |
| Login | `/login` |
| Register | `/register` |

---

## 8. Role dan Hak Akses

Role utama:

- `admin`
- `guru_bk`
- `siswa`

### Admin

Admin dapat mengakses seluruh menu.

### Guru BK

Guru BK dapat mengakses:

- Dashboard
- Inventori dan Asesmen
- Data Siswa
- Presensi Sekolah
- Presensi Layanan BK
- Catatan Konseling
- Catatan Pendampingan Siswa Per Bulan
- Daftar Pendampingan Siswa Per Kelas
- Surat & Dokumen
- Home Visit
- Kotak Curhat Digital
- Laporan dan Statistik

### Siswa

Siswa hanya dapat mengakses:

- Kotak Curhat Digital

---

## 9. Modul Dashboard

Route:

```txt
/dashboard
```

Dashboard menampilkan:

- Jumlah siswa
- Jumlah siswa per kelas
- Jumlah konseling per bulan
- Jumlah pendampingan per bulan
- Jumlah surat terbit
- Jumlah home visit
- Jumlah curhat digital

Sumber data:

| Indikator | Sumber Tabel |
|---|---|
| Jumlah siswa | `students` |
| Jumlah siswa per kelas | `students` |
| Jumlah konseling per bulan | `counseling_records` |
| Jumlah pendampingan per bulan | `student_assistances` |
| Jumlah surat terbit | `documents` |
| Jumlah home visit | `home_visits` |
| Jumlah curhat digital | `confession_box` |

---

## 10. Modul Inventori dan Asesmen

Route:

```txt
/assessments
```

File yang harus tersedia:

- Angket Kebutuhan Siswa
- Inventori Tugas Perkembangan
- Angket Minat Karier
- Angket Gaya Belajar
- Daftar Cek Masalah atau DCM
- Sosiometri

Tabel:

```txt
assessment_files
```

Storage bucket:

```txt
assessment-files
```

---

## 11. Modul Data Siswa

Routes:

```txt
/students
/students/create
/students/[id]
/students/[id]/edit
```

Field:

- NISN
- Nama Lengkap
- Jenis Kelamin
- Kelas
- Jurusan
- Tempat Tanggal Lahir
- Alamat
- Nomor HP
- Nama Orang Tua/Wali
- Status Siswa

Status Siswa:

- Aktif
- Lulus
- Pindah
- Off

Tabel:

```txt
students
```

---

## 12. Modul Presensi Sekolah

Route:

```txt
/school-attendance
```

Field:

- Tanggal
- Nama Siswa
- Kelas
- Status
- Keterangan

Status:

- Hadir
- Izin
- Sakit
- Alfa
- Terlambat

Tabel:

```txt
school_attendance
```

---

## 13. Modul Presensi Layanan BK

Route:

```txt
/bk-service-attendance
```

Field:

- Tanggal
- Nama Siswa
- Kelas
- Jam Datang
- Jam Selesai
- Keperluan
- Jenis Layanan
- Guru BK
- Keterangan

Keperluan:

- Konseling Individu
- Konseling Kelompok
- Layanan Klasikal
- Informasi Karier
- Informasi Sekolah Lanjutan
- Pemanggilan
- Lainnya

Jenis Layanan:

- Layanan Dasar
- Layanan Responsif
- Layanan Perencanaan Individual
- Layanan Dukungan Sistem

Tabel:

```txt
bk_service_attendance
```

---

## 14. Modul Catatan Konseling

Route:

```txt
/counseling-records
```

Field:

- Tanggal
- Nama Siswa
- Kelas
- Pertemuan Ke-
- Media
- Jenis Konseling
- Topik
- Hasil Konseling
- Tindak Lanjut
- Keterangan

Media:

- Offline
- Online

Jenis Konseling:

- Individu
- Kelompok

Tabel:

```txt
counseling_records
```

---

## 15. Modul Catatan Pendampingan Siswa Per Bulan

Route:

```txt
/student-assistances
```

Kode pendampingan:

| Kode | Keterangan |
|---|---|
| T | Terlambat |
| S | Tidak Seragam |
| ID | Tidak memakai ID Card |
| R | Rambut panjang / semir |
| RK | Rokok |
| K | Korek |
| M | Make up menor |
| Lainnya | Pelanggaran lainnya |

Field:

- Nomor
- Nama Siswa
- Tanggal 1–31
- Jumlah
- Keterangan

Tabel:

```txt
student_assistances
```

Catatan teknis: tampilan dapat memakai tabel horizontal seperti spreadsheet.

---

## 16. Modul Daftar Pendampingan Siswa Per Kelas

Route:

```txt
/class-assistances
```

Field:

- Nomor
- Nama Siswa
- Jenis Pelanggaran
- Bentuk Tindakan
- Remisi
- Keterangan
- SP Akhir

Tabel:

```txt
class_assistances
```

---

## 17. Modul Surat & Dokumen

Route:

```txt
/documents
```

Jenis Surat:

- Surat Panggilan Orang Tua
- Surat Home Visit
- Surat Kontrak Perilaku Siswa
- Surat Pernyataan Siswa
- Surat Peringatan 1
- Surat Peringatan 2
- Surat Peringatan 3
- Berita Acara Panggilan Orang Tua
- Contoh Surat Pengunduran Diri

Field:

- Nomor Surat
- Tanggal
- Nama Siswa
- Jenis Surat
- File Lampiran
- Keterangan

Tabel:

```txt
documents
```

Storage bucket:

```txt
document-files
```

---

## 18. Modul Home Visit

Route:

```txt
/home-visits
```

Field:

- Tanggal
- Nama Siswa
- Nama Orang Tua/Wali
- Kelas
- Alamat
- Hasil Kunjungan
- Tindak Lanjut
- Dokumentasi

Tabel:

```txt
home_visits
```

Storage bucket:

```txt
home-visit-files
```

---

## 19. Modul Kotak Curhat Digital

Route:

```txt
/confession-box
```

Field:

- Tanggal
- Nama Siswa opsional
- Kelas
- Kategori
- Isi Curhat
- Keterangan

Kategori:

- Pribadi
- Sosial
- Belajar
- Karier
- Keluarga
- Lainnya

Tabel:

```txt
confession_box
```

Catatan teknis: Nama Siswa bersifat opsional sesuai PRD.

---

## 20. Modul Laporan dan Statistik

Route:

```txt
/reports
```

Laporan:

- Rekap Kehadiran Sekolah
- Rekap Konseling
- Rekap Pendampingan
- Rekap Pemanggilan Orang Tua
- Rekap Home Visit
- Rekap Per Kelas
- Rekap Per Semester
- Rekap Per Tahun

Grafik:

- Konseling per bulan
- Siswa terbanyak menerima layanan
- Kehadiran siswa
- Topik pendampingan terbanyak
- Kelas dengan layanan BK terbanyak

Sumber data:

| Laporan / Grafik | Sumber Tabel |
|---|---|
| Rekap Kehadiran Sekolah | `school_attendance` |
| Rekap Konseling | `counseling_records` |
| Rekap Pendampingan | `student_assistances`, `class_assistances` |
| Rekap Pemanggilan Orang Tua | `documents` |
| Rekap Home Visit | `home_visits` |
| Rekap Per Kelas | seluruh tabel terkait siswa |
| Rekap Per Semester | seluruh tabel berdasarkan tanggal |
| Rekap Per Tahun | seluruh tabel berdasarkan tanggal |
| Konseling per bulan | `counseling_records` |
| Siswa terbanyak menerima layanan | `bk_service_attendance`, `counseling_records`, `student_assistances` |
| Kehadiran siswa | `school_attendance` |
| Topik pendampingan terbanyak | `student_assistances`, `class_assistances` |
| Kelas dengan layanan BK terbanyak | `bk_service_attendance`, `counseling_records` |

---

## 21. Konstanta Dropdown

Dropdown disimpan dalam file:

```txt
lib/constants/options.ts
```

Pilihan dropdown wajib mengikuti PRD:

- Status Siswa: Aktif, Lulus, Pindah, Off
- Status Presensi Sekolah: Hadir, Izin, Sakit, Alfa, Terlambat
- Keperluan Layanan BK: Konseling Individu, Konseling Kelompok, Layanan Klasikal, Informasi Karier, Informasi Sekolah Lanjutan, Pemanggilan, Lainnya
- Jenis Layanan BK: Layanan Dasar, Layanan Responsif, Layanan Perencanaan Individual, Layanan Dukungan Sistem
- Media Konseling: Offline, Online
- Jenis Konseling: Individu, Kelompok
- Kode Pendampingan: T, S, ID, R, RK, K, M, Lainnya
- Jenis Surat sesuai daftar PRD
- Kategori Kotak Curhat Digital: Pribadi, Sosial, Belajar, Karier, Keluarga, Lainnya

---

## 22. Pola Service Frontend

Setiap modul menggunakan service agar query Supabase tidak tersebar di komponen.

Contoh:

```txt
features/students/
├── components/
│   ├── StudentTable.tsx
│   └── StudentForm.tsx
├── services/
│   └── studentService.ts
├── schemas/
│   └── studentSchema.ts
└── types/
    └── student.ts
```

Contoh fungsi service:

```ts
export async function getStudents() {}
export async function getStudentById(id: string) {}
export async function createStudent(payload: StudentPayload) {}
export async function updateStudent(id: string, payload: StudentPayload) {}
export async function deleteStudent(id: string) {}
```

---

## 23. Responsive Design

### Desktop

- Sidebar tampil penuh.
- Konten menggunakan layout lebar.
- Tabel dapat tampil penuh.
- Filter dapat tampil sejajar.

### Mobile

- Sidebar berubah menjadi drawer.
- Tabel lebar menggunakan horizontal scroll.
- Form menggunakan satu kolom.
- Tombol utama mudah ditekan.
- Konten tidak boleh keluar layar.

---

## 24. Pagination dan Performance

Karena jumlah siswa dapat mencapai 1.500 atau lebih:

- Gunakan pagination pada tabel besar.
- Gunakan search berdasarkan nama siswa atau NISN.
- Gunakan filter berdasarkan kelas, jurusan, status, bulan, dan tahun.
- Query Supabase tidak mengambil semua data jika tidak perlu.
- Dashboard menggunakan query agregasi atau query terbatas.
- Hindari render tabel terlalu besar sekaligus.

---

## 25. Environment Variable

File `.env.local` frontend:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Aturan:

- Jangan hardcode Supabase URL di source code.
- Jangan hardcode Supabase anon key di source code.
- Jangan commit file `.env.local`.
- Gunakan environment variable dari Vercel saat deploy.

---

## 26. Catatan Pengembangan

Hal yang tidak boleh dilakukan tanpa persetujuan:

- Menambah modul baru di luar PRD.
- Menghapus modul dari PRD.
- Mengubah nama menu utama tanpa alasan kuat.
- Menghapus field yang diminta klien.
- Mengubah struktur database besar-besaran.
- Melakukan refactor besar tanpa rencana.
- Mengubah flow login dan role tanpa persetujuan.
- Mengubah akses data sensitif tanpa memperbarui security rules.

---

## 27. Tahapan Implementasi Teknis

1. Rapikan struktur route sesuai menu PRD.
2. Rapikan sidebar agar sesuai 12 menu utama.
3. Rapikan Data Siswa.
4. Rapikan Presensi Sekolah.
5. Rapikan Presensi Layanan BK.
6. Rapikan Catatan Konseling.
7. Rapikan Catatan Pendampingan Siswa Per Bulan.
8. Buat Daftar Pendampingan Siswa Per Kelas.
9. Rapikan Surat & Dokumen.
10. Rapikan Home Visit.
11. Rapikan Kotak Curhat Digital.
12. Rapikan Dashboard sesuai indikator PRD.
13. Buat Laporan dan Statistik.
14. Rapikan Inventori dan Asesmen.
15. Audit role dan RLS Supabase.
16. Audit responsive desktop dan mobile.
17. Testing full flow.
18. Commit dan push.
