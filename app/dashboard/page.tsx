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
      <PageHeader title="Dashboard" description="Ringkasan data aplikasi BK diambil otomatis dari database sesuai indikator PRD, tanpa angka dummy permanen." />
      {loadError ? (
        <ErrorState description={loadError} />
      ) : summary ? (
        <>
          <DashboardMetricGrid metrics={summary.metrics} />
          <div className="grid gap-6 xl:grid-cols-3">
            <DashboardSeriesCard title="Jumlah Siswa Per Kelas" description="Distribusi jumlah siswa berdasarkan kelas." series={summary.studentsPerClass} />
            <DashboardSeriesCard title="Jumlah Konseling Per Bulan" description="Total catatan konseling per bulan dari data aktual." series={summary.counselingPerMonth} />
            <DashboardSeriesCard title="Jumlah Pendampingan Per Bulan" description="Akumulasi total pendampingan per bulan dari data aktual." series={summary.assistancePerMonth} />
          </div>
        </>
      ) : null}
    </section>
  );
}
