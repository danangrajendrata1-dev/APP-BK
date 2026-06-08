import type {
  DocumentFormValues,
  DocumentType,
  PaginationMeta,
  TableQueryParams,
} from "@/types/common";

export type DocumentItem = {
  id: string;
  letterNumber: string;
  documentDate: string;
  studentId: string;
  studentName: string;
  className: string;
  documentType: DocumentType;
  filePath: string;
  fileUrl: string;
  description: string;
};

export type DocumentFilters = {
  documentDate?: string;
  documentType?: DocumentType;
  studentName?: string;
  className?: string;
};

export type DocumentListQuery = TableQueryParams<DocumentFilters>;
export type DocumentListResult = {
  items: DocumentItem[];
  filters: DocumentFilters;
  pagination: PaginationMeta;
};

export type DocumentFormErrors = Partial<
  Record<keyof DocumentFormValues | "fileAttachment", string>
>;

export type DocumentFormState = {
  status: "idle" | "error";
  message?: string;
  errors: DocumentFormErrors;
  values: DocumentFormValues;
};
