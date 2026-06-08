import {
  COUNSELING_MEDIA_OPTIONS,
  COUNSELING_TYPE_OPTIONS,
} from "@/lib/constants/options";
import {
  BASIC_VALIDATION_RULES,
  type CounselingMedia,
  type CounselingRecordFormValues,
  type CounselingType,
} from "@/types/common";

import type {
  CounselingRecordFormErrors,
  CounselingRecordFormState,
} from "@/features/counseling-records/types/counselingRecord";

const MEDIA_VALUES = new Set(COUNSELING_MEDIA_OPTIONS.map((item) => item.value));
const TYPE_VALUES = new Set(COUNSELING_TYPE_OPTIONS.map((item) => item.value));

export const EMPTY_COUNSELING_RECORD_FORM_VALUES: CounselingRecordFormValues = {
  counselingDate: "",
  studentId: "",
  studentName: "",
  className: "",
  meetingNumber: undefined,
  media: "Offline",
  counselingType: "Individu",
  topic: "",
  counselingResult: "",
  followUp: "",
  description: "",
};

export const INITIAL_COUNSELING_RECORD_FORM_STATE: CounselingRecordFormState = {
  status: "idle",
  message: "",
  errors: {},
  values: EMPTY_COUNSELING_RECORD_FORM_VALUES,
};

function getTextValue(formData: FormData, fieldName: string) {
  return String(formData.get(fieldName) ?? "").trim();
}

export function parseCounselingRecordFormData(
  formData: FormData,
): CounselingRecordFormValues {
  const meetingNumberValue = getTextValue(formData, "meetingNumber");
  return {
    counselingDate: getTextValue(formData, "counselingDate"),
    studentId: getTextValue(formData, "studentId"),
    studentName: getTextValue(formData, "studentName"),
    className: getTextValue(formData, "className"),
    meetingNumber: meetingNumberValue ? Number(meetingNumberValue) : undefined,
    media: (getTextValue(formData, "media") || "Offline") as CounselingMedia,
    counselingType: (getTextValue(formData, "counselingType") ||
      "Individu") as CounselingType,
    topic: getTextValue(formData, "topic"),
    counselingResult: getTextValue(formData, "counselingResult"),
    followUp: getTextValue(formData, "followUp"),
    description: getTextValue(formData, "description"),
  };
}

export function validateCounselingRecordForm(
  values: CounselingRecordFormValues,
): CounselingRecordFormErrors {
  const errors: CounselingRecordFormErrors = {};

  if (!values.counselingDate) errors.counselingDate = BASIC_VALIDATION_RULES.required;
  if (!values.studentId) errors.studentId = "Pilih siswa terlebih dahulu";
  if (!values.studentName) errors.studentName = "Nama siswa belum terisi";
  if (!values.className) errors.className = "Kelas belum terisi";
  if (!values.meetingNumber || values.meetingNumber < 1) {
    errors.meetingNumber = "Pertemuan ke- minimal 1";
  }
  if (!values.media) {
    errors.media = BASIC_VALIDATION_RULES.required;
  } else if (!MEDIA_VALUES.has(values.media)) {
    errors.media = "Media konseling tidak valid";
  }
  if (!values.counselingType) {
    errors.counselingType = BASIC_VALIDATION_RULES.required;
  } else if (!TYPE_VALUES.has(values.counselingType)) {
    errors.counselingType = "Jenis konseling tidak valid";
  }
  if (!values.topic) errors.topic = BASIC_VALIDATION_RULES.required;
  if (!values.counselingResult) errors.counselingResult = BASIC_VALIDATION_RULES.required;
  if (!values.followUp) errors.followUp = BASIC_VALIDATION_RULES.required;

  return errors;
}

export function createCounselingRecordFormState(
  values: CounselingRecordFormValues,
  errors: CounselingRecordFormErrors = {},
  message = "",
): CounselingRecordFormState {
  return {
    status: "error",
    message,
    errors,
    values,
  };
}
