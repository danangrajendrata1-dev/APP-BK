import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  createSignedFileUrl,
  uploadPrivateFile,
  validateUploadedFile,
} from "@/lib/supabase/storage";
import { buildSupabaseErrorMessage, logSupabaseError } from "@/lib/supabase/error";
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
  "id, title, file_path, file_name, mime_type, file_size, description, created_at, updated_at";
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
  | "title"
  | "file_path"
  | "file_name"
  | "mime_type"
  | "file_size"
  | "description"
  | "created_at"
  | "updated_at"
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
    title: row.title,
    filePath,
    fileName: normalizeText(row.file_name),
    mimeType: normalizeText(row.mime_type),
    fileSize: row.file_size ?? 0,
    fileUrl,
    description: normalizeText(row.description),
  };
}

function mapDocumentPayload(
  values: DocumentFormValues,
  filePath: string,
  file: File,
): DocumentInsert {
  return {
    title: values.title,
    description: values.description || null,
    file_path: filePath,
    file_name: file.name,
    mime_type: file.type,
    file_size: file.size,
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
    .order("created_at", { ascending: false })
    .range(from, to);

  if (filters.title) query = query.ilike("title", `%${filters.title}%`);

  const { data, count, error } = await query;
  if (error) {
    logSupabaseError("[Documents] getDocuments", error, {
      page,
      pageSize,
      filters,
    });
    throw new Error(buildSupabaseErrorMessage("Gagal memuat surat dan dokumen", error));
  }

  const items = await Promise.all(
    ((data ?? []) as DocumentListRow[]).map(mapDocument),
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

export async function createDocument(
  values: DocumentFormValues,
  file: File,
): Promise<DocumentItem> {
  validateUploadedFile(file, {
    allowedMimeTypes: [...DOCUMENT_ALLOWED_TYPES],
    maxSizeBytes: 10 * 1024 * 1024,
    requiredMessage: "File lampiran wajib diunggah",
  });

  const filePath = await uploadPrivateFile({
    bucket: DOCUMENT_BUCKET,
    file,
    folder: `documents/${Date.now()}`,
  });

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("documents")
    .insert(mapDocumentPayload(values, filePath, file) as never)
    .select(DOCUMENT_LIST_COLUMNS)
    .single();

  if (error) {
    logSupabaseError("[Documents] createDocument", error, {
      filePath,
    });
    throw new Error(buildSupabaseErrorMessage("Gagal menyimpan surat dan dokumen", error));
  }

  return mapDocument(data as DocumentListRow);
}
