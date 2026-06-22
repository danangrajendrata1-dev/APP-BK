import { createSupabaseServerClient } from "@/lib/supabase/server";
import { buildSupabaseErrorMessage, logSupabaseError } from "@/lib/supabase/error";
import type { SchoolAttendanceFormValues } from "@/types/common";
import type { Database } from "@/types/database";

import type {
  SchoolAttendanceFilters,
  SchoolAttendanceGridRow,
  SchoolAttendanceListResult,
  StudentReference,
} from "@/features/school-attendance/types/schoolAttendance";

const DAYS_IN_MONTH = 31;

type SchoolAttendanceRow = Database["public"]["Tables"]["school_attendance"]["Row"];
type SchoolAttendanceListRow = Pick<
  SchoolAttendanceRow,
  | "id"
  | "attendance_year"
  | "attendance_month"
  | "attendance_day"
  | "attendance_date"
  | "student_id"
  | "student_name"
  | "class_name"
  | "attendance_status"
  | "description"
>;
type SchoolAttendanceInsert =
  Database["public"]["Tables"]["school_attendance"]["Insert"];
type StudentReferenceRow = Pick<
  Database["public"]["Tables"]["students"]["Row"],
  "id" | "full_name" | "class_name"
>;

function createEmptyDays() {
  return Array.from({ length: DAYS_IN_MONTH }, () => "");
}

type SchoolAttendanceStatusValue = SchoolAttendanceRow["attendance_status"];

function normalizeAttendanceStatus(status: string): SchoolAttendanceStatusValue {
  const normalized = status.trim().toLowerCase();

  if (normalized === "s" || normalized === "sakit") {
    return "S";
  }

  if (normalized === "i" || normalized === "izin") {
    return "I";
  }

  if (normalized === "a" || normalized === "alfa") {
    return "A";
  }

  return status as SchoolAttendanceStatusValue;
}

function mapStatusToMark(status: SchoolAttendanceRow["attendance_status"] | string) {
  switch (normalizeAttendanceStatus(status)) {
    case "S":
      return "S";
    case "I":
      return "I";
    case "A":
      return "A";
    default:
      return "";
  }
}

function buildAttendanceDate(values: SchoolAttendanceFormValues) {
  const year = Number(values.year);
  const month = Number(values.month);
  const day = Number(values.day);
  const monthPart = String(month).padStart(2, "0");
  const dayPart = String(day).padStart(2, "0");

  return `${year}-${monthPart}-${dayPart}`;
}

function mapSchoolAttendancePayload(
  values: SchoolAttendanceFormValues,
): SchoolAttendanceInsert {
  return {
    attendance_year: Number(values.year),
    attendance_month: Number(values.month),
    attendance_day: Number(values.day),
    attendance_date: buildAttendanceDate(values),
    student_id: values.studentId || "",
    student_name: values.studentName,
    class_name: values.className,
    attendance_status: normalizeAttendanceStatus(values.status),
    description: values.description || null,
  };
}

function mapStudentReference(row: StudentReferenceRow): StudentReference {
  return {
    id: row.id,
    fullName: row.full_name,
    className: row.class_name,
  };
}

function mapGridRow(
  student: StudentReference,
  attendanceRows: SchoolAttendanceListRow[],
  month: number,
  year: number,
): SchoolAttendanceGridRow {
  const days = createEmptyDays();
  let totalS = 0;
  let totalI = 0;
  let totalA = 0;
  let description = "";

  for (const row of attendanceRows) {
    if (row.attendance_year !== year || row.attendance_month !== month) {
      continue;
    }

    if (row.student_id !== student.id) {
      continue;
    }

    const dayIndex = row.attendance_day - 1;
    if (dayIndex < 0 || dayIndex >= DAYS_IN_MONTH) {
      continue;
    }

    const mark = mapStatusToMark(row.attendance_status);
    if (mark) {
      days[dayIndex] = mark;
    }

    const normalizedStatus = normalizeAttendanceStatus(row.attendance_status);

    if (normalizedStatus === "S") {
      totalS += 1;
    } else if (normalizedStatus === "I") {
      totalI += 1;
    } else if (normalizedStatus === "A") {
      totalA += 1;
    }

    if (row.description?.trim()) {
      description = row.description.trim();
    }
  }

  return {
    id: student.id,
    studentId: student.id,
    studentName: student.fullName,
    className: student.className,
    days,
    totalS,
    totalI,
    totalA,
    description,
  };
}

export async function getStudentReferences(): Promise<StudentReference[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("students")
    .select("id, full_name, class_name, nisn")
    .is("deleted_at", null)
    .order("full_name", { ascending: true });

  if (error) {
    logSupabaseError("[SchoolAttendance] getStudentReferences", error);
    throw new Error(
      buildSupabaseErrorMessage("Gagal memuat referensi siswa", error),
    );
  }

  return ((data ?? []) as StudentReferenceRow[]).map(mapStudentReference);
}

export async function getSchoolAttendanceSheet(
  params: Partial<SchoolAttendanceFilters> = {},
): Promise<SchoolAttendanceListResult> {
  const supabase = await createSupabaseServerClient();
  const month = params.month ?? new Date().getMonth() + 1;
  const year = params.year ?? new Date().getFullYear();
  const className = params.className?.trim() ?? "";

  if (!className) {
    return {
      items: [],
      filters: { month, year, className: undefined },
      month,
      year,
      className: "",
    };
  }

  const [studentsResult, attendanceResult] = await Promise.all([
    supabase
      .from("students")
      .select("id, full_name, class_name")
      .eq("class_name", className)
      .order("full_name", { ascending: true }),
    supabase
      .from("school_attendance")
      .select("id, attendance_year, attendance_month, attendance_day, attendance_date, student_id, student_name, class_name, attendance_status, description")
      .eq("class_name", className)
      .eq("attendance_year", year)
      .eq("attendance_month", month)
      .order("attendance_day", { ascending: true }),
  ]);

  if (studentsResult.error) {
    logSupabaseError("[SchoolAttendance] getSchoolAttendanceSheet students", studentsResult.error, {
      className,
      month,
      year,
    });
    throw new Error(
      buildSupabaseErrorMessage("Gagal memuat daftar siswa untuk daftar hadir sekolah", studentsResult.error),
    );
  }

  if (attendanceResult.error) {
    logSupabaseError("[SchoolAttendance] getSchoolAttendanceSheet attendance", attendanceResult.error, {
      className,
      month,
      year,
    });
    throw new Error(
      buildSupabaseErrorMessage("Gagal memuat data daftar hadir sekolah", attendanceResult.error),
    );
  }

  const students = ((studentsResult.data ?? []) as StudentReferenceRow[]).map(mapStudentReference);
  const attendanceRows = (attendanceResult.data ?? []) as SchoolAttendanceListRow[];

  return {
    items: students.map((student) =>
      mapGridRow(student, attendanceRows, month, year),
    ),
    filters: {
      month,
      year,
      className,
    },
    month,
    year,
    className,
  };
}

export async function createSchoolAttendance(
  values: SchoolAttendanceFormValues,
): Promise<SchoolAttendanceGridRow> {
  const supabase = await createSupabaseServerClient();
  const payload = mapSchoolAttendancePayload(values);
  const { error } = await supabase
    .from("school_attendance")
    .insert(payload as never)
    .select("id, attendance_year, attendance_month, attendance_day, attendance_date, student_id, student_name, class_name, attendance_status, description")
    .single();

  if (error) {
    logSupabaseError("[SchoolAttendance] createSchoolAttendance", error, {
      studentId: values.studentId,
      attendanceDate: payload.attendance_date,
    });
    throw new Error(
      buildSupabaseErrorMessage("Gagal menyimpan daftar hadir sekolah", error),
    );
  }

  return {
    id: payload.student_id ?? payload.student_name,
    studentId: payload.student_id ?? "",
    studentName: payload.student_name,
    className: payload.class_name,
    days: (() => {
      const days = createEmptyDays();
      const dayIndex = Number(payload.attendance_day) - 1;
      const mark = mapStatusToMark(payload.attendance_status);

      if (dayIndex >= 0 && dayIndex < DAYS_IN_MONTH) {
        days[dayIndex] = mark;
      }

      return days;
    })(),
    totalS: normalizeAttendanceStatus(payload.attendance_status) === "S" ? 1 : 0,
    totalI: normalizeAttendanceStatus(payload.attendance_status) === "I" ? 1 : 0,
    totalA: normalizeAttendanceStatus(payload.attendance_status) === "A" ? 1 : 0,
    description: payload.description ?? "",
  };
}
