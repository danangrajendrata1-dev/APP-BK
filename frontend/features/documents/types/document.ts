import type {
  DocumentFormValues,
  PaginationMeta,
  TableQueryParams,
} from "@/types/common";

export type DocumentItem = {
  id: string;
  title: string;
  filePath: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  description: string;
};

export type DocumentFilters = {
  title?: string;
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
