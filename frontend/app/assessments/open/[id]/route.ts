import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSignedFileUrl } from "@/lib/supabase/storage";
import type { Database } from "@/types/database";

const ASSESSMENT_BUCKET = "assessment-files";

type RouteContext = {
  params: Promise<{ id: string }>;
};

type AssessmentPathRow = Pick<
  Database["public"]["Tables"]["assessment_files"]["Row"],
  "file_path"
>;

export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("assessment_files")
    .select("file_path")
    .eq("id", id)
    .maybeSingle();

  const assessment = data as AssessmentPathRow | null;

  if (error || !assessment?.file_path) {
    return NextResponse.redirect(new URL("/assessments", _request.url));
  }

  const signedUrl = await createSignedFileUrl(ASSESSMENT_BUCKET, assessment.file_path);

  if (!signedUrl) {
    return NextResponse.redirect(new URL("/assessments", _request.url));
  }

  return NextResponse.redirect(signedUrl);
}
