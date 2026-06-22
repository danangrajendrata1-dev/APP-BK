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

  if has_deleted_at then
    execute $view$
      create or replace view public.v_students_with_relations as
      select
        s.id,
        s.nisn,
        s.full_name,
        s.gender,
        s.class_id,
        s.major_id,
        s.academic_year_id,
        coalesce(nullif(trim(c.name), ''), 'Tanpa Kelas') as class_name,
        coalesce(
          nullif(trim(m.name), ''),
          nullif(trim(m.code), ''),
          'Tanpa Jurusan'
        ) as major,
        coalesce(nullif(trim(m.code), ''), '') as major_code,
        s.birth_place_date,
        s.address,
        s.phone,
        s.parent_name,
        s.parent_phone,
        s.status,
        s.created_at,
        s.updated_at
      from public.students as s
      left join public.classes as c
        on c.id = s.class_id
      left join public.majors as m
        on m.id = s.major_id
      left join public.academic_years as ay
        on ay.id = s.academic_year_id
      where s.deleted_at is null
      order by s.full_name
    $view$;
  else
    execute $view$
      create or replace view public.v_students_with_relations as
      select
        s.id,
        s.nisn,
        s.full_name,
        s.gender,
        s.class_id,
        s.major_id,
        s.academic_year_id,
        coalesce(nullif(trim(c.name), ''), 'Tanpa Kelas') as class_name,
        coalesce(
          nullif(trim(m.name), ''),
          nullif(trim(m.code), ''),
          'Tanpa Jurusan'
        ) as major,
        coalesce(nullif(trim(m.code), ''), '') as major_code,
        s.birth_place_date,
        s.address,
        s.phone,
        s.parent_name,
        s.parent_phone,
        s.status,
        s.created_at,
        s.updated_at
      from public.students as s
      left join public.classes as c
        on c.id = s.class_id
      left join public.majors as m
        on m.id = s.major_id
      left join public.academic_years as ay
        on ay.id = s.academic_year_id
      order by s.full_name
    $view$;
  end if;

  execute $view$
    create or replace view public.v_school_attendance_with_relations as
    select
      sa.id,
      sa.attendance_date,
      sa.student_id,
      coalesce(nullif(trim(s.full_name), ''), '') as student_name,
      coalesce(nullif(trim(c.name), ''), 'Tanpa Kelas') as class_name,
      sa.status,
      sa.description,
      sa.created_at,
      sa.updated_at
    from public.school_attendance as sa
    left join public.students as s
      on s.id = sa.student_id
    left join public.classes as c
      on c.id = sa.class_id
    order by sa.attendance_date desc, sa.created_at desc
  $view$;

  execute $view$
    create or replace view public.v_bk_service_attendance_with_relations as
    select
      ba.id,
      ba.attendance_date as service_date,
      ba.student_id,
      coalesce(nullif(trim(s.full_name), ''), '') as student_name,
      coalesce(nullif(trim(c.name), ''), 'Tanpa Kelas') as class_name,
      null::text as arrival_time,
      null::text as finish_time,
      coalesce(nullif(trim(ba.topic), ''), 'Lainnya') as purpose,
      ba.service_type,
      null::text as counselor_name,
      coalesce(ba.note, '') as description,
      ba.created_at,
      ba.updated_at
    from public.bk_service_attendance as ba
    left join public.students as s
      on s.id = ba.student_id
    left join public.classes as c
      on c.id = ba.class_id
    order by ba.attendance_date desc, ba.created_at desc
  $view$;

  execute $view$
    create or replace view public.v_counseling_records_with_relations as
    select
      cr.id,
      cr.counseling_date,
      cr.student_id,
      coalesce(nullif(trim(s.full_name), ''), '') as student_name,
      coalesce(nullif(trim(c.name), ''), 'Tanpa Kelas') as class_name,
      null::integer as meeting_number,
      'Offline'::text as media,
      cr.counseling_type,
      coalesce(
        nullif(trim(cr.problem_category), ''),
        nullif(trim(cr.problem_summary), ''),
        ''
      ) as topic,
      coalesce(cr.counseling_result, '') as counseling_result,
      coalesce(cr.follow_up_plan, '') as follow_up,
      coalesce(cr.problem_summary, '') as description,
      cr.created_at,
      cr.updated_at
    from public.counseling_records as cr
    left join public.students as s
      on s.id = cr.student_id
    left join public.classes as c
      on c.id = cr.class_id
    order by cr.counseling_date desc, cr.created_at desc
  $view$;

  execute $view$
    create or replace view public.v_home_visits_with_relations as
    select
      hv.id,
      hv.visit_date,
      hv.student_id,
      coalesce(nullif(trim(s.full_name), ''), '') as student_name,
      coalesce(hv.parent_name, '') as parent_name,
      coalesce(nullif(trim(c.name), ''), 'Tanpa Kelas') as class_name,
      coalesce(hv.address, '') as address,
      coalesce(hv.result, '') as visit_result,
      coalesce(hv.follow_up_plan, '') as follow_up,
      null::text as documentation_path,
      hv.created_at,
      hv.updated_at
    from public.home_visits as hv
    left join public.students as s
      on s.id = hv.student_id
    left join public.classes as c
      on c.id = hv.class_id
    order by hv.visit_date desc, hv.created_at desc
  $view$;

  execute $view$
    create or replace view public.v_bk_documents_with_relations as
    select
      bd.id,
      bd.document_date,
      bd.student_id,
      coalesce(nullif(trim(s.full_name), ''), '') as student_name,
      coalesce(nullif(trim(c.name), ''), 'Tanpa Kelas') as class_name,
      bd.document_type,
      bd.document_number as letter_number,
      bd.file_url,
      coalesce(bd.description, '') as description,
      bd.created_at,
      bd.updated_at
    from public.bk_documents as bd
    left join public.students as s
      on s.id = bd.student_id
    left join public.classes as c
      on c.id = bd.class_id
    order by bd.document_date desc, bd.created_at desc
  $view$;

  execute $view$
    create or replace view public.v_digital_confessions_with_relations as
    select
      dc.id,
      dc.confession_date,
      dc.student_id,
      coalesce(nullif(trim(s.full_name), ''), '') as student_name,
      coalesce(nullif(trim(c.name), ''), 'Tanpa Kelas') as class_name,
      dc.category,
      dc.content,
      coalesce(dc.response_note, '') as description,
      dc.created_by,
      dc.created_at,
      dc.updated_at
    from public.digital_confessions as dc
    left join public.students as s
      on s.id = dc.student_id
    left join public.classes as c
      on c.id = dc.class_id
    order by dc.confession_date desc, dc.created_at desc
  $view$;

  execute $view$
    create or replace view public.v_assessment_files_with_relations
    with (security_invoker = true)
    as
  select
   sa.id,
   sa.title,
   sa.assessment_type,
   sa.file_url,
   sa.file_path,
   ''::text as description,
   sa.created_at,
   sa.updated_at
  from public.student_assessments sa
  order by sa.updated_at desc, sa.created_at desc;
  $view$;
end
$$;

grant select on public.v_students_with_relations to authenticated, anon;
grant select on public.v_school_attendance_with_relations to authenticated, anon;
grant select on public.v_bk_service_attendance_with_relations to authenticated, anon;
grant select on public.v_counseling_records_with_relations to authenticated, anon;
grant select on public.v_home_visits_with_relations to authenticated, anon;
grant select on public.v_bk_documents_with_relations to authenticated, anon;
grant select on public.v_digital_confessions_with_relations to authenticated, anon;
grant select on public.v_assessment_files_with_relations to authenticated, anon;

notify pgrst, 'reload schema';

commit;
