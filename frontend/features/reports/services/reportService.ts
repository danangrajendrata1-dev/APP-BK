import { SCHOOL_ATTENDANCE_STATUS_OPTIONS } from "@/lib/constants/options";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  buildSupabaseErrorMessage,
  isMissingSchemaError,
  logSupabaseError,
} from "@/lib/supabase/error";

import type {
  ChartItem,
  ReportRow,
  ReportSection,
  ReportsData,
  ReportsFilters,
} from "@/features/reports/types/report";

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
const REPORT_SECTION_ROW_LIMIT = 100;

function toMonthLabel(month: number) {
  return MONTH_LABELS[month - 1] ?? String(month);
}

function normalize(value: string | null | undefined) {
  return value ?? "";
}

function sortChartItems(items: ChartItem[]) {
  return [...items].sort((a, b) => b.value - a.value);
}

function buildTableRows<T extends ReportRow>(rows: T[]) {
  return rows;
}

function toIsoDate(value: Date) {
  return value.toISOString().slice(0, 10);
}

function getMonthPeriodsFromFilters(filters: ReportsFilters) {
  const currentYear = new Date().getFullYear();

  if (filters.month && filters.year) {
    return [
      {
        label: toMonthLabel(filters.month),
        start: `${filters.year}-${String(filters.month).padStart(2, "0")}-01`,
        end: toIsoDate(new Date(filters.year, filters.month, 0)),
      },
    ];
  }

  if (filters.semester && filters.year) {
    const year = filters.year;
    const startMonth = filters.semester === 1 ? 1 : 7;
    return Array.from({ length: 6 }, (_, index) => {
      const month = startMonth + index;
      return {
        label: toMonthLabel(month),
        start: `${year}-${String(month).padStart(2, "0")}-01`,
        end: toIsoDate(new Date(year, month, 0)),
      };
    });
  }

  if (filters.year) {
    const year = filters.year;
    return Array.from({ length: 12 }, (_, index) => {
      const month = index + 1;
      return {
        label: toMonthLabel(month),
        start: `${year}-${String(month).padStart(2, "0")}-01`,
        end: toIsoDate(new Date(year, month, 0)),
      };
    });
  }

  return Array.from({ length: 12 }, (_, index) => {
    const month = index + 1;
    return {
      label: toMonthLabel(month),
      start: `${currentYear}-${String(month).padStart(2, "0")}-01`,
      end: toIsoDate(new Date(currentYear, month, 0)),
    };
  });
}

function getDateRange(filters: ReportsFilters) {
  const year = filters.year ?? new Date().getFullYear();

  if (filters.month) {
    const start = `${year}-${String(filters.month).padStart(2, "0")}-01`;
    const end = new Date(year, filters.month, 0).toISOString().slice(0, 10);
    return { start, end };
  }

  if (filters.semester) {
    const startMonth = filters.semester === 1 ? 1 : 7;
    const endMonth = filters.semester === 1 ? 6 : 12;
    const start = `${year}-${String(startMonth).padStart(2, "0")}-01`;
    const end = new Date(year, endMonth, 0).toISOString().slice(0, 10);
    return { start, end };
  }

  if (filters.year) {
    return {
      start: `${filters.year}-01-01`,
      end: `${filters.year}-12-31`,
    };
  }

  return null;
}

export async function getReportsData(filters: ReportsFilters): Promise<ReportsData> {
  const supabase = await createSupabaseServerClient();
  const dateRange = getDateRange(filters);
  const classPattern = filters.className ? `%${filters.className}%` : null;
  const counselingMonthPeriods = getMonthPeriodsFromFilters(filters);
  const applyClassFilter = <T,>(query: T) =>
    classPattern && "ilike" in (query as object)
      ? (
          query as {
            ilike: (column: string, value: string) => T;
          }
        ).ilike("class_name", classPattern)
      : query;
  const applyDateFilter = <T,>(query: T, column: string) => {
    if (!dateRange || !("gte" in (query as object)) || !("lte" in (query as object))) {
      return query;
    }

    return (
      query as {
        gte: (field: string, value: string) => {
          lte: (field: string, value: string) => T;
        };
      }
    )
      .gte(column, dateRange.start)
      .lte(column, dateRange.end);
  };

  let attendanceQuery = supabase
    .from("school_attendance")
    .select("attendance_date, student_name, class_name, attendance_status, description");
  attendanceQuery = applyClassFilter(applyDateFilter(attendanceQuery, "attendance_date"));
  attendanceQuery = attendanceQuery
    .order("attendance_date", { ascending: false })
    .limit(REPORT_SECTION_ROW_LIMIT);

  let counselingQuery = supabase
    .from("violation_records")
    .select("violation_date, student_name, class_name, violation_code, description");
  counselingQuery = applyClassFilter(applyDateFilter(counselingQuery, "violation_date"));
  counselingQuery = counselingQuery
    .order("violation_date", { ascending: false })
    .limit(REPORT_SECTION_ROW_LIMIT);

  let classAssistanceQuery = supabase
    .from("class_assistances")
    .select("student_name, class_name, violation_type, action_form, remission, description, final_warning_letter");
  classAssistanceQuery = applyClassFilter(classAssistanceQuery);
  classAssistanceQuery = classAssistanceQuery
    .order("student_name", { ascending: true })
    .limit(REPORT_SECTION_ROW_LIMIT);

  let documentsQuery = supabase
    .from("bk_documents")
    .select("id, title, description, file_name, created_at");
  documentsQuery = applyDateFilter(documentsQuery, "created_at");
  documentsQuery = documentsQuery
    .order("created_at", { ascending: false })
    .limit(REPORT_SECTION_ROW_LIMIT);

  let studentsQuery = supabase
    .from("v_student_count_by_class")
    .select("class_name, total_students");
  studentsQuery = applyClassFilter(studentsQuery);

  let bkServiceAttendanceQuery = supabase
    .from("bk_service_attendance")
    .select("visit_date, student_name, class_name");
  bkServiceAttendanceQuery = applyClassFilter(
    applyDateFilter(bkServiceAttendanceQuery, "visit_date"),
  );

  let counselingStatsQuery = supabase
    .from("violation_records")
    .select("student_name, class_name");
  counselingStatsQuery = applyClassFilter(
    applyDateFilter(counselingStatsQuery, "violation_date"),
  );

  let classAssistanceStatsQuery = supabase
    .from("class_assistances")
    .select("violation_type");
  classAssistanceStatsQuery = applyClassFilter(classAssistanceStatsQuery);

  let attendanceCountQuery = supabase
    .from("school_attendance")
    .select("id", { count: "exact", head: true });
  attendanceCountQuery = applyClassFilter(
    applyDateFilter(attendanceCountQuery, "attendance_date"),
  );

  let counselingCountQuery = supabase
    .from("violation_records")
    .select("id", { count: "exact", head: true });
  counselingCountQuery = applyClassFilter(
    applyDateFilter(counselingCountQuery, "violation_date"),
  );

  let classAssistanceCountQuery = supabase
    .from("class_assistances")
    .select("id", { count: "exact", head: true });
  classAssistanceCountQuery = applyClassFilter(classAssistanceCountQuery);

  let parentCallCountQuery = supabase
    .from("bk_documents")
    .select("id", { count: "exact", head: true });
  parentCallCountQuery = applyDateFilter(parentCallCountQuery, "created_at");

  const [
    attendanceResult,
    counselingResult,
    classAssistanceResult,
    documentsResult,
    studentsResult,
    bkServiceAttendanceResult,
    counselingStatsResult,
    classAssistanceStatsResult,
    attendanceCountResult,
    counselingCountResult,
    classAssistanceCountResult,
    parentCallCountResult,
    attendanceStatusCountResults,
    counselingPerMonthCountResults,
  ] = await Promise.all([
    attendanceQuery,
    counselingQuery,
    classAssistanceQuery,
    documentsQuery,
    studentsQuery,
    bkServiceAttendanceQuery,
    counselingStatsQuery,
    classAssistanceStatsQuery,
    attendanceCountQuery,
    counselingCountQuery,
    classAssistanceCountQuery,
    parentCallCountQuery,
    Promise.all(
      SCHOOL_ATTENDANCE_STATUS_OPTIONS.map((option) => {
        let statusCountQuery = supabase
          .from("school_attendance")
          .select("id", { count: "exact", head: true });
        statusCountQuery = applyClassFilter(
          applyDateFilter(statusCountQuery, "attendance_date"),
        );
        return statusCountQuery.eq("attendance_status", option.value);
      }),
    ),
    Promise.all(
      counselingMonthPeriods.map((period) => {
        let counselingMonthCountQuery = supabase
          .from("violation_records")
          .select("id", { count: "exact", head: true });
        counselingMonthCountQuery = applyClassFilter(counselingMonthCountQuery);
        return counselingMonthCountQuery
          .gte("violation_date", period.start)
          .lte("violation_date", period.end);
      }),
    ),
  ]);

  if (attendanceResult.error) logSupabaseError("[Reports] school_attendance list", attendanceResult.error, { filters, dateRange });
if (counselingResult.error) logSupabaseError("[Reports] violation_records list", counselingResult.error, { filters, dateRange });
if (classAssistanceResult.error) logSupabaseError("[Reports] class_assistances list", classAssistanceResult.error, { filters });
if (documentsResult.error) logSupabaseError("[Reports] bk_documents list", documentsResult.error, { filters, dateRange });
if (studentsResult.error) logSupabaseError("[Reports] v_student_count_by_class", studentsResult.error, { filters });
if (bkServiceAttendanceResult.error) logSupabaseError("[Reports] bk_service_attendance", bkServiceAttendanceResult.error, { filters, dateRange });
if (counselingStatsResult.error) logSupabaseError("[Reports] violation_records stats", counselingStatsResult.error, { filters, dateRange });
if (classAssistanceStatsResult.error) logSupabaseError("[Reports] class_assistances stats", classAssistanceStatsResult.error, { filters });
if (attendanceCountResult.error) logSupabaseError("[Reports] school_attendance count", attendanceCountResult.error, { filters, dateRange });
if (counselingCountResult.error) logSupabaseError("[Reports] violation_records count", counselingCountResult.error, { filters, dateRange });
if (classAssistanceCountResult.error) logSupabaseError("[Reports] class_assistances count", classAssistanceCountResult.error, { filters });
if (parentCallCountResult.error) logSupabaseError("[Reports] bk_documents count", parentCallCountResult.error, { filters, dateRange });
  attendanceStatusCountResults.forEach((result, index) => {
    if (result.error) {
      logSupabaseError("[Reports] school_attendance status count", result.error, {
        status: SCHOOL_ATTENDANCE_STATUS_OPTIONS[index]?.value ?? null,
        filters,
        dateRange,
      });
    }
  });
  counselingPerMonthCountResults.forEach((result, index) => {
    if (result.error) {
      logSupabaseError("[Reports] violation_records month count", result.error, {
        period: counselingMonthPeriods[index],
        filters,
      });
    }
  });

  const classAssistanceListMissingSchema = isMissingSchemaError(
    classAssistanceResult.error,
  );
  const classAssistanceStatsMissingSchema = isMissingSchemaError(
    classAssistanceStatsResult.error,
  );
  const classAssistanceCountMissingSchema = isMissingSchemaError(
    classAssistanceCountResult.error,
  );

  if (
    attendanceResult.error ||
    counselingResult.error ||
    (classAssistanceResult.error && !classAssistanceListMissingSchema) ||
    documentsResult.error ||
    studentsResult.error ||
    bkServiceAttendanceResult.error ||
    counselingStatsResult.error ||
    (classAssistanceStatsResult.error && !classAssistanceStatsMissingSchema) ||
    attendanceCountResult.error ||
    counselingCountResult.error ||
    (classAssistanceCountResult.error && !classAssistanceCountMissingSchema) ||
    parentCallCountResult.error ||
    attendanceStatusCountResults.some((result) => result.error) ||
    counselingPerMonthCountResults.some((result) => result.error)
  ) {
    const firstError =
      attendanceResult.error ??
      counselingResult.error ??
      (classAssistanceResult.error && !classAssistanceListMissingSchema
        ? classAssistanceResult.error
        : null) ??
      documentsResult.error ??
      studentsResult.error ??
      bkServiceAttendanceResult.error ??
      counselingStatsResult.error ??
      (classAssistanceStatsResult.error && !classAssistanceStatsMissingSchema
        ? classAssistanceStatsResult.error
        : null) ??
      attendanceCountResult.error ??
      counselingCountResult.error ??
      (classAssistanceCountResult.error && !classAssistanceCountMissingSchema
        ? classAssistanceCountResult.error
        : null) ??
      parentCallCountResult.error ??
      attendanceStatusCountResults.find((result) => result.error)?.error ??
      counselingPerMonthCountResults.find((result) => result.error)?.error ??
      null;

    throw new Error(
      buildSupabaseErrorMessage("Gagal memuat laporan dan statistik", firstError),
    );
  }

  const attendanceRowsSource = (attendanceResult.data ?? []) as Array<{
    attendance_date: string;
    student_name: string;
    class_name: string;
    attendance_status: string;
    description: string | null;
  }>;
  const counselingRowsSource = (counselingResult.data ?? []) as Array<{
    violation_date: string;
    student_name: string;
    class_name: string;
    violation_code: string | null;
    description: string | null;
  }>;
  const documentsRowsSource = (documentsResult.data ?? []) as Array<{
    id: string;
    title: string;
    description: string | null;
    file_name: string;
    created_at: string;
  }>;
  const bkServiceAttendanceRowsSource = (bkServiceAttendanceResult.data ?? []) as Array<{
    student_name: string;
    class_name: string;
    visit_date: string;
  }>;
  const counselingStatsRowsSource = (counselingStatsResult.data ?? []) as Array<{
    student_name: string;
    class_name: string;
    violation_date: string;
  }>;
  const classAssistanceRowsSource = (classAssistanceResult.data ?? []) as Array<{
    student_name: string;
    class_name: string;
    violation_type: string | null;
    action_form: string | null;
    remission: string | null;
    description: string | null;
    final_warning_letter: string | null;
  }>;
  const classAssistanceStatsRowsSource = (classAssistanceStatsResult.data ?? []) as Array<{
    violation_type: string | null;
  }>;

  const attendanceRows = attendanceRowsSource.map((row) => ({
    Tanggal: row.attendance_date,
    "Nama Siswa": row.student_name,
    Kelas: row.class_name,
    Status: row.attendance_status,
    Keterangan: normalize(row.description),
  }));

  const counselingRows = counselingRowsSource.map((row) => ({
    Tanggal: row.violation_date,
    "Nama Siswa": row.student_name,
    Kelas: row.class_name,
    "Kode Pelanggaran": normalize(row.violation_code),
    Keterangan: normalize(row.description),
  }));

  const parentCallRows = documentsRowsSource.map((row) => ({
    Tanggal: row.created_at,
    "Nama Dokumen": row.title,
    "Nama File": row.file_name,
    Keterangan: normalize(row.description),
  }));

  const classAssistanceRows = classAssistanceRowsSource.map((row) => ({
    "Nama Siswa": row.student_name,
    Kelas: row.class_name,
    "Jenis Pelanggaran": normalize(row.violation_type),
    "Bentuk Tindakan": normalize(row.action_form),
    Remisi: normalize(row.remission),
    Keterangan: normalize(row.description),
    "SP Akhir": normalize(row.final_warning_letter),
  }));

  const classSummaryRows = ((studentsResult.data ?? []) as Array<{
    class_name: string | null;
    total_students: number | null;
  }>).map((row) => ({
    Kelas: row.class_name ?? "Tanpa Kelas",
    "Jumlah Siswa": row.total_students ?? 0,
  }));

  const attendanceTotal = attendanceCountResult.count ?? 0;
  const counselingTotal = counselingCountResult.count ?? 0;
  const classAssistanceTotal = classAssistanceCountResult.count ?? 0;
  const parentCallTotal = parentCallCountResult.count ?? 0;

  const semesterRows = [
    {
      Semester: filters.semester ? `Semester ${filters.semester}` : "Semua Semester",
      Tahun: filters.year ?? "Semua Tahun",
      "Kehadiran Sekolah": attendanceTotal,
      Pelanggaran: counselingTotal,
      "Rekap Pelanggaran Kelas": classAssistanceTotal,
      "Surat & Dokumen": parentCallTotal,
    },
  ];

  const yearlyRows = [
    {
      Tahun: filters.year ?? "Semua Tahun",
      "Kehadiran Sekolah": attendanceTotal,
      Pelanggaran: counselingTotal,
      "Rekap Pelanggaran Kelas": classAssistanceTotal,
      "Surat & Dokumen": parentCallTotal,
    },
  ];

  const studentsMostServedMap = new Map<string, number>();
  bkServiceAttendanceRowsSource.forEach((row) => {
    studentsMostServedMap.set(row.student_name, (studentsMostServedMap.get(row.student_name) ?? 0) + 1);
  });
  counselingStatsRowsSource.forEach((row) => {
    studentsMostServedMap.set(row.student_name, (studentsMostServedMap.get(row.student_name) ?? 0) + 1);
  });
  classAssistanceRowsSource.forEach((row) => {
    studentsMostServedMap.set(row.student_name, (studentsMostServedMap.get(row.student_name) ?? 0) + 1);
  });

  const attendanceByStatusMap = new Map<string, number>();
  SCHOOL_ATTENDANCE_STATUS_OPTIONS.forEach((option, index) => {
    const count = attendanceStatusCountResults[index]?.count ?? 0;
    if (count > 0) {
      attendanceByStatusMap.set(option.value, count);
    }
  });

  const topViolationTypesMap = new Map<string, number>();
  classAssistanceStatsRowsSource.forEach((row) => {
    const violationType = normalize(row.violation_type);
    if (violationType) {
      topViolationTypesMap.set(violationType, (topViolationTypesMap.get(violationType) ?? 0) + 1);
    }
  });

  const classesMostServedMap = new Map<string, number>();
  bkServiceAttendanceRowsSource.forEach((row) => {
    classesMostServedMap.set(row.class_name, (classesMostServedMap.get(row.class_name) ?? 0) + 1);
  });
  counselingStatsRowsSource.forEach((row) => {
    classesMostServedMap.set(row.class_name, (classesMostServedMap.get(row.class_name) ?? 0) + 1);
  });
  classAssistanceRowsSource.forEach((row) => {
    classesMostServedMap.set(row.class_name, (classesMostServedMap.get(row.class_name) ?? 0) + 1);
  });

  const reportSections: ReportSection[] = [
    {
      title: "Rekap Kehadiran Sekolah",
      description: `Data kehadiran siswa berdasarkan daftar hadir sekolah. Menampilkan maksimal ${REPORT_SECTION_ROW_LIMIT} baris terbaru.`,
      columns: ["Tanggal", "Nama Siswa", "Kelas", "Status", "Keterangan"],
      rows: buildTableRows(attendanceRows),
    },
    {
      title: "Rekap Pelanggaran",
      description: `Ringkasan catatan pelanggaran siswa. Menampilkan maksimal ${REPORT_SECTION_ROW_LIMIT} baris terbaru.`,
      columns: ["Tanggal", "Nama Siswa", "Kelas", "Kode Pelanggaran", "Keterangan"],
      rows: buildTableRows(counselingRows),
    },
    {
      title: "Rekap Pelanggaran Kelas",
      description: `Ringkasan pelanggaran per kelas. Menampilkan maksimal ${REPORT_SECTION_ROW_LIMIT} baris terbaru.`,
      columns: ["Nama Siswa", "Kelas", "Jenis Pelanggaran", "Bentuk Tindakan", "Remisi", "Keterangan", "SP Akhir"],
      rows: buildTableRows(classAssistanceRows),
    },
    {
      title: "Rekap Surat & Dokumen",
      description: `Daftar surat dan dokumen BK. Menampilkan maksimal ${REPORT_SECTION_ROW_LIMIT} baris terbaru.`,
      columns: ["Tanggal", "Nama Dokumen", "Nama File", "Keterangan"],
      rows: buildTableRows(parentCallRows),
    },
    {
      title: "Rekap Per Kelas",
      description: "Rekap jumlah siswa per kelas.",
      columns: ["Kelas", "Jumlah Siswa"],
      rows: buildTableRows(classSummaryRows),
    },
    {
      title: "Rekap Per Semester",
      description: "Ringkasan data berdasarkan semester.",
      columns: ["Semester", "Tahun", "Kehadiran Sekolah", "Pelanggaran", "Rekap Pelanggaran Kelas", "Surat & Dokumen"],
      rows: buildTableRows(semesterRows),
    },
    {
      title: "Rekap Per Tahun",
      description: "Ringkasan data berdasarkan tahun.",
      columns: ["Tahun", "Kehadiran Sekolah", "Pelanggaran", "Rekap Pelanggaran Kelas", "Surat & Dokumen"],
      rows: buildTableRows(yearlyRows),
    },
  ];

  return {
    filters,
    reportSections,
    charts: {
      counselingPerMonth: counselingMonthPeriods
        .map((period, index) => ({
          label: period.label,
          value: counselingPerMonthCountResults[index]?.count ?? 0,
        }))
        .filter((item) => item.value > 0),
      studentsMostServed: sortChartItems(
        [...studentsMostServedMap.entries()].map(([label, value]) => ({ label, value })),
      ).slice(0, 10),
      attendanceByStatus: sortChartItems(
        [...attendanceByStatusMap.entries()].map(([label, value]) => ({ label, value })),
      ),
      topViolationTypes: sortChartItems(
        [...topViolationTypesMap.entries()].map(([label, value]) => ({ label, value })),
      ).slice(0, 10),
      classesMostServed: sortChartItems(
        [...classesMostServedMap.entries()].map(([label, value]) => ({ label, value })),
      ).slice(0, 10),
    },
    summary: {
      attendanceRows: attendanceTotal,
      counselingRows: counselingTotal,
      classAssistanceRows: classAssistanceTotal,
      parentCallRows: parentCallTotal,
      classRows: classSummaryRows.length,
      semesterRows: semesterRows.length,
      yearlyRows: yearlyRows.length,
    },
  };
}
