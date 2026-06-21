import { createSupabaseServerClient } from "@/lib/supabase/server";
import { buildSupabaseErrorMessage, logSupabaseError } from "@/lib/supabase/error";
import type { CounselingRecordFormValues } from "@/types/common";
import type { Database } from "@/types/database";

import type {
  CounselingRecordItem,
  CounselingRecordListQuery,
  CounselingRecordListResult,
} from "@/features/counseling-records/types/counselingRecord";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
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

function normalizeText(value: string | null | undefined) {
  return value ?? "";
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
    .from("counseling_records")
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
    items: (data ?? []).map(mapCounselingRecord),
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
    .insert(mapCounselingPayload(values))
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
  return mapCounselingRecord(data);
}
