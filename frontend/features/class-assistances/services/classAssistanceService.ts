import { createSupabaseServerClient } from "@/lib/supabase/server";
import { buildSupabaseErrorMessage, logSupabaseError } from "@/lib/supabase/error";
import type { Database } from "@/types/database";

import type {
  ClassAssistanceRecapFilters,
  ClassAssistanceRecapItem,
  ClassAssistanceRecapResult,
  RecapActionCode,
  RecapFinalWarningLetter,
  RecapViolationCode,
} from "@/features/class-assistances/types/classAssistance";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 25;
// TODO: Jika satu kelas melebihi 500 record pelanggaran, pindahkan rekap ke RPC/view agar pagination tetap akurat.
const RAW_RECORD_LIMIT = 500;
const VIOLATION_COLUMNS =
  "id, student_id, student_name, class_name, violation_code, description, violation_date, violation_year, violation_month, violation_day";
const CLASS_ASSISTANCE_COLUMNS =
  "id, student_id, student_name, class_name, action_form, remission, description, final_warning_letter";

const VALID_VIOLATION_CODES: RecapViolationCode[] = ["T", "S", "D", "R", "RK", "K", "M", "L"];
const VALID_ACTION_CODES: RecapActionCode[] = ["kontrak", "sp1", "sp2", "sp3"];
const VALID_FINAL_WARNING_LETTERS: RecapFinalWarningLetter[] = ["SP 1", "SP 2", "SP 3"];

type ViolationRow = Pick<
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
type ClassAssistanceRow = Pick<
  Database["public"]["Tables"]["class_assistances"]["Row"],
  | "id"
  | "student_id"
  | "student_name"
  | "class_name"
  | "action_form"
  | "remission"
  | "description"
  | "final_warning_letter"
>;

type GroupedRecapItem = {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  violationCounts: Record<RecapViolationCode, number>;
  actionCounts: Record<RecapActionCode, number>;
  remission: string;
  description: string;
  finalWarningLetter: string;
  latestDate: string;
};

function normalizeText(value: string | null | undefined) {
  return value?.trim() ?? "";
}

function normalizeCode(value: string | null | undefined): RecapViolationCode | "" {
  const normalized = normalizeText(value).toUpperCase().replace(/\s+/g, "");

  if (normalized === "RK") return "RK";
  if (VALID_VIOLATION_CODES.includes(normalized as RecapViolationCode)) {
    return normalized as RecapViolationCode;
  }

  return "";
}

function mapDescriptionToCode(description: string | null | undefined): RecapViolationCode {
  const normalized = normalizeText(description).toLowerCase();

  if (!normalized) return "L";
  if (normalized.includes("terlambat")) return "T";
  if (
    normalized.includes("tak seragam") ||
    normalized.includes("tidak seragam") ||
    normalized.includes("seragam")
  ) {
    return "S";
  }
  if (
    normalized.includes("id card") ||
    normalized.includes("idcard") ||
    normalized.includes("tidak memakai id") ||
    normalized.includes("kartu identitas") ||
    normalized.includes("identitas")
  ) {
    return "D";
  }
  if (
    normalized.includes("rambut panjang") ||
    normalized.includes("rambut") ||
    normalized.includes("semir") ||
    normalized.includes("cat rambut")
  ) {
    return "R";
  }
  if (normalized.includes("rokok")) return "RK";
  if (normalized.includes("korek")) return "K";
  if (normalized.includes("makeup") || normalized.includes("make up") || normalized.includes("menor")) {
    return "M";
  }

  return "L";
}

function resolveViolationCode(
  code: string | null | undefined,
  description: string | null | undefined,
): RecapViolationCode {
  const normalizedCode = normalizeCode(code);
  if (normalizedCode) {
    return normalizedCode;
  }

  return mapDescriptionToCode(description);
}

function normalizeActionCode(value: string | null | undefined): RecapActionCode | "" {
  const normalized = normalizeText(value).toLowerCase().replace(/\s+/g, "");

  if (normalized.includes("kontrak")) return "kontrak";
  if (normalized === "sp1" || normalized.includes("sp1")) return "sp1";
  if (normalized === "sp2" || normalized.includes("sp2")) return "sp2";
  if (normalized === "sp3" || normalized.includes("sp3")) return "sp3";

  return "";
}

function normalizeFinalWarningLetter(value: string | null | undefined): RecapFinalWarningLetter | "" {
  const normalized = normalizeText(value).toUpperCase().replace(/\s+/g, "");

  if (normalized === "SP1") return "SP 1";
  if (normalized === "SP2") return "SP 2";
  if (normalized === "SP3") return "SP 3";
  if (VALID_FINAL_WARNING_LETTERS.includes(normalizeText(value).toUpperCase() as RecapFinalWarningLetter)) {
    return normalizeText(value).toUpperCase() as RecapFinalWarningLetter;
  }

  return "";
}

const FINAL_WARNING_PRIORITY: Record<RecapFinalWarningLetter, number> = {
  "SP 1": 1,
  "SP 2": 2,
  "SP 3": 3,
};

function chooseFinalWarningLetter(current: string, next: string | null | undefined) {
  const currentNormalized = normalizeFinalWarningLetter(current);
  const nextNormalized = normalizeFinalWarningLetter(next);

  if (!currentNormalized) return nextNormalized;
  if (!nextNormalized) return currentNormalized;

  return FINAL_WARNING_PRIORITY[nextNormalized] > FINAL_WARNING_PRIORITY[currentNormalized]
    ? nextNormalized
    : currentNormalized;
}

function summaryText(values: string[], fallback = "") {
  const uniqueValues = [...new Set(values.map(normalizeText).filter(Boolean))];
  if (!uniqueValues.length) return fallback;
  if (uniqueValues.length === 1) return uniqueValues[0];
  return `${uniqueValues.slice(0, 2).join(", ")}${uniqueValues.length > 2 ? "..." : ""}`;
}

function getStudentKey(row: { studentId: string; studentName: string; className: string }) {
  if (row.studentId) return `id:${row.studentId}`;
  return `name:${row.studentName.toLowerCase().trim()}|class:${row.className.toLowerCase().trim()}`;
}

function getFallbackStudentKey(row: { studentName: string; className: string }) {
  return `name:${row.studentName.toLowerCase().trim()}|class:${row.className.toLowerCase().trim()}`;
}

function createEmptyViolationCounts(): Record<RecapViolationCode, number> {
  return VALID_VIOLATION_CODES.reduce(
    (acc, code) => {
      acc[code] = 0;
      return acc;
    },
    {} as Record<RecapViolationCode, number>,
  );
}

function createEmptyActionCounts(): Record<RecapActionCode, number> {
  return VALID_ACTION_CODES.reduce(
    (acc, code) => {
      acc[code] = 0;
      return acc;
    },
    {} as Record<RecapActionCode, number>,
  );
}

function buildRecapItem(group: GroupedRecapItem): ClassAssistanceRecapItem {
  return {
    id: group.id,
    studentId: group.studentId,
    studentName: group.studentName,
    className: group.className,
    violationCounts: group.violationCounts,
    actionCounts: group.actionCounts,
    remission: group.remission,
    description: group.description,
    finalWarningLetter: group.finalWarningLetter,
  };
}

export async function getClassAssistanceRecap(
  params: Partial<{
    page: number;
    pageSize: number;
    filters: ClassAssistanceRecapFilters;
  }> = {},
): Promise<ClassAssistanceRecapResult> {
  const supabase = await createSupabaseServerClient();
  const requestedPage = Math.max(params.page ?? DEFAULT_PAGE, 1);
  const pageSize = Math.min(Math.max(params.pageSize ?? DEFAULT_PAGE_SIZE, 1), DEFAULT_PAGE_SIZE);
  const filters = params.filters ?? {};
  const className = filters.className?.trim() ?? "";

  if (!className) {
    return {
      items: [],
      filters,
      pagination: {
        page: 1,
        pageSize,
        totalItems: 0,
        totalPages: 1,
      },
    };
  }

  const [violationResult, classAssistanceResult] = await Promise.all([
    supabase
      .from("violation_records")
      .select(VIOLATION_COLUMNS)
      .eq("class_name", className)
      .order("violation_date", { ascending: false })
      .order("student_name", { ascending: true })
      .range(0, RAW_RECORD_LIMIT - 1),
    supabase
      .from("class_assistances")
      .select(CLASS_ASSISTANCE_COLUMNS)
      .eq("class_name", className)
      .order("student_name", { ascending: true })
      .range(0, RAW_RECORD_LIMIT - 1),
  ]);

  if (violationResult.error) {
    logSupabaseError("[ClassAssistances] getClassAssistanceRecap violation_records", violationResult.error, {
      className,
      page: requestedPage,
      pageSize,
      filters,
    });
    throw new Error(buildSupabaseErrorMessage("Gagal memuat rekapan pelanggaran siswa", violationResult.error));
  }

  if (classAssistanceResult.error) {
    logSupabaseError("[ClassAssistances] getClassAssistanceRecap class_assistances", classAssistanceResult.error, {
      className,
      page: requestedPage,
      pageSize,
      filters,
    });
    throw new Error(buildSupabaseErrorMessage("Gagal memuat rekapan pelanggaran siswa", classAssistanceResult.error));
  }

  const groupedMap = new Map<string, GroupedRecapItem>();

  const violationRows = (violationResult.data ?? []) as ViolationRow[];
  for (const row of violationRows) {
    const studentName = normalizeText(row.student_name) || "-";
    const rowClassName = normalizeText(row.class_name) || className;
    const studentId = normalizeText(row.student_id);
    const key = getStudentKey({
      studentId,
      studentName,
      className: rowClassName,
    });
    const existing =
      groupedMap.get(key) ??
      ({
        id: key,
        studentId: studentId || key,
        studentName,
        className: rowClassName,
        violationCounts: createEmptyViolationCounts(),
        actionCounts: createEmptyActionCounts(),
        remission: "",
        description: "",
        finalWarningLetter: "",
        latestDate: row.violation_date,
      } satisfies GroupedRecapItem);

    const violationCode = resolveViolationCode(row.violation_code, row.description);
    existing.violationCounts[violationCode] += 1;

    const rowDescription = normalizeText(row.description);
    if (rowDescription) {
      existing.description = summaryText([existing.description, rowDescription], rowDescription);
    }
    if (row.violation_date >= existing.latestDate) {
      existing.latestDate = row.violation_date;
    }

    groupedMap.set(key, existing);
    if (studentId) {
      groupedMap.set(
        getFallbackStudentKey({
          studentName,
          className: rowClassName,
        }),
        existing,
      );
    }
  }

  const classAssistanceRows = (classAssistanceResult.data ?? []) as ClassAssistanceRow[];
  for (const row of classAssistanceRows) {
    const studentName = normalizeText(row.student_name) || "-";
    const rowClassName = normalizeText(row.class_name) || className;
    const studentId = normalizeText(row.student_id);
    const key = getStudentKey({
      studentId,
      studentName,
      className: rowClassName,
    });
    const existing = groupedMap.get(key) ?? groupedMap.get(getFallbackStudentKey({
      studentName,
      className: rowClassName,
    }));
    if (!existing) {
      continue;
    }

    const actionCode = normalizeActionCode(row.action_form);
    if (actionCode) {
      existing.actionCounts[actionCode] += 1;
    }

    const remission = normalizeText(row.remission);
    if (remission) {
      existing.remission = summaryText([existing.remission, remission], remission);
    }

    const description = normalizeText(row.description);
    if (description) {
      existing.description = summaryText([existing.description, description], description);
    }

    const finalWarningLetter = normalizeFinalWarningLetter(row.final_warning_letter);
    existing.finalWarningLetter = chooseFinalWarningLetter(
      existing.finalWarningLetter,
      finalWarningLetter,
    );

    groupedMap.set(key, existing);
  }

  const items = [...new Set(groupedMap.values())]
    .filter((item) => {
      if (filters.violationType && item.violationCounts[filters.violationType] <= 0) {
        return false;
      }

      if (filters.finalWarningLetter && normalizeFinalWarningLetter(item.finalWarningLetter) !== filters.finalWarningLetter) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (a.latestDate !== b.latestDate) {
        return b.latestDate.localeCompare(a.latestDate);
      }

      return a.studentName.localeCompare(b.studentName);
    });

  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const page = Math.min(requestedPage, totalPages);
  const from = (page - 1) * pageSize;
  const to = from + pageSize;

  return {
    items: items.slice(from, to).map(buildRecapItem),
    filters,
    pagination: {
      page,
      pageSize,
      totalItems,
      totalPages,
    },
  };
}
