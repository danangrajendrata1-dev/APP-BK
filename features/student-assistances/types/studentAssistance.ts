import type { AssistanceCode, PaginationMeta, TableQueryParams } from "@/types/common";

export type StudentAssistanceDayValues = Record<`day${number}`, AssistanceCode | "" | undefined>;

export type StudentAssistanceFormValues = {
  month: number | undefined;
  year: number | undefined;
  studentId?: string;
  studentName: string;
  className: string;
  days: StudentAssistanceDayValues;
  description: string;
};

export type StudentAssistanceItem = {
  id: string;
  month: number;
  year: number;
  studentId: string;
  studentName: string;
  className: string;
  days: StudentAssistanceDayValues;
  total: number;
  description: string;
};

export type StudentAssistanceFilters = {
  className?: string;
  month?: number;
  year?: number;
};

export type StudentAssistanceListQuery = TableQueryParams<StudentAssistanceFilters>;
export type StudentAssistanceListResult = {
  items: StudentAssistanceItem[];
  filters: StudentAssistanceFilters;
  pagination: PaginationMeta;
};

export type StudentAssistanceFormErrors = Partial<Record<"month" | "year" | "studentId" | "studentName" | "className", string>>;
export type StudentAssistanceFormState = {
  status: "idle" | "error";
  message?: string;
  errors: StudentAssistanceFormErrors;
  values: StudentAssistanceFormValues;
};
