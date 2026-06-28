import { createSupabaseServerClient } from "@/lib/supabase/server";
import { logSupabaseError } from "@/lib/supabase/error";
import type { Database } from "@/types/database";

import type {
  CounselingRecordCode,
  CounselingRecordSheetFilters,
  CounselingRecordSheetResult,
  CounselingRecordSheetRow,
} from "@/features/counseling-records/types/counselingRecord";
import type { CounselingRecordFormValues } from "@/types/common";

const RAW_RECORD_LIMIT = 1000;
const RECORD_COLUMNS =
  "id, student_id, student_name, class_name, violation_code, description, violation_date, violation_year, violation_month, violation_day";

type ViolationRecordRow = Pick<
  Database["public"]["Tables"]["violation_records"]["Row"],
  | "id"
  | "student_id"
  | "student_name"
  | "class_name"
  | "violation_code"
  | "description"
  | "violation_date"
  | "violation_year"
  | "violation_month"
  | "violation_day"
>;

type GroupedStudentRow = {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  previousCounts: Record<CounselingRecordCode, number>;
  currentCounts: Record<CounselingRecordCode, number>;
  dayValues: Record<number, Set<CounselingRecordCode>>;
  description: string;
  latestDate: string;
};

type ViolationInsert = Database["public"]["Tables"]["violation_records"]["Insert"];

const VIOLATION_CODE_ORDER: CounselingRecordCode[] = [
  "T",
  "S",
  "D",
  "R",
  "RK",
  "K",
  "M",
  "L",
];

function normalizeText(value: string | null | undefined) {
  return value?.trim() ?? "";
}

function normalizeViolationCode(
  value: string | null | undefined,
): CounselingRecordCode | "" {
  const normalized = normalizeText(value).toUpperCase().replace(/\s+/g, "");

  if (normalized === "RK") return "RK";
  if ((VIOLATION_CODE_ORDER as string[]).includes(normalized)) {
    return normalized as CounselingRecordCode;
  }

  return "";
}

function resolveViolationCode(
  value: string | null | undefined,
  description: string | null | undefined,
): CounselingRecordCode {
  const normalizedCode = normalizeViolationCode(value);
  if (normalizedCode) {
    return normalizedCode;
  }

  const normalizedDescription = normalizeText(description).toLowerCase();
  if (normalizedDescription.includes("terlambat")) return "T";
  if (
    normalizedDescription.includes("tak seragam") ||
    normalizedDescription.includes("tidak seragam") ||
    normalizedDescription.includes("seragam")
  ) {
    return "S";
  }
  if (
    normalizedDescription.includes("id card") ||
    normalizedDescription.includes("idcard") ||
    normalizedDescription.includes("tidak memakai id") ||
    normalizedDescription.includes("kartu identitas") ||
    normalizedDescription.includes("identitas")
  ) {
    return "D";
  }
  if (
    normalizedDescription.includes("rambut panjang") ||
    normalizedDescription.includes("rambut") ||
    normalizedDescription.includes("semir") ||
    normalizedDescription.includes("cat rambut")
  ) {
    return "R";
  }
  if (normalizedDescription.includes("rokok")) return "RK";
  if (normalizedDescription.includes("korek")) return "K";
  if (
    normalizedDescription.includes("makeup") ||
    normalizedDescription.includes("make up") ||
    normalizedDescription.includes("menor")
  ) {
    return "M";
  }

  return "L";
}

function createEmptyCounts(): Record<CounselingRecordCode, number> {
  return VIOLATION_CODE_ORDER.reduce(
    (acc, code) => {
      acc[code] = 0;
      return acc;
    },
    {} as Record<CounselingRecordCode, number>,
  );
}

function createEmptyDayValues(): Record<number, Set<CounselingRecordCode>> {
  return Array.from({ length: 31 }, (_, index) => index + 1).reduce(
    (acc, day) => {
      acc[day] = new Set<CounselingRecordCode>();
      return acc;
    },
    {} as Record<number, Set<CounselingRecordCode>>,
  );
}

function getStudentKey(row: {
  studentId: string;
  studentName: string;
  className: string;
}) {
  if (row.studentId) {
    return `id:${row.studentId}`;
  }

  return `name:${row.studentName.toLowerCase().trim()}|class:${row.className
    .toLowerCase()
    .trim()}`;
}

function getFallbackStudentKey(row: {
  studentName: string;
  className: string;
}) {
  return `name:${row.studentName.toLowerCase().trim()}|class:${row.className
    .toLowerCase()
    .trim()}`;
}

function mergeSummaryText(current: string, next: string | null | undefined) {
  const nextText = normalizeText(next);
  if (!nextText) {
    return current;
  }

  if (!current) {
    return nextText;
  }

  const uniqueValues = [...new Set([current, nextText])];
  if (uniqueValues.length === 1) {
    return uniqueValues[0];
  }

  return `${uniqueValues.slice(0, 2).join(", ")}${uniqueValues.length > 2 ? "..." : ""}`;
}

function formatSummary(counts: Record<CounselingRecordCode, number>) {
  const parts = VIOLATION_CODE_ORDER.filter((code) => counts[code] > 0).map(
    (code) => `${code}${counts[code]}`,
  );
  return parts.length ? parts.join(" ") : "-";
}

function formatDayValues(values: Set<CounselingRecordCode>) {
  if (!values.size) {
    return "";
  }

  return VIOLATION_CODE_ORDER.filter((code) => values.has(code)).join(", ");
}

function formatMonthStartDate(year: number, month: number) {
  return `${year}-${String(month).padStart(2, "0")}-01`;
}

function buildGroupedRow(classNameFallback: string): GroupedStudentRow {
  return {
    id: "",
    studentId: "",
    studentName: "",
    className: classNameFallback,
    previousCounts: createEmptyCounts(),
    currentCounts: createEmptyCounts(),
    dayValues: createEmptyDayValues(),
    description: "",
    latestDate: "",
  };
}

function mapGroupedRow(row: GroupedStudentRow): CounselingRecordSheetRow {
  return {
    id: row.id,
    studentId: row.studentId,
    studentName: row.studentName,
    className: row.className,
    previousSummary: formatSummary(row.previousCounts),
    days: Array.from({ length: 31 }, (_, index) =>
      formatDayValues(row.dayValues[index + 1]),
    ),
    currentSummary: formatSummary(row.currentCounts),
    description: normalizeText(row.description) || "-",
  };
}

function toGroupedRow(
  row: ViolationRecordRow,
  classNameFallback: string,
  groupedMap: Map<string, GroupedStudentRow>,
) {
  const studentName = normalizeText(row.student_name) || "-";
  const className = normalizeText(row.class_name) || classNameFallback;
  const studentId = normalizeText(row.student_id);
  const key = getStudentKey({
    studentId,
    studentName,
    className,
  });
  const fallbackKey = getFallbackStudentKey({
    studentName,
    className,
  });

  const existing =
    groupedMap.get(key) ??
    groupedMap.get(fallbackKey) ??
    buildGroupedRow(classNameFallback);

  const code = resolveViolationCode(row.violation_code, row.description);
  const day = Number(row.violation_day);
  const rowDescription = normalizeText(row.description);

  if (!existing.id || (studentId && existing.studentId.startsWith("name:"))) {
    existing.id = key;
    existing.studentId = studentId || existing.studentId || key;
    existing.studentName = studentName;
    existing.className = className;
  }

  groupedMap.set(key, existing);
  groupedMap.set(fallbackKey, existing);

  if (row.violation_date >= existing.latestDate) {
    existing.latestDate = row.violation_date;
  }

  if (rowDescription) {
    existing.description = mergeSummaryText(existing.description, rowDescription);
  }

  if (day >= 1 && day <= 31) {
    existing.dayValues[day].add(code);
  }

  return { existing, code, key };
}

function buildEmptyResult(
  filters: CounselingRecordSheetFilters,
): CounselingRecordSheetResult {
  return {
    items: [],
    filters,
    month: filters.month,
    year: filters.year,
  };
}

function normalizeSheetFilters(
  filters: Partial<CounselingRecordSheetFilters> = {},
): CounselingRecordSheetFilters {
  return {
    className: normalizeText(filters.className) || undefined,
    month:
      typeof filters.month === "number" && filters.month >= 1 && filters.month <= 12
        ? filters.month
        : undefined,
    year:
      typeof filters.year === "number" && filters.year >= 2000 && filters.year <= 2100
        ? filters.year
        : undefined,
  };
}

export async function fetchViolationRecordsForMonth(
  filters: CounselingRecordSheetFilters,
): Promise<ViolationRecordRow[]> {
  const supabase = await createSupabaseServerClient();
  const { className, month, year } = filters;

  if (!className || !month || !year) {
    return [];
  }

  const { data, error } = await supabase
    .from("violation_records")
    .select(RECORD_COLUMNS)
    .eq("class_name", className)
    .eq("violation_year", year)
    .eq("violation_month", month)
    .order("violation_day", { ascending: true })
    .order("student_name", { ascending: true })
    .range(0, RAW_RECORD_LIMIT - 1);

  if (error) {
    logSupabaseError("[CounselingRecords] fetchViolationRecordsForMonth", error, {
      className,
      month,
      year,
    });
    throw new Error("Gagal memuat data catatan pelanggaran.");
  }

  return (data ?? []) as ViolationRecordRow[];
}

export async function fetchPreviousViolationRecords(
  filters: CounselingRecordSheetFilters,
): Promise<ViolationRecordRow[]> {
  const supabase = await createSupabaseServerClient();
  const { className, month, year } = filters;

  if (!className || !month || !year) {
    return [];
  }

  const monthStartDate = formatMonthStartDate(year, month);

  const { data, error } = await supabase
    .from("violation_records")
    .select(RECORD_COLUMNS)
    .eq("class_name", className)
    .lt("violation_date", monthStartDate)
    .order("violation_date", { ascending: true })
    .order("student_name", { ascending: true })
    .range(0, RAW_RECORD_LIMIT - 1);

  if (error) {
    logSupabaseError("[CounselingRecords] fetchPreviousViolationRecords", error, {
      className,
      month,
      year,
      monthStartDate,
    });
    throw new Error("Gagal memuat riwayat catatan pelanggaran.");
  }

  return (data ?? []) as ViolationRecordRow[];
}

export async function insertViolationRecord(
  values: CounselingRecordFormValues,
) {
  const supabase = await createSupabaseServerClient();
  const year = Number(values.violationYear);
  const month = Number(values.violationMonth);
  const day = Number(values.violationDay);
  const violationDate = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const payload: ViolationInsert = {
    student_id: values.studentId,
    student_name: values.studentName,
    class_name: values.className,
    violation_code: values.violationCode,
    description: values.description || null,
    violation_day: day,
    violation_month: month,
    violation_year: year,
    violation_date: violationDate,
  };

  const { data, error } = await supabase
    .from("violation_records")
    .insert(payload as never)
    .select(RECORD_COLUMNS)
    .single();

  if (error) {
    logSupabaseError("[CounselingRecords] insertViolationRecord", error, {
      studentId: values.studentId,
      studentName: values.studentName,
      className: values.className,
      violationCode: values.violationCode,
      violationDate,
    });
    throw new Error("Gagal menyimpan catatan pelanggaran.");
  }

  return data as ViolationRecordRow;
}

export async function createCounselingRecord(values: CounselingRecordFormValues) {
  return insertViolationRecord(values);
}

export async function getCounselingRecordSheet(
  params: Partial<CounselingRecordSheetFilters> = {},
): Promise<CounselingRecordSheetResult> {
  const filters = normalizeSheetFilters(params);

  if (!filters.className || !filters.month || !filters.year) {
    return buildEmptyResult(filters);
  }

  const [previousRows, currentRows] = await Promise.all([
    fetchPreviousViolationRecords(filters),
    fetchViolationRecordsForMonth(filters),
  ]);

  const groupedMap = new Map<string, GroupedStudentRow>();

  for (const row of previousRows) {
    const { existing, code } = toGroupedRow(row, filters.className, groupedMap);
    existing.previousCounts[code] += 1;
  }

  for (const row of currentRows) {
    const { existing, code } = toGroupedRow(row, filters.className, groupedMap);
    existing.currentCounts[code] += 1;
    const day = Number(row.violation_day);
    if (day >= 1 && day <= 31) {
      existing.dayValues[day].add(code);
    }
  }

  const items = [...new Set(groupedMap.values())]
    .filter((item) =>
      VIOLATION_CODE_ORDER.some(
        (code) => item.previousCounts[code] > 0 || item.currentCounts[code] > 0,
      ),
    )
    .sort((a, b) => a.studentName.localeCompare(b.studentName))
    .map(mapGroupedRow);

  return {
    items,
    filters,
    month: filters.month,
    year: filters.year,
  };
}
