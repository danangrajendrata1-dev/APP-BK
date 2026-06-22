import { createSupabaseServerClient } from "@/lib/supabase/server";
import { buildSupabaseErrorMessage, logSupabaseError } from "@/lib/supabase/error";
import type { CounselingRecordFormValues } from "@/types/common";
import type { Database } from "@/types/database";

import type {
  CounselingRecordItem,
  CounselingRecordSheetResult,
  CounselingRecordListQuery,
  CounselingRecordListResult,
} from "@/features/counseling-records/types/counselingRecord";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const DAYS_IN_MONTH = 31;
const COUNSELING_RECORD_LIST_COLUMNS =
  "id, violation_date, student_id, student_name, class_name, violation_code, description, created_at, updated_at";

type CounselingRow = Database["public"]["Tables"]["violation_records"]["Row"];
type CounselingListRow = Pick<
  CounselingRow,
  | "id"
  | "violation_date"
  | "student_id"
  | "student_name"
  | "class_name"
  | "violation_code"
  | "description"
  | "created_at"
  | "updated_at"
>;
type CounselingInsert = Database["public"]["Tables"]["violation_records"]["Insert"];
type ViolationRecordRow = Database["public"]["Tables"]["violation_records"]["Row"];
type ViolationSheetRow = Pick<
  ViolationRecordRow,
  | "id"
  | "violation_date"
  | "student_id"
  | "student_name"
  | "class_name"
  | "description"
>;

function normalizeText(value: string | null | undefined) {
  return value ?? "";
}

function createEmptyDays() {
  return Array.from({ length: DAYS_IN_MONTH }, () => "");
}

function getDateValue(value: string) {
  return new Date(`${value}T00:00:00`);
}

function mapCounselingRecord(row: CounselingListRow): CounselingRecordItem {
  return {
    id: row.id,
    counselingDate: row.violation_date,
    studentId: row.student_id ?? "",
    studentName: row.student_name,
    className: row.class_name,
    meetingNumber: null,
    media: "Offline",
    counselingType: "Individu",
    topic: normalizeText(row.violation_code),
    counselingResult: "",
    followUp: "",
    description: normalizeText(row.description),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapCounselingPayload(
  values: CounselingRecordFormValues,
): CounselingInsert {
  const counselingDate = new Date(`${values.counselingDate}T00:00:00`);
  return {
    violation_date: values.counselingDate,
    violation_year: counselingDate.getFullYear(),
    violation_month: counselingDate.getMonth() + 1,
    violation_day: counselingDate.getDate(),
    student_id: values.studentId || "",
    student_name: values.studentName,
    class_name: values.className,
    violation_code: values.topic || null,
    description: values.description || null,
  };
}

export async function getCounselingRecords(
  params: Partial<CounselingRecordListQuery> = {},
): Promise<CounselingRecordListResult> {
  const supabase = await createSupabaseServerClient();
  const page = Math.max(params.page ?? DEFAULT_PAGE, 1);
  const pageSize = Math.max(params.pageSize ?? DEFAULT_PAGE_SIZE, 1);
  const filters = params.filters ?? {};
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("violation_records")
    .select(COUNSELING_RECORD_LIST_COLUMNS, { count: "exact" })
    .order("violation_date", { ascending: false })
    .range(from, to);

  if (filters.month) {
    query = query.gte(
      "violation_date",
      `${filters.year ?? new Date().getFullYear()}-${String(filters.month).padStart(2, "0")}-01`,
    );
    const monthEnd = new Date(filters.year ?? new Date().getFullYear(), filters.month, 0)
      .toISOString()
      .slice(0, 10);
    query = query.lte("violation_date", monthEnd);
  } else if (filters.year) {
    query = query.gte("violation_date", `${filters.year}-01-01`);
    query = query.lte("violation_date", `${filters.year}-12-31`);
  }
  if (filters.className) query = query.ilike("class_name", `%${filters.className}%`);

  const { data, count, error } = await query;
  if (error) {
    logSupabaseError("[CounselingRecords] getCounselingRecords", error, {
      page,
      pageSize,
      filters,
    });
    throw new Error(
      buildSupabaseErrorMessage("Gagal memuat catatan pelanggaran", error),
    );
  }

  const totalItems = count ?? 0;
  return {
    items: ((data ?? []) as CounselingListRow[]).map(mapCounselingRecord),
    filters,
    pagination: {
      page,
      pageSize,
      totalItems,
      totalPages: Math.max(1, Math.ceil(totalItems / pageSize)),
    },
  };
}

export async function createCounselingRecord(
  values: CounselingRecordFormValues,
): Promise<CounselingRecordItem> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("violation_records")
    .insert(mapCounselingPayload(values) as never)
    .select(COUNSELING_RECORD_LIST_COLUMNS)
    .single();

  if (error) {
    logSupabaseError("[CounselingRecords] createCounselingRecord", error, {
      studentId: values.studentId,
      counselingDate: values.counselingDate,
    });
    throw new Error(
      buildSupabaseErrorMessage("Gagal menyimpan catatan pelanggaran", error),
    );
  }
  return mapCounselingRecord(data as CounselingListRow);
}

export async function getCounselingRecordSheet(
  _params: { month?: number; year?: number; page?: number } = {},
): Promise<CounselingRecordSheetResult> {
  const supabase = await createSupabaseServerClient();
  const month = _params.month ?? new Date().getMonth() + 1;
  const year = _params.year ?? new Date().getFullYear();
  const monthStart = new Date(year, month - 1, 1);
  const monthEnd = new Date(year, month, 0);

  const [studentsResult, violationResult] = await Promise.all([
    supabase
      .from("students")
      .select("id, full_name, class_name")
      .order("class_name", { ascending: true })
      .order("full_name", { ascending: true })
      .is("deleted_at", null),
    supabase
      .from("violation_records")
      .select("id, violation_date, student_id, student_name, class_name, description")
      .lte("violation_date", monthEnd.toISOString().slice(0, 10))
      .gte("violation_date", `${year}-01-01`)
      .order("violation_date", { ascending: true }),
  ]);

  if (studentsResult.error) {
    logSupabaseError("[CounselingRecords] getCounselingRecordSheet students", studentsResult.error, {
      month,
      year,
    });
    throw new Error(
      buildSupabaseErrorMessage("Gagal memuat daftar siswa untuk catatan pelanggaran", studentsResult.error),
    );
  }

  if (violationResult.error) {
    logSupabaseError("[CounselingRecords] getCounselingRecordSheet violation_records", violationResult.error, {
      month,
      year,
    });
    throw new Error(
      buildSupabaseErrorMessage("Gagal memuat catatan pelanggaran", violationResult.error),
    );
  }

  const students = ((studentsResult.data ?? []) as Array<{
    id: string;
    full_name: string;
    class_name: string;
  }>).map((student) => ({
    id: student.id,
    studentId: student.id,
    studentName: student.full_name,
    className: student.class_name,
  }));

  if (!students.length) {
    return {
      items: [],
      month,
      year,
    };
  }

  const rows = (violationResult.data ?? []) as ViolationSheetRow[];
  const recordsByStudent = new Map<string, ViolationSheetRow[]>();

  for (const row of rows) {
    const studentKey = row.student_id;
    const existingRows = recordsByStudent.get(studentKey) ?? [];
    existingRows.push(row);
    recordsByStudent.set(studentKey, existingRows);
  }

  return {
    items: students.map((student) => {
      const studentRecords = recordsByStudent.get(student.studentId) ?? [];
      const days = createEmptyDays();
      let previousTotal = 0;
      let total = 0;
      let description = "";
      const dayCounts = new Map<number, number>();

      for (const record of studentRecords) {
        const recordDate = getDateValue(record.violation_date);
        const normalizedDescription = record.description?.trim() ?? "";

        if (recordDate < monthStart) {
          previousTotal += 1;
        }

        if (recordDate >= monthStart && recordDate <= monthEnd) {
          const dayIndex = recordDate.getDate();
          dayCounts.set(dayIndex, (dayCounts.get(dayIndex) ?? 0) + 1);
          total += 1;
          if (normalizedDescription) {
            description = normalizedDescription;
          }
        }
      }

      for (let day = 1; day <= DAYS_IN_MONTH; day += 1) {
        const count = dayCounts.get(day) ?? 0;
        days[day - 1] = count > 0 ? String(count) : "";
      }

      return {
        id: student.id,
        studentId: student.studentId,
        studentName: student.studentName,
        className: student.className,
        previousTotal,
        days,
        total,
        description,
      };
    }),
    month,
    year,
  };
}
