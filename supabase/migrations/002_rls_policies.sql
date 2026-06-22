begin;

create or replace function public.get_current_user_role()
returns text
language sql
security definer
set search_path = public
as $$
  select role
  from public.profiles
  where id = auth.uid()
$$;

alter table public.profiles enable row level security;
alter table public.students enable row level security;
alter table public.assessment_files enable row level security;
alter table public.school_attendance enable row level security;
alter table public.bk_service_attendance enable row level security;
alter table public.counseling_records enable row level security;
alter table public.student_assistances enable row level security;
alter table public.class_assistances enable row level security;
alter table public.documents enable row level security;
alter table public.home_visits enable row level security;
alter table public.confession_box enable row level security;

drop policy if exists "select_own_profile" on public.profiles;
drop policy if exists "admin_select_all_profiles" on public.profiles;
drop policy if exists "admin_insert_profiles" on public.profiles;
drop policy if exists "admin_update_profiles" on public.profiles;
drop policy if exists "admin_delete_profiles" on public.profiles;

create policy "select_own_profile"
on public.profiles
for select
to authenticated
using (id = auth.uid());

create policy "admin_select_all_profiles"
on public.profiles
for select
to authenticated
using (public.get_current_user_role() = 'admin');

create policy "admin_insert_profiles"
on public.profiles
for insert
to authenticated
with check (public.get_current_user_role() = 'admin');

create policy "admin_update_profiles"
on public.profiles
for update
to authenticated
using (public.get_current_user_role() = 'admin')
with check (public.get_current_user_role() = 'admin');

create policy "admin_delete_profiles"
on public.profiles
for delete
to authenticated
using (public.get_current_user_role() = 'admin');

drop policy if exists "admin_guru_bk_select_students" on public.students;
drop policy if exists "admin_guru_bk_insert_students" on public.students;
drop policy if exists "admin_guru_bk_update_students" on public.students;
drop policy if exists "admin_delete_students" on public.students;

create policy "admin_guru_bk_select_students"
on public.students
for select
to authenticated
using (public.get_current_user_role() in ('admin', 'guru_bk'));

create policy "admin_guru_bk_insert_students"
on public.students
for insert
to authenticated
with check (public.get_current_user_role() in ('admin', 'guru_bk'));

create policy "admin_guru_bk_update_students"
on public.students
for update
to authenticated
using (public.get_current_user_role() in ('admin', 'guru_bk'))
with check (public.get_current_user_role() in ('admin', 'guru_bk'));

create policy "admin_delete_students"
on public.students
for delete
to authenticated
using (public.get_current_user_role() = 'admin');

drop policy if exists "admin_guru_bk_select_assessment_files" on public.assessment_files;
drop policy if exists "admin_guru_bk_insert_assessment_files" on public.assessment_files;
drop policy if exists "admin_guru_bk_update_assessment_files" on public.assessment_files;
drop policy if exists "admin_delete_assessment_files" on public.assessment_files;

create policy "admin_guru_bk_select_assessment_files"
on public.assessment_files
for select
to authenticated
using (public.get_current_user_role() in ('admin', 'guru_bk'));

create policy "admin_guru_bk_insert_assessment_files"
on public.assessment_files
for insert
to authenticated
with check (public.get_current_user_role() in ('admin', 'guru_bk'));

create policy "admin_guru_bk_update_assessment_files"
on public.assessment_files
for update
to authenticated
using (public.get_current_user_role() in ('admin', 'guru_bk'))
with check (public.get_current_user_role() in ('admin', 'guru_bk'));

create policy "admin_delete_assessment_files"
on public.assessment_files
for delete
to authenticated
using (public.get_current_user_role() = 'admin');

drop policy if exists "admin_guru_bk_select_school_attendance" on public.school_attendance;
drop policy if exists "admin_guru_bk_insert_school_attendance" on public.school_attendance;
drop policy if exists "admin_guru_bk_update_school_attendance" on public.school_attendance;
drop policy if exists "admin_delete_school_attendance" on public.school_attendance;

create policy "admin_guru_bk_select_school_attendance"
on public.school_attendance
for select
to authenticated
using (public.get_current_user_role() in ('admin', 'guru_bk'));

create policy "admin_guru_bk_insert_school_attendance"
on public.school_attendance
for insert
to authenticated
with check (public.get_current_user_role() in ('admin', 'guru_bk'));

create policy "admin_guru_bk_update_school_attendance"
on public.school_attendance
for update
to authenticated
using (public.get_current_user_role() in ('admin', 'guru_bk'))
with check (public.get_current_user_role() in ('admin', 'guru_bk'));

create policy "admin_delete_school_attendance"
on public.school_attendance
for delete
to authenticated
using (public.get_current_user_role() = 'admin');

drop policy if exists "admin_guru_bk_select_bk_service_attendance" on public.bk_service_attendance;
drop policy if exists "admin_guru_bk_insert_bk_service_attendance" on public.bk_service_attendance;
drop policy if exists "admin_guru_bk_update_bk_service_attendance" on public.bk_service_attendance;
drop policy if exists "admin_delete_bk_service_attendance" on public.bk_service_attendance;

create policy "admin_guru_bk_select_bk_service_attendance"
on public.bk_service_attendance
for select
to authenticated
using (public.get_current_user_role() in ('admin', 'guru_bk'));

create policy "admin_guru_bk_insert_bk_service_attendance"
on public.bk_service_attendance
for insert
to authenticated
with check (public.get_current_user_role() in ('admin', 'guru_bk'));

create policy "admin_guru_bk_update_bk_service_attendance"
on public.bk_service_attendance
for update
to authenticated
using (public.get_current_user_role() in ('admin', 'guru_bk'))
with check (public.get_current_user_role() in ('admin', 'guru_bk'));

create policy "admin_delete_bk_service_attendance"
on public.bk_service_attendance
for delete
to authenticated
using (public.get_current_user_role() = 'admin');

drop policy if exists "admin_guru_bk_select_counseling_records" on public.counseling_records;
drop policy if exists "admin_guru_bk_insert_counseling_records" on public.counseling_records;
drop policy if exists "admin_guru_bk_update_counseling_records" on public.counseling_records;
drop policy if exists "admin_delete_counseling_records" on public.counseling_records;

create policy "admin_guru_bk_select_counseling_records"
on public.counseling_records
for select
to authenticated
using (public.get_current_user_role() in ('admin', 'guru_bk'));

create policy "admin_guru_bk_insert_counseling_records"
on public.counseling_records
for insert
to authenticated
with check (public.get_current_user_role() in ('admin', 'guru_bk'));

create policy "admin_guru_bk_update_counseling_records"
on public.counseling_records
for update
to authenticated
using (public.get_current_user_role() in ('admin', 'guru_bk'))
with check (public.get_current_user_role() in ('admin', 'guru_bk'));

create policy "admin_delete_counseling_records"
on public.counseling_records
for delete
to authenticated
using (public.get_current_user_role() = 'admin');

drop policy if exists "admin_guru_bk_select_student_assistances" on public.student_assistances;
drop policy if exists "admin_guru_bk_insert_student_assistances" on public.student_assistances;
drop policy if exists "admin_guru_bk_update_student_assistances" on public.student_assistances;
drop policy if exists "admin_delete_student_assistances" on public.student_assistances;

create policy "admin_guru_bk_select_student_assistances"
on public.student_assistances
for select
to authenticated
using (public.get_current_user_role() in ('admin', 'guru_bk'));

create policy "admin_guru_bk_insert_student_assistances"
on public.student_assistances
for insert
to authenticated
with check (public.get_current_user_role() in ('admin', 'guru_bk'));

create policy "admin_guru_bk_update_student_assistances"
on public.student_assistances
for update
to authenticated
using (public.get_current_user_role() in ('admin', 'guru_bk'))
with check (public.get_current_user_role() in ('admin', 'guru_bk'));

create policy "admin_delete_student_assistances"
on public.student_assistances
for delete
to authenticated
using (public.get_current_user_role() = 'admin');

drop policy if exists "admin_guru_bk_select_class_assistances" on public.class_assistances;
drop policy if exists "admin_guru_bk_insert_class_assistances" on public.class_assistances;
drop policy if exists "admin_guru_bk_update_class_assistances" on public.class_assistances;
drop policy if exists "admin_delete_class_assistances" on public.class_assistances;

create policy "admin_guru_bk_select_class_assistances"
on public.class_assistances
for select
to authenticated
using (public.get_current_user_role() in ('admin', 'guru_bk'));

create policy "admin_guru_bk_insert_class_assistances"
on public.class_assistances
for insert
to authenticated
with check (public.get_current_user_role() in ('admin', 'guru_bk'));

create policy "admin_guru_bk_update_class_assistances"
on public.class_assistances
for update
to authenticated
using (public.get_current_user_role() in ('admin', 'guru_bk'))
with check (public.get_current_user_role() in ('admin', 'guru_bk'));

create policy "admin_delete_class_assistances"
on public.class_assistances
for delete
to authenticated
using (public.get_current_user_role() = 'admin');

drop policy if exists "admin_guru_bk_select_documents" on public.documents;
drop policy if exists "admin_guru_bk_insert_documents" on public.documents;
drop policy if exists "admin_guru_bk_update_documents" on public.documents;
drop policy if exists "admin_delete_documents" on public.documents;

create policy "admin_guru_bk_select_documents"
on public.documents
for select
to authenticated
using (public.get_current_user_role() in ('admin', 'guru_bk'));

create policy "admin_guru_bk_insert_documents"
on public.documents
for insert
to authenticated
with check (public.get_current_user_role() in ('admin', 'guru_bk'));

create policy "admin_guru_bk_update_documents"
on public.documents
for update
to authenticated
using (public.get_current_user_role() in ('admin', 'guru_bk'))
with check (public.get_current_user_role() in ('admin', 'guru_bk'));

create policy "admin_delete_documents"
on public.documents
for delete
to authenticated
using (public.get_current_user_role() = 'admin');

drop policy if exists "admin_guru_bk_select_home_visits" on public.home_visits;
drop policy if exists "admin_guru_bk_insert_home_visits" on public.home_visits;
drop policy if exists "admin_guru_bk_update_home_visits" on public.home_visits;
drop policy if exists "admin_delete_home_visits" on public.home_visits;

create policy "admin_guru_bk_select_home_visits"
on public.home_visits
for select
to authenticated
using (public.get_current_user_role() in ('admin', 'guru_bk'));

create policy "admin_guru_bk_insert_home_visits"
on public.home_visits
for insert
to authenticated
with check (public.get_current_user_role() in ('admin', 'guru_bk'));

create policy "admin_guru_bk_update_home_visits"
on public.home_visits
for update
to authenticated
using (public.get_current_user_role() in ('admin', 'guru_bk'))
with check (public.get_current_user_role() in ('admin', 'guru_bk'));

create policy "admin_delete_home_visits"
on public.home_visits
for delete
to authenticated
using (public.get_current_user_role() = 'admin');

drop policy if exists "admin_guru_bk_select_confession" on public.confession_box;
drop policy if exists "admin_guru_bk_insert_confession" on public.confession_box;
drop policy if exists "admin_guru_bk_update_confession" on public.confession_box;
drop policy if exists "admin_delete_confession" on public.confession_box;
drop policy if exists "siswa_insert_confession" on public.confession_box;
drop policy if exists "siswa_select_own_confession" on public.confession_box;

create policy "admin_guru_bk_select_confession"
on public.confession_box
for select
to authenticated
using (public.get_current_user_role() in ('admin', 'guru_bk'));

create policy "admin_guru_bk_insert_confession"
on public.confession_box
for insert
to authenticated
with check (public.get_current_user_role() in ('admin', 'guru_bk'));

create policy "admin_guru_bk_update_confession"
on public.confession_box
for update
to authenticated
using (public.get_current_user_role() in ('admin', 'guru_bk'))
with check (public.get_current_user_role() in ('admin', 'guru_bk'));

create policy "admin_delete_confession"
on public.confession_box
for delete
to authenticated
using (public.get_current_user_role() = 'admin');

create policy "siswa_insert_confession"
on public.confession_box
for insert
to authenticated
with check (
  public.get_current_user_role() = 'siswa'
  and created_by = auth.uid()
);

create policy "siswa_select_own_confession"
on public.confession_box
for select
to authenticated
using (
  public.get_current_user_role() = 'siswa'
  and created_by = auth.uid()
);

drop policy if exists "admin_guru_bk_manage_assessment_storage" on storage.objects;
drop policy if exists "admin_guru_bk_manage_document_storage" on storage.objects;
drop policy if exists "admin_guru_bk_manage_home_visit_storage" on storage.objects;
drop policy if exists "admin_guru_bk_read_assessment_storage" on storage.objects;
drop policy if exists "admin_guru_bk_read_document_storage" on storage.objects;
drop policy if exists "admin_guru_bk_read_home_visit_storage" on storage.objects;

create policy "admin_guru_bk_manage_assessment_storage"
on storage.objects
for all
to authenticated
using (
  bucket_id = 'assessment-files'
  and public.get_current_user_role() in ('admin', 'guru_bk')
)
with check (
  bucket_id = 'assessment-files'
  and public.get_current_user_role() in ('admin', 'guru_bk')
);

create policy "admin_guru_bk_manage_document_storage"
on storage.objects
for all
to authenticated
using (
  bucket_id = 'document-files'
  and public.get_current_user_role() in ('admin', 'guru_bk')
)
with check (
  bucket_id = 'document-files'
  and public.get_current_user_role() in ('admin', 'guru_bk')
);

create policy "admin_guru_bk_manage_home_visit_storage"
on storage.objects
for all
to authenticated
using (
  bucket_id = 'home-visit-files'
  and public.get_current_user_role() in ('admin', 'guru_bk')
)
with check (
  bucket_id = 'home-visit-files'
  and public.get_current_user_role() in ('admin', 'guru_bk')
);

commit;
