import { createSupabaseServerClient } from "@/lib/supabase/server";
import { buildSupabaseErrorMessage, logSupabaseError } from "@/lib/supabase/error";
import type { Database } from "@/types/database";
import type { StudentFormValues } from "@/types/common";

import type {
  Student,
  StudentListQuery,
  StudentListResult,
} from "@/features/students/types/student";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const STUDENT_LIST_PAGE_COLUMNS =
  "id, nisn, full_name, gender, class_name, major, status";
const STUDENT_DETAIL_COLUMNS =
  "id, nisn, full_name, gender, class_name, major, birth_place_date, address, phone, parent_name, parent_phone, status, created_at, updated_at";

type StudentRow = Database["public"]["Tables"]["students"]["Row"];
type StudentListRow = Pick<
  StudentRow,
  | "id"
  | "nisn"
  | "full_name"
  | "gender"
  | "class_name"
  | "major"
  | "status"
>;
type StudentDetailRow = Pick<
  StudentRow,
  | "id"
  | "nisn"
  | "full_name"
  | "gender"
  | "class_name"
  | "major"
  | "birth_place_date"
  | "address"
  | "phone"
  | "parent_name"
  | "parent_phone"
  | "status"
  | "created_at"
  | "updated_at"
>;
type StudentInsert = Database["public"]["Tables"]["students"]["Insert"];
type StudentUpdate = Database["public"]["Tables"]["students"]["Update"];

function normalizeText(value: string | null | undefined) {
  return value ?? "";
}

function mapStudent(row: StudentListRow): Student {
  return {
    id: row.id,
    nisn: row.nisn,
    fullName: row.full_name,
    gender: row.gender,
    className: row.class_name,
    major: row.major,
    birthPlaceDate: "",
    address: "",
    phone: "",
    parentName: "",
    parentPhone: "",
    status: row.status,
    createdAt: "",
    updatedAt: "",
  };
}

function mapStudentDetail(row: StudentDetailRow): Student {
  return {
    id: row.id,
    nisn: row.nisn,
    fullName: row.full_name,
    gender: row.gender,
    className: row.class_name,
    major: row.major,
    birthPlaceDate: normalizeText(row.birth_place_date),
    address: normalizeText(row.address),
    phone: normalizeText(row.phone),
    parentName: normalizeText(row.parent_name),
    parentPhone: normalizeText(row.parent_phone),
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapStudentPayload(values: StudentFormValues): StudentInsert {
  return {
    nisn: values.nisn,
    full_name: values.fullName,
    gender: values.gender,
    class_name: values.className,
    major: values.major,
    birth_place_date: values.birthPlaceDate,
    address: values.address,
    phone: values.phone,
    parent_name: values.parentName,
    parent_phone: values.parentPhone,
    status: values.status,
  };
}

export async function getStudents(
  params: Partial<StudentListQuery> = {},
): Promise<StudentListResult> {
  const supabase = await createSupabaseServerClient();
  const page = Math.max(params.page ?? DEFAULT_PAGE, 1);
  const pageSize = Math.max(params.pageSize ?? DEFAULT_PAGE_SIZE, 1);
  const filters = params.filters ?? {};
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("students")
    .select(STUDENT_LIST_PAGE_COLUMNS, { count: "exact" })
    .order("full_name", { ascending: true })
    .range(from, to);

  if (filters.fullName) {
    query = query.ilike("full_name", `%${filters.fullName}%`);
  }

  if (filters.nisn) {
    query = query.ilike("nisn", `%${filters.nisn}%`);
  }

  if (filters.className) {
    query = query.ilike("class_name", `%${filters.className}%`);
  }

  if (filters.major) {
    query = query.ilike("major", `%${filters.major}%`);
  }

  if (filters.status) {
    query = query.eq("status", filters.status);
  }

  const { data, count, error } = await query;

  if (error) {
    logSupabaseError("[Students] getStudents", error, {
      page,
      pageSize,
      filters,
    });
    throw new Error(buildSupabaseErrorMessage("Gagal memuat data siswa", error));
  }

  const totalItems = count ?? 0;

  return {
    items: (data ?? []).map(mapStudent),
    filters,
    pagination: {
      page,
      pageSize,
      totalItems,
      totalPages: Math.max(1, Math.ceil(totalItems / pageSize)),
    },
  };
}

export async function getStudentById(id: string): Promise<Student | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("students")
    .select(STUDENT_DETAIL_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    logSupabaseError("[Students] getStudentById", error, { id });
    throw new Error(buildSupabaseErrorMessage("Gagal memuat detail siswa", error));
  }

  return data ? mapStudentDetail(data) : null;
}

export async function createStudent(values: StudentFormValues): Promise<Student> {
  const supabase = await createSupabaseServerClient();
  const payload = mapStudentPayload(values);
  const { data, error } = await supabase
    .from("students")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    logSupabaseError("[Students] createStudent", error, { payload });
    if (error.code === "23505") {
      throw new Error("NISN sudah terdaftar. Gunakan NISN yang berbeda.");
    }

    throw new Error(buildSupabaseErrorMessage("Gagal menambahkan data siswa", error));
  }

  return mapStudent(data);
}

export async function updateStudent(
  id: string,
  values: StudentFormValues,
): Promise<Student> {
  const supabase = await createSupabaseServerClient();
  const payload: StudentUpdate = mapStudentPayload(values);
  const { data, error } = await supabase
    .from("students")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    logSupabaseError("[Students] updateStudent", error, { id, payload });
    if (error.code === "23505") {
      throw new Error("NISN sudah terdaftar. Gunakan NISN yang berbeda.");
    }

    throw new Error(buildSupabaseErrorMessage("Gagal memperbarui data siswa", error));
  }

  return mapStudent(data);
}

export async function deleteStudent(id: string): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("students").delete().eq("id", id);

  if (error) {
    logSupabaseError("[Students] deleteStudent", error, { id });
    throw new Error(buildSupabaseErrorMessage("Gagal menghapus data siswa", error));
  }
}
