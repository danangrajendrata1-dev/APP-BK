import { ErrorState } from "@/components/shared/ErrorState";
import { PageHeader } from "@/components/shared/PageHeader";
import { DashboardMetricGrid } from "@/features/dashboard/components/DashboardMetricGrid";
import { DashboardSeriesCard } from "@/features/dashboard/components/DashboardSeriesCard";
import { getDashboardSummary } from "@/features/dashboard/services/dashboardService";

export default async function DashboardPage() {
  let loadError = "";
  let summary: Awaited<ReturnType<typeof getDashboardSummary>> | null = null;

  try {
    summary = await getDashboardSummary();
  } catch (error) {
    loadError = error instanceof Error ? error.message : "Dashboard gagal dimuat.";
  }

  return (
    <section className="space-y-6">
      <PageHeader title="Dashboard" description="Lihat ringkasan data, grafik, dan statistik layanan BK." />
      {loadError ? (
        <ErrorState description={loadError} />
      ) : summary ? (
        <>
          <DashboardMetricGrid metrics={summary.metrics} />
          <div className="grid gap-6 xl:grid-cols-2">
            <DashboardSeriesCard title="Jumlah Siswa Per Kelas" description="Distribusi jumlah siswa berdasarkan kelas." series={summary.studentsPerClass} />
            <DashboardSeriesCard title="Jumlah Pelanggaran Per Bulan" description="Jumlah catatan pelanggaran setiap bulan." series={summary.counselingPerMonth} />
          </div>
        </>
      ) : null}
    </section>
  );
}
