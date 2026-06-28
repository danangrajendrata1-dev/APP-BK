import { revalidatePath } from "next/cache";

import { ErrorState } from "@/components/shared/ErrorState";
import { PageHeader } from "@/components/shared/PageHeader";
import { SchoolAttendanceFilter } from "@/features/school-attendance/components/SchoolAttendanceFilter";
import { SchoolAttendanceTable } from "@/features/school-attendance/components/SchoolAttendanceTable";
import {
  createSchoolAttendance,
  getSchoolAttendanceSheet,
} from "@/features/school-attendance/services/schoolAttendanceService";
import {
  EMPTY_SCHOOL_ATTENDANCE_FORM_VALUES,
  createSchoolAttendanceFormState,
  INITIAL_SCHOOL_ATTENDANCE_FORM_STATE,
  parseSchoolAttendanceFormData,
  validateSchoolAttendanceForm,
} from "@/features/school-attendance/schemas/schoolAttendanceSchema";
import { getStudentClassOptions } from "@/features/students/services/studentService";
import type { SchoolAttendanceFilters, SchoolAttendanceFormState } from "@/features/school-attendance/types/schoolAttendance";

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

  return {
    month,
    year,
    className: className || undefined,
  };
}

export default async function SchoolAttendancePage({
  searchParams,
}: SchoolAttendancePageProps) {
  const resolvedSearchParams = await searchParams;
  const filters = parseFilters(resolvedSearchParams);
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const classOptions = await getStudentClassOptions();
  const selectedClass = filters.className ?? classOptions[0] ?? "";
  const selectedMonth = filters.month ?? currentMonth;
  const selectedYear = filters.year ?? currentYear;
  let loadError = "";
  let result: Awaited<ReturnType<typeof getSchoolAttendanceSheet>> | null = null;

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
        "Periksa kembali field yang wajib diisi.",
      );
    }

    try {
      await createSchoolAttendance(values);
      revalidatePath("/school-attendance");

      return {
        status: "success",
        message: "Daftar hadir berhasil disimpan.",
        errors: {},
        values: {
          ...EMPTY_SCHOOL_ATTENDANCE_FORM_VALUES,
          className: values.className,
          month: values.month,
          year: values.year,
        },
      };
    } catch (error) {
      return createSchoolAttendanceFormState(
        values,
        {},
        error instanceof Error ? error.message : "Gagal menyimpan daftar hadir.",
      );
    }
  }

  try {
    result = await getSchoolAttendanceSheet({
      className: selectedClass,
      month: selectedMonth,
      year: selectedYear,
    });
  } catch (error) {
    loadError =
      error instanceof Error
        ? error.message
        : "Data daftar hadir sekolah gagal dimuat.";
  }

  return (
    <section className="space-y-6">
      <PageHeader
        title="Daftar Hadir Sekolah"
        description="Lihat rekap kehadiran siswa per kelas dalam format tabel bulanan."
      />
      {loadError ? (
        <ErrorState description={loadError} />
      ) : (
        <>
          <SchoolAttendanceFilter
            classOptions={classOptions}
            selectedClass={selectedClass}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            action={createSchoolAttendanceAction}
          />
          {result ? <SchoolAttendanceTable result={result} /> : null}
        </>
      )}
    </section>
  );
}
