import { revalidatePath } from "next/cache";

import { ErrorState } from "@/components/shared/ErrorState";
import { PageHeader } from "@/components/shared/PageHeader";
import { CounselingRecordFilter } from "@/features/counseling-records/components/CounselingRecordFilter";
import { CounselingRecordTable } from "@/features/counseling-records/components/CounselingRecordTable";
import {
  createCounselingRecord,
  getCounselingRecordSheet,
} from "@/features/counseling-records/services/counselingRecordService";
import {
  createCounselingRecordFormState,
  EMPTY_COUNSELING_RECORD_FORM_VALUES,
  parseCounselingRecordFormData,
  validateCounselingRecordForm,
} from "@/features/counseling-records/schemas/counselingRecordSchema";
import type {
  CounselingRecordFormState,
  CounselingRecordSheetFilters,
} from "@/features/counseling-records/types/counselingRecord";

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

function parseFilters(
  searchParams: Record<string, string | string[] | undefined>,
): CounselingRecordSheetFilters {
  const className = getSingleValue(searchParams.className)?.trim();
  const month = parsePositiveNumber(getSingleValue(searchParams.month));
  const year = parsePositiveNumber(getSingleValue(searchParams.year));

  return {
    className: className || undefined,
    month,
    year,
  };
}

export default async function CounselingRecordsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const filters = parseFilters(resolvedSearchParams);
  let loadError = "";
  let result: Awaited<ReturnType<typeof getCounselingRecordSheet>> | null = null;

  async function createCounselingRecordAction(
    _state: CounselingRecordFormState,
    formData: FormData,
  ): Promise<CounselingRecordFormState> {
    "use server";

    const values = parseCounselingRecordFormData(formData);
    const errors = validateCounselingRecordForm(values);

    if (Object.keys(errors).length > 0) {
      return createCounselingRecordFormState(
        values,
        errors,
        "Periksa kembali form pelanggaran.",
      );
    }

    try {
      await createCounselingRecord(values);
      revalidatePath("/counseling-records");
      return createCounselingRecordFormState(
        EMPTY_COUNSELING_RECORD_FORM_VALUES,
        {},
        "Catatan pelanggaran berhasil disimpan.",
        "success",
      );
    } catch (error) {
      return createCounselingRecordFormState(
        values,
        {},
        error instanceof Error
          ? error.message
          : "Gagal menyimpan catatan pelanggaran.",
      );
    }
  }

  try {
    result = await getCounselingRecordSheet(filters);
  } catch (error) {
    loadError =
      error instanceof Error
        ? error.message
        : "Data catatan pelanggaran gagal dimuat.";
  }

  return (
    <section className="space-y-6">
      <PageHeader
        title="Catatan Pelanggaran"
        description="Input catatan pelanggaran lewat form, lalu lihat rekap bulanan dengan jumlah sebelumnya."
      />
      <CounselingRecordFilter
        key={`${filters.className ?? ""}-${filters.month ?? ""}-${filters.year ?? ""}`}
        action={createCounselingRecordAction}
        filters={filters}
      />
      {loadError ? (
        <ErrorState description="Gagal memuat data catatan pelanggaran." />
      ) : result ? (
        <CounselingRecordTable result={result} />
      ) : null}
    </section>
  );
}
