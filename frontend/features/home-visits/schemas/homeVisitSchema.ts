import {
  BASIC_VALIDATION_RULES,
  type HomeVisitFormValues,
} from "@/types/common";

import type {
  HomeVisitFormErrors,
  HomeVisitFormState,
} from "@/features/home-visits/types/homeVisit";

export const EMPTY_HOME_VISIT_FORM_VALUES: HomeVisitFormValues = {
  visitDate: "",
  studentId: "",
  studentName: "",
  parentName: "",
  className: "",
  address: "",
  visitResult: "",
  followUp: "",
};

export const INITIAL_HOME_VISIT_FORM_STATE: HomeVisitFormState = {
  status: "idle",
  message: "",
  errors: {},
  values: EMPTY_HOME_VISIT_FORM_VALUES,
};

function getTextValue(formData: FormData, fieldName: string) {
  return String(formData.get(fieldName) ?? "").trim();
}

export function parseHomeVisitFormData(formData: FormData): HomeVisitFormValues {
  return {
    visitDate: getTextValue(formData, "visitDate"),
    studentId: getTextValue(formData, "studentId"),
    studentName: getTextValue(formData, "studentName"),
    parentName: getTextValue(formData, "parentName"),
    className: getTextValue(formData, "className"),
    address: getTextValue(formData, "address"),
    visitResult: getTextValue(formData, "visitResult"),
    followUp: getTextValue(formData, "followUp"),
  };
}

export function validateHomeVisitForm(
  values: HomeVisitFormValues,
  file: File | null,
): HomeVisitFormErrors {
  const errors: HomeVisitFormErrors = {};
  if (!values.visitDate) errors.visitDate = BASIC_VALIDATION_RULES.required;
  if (!values.studentId) errors.studentId = "Pilih siswa terlebih dahulu";
  if (!values.studentName) errors.studentName = "Nama siswa belum terisi";
  if (!values.parentName) errors.parentName = BASIC_VALIDATION_RULES.required;
  if (!values.className) errors.className = "Kelas belum terisi";
  if (!values.address) errors.address = BASIC_VALIDATION_RULES.required;
  if (!values.visitResult) errors.visitResult = BASIC_VALIDATION_RULES.required;
  if (!values.followUp) errors.followUp = BASIC_VALIDATION_RULES.required;
  if (!file || file.size <= 0) errors.documentation = "Dokumentasi wajib diunggah";
  return errors;
}

export function createHomeVisitFormState(
  values: HomeVisitFormValues,
  errors: HomeVisitFormErrors = {},
  message = "",
): HomeVisitFormState {
  return {
    status: "error",
    message,
    errors,
    values,
  };
}
