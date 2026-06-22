begin;

do $$
declare
  constraint_name text;
begin
  -- Allow the final role set in profiles.
  for constraint_name in
    select conname
    from pg_constraint
    where conrelid = 'public.profiles'::regclass
      and contype = 'c'
  loop
    execute format('alter table public.profiles drop constraint %I', constraint_name);
  end loop;

  alter table public.profiles
    add constraint profiles_role_check
    check (role in ('admin', 'guru_bk', 'kepala_sekolah', 'siswa'));

  -- Final students schema.
  alter table public.students
    add column if not exists nisn text,
    add column if not exists full_name text,
    add column if not exists gender text,
    add column if not exists class_name text,
    add column if not exists birth_place_date text,
    add column if not exists address text,
    add column if not exists phone text,
    add column if not exists parent_name text,
    add column if not exists status text default 'Aktif';

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'students'
      and column_name = 'major'
  ) then
    execute 'alter table public.students drop column if exists major';
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'students'
      and column_name = 'parent_phone'
  ) then
    execute 'alter table public.students drop column if exists parent_phone';
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'students'
      and column_name = 'class_id'
  ) then
    execute 'alter table public.students drop column if exists class_id';
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'students'
      and column_name = 'major_id'
  ) then
    execute 'alter table public.students drop column if exists major_id';
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'students'
      and column_name = 'academic_year_id'
  ) then
    execute 'alter table public.students drop column if exists academic_year_id';
  end if;

  for constraint_name in
    select conname
    from pg_constraint
    where conrelid = 'public.students'::regclass
      and contype in ('c', 'f', 'u')
  loop
    execute format('alter table public.students drop constraint %I', constraint_name);
  end loop;

  alter table public.students
    alter column id set default gen_random_uuid(),
    alter column nisn set not null,
    alter column full_name set not null,
    alter column class_name set not null,
    alter column gender set not null,
    alter column birth_place_date drop not null,
    alter column address drop not null,
    alter column phone drop not null,
    alter column parent_name drop not null,
    alter column status set default 'Aktif',
    alter column status set not null,
    alter column created_at set default now(),
    alter column updated_at set default now(),
    alter column created_at set not null,
    alter column updated_at set not null;

  alter table public.students
    add constraint students_gender_check
    check (gender in ('Laki-laki', 'Perempuan'));

  alter table public.students
    add constraint students_status_check
    check (status in ('Aktif', 'Lulus', 'Pindah', 'Off'));

  alter table public.students
    add constraint students_nisn_key unique (nisn);

  -- Final school attendance schema.
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'school_attendance'
      and column_name = 'status'
  ) and not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'school_attendance'
      and column_name = 'attendance_status'
  ) then
    execute 'alter table public.school_attendance rename column status to attendance_status';
  end if;

  alter table public.school_attendance
    add column if not exists attendance_year integer,
    add column if not exists attendance_month integer,
    add column if not exists attendance_day integer;

  update public.school_attendance
  set attendance_year = extract(year from attendance_date)::int,
      attendance_month = extract(month from attendance_date)::int,
      attendance_day = extract(day from attendance_date)::int
  where attendance_year is null
     or attendance_month is null
     or attendance_day is null;

  for constraint_name in
    select conname
    from pg_constraint
    where conrelid = 'public.school_attendance'::regclass
      and contype in ('c', 'f', 'u')
  loop
    execute format('alter table public.school_attendance drop constraint %I', constraint_name);
  end loop;

  alter table public.school_attendance
    alter column attendance_year set not null,
    alter column attendance_month set not null,
    alter column attendance_day set not null,
    alter column attendance_date set not null,
    alter column student_id set not null,
    alter column student_name set not null,
    alter column class_name set not null,
    alter column attendance_status set not null;

  alter table public.school_attendance
    add constraint school_attendance_status_check
    check (attendance_status in ('S', 'I', 'A'));

  alter table public.school_attendance
    add constraint school_attendance_student_date_key unique (student_id, attendance_date);

  alter table public.school_attendance
    drop constraint if exists school_attendance_student_id_fkey;

  alter table public.school_attendance
    add constraint school_attendance_student_id_fkey
    foreign key (student_id)
    references public.students(id)
    on delete cascade;

  -- Final BK service attendance schema.
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'bk_service_attendance'
      and column_name = 'service_date'
  ) and not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'bk_service_attendance'
      and column_name = 'visit_date'
  ) then
    execute 'alter table public.bk_service_attendance rename column service_date to visit_date';
  end if;

  alter table public.bk_service_attendance
    add column if not exists result text,
    add column if not exists follow_up text,
    add column if not exists signature text;

  for constraint_name in
    select conname
    from pg_constraint
    where conrelid = 'public.bk_service_attendance'::regclass
      and contype in ('c', 'f', 'u')
  loop
    execute format('alter table public.bk_service_attendance drop constraint %I', constraint_name);
  end loop;

  alter table public.bk_service_attendance
    alter column visit_date set not null,
    alter column student_name set not null,
    alter column class_name set not null,
    alter column purpose set not null;

  alter table public.bk_service_attendance
    alter column student_id drop not null;

  alter table public.bk_service_attendance
    drop column if exists arrival_time,
    drop column if exists finish_time,
    drop column if exists service_type,
    drop column if exists counselor_name;

  -- Final documents schema.
  alter table public.documents
    add column if not exists title text,
    add column if not exists file_name text,
    add column if not exists mime_type text,
    add column if not exists file_size bigint default 0;

  for constraint_name in
    select conname
    from pg_constraint
    where conrelid = 'public.documents'::regclass
      and contype in ('c', 'f', 'u')
  loop
    execute format('alter table public.documents drop constraint %I', constraint_name);
  end loop;

  alter table public.documents
    alter column title set not null,
    alter column file_path set not null,
    alter column file_name set not null,
    alter column mime_type set not null,
    alter column file_size set not null,
    alter column file_size set default 0,
    alter column created_at set default now(),
    alter column updated_at set default now();

  update public.documents
  set title = coalesce(nullif(trim(title), ''), nullif(trim(letter_number), ''), nullif(trim(document_type), ''), 'Dokumen tanpa judul'),
      file_name = coalesce(nullif(trim(file_name), ''), nullif(trim(letter_number), ''), 'file'),
      mime_type = coalesce(nullif(trim(mime_type), ''), 'application/octet-stream'),
      file_size = coalesce(file_size, 0);

  alter table public.documents
    drop column if exists letter_number,
    drop column if exists document_date,
    drop column if exists student_id,
    drop column if exists student_name,
    drop column if exists class_name,
    drop column if exists document_type,
    drop column if exists file_url;

  -- Final violation records schema.
  create table if not exists public.violation_records (
    id uuid primary key default gen_random_uuid(),
    violation_year integer not null,
    violation_month integer not null check (violation_month between 1 and 12),
    violation_day integer not null check (violation_day between 1 and 31),
    violation_date date not null,
    student_id uuid not null references public.students(id) on delete cascade,
    student_name text not null,
    class_name text not null,
    violation_code text,
    description text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
  );

  alter table public.violation_records
    add column if not exists violation_year integer,
    add column if not exists violation_month integer,
    add column if not exists violation_day integer,
    add column if not exists violation_date date,
    add column if not exists student_id uuid,
    add column if not exists student_name text,
    add column if not exists class_name text,
    add column if not exists violation_code text,
    add column if not exists description text,
    add column if not exists created_at timestamptz not null default now(),
    add column if not exists updated_at timestamptz not null default now();

  alter table public.violation_records
    alter column violation_year set not null,
    alter column violation_month set not null,
    alter column violation_day set not null,
    alter column violation_date set not null,
    alter column student_id set not null,
    alter column student_name set not null,
    alter column class_name set not null,
    alter column created_at set default now(),
    alter column updated_at set default now(),
    alter column created_at set not null,
    alter column updated_at set not null;

end
$$;

update public.school_attendance
set attendance_status = upper(attendance_status)
where attendance_status is not null;

update public.school_attendance
set attendance_status = 'S'
where attendance_status not in ('S', 'I', 'A');

update public.bk_service_attendance
set purpose = coalesce(nullif(trim(purpose), ''), 'Lainnya');

update public.documents
set title = coalesce(nullif(trim(title), ''), 'Dokumen tanpa judul'),
    file_name = coalesce(nullif(trim(file_name), ''), 'file')
where title is null
   or file_name is null
   or mime_type is null;

update public.violation_records
set violation_code = coalesce(nullif(trim(violation_code), ''), null);

do $$
declare
  constraint_name text;
begin
  for constraint_name in
    select conname
    from pg_constraint
    where conrelid = 'public.violation_records'::regclass
      and contype in ('c', 'f', 'u')
  loop
    execute format('alter table public.violation_records drop constraint %I', constraint_name);
  end loop;

  alter table public.violation_records
    add constraint violation_records_year_month_check
    check (violation_month between 1 and 12 and violation_day between 1 and 31);

  alter table public.violation_records
    add constraint violation_records_student_id_fkey
    foreign key (student_id)
    references public.students(id)
    on delete cascade;
end
$$;

drop index if exists idx_students_major;
drop index if exists idx_school_attendance_date;
drop index if exists idx_school_attendance_class;
drop index if exists idx_school_attendance_status;
drop index if exists idx_bk_service_attendance_date;
drop index if exists idx_bk_service_attendance_class;
drop index if exists idx_documents_date;
drop index if exists idx_documents_type;

create index if not exists idx_students_nisn on public.students(nisn);
create index if not exists idx_students_class_name on public.students(class_name);
create index if not exists idx_students_full_name on public.students(full_name);
create index if not exists idx_students_status on public.students(status);

create index if not exists idx_school_attendance_year_month
  on public.school_attendance(attendance_year, attendance_month);
create index if not exists idx_school_attendance_class_year_month
  on public.school_attendance(class_name, attendance_year, attendance_month);
create index if not exists idx_school_attendance_student_year_month
  on public.school_attendance(student_id, attendance_year, attendance_month);
create index if not exists idx_school_attendance_status
  on public.school_attendance(attendance_status);

create index if not exists idx_bk_service_attendance_visit_date
  on public.bk_service_attendance(visit_date);
create index if not exists idx_bk_service_attendance_class_visit_date
  on public.bk_service_attendance(class_name, visit_date);
create index if not exists idx_bk_service_attendance_student
  on public.bk_service_attendance(student_id);

create index if not exists idx_documents_created_at
  on public.documents(created_at desc);
create index if not exists idx_documents_title
  on public.documents(title);

create index if not exists idx_violation_records_year_month
  on public.violation_records(violation_year, violation_month);
create index if not exists idx_violation_records_class_year_month
  on public.violation_records(class_name, violation_year, violation_month);
create index if not exists idx_violation_records_student_year_month
  on public.violation_records(student_id, violation_year, violation_month);
create index if not exists idx_violation_records_date
  on public.violation_records(violation_date);

do $$
declare
  has_deleted_at boolean;
begin
  select exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'students'
      and column_name = 'deleted_at'
  ) into has_deleted_at;

  if has_deleted_at then
    execute $view$
      create or replace view public.v_student_class_options as
      select distinct
        coalesce(nullif(trim(s.class_name), ''), 'Tanpa Kelas') as class_name
      from public.students as s
      where nullif(trim(s.class_name), '') is not null
        and s.deleted_at is null
      order by class_name
    $view$;

    execute $view$
      create or replace view public.v_student_count_by_class as
      select
        coalesce(nullif(trim(s.class_name), ''), 'Tanpa Kelas') as class_name,
        count(s.id)::int as total_students
      from public.students as s
      where s.deleted_at is null
      group by coalesce(nullif(trim(s.class_name), ''), 'Tanpa Kelas')
      order by class_name
    $view$;

    execute $view$
      create or replace view public.v_students_with_relations as
      select
        s.id,
        s.nisn,
        s.full_name,
        s.gender,
        s.class_name,
        s.birth_place_date,
        s.address,
        s.phone,
        s.parent_name,
        s.status,
        s.created_at,
        s.updated_at
      from public.students as s
      where s.deleted_at is null
      order by s.full_name
    $view$;
  else
    execute $view$
      create or replace view public.v_student_class_options as
      select distinct
        coalesce(nullif(trim(s.class_name), ''), 'Tanpa Kelas') as class_name
      from public.students as s
      where nullif(trim(s.class_name), '') is not null
      order by class_name
    $view$;

    execute $view$
      create or replace view public.v_student_count_by_class as
      select
        coalesce(nullif(trim(s.class_name), ''), 'Tanpa Kelas') as class_name,
        count(s.id)::int as total_students
      from public.students as s
      group by coalesce(nullif(trim(s.class_name), ''), 'Tanpa Kelas')
      order by class_name
    $view$;

    execute $view$
      create or replace view public.v_students_with_relations as
      select
        s.id,
        s.nisn,
        s.full_name,
        s.gender,
        s.class_name,
        s.birth_place_date,
        s.address,
        s.phone,
        s.parent_name,
        s.status,
        s.created_at,
        s.updated_at
      from public.students as s
      order by s.full_name
    $view$;
  end if;
end
$$;

create or replace view public.v_school_attendance_with_relations as
select
  sa.id,
  sa.attendance_date,
  sa.student_id,
  sa.student_name,
  sa.class_name,
  sa.attendance_status as status,
  sa.description,
  sa.created_at,
  sa.updated_at
from public.school_attendance as sa
order by sa.attendance_date desc, sa.created_at desc;

create or replace view public.v_bk_service_attendance_with_relations as
select
  ba.id,
  ba.visit_date as service_date,
  ba.student_id,
  ba.student_name,
  ba.class_name,
  null::text as arrival_time,
  null::text as finish_time,
  ba.purpose,
  null::text as service_type,
  null::text as counselor_name,
  coalesce(ba.description, '') as description,
  ba.result,
  ba.follow_up,
  ba.signature,
  ba.created_at,
  ba.updated_at
from public.bk_service_attendance as ba
order by ba.visit_date desc, ba.created_at desc;

create or replace view public.v_counseling_records_with_relations as
select
  vr.id,
  vr.violation_date as counseling_date,
  vr.student_id,
  vr.student_name,
  vr.class_name,
  null::integer as meeting_number,
  'Offline'::text as media,
  'Individu'::text as counseling_type,
  coalesce(vr.violation_code, '') as topic,
  null::text as counseling_result,
  null::text as follow_up,
  coalesce(vr.description, '') as description,
  vr.created_at,
  vr.updated_at
from public.violation_records as vr
order by vr.violation_date desc, vr.created_at desc;

create or replace view public.v_bk_documents_with_relations as
select
  d.id,
  d.created_at::date as document_date,
  null::uuid as student_id,
  ''::text as student_name,
  null::text as class_name,
  d.title as document_type,
  d.file_name as letter_number,
  d.file_path as file_url,
  coalesce(d.description, '') as description,
  d.created_at,
  d.updated_at
from public.documents as d
order by d.created_at desc, d.updated_at desc;

create or replace view public.v_home_visits_with_relations as
select
  hv.id,
  hv.visit_date,
  hv.student_id,
  hv.student_name,
  hv.parent_name,
  hv.class_name,
  hv.address,
  hv.visit_result,
  hv.follow_up,
  hv.documentation_path,
  hv.created_at,
  hv.updated_at
from public.home_visits as hv
order by hv.visit_date desc, hv.created_at desc;

create or replace view public.v_digital_confessions_with_relations as
select
  cb.id,
  cb.confession_date,
  cb.student_id,
  coalesce(cb.student_name, '') as student_name,
  coalesce(cb.class_name, '') as class_name,
  cb.category,
  cb.content,
  coalesce(cb.description, '') as description,
  cb.created_by,
  cb.created_at,
  cb.updated_at
from public.confession_box as cb
order by cb.confession_date desc, cb.created_at desc;

create or replace view public.v_assessment_files_with_relations
with (security_invoker = true)
as
select
  af.id,
  af.title,
  af.assessment_type,
  af.file_url,
  af.file_path,
  coalesce(af.description, '') as description,
  af.created_at,
  af.updated_at
from public.assessment_files as af
order by af.updated_at desc, af.created_at desc;

grant select on public.v_student_class_options to authenticated, anon;
grant select on public.v_student_count_by_class to authenticated, anon;
grant select on public.v_students_with_relations to authenticated, anon;
grant select on public.v_school_attendance_with_relations to authenticated, anon;
grant select on public.v_bk_service_attendance_with_relations to authenticated, anon;
grant select on public.v_counseling_records_with_relations to authenticated, anon;
grant select on public.v_bk_documents_with_relations to authenticated, anon;
grant select on public.v_home_visits_with_relations to authenticated, anon;
grant select on public.v_digital_confessions_with_relations to authenticated, anon;
grant select on public.v_assessment_files_with_relations to authenticated, anon;

alter table public.violation_records enable row level security;
drop policy if exists "admin_guru_bk_select_violation_records" on public.violation_records;
drop policy if exists "admin_guru_bk_insert_violation_records" on public.violation_records;
drop policy if exists "admin_guru_bk_update_violation_records" on public.violation_records;
drop policy if exists "admin_delete_violation_records" on public.violation_records;

create policy "admin_guru_bk_select_violation_records"
on public.violation_records
for select
to authenticated
using (public.get_current_user_role() in ('admin', 'guru_bk'));

create policy "admin_guru_bk_insert_violation_records"
on public.violation_records
for insert
to authenticated
with check (public.get_current_user_role() in ('admin', 'guru_bk'));

create policy "admin_guru_bk_update_violation_records"
on public.violation_records
for update
to authenticated
using (public.get_current_user_role() in ('admin', 'guru_bk'))
with check (public.get_current_user_role() in ('admin', 'guru_bk'));

create policy "admin_delete_violation_records"
on public.violation_records
for delete
to authenticated
using (public.get_current_user_role() = 'admin');

notify pgrst, 'reload schema';

commit;
