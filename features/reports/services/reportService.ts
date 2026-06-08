import { ASSESSMENT_TYPE_OPTIONS } from "@/lib/constants/options";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import type {
  ChartItem,
  ReportRow,
  ReportSection,
  ReportsData,
  ReportsFilters,
} from "@/features/reports/types/report";

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

function toMonthLabel(month: number) {
  return MONTH_LABELS[month - 1] ?? String(month);
}

function normalize(value: string | null | undefined) {
  return value ?? "";
}

function matchesClassFilter(className: string, filters: ReportsFilters) {
  if (!filters.className) return true;
  return className.toLowerCase().includes(filters.className.toLowerCase());
}

function matchesDateFilter(dateValue: string, filters: ReportsFilters) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return false;

  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  if (filters.year && year !== filters.year) return false;
  if (filters.month && month !== filters.month) return false;
  if (filters.semester) {
    const semester = month <= 6 ? 1 : 2;
    if (semester !== filters.semester) return false;
  }

  return true;
}

function sortChartItems(items: ChartItem[]) {
  return [...items].sort((a, b) => b.value - a.value);
}

function buildTableRows<T extends ReportRow>(rows: T[]) {
  return rows;
}

export async function getReportsData(filters: ReportsFilters): Promise<ReportsData> {
  const supabase = await createSupabaseServerClient();
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
  ] = await Promise.all([
    supabase.from("school_attendance").select("attendance_date, student_name, class_name, status, description"),
    supabase.from("counseling_records").select("counseling_date, student_name, class_name, meeting_number, media, counseling_type, topic, counseling_result, follow_up, description"),
    supabase.from("student_assistances").select("assistance_month, assistance_year, student_name, class_name, total, description, day_1, day_2, day_3, day_4, day_5, day_6, day_7, day_8, day_9, day_10, day_11, day_12, day_13, day_14, day_15, day_16, day_17, day_18, day_19, day_20, day_21, day_22, day_23, day_24, day_25, day_26, day_27, day_28, day_29, day_30, day_31"),
    supabase.from("class_assistances").select("student_name, class_name, violation_type, action_form, remission, description, final_warning_letter"),
    supabase.from("documents").select("document_date, student_name, class_name, document_type, letter_number, description"),
    supabase.from("home_visits").select("visit_date, student_name, class_name, parent_name, address, visit_result, follow_up"),
    supabase.from("students").select("full_name, class_name, major"),
    supabase.from("bk_service_attendance").select("service_date, student_name, class_name"),
    supabase.from("assessment_files").select("assessment_type"),
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
    assessmentFilesResult.error
  ) {
    throw new Error("Gagal memuat laporan dan statistik.");
  }

  const attendanceRows = (attendanceResult.data ?? [])
    .filter((row) => matchesDateFilter(row.attendance_date, filters) && matchesClassFilter(row.class_name, filters))
    .map((row) => ({
      Tanggal: row.attendance_date,
      "Nama Siswa": row.student_name,
      Kelas: row.class_name,
      Status: row.status,
      Keterangan: normalize(row.description),
    }));

  const counselingRows = (counselingResult.data ?? [])
    .filter((row) => matchesDateFilter(row.counseling_date, filters) && matchesClassFilter(row.class_name, filters))
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
    .filter((row) => {
      const sameYear = !filters.year || row.assistance_year === filters.year;
      const sameMonth = !filters.month || row.assistance_month === filters.month;
      const sameSemester = !filters.semester || (filters.semester === 1 ? row.assistance_month <= 6 : row.assistance_month >= 7);
      return sameYear && sameMonth && sameSemester && matchesClassFilter(row.class_name, filters);
    })
    .map((row) => ({
      Bulan: `${toMonthLabel(row.assistance_month)} ${row.assistance_year}`,
      "Nama Siswa": row.student_name,
      Kelas: row.class_name,
      Jumlah: row.total,
      Keterangan: normalize(row.description),
    }));

  const classAssistanceRows = (classAssistanceResult.data ?? [])
    .filter((row) => matchesClassFilter(row.class_name, filters))
    .map((row) => ({
      "Nama Siswa": row.student_name,
      Kelas: row.class_name,
      "Jenis Pelanggaran": normalize(row.violation_type),
      "Bentuk Tindakan": normalize(row.action_form),
      Remisi: normalize(row.remission),
      Keterangan: normalize(row.description),
      "SP Akhir": normalize(row.final_warning_letter),
    }));

  const parentCallRows = (documentsResult.data ?? [])
    .filter((row) => matchesDateFilter(row.document_date, filters) && matchesClassFilter(normalize(row.class_name), filters))
    .filter((row) => row.document_type.includes("Panggilan Orang Tua"))
    .map((row) => ({
      Tanggal: row.document_date,
      "Nomor Surat": row.letter_number,
      "Nama Siswa": row.student_name,
      Kelas: normalize(row.class_name),
      "Jenis Surat": row.document_type,
      Keterangan: normalize(row.description),
    }));

  const homeVisitRows = (homeVisitsResult.data ?? [])
    .filter((row) => matchesDateFilter(row.visit_date, filters) && matchesClassFilter(row.class_name, filters))
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
    if (!matchesClassFilter(row.class_name, filters)) return;
    classSummaryMap.set(row.class_name, (classSummaryMap.get(row.class_name) ?? 0) + 1);
  });
  const classSummaryRows = [...classSummaryMap.entries()].map(([className, totalStudents]) => ({
    Kelas: className,
    "Jumlah Siswa": totalStudents,
  }));

  const semesterRows = [
    {
      Semester: filters.semester ? `Semester ${filters.semester}` : "Semua Semester",
      Tahun: filters.year ?? "Semua Tahun",
      "Kehadiran Sekolah": attendanceRows.length,
      Konseling: counselingRows.length,
      Pendampingan: studentAssistanceRows.length + classAssistanceRows.length,
      "Pemanggilan Orang Tua": parentCallRows.length,
      "Home Visit": homeVisitRows.length,
    },
  ];

  const yearlyRows = [
    {
      Tahun: filters.year ?? "Semua Tahun",
      "Kehadiran Sekolah": attendanceRows.length,
      Konseling: counselingRows.length,
      Pendampingan: studentAssistanceRows.length + classAssistanceRows.length,
      "Pemanggilan Orang Tua": parentCallRows.length,
      "Home Visit": homeVisitRows.length,
    },
  ];

  const counselingPerMonthMap = new Map<string, number>();
  counselingRows.forEach((row) => {
    const date = new Date(String(row.Tanggal));
    const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
    counselingPerMonthMap.set(key, (counselingPerMonthMap.get(key) ?? 0) + 1);
  });

  const studentsMostServedMap = new Map<string, number>();
  (bkServiceAttendanceResult.data ?? []).forEach((row) => {
    if (!matchesDateFilter(row.service_date, filters) || !matchesClassFilter(row.class_name, filters)) return;
    studentsMostServedMap.set(row.student_name, (studentsMostServedMap.get(row.student_name) ?? 0) + 1);
  });
  (counselingResult.data ?? []).forEach((row) => {
    if (!matchesDateFilter(row.counseling_date, filters) || !matchesClassFilter(row.class_name, filters)) return;
    studentsMostServedMap.set(row.student_name, (studentsMostServedMap.get(row.student_name) ?? 0) + 1);
  });
  (studentAssistanceResult.data ?? []).forEach((row) => {
    const sameYear = !filters.year || row.assistance_year === filters.year;
    const sameMonth = !filters.month || row.assistance_month === filters.month;
    const sameSemester = !filters.semester || (filters.semester === 1 ? row.assistance_month <= 6 : row.assistance_month >= 7);
    if (!sameYear || !sameMonth || !sameSemester || !matchesClassFilter(row.class_name, filters)) return;
    studentsMostServedMap.set(row.student_name, (studentsMostServedMap.get(row.student_name) ?? 0) + (row.total ?? 0));
  });

  const attendanceByStatusMap = new Map<string, number>();
  attendanceRows.forEach((row) => {
    const status = String(row.Status);
    attendanceByStatusMap.set(status, (attendanceByStatusMap.get(status) ?? 0) + 1);
  });

  const topAssistanceTopicsMap = new Map<string, number>();
  (studentAssistanceResult.data ?? []).forEach((row) => {
    const sameYear = !filters.year || row.assistance_year === filters.year;
    const sameMonth = !filters.month || row.assistance_month === filters.month;
    const sameSemester = !filters.semester || (filters.semester === 1 ? row.assistance_month <= 6 : row.assistance_month >= 7);
    if (!sameYear || !sameMonth || !sameSemester || !matchesClassFilter(row.class_name, filters)) return;

    for (let day = 1; day <= 31; day += 1) {
      const key = row[`day_${day}` as keyof typeof row];
      if (typeof key === "string" && key) {
        topAssistanceTopicsMap.set(key, (topAssistanceTopicsMap.get(key) ?? 0) + 1);
      }
    }
  });
  (classAssistanceResult.data ?? []).forEach((row) => {
    if (!matchesClassFilter(row.class_name, filters)) return;
    const violationType = normalize(row.violation_type);
    if (violationType) {
      topAssistanceTopicsMap.set(violationType, (topAssistanceTopicsMap.get(violationType) ?? 0) + 1);
    }
  });

  const classesMostServedMap = new Map<string, number>();
  (bkServiceAttendanceResult.data ?? []).forEach((row) => {
    if (!matchesDateFilter(row.service_date, filters) || !matchesClassFilter(row.class_name, filters)) return;
    classesMostServedMap.set(row.class_name, (classesMostServedMap.get(row.class_name) ?? 0) + 1);
  });
  (counselingResult.data ?? []).forEach((row) => {
    if (!matchesDateFilter(row.counseling_date, filters) || !matchesClassFilter(row.class_name, filters)) return;
    classesMostServedMap.set(row.class_name, (classesMostServedMap.get(row.class_name) ?? 0) + 1);
  });

  const reportSections: ReportSection[] = [
    {
      title: "Rekap Kehadiran Sekolah",
      description: "Data kehadiran siswa berdasarkan presensi sekolah.",
      columns: ["Tanggal", "Nama Siswa", "Kelas", "Status", "Keterangan"],
      rows: buildTableRows(attendanceRows),
    },
    {
      title: "Rekap Konseling",
      description: "Ringkasan catatan layanan konseling.",
      columns: ["Tanggal", "Nama Siswa", "Kelas", "Pertemuan Ke-", "Media", "Jenis Konseling", "Topik", "Hasil Konseling", "Tindak Lanjut", "Keterangan"],
      rows: buildTableRows(counselingRows),
    },
    {
      title: "Rekap Pendampingan",
      description: "Gabungan pendampingan bulanan dan pendampingan per kelas.",
      columns: ["Bulan", "Nama Siswa", "Kelas", "Jumlah", "Keterangan"],
      rows: buildTableRows(studentAssistanceRows),
    },
    {
      title: "Rekap Pemanggilan Orang Tua",
      description: "Dokumen terkait pemanggilan orang tua.",
      columns: ["Tanggal", "Nomor Surat", "Nama Siswa", "Kelas", "Jenis Surat", "Keterangan"],
      rows: buildTableRows(parentCallRows),
    },
    {
      title: "Rekap Home Visit",
      description: "Ringkasan pelaksanaan home visit.",
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
      counselingPerMonth: [...counselingPerMonthMap.entries()]
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([key, value]) => {
          const [, month] = key.split("-");
          return { label: toMonthLabel(Number(month)), value };
        }),
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
      attendanceRows: attendanceRows.length,
      counselingRows: counselingRows.length,
      assistanceRows: studentAssistanceRows.length + classAssistanceRows.length,
      parentCallRows: parentCallRows.length,
      homeVisitRows: homeVisitRows.length,
      classRows: classSummaryRows.length,
      semesterRows: semesterRows.length,
      yearlyRows: yearlyRows.length,
    },
  };
}
