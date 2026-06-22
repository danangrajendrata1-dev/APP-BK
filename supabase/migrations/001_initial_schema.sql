begin;

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'siswa' check (role in ('admin', 'guru_bk', 'siswa')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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

create index if not exists idx_students_nisn on public.students(nisn);
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

create or replace trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

create or replace trigger set_students_updated_at
before update on public.students
for each row
execute function public.set_updated_at();

create or replace trigger set_assessment_files_updated_at
before update on public.assessment_files
for each row
execute function public.set_updated_at();

create or replace trigger set_school_attendance_updated_at
before update on public.school_attendance
for each row
execute function public.set_updated_at();

create or replace trigger set_bk_service_attendance_updated_at
before update on public.bk_service_attendance
for each row
execute function public.set_updated_at();

create or replace trigger set_counseling_records_updated_at
before update on public.counseling_records
for each row
execute function public.set_updated_at();

create or replace trigger set_student_assistances_updated_at
before update on public.student_assistances
for each row
execute function public.set_updated_at();

create or replace trigger set_class_assistances_updated_at
before update on public.class_assistances
for each row
execute function public.set_updated_at();

create or replace trigger set_documents_updated_at
before update on public.documents
for each row
execute function public.set_updated_at();

create or replace trigger set_home_visits_updated_at
before update on public.home_visits
for each row
execute function public.set_updated_at();

create or replace trigger set_confession_box_updated_at
before update on public.confession_box
for each row
execute function public.set_updated_at();

comment on table public.profiles is 'Profile user aplikasi BK. RLS dan policy ditambahkan pada step berikutnya.';
comment on table public.students is 'Data induk siswa sesuai PRD.';
comment on table public.assessment_files is 'Metadata file inventori dan asesmen.';
comment on table public.school_attendance is 'Presensi sekolah siswa.';
comment on table public.bk_service_attendance is 'Presensi layanan BK.';
comment on table public.counseling_records is 'Catatan konseling siswa.';
comment on table public.student_assistances is 'Catatan pendampingan siswa per bulan dengan kolom harian 1-31 sesuai schema.';
comment on table public.class_assistances is 'Daftar pendampingan siswa per kelas.';
comment on table public.documents is 'Surat dan dokumen BK.';
comment on table public.home_visits is 'Data home visit siswa.';
comment on table public.confession_box is 'Kotak curhat digital siswa.';

commit;
