import {
  BK_SERVICE_PURPOSE_OPTIONS,
  BK_SERVICE_TYPE_OPTIONS,
} from "@/lib/constants/options";
import {
  BASIC_VALIDATION_RULES,
  type BkServiceAttendanceFormValues,
  type BkServicePurpose,
  type BkServiceType,
} from "@/types/common";

import type {
  BkServiceAttendanceFormErrors,
  BkServiceAttendanceFormState,
} from "@/features/bk-service-attendance/types/bkServiceAttendance";

const PURPOSE_VALUES = new Set(
  BK_SERVICE_PURPOSE_OPTIONS.map((option) => option.value),
);
const SERVICE_TYPE_VALUES = new Set(
  BK_SERVICE_TYPE_OPTIONS.map((option) => option.value),
);

export const EMPTY_BK_SERVICE_ATTENDANCE_FORM_VALUES: BkServiceAttendanceFormValues =
  {
    serviceDate: "",
    studentId: "",
    studentName: "",
    className: "",
    arrivalTime: "",
    finishTime: "",
    purpose: "Konseling Individu",
    serviceType: "Layanan Dasar",
    counselorName: "",
    description: "",
  };

export const INITIAL_BK_SERVICE_ATTENDANCE_FORM_STATE: BkServiceAttendanceFormState =
  {
    status: "idle",
    message: "",
    errors: {},
    values: EMPTY_BK_SERVICE_ATTENDANCE_FORM_VALUES,
  };

function getTextValue(formData: FormData, fieldName: string) {
  return String(formData.get(fieldName) ?? "").trim();
}

export function parseBkServiceAttendanceFormData(
  formData: FormData,
): BkServiceAttendanceFormValues {
  return {
    serviceDate: getTextValue(formData, "serviceDate"),
    studentId: getTextValue(formData, "studentId"),
    studentName: getTextValue(formData, "studentName"),
    className: getTextValue(formData, "className"),
    arrivalTime: getTextValue(formData, "arrivalTime"),
    finishTime: getTextValue(formData, "finishTime"),
    purpose: (getTextValue(formData, "purpose") ||
      "Konseling Individu") as BkServicePurpose,
    serviceType: (getTextValue(formData, "serviceType") ||
      "Layanan Dasar") as BkServiceType,
    counselorName: getTextValue(formData, "counselorName"),
    description: getTextValue(formData, "description"),
  };
}

export function validateBkServiceAttendanceForm(
  values: BkServiceAttendanceFormValues,
): BkServiceAttendanceFormErrors {
  const errors: BkServiceAttendanceFormErrors = {};

  if (!values.serviceDate) {
    errors.serviceDate = BASIC_VALIDATION_RULES.required;
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

  if (!values.arrivalTime) {
    errors.arrivalTime = BASIC_VALIDATION_RULES.required;
  }

  if (!values.finishTime) {
    errors.finishTime = BASIC_VALIDATION_RULES.required;
  }

  if (
    values.arrivalTime &&
    values.finishTime &&
    values.arrivalTime >= values.finishTime
  ) {
    errors.finishTime = "Jam selesai harus lebih besar dari jam datang";
  }

  if (!values.purpose) {
    errors.purpose = BASIC_VALIDATION_RULES.required;
  } else if (!PURPOSE_VALUES.has(values.purpose)) {
    errors.purpose = "Keperluan layanan BK tidak valid";
  }

  if (!values.serviceType) {
    errors.serviceType = BASIC_VALIDATION_RULES.required;
  } else if (!SERVICE_TYPE_VALUES.has(values.serviceType)) {
    errors.serviceType = "Jenis layanan BK tidak valid";
  }

  if (!values.counselorName) {
    errors.counselorName = BASIC_VALIDATION_RULES.required;
  }

  return errors;
}

export function createBkServiceAttendanceFormState(
  values: BkServiceAttendanceFormValues,
  errors: BkServiceAttendanceFormErrors = {},
  message = "",
): BkServiceAttendanceFormState {
  return {
    status: "error",
    message,
    errors,
    values,
  };
}
