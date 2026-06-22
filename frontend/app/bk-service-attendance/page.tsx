import { ErrorState } from "@/components/shared/ErrorState";
import { PageHeader } from "@/components/shared/PageHeader";
import { BkServiceAttendanceTable } from "@/features/bk-service-attendance/components/BkServiceAttendanceTable";
import { getBkServiceAttendances } from "@/features/bk-service-attendance/services/bkServiceAttendanceService";

type BkServiceAttendancePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function BkServiceAttendancePage({
  searchParams,
}: BkServiceAttendancePageProps) {
  await searchParams;
  let loadError = "";
  let result: Awaited<ReturnType<typeof getBkServiceAttendances>> | null = null;

  try {
    result = await getBkServiceAttendances({ page: 1, pageSize: 20 });
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
        description="Rekap kunjungan BK dalam tampilan tabel administrasi yang rapat."
      />
      {loadError ? (
        <ErrorState description={loadError} />
      ) : (
        result ? <BkServiceAttendanceTable result={result} /> : null
      )}
    </section>
  );
}
