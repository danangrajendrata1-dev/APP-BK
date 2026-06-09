import { revalidatePath } from "next/cache";

import { ErrorState } from "@/components/shared/ErrorState";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { ClassAssistanceFilter } from "@/features/class-assistances/components/ClassAssistanceFilter";
import { ClassAssistanceForm } from "@/features/class-assistances/components/ClassAssistanceForm";
import { ClassAssistanceTable } from "@/features/class-assistances/components/ClassAssistanceTable";
import { createClassAssistanceFormState, INITIAL_CLASS_ASSISTANCE_FORM_STATE, parseClassAssistanceFormData, validateClassAssistanceForm } from "@/features/class-assistances/schemas/classAssistanceSchema";
import { createClassAssistance, getClassAssistances } from "@/features/class-assistances/services/classAssistanceService";
import type { ClassAssistanceFilters, ClassAssistanceFormState } from "@/features/class-assistances/types/classAssistance";

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
function parseFilters(searchParams: Record<string, string | string[] | undefined>): ClassAssistanceFilters {
  const className = getSingleValue(searchParams.className)?.trim();
  const violationType = getSingleValue(searchParams.violationType)?.trim();
  const finalWarningLetter = getSingleValue(searchParams.finalWarningLetter)?.trim();
  return {
    className: className || undefined,
    violationType: violationType || undefined,
    finalWarningLetter: finalWarningLetter || undefined,
  };
}

export default async function ClassAssistancesPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const filters = parseFilters(resolvedSearchParams);
  const page = parsePage(getSingleValue(resolvedSearchParams.page));
  let loadError = "";
  let result: Awaited<ReturnType<typeof getClassAssistances>> | null = null;

  async function createClassAssistanceAction(
    _state: ClassAssistanceFormState,
    formData: FormData,
  ): Promise<ClassAssistanceFormState> {
    "use server";
    const values = parseClassAssistanceFormData(formData);
    const errors = validateClassAssistanceForm(values);
    if (Object.keys(errors).length > 0) {
      return createClassAssistanceFormState(values, errors, "Periksa kembali form daftar pendampingan siswa per kelas.");
    }
    try {
      await createClassAssistance(values);
      revalidatePath("/class-assistances");
      return INITIAL_CLASS_ASSISTANCE_FORM_STATE;
    } catch (error) {
      return createClassAssistanceFormState(values, {}, error instanceof Error ? error.message : "Gagal menyimpan daftar pendampingan siswa per kelas.");
    }
  }

  try {
    result = await getClassAssistances({ page, pageSize: 20, filters });
  } catch (error) {
    loadError =
      error instanceof Error
        ? error.message
        : "Data daftar pendampingan siswa per kelas gagal dimuat.";
  }

  const queryString = new URLSearchParams({
    ...(filters.className ? { className: filters.className } : {}),
    ...(filters.violationType ? { violationType: filters.violationType } : {}),
    ...(filters.finalWarningLetter ? { finalWarningLetter: filters.finalWarningLetter } : {}),
  }).toString();
  return (
    <section className="space-y-6">
      <PageHeader title="Daftar Pendampingan Siswa Per Kelas" description="Kelola catatan pendampingan siswa per kelas." />
      <Card>
        <CardHeader>
          <CardTitle>Input Daftar Pendampingan Per Kelas</CardTitle>
          <CardDescription>Catat data pendampingan siswa berdasarkan kelas.</CardDescription>
        </CardHeader>
        <CardContent>
          <ClassAssistanceForm action={createClassAssistanceAction} />
        </CardContent>
      </Card>
      {loadError ? (
        <ErrorState description={loadError} />
      ) : (
        <>
          <ClassAssistanceFilter filters={filters} />
          {result ? <ClassAssistanceTable result={result} queryString={queryString} /> : null}
        </>
      )}
    </section>
  );
}
