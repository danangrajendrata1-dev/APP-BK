import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSignedFileUrl } from "@/lib/supabase/storage";
import type { Database } from "@/types/database";

const HOME_VISIT_BUCKET = "home-visit-files";

type RouteContext = {
  params: Promise<{ id: string }>;
};

type HomeVisitPathRow = Pick<
  Database["public"]["Tables"]["home_visits"]["Row"],
  "documentation_path"
>;

export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("home_visits")
    .select("documentation_path")
    .eq("id", id)
    .maybeSingle();

  const visit = data as HomeVisitPathRow | null;

  if (error || !visit?.documentation_path) {
    return NextResponse.redirect(new URL("/home-visits", _request.url));
  }

  const signedUrl = await createSignedFileUrl(HOME_VISIT_BUCKET, visit.documentation_path);

  if (!signedUrl) {
    return NextResponse.redirect(new URL("/home-visits", _request.url));
  }

  return NextResponse.redirect(signedUrl);
}
