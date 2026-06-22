import { BASIC_VALIDATION_RULES, type ClassAssistanceFormValues } from "@/types/common";
import type { ClassAssistanceFormErrors, ClassAssistanceFormState } from "@/features/class-assistances/types/classAssistance";

export const EMPTY_CLASS_ASSISTANCE_FORM_VALUES: ClassAssistanceFormValues = {
  studentId: "",
  studentName: "",
  className: "",
  violationType: "",
  actionForm: "",
  remission: "",
  description: "",
  finalWarningLetter: "",
};

export const INITIAL_CLASS_ASSISTANCE_FORM_STATE: ClassAssistanceFormState = {
  status: "idle",
  message: "",
  errors: {},
  values: EMPTY_CLASS_ASSISTANCE_FORM_VALUES,
};

function getTextValue(formData: FormData, fieldName: string) {
  return String(formData.get(fieldName) ?? "").trim();
}

export function parseClassAssistanceFormData(formData: FormData): ClassAssistanceFormValues {
  return {
    studentId: getTextValue(formData, "studentId"),
    studentName: getTextValue(formData, "studentName"),
    className: getTextValue(formData, "className"),
    violationType: getTextValue(formData, "violationType"),
    actionForm: getTextValue(formData, "actionForm"),
    remission: getTextValue(formData, "remission"),
    description: getTextValue(formData, "description"),
    finalWarningLetter: getTextValue(formData, "finalWarningLetter"),
  };
}

export function validateClassAssistanceForm(values: ClassAssistanceFormValues): ClassAssistanceFormErrors {
  const errors: ClassAssistanceFormErrors = {};
  if (!values.studentId) errors.studentId = "Pilih siswa terlebih dahulu";
  if (!values.studentName) errors.studentName = "Nama siswa belum terisi";
  if (!values.className) errors.className = "Kelas belum terisi";
  if (!values.violationType) errors.violationType = BASIC_VALIDATION_RULES.required;
  if (!values.actionForm) errors.actionForm = BASIC_VALIDATION_RULES.required;
  if (!values.remission) errors.remission = BASIC_VALIDATION_RULES.required;
  if (!values.description) errors.description = BASIC_VALIDATION_RULES.required;
  if (!values.finalWarningLetter) errors.finalWarningLetter = BASIC_VALIDATION_RULES.required;
  return errors;
}

export function createClassAssistanceFormState(
  values: ClassAssistanceFormValues,
  errors: ClassAssistanceFormErrors = {},
  message = "",
): ClassAssistanceFormState {
  return { status: "error", message, errors, values };
}
