import {
  BK_SERVICE_PURPOSE_OPTIONS,
} from "@/lib/constants/options";
import {
  BASIC_VALIDATION_RULES,
  type BkServiceAttendanceFormValues,
  type BkServicePurpose,
} from "@/types/common";

import type {
  BkServiceAttendanceFormErrors,
  BkServiceAttendanceFormState,
} from "@/features/bk-service-attendance/types/bkServiceAttendance";

const PURPOSE_VALUES = new Set(
  BK_SERVICE_PURPOSE_OPTIONS.map((option) => option.value),
);

export const EMPTY_BK_SERVICE_ATTENDANCE_FORM_VALUES: BkServiceAttendanceFormValues =
  {
    serviceDate: "",
    studentId: "",
    studentName: "",
    className: "",
    purpose: "Konseling Individu",
    description: "",
    result: "",
    followUp: "",
    signature: "",
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
    purpose: (getTextValue(formData, "purpose") ||
      "Konseling Individu") as BkServicePurpose,
    description: getTextValue(formData, "description"),
    result: getTextValue(formData, "result"),
    followUp: getTextValue(formData, "followUp"),
    signature: getTextValue(formData, "signature"),
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

  if (!values.purpose) {
    errors.purpose = BASIC_VALIDATION_RULES.required;
  } else if (!PURPOSE_VALUES.has(values.purpose)) {
    errors.purpose = "Keperluan layanan BK tidak valid";
  }

  if (!values.description) errors.description = BASIC_VALIDATION_RULES.required;
  if (!values.result) errors.result = BASIC_VALIDATION_RULES.required;
  if (!values.followUp) errors.followUp = BASIC_VALIDATION_RULES.required;
  if (!values.signature) errors.signature = BASIC_VALIDATION_RULES.required;

  return errors;
}

export function createBkServiceAttendanceFormState(
  values: BkServiceAttendanceFormValues,
  errors: BkServiceAttendanceFormErrors = {},
  message = "",
  status: "error" | "success" = "error",
): BkServiceAttendanceFormState {
  return {
    status,
    message,
    errors,
    values,
  };
}
