import type {
  ConfessionCategory,
  ConfessionFormValues,
  PaginationMeta,
  TableQueryParams,
} from "@/types/common";

export type ConfessionItem = {
  id: string;
  confessionDate: string;
  studentId: string;
  studentName: string;
  className: string;
  category: ConfessionCategory;
  content: string;
  description: string;
  createdBy: string;
};

export type ConfessionFilters = {
  category?: ConfessionCategory;
};

export type ConfessionListQuery = TableQueryParams<ConfessionFilters>;
export type ConfessionListResult = {
  items: ConfessionItem[];
  filters: ConfessionFilters;
  pagination: PaginationMeta;
};

export type ConfessionFormErrors = Partial<
  Record<keyof ConfessionFormValues, string>
>;

export type ConfessionFormState = {
  status: "idle" | "error";
  message?: string;
  errors: ConfessionFormErrors;
  values: ConfessionFormValues;
};
