import type { AssessmentType, PaginationMeta, TableQueryParams } from "@/types/common";

export type AssessmentFileItem = {
  id: string;
  title: string;
  assessmentType: AssessmentType;
  filePath: string;
  description: string;
  updatedAt: string;
};

export type AssessmentFilters = {
  assessmentType?: AssessmentType;
};

export type AssessmentListQuery = TableQueryParams<AssessmentFilters>;

export type AssessmentListResult = {
  items: AssessmentFileItem[];
  filters: AssessmentFilters;
  pagination: PaginationMeta;
};

export type AssessmentFormValues = {
  assessmentType: AssessmentType;
};

export type AssessmentFormErrors = Partial<
  Record<keyof AssessmentFormValues | "fileAttachment", string>
>;

export type AssessmentFormState = {
  status: "idle" | "error";
  message?: string;
  errors: AssessmentFormErrors;
  values: AssessmentFormValues;
};
