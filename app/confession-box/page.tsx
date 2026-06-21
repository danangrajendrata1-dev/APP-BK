import { revalidatePath } from "next/cache";

import { ErrorState } from "@/components/shared/ErrorState";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { ConfessionFilter } from "@/features/confession-box/components/ConfessionFilter";
import { ConfessionForm } from "@/features/confession-box/components/ConfessionForm";
import { ConfessionTable } from "@/features/confession-box/components/ConfessionTable";
import { createConfessionFormState, INITIAL_CONFESSION_FORM_STATE, parseConfessionFormData, validateConfessionForm } from "@/features/confession-box/schemas/confessionSchema";
import { createConfession, getConfessions } from "@/features/confession-box/services/confessionService";
import type { ConfessionFilters, ConfessionFormState } from "@/features/confession-box/types/confession";
import { normalizeRole, type AppRole } from "@/lib/auth/permissions";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { logSupabaseError } from "@/lib/supabase/error";
import type { ConfessionCategory } from "@/types/common";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parsePage(value: string | undefined) {
  const page = Number(value);
  return Number.isFinite(page) && page > 0 ? page : 1;
}

function parseFilters(searchParams: Record<string, string | string[] | undefined>): ConfessionFilters {
  const category = getSingleValue(searchParams.category)?.trim() as ConfessionCategory | undefined;
  return {
    category: category || undefined,
  };
}

async function getCurrentRole(): Promise<AppRole> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    logSupabaseError("[ConfessionBox] auth.getUser", authError);
  }

  if (!user) {
    return "siswa";
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    logSupabaseError("[ConfessionBox] profile lookup", profileError, {
      userId: user.id,
    });
  }

  const profileRole = (profile as { role?: string } | null)?.role;
  const resolvedRole = normalizeRole(
    profileRole ?? user.app_metadata?.role ?? user.user_metadata?.role,
  );

  console.info("[ConfessionBox] role result", {
    userId: user.id,
    profileRole: profileRole ?? null,
    appMetadataRole: user.app_metadata?.role ?? null,
    userMetadataRole: user.user_metadata?.role ?? null,
    resolvedRole,
    profileFound: Boolean(profile),
  });

  return resolvedRole;
}

export default async function ConfessionBoxPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const filters = parseFilters(resolvedSearchParams);
  const page = parsePage(getSingleValue(resolvedSearchParams.page));
  let loadError = "";
  let role: AppRole = "siswa";
  let result: Awaited<ReturnType<typeof getConfessions>> | null = null;

  async function createConfessionAction(
    _state: ConfessionFormState,
    formData: FormData,
  ): Promise<ConfessionFormState> {
    "use server";

    const values = parseConfessionFormData(formData);
    const errors = validateConfessionForm(values);

    if (Object.keys(errors).length > 0) {
      return createConfessionFormState(values, errors, "Periksa kembali form kotak curhat digital.");
    }

    try {
      await createConfession(values);
      revalidatePath("/confession-box");
      return INITIAL_CONFESSION_FORM_STATE;
    } catch (error) {
      return createConfessionFormState(values, {}, error instanceof Error ? error.message : "Gagal mengirim curhat digital.");
    }
  }

  try {
    role = await getCurrentRole();
    result = await getConfessions({
      page,
      pageSize: 20,
      filters,
    });
  } catch (error) {
    loadError =
      error instanceof Error
        ? error.message
        : "Data kotak curhat digital gagal dimuat.";
  }

  const queryString = new URLSearchParams({
    ...(filters.category ? { category: filters.category } : {}),
  }).toString();

  return (
    <section className="space-y-6">
      <PageHeader title="Kotak Curhat Digital" description="Siswa dapat menyampaikan curhat secara online, dan guru BK dapat menindaklanjutinya." />
      <Card>
        <CardHeader>
          <CardTitle>Form Kotak Curhat Digital</CardTitle>
          <CardDescription>Nama siswa boleh dikosongkan jika ingin menyampaikan curhat tanpa identitas.</CardDescription>
        </CardHeader>
        <CardContent>
          <ConfessionForm action={createConfessionAction} />
        </CardContent>
      </Card>
      {loadError ? (
        <ErrorState description={loadError} />
      ) : result ? (
        <>
          <ConfessionFilter filters={filters} />
          <ConfessionTable
            result={result}
            queryString={queryString}
            title={role === "siswa" ? "Riwayat Curhat Saya" : "Daftar Curhat Digital"}
            description={role === "siswa" ? "Daftar curhat yang pernah Anda kirim." : "Daftar curhat yang masuk ke layanan BK."}
          />
        </>
      ) : null}
    </section>
  );
}
