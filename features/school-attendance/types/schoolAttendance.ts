import type {
  PaginationMeta,
  SchoolAttendanceFormValues,
  SchoolAttendanceStatus,
  TableQueryParams,
} from "@/types/common";

export type StudentReference = {
  id: string;
  fullName: string;
  className: string;
  parentName?: string;
  address?: string;
};

export type SchoolAttendanceItem = {
  id: string;
  attendanceDate: string;
  studentId: string;
  studentName: string;
  className: string;
  status: SchoolAttendanceStatus;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type SchoolAttendanceFilters = {
  month?: number;
  year?: number;
  className?: string;
  status?: SchoolAttendanceStatus;
};

export type SchoolAttendanceListQuery =
  TableQueryParams<SchoolAttendanceFilters>;

export type SchoolAttendanceListResult = {
  items: SchoolAttendanceItem[];
  filters: SchoolAttendanceFilters;
  pagination: PaginationMeta;
};

export type SchoolAttendanceFormErrors = Partial<
  Record<keyof SchoolAttendanceFormValues, string>
>;

export type SchoolAttendanceFormState = {
  status: "idle" | "error";
  message?: string;
  errors: SchoolAttendanceFormErrors;
  values: SchoolAttendanceFormValues;
};
