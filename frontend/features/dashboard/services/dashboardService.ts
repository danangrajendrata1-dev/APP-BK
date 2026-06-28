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
  const minDate = monthPeriods[monthPeriods.length - 1]?.startDate ?? "";
  const maxDate = monthPeriods[0]?.endDate ?? "";

  const [
    studentsResult,
    studentsPerClassResult,
    counselingRecordsResult,
    documentsResult,
    confessionsResult,
  ] = await Promise.all([
    supabase.from("students").select("id", { count: "exact", head: true }).is("deleted_at", null),
    supabase
      .from("v_student_count_by_class")
      .select("class_name, total_students")
      .order("class_name", { ascending: true }),
    supabase
      .from("violation_records")
      .select("violation_date")
      .gte("violation_date", minDate)
      .lte("violation_date", maxDate),
    supabase.from("bk_documents").select("id", { count: "exact", head: true }),
    supabase.from("digital_confessions").select("id", { count: "exact", head: true }).is("deleted_at", null),
  ]);

  if (studentsResult.error) {
    logSupabaseError("[Dashboard] students count", studentsResult.error);
  }
  if (studentsPerClassResult.error) {
    logSupabaseError("[Dashboard] v_student_count_by_class", studentsPerClassResult.error);
  }
  if (counselingRecordsResult.error) {
    logSupabaseError("[Dashboard] violation_records fetch", counselingRecordsResult.error);
  }
  if (documentsResult.error) {
    logSupabaseError("[Dashboard] bk_documents count", documentsResult.error);
  }
  if (confessionsResult.error) {
    logSupabaseError("[Dashboard] digital_confessions count", confessionsResult.error);
  }

  if (
    studentsResult.error ||
    studentsPerClassResult.error ||
    counselingRecordsResult.error ||
    documentsResult.error ||
    confessionsResult.error
  ) {
    const firstError =
      studentsResult.error ??
      studentsPerClassResult.error ??
      counselingRecordsResult.error ??
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
  
  const violationDates = (counselingRecordsResult.data ?? []) as Array<{ violation_date: string }>;
  const monthCounts = new Map<string, number>();
  
  violationDates.forEach((row) => {
    // violation_date is YYYY-MM-DD
    const prefix = row.violation_date.substring(0, 7); // YYYY-MM
    monthCounts.set(prefix, (monthCounts.get(prefix) ?? 0) + 1);
  });

  const counselingPerMonth = monthPeriods
    .map((period) => {
      const prefix = `${period.year}-${String(period.month).padStart(2, "0")}`;
      return {
        label: period.label,
        value: monthCounts.get(prefix) ?? 0,
      };
    })
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
