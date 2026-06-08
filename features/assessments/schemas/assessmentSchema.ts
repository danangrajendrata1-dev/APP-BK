import { ASSESSMENT_TYPE_OPTIONS } from "@/lib/constants/options";
import type { AssessmentType } from "@/types/common";

import type {
  AssessmentFormErrors,
  AssessmentFormState,
  AssessmentFormValues,
} from "@/features/assessments/types/assessment";

const ASSESSMENT_TYPE_VALUES = new Set(
  ASSESSMENT_TYPE_OPTIONS.map((option) => option.value),
);

export const EMPTY_ASSESSMENT_FORM_VALUES: AssessmentFormValues = {
  assessmentType: "Angket Kebutuhan Siswa",
};

export const INITIAL_ASSESSMENT_FORM_STATE: AssessmentFormState = {
  status: "idle",
  message: "",
  errors: {},
  values: EMPTY_ASSESSMENT_FORM_VALUES,
};

function getTextValue(formData: FormData, fieldName: string) {
  return String(formData.get(fieldName) ?? "").trim();
}

export function parseAssessmentFormData(formData: FormData): AssessmentFormValues {
  return {
    assessmentType: (getTextValue(formData, "assessmentType") ||
      "Angket Kebutuhan Siswa") as AssessmentType,
  };
}

export function validateAssessmentForm(
  values: AssessmentFormValues,
  file: File | null,
): AssessmentFormErrors {
  const errors: AssessmentFormErrors = {};

  if (!values.assessmentType || !ASSESSMENT_TYPE_VALUES.has(values.assessmentType)) {
    errors.assessmentType = "Jenis asesmen tidak valid";
  }

  if (!file || file.size <= 0) {
    errors.fileAttachment = "File asesmen wajib diunggah";
  }

  return errors;
}

export function createAssessmentFormState(
  values: AssessmentFormValues,
  errors: AssessmentFormErrors = {},
  message = "",
): AssessmentFormState {
  return {
    status: "error",
    message,
    errors,
    values,
  };
}
