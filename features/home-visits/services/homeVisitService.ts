import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  createSignedFileUrl,
  uploadPrivateFile,
  validateUploadedFile,
} from "@/lib/supabase/storage";
import { buildSupabaseErrorMessage, logSupabaseError } from "@/lib/supabase/error";
import type { Database } from "@/types/database";
import type { HomeVisitFormValues } from "@/types/common";

import type {
  HomeVisitItem,
  HomeVisitListQuery,
  HomeVisitListResult,
} from "@/features/home-visits/types/homeVisit";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const HOME_VISIT_BUCKET = "home-visit-files";
const HOME_VISIT_LIST_COLUMNS =
  "id, visit_date, student_id, student_name, parent_name, class_name, address, visit_result, follow_up, documentation_path";
const HOME_VISIT_ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
] as const;

type HomeVisitRow = Database["public"]["Tables"]["home_visits"]["Row"];
type HomeVisitListRow = Pick<
  HomeVisitRow,
  | "id"
  | "visit_date"
  | "student_id"
  | "student_name"
  | "parent_name"
  | "class_name"
  | "address"
  | "visit_result"
  | "follow_up"
  | "documentation_path"
>;
type HomeVisitInsert = Database["public"]["Tables"]["home_visits"]["Insert"];

function normalizeText(value: string | null | undefined) {
  return value ?? "";
}

async function mapHomeVisit(row: HomeVisitListRow): Promise<HomeVisitItem> {
  const documentationPath = normalizeText(row.documentation_path);
  const documentationUrl = documentationPath
    ? ((await createSignedFileUrl(HOME_VISIT_BUCKET, documentationPath)) ?? "")
    : "";

  return {
    id: row.id,
    visitDate: row.visit_date,
    studentId: row.student_id ?? "",
    studentName: row.student_name,
    parentName: normalizeText(row.parent_name),
    className: row.class_name,
    address: normalizeText(row.address),
    visitResult: normalizeText(row.visit_result),
    followUp: normalizeText(row.follow_up),
    documentationPath,
    documentationUrl,
  };
}

function mapHomeVisitPayload(
  values: HomeVisitFormValues,
  documentationPath: string,
  documentationUrl: string,
): HomeVisitInsert {
  return {
    visit_date: values.visitDate,
    student_id: values.studentId || null,
    student_name: values.studentName,
    parent_name: values.parentName,
    class_name: values.className,
    address: values.address,
    visit_result: values.visitResult,
    follow_up: values.followUp,
    documentation_path: documentationPath,
    documentation_url: documentationUrl || null,
  };
}

export async function getHomeVisits(
  params: Partial<HomeVisitListQuery> = {},
): Promise<HomeVisitListResult> {
  const supabase = await createSupabaseServerClient();
  const page = Math.max(params.page ?? DEFAULT_PAGE, 1);
  const pageSize = Math.max(params.pageSize ?? DEFAULT_PAGE_SIZE, 1);
  const filters = params.filters ?? {};
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("v_home_visits_with_relations" as never)
    .select(HOME_VISIT_LIST_COLUMNS, { count: "exact" })
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

  if (filters.className) query = query.ilike("class_name", `%${filters.className}%`);
  if (filters.studentName) query = query.ilike("student_name", `%${filters.studentName}%`);

  const { data, count, error } = await query;
  if (error) {
    logSupabaseError("[HomeVisits] getHomeVisits", error, {
      page,
      pageSize,
      filters,
    });
    throw new Error(buildSupabaseErrorMessage("Gagal memuat data home visit", error));
  }

  const items = await Promise.all(
    ((data ?? []) as HomeVisitListRow[]).map(mapHomeVisit),
  );
  const totalItems = count ?? 0;
  return {
    items,
    filters,
    pagination: {
      page,
      pageSize,
      totalItems,
      totalPages: Math.max(1, Math.ceil(totalItems / pageSize)),
    },
  };
}

export async function createHomeVisit(
  values: HomeVisitFormValues,
  file: File,
): Promise<HomeVisitItem> {
  validateUploadedFile(file, {
    allowedMimeTypes: [...HOME_VISIT_ALLOWED_TYPES],
    requiredMessage: "Dokumentasi wajib diunggah",
  });

  const documentationPath = await uploadPrivateFile({
    bucket: HOME_VISIT_BUCKET,
    file,
    folder: `home-visits/${values.visitDate || "undated"}`,
  });
  const documentationUrl =
    (await createSignedFileUrl(HOME_VISIT_BUCKET, documentationPath)) ?? "";

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("home_visits")
    .insert(mapHomeVisitPayload(values, documentationPath, documentationUrl) as never)
    .select("*")
    .single();

  if (error) {
    logSupabaseError("[HomeVisits] createHomeVisit", error, {
      studentId: values.studentId,
      visitDate: values.visitDate,
      documentationPath,
    });
    throw new Error(buildSupabaseErrorMessage("Gagal menyimpan data home visit", error));
  }
  return mapHomeVisit(data as HomeVisitListRow);
}
