import { createSupabaseServerClient } from "@/lib/supabase/server";
import { buildSupabaseErrorMessage, logSupabaseError } from "@/lib/supabase/error";
import type { BkServiceAttendanceFormValues, BkServicePurpose } from "@/types/common";
import type { Database } from "@/types/database";

import type {
  BkServiceAttendanceItem,
  BkServiceAttendanceListQuery,
  BkServiceAttendanceListResult,
} from "@/features/bk-service-attendance/types/bkServiceAttendance";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const BK_SERVICE_ATTENDANCE_LIST_COLUMNS =
  "id, visit_date, student_id, student_name, class_name, purpose, description, result, follow_up, signature, created_at, updated_at";

type BkServiceAttendanceRow =
  Database["public"]["Tables"]["bk_service_attendance"]["Row"];
type BkServiceAttendanceListRow = Pick<
  BkServiceAttendanceRow,
  | "id"
  | "visit_date"
  | "student_id"
  | "student_name"
  | "class_name"
  | "purpose"
  | "description"
  | "result"
  | "follow_up"
  | "signature"
  | "created_at"
  | "updated_at"
>;
type BkServiceAttendanceInsert =
  Database["public"]["Tables"]["bk_service_attendance"]["Insert"];

function normalizeText(value: string | null | undefined) {
  return value ?? "";
}

function normalizePurpose(value: string | null | undefined): BkServicePurpose {
  const allowedPurposes: BkServicePurpose[] = [
    "Konseling Individu",
    "Konseling Kelompok",
    "Layanan Klasikal",
    "Informasi Karier",
    "Informasi Sekolah Lanjutan",
    "Pemanggilan",
    "Lainnya",
  ];

  return allowedPurposes.includes(value as BkServicePurpose)
    ? (value as BkServicePurpose)
    : "Lainnya";
}

function mapBkServiceAttendance(
  row: BkServiceAttendanceListRow,
): BkServiceAttendanceItem {
  return {
    id: row.id,
    serviceDate: row.visit_date,
    studentId: row.student_id ?? "",
    studentName: row.student_name,
    className: row.class_name,
    purpose: normalizePurpose(row.purpose),
    description: normalizeText(row.description),
    result: normalizeText(row.result),
    followUp: normalizeText(row.follow_up),
    signature: normalizeText(row.signature),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapBkServiceAttendancePayload(
  values: BkServiceAttendanceFormValues,
): BkServiceAttendanceInsert {
  return {
    visit_date: values.serviceDate,
    student_id: values.studentId || null,
    student_name: values.studentName,
    class_name: values.className,
    purpose: values.purpose,
    description: values.description || null,
    result: values.result || null,
    follow_up: values.followUp || null,
    signature: values.signature || null,
  };
}

export async function getBkServiceAttendances(
  params: Partial<BkServiceAttendanceListQuery> = {},
): Promise<BkServiceAttendanceListResult> {
  const supabase = await createSupabaseServerClient();
  const page = Math.max(params.page ?? DEFAULT_PAGE, 1);
  const pageSize = Math.max(params.pageSize ?? DEFAULT_PAGE_SIZE, 1);
  const filters = params.filters ?? {};
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("bk_service_attendance")
    .select(BK_SERVICE_ATTENDANCE_LIST_COLUMNS, { count: "exact" })
    .order("visit_date", { ascending: false })
    .range(from, to);

  if (filters.month) {
    query = query.gte(
      "visit_date",
      `${filters.year ?? new Date().getFullYear()}-${String(filters.month).padStart(2, "0")}-01`,
    );
    const monthEnd = new Date(filters.year ?? new Date().getFullYear(), filters.month, 0)
      .toISOString()
      .slice(0, 10);
    query = query.lte("visit_date", monthEnd);
  } else if (filters.year) {
    query = query.gte("visit_date", `${filters.year}-01-01`);
    query = query.lte("visit_date", `${filters.year}-12-31`);
  }

  if (filters.className) {
    query = query.eq("class_name", filters.className);
  }

  if (filters.purpose) {
    query = query.eq("purpose", filters.purpose);
  }

  const { data, count, error } = await query;

  if (error) {
    logSupabaseError("[BkServiceAttendance] getBkServiceAttendances", error, {
      page,
      pageSize,
      filters,
    });
    throw new Error(
      buildSupabaseErrorMessage("Gagal memuat data daftar hadir dan catatan kunjungan BK", error),
    );
  }

  const totalItems = count ?? 0;

  return {
    items: ((data ?? []) as BkServiceAttendanceListRow[]).map(
      mapBkServiceAttendance,
    ),
    filters,
    pagination: {
      page,
      pageSize,
      totalItems,
      totalPages: Math.max(1, Math.ceil(totalItems / pageSize)),
    },
  };
}

export async function createBkServiceAttendance(
  values: BkServiceAttendanceFormValues,
): Promise<BkServiceAttendanceItem> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("bk_service_attendance")
    .insert(mapBkServiceAttendancePayload(values) as never)
    .select(BK_SERVICE_ATTENDANCE_LIST_COLUMNS)
    .single();

  if (error) {
    logSupabaseError("[BkServiceAttendance] createBkServiceAttendance", error, {
      studentId: values.studentId,
      serviceDate: values.serviceDate,
    });
    throw new Error(
      buildSupabaseErrorMessage("Gagal menyimpan data daftar hadir dan catatan kunjungan BK", error),
    );
  }

  return mapBkServiceAttendance(data as BkServiceAttendanceListRow);
}
