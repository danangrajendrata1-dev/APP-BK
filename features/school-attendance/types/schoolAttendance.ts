import type {
  SchoolAttendanceFormValues,
} from "@/types/common";

export type StudentReference = {
  id: string;
  fullName: string;
  className: string;
  parentName?: string;
  address?: string;
};

export type SchoolAttendanceFilters = {
  month?: number;
  year?: number;
  className?: string;
};

export type SchoolAttendanceGridRow = {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  days: string[];
  totalS: number;
  totalI: number;
  totalA: number;
  description: string;
};

export type SchoolAttendanceListResult = {
  items: SchoolAttendanceGridRow[];
  filters: SchoolAttendanceFilters;
  month: number;
  year: number;
  className: string;
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
