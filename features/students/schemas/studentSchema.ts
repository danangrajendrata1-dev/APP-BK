import { STUDENT_STATUS_OPTIONS } from "@/lib/constants/options";
import {
  BASIC_VALIDATION_RULES,
  type StudentFormValues,
  type StudentStatus,
} from "@/types/common";

import type {
  StudentFormErrors,
  StudentFormState,
} from "@/features/students/types/student";

const STUDENT_STATUS_VALUES = new Set(
  STUDENT_STATUS_OPTIONS.map((option) => option.value),
);

export const EMPTY_STUDENT_FORM_VALUES: StudentFormValues = {
  nisn: "",
  fullName: "",
  gender: "",
  className: "",
  major: "",
  birthPlaceDate: "",
  address: "",
  phone: "",
  parentName: "",
  parentPhone: "",
  status: "Aktif",
};

export const INITIAL_STUDENT_FORM_STATE: StudentFormState = {
  status: "idle",
  message: "",
  errors: {},
  values: EMPTY_STUDENT_FORM_VALUES,
};

function getTextValue(formData: FormData, fieldName: string) {
  return String(formData.get(fieldName) ?? "").trim();
}

export function parseStudentFormData(formData: FormData): StudentFormValues {
  return {
    nisn: getTextValue(formData, "nisn"),
    fullName: getTextValue(formData, "fullName"),
    gender: getTextValue(formData, "gender"),
    className: getTextValue(formData, "className"),
    major: getTextValue(formData, "major"),
    birthPlaceDate: getTextValue(formData, "birthPlaceDate"),
    address: getTextValue(formData, "address"),
    phone: getTextValue(formData, "phone"),
    parentName: getTextValue(formData, "parentName"),
    parentPhone: getTextValue(formData, "parentPhone"),
    status: (getTextValue(formData, "status") || "Aktif") as StudentStatus,
  };
}

export function validateStudentForm(
  values: StudentFormValues,
): StudentFormErrors {
  const errors: StudentFormErrors = {};

  if (!values.nisn) {
    errors.nisn = BASIC_VALIDATION_RULES.required;
  }

  if (!values.fullName) {
    errors.fullName = BASIC_VALIDATION_RULES.required;
  }

  if (!values.gender) {
    errors.gender = BASIC_VALIDATION_RULES.required;
  }

  if (!values.className) {
    errors.className = BASIC_VALIDATION_RULES.required;
  }

  if (!values.major) {
    errors.major = BASIC_VALIDATION_RULES.required;
  }

  if (!values.birthPlaceDate) {
    errors.birthPlaceDate = BASIC_VALIDATION_RULES.required;
  }

  if (!values.address) {
    errors.address = BASIC_VALIDATION_RULES.required;
  }

  if (!values.phone) {
    errors.phone = BASIC_VALIDATION_RULES.required;
  }

  if (!values.parentName) {
    errors.parentName = BASIC_VALIDATION_RULES.required;
  }

  if (!values.parentPhone) {
    errors.parentPhone = BASIC_VALIDATION_RULES.required;
  }

  if (!values.status) {
    errors.status = BASIC_VALIDATION_RULES.required;
  } else if (!STUDENT_STATUS_VALUES.has(values.status)) {
    errors.status = "Status siswa tidak valid";
  }

  return errors;
}

export function createStudentFormState(
  values: StudentFormValues,
  errors: StudentFormErrors = {},
  message = "",
): StudentFormState {
  return {
    status: "error",
    message,
    errors,
    values,
  };
}
