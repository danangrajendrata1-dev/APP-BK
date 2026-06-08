import { createSupabaseServerClient } from "@/lib/supabase/server";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
}

export function validateUploadedFile(
  file: File,
  options: {
    allowedMimeTypes: string[];
    maxSizeBytes?: number;
    requiredMessage: string;
  },
) {
  if (!file || file.size <= 0) {
    throw new Error(options.requiredMessage);
  }

  if (file.size > (options.maxSizeBytes ?? MAX_FILE_SIZE_BYTES)) {
    throw new Error("Ukuran file melebihi batas 5 MB.");
  }

  if (!options.allowedMimeTypes.includes(file.type)) {
    throw new Error("Tipe file tidak didukung.");
  }
}

export async function uploadPrivateFile(params: {
  bucket: string;
  file: File;
  folder: string;
}) {
  const supabase = await createSupabaseServerClient();
  const fileExtension = params.file.name.split(".").pop() ?? "bin";
  const safeName = sanitizeFileName(params.file.name);
  const filePath = `${params.folder}/${Date.now()}-${safeName || `file.${fileExtension}`}`;

  const { error } = await supabase.storage
    .from(params.bucket)
    .upload(filePath, params.file, {
      contentType: params.file.type,
      upsert: false,
    });

  if (error) {
    throw new Error("Upload file ke penyimpanan gagal.");
  }

  return filePath;
}

export async function createSignedFileUrl(bucket: string, filePath: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(filePath, 60 * 15);

  if (error) {
    return null;
  }

  return data.signedUrl;
}
