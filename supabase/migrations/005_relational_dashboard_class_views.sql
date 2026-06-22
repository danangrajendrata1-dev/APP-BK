begin;

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

  execute $view$
    create or replace view public.v_student_class_options as
    select distinct
      coalesce(nullif(trim(c.name), ''), 'Tanpa Kelas') as class_name
    from public.classes as c
    where nullif(trim(c.name), '') is not null
    order by class_name
  $view$;

  if has_deleted_at then
    execute $view$
      create or replace view public.v_student_count_by_class as
      select
        coalesce(nullif(trim(c.name), ''), 'Tanpa Kelas') as class_name,
        count(s.id)::int as total_students
      from public.students as s
      left join public.classes as c
        on c.id = s.class_id
      where s.deleted_at is null
      group by coalesce(nullif(trim(c.name), ''), 'Tanpa Kelas')
      order by class_name
    $view$;
  else
    execute $view$
      create or replace view public.v_student_count_by_class as
      select
        coalesce(nullif(trim(c.name), ''), 'Tanpa Kelas') as class_name,
        count(s.id)::int as total_students
      from public.students as s
      left join public.classes as c
        on c.id = s.class_id
      group by coalesce(nullif(trim(c.name), ''), 'Tanpa Kelas')
      order by class_name
    $view$;
  end if;
end
$$;

notify pgrst, 'reload schema';

commit;
