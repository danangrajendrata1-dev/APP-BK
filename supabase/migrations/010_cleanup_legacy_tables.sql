begin;

-- Drop obsolete views first
drop view if exists public.v_assessment_files_with_relations cascade;
drop view if exists public.v_home_visits_with_relations cascade;
drop view if exists public.v_counseling_records_with_relations cascade;
drop view if exists public.v_digital_confessions_with_relations cascade;

-- Drop obsolete tables
drop table if exists public.assessment_files cascade;
drop table if exists public.home_visits cascade;
drop table if exists public.counseling_records cascade;
drop table if exists public.confession_box cascade;
drop table if exists public.student_assistances cascade;

-- Reload schema for PostgREST
notify pgrst, 'reload schema';

commit;
