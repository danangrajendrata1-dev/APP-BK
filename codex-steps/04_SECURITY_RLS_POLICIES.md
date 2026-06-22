# 04_SECURITY_RLS_POLICIES.md - Membuat Security dan RLS Policies

## Tujuan

Mengamankan data aplikasi BK dengan Supabase Row Level Security.

## File Migration

Buat file:

```txt
supabase/migrations/002_rls_policies.sql
```

## Role Aplikasi

Role:

- `admin`
- `guru_bk`
- `siswa`

## Rule Akses

### Admin

Admin dapat mengakses seluruh data.

### Guru BK

Guru BK dapat mengakses seluruh modul BK sesuai PRD.

### Siswa

Siswa hanya dapat mengakses Kotak Curhat Digital untuk membuat curhat.

## Helper Function

Buat function SQL:

```sql
public.get_current_user_role()
```

Function membaca role dari tabel `profiles` berdasarkan `auth.uid()`.

## RLS Wajib Aktif

Aktifkan RLS untuk:

- `profiles`
- `students`
- `assessment_files`
- `school_attendance`
- `bk_service_attendance`
- `counseling_records`
- `student_assistances`
- `class_assistances`
- `documents`
- `home_visits`
- `confession_box`

## Policy Umum

### Untuk Admin dan Guru BK

Admin dan guru BK boleh select, insert, update, delete pada tabel BK, kecuali aturan khusus jika diperlukan.

### Untuk Siswa

Siswa hanya boleh insert ke `confession_box`.

Untuk `confession_box`:

- siswa boleh insert data curhat
- siswa tidak boleh melihat semua curhat siswa lain
- guru BK dan admin boleh melihat data curhat

## Larangan Policy

Jangan membuat policy seperti ini untuk tabel sensitif:

```sql
using (true)
with check (true)
```

Kecuali untuk data yang memang publik, dan harus ada alasan jelas.

## Storage Security

Bucket yang digunakan:

- `assessment-files`
- `document-files`
- `home-visit-files`

Aturan:

- File asesmen boleh dikelola admin/guru BK.
- File dokumen BK hanya admin/guru BK.
- Dokumentasi home visit hanya admin/guru BK.
- Siswa tidak boleh akses file sensitif.

## Acceptance Criteria

- Semua tabel sensitif RLS aktif.
- Siswa tidak bisa membaca data konseling, siswa lain, dokumen, home visit, dan pendampingan.
- Guru BK bisa mengelola data BK.
- Admin bisa mengelola semua data.
- Policy tidak menggunakan `using (true)` secara berbahaya.
