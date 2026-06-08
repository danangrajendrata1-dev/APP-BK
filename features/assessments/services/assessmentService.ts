import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  createSignedFileUrl,
  uploadPrivateFile,
  validateUploadedFile,
} from "@/lib/supabase/storage";
import type { Database } from "@/types/database";

import type {
  AssessmentFileItem,
  AssessmentFormValues,
  AssessmentListQuery,
  AssessmentListResult,
} from "@/features/assessments/types/assessment";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const ASSESSMENT_BUCKET = "assessment-files";
const ASSESSMENT_ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

type AssessmentRow = Database["public"]["Tables"]["assessment_files"]["Row"];
type AssessmentInsert = Database["public"]["Tables"]["assessment_files"]["Insert"];

function normalizeText(value: string | null | undefined) {
  return value ?? "";
}

async function mapAssessment(row: AssessmentRow): Promise<AssessmentFileItem> {
  const filePath = normalizeText(row.file_path);
  const fileUrl = filePath
    ? ((await createSignedFileUrl(ASSESSMENT_BUCKET, filePath)) ?? "")
    : "";

  return {
    id: row.id,
    title: row.title,
    assessmentType: row.assessment_type,
    filePath,
    fileUrl,
    description: normalizeText(row.description),
    updatedAt: row.updated_at,
  };
}

function mapAssessmentPayload(
  values: AssessmentFormValues,
  filePath: string,
  fileUrl: string,
): AssessmentInsert {
  return {
    title: values.assessmentType,
    assessment_type: values.assessmentType,
    file_path: filePath,
    file_url: fileUrl || null,
  };
}

export async function getAssessments(
  params: Partial<AssessmentListQuery> = {},
): Promise<AssessmentListResult> {
  const supabase = await createSupabaseServerClient();
  const page = Math.max(params.page ?? DEFAULT_PAGE, 1);
  const pageSize = Math.max(params.pageSize ?? DEFAULT_PAGE_SIZE, 1);
  const filters = params.filters ?? {};
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("assessment_files")
    .select("*", { count: "exact" })
    .order("updated_at", { ascending: false })
    .range(from, to);

  if (filters.assessmentType) {
    query = query.eq("assessment_type", filters.assessmentType);
  }

  const { data, count, error } = await query;
  if (error) throw new Error("Gagal memuat file inventori dan asesmen.");

  const items = await Promise.all((data ?? []).map(mapAssessment));
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

export async function createAssessment(
  values: AssessmentFormValues,
  file: File,
): Promise<AssessmentFileItem> {
  validateUploadedFile(file, {
    allowedMimeTypes: [...ASSESSMENT_ALLOWED_TYPES],
    requiredMessage: "File asesmen wajib diunggah",
  });

  const filePath = await uploadPrivateFile({
    bucket: ASSESSMENT_BUCKET,
    file,
    folder: `assessments/${values.assessmentType}`,
  });
  const fileUrl = (await createSignedFileUrl(ASSESSMENT_BUCKET, filePath)) ?? "";

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("assessment_files")
    .insert(mapAssessmentPayload(values, filePath, fileUrl))
    .select("*")
    .single();

  if (error) throw new Error("Gagal menyimpan file asesmen.");
  return mapAssessment(data);
}
