import { revalidatePath } from "next/cache";

import { ErrorState } from "@/components/shared/ErrorState";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { CounselingRecordFilter } from "@/features/counseling-records/components/CounselingRecordFilter";
import { CounselingRecordForm } from "@/features/counseling-records/components/CounselingRecordForm";
import { CounselingRecordTable } from "@/features/counseling-records/components/CounselingRecordTable";
import {
  createCounselingRecordFormState,
  INITIAL_COUNSELING_RECORD_FORM_STATE,
  parseCounselingRecordFormData,
  validateCounselingRecordForm,
} from "@/features/counseling-records/schemas/counselingRecordSchema";
import { createCounselingRecord, getCounselingRecords } from "@/features/counseling-records/services/counselingRecordService";
import type { CounselingRecordFilters, CounselingRecordFormState } from "@/features/counseling-records/types/counselingRecord";
import type { CounselingMedia, CounselingType } from "@/types/common";

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

function parseFilters(searchParams: Record<string, string | string[] | undefined>): CounselingRecordFilters {
  const month = parsePositiveNumber(getSingleValue(searchParams.month));
  const year = parsePositiveNumber(getSingleValue(searchParams.year));
  const className = getSingleValue(searchParams.className)?.trim();
  const media = getSingleValue(searchParams.media)?.trim() as CounselingMedia | undefined;
  const counselingType = getSingleValue(searchParams.counselingType)?.trim() as CounselingType | undefined;
  return { month, year, className: className || undefined, media: media || undefined, counselingType: counselingType || undefined };
}

export default async function CounselingRecordsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const filters = parseFilters(resolvedSearchParams);
  const page = parsePage(getSingleValue(resolvedSearchParams.page));
  let loadError = "";
  let result: Awaited<ReturnType<typeof getCounselingRecords>> | null = null;

  async function createCounselingRecordAction(
    _state: CounselingRecordFormState,
    formData: FormData,
  ): Promise<CounselingRecordFormState> {
    "use server";
    const values = parseCounselingRecordFormData(formData);
    const errors = validateCounselingRecordForm(values);
    if (Object.keys(errors).length > 0) {
      return createCounselingRecordFormState(values, errors, "Periksa kembali form catatan konseling.");
    }
    try {
      await createCounselingRecord(values);
      revalidatePath("/counseling-records");
      return INITIAL_COUNSELING_RECORD_FORM_STATE;
    } catch (error) {
      return createCounselingRecordFormState(values, {}, error instanceof Error ? error.message : "Gagal menyimpan catatan konseling.");
    }
  }

  try {
    result = await getCounselingRecords({ page, pageSize: 20, filters });
  } catch (error) {
    loadError =
      error instanceof Error
        ? error.message
        : "Data catatan konseling gagal dimuat.";
  }

  const queryString = new URLSearchParams({
    ...(filters.month ? { month: String(filters.month) } : {}),
    ...(filters.year ? { year: String(filters.year) } : {}),
    ...(filters.className ? { className: filters.className } : {}),
    ...(filters.media ? { media: filters.media } : {}),
    ...(filters.counselingType ? { counselingType: filters.counselingType } : {}),
  }).toString();

  return (
    <section className="space-y-6">
      <PageHeader title="Catatan Konseling" description="Catat layanan konseling sesuai PRD, gunakan referensi data siswa, dan saring data berdasarkan bulan, tahun, kelas, media, serta jenis konseling." />
      <Card>
        <CardHeader>
          <CardTitle>Input Catatan Konseling</CardTitle>
          <CardDescription>Data sensitif ini tetap berada di area terproteksi untuk admin dan guru BK.</CardDescription>
        </CardHeader>
        <CardContent>
          <CounselingRecordForm action={createCounselingRecordAction} />
        </CardContent>
      </Card>
      {loadError ? (
        <ErrorState description={loadError} />
      ) : (
        <>
          <CounselingRecordFilter filters={filters} />
          {result ? <CounselingRecordTable result={result} queryString={queryString} /> : null}
        </>
      )}
    </section>
  );
}
