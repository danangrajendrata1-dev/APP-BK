# SECURITY_RULES.md - Aplikasi BK Sederhana

## 1. Tujuan Keamanan

Aplikasi BK menyimpan data sensitif seperti data siswa, catatan konseling, pendampingan, dokumen, home visit, dan curhat digital. Karena itu, aplikasi harus menjaga akses data agar hanya user yang berhak yang dapat membaca atau mengubah data.

---

## 2. Prinsip Keamanan

- Semua halaman utama wajib dilindungi login.
- Semua tabel utama wajib mengaktifkan Row Level Security atau RLS.
- Jangan menggunakan policy `using (true)` atau `with check (true)` untuk data sensitif.
- Role user harus jelas: `admin`, `guru_bk`, `siswa`.
- User siswa hanya boleh mengakses Kotak Curhat Digital.
- Guru BK boleh mengelola modul BK sesuai kebutuhan PRD.
- Admin boleh mengakses semua modul.
- File sensitif tidak boleh dibuka publik tanpa kontrol akses.
- Environment variable tidak boleh di-hardcode.
- `.env.local` tidak boleh di-commit ke GitHub.

---

## 3. Role Aplikasi

### Admin

Admin dapat:

- Mengakses seluruh menu.
- Membaca seluruh data.
- Menambah, mengubah, dan menghapus data sesuai kebutuhan aplikasi.
- Mengelola dokumen dan file.

### Guru BK

Guru BK dapat:

- Mengakses Dashboard.
- Mengakses Inventori dan Asesmen.
- Mengakses Data Siswa.
- Mengakses Presensi Sekolah.
- Mengakses Presensi Layanan BK.
- Mengakses Catatan Konseling.
- Mengakses Catatan Pendampingan Siswa Per Bulan.
- Mengakses Daftar Pendampingan Siswa Per Kelas.
- Mengakses Surat & Dokumen.
- Mengakses Home Visit.
- Mengakses Kotak Curhat Digital.
- Mengakses Laporan dan Statistik.

### Siswa

Siswa hanya dapat:

- Mengakses Kotak Curhat Digital.
- Mengirim curhat digital.

Siswa tidak boleh mengakses:

- Data siswa lengkap.
- Catatan konseling.
- Catatan pendampingan.
- Surat dan dokumen BK.
- Home visit.
- Laporan dan statistik.
- Data curhat milik siswa lain.

---

## 4. Proteksi Route Frontend

### Public Route

- `/login`
- `/register`

### Protected Route

- `/dashboard`
- `/assessments`
- `/students`
- `/school-attendance`
- `/bk-service-attendance`
- `/counseling-records`
- `/student-assistances`
- `/class-assistances`
- `/documents`
- `/home-visits`
- `/confession-box`
- `/reports`

### Aturan Route

- User belum login diarahkan ke `/login`.
- User siswa yang membuka selain `/confession-box` diarahkan ke `/confession-box` atau halaman unauthorized.
- Guru BK dan admin boleh membuka menu sesuai hak akses.
- Logout harus membersihkan session.

---

## 5. Supabase Auth

- Gunakan Supabase Auth untuk login dan register.
- Jangan menyimpan password manual di tabel aplikasi.
- Password dikelola oleh Supabase Auth.
- Tabel `profiles` digunakan untuk menyimpan role dan nama user.
- Role tidak boleh dipilih bebas oleh siswa saat registrasi jika dapat menyebabkan privilege escalation.
- Default role user baru sebaiknya `siswa`.
- Admin atau mekanisme internal yang aman dapat mengubah role menjadi `guru_bk` atau `admin`.

---

## 6. Helper Role di Database

Disarankan membuat function untuk membaca role user.

```sql
create or replace function public.get_my_role()
returns text
language sql
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;
```

Catatan:

- Pastikan function ini tidak membuka data sensitif lain.
- Gunakan function ini pada RLS policy.

---

## 7. Aktivasi RLS

Semua tabel utama wajib RLS:

```sql
alter table public.profiles enable row level security;
alter table public.students enable row level security;
alter table public.school_attendance enable row level security;
alter table public.bk_service_attendance enable row level security;
alter table public.counseling_records enable row level security;
alter table public.student_assistances enable row level security;
alter table public.class_assistances enable row level security;
alter table public.documents enable row level security;
alter table public.home_visits enable row level security;
alter table public.confession_box enable row level security;
alter table public.assessment_files enable row level security;
```

---

## 8. Policy Umum Admin dan Guru BK

Admin dan Guru BK boleh mengelola data utama BK.

Contoh pola policy:

```sql
create policy "admin_guru_bk_select_students"
on public.students
for select
to authenticated
using (public.get_my_role() in ('admin', 'guru_bk'));

create policy "admin_guru_bk_insert_students"
on public.students
for insert
to authenticated
with check (public.get_my_role() in ('admin', 'guru_bk'));

create policy "admin_guru_bk_update_students"
on public.students
for update
to authenticated
using (public.get_my_role() in ('admin', 'guru_bk'))
with check (public.get_my_role() in ('admin', 'guru_bk'));

create policy "admin_guru_bk_delete_students"
on public.students
for delete
to authenticated
using (public.get_my_role() = 'admin');
```

Catatan:

- Delete sebaiknya hanya admin.
- Guru BK sebaiknya update data, bukan delete permanen, kecuali disetujui.

---

## 9. Policy Data Sensitif

Tabel berikut sangat sensitif:

- `counseling_records`
- `student_assistances`
- `class_assistances`
- `documents`
- `home_visits`
- `confession_box`

Aturan:

- Siswa tidak boleh membaca seluruh data tabel tersebut.
- Guru BK dan admin boleh membaca sesuai kebutuhan kerja.
- Delete permanen sebaiknya hanya admin.

Contoh untuk catatan konseling:

```sql
create policy "admin_guru_bk_select_counseling_records"
on public.counseling_records
for select
to authenticated
using (public.get_my_role() in ('admin', 'guru_bk'));

create policy "admin_guru_bk_insert_counseling_records"
on public.counseling_records
for insert
to authenticated
with check (public.get_my_role() in ('admin', 'guru_bk'));

create policy "admin_guru_bk_update_counseling_records"
on public.counseling_records
for update
to authenticated
using (public.get_my_role() in ('admin', 'guru_bk'))
with check (public.get_my_role() in ('admin', 'guru_bk'));

create policy "admin_delete_counseling_records"
on public.counseling_records
for delete
to authenticated
using (public.get_my_role() = 'admin');
```

---

## 10. Policy Kotak Curhat Digital

Kotak Curhat Digital memiliki aturan khusus.

### Siswa

Siswa boleh membuat curhat digital.

```sql
create policy "siswa_insert_confession"
on public.confession_box
for insert
to authenticated
with check (public.get_my_role() in ('siswa', 'guru_bk', 'admin'));
```

### Guru BK dan Admin

Guru BK dan admin boleh membaca semua curhat digital.

```sql
create policy "admin_guru_bk_select_confession"
on public.confession_box
for select
to authenticated
using (public.get_my_role() in ('admin', 'guru_bk'));
```

### Update dan Delete

```sql
create policy "admin_guru_bk_update_confession"
on public.confession_box
for update
to authenticated
using (public.get_my_role() in ('admin', 'guru_bk'))
with check (public.get_my_role() in ('admin', 'guru_bk'));

create policy "admin_delete_confession"
on public.confession_box
for delete
to authenticated
using (public.get_my_role() = 'admin');
```

Catatan:

- Jika siswa perlu melihat curhat miliknya sendiri, harus ada kolom `created_by` dan policy khusus `created_by = auth.uid()`.
- Jika MVP hanya form kirim, siswa tidak perlu akses membaca semua data.

---

## 11. Policy Profiles

User boleh membaca profil sendiri.

```sql
create policy "select_own_profile"
on public.profiles
for select
to authenticated
using (id = auth.uid());
```

Admin boleh membaca semua profile.

```sql
create policy "admin_select_all_profiles"
on public.profiles
for select
to authenticated
using (public.get_my_role() = 'admin');
```

Admin boleh update role.

```sql
create policy "admin_update_profiles"
on public.profiles
for update
to authenticated
using (public.get_my_role() = 'admin')
with check (public.get_my_role() = 'admin');
```

---

## 12. Storage Security

Bucket:

- `assessment-files`
- `document-files`
- `home-visit-files`

Aturan:

- Jangan menjadikan bucket sensitif sebagai public bucket jika file berisi data pribadi.
- Gunakan signed URL jika file perlu dibuka sementara.
- Batasi upload berdasarkan role.
- File dokumen dan home visit hanya boleh diakses admin dan guru BK.
- Validasi tipe file di frontend dan backend/security policy.

---

## 13. Validasi Input

Validasi minimal:

- Field wajib tidak boleh kosong.
- Dropdown hanya menerima pilihan sesuai PRD.
- Tanggal harus valid.
- Jam datang dan jam selesai harus valid.
- Nomor HP disimpan sebagai text.
- File upload dibatasi tipe dan ukuran.
- Isi curhat tidak boleh kosong.
- NISN harus unik.

---

## 14. Data Privacy

Data berikut harus dianggap sensitif:

- NISN
- Nama siswa
- Alamat
- Nomor HP
- Nama orang tua/wali
- Nomor HP orang tua
- Catatan konseling
- Catatan pendampingan
- Isi curhat digital
- Hasil home visit
- Dokumen BK

Aturan:

- Jangan tampilkan data sensitif kepada role siswa.
- Jangan expose data sensitif melalui console log.
- Jangan simpan data sensitif di localStorage kecuali benar-benar diperlukan.
- Jangan mengirim data sensitif ke service pihak ketiga tanpa persetujuan.

---

## 15. Checklist Security Sebelum Deploy

- [ ] Semua route utama sudah protected.
- [ ] Role siswa tidak dapat membuka menu guru BK/admin.
- [ ] RLS aktif di semua tabel utama.
- [ ] Tidak ada policy `using (true)` untuk tabel sensitif.
- [ ] Tidak ada service role key di frontend.
- [ ] `.env.local` tidak masuk GitHub.
- [ ] Storage bucket sensitif tidak public sembarangan.
- [ ] Form memiliki validasi dasar.
- [ ] Error message tidak membocorkan detail database.
- [ ] Logout membersihkan session.
- [ ] Data curhat digital tidak terbaca oleh siswa lain.
