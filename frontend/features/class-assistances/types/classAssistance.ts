import type { ClassAssistanceFormValues, PaginationMeta, TableQueryParams } from "@/types/common";

export type ClassAssistanceItem = {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  violationType: string;
  actionForm: string;
  remission: string;
  description: string;
  finalWarningLetter: string;
};

export type ClassAssistanceFilters = {
  className?: string;
  violationType?: string;
  finalWarningLetter?: string;
};

export type RecapViolationCode = "T" | "S" | "D" | "R" | "RK" | "K" | "M" | "L";
export type RecapActionCode = "kontrak" | "sp1" | "sp2" | "sp3";
export type RecapFinalWarningLetter = "SP 1" | "SP 2" | "SP 3";

export type ClassAssistanceRecapFilters = {
  className?: string;
  violationType?: RecapViolationCode | "";
  finalWarningLetter?: RecapFinalWarningLetter | "";
};

export type ClassAssistanceRecapItem = {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  violationCounts: Record<RecapViolationCode, number>;
  actionCounts: Record<RecapActionCode, number>;
  remission: string;
  description: string;
  finalWarningLetter: string;
};

export type ClassAssistanceRecapQuery = {
  page: number;
  pageSize: number;
  filters: ClassAssistanceRecapFilters;
};

export type ClassAssistanceRecapResult = {
  items: ClassAssistanceRecapItem[];
  filters: ClassAssistanceRecapFilters;
  pagination: PaginationMeta;
};

export type ClassAssistanceListQuery = TableQueryParams<ClassAssistanceFilters>;
export type ClassAssistanceListResult = {
  items: ClassAssistanceItem[];
  filters: ClassAssistanceFilters;
  pagination: PaginationMeta;
};

export type ClassAssistanceFormErrors = Partial<Record<keyof ClassAssistanceFormValues, string>>;
export type ClassAssistanceFormState = {
  status: "idle" | "error";
  message?: string;
  errors: ClassAssistanceFormErrors;
  values: ClassAssistanceFormValues;
};
