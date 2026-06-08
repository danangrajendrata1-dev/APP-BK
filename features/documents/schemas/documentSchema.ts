import { DOCUMENT_TYPE_OPTIONS } from "@/lib/constants/options";
import {
  BASIC_VALIDATION_RULES,
  type DocumentFormValues,
  type DocumentType,
} from "@/types/common";

import type {
  DocumentFormErrors,
  DocumentFormState,
} from "@/features/documents/types/document";

const DOCUMENT_TYPE_VALUES = new Set(
  DOCUMENT_TYPE_OPTIONS.map((option) => option.value),
);

export const EMPTY_DOCUMENT_FORM_VALUES: DocumentFormValues = {
  letterNumber: "",
  documentDate: "",
  studentId: "",
  studentName: "",
  className: "",
  documentType: "Surat Panggilan Orang Tua",
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
    letterNumber: getTextValue(formData, "letterNumber"),
    documentDate: getTextValue(formData, "documentDate"),
    studentId: getTextValue(formData, "studentId"),
    studentName: getTextValue(formData, "studentName"),
    className: getTextValue(formData, "className"),
    documentType: (getTextValue(formData, "documentType") ||
      "Surat Panggilan Orang Tua") as DocumentType,
    description: getTextValue(formData, "description"),
  };
}

export function validateDocumentForm(
  values: DocumentFormValues,
  file: File | null,
): DocumentFormErrors {
  const errors: DocumentFormErrors = {};

  if (!values.letterNumber) errors.letterNumber = BASIC_VALIDATION_RULES.required;
  if (!values.documentDate) errors.documentDate = BASIC_VALIDATION_RULES.required;
  if (!values.studentId) errors.studentId = "Pilih siswa terlebih dahulu";
  if (!values.studentName) errors.studentName = "Nama siswa belum terisi";
  if (!values.className) errors.className = "Kelas belum terisi";
  if (!values.documentType) {
    errors.documentType = BASIC_VALIDATION_RULES.required;
  } else if (!DOCUMENT_TYPE_VALUES.has(values.documentType)) {
    errors.documentType = "Jenis surat tidak valid";
  }
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
