import { createSupabaseServerClient } from "@/lib/supabase/server";
import { buildSupabaseErrorMessage, logSupabaseError } from "@/lib/supabase/error";
import type { Database } from "@/types/database";
import type { ClassAssistanceFormValues } from "@/types/common";
import type { ClassAssistanceItem, ClassAssistanceListQuery, ClassAssistanceListResult } from "@/features/class-assistances/types/classAssistance";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const CLASS_ASSISTANCE_LIST_COLUMNS =
  "id, student_id, student_name, class_name, violation_type, action_form, remission, description, final_warning_letter";
type ClassAssistanceRow = Database["public"]["Tables"]["class_assistances"]["Row"];
type ClassAssistanceListRow = Pick<
  ClassAssistanceRow,
  | "id"
  | "student_id"
  | "student_name"
  | "class_name"
  | "violation_type"
  | "action_form"
  | "remission"
  | "description"
  | "final_warning_letter"
>;
type ClassAssistanceInsert = Database["public"]["Tables"]["class_assistances"]["Insert"];

function normalizeText(value: string | null | undefined) {
  return value ?? "";
}

function mapClassAssistance(row: ClassAssistanceListRow): ClassAssistanceItem {
  return {
    id: row.id,
    studentId: row.student_id ?? "",
    studentName: row.student_name,
    className: row.class_name,
    violationType: normalizeText(row.violation_type),
    actionForm: normalizeText(row.action_form),
    remission: normalizeText(row.remission),
    description: normalizeText(row.description),
    finalWarningLetter: normalizeText(row.final_warning_letter),
  };
}

function mapClassAssistancePayload(values: ClassAssistanceFormValues): ClassAssistanceInsert {
  return {
    student_id: values.studentId || null,
    student_name: values.studentName,
    class_name: values.className,
    violation_type: values.violationType,
    action_form: values.actionForm,
    remission: values.remission,
    description: values.description,
    final_warning_letter: values.finalWarningLetter,
  };
}

export async function getClassAssistances(
  params: Partial<ClassAssistanceListQuery> = {},
): Promise<ClassAssistanceListResult> {
  const supabase = await createSupabaseServerClient();
  const page = Math.max(params.page ?? DEFAULT_PAGE, 1);
  const pageSize = Math.max(params.pageSize ?? DEFAULT_PAGE_SIZE, 1);
  const filters = params.filters ?? {};
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("class_assistances")
    .select(CLASS_ASSISTANCE_LIST_COLUMNS, { count: "exact" })
    .order("student_name", { ascending: true })
    .range(from, to);

  if (filters.className) query = query.ilike("class_name", `%${filters.className}%`);
  if (filters.violationType) query = query.ilike("violation_type", `%${filters.violationType}%`);
  if (filters.finalWarningLetter) query = query.ilike("final_warning_letter", `%${filters.finalWarningLetter}%`);

  const { data, count, error } = await query;
  if (error) {
    logSupabaseError("[ClassAssistances] getClassAssistances", error, {
      page,
      pageSize,
      filters,
    });
    throw new Error(
      buildSupabaseErrorMessage(
        "Gagal memuat daftar pendampingan siswa per kelas",
        error,
      ),
    );
  }

  const totalItems = count ?? 0;
  return {
    items: (data ?? []).map(mapClassAssistance),
    filters,
    pagination: {
      page,
      pageSize,
      totalItems,
      totalPages: Math.max(1, Math.ceil(totalItems / pageSize)),
    },
  };
}

export async function createClassAssistance(
  values: ClassAssistanceFormValues,
): Promise<ClassAssistanceItem> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("class_assistances")
    .insert(mapClassAssistancePayload(values))
    .select("*")
    .single();
  if (error) {
    logSupabaseError("[ClassAssistances] createClassAssistance", error, {
      studentId: values.studentId,
      className: values.className,
    });
    throw new Error(
      buildSupabaseErrorMessage(
        "Gagal menyimpan daftar pendampingan siswa per kelas",
        error,
      ),
    );
  }
  return mapClassAssistance(data);
}
