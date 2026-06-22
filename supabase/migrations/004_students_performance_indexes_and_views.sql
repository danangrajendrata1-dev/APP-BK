begin;

create extension if not exists pg_trgm;

create index if not exists idx_students_class_name
on public.students (class_name);

create index if not exists idx_students_nisn
on public.students (nisn);

create index if not exists idx_students_full_name_trgm
on public.students
using gin (full_name gin_trgm_ops);

create or replace view public.v_student_class_options as
select
  trim(class_name) as class_name
from public.students
where nullif(trim(class_name), '') is not null
group by trim(class_name)
order by class_name;

create or replace view public.v_student_count_by_class as
select
  coalesce(nullif(trim(class_name), ''), 'Tanpa Kelas') as class_name,
  count(*)::int as total_students
from public.students
group by coalesce(nullif(trim(class_name), ''), 'Tanpa Kelas');

commit;
