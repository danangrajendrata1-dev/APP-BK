begin;

do $$
declare
  has_students_table boolean;
  has_gender_check boolean;
  has_nisn_unique boolean;
begin
  select exists (
    select 1
    from information_schema.tables
    where table_schema = 'public'
      and table_name = 'students'
  ) into has_students_table;

  if not has_students_table then
    raise exception 'public.students does not exist';
  end if;

  alter table public.students
    add column if not exists nisn text,
    add column if not exists full_name text,
    add column if not exists class_name text,
    add column if not exists gender text,
    add column if not exists birth_place_date text,
    add column if not exists address text,
    add column if not exists phone text,
    add column if not exists parent_name text,
    add column if not exists status text default 'Aktif',
    add column if not exists created_at timestamptz not null default now(),
    add column if not exists updated_at timestamptz not null default now();

  alter table public.students
    alter column id set default gen_random_uuid(),
    alter column created_at set default now(),
    alter column updated_at set default now(),
    alter column status set default 'Aktif',
    alter column status set not null,
    alter column created_at set not null,
    alter column updated_at set not null;

  execute $view$
    create or replace view public.v_students_with_relations as
    select
      s.id,
      s.nisn,
      s.full_name,
      s.gender,
      coalesce(nullif(trim(s.class_name), ''), 'Tanpa Kelas') as class_name,
      ''::text as major,
      ''::text as major_code,
      s.birth_place_date,
      s.address,
      s.phone,
      s.parent_name,
      null::text as parent_phone,
      s.status,
      s.created_at,
      s.updated_at
    from public.students as s
    order by s.full_name
  $view$;

  select exists (
    select 1
    from pg_constraint
    where conrelid = 'public.students'::regclass
      and conname = 'students_gender_check'
  ) into has_gender_check;

  if not has_gender_check then
    alter table public.students
      add constraint students_gender_check
      check (gender in ('Laki-laki', 'Perempuan'));
  end if;

  select exists (
    select 1
    from pg_constraint
    where conrelid = 'public.students'::regclass
      and conname = 'students_nisn_key'
  ) into has_nisn_unique;

  if not has_nisn_unique then
    alter table public.students
      add constraint students_nisn_key unique (nisn);
  end if;

  alter table public.students
    alter column nisn set not null,
    alter column full_name set not null,
    alter column class_name set not null,
    alter column gender set not null,
    alter column status set default 'Aktif';

  alter table public.students
    drop column if exists major,
    drop column if exists parent_phone;
end
$$;

grant select on public.v_students_with_relations to authenticated, anon;

notify pgrst, 'reload schema';

commit;
