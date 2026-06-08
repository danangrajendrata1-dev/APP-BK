import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { SchoolAttendanceFormValues } from "@/types/common";
import type { Database } from "@/types/database";

import type {
  SchoolAttendanceItem,
  SchoolAttendanceListQuery,
  SchoolAttendanceListResult,
  StudentReference,
} from "@/features/school-attendance/types/schoolAttendance";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const SCHOOL_ATTENDANCE_LIST_COLUMNS =
  "id, attendance_date, student_id, student_name, class_name, status, description, created_at, updated_at";

type SchoolAttendanceRow = Database["public"]["Tables"]["school_attendance"]["Row"];
type SchoolAttendanceListRow = Pick<
  SchoolAttendanceRow,
  | "id"
  | "attendance_date"
  | "student_id"
  | "student_name"
  | "class_name"
  | "status"
  | "description"
  | "created_at"
  | "updated_at"
>;
type SchoolAttendanceInsert =
  Database["public"]["Tables"]["school_attendance"]["Insert"];
type StudentReferenceRow = Pick<
  Database["public"]["Tables"]["students"]["Row"],
  "id" | "full_name" | "class_name" | "parent_name" | "address"
>;

function normalizeText(value: string | null | undefined) {
  return value ?? "";
}

function mapSchoolAttendance(
  row: SchoolAttendanceListRow,
): SchoolAttendanceItem {
  return {
    id: row.id,
    attendanceDate: row.attendance_date,
    studentId: row.student_id ?? "",
    studentName: row.student_name,
    className: row.class_name,
    status: row.status,
    description: normalizeText(row.description),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapStudentReference(row: StudentReferenceRow): StudentReference {
  return {
    id: row.id,
    fullName: row.full_name,
    className: row.class_name,
    parentName: normalizeText(row.parent_name),
    address: normalizeText(row.address),
  };
}

function mapSchoolAttendancePayload(
  values: SchoolAttendanceFormValues,
): SchoolAttendanceInsert {
  return {
    attendance_date: values.attendanceDate,
    student_id: values.studentId || null,
    student_name: values.studentName,
    class_name: values.className,
    status: values.status,
    description: values.description || null,
  };
}

export async function getStudentReferences(): Promise<StudentReference[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("students")
    .select("id, full_name, class_name, parent_name, address")
    .order("full_name", { ascending: true });

  if (error) {
    throw new Error("Gagal memuat referensi siswa.");
  }

  return (data ?? []).map(mapStudentReference);
}

export async function getSchoolAttendances(
  params: Partial<SchoolAttendanceListQuery> = {},
): Promise<SchoolAttendanceListResult> {
  const supabase = await createSupabaseServerClient();
  const page = Math.max(params.page ?? DEFAULT_PAGE, 1);
  const pageSize = Math.max(params.pageSize ?? DEFAULT_PAGE_SIZE, 1);
  const filters = params.filters ?? {};
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("school_attendance")
    .select(SCHOOL_ATTENDANCE_LIST_COLUMNS, { count: "exact" })
    .order("attendance_date", { ascending: false })
    .range(from, to);

  if (filters.month) {
    query = query.gte(
      "attendance_date",
      `${filters.year ?? new Date().getFullYear()}-${String(filters.month).padStart(2, "0")}-01`,
    );
    const monthEnd = new Date(filters.year ?? new Date().getFullYear(), filters.month, 0)
      .toISOString()
      .slice(0, 10);
    query = query.lte("attendance_date", monthEnd);
  } else if (filters.year) {
    query = query.gte("attendance_date", `${filters.year}-01-01`);
    query = query.lte("attendance_date", `${filters.year}-12-31`);
  }

  if (filters.className) {
    query = query.ilike("class_name", `%${filters.className}%`);
  }

  if (filters.status) {
    query = query.eq("status", filters.status);
  }

  const { data, count, error } = await query;

  if (error) {
    throw new Error("Gagal memuat data presensi sekolah.");
  }

  const totalItems = count ?? 0;

  return {
    items: (data ?? []).map(mapSchoolAttendance),
    filters,
    pagination: {
      page,
      pageSize,
      totalItems,
      totalPages: Math.max(1, Math.ceil(totalItems / pageSize)),
    },
  };
}

export async function createSchoolAttendance(
  values: SchoolAttendanceFormValues,
): Promise<SchoolAttendanceItem> {
  const supabase = await createSupabaseServerClient();
  const payload = mapSchoolAttendancePayload(values);
  const { data, error } = await supabase
    .from("school_attendance")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    throw new Error("Gagal menyimpan presensi sekolah.");
  }

  return mapSchoolAttendance(data);
}
