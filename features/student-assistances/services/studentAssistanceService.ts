import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";
import type { StudentAssistanceFormValues } from "@/features/student-assistances/types/studentAssistance";
import type { StudentAssistanceItem, StudentAssistanceListQuery, StudentAssistanceListResult } from "@/features/student-assistances/types/studentAssistance";
import { calculateStudentAssistanceTotal } from "@/features/student-assistances/schemas/studentAssistanceSchema";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
type AssistanceRow = Database["public"]["Tables"]["student_assistances"]["Row"];
type AssistanceInsert = Database["public"]["Tables"]["student_assistances"]["Insert"];

function normalizeText(value: string | null | undefined) {
  return value ?? "";
}

function mapAssistanceRow(row: AssistanceRow): StudentAssistanceItem {
  const days = Object.fromEntries(
    Array.from({ length: 31 }, (_, index) => [
      `day${index + 1}`,
      normalizeText(row[`day_${index + 1}` as keyof AssistanceRow] as string | null | undefined),
    ]),
  ) as StudentAssistanceItem["days"];

  return {
    id: row.id,
    month: row.assistance_month,
    year: row.assistance_year,
    studentId: row.student_id ?? "",
    studentName: row.student_name,
    className: row.class_name,
    days,
    total: row.total,
    description: normalizeText(row.description),
  };
}

function mapAssistancePayload(values: StudentAssistanceFormValues): AssistanceInsert {
  const dayPayload = Object.fromEntries(
    Array.from({ length: 31 }, (_, index) => [
      `day_${index + 1}`,
      values.days[`day${index + 1}`] || null,
    ]),
  );

  return {
    assistance_month: values.month ?? 1,
    assistance_year: values.year ?? new Date().getFullYear(),
    student_id: values.studentId || null,
    student_name: values.studentName,
    class_name: values.className,
    ...dayPayload,
    total: calculateStudentAssistanceTotal(values.days),
    description: values.description || null,
  };
}

export async function getStudentAssistances(
  params: Partial<StudentAssistanceListQuery> = {},
): Promise<StudentAssistanceListResult> {
  const supabase = await createSupabaseServerClient();
  const page = Math.max(params.page ?? DEFAULT_PAGE, 1);
  const pageSize = Math.max(params.pageSize ?? DEFAULT_PAGE_SIZE, 1);
  const filters = params.filters ?? {};
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("student_assistances")
    .select("*", { count: "exact" })
    .order("assistance_year", { ascending: false })
    .order("assistance_month", { ascending: false })
    .range(from, to);

  if (filters.className) query = query.ilike("class_name", `%${filters.className}%`);
  if (filters.month) query = query.eq("assistance_month", filters.month);
  if (filters.year) query = query.eq("assistance_year", filters.year);

  const { data, count, error } = await query;
  if (error) throw new Error("Gagal memuat catatan pendampingan siswa per bulan.");

  const totalItems = count ?? 0;
  return {
    items: (data ?? []).map(mapAssistanceRow),
    filters,
    pagination: {
      page,
      pageSize,
      totalItems,
      totalPages: Math.max(1, Math.ceil(totalItems / pageSize)),
    },
  };
}

export async function createStudentAssistance(
  values: StudentAssistanceFormValues,
): Promise<StudentAssistanceItem> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("student_assistances")
    .insert(mapAssistancePayload(values))
    .select("*")
    .single();
  if (error) throw new Error("Gagal menyimpan catatan pendampingan siswa per bulan.");
  return mapAssistanceRow(data);
}
