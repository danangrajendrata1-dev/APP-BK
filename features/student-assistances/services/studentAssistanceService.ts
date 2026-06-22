import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  buildSupabaseErrorMessage,
  isMissingSchemaError,
  logSupabaseError,
} from "@/lib/supabase/error";
import type { Database } from "@/types/database";
import type { StudentAssistanceFormValues } from "@/features/student-assistances/types/studentAssistance";
import type { StudentAssistanceItem, StudentAssistanceListQuery, StudentAssistanceListResult } from "@/features/student-assistances/types/studentAssistance";
import { calculateStudentAssistanceTotal } from "@/features/student-assistances/schemas/studentAssistanceSchema";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const STUDENT_ASSISTANCE_LIST_COLUMNS =
  "id, assistance_month, assistance_year, student_id, student_name, class_name, day_1, day_2, day_3, day_4, day_5, day_6, day_7, day_8, day_9, day_10, day_11, day_12, day_13, day_14, day_15, day_16, day_17, day_18, day_19, day_20, day_21, day_22, day_23, day_24, day_25, day_26, day_27, day_28, day_29, day_30, day_31, total, description";
type AssistanceRow = Database["public"]["Tables"]["student_assistances"]["Row"];
type AssistanceListRow = Pick<
  AssistanceRow,
  | "id"
  | "assistance_month"
  | "assistance_year"
  | "student_id"
  | "student_name"
  | "class_name"
  | "day_1"
  | "day_2"
  | "day_3"
  | "day_4"
  | "day_5"
  | "day_6"
  | "day_7"
  | "day_8"
  | "day_9"
  | "day_10"
  | "day_11"
  | "day_12"
  | "day_13"
  | "day_14"
  | "day_15"
  | "day_16"
  | "day_17"
  | "day_18"
  | "day_19"
  | "day_20"
  | "day_21"
  | "day_22"
  | "day_23"
  | "day_24"
  | "day_25"
  | "day_26"
  | "day_27"
  | "day_28"
  | "day_29"
  | "day_30"
  | "day_31"
  | "total"
  | "description"
>;
type AssistanceInsert = Database["public"]["Tables"]["student_assistances"]["Insert"];

function normalizeText(value: string | null | undefined) {
  return value ?? "";
}

function mapAssistanceRow(row: AssistanceListRow): StudentAssistanceItem {
  const days = Object.fromEntries(
    Array.from({ length: 31 }, (_, index) => [
      `day${index + 1}`,
      normalizeText(
        row[`day_${index + 1}` as keyof AssistanceListRow] as string | null | undefined,
      ),
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
    .select(STUDENT_ASSISTANCE_LIST_COLUMNS, { count: "exact" })
    .order("assistance_year", { ascending: false })
    .order("assistance_month", { ascending: false })
    .range(from, to);

  if (filters.className) query = query.ilike("class_name", `%${filters.className}%`);
  if (filters.month) query = query.eq("assistance_month", filters.month);
  if (filters.year) query = query.eq("assistance_year", filters.year);

  const { data, count, error } = await query;
  if (error) {
    logSupabaseError("[StudentAssistances] getStudentAssistances", error, {
      page,
      pageSize,
      filters,
    });
    if (isMissingSchemaError(error)) {
      return {
        items: [],
        filters,
        pagination: {
          page,
          pageSize,
          totalItems: 0,
          totalPages: 1,
        },
      };
    }
    throw new Error(
      buildSupabaseErrorMessage(
        "Gagal memuat catatan pendampingan siswa per bulan",
        error,
      ),
    );
  }

  const totalItems = count ?? 0;
  return {
    items: ((data ?? []) as AssistanceListRow[]).map(mapAssistanceRow),
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
    .insert(mapAssistancePayload(values) as never)
    .select("*")
    .single();
  if (error) {
    logSupabaseError("[StudentAssistances] createStudentAssistance", error, {
      studentId: values.studentId,
      month: values.month,
      year: values.year,
    });
    throw new Error(
      buildSupabaseErrorMessage(
        "Gagal menyimpan catatan pendampingan siswa per bulan",
        error,
      ),
    );
  }
  return mapAssistanceRow(data as AssistanceListRow);
}
