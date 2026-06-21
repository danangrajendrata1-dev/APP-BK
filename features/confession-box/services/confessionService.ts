import { createSupabaseServerClient } from "@/lib/supabase/server";
import { buildSupabaseErrorMessage, logSupabaseError } from "@/lib/supabase/error";
import type { ConfessionFormValues } from "@/types/common";
import type { Database } from "@/types/database";

import type {
  ConfessionItem,
  ConfessionListQuery,
  ConfessionListResult,
} from "@/features/confession-box/types/confession";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const CONFESSION_LIST_COLUMNS =
  "id, confession_date, student_id, student_name, class_name, category, content, description, created_by";

type ConfessionRow = Database["public"]["Tables"]["confession_box"]["Row"];
type ConfessionListRow = Pick<
  ConfessionRow,
  | "id"
  | "confession_date"
  | "student_id"
  | "student_name"
  | "class_name"
  | "category"
  | "content"
  | "description"
  | "created_by"
>;
type ConfessionInsert = Database["public"]["Tables"]["confession_box"]["Insert"];

function normalizeText(value: string | null | undefined) {
  return value ?? "";
}

function mapConfession(row: ConfessionListRow): ConfessionItem {
  return {
    id: row.id,
    confessionDate: row.confession_date,
    studentId: row.student_id ?? "",
    studentName: normalizeText(row.student_name),
    className: normalizeText(row.class_name),
    category: row.category,
    content: row.content,
    description: normalizeText(row.description),
    createdBy: row.created_by ?? "",
  };
}

function mapConfessionPayload(
  values: ConfessionFormValues,
  userId: string,
): ConfessionInsert {
  return {
    confession_date: values.confessionDate,
    student_name: values.studentName || null,
    class_name: values.className,
    category: values.category,
    content: values.content,
    description: values.description || null,
    created_by: userId,
  };
}

export async function getConfessions(
  params: Partial<ConfessionListQuery> = {},
): Promise<ConfessionListResult> {
  const supabase = await createSupabaseServerClient();
  const page = Math.max(params.page ?? DEFAULT_PAGE, 1);
  const pageSize = Math.max(params.pageSize ?? DEFAULT_PAGE_SIZE, 1);
  const filters = params.filters ?? {};
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("confession_box")
    .select(CONFESSION_LIST_COLUMNS, { count: "exact" })
    .order("confession_date", { ascending: false })
    .range(from, to);

  if (filters.category) query = query.eq("category", filters.category);

  const { data, count, error } = await query;
  if (error) {
    logSupabaseError("[Confessions] getConfessions", error, {
      page,
      pageSize,
      filters,
    });
    throw new Error(
      buildSupabaseErrorMessage("Gagal memuat data kotak curhat digital", error),
    );
  }

  const totalItems = count ?? 0;
  return {
    items: (data ?? []).map(mapConfession),
    filters,
    pagination: {
      page,
      pageSize,
      totalItems,
      totalPages: Math.max(1, Math.ceil(totalItems / pageSize)),
    },
  };
}

export async function createConfession(
  values: ConfessionFormValues,
): Promise<ConfessionItem> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Session login tidak ditemukan.");
  }

  const { data, error } = await supabase
    .from("confession_box")
    .insert(mapConfessionPayload(values, user.id))
    .select("*")
    .single();

  if (error) {
    logSupabaseError("[Confessions] createConfession", error, {
      userId: user.id,
      confessionDate: values.confessionDate,
    });
    throw new Error(buildSupabaseErrorMessage("Gagal menyimpan curhat digital", error));
  }
  return mapConfession(data);
}
