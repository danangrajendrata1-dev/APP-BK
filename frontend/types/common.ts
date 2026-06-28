import type {
  BK_SERVICE_PURPOSE_OPTIONS,
  CONFESSION_CATEGORY_OPTIONS,
  ROLE_OPTIONS,
  SCHOOL_ATTENDANCE_STATUS_OPTIONS,
  STUDENT_STATUS_OPTIONS,
  SelectOption,
} from "@/lib/constants/options";

export type AppRole = (typeof ROLE_OPTIONS)[number]["value"];

export type StudentStatus = (typeof STUDENT_STATUS_OPTIONS)[number]["value"];
export type SchoolAttendanceStatus =
  (typeof SCHOOL_ATTENDANCE_STATUS_OPTIONS)[number]["value"];
export type BkServicePurpose =
  (typeof BK_SERVICE_PURPOSE_OPTIONS)[number]["value"];
export type ConfessionCategory =
  (typeof CONFESSION_CATEGORY_OPTIONS)[number]["value"];

export type OptionItem<T extends string = string> = SelectOption<T>;

export type PaginationParams = {
  page: number;
  pageSize: number;
};

export type PaginationMeta = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

export type SearchParams = {
  query?: string;
};

export type DateRangeFilter = {
  startDate?: string;
  endDate?: string;
};

export type StudentBaseFilter = SearchParams & {
  className?: string;
  status?: StudentStatus;
};

export type MonthlyFilter = {
  month?: number;
  year?: number;
};

export type TableQueryParams<TFilter = Record<string, unknown>> =
  PaginationParams & {
    filters?: TFilter;
    sortBy?: string;
    sortDirection?: "asc" | "desc";
  };

export type StudentFormValues = {
  nisn: string;
  fullName: string;
  gender: string;
  className: string;
  birthPlaceDate: string;
  birthPlace: string;
  birthDate: string;
  address: string;
  phone: string;
  parentName: string;
  status: StudentStatus;
};

export type SchoolAttendanceFormValues = {
  studentId?: string;
  studentName: string;
  className: string;
  month: string;
  year: string;
  day: string;
  status: SchoolAttendanceStatus;
  description: string;
};

export type BkServiceAttendanceFormValues = {
  serviceDate: string;
  studentId?: string;
  studentName: string;
  className: string;
  purpose: BkServicePurpose;
  description: string;
  result: string;
  followUp: string;
  signature: string;
};

export type CounselingRecordFormValues = {
  studentId: string;
  studentName: string;
  className: string;
  violationCode: string;
  violationDay: string;
  violationMonth: string;
  violationYear: string;
  description: string;
};

export type ClassAssistanceFormValues = {
  studentId?: string;
  studentName: string;
  className: string;
  violationType: string;
  actionForm: string;
  remission: string;
  description: string;
  finalWarningLetter: string;
};

export type DocumentFormValues = {
  title: string;
  description: string;
};

export type ConfessionFormValues = {
  confessionDate: string;
  studentName?: string;
  className: string;
  category: ConfessionCategory;
  content: string;
  description: string;
};

export const BASIC_VALIDATION_RULES = {
  required: "Wajib diisi",
  email: "Format email tidak valid",
  minPasswordLength: 6,
  minPasswordMessage: "Password minimal 6 karakter",
  maxTextareaLength: 5000,
} as const;
