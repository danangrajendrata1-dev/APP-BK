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
