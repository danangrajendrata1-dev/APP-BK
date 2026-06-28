import {
  BASIC_VALIDATION_RULES,
  type CounselingRecordFormValues,
} from "@/types/common";

import type {
  CounselingRecordFormErrors,
  CounselingRecordFormState,
  CounselingRecordCode,
} from "@/features/counseling-records/types/counselingRecord";

export const VIOLATION_CODE_OPTIONS: Array<{
  label: string;
  value: CounselingRecordCode;
}> = [
  { label: "T - Terlambat", value: "T" },
  { label: "S - Tak Seragam", value: "S" },
  { label: "D - Tidak Memakai ID", value: "D" },
  { label: "R - Rambut Panjang / Semir", value: "R" },
  { label: "RK - Rokok", value: "RK" },
  { label: "K - Korek", value: "K" },
  { label: "M - Makeup Menor", value: "M" },
  { label: "L - Lainnya", value: "L" },
];

export const MONTH_OPTIONS = [
  { label: "Januari", value: "1" },
  { label: "Februari", value: "2" },
  { label: "Maret", value: "3" },
  { label: "April", value: "4" },
  { label: "Mei", value: "5" },
  { label: "Juni", value: "6" },
  { label: "Juli", value: "7" },
  { label: "Agustus", value: "8" },
  { label: "September", value: "9" },
  { label: "Oktober", value: "10" },
  { label: "November", value: "11" },
  { label: "Desember", value: "12" },
];

const VALID_VIOLATION_CODES = new Set(VIOLATION_CODE_OPTIONS.map((item) => item.value));
const YEAR_MIN = 2000;
const YEAR_MAX = 2100;

export const EMPTY_COUNSELING_RECORD_FORM_VALUES: CounselingRecordFormValues = {
  studentId: "",
  studentName: "",
  className: "",
  violationCode: "",
  violationDay: "",
  violationMonth: "",
  violationYear: "",
  description: "",
};

export const INITIAL_COUNSELING_RECORD_FORM_STATE: CounselingRecordFormState = {
  status: "idle",
  message: "",
  errors: {},
  values: EMPTY_COUNSELING_RECORD_FORM_VALUES,
};

function getTextValue(formData: FormData, fieldName: string) {
  return String(formData.get(fieldName) ?? "").trim();
}

function toPositiveInteger(value: string) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined;
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

export function parseCounselingRecordFormData(
  formData: FormData,
): CounselingRecordFormValues {
  return {
    studentId: getTextValue(formData, "studentId"),
    studentName: getTextValue(formData, "studentName"),
    className: getTextValue(formData, "className"),
    violationCode: getTextValue(formData, "violationCode").toUpperCase(),
    violationDay: getTextValue(formData, "violationDay"),
    violationMonth: getTextValue(formData, "violationMonth"),
    violationYear: getTextValue(formData, "violationYear"),
    description: getTextValue(formData, "description"),
  };
}

export function validateCounselingRecordForm(
  values: CounselingRecordFormValues,
): CounselingRecordFormErrors {
  const errors: CounselingRecordFormErrors = {};
  const day = toPositiveInteger(values.violationDay);
  const month = toPositiveInteger(values.violationMonth);
  const year = toPositiveInteger(values.violationYear);

  if (!values.studentId) errors.studentId = "Pilih siswa terlebih dahulu";
  if (!values.studentName) errors.studentName = "Nama siswa belum terisi";
  if (!values.className) errors.className = "Kelas belum terisi";
  if (!values.violationCode) {
    errors.violationCode = BASIC_VALIDATION_RULES.required;
  } else if (!VALID_VIOLATION_CODES.has(values.violationCode as CounselingRecordCode)) {
    errors.violationCode = "Kode pelanggaran tidak valid";
  }

  if (!values.violationDay) {
    errors.violationDay = BASIC_VALIDATION_RULES.required;
  } else if (!day || day < 1 || day > 31) {
    errors.violationDay = "Tanggal tidak valid";
  }

  if (!values.violationMonth) {
    errors.violationMonth = BASIC_VALIDATION_RULES.required;
  } else if (!month || month < 1 || month > 12) {
    errors.violationMonth = "Bulan tidak valid";
  }

  if (!values.violationYear) {
    errors.violationYear = BASIC_VALIDATION_RULES.required;
  } else if (!year || year < YEAR_MIN || year > YEAR_MAX) {
    errors.violationYear = "Tahun tidak valid";
  }

  if (day && month && year) {
    const daysInMonth = getDaysInMonth(year, month);
    if (day > daysInMonth) {
      errors.violationDay = "Tanggal tidak valid untuk bulan dan tahun terpilih";
    }
  }

  if (values.description.length > BASIC_VALIDATION_RULES.maxTextareaLength) {
    errors.description = "Keterangan terlalu panjang";
  }

  return errors;
}

export function createCounselingRecordFormState(
  values: CounselingRecordFormValues,
  errors: CounselingRecordFormErrors = {},
  message = "",
  status: CounselingRecordFormState["status"] = "error",
): CounselingRecordFormState {
  return {
    status,
    message,
    errors,
    values,
  };
}
