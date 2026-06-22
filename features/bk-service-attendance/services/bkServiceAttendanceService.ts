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
  "id, service_date, student_name, class_name, purpose, description";

type BkServiceAttendanceRow =
  Database["public"]["Tables"]["bk_service_attendance"]["Row"];
type BkServiceAttendanceListRow = Pick<
  BkServiceAttendanceRow,
  | "id"
  | "service_date"
  | "student_name"
  | "class_name"
  | "purpose"
  | "description"
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
    serviceDate: row.service_date,
    studentId: "",
    studentName: row.student_name,
    className: row.class_name,
    arrivalTime: "",
    finishTime: "",
    purpose: normalizePurpose(row.purpose),
    serviceType: "Layanan Dasar",
    counselorName: "",
    description: normalizeText(row.description),
    createdAt: "",
    updatedAt: "",
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
    .from("v_bk_service_attendance_with_relations" as never)
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

  return mapBkServiceAttendance(data as BkServiceAttendanceListRow);
}
