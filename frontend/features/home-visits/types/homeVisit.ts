import type {
  HomeVisitFormValues,
  PaginationMeta,
  TableQueryParams,
} from "@/types/common";

export type HomeVisitItem = {
  id: string;
  visitDate: string;
  studentId: string;
  studentName: string;
  parentName: string;
  className: string;
  address: string;
  visitResult: string;
  followUp: string;
  documentationPath: string;
};

export type HomeVisitFilters = {
  month?: number;
  year?: number;
  className?: string;
  studentName?: string;
};

export type HomeVisitListQuery = TableQueryParams<HomeVisitFilters>;
export type HomeVisitListResult = {
  items: HomeVisitItem[];
  filters: HomeVisitFilters;
  pagination: PaginationMeta;
};

export type HomeVisitFormErrors = Partial<
  Record<keyof HomeVisitFormValues | "documentation", string>
>;

export type HomeVisitFormState = {
  status: "idle" | "error";
  message?: string;
  errors: HomeVisitFormErrors;
  values: HomeVisitFormValues;
};
