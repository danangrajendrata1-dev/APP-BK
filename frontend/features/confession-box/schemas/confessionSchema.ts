import { CONFESSION_CATEGORY_OPTIONS } from "@/lib/constants/options";
import {
  BASIC_VALIDATION_RULES,
  type ConfessionCategory,
  type ConfessionFormValues,
} from "@/types/common";

import type {
  ConfessionFormErrors,
  ConfessionFormState,
} from "@/features/confession-box/types/confession";

const CONFESSION_CATEGORY_VALUES = new Set(
  CONFESSION_CATEGORY_OPTIONS.map((option) => option.value),
);

export const EMPTY_CONFESSION_FORM_VALUES: ConfessionFormValues = {
  confessionDate: "",
  studentName: "",
  className: "",
  category: "Pribadi",
  content: "",
  description: "",
};

export const INITIAL_CONFESSION_FORM_STATE: ConfessionFormState = {
  status: "idle",
  message: "",
  errors: {},
  values: EMPTY_CONFESSION_FORM_VALUES,
};

function getTextValue(formData: FormData, fieldName: string) {
  return String(formData.get(fieldName) ?? "").trim();
}

export function parseConfessionFormData(formData: FormData): ConfessionFormValues {
  return {
    confessionDate: getTextValue(formData, "confessionDate"),
    studentName: getTextValue(formData, "studentName"),
    className: getTextValue(formData, "className"),
    category: (getTextValue(formData, "category") || "Pribadi") as ConfessionCategory,
    content: getTextValue(formData, "content"),
    description: getTextValue(formData, "description"),
  };
}

export function validateConfessionForm(
  values: ConfessionFormValues,
): ConfessionFormErrors {
  const errors: ConfessionFormErrors = {};
  if (!values.confessionDate) errors.confessionDate = BASIC_VALIDATION_RULES.required;
  if (!values.className) errors.className = BASIC_VALIDATION_RULES.required;
  if (!values.category) {
    errors.category = BASIC_VALIDATION_RULES.required;
  } else if (!CONFESSION_CATEGORY_VALUES.has(values.category)) {
    errors.category = "Kategori curhat tidak valid";
  }
  if (!values.content) errors.content = "Isi curhat wajib diisi";
  return errors;
}

export function createConfessionFormState(
  values: ConfessionFormValues,
  errors: ConfessionFormErrors = {},
  message = "",
): ConfessionFormState {
  return {
    status: "error",
    message,
    errors,
    values,
  };
}
