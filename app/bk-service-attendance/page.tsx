import { revalidatePath } from "next/cache";

import { ErrorState } from "@/components/shared/ErrorState";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { BkServiceAttendanceFilter } from "@/features/bk-service-attendance/components/BkServiceAttendanceFilter";
import { BkServiceAttendanceForm } from "@/features/bk-service-attendance/components/BkServiceAttendanceForm";
import { BkServiceAttendanceTable } from "@/features/bk-service-attendance/components/BkServiceAttendanceTable";
import {
  createBkServiceAttendanceFormState,
  INITIAL_BK_SERVICE_ATTENDANCE_FORM_STATE,
  parseBkServiceAttendanceFormData,
  validateBkServiceAttendanceForm,
} from "@/features/bk-service-attendance/schemas/bkServiceAttendanceSchema";
import {
  createBkServiceAttendance,
  getBkServiceAttendances,
} from "@/features/bk-service-attendance/services/bkServiceAttendanceService";
import type {
  BkServiceAttendanceFilters,
  BkServiceAttendanceFormState,
} from "@/features/bk-service-attendance/types/bkServiceAttendance";
import type { BkServicePurpose, BkServiceType } from "@/types/common";

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

function parsePage(value: string | undefined) {
  const page = Number(value);
  return Number.isFinite(page) && page > 0 ? page : 1;
}

function parseFilters(
  searchParams: Record<string, string | string[] | undefined>,
): BkServiceAttendanceFilters {
  const month = parsePositiveNumber(getSingleValue(searchParams.month));
  const year = parsePositiveNumber(getSingleValue(searchParams.year));
  const className = getSingleValue(searchParams.className)?.trim();
  const counselorName = getSingleValue(searchParams.counselorName)?.trim();
  const purpose = getSingleValue(searchParams.purpose)?.trim() as
    | BkServicePurpose
    | undefined;
  const serviceType = getSingleValue(searchParams.serviceType)?.trim() as
    | BkServiceType
    | undefined;

  return {
    month,
    year,
    className: className || undefined,
    purpose: purpose || undefined,
    serviceType: serviceType || undefined,
    counselorName: counselorName || undefined,
  };
}

export default async function BkServiceAttendancePage({
  searchParams,
}: BkServiceAttendancePageProps) {
  const resolvedSearchParams = await searchParams;
  const filters = parseFilters(resolvedSearchParams);
  const page = parsePage(getSingleValue(resolvedSearchParams.page));
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
        "Periksa kembali form presensi layanan BK.",
      );
    }

    try {
      await createBkServiceAttendance(values);
      revalidatePath("/bk-service-attendance");
      return INITIAL_BK_SERVICE_ATTENDANCE_FORM_STATE;
    } catch (error) {
      return createBkServiceAttendanceFormState(
        values,
        {},
        error instanceof Error
          ? error.message
          : "Gagal menyimpan presensi layanan BK.",
      );
    }
  }

  try {
    result = await getBkServiceAttendances({
      page,
      pageSize: 20,
      filters,
    });
  } catch (error) {
    loadError =
      error instanceof Error
        ? error.message
        : "Data presensi layanan BK gagal dimuat.";
  }

  const queryString = new URLSearchParams({
    ...(filters.month ? { month: String(filters.month) } : {}),
    ...(filters.year ? { year: String(filters.year) } : {}),
    ...(filters.className ? { className: filters.className } : {}),
    ...(filters.purpose ? { purpose: filters.purpose } : {}),
    ...(filters.serviceType ? { serviceType: filters.serviceType } : {}),
    ...(filters.counselorName ? { counselorName: filters.counselorName } : {}),
  }).toString();

  return (
    <section className="space-y-6">
      <PageHeader
        title="Presensi Layanan BK"
        description="Catat kunjungan siswa ke layanan BK sesuai PRD, gunakan referensi data siswa, dan saring data berdasarkan bulan, tahun, kelas, keperluan, jenis layanan, serta guru BK."
      />

      <Card>
        <CardHeader>
          <CardTitle>Input Presensi Layanan BK</CardTitle>
          <CardDescription>
            Pilih siswa dari data induk agar nama dan kelas konsisten. Jam datang dan jam selesai divalidasi agar urutannya benar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BkServiceAttendanceForm
            action={createBkServiceAttendanceAction}
          />
        </CardContent>
      </Card>

      {loadError ? (
        <ErrorState description={loadError} />
      ) : (
        <>
          <BkServiceAttendanceFilter filters={filters} />
          {result ? <BkServiceAttendanceTable result={result} queryString={queryString} /> : null}
        </>
      )}
    </section>
  );
}
