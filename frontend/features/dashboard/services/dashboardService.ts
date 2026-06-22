import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  buildSupabaseErrorMessage,
  logSupabaseError,
} from "@/lib/supabase/error";

import type { DashboardSeriesItem, DashboardSummary } from "@/features/dashboard/types/dashboard";

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

function sortSeriesDescending(series: DashboardSeriesItem[]) {
  return [...series].sort((a, b) => b.value - a.value);
}

function getLastSixMonthPeriods(now: Date) {
  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    return {
      year,
      month,
      startDate: new Date(year, date.getMonth(), 1).toISOString().slice(0, 10),
      endDate: new Date(year, date.getMonth() + 1, 0).toISOString().slice(0, 10),
      label: MONTH_LABELS[date.getMonth()] ?? `${year}-${month}`,
    };
  });
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const supabase = await createSupabaseServerClient();
  const now = new Date();
  const monthPeriods = getLastSixMonthPeriods(now);

  const [
    studentsResult,
    studentsPerClassResult,
    counselingCountResults,
    documentsResult,
    confessionsResult,
  ] = await Promise.all([
    supabase.from("students").select("id", { count: "exact", head: true }).is("deleted_at", null),
    supabase
      .from("v_student_count_by_class")
      .select("class_name, total_students")
      .order("class_name", { ascending: true }),
    Promise.all(
      monthPeriods.map((period) =>
        supabase
          .from("violation_records")
          .select("id", { count: "exact", head: true })
          .gte("violation_date", period.startDate)
          .lte("violation_date", period.endDate),
      ),
    ),
    supabase.from("bk_documents").select("id", { count: "exact", head: true }),
    supabase.from("digital_confessions").select("id", { count: "exact", head: true }).is("deleted_at", null),
  ]);

  if (studentsResult.error) {
    logSupabaseError("[Dashboard] students count", studentsResult.error);
  }
  if (studentsPerClassResult.error) {
    logSupabaseError("[Dashboard] v_student_count_by_class", studentsPerClassResult.error);
  }
  counselingCountResults.forEach((result, index) => {
    if (result.error) {
      logSupabaseError("[Dashboard] violation_records count", result.error, {
        period: monthPeriods[index],
      });
    }
  });
  if (documentsResult.error) {
    logSupabaseError("[Dashboard] bk_documents count", documentsResult.error);
  }
  if (confessionsResult.error) {
    logSupabaseError("[Dashboard] digital_confessions count", confessionsResult.error);
  }

  if (
    studentsResult.error ||
    studentsPerClassResult.error ||
    counselingCountResults.some((result) => result.error) ||
    documentsResult.error ||
    confessionsResult.error
  ) {
    const firstError =
      studentsResult.error ??
      studentsPerClassResult.error ??
      counselingCountResults.find((result) => result.error)?.error ??
      documentsResult.error ??
      confessionsResult.error ??
      null;

    throw new Error(
      buildSupabaseErrorMessage("Gagal memuat ringkasan dashboard", firstError),
    );
  }

  const studentsPerClassRows = (studentsPerClassResult.data ?? []) as Array<{
    class_name: string | null;
    total_students: number | null;
  }>;

  const counselingPerMonth = monthPeriods
    .map((period, index) => ({
      label: period.label,
      value: counselingCountResults[index]?.count ?? 0,
    }))
    .filter((item) => item.value > 0);

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
        helper: "Data dari tabel bk_documents",
      },
      {
        label: "Jumlah Curhat Digital",
        value: confessionsResult.count ?? 0,
        helper: "Data dari tabel digital_confessions",
      },
    ],
    studentsPerClass: sortSeriesDescending(
      studentsPerClassRows.map((item) => ({
        label: item.class_name ?? "Tanpa Kelas",
        value: item.total_students ?? 0,
      })),
    ),
    counselingPerMonth,
  };
}
