import { createSupabaseServerClient } from "@/lib/supabase/server";

import type { DashboardSeriesItem, DashboardSummary } from "@/features/dashboard/types/dashboard";

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

function sortSeriesDescending(series: DashboardSeriesItem[]) {
  return [...series].sort((a, b) => b.value - a.value);
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const supabase = await createSupabaseServerClient();
  const now = new Date();
  const counselingStartDate = new Date(now.getFullYear(), now.getMonth() - 5, 1)
    .toISOString()
    .slice(0, 10);
  const assistanceStartMonth = now.getMonth() + 1 - 5;
  const assistanceStartYear =
    assistanceStartMonth > 0 ? now.getFullYear() : now.getFullYear() - 1;
  const normalizedAssistanceStartMonth =
    assistanceStartMonth > 0 ? assistanceStartMonth : assistanceStartMonth + 12;

  const [
    studentsResult,
    studentsPerClassResult,
    counselingResult,
    assistanceResult,
    documentsResult,
    homeVisitsResult,
    confessionsResult,
  ] = await Promise.all([
    supabase.from("students").select("id", { count: "exact", head: true }),
    supabase.from("students").select("class_name"),
    supabase
      .from("counseling_records")
      .select("counseling_date")
      .gte("counseling_date", counselingStartDate),
    supabase
      .from("student_assistances")
      .select("assistance_month, assistance_year, total")
      .or(
        `assistance_year.gt.${assistanceStartYear},and(assistance_year.eq.${assistanceStartYear},assistance_month.gte.${normalizedAssistanceStartMonth})`,
      ),
    supabase.from("documents").select("id", { count: "exact", head: true }),
    supabase.from("home_visits").select("id", { count: "exact", head: true }),
    supabase.from("confession_box").select("id", { count: "exact", head: true }),
  ]);

  if (studentsResult.error || studentsPerClassResult.error || counselingResult.error || assistanceResult.error || documentsResult.error || homeVisitsResult.error || confessionsResult.error) {
    throw new Error("Gagal memuat ringkasan dashboard.");
  }

  const students = studentsPerClassResult.data ?? [];
  const counselingRecords = counselingResult.data ?? [];
  const assistances = assistanceResult.data ?? [];

  const studentsPerClassMap = new Map<string, number>();
  students.forEach((student) => {
    const key = student.class_name;
    studentsPerClassMap.set(key, (studentsPerClassMap.get(key) ?? 0) + 1);
  });

  const counselingPerMonthMap = new Map<string, number>();
  counselingRecords.forEach((record) => {
    const date = new Date(record.counseling_date);
    const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
    counselingPerMonthMap.set(key, (counselingPerMonthMap.get(key) ?? 0) + 1);
  });

  const assistancePerMonthMap = new Map<string, number>();
  assistances.forEach((record) => {
    const key = `${record.assistance_year}-${record.assistance_month}`;
    assistancePerMonthMap.set(key, (assistancePerMonthMap.get(key) ?? 0) + (record.total ?? 0));
  });

  const counselingPerMonth = [...counselingPerMonthMap.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-6)
    .map(([key, value]) => {
      const [, month] = key.split("-");
      return {
        label: MONTH_LABELS[Number(month) - 1] ?? key,
        value,
      };
    });

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
      [...studentsPerClassMap.entries()].map(([label, value]) => ({ label, value })),
    ),
    counselingPerMonth,
    assistancePerMonth,
  };
}
