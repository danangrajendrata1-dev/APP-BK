import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  createSignedFileUrl,
  uploadPrivateFile,
  validateUploadedFile,
} from "@/lib/supabase/storage";
import type { DocumentFormValues } from "@/types/common";
import type { Database } from "@/types/database";

import type {
  DocumentItem,
  DocumentListQuery,
  DocumentListResult,
} from "@/features/documents/types/document";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const DOCUMENT_BUCKET = "document-files";
const DOCUMENT_LIST_COLUMNS =
  "id, letter_number, document_date, student_id, student_name, class_name, document_type, file_path, description";
const DOCUMENT_ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

type DocumentRow = Database["public"]["Tables"]["documents"]["Row"];
type DocumentListRow = Pick<
  DocumentRow,
  | "id"
  | "letter_number"
  | "document_date"
  | "student_id"
  | "student_name"
  | "class_name"
  | "document_type"
  | "file_path"
  | "description"
>;
type DocumentInsert = Database["public"]["Tables"]["documents"]["Insert"];

function normalizeText(value: string | null | undefined) {
  return value ?? "";
}

async function mapDocument(row: DocumentListRow): Promise<DocumentItem> {
  const filePath = normalizeText(row.file_path);
  const fileUrl = filePath
    ? ((await createSignedFileUrl(DOCUMENT_BUCKET, filePath)) ?? "")
    : "";

  return {
    id: row.id,
    letterNumber: row.letter_number,
    documentDate: row.document_date,
    studentId: row.student_id ?? "",
    studentName: row.student_name,
    className: normalizeText(row.class_name),
    documentType: row.document_type,
    filePath,
    fileUrl,
    description: normalizeText(row.description),
  };
}

function mapDocumentPayload(
  values: DocumentFormValues,
  filePath: string,
  fileUrl: string,
): DocumentInsert {
  return {
    letter_number: values.letterNumber,
    document_date: values.documentDate,
    student_id: values.studentId || null,
    student_name: values.studentName,
    class_name: values.className,
    document_type: values.documentType,
    file_path: filePath,
    file_url: fileUrl || null,
    description: values.description || null,
  };
}

export async function getDocuments(
  params: Partial<DocumentListQuery> = {},
): Promise<DocumentListResult> {
  const supabase = await createSupabaseServerClient();
  const page = Math.max(params.page ?? DEFAULT_PAGE, 1);
  const pageSize = Math.max(params.pageSize ?? DEFAULT_PAGE_SIZE, 1);
  const filters = params.filters ?? {};
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("documents")
    .select(DOCUMENT_LIST_COLUMNS, { count: "exact" })
    .order("document_date", { ascending: false })
    .range(from, to);

  if (filters.documentDate) query = query.eq("document_date", filters.documentDate);
  if (filters.documentType) query = query.eq("document_type", filters.documentType);
  if (filters.studentName) query = query.ilike("student_name", `%${filters.studentName}%`);
  if (filters.className) query = query.ilike("class_name", `%${filters.className}%`);

  const { data, count, error } = await query;
  if (error) throw new Error("Gagal memuat surat dan dokumen.");

  const items = await Promise.all((data ?? []).map(mapDocument));
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

export async function createDocument(
  values: DocumentFormValues,
  file: File,
): Promise<DocumentItem> {
  validateUploadedFile(file, {
    allowedMimeTypes: [...DOCUMENT_ALLOWED_TYPES],
    requiredMessage: "File lampiran wajib diunggah",
  });

  const filePath = await uploadPrivateFile({
    bucket: DOCUMENT_BUCKET,
    file,
    folder: `documents/${values.documentDate || "undated"}`,
  });

  const fileUrl = (await createSignedFileUrl(DOCUMENT_BUCKET, filePath)) ?? "";
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("documents")
    .insert(mapDocumentPayload(values, filePath, fileUrl))
    .select("*")
    .single();

  if (error) {
    throw new Error("Gagal menyimpan surat dan dokumen.");
  }

  return mapDocument(data);
}
