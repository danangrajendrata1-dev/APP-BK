import { createSupabaseServerClient } from "@/lib/supabase/server";
import { buildSupabaseErrorMessage, logSupabaseError } from "@/lib/supabase/error";
import type { BkServiceAttendanceFormValues } from "@/types/common";
import type { Database } from "@/types/database";

import type {
  BkServiceAttendanceItem,
  BkServiceAttendanceListQuery,
  BkServiceAttendanceListResult,
} from "@/features/bk-service-attendance/types/bkServiceAttendance";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const BK_SERVICE_ATTENDANCE_LIST_COLUMNS =
  "id, service_date, student_id, student_name, class_name, arrival_time, finish_time, purpose, service_type, counselor_name, description, created_at, updated_at";

type BkServiceAttendanceRow =
  Database["public"]["Tables"]["bk_service_attendance"]["Row"];
type BkServiceAttendanceListRow = Pick<
  BkServiceAttendanceRow,
  | "id"
  | "service_date"
  | "student_id"
  | "student_name"
  | "class_name"
  | "arrival_time"
  | "finish_time"
  | "purpose"
  | "service_type"
  | "counselor_name"
  | "description"
  | "created_at"
  | "updated_at"
>;
type BkServiceAttendanceInsert =
  Database["public"]["Tables"]["bk_service_attendance"]["Insert"];

function normalizeText(value: string | null | undefined) {
  return value ?? "";
}

function mapBkServiceAttendance(
  row: BkServiceAttendanceListRow,
): BkServiceAttendanceItem {
  return {
    id: row.id,
    serviceDate: row.service_date,
    studentId: row.student_id ?? "",
    studentName: row.student_name,
    className: row.class_name,
    arrivalTime: normalizeText(row.arrival_time),
    finishTime: normalizeText(row.finish_time),
    purpose: row.purpose,
    serviceType: row.service_type,
    counselorName: normalizeText(row.counselor_name),
    description: normalizeText(row.description),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapBkServiceAttendancePayload(
  values: BkServiceAttendanceFormValues,
): BkServiceAttendanceInsert {
  return {
    service_date: values.serviceDate,
    student_id: values.studentId || null,
    student_name: values.studentName,
    class_name: values.className,
    arrival_time: values.arrivalTime,
    finish_time: values.finishTime,
    purpose: values.purpose,
    service_type: values.serviceType,
    counselor_name: values.counselorName,
    description: values.description || null,
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
    .order("service_date", { ascending: false })
    .range(from, to);

  if (filters.month) {
    query = query.gte(
      "service_date",
      `${filters.year ?? new Date().getFullYear()}-${String(filters.month).padStart(2, "0")}-01`,
    );
    const monthEnd = new Date(filters.year ?? new Date().getFullYear(), filters.month, 0)
      .toISOString()
      .slice(0, 10);
    query = query.lte("service_date", monthEnd);
  } else if (filters.year) {
    query = query.gte("service_date", `${filters.year}-01-01`);
    query = query.lte("service_date", `${filters.year}-12-31`);
  }

  if (filters.className) {
    query = query.ilike("class_name", `%${filters.className}%`);
  }

  if (filters.purpose) {
    query = query.eq("purpose", filters.purpose);
  }

  if (filters.serviceType) {
    query = query.eq("service_type", filters.serviceType);
  }

  if (filters.counselorName) {
    query = query.ilike("counselor_name", `%${filters.counselorName}%`);
  }

  const { data, count, error } = await query;

  if (error) {
    logSupabaseError("[BkServiceAttendance] getBkServiceAttendances", error, {
      page,
      pageSize,
      filters,
    });
    throw new Error(
      buildSupabaseErrorMessage("Gagal memuat data presensi layanan BK", error),
    );
  }

  const totalItems = count ?? 0;

  return {
    items: (data ?? []).map(mapBkServiceAttendance),
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
    .insert(mapBkServiceAttendancePayload(values))
    .select("*")
    .single();

  if (error) {
    logSupabaseError("[BkServiceAttendance] createBkServiceAttendance", error, {
      studentId: values.studentId,
      serviceDate: values.serviceDate,
    });
    throw new Error(
      buildSupabaseErrorMessage("Gagal menyimpan presensi layanan BK", error),
    );
  }

  return mapBkServiceAttendance(data);
}
