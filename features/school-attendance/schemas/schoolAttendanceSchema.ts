import { SCHOOL_ATTENDANCE_STATUS_OPTIONS } from "@/lib/constants/options";
import {
  BASIC_VALIDATION_RULES,
  type SchoolAttendanceFormValues,
  type SchoolAttendanceStatus,
} from "@/types/common";

import type {
  SchoolAttendanceFormErrors,
  SchoolAttendanceFormState,
} from "@/features/school-attendance/types/schoolAttendance";

const SCHOOL_ATTENDANCE_STATUS_VALUES = new Set(
  SCHOOL_ATTENDANCE_STATUS_OPTIONS.map((option) => option.value),
);

export const EMPTY_SCHOOL_ATTENDANCE_FORM_VALUES: SchoolAttendanceFormValues = {
  attendanceDate: "",
  studentId: "",
  studentName: "",
  className: "",
  status: "Hadir",
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

export function parseSchoolAttendanceFormData(
  formData: FormData,
): SchoolAttendanceFormValues {
  return {
    attendanceDate: getTextValue(formData, "attendanceDate"),
    studentId: getTextValue(formData, "studentId"),
    studentName: getTextValue(formData, "studentName"),
    className: getTextValue(formData, "className"),
    status: (getTextValue(formData, "status") || "Hadir") as SchoolAttendanceStatus,
    description: getTextValue(formData, "description"),
  };
}

export function validateSchoolAttendanceForm(
  values: SchoolAttendanceFormValues,
): SchoolAttendanceFormErrors {
  const errors: SchoolAttendanceFormErrors = {};

  if (!values.attendanceDate) {
    errors.attendanceDate = BASIC_VALIDATION_RULES.required;
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

  if (!values.status) {
    errors.status = BASIC_VALIDATION_RULES.required;
  } else if (!SCHOOL_ATTENDANCE_STATUS_VALUES.has(values.status)) {
    errors.status = "Status presensi sekolah tidak valid";
  }

  return errors;
}

export function createSchoolAttendanceFormState(
  values: SchoolAttendanceFormValues,
  errors: SchoolAttendanceFormErrors = {},
  message = "",
): SchoolAttendanceFormState {
  return {
    status: "error",
    message,
    errors,
    values,
  };
}
