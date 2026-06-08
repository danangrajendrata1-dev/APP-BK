import type {
  BkServiceAttendanceFormValues,
  BkServicePurpose,
  BkServiceType,
  PaginationMeta,
  TableQueryParams,
} from "@/types/common";

export type BkServiceAttendanceItem = {
  id: string;
  serviceDate: string;
  studentId: string;
  studentName: string;
  className: string;
  arrivalTime: string;
  finishTime: string;
  purpose: BkServicePurpose;
  serviceType: BkServiceType;
  counselorName: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type BkServiceAttendanceFilters = {
  month?: number;
  year?: number;
  className?: string;
  purpose?: BkServicePurpose;
  serviceType?: BkServiceType;
  counselorName?: string;
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
  status: "idle" | "error";
  message?: string;
  errors: BkServiceAttendanceFormErrors;
  values: BkServiceAttendanceFormValues;
};
