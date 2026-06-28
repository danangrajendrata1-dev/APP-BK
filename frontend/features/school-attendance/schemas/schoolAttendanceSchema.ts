import {
  BASIC_VALIDATION_RULES,
  type SchoolAttendanceFormValues,
  type SchoolAttendanceStatus,
} from "@/types/common";

import type {
  SchoolAttendanceFormErrors,
  SchoolAttendanceFormState,
} from "@/features/school-attendance/types/schoolAttendance";

const SCHOOL_ATTENDANCE_STATUS_VALUES = new Set<SchoolAttendanceStatus>([
  "S",
  "I",
  "A",
]);

export const SCHOOL_ATTENDANCE_FORM_STATUS_OPTIONS = [
  { label: "S", value: "S" },
  { label: "I", value: "I" },
  { label: "A", value: "A" },
] as const;

export const EMPTY_SCHOOL_ATTENDANCE_FORM_VALUES: SchoolAttendanceFormValues = {
  studentId: "",
  studentName: "",
  className: "",
  month: "",
  year: "",
  day: "",
  status: "" as SchoolAttendanceStatus,
  description: "",
};

export const INITIAL_SCHOOL_ATTENDANCE_FORM_STATE: SchoolAttendanceFormState = {
  status: "idle",
  message: "",
  errors: {},
  values: EMPTY_SCHOOL_ATTENDANCE_FORM_VALUES,
};

function getTextValue(formData: FormData, fieldName: string) {
  return String(formData.get(fieldName) ?? "").trim();
}

function getDaysInMonth(month: number, year: number) {
  return new Date(year, month, 0).getDate();
}

export function parseSchoolAttendanceFormData(
  formData: FormData,
): SchoolAttendanceFormValues {
  return {
    studentId: getTextValue(formData, "studentId"),
    studentName: getTextValue(formData, "studentName"),
    className: getTextValue(formData, "className"),
    month: getTextValue(formData, "month"),
    year: getTextValue(formData, "year"),
    day: getTextValue(formData, "day"),
    status: (getTextValue(formData, "status") || "") as SchoolAttendanceStatus,
    description: getTextValue(formData, "description"),
  };
}

export function validateSchoolAttendanceForm(
  values: SchoolAttendanceFormValues,
): SchoolAttendanceFormErrors {
  const errors: SchoolAttendanceFormErrors = {};

  const month = Number(values.month);
  const year = Number(values.year);
  const day = Number(values.day);

  if (!values.month) {
    errors.month = BASIC_VALIDATION_RULES.required;
  } else if (!Number.isInteger(month) || month < 1 || month > 12) {
    errors.month = "Bulan tidak valid";
  }

  if (!values.year) {
    errors.year = BASIC_VALIDATION_RULES.required;
  } else if (!Number.isInteger(year) || year < 2000 || year > 2100) {
    errors.year = "Tahun tidak valid";
  }

  if (!values.day) {
    errors.day = BASIC_VALIDATION_RULES.required;
  } else if (!Number.isInteger(day) || day < 1 || day > 31) {
    errors.day = "Tanggal tidak valid";
  }

  if (!values.studentId) {
    errors.studentId = "Pilih siswa terlebih dahulu";
  }

  if (!values.studentName) {
    errors.studentName = "Nama siswa belum terisi";
  }

  if (!values.className) {
    errors.className = "Kelas belum terisi";
  }

  if (values.month && values.year && values.day) {
    const maxDay = getDaysInMonth(month, year);
    if (
      Number.isInteger(day) &&
      Number.isInteger(month) &&
      Number.isInteger(year) &&
      (day < 1 || day > maxDay)
    ) {
      errors.day = "Tanggal tidak sesuai dengan bulan yang dipilih";
    }
  }

  if (!values.status) {
    errors.status = BASIC_VALIDATION_RULES.required;
  } else if (!SCHOOL_ATTENDANCE_STATUS_VALUES.has(values.status)) {
    errors.status = "Status daftar hadir tidak valid";
  }

  return errors;
}

export function createSchoolAttendanceFormState(
  values: SchoolAttendanceFormValues,
  errors: SchoolAttendanceFormErrors = {},
  message = "",
  status: "error" | "success" = "error",
): SchoolAttendanceFormState {
  return {
    status,
    message,
    errors,
    values,
  };
}
