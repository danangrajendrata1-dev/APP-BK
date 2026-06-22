import type {
  CounselingRecordFormValues,
  PaginationMeta,
  TableQueryParams,
} from "@/types/common";

export type CounselingRecordCode =
  | "T"
  | "S"
  | "D"
  | "R"
  | "RK"
  | "K"
  | "M"
  | "L";

export type CounselingRecordSheetFilters = {
  className?: string;
  month?: number;
  year?: number;
};

export type CounselingRecordSheetRow = {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  previousSummary: string;
  days: string[];
  currentSummary: string;
  description: string;
};

export type CounselingRecordSheetResult = {
  items: CounselingRecordSheetRow[];
  filters: CounselingRecordSheetFilters;
  month?: number;
  year?: number;
};

export type CounselingRecordFilters = CounselingRecordSheetFilters;

export type CounselingRecordListQuery = TableQueryParams<CounselingRecordFilters>;

export type CounselingRecordListResult = {
  items: CounselingRecordSheetRow[];
  filters: CounselingRecordFilters;
  pagination: PaginationMeta;
};

export type CounselingRecordFormErrors = Partial<
  Record<keyof CounselingRecordFormValues, string>
>;

export type CounselingRecordFormState = {
  status: "idle" | "error" | "success";
  message?: string;
  errors: CounselingRecordFormErrors;
  values: CounselingRecordFormValues;
};

export type CounselingRecordFormAction = (
  state: CounselingRecordFormState,
  formData: FormData,
) => Promise<CounselingRecordFormState>;

// Backwards-compatible aliases for any unused legacy imports.
export type CounselingRecordItem = CounselingRecordSheetRow;
