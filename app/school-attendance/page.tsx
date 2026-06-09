import { revalidatePath } from "next/cache";

import { ErrorState } from "@/components/shared/ErrorState";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { SchoolAttendanceFilter } from "@/features/school-attendance/components/SchoolAttendanceFilter";
import { SchoolAttendanceForm } from "@/features/school-attendance/components/SchoolAttendanceForm";
import { SchoolAttendanceTable } from "@/features/school-attendance/components/SchoolAttendanceTable";
import {
  createSchoolAttendanceFormState,
  INITIAL_SCHOOL_ATTENDANCE_FORM_STATE,
  parseSchoolAttendanceFormData,
  validateSchoolAttendanceForm,
} from "@/features/school-attendance/schemas/schoolAttendanceSchema";
import {
  createSchoolAttendance,
  getSchoolAttendances,
} from "@/features/school-attendance/services/schoolAttendanceService";
import type {
  SchoolAttendanceFilters,
  SchoolAttendanceFormState,
} from "@/features/school-attendance/types/schoolAttendance";
import type { SchoolAttendanceStatus } from "@/types/common";

type SchoolAttendancePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parsePositiveNumber(value: string | undefined) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function parseFilters(
  searchParams: Record<string, string | string[] | undefined>,
): SchoolAttendanceFilters {
  const month = parsePositiveNumber(getSingleValue(searchParams.month));
  const year = parsePositiveNumber(getSingleValue(searchParams.year));
  const className = getSingleValue(searchParams.className)?.trim();
  const status = getSingleValue(searchParams.status)?.trim() as
    | SchoolAttendanceStatus
    | undefined;

  return {
    month,
    year,
    className: className || undefined,
    status: status || undefined,
  };
}

function parsePage(value: string | undefined) {
  const page = Number(value);
  return Number.isFinite(page) && page > 0 ? page : 1;
}

export default async function SchoolAttendancePage({
  searchParams,
}: SchoolAttendancePageProps) {
  const resolvedSearchParams = await searchParams;
  const filters = parseFilters(resolvedSearchParams);
  const page = parsePage(getSingleValue(resolvedSearchParams.page));
  let loadError = "";
  let result: Awaited<ReturnType<typeof getSchoolAttendances>> | null = null;

  async function createSchoolAttendanceAction(
    _state: SchoolAttendanceFormState,
    formData: FormData,
  ): Promise<SchoolAttendanceFormState> {
    "use server";

    const values = parseSchoolAttendanceFormData(formData);
    const errors = validateSchoolAttendanceForm(values);

    if (Object.keys(errors).length > 0) {
      return createSchoolAttendanceFormState(
        values,
        errors,
        "Periksa kembali form presensi sekolah.",
      );
    }

    try {
      await createSchoolAttendance(values);
      revalidatePath("/school-attendance");
      return INITIAL_SCHOOL_ATTENDANCE_FORM_STATE;
    } catch (error) {
      return createSchoolAttendanceFormState(
        values,
        {},
        error instanceof Error ? error.message : "Gagal menyimpan presensi sekolah.",
      );
    }
  }

  try {
    result = await getSchoolAttendances({
      page,
      pageSize: 20,
      filters,
    });
  } catch (error) {
    loadError =
      error instanceof Error
        ? error.message
        : "Data presensi sekolah gagal dimuat.";
  }

  const queryString = new URLSearchParams({
    ...(filters.month ? { month: String(filters.month) } : {}),
    ...(filters.year ? { year: String(filters.year) } : {}),
    ...(filters.className ? { className: filters.className } : {}),
    ...(filters.status ? { status: filters.status } : {}),
  }).toString();

  return (
    <section className="space-y-6">
      <PageHeader
        title="Presensi Sekolah"
        description="Catat kehadiran siswa per tanggal dan saring data berdasarkan bulan, tahun, kelas, serta status."
      />

      <Card>
        <CardHeader>
          <CardTitle>Input Presensi Sekolah</CardTitle>
          <CardDescription>
            Nama siswa mengambil referensi dari data siswa, dan kelas akan terisi otomatis mengikuti data siswa yang dipilih.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SchoolAttendanceForm
            action={createSchoolAttendanceAction}
          />
        </CardContent>
      </Card>

      {loadError ? (
        <ErrorState description={loadError} />
      ) : (
        <>
          <SchoolAttendanceFilter filters={filters} />
          {result ? <SchoolAttendanceTable result={result} queryString={queryString} /> : null}
        </>
      )}
    </section>
  );
}
