import { ErrorState } from "@/components/shared/ErrorState";
import { PageHeader } from "@/components/shared/PageHeader";
import { CounselingRecordTable } from "@/features/counseling-records/components/CounselingRecordTable";
import { getCounselingRecordSheet } from "@/features/counseling-records/services/counselingRecordService";

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

export default async function CounselingRecordsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const month = parsePositiveNumber(getSingleValue(resolvedSearchParams.month));
  const year = parsePositiveNumber(getSingleValue(resolvedSearchParams.year));
  let loadError = "";
  let result: Awaited<ReturnType<typeof getCounselingRecordSheet>> | null = null;

  try {
    result = await getCounselingRecordSheet({ month, year, page: 1 });
  } catch (error) {
    loadError =
      error instanceof Error
        ? error.message
        : "Data catatan pelanggaran gagal dimuat.";
  }

  return (
    <section className="space-y-6">
      <PageHeader title="Catatan Pelanggaran" description="Rekap pelanggaran siswa dalam tampilan tabel administrasi yang rapat." />
      {loadError ? (
        <ErrorState description={loadError} />
      ) : (
        result ? <CounselingRecordTable result={result} /> : null
      )}
    </section>
  );
}
