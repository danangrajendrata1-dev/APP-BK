import type {
  BkServiceAttendanceFormValues,
  BkServicePurpose,
  PaginationMeta,
  TableQueryParams,
} from "@/types/common";

export type BkServiceAttendanceItem = {
  id: string;
  serviceDate: string;
  studentId: string;
  studentName: string;
  className: string;
  purpose: BkServicePurpose;
  description: string;
  result: string;
  followUp: string;
  signature: string;
  createdAt: string;
  updatedAt: string;
};

export type BkServiceAttendanceFilters = {
  month?: number;
  year?: number;
  className?: string;
  purpose?: BkServicePurpose;
};

export type BkServiceAttendanceListQuery =
  TableQueryParams<BkServiceAttendanceFilters>;

export type BkServiceAttendanceListResult = {
  items: BkServiceAttendanceItem[];
  filters: BkServiceAttendanceFilters;
  pagination: PaginationMeta;
};

export type BkServiceAttendanceFormErrors = Partial<
  Record<keyof BkServiceAttendanceFormValues, string>
>;

export type BkServiceAttendanceFormState = {
  status: "idle" | "error" | "success";
  message?: string;
  errors: BkServiceAttendanceFormErrors;
  values: BkServiceAttendanceFormValues;
};
