import {
  BASIC_VALIDATION_RULES,
  type DocumentFormValues,
} from "@/types/common";

import type {
  DocumentFormErrors,
  DocumentFormState,
} from "@/features/documents/types/document";

export const EMPTY_DOCUMENT_FORM_VALUES: DocumentFormValues = {
  title: "",
  description: "",
};

export const INITIAL_DOCUMENT_FORM_STATE: DocumentFormState = {
  status: "idle",
  message: "",
  errors: {},
  values: EMPTY_DOCUMENT_FORM_VALUES,
};

function getTextValue(formData: FormData, fieldName: string) {
  return String(formData.get(fieldName) ?? "").trim();
}

export function parseDocumentFormData(formData: FormData): DocumentFormValues {
  return {
    title: getTextValue(formData, "title"),
    description: getTextValue(formData, "description"),
  };
}

export function validateDocumentForm(
  values: DocumentFormValues,
  file: File | null,
): DocumentFormErrors {
  const errors: DocumentFormErrors = {};

  if (!values.title) errors.title = BASIC_VALIDATION_RULES.required;
  if (!file || file.size <= 0) {
    errors.fileAttachment = "File lampiran wajib diunggah";
  }

  return errors;
}

export function createDocumentFormState(
  values: DocumentFormValues,
  errors: DocumentFormErrors = {},
  message = "",
): DocumentFormState {
  return {
    status: "error",
    message,
    errors,
    values,
  };
}
