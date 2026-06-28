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
  birthPlaceDate: "",
  birthPlace: "",
  birthDate: "",
  address: "",
  phone: "",
  parentName: "",
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
  const birthPlace = getTextValue(formData, "birthPlace");
  const birthDate = getTextValue(formData, "birthDate");
  
  let birthPlaceDate = "";
  if (birthPlace && birthDate) {
    birthPlaceDate = `${birthPlace}, ${birthDate}`;
  } else if (birthPlace) {
    birthPlaceDate = birthPlace;
  } else if (birthDate) {
    birthPlaceDate = birthDate;
  }

  return {
    nisn: getTextValue(formData, "nisn"),
    fullName: getTextValue(formData, "fullName"),
    gender: getTextValue(formData, "gender"),
    className: getTextValue(formData, "className"),
    birthPlaceDate,
    birthPlace,
    birthDate,
    address: getTextValue(formData, "address"),
    phone: getTextValue(formData, "phone"),
    parentName: getTextValue(formData, "parentName"),
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
  } else if (!["Laki-laki", "Perempuan"].includes(values.gender)) {
    errors.gender = "Jenis kelamin tidak valid";
  }

  if (!values.className) {
    errors.className = BASIC_VALIDATION_RULES.required;
  }

  if (!values.birthPlace) {
    errors.birthPlace = BASIC_VALIDATION_RULES.required;
  }

  if (!values.birthDate) {
    errors.birthDate = BASIC_VALIDATION_RULES.required;
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
