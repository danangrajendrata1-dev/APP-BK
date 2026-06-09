import { ASSESSMENT_TYPE_OPTIONS } from "@/lib/constants/options";
import { SCHOOL_ATTENDANCE_STATUS_OPTIONS } from "@/lib/constants/options";
import { createSupabaseServerClient } from "@/lib/supabase/server";

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
  const parentCallPattern = "%Panggilan Orang Tua%";
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
    .select("attendance_date, student_name, class_name, status, description");
  attendanceQuery = applyClassFilter(applyDateFilter(attendanceQuery, "attendance_date"));
  attendanceQuery = attendanceQuery
    .order("attendance_date", { ascending: false })
    .limit(REPORT_SECTION_ROW_LIMIT);

  let counselingQuery = supabase
    .from("counseling_records")
    .select("counseling_date, student_name, class_name, meeting_number, media, counseling_type, topic, counseling_result, follow_up, description");
  counselingQuery = applyClassFilter(applyDateFilter(counselingQuery, "counseling_date"));
  counselingQuery = counselingQuery
    .order("counseling_date", { ascending: false })
    .limit(REPORT_SECTION_ROW_LIMIT);

  let studentAssistanceQuery = supabase
    .from("student_assistances")
    .select("assistance_month, assistance_year, student_name, class_name, total, description, day_1, day_2, day_3, day_4, day_5, day_6, day_7, day_8, day_9, day_10, day_11, day_12, day_13, day_14, day_15, day_16, day_17, day_18, day_19, day_20, day_21, day_22, day_23, day_24, day_25, day_26, day_27, day_28, day_29, day_30, day_31");
  if (classPattern) {
    studentAssistanceQuery = studentAssistanceQuery.ilike("class_name", classPattern);
  }
  if (filters.year) {
    studentAssistanceQuery = studentAssistanceQuery.eq("assistance_year", filters.year);
  }
  if (filters.month) {
    studentAssistanceQuery = studentAssistanceQuery.eq("assistance_month", filters.month);
  } else if (filters.semester) {
    studentAssistanceQuery =
      filters.semester === 1
        ? studentAssistanceQuery.lte("assistance_month", 6)
        : studentAssistanceQuery.gte("assistance_month", 7);
  }
  studentAssistanceQuery = studentAssistanceQuery
    .order("assistance_year", { ascending: false })
    .order("assistance_month", { ascending: false })
    .order("student_name", { ascending: true })
    .limit(REPORT_SECTION_ROW_LIMIT);

  let classAssistanceQuery = supabase
    .from("class_assistances")
    .select("student_name, class_name, violation_type, action_form, remission, description, final_warning_letter");
  classAssistanceQuery = applyClassFilter(classAssistanceQuery);
  classAssistanceQuery = classAssistanceQuery
    .order("student_name", { ascending: true })
    .limit(REPORT_SECTION_ROW_LIMIT);

  let documentsQuery = supabase
    .from("documents")
    .select("document_date, student_name, class_name, document_type, letter_number, description");
  documentsQuery = applyClassFilter(applyDateFilter(documentsQuery, "document_date"));
  documentsQuery = documentsQuery
    .ilike("document_type", parentCallPattern)
    .order("document_date", { ascending: false })
    .limit(REPORT_SECTION_ROW_LIMIT);

  let homeVisitsQuery = supabase
    .from("home_visits")
    .select("visit_date, student_name, class_name, parent_name, address, visit_result, follow_up");
  homeVisitsQuery = applyClassFilter(applyDateFilter(homeVisitsQuery, "visit_date"));
  homeVisitsQuery = homeVisitsQuery
    .order("visit_date", { ascending: false })
    .limit(REPORT_SECTION_ROW_LIMIT);

  let studentsQuery = supabase.from("students").select("full_name, class_name, major");
  studentsQuery = applyClassFilter(studentsQuery);

  let bkServiceAttendanceQuery = supabase
    .from("bk_service_attendance")
    .select("service_date, student_name, class_name");
  bkServiceAttendanceQuery = applyClassFilter(
    applyDateFilter(bkServiceAttendanceQuery, "service_date"),
  );

  let counselingStatsQuery = supabase
    .from("counseling_records")
    .select("student_name, class_name");
  counselingStatsQuery = applyClassFilter(
    applyDateFilter(counselingStatsQuery, "counseling_date"),
  );

  let studentAssistanceStatsQuery = supabase
    .from("student_assistances")
    .select("student_name, total, day_1, day_2, day_3, day_4, day_5, day_6, day_7, day_8, day_9, day_10, day_11, day_12, day_13, day_14, day_15, day_16, day_17, day_18, day_19, day_20, day_21, day_22, day_23, day_24, day_25, day_26, day_27, day_28, day_29, day_30, day_31");
  if (classPattern) {
    studentAssistanceStatsQuery = studentAssistanceStatsQuery.ilike("class_name", classPattern);
  }
  if (filters.year) {
    studentAssistanceStatsQuery = studentAssistanceStatsQuery.eq("assistance_year", filters.year);
  }
  if (filters.month) {
    studentAssistanceStatsQuery = studentAssistanceStatsQuery.eq("assistance_month", filters.month);
  } else if (filters.semester) {
    studentAssistanceStatsQuery =
      filters.semester === 1
        ? studentAssistanceStatsQuery.lte("assistance_month", 6)
        : studentAssistanceStatsQuery.gte("assistance_month", 7);
  }

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
    .from("counseling_records")
    .select("id", { count: "exact", head: true });
  counselingCountQuery = applyClassFilter(
    applyDateFilter(counselingCountQuery, "counseling_date"),
  );

  let studentAssistanceCountQuery = supabase
    .from("student_assistances")
    .select("id", { count: "exact", head: true });
  if (classPattern) {
    studentAssistanceCountQuery = studentAssistanceCountQuery.ilike("class_name", classPattern);
  }
  if (filters.year) {
    studentAssistanceCountQuery = studentAssistanceCountQuery.eq("assistance_year", filters.year);
  }
  if (filters.month) {
    studentAssistanceCountQuery = studentAssistanceCountQuery.eq("assistance_month", filters.month);
  } else if (filters.semester) {
    studentAssistanceCountQuery =
      filters.semester === 1
        ? studentAssistanceCountQuery.lte("assistance_month", 6)
        : studentAssistanceCountQuery.gte("assistance_month", 7);
  }

  let classAssistanceCountQuery = supabase
    .from("class_assistances")
    .select("id", { count: "exact", head: true });
  classAssistanceCountQuery = applyClassFilter(classAssistanceCountQuery);

  let parentCallCountQuery = supabase
    .from("documents")
    .select("id", { count: "exact", head: true });
  parentCallCountQuery = applyClassFilter(
    applyDateFilter(parentCallCountQuery, "document_date"),
  ).ilike("document_type", parentCallPattern);

  let homeVisitsCountQuery = supabase
    .from("home_visits")
    .select("id", { count: "exact", head: true });
  homeVisitsCountQuery = applyClassFilter(
    applyDateFilter(homeVisitsCountQuery, "visit_date"),
  );

  const [
    attendanceResult,
    counselingResult,
    studentAssistanceResult,
    classAssistanceResult,
    documentsResult,
    homeVisitsResult,
    studentsResult,
    bkServiceAttendanceResult,
    assessmentFilesResult,
    counselingStatsResult,
    studentAssistanceStatsResult,
    classAssistanceStatsResult,
    attendanceCountResult,
    counselingCountResult,
    studentAssistanceCountResult,
    classAssistanceCountResult,
    parentCallCountResult,
    homeVisitsCountResult,
    attendanceStatusCountResults,
    counselingPerMonthCountResults,
  ] = await Promise.all([
    attendanceQuery,
    counselingQuery,
    studentAssistanceQuery,
    classAssistanceQuery,
    documentsQuery,
    homeVisitsQuery,
    studentsQuery,
    bkServiceAttendanceQuery,
    supabase.from("assessment_files").select("assessment_type"),
    counselingStatsQuery,
    studentAssistanceStatsQuery,
    classAssistanceStatsQuery,
    attendanceCountQuery,
    counselingCountQuery,
    studentAssistanceCountQuery,
    classAssistanceCountQuery,
    parentCallCountQuery,
    homeVisitsCountQuery,
    Promise.all(
      SCHOOL_ATTENDANCE_STATUS_OPTIONS.map((option) => {
        let statusCountQuery = supabase
          .from("school_attendance")
          .select("id", { count: "exact", head: true });
        statusCountQuery = applyClassFilter(
          applyDateFilter(statusCountQuery, "attendance_date"),
        );
        return statusCountQuery.eq("status", option.value);
      }),
    ),
    Promise.all(
      counselingMonthPeriods.map((period) => {
        let counselingMonthCountQuery = supabase
          .from("counseling_records")
          .select("id", { count: "exact", head: true });
        counselingMonthCountQuery = applyClassFilter(counselingMonthCountQuery);
        return counselingMonthCountQuery
          .gte("counseling_date", period.start)
          .lte("counseling_date", period.end);
      }),
    ),
  ]);

  if (
    attendanceResult.error ||
    counselingResult.error ||
    studentAssistanceResult.error ||
    classAssistanceResult.error ||
    documentsResult.error ||
    homeVisitsResult.error ||
    studentsResult.error ||
    bkServiceAttendanceResult.error ||
    assessmentFilesResult.error ||
    counselingStatsResult.error ||
    studentAssistanceStatsResult.error ||
    classAssistanceStatsResult.error ||
    attendanceCountResult.error ||
    counselingCountResult.error ||
    studentAssistanceCountResult.error ||
    classAssistanceCountResult.error ||
    parentCallCountResult.error ||
    homeVisitsCountResult.error ||
    attendanceStatusCountResults.some((result) => result.error) ||
    counselingPerMonthCountResults.some((result) => result.error)
  ) {
    throw new Error("Gagal memuat laporan dan statistik.");
  }

  const attendanceRows = (attendanceResult.data ?? [])
    .map((row) => ({
      Tanggal: row.attendance_date,
      "Nama Siswa": row.student_name,
      Kelas: row.class_name,
      Status: row.status,
      Keterangan: normalize(row.description),
    }));

  const counselingRows = (counselingResult.data ?? [])
    .map((row) => ({
      Tanggal: row.counseling_date,
      "Nama Siswa": row.student_name,
      Kelas: row.class_name,
      "Pertemuan Ke-": row.meeting_number ?? "-",
      Media: row.media,
      "Jenis Konseling": row.counseling_type,
      Topik: normalize(row.topic),
      "Hasil Konseling": normalize(row.counseling_result),
      "Tindak Lanjut": normalize(row.follow_up),
      Keterangan: normalize(row.description),
    }));

  const studentAssistanceRows = (studentAssistanceResult.data ?? [])
    .map((row) => ({
      Bulan: `${toMonthLabel(row.assistance_month)} ${row.assistance_year}`,
      "Nama Siswa": row.student_name,
      Kelas: row.class_name,
      Jumlah: row.total,
      Keterangan: normalize(row.description),
    }));

  const parentCallRows = (documentsResult.data ?? [])
    .map((row) => ({
      Tanggal: row.document_date,
      "Nomor Surat": row.letter_number,
      "Nama Siswa": row.student_name,
      Kelas: normalize(row.class_name),
      "Jenis Surat": row.document_type,
      Keterangan: normalize(row.description),
    }));

  const homeVisitRows = (homeVisitsResult.data ?? [])
    .map((row) => ({
      Tanggal: row.visit_date,
      "Nama Siswa": row.student_name,
      "Nama Orang Tua/Wali": normalize(row.parent_name),
      Kelas: row.class_name,
      Alamat: normalize(row.address),
      "Hasil Kunjungan": normalize(row.visit_result),
      "Tindak Lanjut": normalize(row.follow_up),
    }));

  const classSummaryMap = new Map<string, number>();
  (studentsResult.data ?? []).forEach((row) => {
    classSummaryMap.set(row.class_name, (classSummaryMap.get(row.class_name) ?? 0) + 1);
  });
  const classSummaryRows = [...classSummaryMap.entries()].map(([className, totalStudents]) => ({
    Kelas: className,
    "Jumlah Siswa": totalStudents,
  }));

  const attendanceTotal = attendanceCountResult.count ?? 0;
  const counselingTotal = counselingCountResult.count ?? 0;
  const studentAssistanceTotal = studentAssistanceCountResult.count ?? 0;
  const classAssistanceTotal = classAssistanceCountResult.count ?? 0;
  const parentCallTotal = parentCallCountResult.count ?? 0;
  const homeVisitTotal = homeVisitsCountResult.count ?? 0;

  const semesterRows = [
    {
      Semester: filters.semester ? `Semester ${filters.semester}` : "Semua Semester",
      Tahun: filters.year ?? "Semua Tahun",
      "Kehadiran Sekolah": attendanceTotal,
      Konseling: counselingTotal,
      Pendampingan: studentAssistanceTotal + classAssistanceTotal,
      "Pemanggilan Orang Tua": parentCallTotal,
      "Home Visit": homeVisitTotal,
    },
  ];

  const yearlyRows = [
    {
      Tahun: filters.year ?? "Semua Tahun",
      "Kehadiran Sekolah": attendanceTotal,
      Konseling: counselingTotal,
      Pendampingan: studentAssistanceTotal + classAssistanceTotal,
      "Pemanggilan Orang Tua": parentCallTotal,
      "Home Visit": homeVisitTotal,
    },
  ];

  const studentsMostServedMap = new Map<string, number>();
  (bkServiceAttendanceResult.data ?? []).forEach((row) => {
    studentsMostServedMap.set(row.student_name, (studentsMostServedMap.get(row.student_name) ?? 0) + 1);
  });
  (counselingStatsResult.data ?? []).forEach((row) => {
    studentsMostServedMap.set(row.student_name, (studentsMostServedMap.get(row.student_name) ?? 0) + 1);
  });
  (studentAssistanceStatsResult.data ?? []).forEach((row) => {
    studentsMostServedMap.set(row.student_name, (studentsMostServedMap.get(row.student_name) ?? 0) + (row.total ?? 0));
  });

  const attendanceByStatusMap = new Map<string, number>();
  SCHOOL_ATTENDANCE_STATUS_OPTIONS.forEach((option, index) => {
    const count = attendanceStatusCountResults[index]?.count ?? 0;
    if (count > 0) {
      attendanceByStatusMap.set(option.value, count);
    }
  });

  const topAssistanceTopicsMap = new Map<string, number>();
  (studentAssistanceStatsResult.data ?? []).forEach((row) => {
    for (let day = 1; day <= 31; day += 1) {
      const key = row[`day_${day}` as keyof typeof row];
      if (typeof key === "string" && key) {
        topAssistanceTopicsMap.set(key, (topAssistanceTopicsMap.get(key) ?? 0) + 1);
      }
    }
  });
  (classAssistanceStatsResult.data ?? []).forEach((row) => {
    const violationType = normalize(row.violation_type);
    if (violationType) {
      topAssistanceTopicsMap.set(violationType, (topAssistanceTopicsMap.get(violationType) ?? 0) + 1);
    }
  });

  const classesMostServedMap = new Map<string, number>();
  (bkServiceAttendanceResult.data ?? []).forEach((row) => {
    classesMostServedMap.set(row.class_name, (classesMostServedMap.get(row.class_name) ?? 0) + 1);
  });
  (counselingStatsResult.data ?? []).forEach((row) => {
    classesMostServedMap.set(row.class_name, (classesMostServedMap.get(row.class_name) ?? 0) + 1);
  });

  const reportSections: ReportSection[] = [
    {
      title: "Rekap Kehadiran Sekolah",
      description: `Data kehadiran siswa berdasarkan presensi sekolah. Menampilkan maksimal ${REPORT_SECTION_ROW_LIMIT} baris terbaru.`,
      columns: ["Tanggal", "Nama Siswa", "Kelas", "Status", "Keterangan"],
      rows: buildTableRows(attendanceRows),
    },
    {
      title: "Rekap Konseling",
      description: `Ringkasan catatan layanan konseling. Menampilkan maksimal ${REPORT_SECTION_ROW_LIMIT} baris terbaru.`,
      columns: ["Tanggal", "Nama Siswa", "Kelas", "Pertemuan Ke-", "Media", "Jenis Konseling", "Topik", "Hasil Konseling", "Tindak Lanjut", "Keterangan"],
      rows: buildTableRows(counselingRows),
    },
    {
      title: "Rekap Pendampingan",
      description: `Gabungan pendampingan bulanan dan pendampingan per kelas. Menampilkan maksimal ${REPORT_SECTION_ROW_LIMIT} baris terbaru per sumber data.`,
      columns: ["Bulan", "Nama Siswa", "Kelas", "Jumlah", "Keterangan"],
      rows: buildTableRows(studentAssistanceRows),
    },
    {
      title: "Rekap Pemanggilan Orang Tua",
      description: `Dokumen terkait pemanggilan orang tua. Menampilkan maksimal ${REPORT_SECTION_ROW_LIMIT} baris terbaru.`,
      columns: ["Tanggal", "Nomor Surat", "Nama Siswa", "Kelas", "Jenis Surat", "Keterangan"],
      rows: buildTableRows(parentCallRows),
    },
    {
      title: "Rekap Home Visit",
      description: `Ringkasan pelaksanaan home visit. Menampilkan maksimal ${REPORT_SECTION_ROW_LIMIT} baris terbaru.`,
      columns: ["Tanggal", "Nama Siswa", "Nama Orang Tua/Wali", "Kelas", "Alamat", "Hasil Kunjungan", "Tindak Lanjut"],
      rows: buildTableRows(homeVisitRows),
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
      columns: ["Semester", "Tahun", "Kehadiran Sekolah", "Konseling", "Pendampingan", "Pemanggilan Orang Tua", "Home Visit"],
      rows: buildTableRows(semesterRows),
    },
    {
      title: "Rekap Per Tahun",
      description: "Ringkasan data berdasarkan tahun.",
      columns: ["Tahun", "Kehadiran Sekolah", "Konseling", "Pendampingan", "Pemanggilan Orang Tua", "Home Visit"],
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
      topAssistanceTopics: sortChartItems(
        [...topAssistanceTopicsMap.entries()].map(([label, value]) => ({ label, value })),
      ).slice(0, 10),
      classesMostServed: sortChartItems(
        [...classesMostServedMap.entries()].map(([label, value]) => ({ label, value })),
      ).slice(0, 10),
    },
    assessmentChecklist: ASSESSMENT_TYPE_OPTIONS.map((option) => ({
      assessmentType: option.value,
      available: (assessmentFilesResult.data ?? []).some((item) => item.assessment_type === option.value),
    })),
    summary: {
      attendanceRows: attendanceTotal,
      counselingRows: counselingTotal,
      assistanceRows: studentAssistanceTotal + classAssistanceTotal,
      parentCallRows: parentCallTotal,
      homeVisitRows: homeVisitTotal,
      classRows: classSummaryRows.length,
      semesterRows: semesterRows.length,
      yearlyRows: yearlyRows.length,
    },
  };
}
