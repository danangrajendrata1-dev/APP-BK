import { ErrorState } from "@/components/shared/ErrorState";
import { PageHeader } from "@/components/shared/PageHeader";
import { ReportsChartCard } from "@/features/reports/components/ReportsChartCard";
import { ReportsFilter } from "@/features/reports/components/ReportsFilter";
import { ReportsSummaryGrid } from "@/features/reports/components/ReportsSummaryGrid";
import { ReportsTableSection } from "@/features/reports/components/ReportsTableSection";
import { getReportsData } from "@/features/reports/services/reportService";
import type { ReportsFilters } from "@/features/reports/types/report";

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

function parseFilters(searchParams: Record<string, string | string[] | undefined>): ReportsFilters {
  const month = parsePositiveNumber(getSingleValue(searchParams.month));
  const semesterValue = parsePositiveNumber(getSingleValue(searchParams.semester));
  const year = parsePositiveNumber(getSingleValue(searchParams.year));
  const className = getSingleValue(searchParams.className)?.trim();

  return {
    month,
    semester: semesterValue === 1 || semesterValue === 2 ? semesterValue : undefined,
    year,
    className: className || undefined,
  };
}

export default async function ReportsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const filters = parseFilters(resolvedSearchParams);
  let loadError = "";
  let reports: Awaited<ReturnType<typeof getReportsData>> | null = null;

  try {
    reports = await getReportsData(filters);
  } catch (error) {
    loadError = error instanceof Error ? error.message : "Laporan dan statistik gagal dimuat.";
  }

  return (
    <section className="space-y-6">
      <PageHeader title="Laporan dan Statistik" description="Lihat ringkasan laporan, grafik, dan statistik layanan BK." />
      {loadError ? (
        <ErrorState description={loadError} />
      ) : reports ? (
        <>
          <ReportsFilter filters={filters} />
          <ReportsSummaryGrid summary={reports.summary} />

          <div className="grid gap-6 xl:grid-cols-2">
            <ReportsChartCard title="Pelanggaran Per Bulan" description="Grafik jumlah pelanggaran per bulan." items={reports.charts.counselingPerMonth} />
            <ReportsChartCard title="Siswa Terbanyak Menerima Layanan" description="Grafik siswa dengan akumulasi layanan BK terbanyak." items={reports.charts.studentsMostServed} />
            <ReportsChartCard title="Kehadiran Siswa" description="Grafik distribusi status kehadiran siswa." items={reports.charts.attendanceByStatus} />
            <ReportsChartCard title="Jenis Pelanggaran Terbanyak" description="Grafik jenis pelanggaran yang paling sering muncul." items={reports.charts.topViolationTypes} />
            <ReportsChartCard title="Kelas Dengan Layanan BK Terbanyak" description="Grafik kelas dengan aktivitas layanan BK paling tinggi." items={reports.charts.classesMostServed} />
          </div>

          <div className="space-y-6">
            {reports.reportSections.map((section) => (
              <ReportsTableSection key={section.title} section={section} />
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
