import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSignedFileUrl } from "@/lib/supabase/storage";
import type { Database } from "@/types/database";

const DOCUMENT_BUCKET = "document-files";
type DocumentPathRow = Pick<
  Database["public"]["Tables"]["bk_documents"]["Row"],
  "file_path"
>;

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("bk_documents")
    .select("file_path")
    .eq("id", id)
    .maybeSingle();
  const document = data as DocumentPathRow | null;

  if (error || !document?.file_path) {
    return NextResponse.redirect(new URL("/documents", _request.url));
  }

  const signedUrl = await createSignedFileUrl(DOCUMENT_BUCKET, document.file_path);

  if (!signedUrl) {
    return NextResponse.redirect(new URL("/documents", _request.url));
  }

  return NextResponse.redirect(signedUrl);
}
