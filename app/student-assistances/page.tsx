import { revalidatePath } from "next/cache";

import { ErrorState } from "@/components/shared/ErrorState";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { StudentAssistanceFilter } from "@/features/student-assistances/components/StudentAssistanceFilter";
import { StudentAssistanceForm } from "@/features/student-assistances/components/StudentAssistanceForm";
import { StudentAssistanceTable } from "@/features/student-assistances/components/StudentAssistanceTable";
import { createStudentAssistanceFormState, INITIAL_STUDENT_ASSISTANCE_FORM_STATE, parseStudentAssistanceFormData, validateStudentAssistanceForm } from "@/features/student-assistances/schemas/studentAssistanceSchema";
import { createStudentAssistance, getStudentAssistances } from "@/features/student-assistances/services/studentAssistanceService";
import type { StudentAssistanceFilters, StudentAssistanceFormState } from "@/features/student-assistances/types/studentAssistance";

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
function parseFilters(searchParams: Record<string, string | string[] | undefined>): StudentAssistanceFilters {
  const className = getSingleValue(searchParams.className)?.trim();
  const month = parsePositiveNumber(getSingleValue(searchParams.month));
  const year = parsePositiveNumber(getSingleValue(searchParams.year));
  return { className: className || undefined, month, year };
}

export default async function StudentAssistancesPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const filters = parseFilters(resolvedSearchParams);
  const page = parsePage(getSingleValue(resolvedSearchParams.page));
  let loadError = "";
  let result: Awaited<ReturnType<typeof getStudentAssistances>> | null = null;

  async function createStudentAssistanceAction(
    _state: StudentAssistanceFormState,
    formData: FormData,
  ): Promise<StudentAssistanceFormState> {
    "use server";
    const values = parseStudentAssistanceFormData(formData);
    const errors = validateStudentAssistanceForm(values);
    if (Object.keys(errors).length > 0) {
      return createStudentAssistanceFormState(values, errors, "Periksa kembali form pendampingan siswa per bulan.");
    }
    try {
      await createStudentAssistance(values);
      revalidatePath("/student-assistances");
      return INITIAL_STUDENT_ASSISTANCE_FORM_STATE;
    } catch (error) {
      return createStudentAssistanceFormState(values, {}, error instanceof Error ? error.message : "Gagal menyimpan catatan pendampingan siswa per bulan.");
    }
  }

  try {
    result = await getStudentAssistances({ page, pageSize: 20, filters });
  } catch (error) {
    loadError =
      error instanceof Error
        ? error.message
        : "Data pendampingan siswa per bulan gagal dimuat.";
  }

  const queryString = new URLSearchParams({
    ...(filters.className ? { className: filters.className } : {}),
    ...(filters.month ? { month: String(filters.month) } : {}),
    ...(filters.year ? { year: String(filters.year) } : {}),
  }).toString();
  return (
    <section className="space-y-6">
      <PageHeader title="Catatan Pendampingan Siswa Per Bulan" description="Kelola catatan pendampingan bulanan sesuai PRD, tampilkan tanggal 1 sampai 31, dan hitung jumlah otomatis dari isian kode pendampingan." />
      <Card>
        <CardHeader>
          <CardTitle>Input Pendampingan Siswa Per Bulan</CardTitle>
          <CardDescription>Tampilan dibuat menyerupai tabel bulanan agar pengisian kode pendampingan per tanggal tetap mudah dibaca.</CardDescription>
        </CardHeader>
        <CardContent>
          <StudentAssistanceForm action={createStudentAssistanceAction} />
        </CardContent>
      </Card>
      {loadError ? (
        <ErrorState description={loadError} />
      ) : (
        <>
          <StudentAssistanceFilter filters={filters} />
          {result ? <StudentAssistanceTable result={result} queryString={queryString} /> : null}
        </>
      )}
    </section>
  );
}
