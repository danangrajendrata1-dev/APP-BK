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
  | "attendance_date"
  | "student_id"
  | "student_name"
  | "class_name"
  | "status"
  | "description"
>;
type SchoolAttendanceInsert =
  Database["public"]["Tables"]["school_attendance"]["Insert"];
type StudentReferenceRow = Pick<
  Database["public"]["Views"]["v_students_with_relations"]["Row"],
  "id" | "full_name" | "class_name" | "parent_name" | "address"
>;

function normalizeText(value: string | null | undefined) {
  return value ?? "";
}

function normalizeDate(value: string) {
  return new Date(`${value}T00:00:00`);
}

function getMonthRange(month: number, year: number) {
  const start = `${year}-${String(month).padStart(2, "0")}-01`;
  const end = new Date(year, month, 0).toISOString().slice(0, 10);
  return { start, end };
}

function createEmptyDays() {
  return Array.from({ length: DAYS_IN_MONTH }, () => "");
}

function mapStatusToMark(status: SchoolAttendanceRow["status"]) {
  switch (status) {
    case "Sakit":
      return "S";
    case "Izin":
      return "I";
    case "Alfa":
      return "A";
    default:
      return "";
  }
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

function mapStudentReference(row: StudentReferenceRow): StudentReference {
  return {
    id: row.id,
    fullName: row.full_name,
    className: row.class_name,
    parentName: normalizeText(row.parent_name),
    address: normalizeText(row.address),
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
    const attendanceDate = normalizeDate(row.attendance_date);
    if (attendanceDate.getMonth() + 1 !== month || attendanceDate.getFullYear() !== year) {
      continue;
    }

    const rowStudentKey = row.student_id ?? row.student_name;
    if (row.student_id && row.student_id !== student.id) {
      continue;
    }
    if (!row.student_id && rowStudentKey !== student.fullName) {
      continue;
    }

    const dayIndex = attendanceDate.getDate() - 1;
    if (dayIndex < 0 || dayIndex >= DAYS_IN_MONTH) {
      continue;
    }

    const mark = mapStatusToMark(row.status);
    if (mark) {
      days[dayIndex] = mark;
    }

    if (row.status === "Sakit") {
      totalS += 1;
    } else if (row.status === "Izin") {
      totalI += 1;
    } else if (row.status === "Alfa") {
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
    .from("v_students_with_relations")
    .select("id, full_name, class_name, parent_name, address")
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

  const { start, end } = getMonthRange(month, year);

  const [studentsResult, attendanceResult] = await Promise.all([
    supabase
      .from("v_students_with_relations")
      .select("id, full_name, class_name, parent_name, address")
      .eq("class_name", className)
      .order("full_name", { ascending: true }),
    supabase
      .from("school_attendance")
      .select("id, attendance_date, student_id, student_name, class_name, status, description")
      .eq("class_name", className)
      .gte("attendance_date", start)
      .lte("attendance_date", end)
      .order("attendance_date", { ascending: true }),
  ]);

  if (studentsResult.error) {
    logSupabaseError("[SchoolAttendance] getSchoolAttendanceSheet students", studentsResult.error, {
      className,
      month,
      year,
    });
    throw new Error(
      buildSupabaseErrorMessage("Gagal memuat daftar siswa untuk presensi sekolah", studentsResult.error),
    );
  }

  if (attendanceResult.error) {
    logSupabaseError("[SchoolAttendance] getSchoolAttendanceSheet attendance", attendanceResult.error, {
      className,
      month,
      year,
    });
    throw new Error(
      buildSupabaseErrorMessage("Gagal memuat data presensi sekolah", attendanceResult.error),
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
    .select("*")
    .single();

  if (error) {
    logSupabaseError("[SchoolAttendance] createSchoolAttendance", error, {
      studentId: values.studentId,
      attendanceDate: values.attendanceDate,
    });
    throw new Error(
      buildSupabaseErrorMessage("Gagal menyimpan presensi sekolah", error),
    );
  }

  return {
    id: payload.student_id ?? payload.student_name,
    studentId: payload.student_id ?? "",
    studentName: payload.student_name,
    className: payload.class_name,
    days: createEmptyDays(),
    totalS: payload.status === "Sakit" ? 1 : 0,
    totalI: payload.status === "Izin" ? 1 : 0,
    totalA: payload.status === "Alfa" ? 1 : 0,
    description: payload.description ?? "",
  };
}
