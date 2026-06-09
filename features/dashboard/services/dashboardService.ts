import { createSupabaseServerClient } from "@/lib/supabase/server";

import type { DashboardSeriesItem, DashboardSummary } from "@/features/dashboard/types/dashboard";

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

function sortSeriesDescending(series: DashboardSeriesItem[]) {
  return [...series].sort((a, b) => b.value - a.value);
}

function toIsoDate(value: Date) {
  return value.toISOString().slice(0, 10);
}

function buildAssistanceMonthRangeFilter(
  startYear: number,
  startMonth: number,
  endYear: number,
  endMonth: number,
) {
  if (startYear === endYear) {
    return `and(assistance_year.eq.${startYear},assistance_month.gte.${startMonth},assistance_month.lte.${endMonth})`;
  }

  const filters = [
    `and(assistance_year.eq.${startYear},assistance_month.gte.${startMonth})`,
    `and(assistance_year.eq.${endYear},assistance_month.lte.${endMonth})`,
  ];

  if (endYear - startYear > 1) {
    filters.splice(1, 0, `and(assistance_year.gt.${startYear},assistance_year.lt.${endYear})`);
  }

  return `or(${filters.join(",")})`;
}

function getLastSixMonthPeriods(now: Date) {
  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    return {
      year,
      month,
      startDate: toIsoDate(new Date(year, date.getMonth(), 1)),
      endDate: toIsoDate(new Date(year, date.getMonth() + 1, 0)),
      label: MONTH_LABELS[date.getMonth()] ?? `${year}-${month}`,
    };
  });
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const supabase = await createSupabaseServerClient();
  const now = new Date();
  const monthPeriods = getLastSixMonthPeriods(now);
  const assistanceStartDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const assistanceStartYear = assistanceStartDate.getFullYear();
  const assistanceStartMonth = assistanceStartDate.getMonth() + 1;
  const assistanceEndYear = now.getFullYear();
  const assistanceEndMonth = now.getMonth() + 1;
  const assistanceRangeFilter = buildAssistanceMonthRangeFilter(
    assistanceStartYear,
    assistanceStartMonth,
    assistanceEndYear,
    assistanceEndMonth,
  );

  const [
    studentsResult,
    studentsPerClassResult,
    counselingCountResults,
    assistanceResult,
    documentsResult,
    homeVisitsResult,
    confessionsResult,
  ] = await Promise.all([
    supabase.from("students").select("id", { count: "exact", head: true }),
    supabase
      .from("v_student_count_by_class")
      .select("class_name, total_students")
      .order("class_name", { ascending: true }),
    Promise.all(
      monthPeriods.map((period) =>
        supabase
          .from("counseling_records")
          .select("id", { count: "exact", head: true })
          .gte("counseling_date", period.startDate)
          .lte("counseling_date", period.endDate),
      ),
    ),
    supabase
      .from("student_assistances")
      .select("assistance_month, assistance_year, total")
      // TODO: Tahap berikutnya pindahkan agregasi assistance per month ke SQL view/RPC
      // agar dashboard tidak perlu mengambil semua baris dalam rentang bulan lalu menjumlahkannya di aplikasi.
      .or(assistanceRangeFilter),
    supabase.from("documents").select("id", { count: "exact", head: true }),
    supabase.from("home_visits").select("id", { count: "exact", head: true }),
    supabase.from("confession_box").select("id", { count: "exact", head: true }),
  ]);

  if (
    studentsResult.error ||
    studentsPerClassResult.error ||
    counselingCountResults.some((result) => result.error) ||
    assistanceResult.error ||
    documentsResult.error ||
    homeVisitsResult.error ||
    confessionsResult.error
  ) {
    throw new Error("Gagal memuat ringkasan dashboard.");
  }

  const studentsPerClassRows = (studentsPerClassResult.data ?? []) as Array<{
    class_name: string | null;
    total_students: number | null;
  }>;
  const assistances = assistanceResult.data ?? [];

  const assistancePerMonthMap = new Map<string, number>();
  assistances.forEach((record) => {
    const key = `${record.assistance_year}-${record.assistance_month}`;
    assistancePerMonthMap.set(key, (assistancePerMonthMap.get(key) ?? 0) + (record.total ?? 0));
  });

  const counselingPerMonth = monthPeriods
    .map((period, index) => ({
      label: period.label,
      value: counselingCountResults[index]?.count ?? 0,
    }))
    .filter((item) => item.value > 0);

  const assistancePerMonth = [...assistancePerMonthMap.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-6)
    .map(([key, value]) => {
      const [, month] = key.split("-");
      return {
        label: MONTH_LABELS[Number(month) - 1] ?? key,
        value,
      };
    });

  return {
    metrics: [
      {
        label: "Jumlah Siswa",
        value: studentsResult.count ?? 0,
        helper: "Data dari tabel students",
      },
      {
        label: "Jumlah Surat Terbit",
        value: documentsResult.count ?? 0,
        helper: "Data dari tabel documents",
      },
      {
        label: "Jumlah Home Visit",
        value: homeVisitsResult.count ?? 0,
        helper: "Data dari tabel home_visits",
      },
      {
        label: "Jumlah Curhat Digital",
        value: confessionsResult.count ?? 0,
        helper: "Data dari tabel confession_box",
      },
    ],
    studentsPerClass: sortSeriesDescending(
      studentsPerClassRows.map((item) => ({
        label: item.class_name ?? "Tanpa Kelas",
        value: item.total_students ?? 0,
      })),
    ),
    counselingPerMonth,
    assistancePerMonth,
  };
}
