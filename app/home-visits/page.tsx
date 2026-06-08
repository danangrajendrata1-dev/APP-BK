import { revalidatePath } from "next/cache";

import { ErrorState } from "@/components/shared/ErrorState";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { HomeVisitFilter } from "@/features/home-visits/components/HomeVisitFilter";
import { HomeVisitForm } from "@/features/home-visits/components/HomeVisitForm";
import { HomeVisitTable } from "@/features/home-visits/components/HomeVisitTable";
import { createHomeVisitFormState, INITIAL_HOME_VISIT_FORM_STATE, parseHomeVisitFormData, validateHomeVisitForm } from "@/features/home-visits/schemas/homeVisitSchema";
import { createHomeVisit, getHomeVisits } from "@/features/home-visits/services/homeVisitService";
import type { HomeVisitFilters, HomeVisitFormState } from "@/features/home-visits/types/homeVisit";
import { getStudentReferences } from "@/features/school-attendance/services/schoolAttendanceService";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parsePositiveNumber(value: string | undefined) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function parsePage(value: string | undefined) {
  const page = Number(value);
  return Number.isFinite(page) && page > 0 ? page : 1;
}

function parseFilters(searchParams: Record<string, string | string[] | undefined>): HomeVisitFilters {
  const month = parsePositiveNumber(getSingleValue(searchParams.month));
  const year = parsePositiveNumber(getSingleValue(searchParams.year));
  const className = getSingleValue(searchParams.className)?.trim();
  const studentName = getSingleValue(searchParams.studentName)?.trim();
  return {
    month,
    year,
    className: className || undefined,
    studentName: studentName || undefined,
  };
}

export default async function HomeVisitsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const filters = parseFilters(resolvedSearchParams);
  const page = parsePage(getSingleValue(resolvedSearchParams.page));
  let loadError = "";
  let students: Awaited<ReturnType<typeof getStudentReferences>> = [];
  let result: Awaited<ReturnType<typeof getHomeVisits>> | null = null;

  async function createHomeVisitAction(
    _state: HomeVisitFormState,
    formData: FormData,
  ): Promise<HomeVisitFormState> {
    "use server";

    const values = parseHomeVisitFormData(formData);
    const file = formData.get("documentation");
    const parsedFile = file instanceof File ? file : null;
    const errors = validateHomeVisitForm(values, parsedFile);

    if (Object.keys(errors).length > 0) {
      return createHomeVisitFormState(values, errors, "Periksa kembali form home visit.");
    }

    try {
      await createHomeVisit(values, parsedFile as File);
      revalidatePath("/home-visits");
      return INITIAL_HOME_VISIT_FORM_STATE;
    } catch (error) {
      return createHomeVisitFormState(values, {}, error instanceof Error ? error.message : "Gagal menyimpan data home visit.");
    }
  }

  try {
    [students, result] = await Promise.all([
      getStudentReferences(),
      getHomeVisits({ page, pageSize: 20, filters }),
    ]);
  } catch (error) {
    loadError =
      error instanceof Error
        ? error.message
        : "Data home visit gagal dimuat.";
  }

  const queryString = new URLSearchParams({
    ...(filters.month ? { month: String(filters.month) } : {}),
    ...(filters.year ? { year: String(filters.year) } : {}),
    ...(filters.className ? { className: filters.className } : {}),
    ...(filters.studentName ? { studentName: filters.studentName } : {}),
  }).toString();

  return (
    <section className="space-y-6">
      <PageHeader title="Home Visit" description="Kelola data home visit sesuai PRD, termasuk upload dokumentasi ke penyimpanan aman dan filter berdasarkan bulan, tahun, kelas, serta nama siswa." />
      <Card>
        <CardHeader>
          <CardTitle>Input Home Visit</CardTitle>
          <CardDescription>Dokumentasi disimpan ke Supabase Storage bucket `home-visit-files` dan hanya dibuka melalui akses terkontrol.</CardDescription>
        </CardHeader>
        <CardContent>
          <HomeVisitForm students={students} action={createHomeVisitAction} />
        </CardContent>
      </Card>
      {loadError ? (
        <ErrorState description={loadError} />
      ) : (
        <>
          <HomeVisitFilter filters={filters} />
          {result ? <HomeVisitTable result={result} queryString={queryString} /> : null}
        </>
      )}
    </section>
  );
}
