import type {
  ASSESSMENT_TYPE_OPTIONS,
  ASSISTANCE_CODE_OPTIONS,
  BK_SERVICE_PURPOSE_OPTIONS,
  BK_SERVICE_TYPE_OPTIONS,
  CONFESSION_CATEGORY_OPTIONS,
  COUNSELING_MEDIA_OPTIONS,
  COUNSELING_TYPE_OPTIONS,
  DOCUMENT_TYPE_OPTIONS,
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
export type BkServiceType =
  (typeof BK_SERVICE_TYPE_OPTIONS)[number]["value"];
export type CounselingMedia =
  (typeof COUNSELING_MEDIA_OPTIONS)[number]["value"];
export type CounselingType =
  (typeof COUNSELING_TYPE_OPTIONS)[number]["value"];
export type AssistanceCode =
  (typeof ASSISTANCE_CODE_OPTIONS)[number]["value"];
export type DocumentType = (typeof DOCUMENT_TYPE_OPTIONS)[number]["value"];
export type ConfessionCategory =
  (typeof CONFESSION_CATEGORY_OPTIONS)[number]["value"];
export type AssessmentType = (typeof ASSESSMENT_TYPE_OPTIONS)[number]["value"];

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
  major?: string;
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
  major: string;
  birthPlaceDate: string;
  address: string;
  phone: string;
  parentName: string;
  parentPhone: string;
  status: StudentStatus;
};

export type SchoolAttendanceFormValues = {
  attendanceDate: string;
  studentId?: string;
  studentName: string;
  className: string;
  status: SchoolAttendanceStatus;
  description: string;
};

export type BkServiceAttendanceFormValues = {
  serviceDate: string;
  studentId?: string;
  studentName: string;
  className: string;
  arrivalTime: string;
  finishTime: string;
  purpose: BkServicePurpose;
  serviceType: BkServiceType;
  counselorName: string;
  description: string;
};

export type CounselingRecordFormValues = {
  counselingDate: string;
  studentId?: string;
  studentName: string;
  className: string;
  meetingNumber?: number;
  media: CounselingMedia;
  counselingType: CounselingType;
  topic: string;
  counselingResult: string;
  followUp: string;
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
  letterNumber: string;
  documentDate: string;
  studentId?: string;
  studentName: string;
  className: string;
  documentType: DocumentType;
  description: string;
};

export type HomeVisitFormValues = {
  visitDate: string;
  studentId?: string;
  studentName: string;
  parentName: string;
  className: string;
  address: string;
  visitResult: string;
  followUp: string;
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
