import { ASSISTANCE_CODE_OPTIONS } from "@/lib/constants/options";
import { BASIC_VALIDATION_RULES } from "@/types/common";
import type { AssistanceCode } from "@/types/common";
import type { StudentAssistanceDayValues, StudentAssistanceFormErrors, StudentAssistanceFormState, StudentAssistanceFormValues } from "@/features/student-assistances/types/studentAssistance";

const ASSISTANCE_VALUES = new Set(ASSISTANCE_CODE_OPTIONS.map((item) => item.value));

function createEmptyDays(): StudentAssistanceDayValues {
  return Object.fromEntries(
    Array.from({ length: 31 }, (_, index) => [`day${index + 1}`, ""]),
  ) as StudentAssistanceDayValues;
}

export const EMPTY_STUDENT_ASSISTANCE_FORM_VALUES: StudentAssistanceFormValues = {
  month: undefined,
  year: undefined,
  studentId: "",
  studentName: "",
  className: "",
  days: createEmptyDays(),
  description: "",
};

export const INITIAL_STUDENT_ASSISTANCE_FORM_STATE: StudentAssistanceFormState = {
  status: "idle",
  message: "",
  errors: {},
  values: EMPTY_STUDENT_ASSISTANCE_FORM_VALUES,
};

function getTextValue(formData: FormData, fieldName: string) {
  return String(formData.get(fieldName) ?? "").trim();
}

export function parseStudentAssistanceFormData(formData: FormData): StudentAssistanceFormValues {
  const days = createEmptyDays();
  for (let day = 1; day <= 31; day += 1) {
    const rawValue = getTextValue(formData, `day${day}`);
    days[`day${day}`] = rawValue ? (rawValue as AssistanceCode) : "";
  }

  const month = Number(getTextValue(formData, "month"));
  const year = Number(getTextValue(formData, "year"));

  return {
    month: Number.isFinite(month) && month > 0 ? month : undefined,
    year: Number.isFinite(year) && year > 0 ? year : undefined,
    studentId: getTextValue(formData, "studentId"),
    studentName: getTextValue(formData, "studentName"),
    className: getTextValue(formData, "className"),
    days,
    description: getTextValue(formData, "description"),
  };
}

export function calculateStudentAssistanceTotal(days: StudentAssistanceDayValues) {
  return Object.values(days).filter((value) => value && ASSISTANCE_VALUES.has(value)).length;
}

export function validateStudentAssistanceForm(values: StudentAssistanceFormValues): StudentAssistanceFormErrors {
  const errors: StudentAssistanceFormErrors = {};
  if (!values.month || values.month < 1 || values.month > 12) errors.month = "Bulan harus antara 1 sampai 12";
  if (!values.year) errors.year = BASIC_VALIDATION_RULES.required;
  if (!values.studentId) errors.studentId = "Pilih siswa terlebih dahulu";
  if (!values.studentName) errors.studentName = "Nama siswa belum terisi";
  if (!values.className) errors.className = "Kelas belum terisi";
  return errors;
}

export function createStudentAssistanceFormState(
  values: StudentAssistanceFormValues,
  errors: StudentAssistanceFormErrors = {},
  message = "",
): StudentAssistanceFormState {
  return { status: "error", message, errors, values };
}
