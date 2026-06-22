# 03_DATABASE_MIGRATIONS.md - Membuat Database Migration Sesuai PRD

## Tujuan

Membuat migration Supabase PostgreSQL sesuai PRD final.

## File Migration

Buat file:

```txt
supabase/migrations/001_initial_schema.sql
```

## Tabel Wajib

Buat tabel berikut:

1. `profiles`
2. `students`
3. `assessment_files`
4. `school_attendance`
5. `bk_service_attendance`
6. `counseling_records`
7. `student_assistances`
8. `class_assistances`
9. `documents`
10. `home_visits`
11. `confession_box`

## Catatan Field Utama

### `profiles`

- `id uuid primary key references auth.users(id)`
- `full_name text`
- `role text check role in ('admin', 'guru_bk', 'siswa')`
- `created_at timestamptz`
- `updated_at timestamptz`

### `students`

Sesuai PRD Data Siswa:

- NISN
- Nama Lengkap
- Jenis Kelamin
- Kelas
- Jurusan
- Tempat Tanggal Lahir
- Alamat
- Nomor HP
- Nama Orang Tua/Wali
- No HP Orang Tua
- Status Siswa: Aktif, Lulus, Pindah, Off

### `school_attendance`

Sesuai PRD Presensi Sekolah:

- Tanggal
- Nama Siswa / student reference
- Kelas
- Status: Hadir, Izin, Sakit, Alfa, Terlambat
- Keterangan

### `bk_service_attendance`

Sesuai PRD Presensi Layanan BK:

- Tanggal
- Nama Siswa / student reference
- Kelas
- Jam Datang
- Jam Selesai
- Keperluan
- Jenis Layanan
- Guru BK
- Keterangan

### `counseling_records`

Sesuai PRD Catatan Konseling:

- Tanggal
- Nama Siswa / student reference
- Kelas
- Pertemuan Ke-
- Media: Offline, Online
- Jenis Konseling: Individu, Kelompok
- Topik
- Hasil Konseling
- Tindak Lanjut
- Keterangan

### `student_assistances`

Sesuai PRD Catatan Pendampingan Siswa Per Bulan:

- Nomor
- Nama Siswa / student reference
- Kelas
- Bulan
- Tahun
- Tanggal 1-31
- Jumlah
- Keterangan

Catatan implementasi: tanggal 1-31 dapat disimpan sebagai JSONB `daily_codes` agar lebih fleksibel.

### `class_assistances`

Sesuai PRD Daftar Pendampingan Siswa Per Kelas:

- Nomor
- Nama Siswa / student reference
- Kelas
- Jenis Pelanggaran
- Bentuk Tindakan
- Remisi
- Keterangan
- SP Akhir

### `documents`

Sesuai PRD Surat & Dokumen:

- Nomor Surat
- Tanggal
- Nama Siswa / student reference
- Jenis Surat
- File Lampiran
- Keterangan

### `home_visits`

Sesuai PRD Home Visit:

- Tanggal
- Nama Siswa / student reference
- Nama Orang Tua/Wali
- Kelas
- Alamat
- Hasil Kunjungan
- Tindak Lanjut
- Dokumentasi

### `confession_box`

Sesuai PRD Kotak Curhat Digital:

- Tanggal
- Nama Siswa opsional
- Kelas
- Kategori
- Isi Curhat
- Keterangan

## Check Constraint Dropdown

Tambahkan check constraint untuk dropdown PRD:

- status siswa
- status presensi sekolah
- keperluan layanan BK
- jenis layanan BK
- media konseling
- jenis konseling
- kategori curhat
- role user

## Index

Tambahkan index minimal:

- `students(nisn)`
- `students(full_name)`
- `students(class_name)`
- `school_attendance(attendance_date)`
- `bk_service_attendance(attendance_date)`
- `counseling_records(counseling_date)`
- `student_assistances(month, year)`
- `documents(document_date)`
- `home_visits(visit_date)`
- `confession_box(confession_date)`

## Acceptance Criteria

- Semua tabel PRD tersedia.
- Semua dropdown penting memiliki check constraint.
- Foreign key ke `students` digunakan jika memungkinkan.
- Migration bisa dijalankan tanpa error.
- Tidak ada policy `using (true)` untuk data sensitif tanpa pembatasan role.
