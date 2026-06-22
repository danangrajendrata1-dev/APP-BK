# DATABASE_SCHEMA.md - Aplikasi BK Sederhana

## 1. Gambaran Umum Database

Database menggunakan Supabase PostgreSQL.

Database menyimpan data untuk:

- User profile dan role
- Data siswa
- Presensi sekolah
- Presensi layanan BK
- Catatan konseling
- Catatan pendampingan siswa per bulan
- Daftar pendampingan siswa per kelas
- Surat dan dokumen
- Home visit
- Kotak curhat digital
- Inventori dan asesmen
- Laporan dan statistik berdasarkan data transaksi

---

## 2. Prinsip Database

- Gunakan UUID sebagai primary key.
- Gunakan `created_at` dan `updated_at` pada tabel utama.
- Nomor HP disimpan sebagai text, bukan number.
- Field pilihan/dropdown menggunakan text dengan validasi di frontend dan database jika diperlukan.
- Data yang berhubungan dengan siswa menggunakan `student_id` sebagai foreign key jika memungkinkan.
- Simpan `student_name` dan `class_name` juga boleh digunakan sebagai snapshot jika dibutuhkan untuk laporan historis.
- Jangan menghapus data sensitif sembarangan.
- Aktifkan RLS pada semua tabel yang berisi data aplikasi.

---

## 3. Enum / Pilihan Data

### Role

- admin
- guru_bk
- siswa

### Status Siswa

- Aktif
- Lulus
- Pindah
- Off

### Status Presensi Sekolah

- Hadir
- Izin
- Sakit
- Alfa
- Terlambat

### Keperluan Layanan BK

- Konseling Individu
- Konseling Kelompok
- Layanan Klasikal
- Informasi Karier
- Informasi Sekolah Lanjutan
- Pemanggilan
- Lainnya

### Jenis Layanan BK

- Layanan Dasar
- Layanan Responsif
- Layanan Perencanaan Individual
- Layanan Dukungan Sistem

### Media Konseling

- Offline
- Online

### Jenis Konseling

- Individu
- Kelompok

### Kode Pendampingan

- T
- S
- ID
- R
- RK
- K
- M
- Lainnya

### Kategori Kotak Curhat Digital

- Pribadi
- Sosial
- Belajar
- Karier
- Keluarga
- Lainnya

---

## 4. Tabel `profiles`

Menyimpan profil user dari Supabase Auth.

```sql
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'siswa' check (role in ('admin', 'guru_bk', 'siswa')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

---

## 5. Tabel `students`

Menyimpan data induk siswa.

```sql
create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  nisn text not null unique,
  full_name text not null,
  gender text not null,
  class_name text not null,
  major text not null,
  birth_place_date text,
  address text,
  phone text,
  parent_name text,
  parent_phone text,
  status text not null default 'Aktif' check (status in ('Aktif', 'Lulus', 'Pindah', 'Off')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

Mapping PRD:

| PRD | Database |
|---|---|
| NISN | `nisn` |
| Nama Lengkap | `full_name` |
| Jenis Kelamin | `gender` |
| Kelas | `class_name` |
| Jurusan | `major` |
| Tempat Tanggal Lahir | `birth_place_date` |
| Alamat | `address` |
| Nomor HP | `phone` |
| Nama Orang Tua/Wali | `parent_name` |
| No HP Orang Tua | `parent_phone` |
| Status Siswa | `status` |

---

## 6. Tabel `school_attendance`

Menyimpan presensi sekolah per bulan.

```sql
create table if not exists public.school_attendance (
  id uuid primary key default gen_random_uuid(),
  attendance_date date not null,
  student_id uuid references public.students(id) on delete set null,
  student_name text not null,
  class_name text not null,
  status text not null check (status in ('Hadir', 'Izin', 'Sakit', 'Alfa', 'Terlambat')),
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

Mapping PRD:

| PRD | Database |
|---|---|
| Tanggal | `attendance_date` |
| Nama Siswa | `student_name` |
| Kelas | `class_name` |
| Status | `status` |
| Keterangan | `description` |

---

## 7. Tabel `bk_service_attendance`

Menyimpan presensi siswa yang berkunjung ke BK.

```sql
create table if not exists public.bk_service_attendance (
  id uuid primary key default gen_random_uuid(),
  service_date date not null,
  student_id uuid references public.students(id) on delete set null,
  student_name text not null,
  class_name text not null,
  arrival_time time,
  finish_time time,
  purpose text not null check (purpose in (
    'Konseling Individu',
    'Konseling Kelompok',
    'Layanan Klasikal',
    'Informasi Karier',
    'Informasi Sekolah Lanjutan',
    'Pemanggilan',
    'Lainnya'
  )),
  service_type text not null check (service_type in (
    'Layanan Dasar',
    'Layanan Responsif',
    'Layanan Perencanaan Individual',
    'Layanan Dukungan Sistem'
  )),
  counselor_name text,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

---

## 8. Tabel `counseling_records`

Menyimpan catatan konseling.

```sql
create table if not exists public.counseling_records (
  id uuid primary key default gen_random_uuid(),
  counseling_date date not null,
  student_id uuid references public.students(id) on delete set null,
  student_name text not null,
  class_name text not null,
  meeting_number integer,
  media text not null check (media in ('Offline', 'Online')),
  counseling_type text not null check (counseling_type in ('Individu', 'Kelompok')),
  topic text,
  counseling_result text,
  follow_up text,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

---

## 9. Tabel `student_assistances`

Menyimpan catatan pendampingan siswa per bulan.

```sql
create table if not exists public.student_assistances (
  id uuid primary key default gen_random_uuid(),
  assistance_month integer not null check (assistance_month between 1 and 12),
  assistance_year integer not null,
  student_id uuid references public.students(id) on delete set null,
  student_name text not null,
  class_name text not null,
  day_1 text,
  day_2 text,
  day_3 text,
  day_4 text,
  day_5 text,
  day_6 text,
  day_7 text,
  day_8 text,
  day_9 text,
  day_10 text,
  day_11 text,
  day_12 text,
  day_13 text,
  day_14 text,
  day_15 text,
  day_16 text,
  day_17 text,
  day_18 text,
  day_19 text,
  day_20 text,
  day_21 text,
  day_22 text,
  day_23 text,
  day_24 text,
  day_25 text,
  day_26 text,
  day_27 text,
  day_28 text,
  day_29 text,
  day_30 text,
  day_31 text,
  total integer not null default 0,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

Catatan:

- Struktur ini mengikuti kebutuhan PRD `Tanggal 1–31`.
- Nilai harian dapat berisi kode pendampingan seperti `T`, `S`, `ID`, `R`, `RK`, `K`, `M`, atau `Lainnya`.

---

## 10. Tabel `class_assistances`

Menyimpan daftar pendampingan siswa per kelas.

```sql
create table if not exists public.class_assistances (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.students(id) on delete set null,
  student_name text not null,
  class_name text not null,
  violation_type text,
  action_form text,
  remission text,
  description text,
  final_warning_letter text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

Mapping PRD:

| PRD | Database |
|---|---|
| Nomor | nomor urut dari tampilan |
| Nama Siswa | `student_name` |
| Jenis Pelanggaran | `violation_type` |
| Bentuk Tindakan | `action_form` |
| Remisi | `remission` |
| Keterangan | `description` |
| SP Akhir | `final_warning_letter` |

---

## 11. Tabel `documents`

Menyimpan surat dan dokumen BK.

```sql
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  letter_number text not null,
  document_date date not null,
  student_id uuid references public.students(id) on delete set null,
  student_name text not null,
  class_name text,
  document_type text not null check (document_type in (
    'Surat Panggilan Orang Tua',
    'Surat Home Visit',
    'Surat Kontrak Perilaku Siswa',
    'Surat Pernyataan Siswa',
    'Surat Peringatan 1',
    'Surat Peringatan 2',
    'Surat Peringatan 3',
    'Berita Acara Panggilan Orang Tua',
    'Contoh Surat Pengunduran Diri'
  )),
  file_url text,
  file_path text,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

---

## 12. Tabel `home_visits`

Menyimpan data home visit.

```sql
create table if not exists public.home_visits (
  id uuid primary key default gen_random_uuid(),
  visit_date date not null,
  student_id uuid references public.students(id) on delete set null,
  student_name text not null,
  parent_name text,
  class_name text not null,
  address text,
  visit_result text,
  follow_up text,
  documentation_url text,
  documentation_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

---

## 13. Tabel `confession_box`

Menyimpan form curhat digital.

```sql
create table if not exists public.confession_box (
  id uuid primary key default gen_random_uuid(),
  confession_date date not null default current_date,
  student_id uuid references public.students(id) on delete set null,
  student_name text,
  class_name text,
  category text not null check (category in ('Pribadi', 'Sosial', 'Belajar', 'Karier', 'Keluarga', 'Lainnya')),
  content text not null,
  description text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

Catatan:

- `student_name` boleh kosong karena PRD menyebut Nama Siswa opsional.
- `content` wajib diisi.

---

## 14. Tabel `assessment_files`

Menyimpan file inventori dan asesmen.

```sql
create table if not exists public.assessment_files (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  assessment_type text not null check (assessment_type in (
    'Angket Kebutuhan Siswa',
    'Inventori Tugas Perkembangan',
    'Angket Minat Karier',
    'Angket Gaya Belajar',
    'Daftar Cek Masalah (DCM)',
    'Sosiometri'
  )),
  file_url text,
  file_path text,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

---

## 15. Index yang Disarankan

```sql
create index if not exists idx_students_full_name on public.students(full_name);
create index if not exists idx_students_class_name on public.students(class_name);
create index if not exists idx_students_major on public.students(major);
create index if not exists idx_students_status on public.students(status);

create index if not exists idx_school_attendance_date on public.school_attendance(attendance_date);
create index if not exists idx_school_attendance_class on public.school_attendance(class_name);
create index if not exists idx_school_attendance_status on public.school_attendance(status);

create index if not exists idx_bk_service_attendance_date on public.bk_service_attendance(service_date);
create index if not exists idx_bk_service_attendance_class on public.bk_service_attendance(class_name);

create index if not exists idx_counseling_records_date on public.counseling_records(counseling_date);
create index if not exists idx_counseling_records_class on public.counseling_records(class_name);

create index if not exists idx_student_assistances_month_year on public.student_assistances(assistance_month, assistance_year);
create index if not exists idx_student_assistances_class on public.student_assistances(class_name);

create index if not exists idx_documents_date on public.documents(document_date);
create index if not exists idx_documents_type on public.documents(document_type);

create index if not exists idx_home_visits_date on public.home_visits(visit_date);
create index if not exists idx_confession_box_date on public.confession_box(confession_date);
create index if not exists idx_confession_box_category on public.confession_box(category);
```

---

## 16. Storage Bucket

Bucket yang dibutuhkan:

| Modul | Bucket |
|---|---|
| Inventori dan Asesmen | `assessment-files` |
| Surat & Dokumen | `document-files` |
| Home Visit | `home-visit-files` |

---

## 17. Catatan Migrasi

- Jalankan migrasi secara bertahap.
- Jangan menjalankan query drop table tanpa backup.
- Jangan mengubah tabel production tanpa mengecek data lama.
- Jika project sudah berjalan, sesuaikan migration dengan struktur existing.
- Setelah tabel dibuat, aktifkan RLS dan policy sesuai `SECURITY_RULES.md`.
