import { revalidatePath } from "next/cache";

import { ErrorState } from "@/components/shared/ErrorState";
import { PageHeader } from "@/components/shared/PageHeader";
import { BkServiceAttendanceFilter } from "@/features/bk-service-attendance/components/BkServiceAttendanceFilter";
import { BkServiceAttendanceTable } from "@/features/bk-service-attendance/components/BkServiceAttendanceTable";
import {
  createBkServiceAttendance,
  getBkServiceAttendances,
} from "@/features/bk-service-attendance/services/bkServiceAttendanceService";
import {
  EMPTY_BK_SERVICE_ATTENDANCE_FORM_VALUES,
  createBkServiceAttendanceFormState,
  parseBkServiceAttendanceFormData,
  validateBkServiceAttendanceForm,
} from "@/features/bk-service-attendance/schemas/bkServiceAttendanceSchema";
import type {
  BkServiceAttendanceFilters,
  BkServiceAttendanceFormState,
} from "@/features/bk-service-attendance/types/bkServiceAttendance";
import type { BkServicePurpose } from "@/types/common";

type BkServiceAttendancePageProps = {
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
): BkServiceAttendanceFilters {
  const month = parsePositiveNumber(getSingleValue(searchParams.month));
  const year = parsePositiveNumber(getSingleValue(searchParams.year));
  const className = getSingleValue(searchParams.className)?.trim();
  const purpose = getSingleValue(searchParams.purpose)?.trim() as BkServicePurpose | undefined;

  return {
    month,
    year,
    className: className || undefined,
    purpose: purpose || undefined,
  };
}

export default async function BkServiceAttendancePage({
  searchParams,
}: BkServiceAttendancePageProps) {
  const resolvedSearchParams = await searchParams;
  const filters = parseFilters(resolvedSearchParams);
  let loadError = "";
  let result: Awaited<ReturnType<typeof getBkServiceAttendances>> | null = null;

  async function createBkServiceAttendanceAction(
    _state: BkServiceAttendanceFormState,
    formData: FormData,
  ): Promise<BkServiceAttendanceFormState> {
    "use server";

    const values = parseBkServiceAttendanceFormData(formData);
    const errors = validateBkServiceAttendanceForm(values);

    if (Object.keys(errors).length > 0) {
      return createBkServiceAttendanceFormState(
        values,
        errors,
        "Periksa kembali form kunjungan.",
      );
    }

    try {
      await createBkServiceAttendance(values);
      revalidatePath("/bk-service-attendance");
      return createBkServiceAttendanceFormState(
        EMPTY_BK_SERVICE_ATTENDANCE_FORM_VALUES,
        {},
        "Daftar hadir dan catatan kunjungan BK berhasil disimpan.",
        "success",
      );
    } catch (error) {
      return createBkServiceAttendanceFormState(
        values,
        {},
        error instanceof Error
          ? error.message
          : "Gagal menyimpan catatan kunjungan BK.",
      );
    }
  }

  try {
    result = await getBkServiceAttendances({
      page: 1,
      pageSize: 50,
      filters,
    });
  } catch (error) {
    loadError =
      error instanceof Error
        ? error.message
        : "Data daftar hadir dan catatan kunjungan BK gagal dimuat.";
  }

  return (
    <section className="space-y-6">
      <PageHeader
        title="Daftar Hadir dan Catatan Kunjungan BK"
        description="Input catatan kunjungan bimbingan konseling dan lihat rekapitulasi data dalam tampilan tabel."
      />
      <BkServiceAttendanceFilter
        key={`${filters.className ?? ""}-${filters.month ?? ""}-${filters.year ?? ""}-${filters.purpose ?? ""}`}
        action={createBkServiceAttendanceAction}
        filters={filters}
      />
      {loadError ? (
        <ErrorState description={loadError} />
      ) : result ? (
        <BkServiceAttendanceTable result={result} />
      ) : null}
    </section>
  );
}
