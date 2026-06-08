import type {
  CounselingMedia,
  CounselingRecordFormValues,
  CounselingType,
  PaginationMeta,
  TableQueryParams,
} from "@/types/common";

export type CounselingRecordItem = {
  id: string;
  counselingDate: string;
  studentId: string;
  studentName: string;
  className: string;
  meetingNumber: number | null;
  media: CounselingMedia;
  counselingType: CounselingType;
  topic: string;
  counselingResult: string;
  followUp: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type CounselingRecordFilters = {
  month?: number;
  year?: number;
  className?: string;
  media?: CounselingMedia;
  counselingType?: CounselingType;
};

export type CounselingRecordListQuery =
  TableQueryParams<CounselingRecordFilters>;

export type CounselingRecordListResult = {
  items: CounselingRecordItem[];
  filters: CounselingRecordFilters;
  pagination: PaginationMeta;
};

export type CounselingRecordFormErrors = Partial<
  Record<keyof CounselingRecordFormValues, string>
>;

export type CounselingRecordFormState = {
  status: "idle" | "error";
  message?: string;
  errors: CounselingRecordFormErrors;
  values: CounselingRecordFormValues;
};
