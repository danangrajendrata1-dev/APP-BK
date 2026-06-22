import { createSupabaseServerClient } from "@/lib/supabase/server";
import { buildSupabaseErrorMessage, logSupabaseError } from "@/lib/supabase/error";
import { getStudents } from "@/features/students/services/studentService";
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
const SHEET_PAGE_SIZE = 20;
const DAYS_IN_MONTH = 31;
const COUNSELING_RECORD_LIST_COLUMNS =
  "id, counseling_date, student_id, student_name, class_name, meeting_number, media, counseling_type, topic, counseling_result, follow_up, description, created_at, updated_at";

type CounselingRow = Database["public"]["Tables"]["counseling_records"]["Row"];
type CounselingListRow = Pick<
  CounselingRow,
  | "id"
  | "counseling_date"
  | "student_id"
  | "student_name"
  | "class_name"
  | "meeting_number"
  | "media"
  | "counseling_type"
  | "topic"
  | "counseling_result"
  | "follow_up"
  | "description"
  | "created_at"
  | "updated_at"
>;
type CounselingInsert =
  Database["public"]["Tables"]["counseling_records"]["Insert"];
type CounselingSheetRow = Pick<
  CounselingRow,
  | "id"
  | "counseling_date"
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
    counselingDate: row.counseling_date,
    studentId: row.student_id ?? "",
    studentName: row.student_name,
    className: row.class_name,
    meetingNumber: row.meeting_number,
    media: row.media,
    counselingType: row.counseling_type,
    topic: normalizeText(row.topic),
    counselingResult: normalizeText(row.counseling_result),
    followUp: normalizeText(row.follow_up),
    description: normalizeText(row.description),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapCounselingPayload(
  values: CounselingRecordFormValues,
): CounselingInsert {
  return {
    counseling_date: values.counselingDate,
    student_id: values.studentId || null,
    student_name: values.studentName,
    class_name: values.className,
    meeting_number: values.meetingNumber ?? null,
    media: values.media,
    counseling_type: values.counselingType,
    topic: values.topic,
    counseling_result: values.counselingResult,
    follow_up: values.followUp,
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
    .from("v_counseling_records_with_relations" as never)
    .select(COUNSELING_RECORD_LIST_COLUMNS, { count: "exact" })
    .order("counseling_date", { ascending: false })
    .range(from, to);

  if (filters.month) {
    query = query.gte(
      "counseling_date",
      `${filters.year ?? new Date().getFullYear()}-${String(filters.month).padStart(2, "0")}-01`,
    );
    const monthEnd = new Date(filters.year ?? new Date().getFullYear(), filters.month, 0)
      .toISOString()
      .slice(0, 10);
    query = query.lte("counseling_date", monthEnd);
  } else if (filters.year) {
    query = query.gte("counseling_date", `${filters.year}-01-01`);
    query = query.lte("counseling_date", `${filters.year}-12-31`);
  }
  if (filters.className) query = query.ilike("class_name", `%${filters.className}%`);
  if (filters.media) query = query.eq("media", filters.media);
  if (filters.counselingType) {
    query = query.eq("counseling_type", filters.counselingType);
  }

  const { data, count, error } = await query;
  if (error) {
    logSupabaseError("[CounselingRecords] getCounselingRecords", error, {
      page,
      pageSize,
      filters,
    });
    throw new Error(
      buildSupabaseErrorMessage("Gagal memuat catatan konseling", error),
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
    .from("counseling_records")
    .insert(mapCounselingPayload(values) as never)
    .select("*")
    .single();

  if (error) {
    logSupabaseError("[CounselingRecords] createCounselingRecord", error, {
      studentId: values.studentId,
      counselingDate: values.counselingDate,
    });
    throw new Error(
      buildSupabaseErrorMessage("Gagal menyimpan catatan konseling", error),
    );
  }
  return mapCounselingRecord(data as CounselingListRow);
}

export async function getCounselingRecordSheet(
  params: { month?: number; year?: number; page?: number } = {},
): Promise<CounselingRecordSheetResult> {
  const supabase = await createSupabaseServerClient();
  const month = params.month ?? new Date().getMonth() + 1;
  const year = params.year ?? new Date().getFullYear();
  const page = Math.max(params.page ?? 1, 1);

  const studentsResult = await getStudents({
    page,
    pageSize: SHEET_PAGE_SIZE,
    filters: {},
  });

  if (!studentsResult.items.length) {
    return {
      items: [],
      month,
      year,
    };
  }

  const studentIds = studentsResult.items.map((student) => student.id);
  const { data, error } = await supabase
    .from("counseling_records")
    .select("id, counseling_date, student_id, student_name, class_name, description")
    .in("student_id", studentIds)
    .order("counseling_date", { ascending: true });

  if (error) {
    logSupabaseError("[CounselingRecords] getCounselingRecordSheet", error, {
      month,
      year,
      page,
    });
    throw new Error(
      buildSupabaseErrorMessage("Gagal memuat catatan pelanggaran", error),
    );
  }

  const rows = (data ?? []) as CounselingSheetRow[];
  const monthStart = new Date(year, month - 1, 1);
  const monthEnd = new Date(year, month, 0);
  const recordsByStudent = new Map<string, CounselingSheetRow[]>();

  for (const row of rows) {
    const studentKey = row.student_id ?? "";
    if (!studentKey) {
      continue;
    }

    const existingRows = recordsByStudent.get(studentKey) ?? [];
    existingRows.push(row);
    recordsByStudent.set(studentKey, existingRows);
  }

  return {
    items: studentsResult.items.map((student) => {
      const studentRecords = recordsByStudent.get(student.id) ?? [];
      const days = createEmptyDays();
      let previousTotal = 0;
      let total = 0;
      let description = "";
      const dayCounts = new Map<number, number>();

      for (const record of studentRecords) {
        const recordDate = getDateValue(record.counseling_date);
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
        studentId: student.id,
        studentName: student.fullName,
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
