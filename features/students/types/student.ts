import type {
  PaginationMeta,
  StudentFormValues,
  StudentStatus,
  TableQueryParams,
} from "@/types/common";

export type Student = {
  id: string;
  nisn: string;
  fullName: string;
  gender: string;
  className: string;
  major: string;
  birthPlaceDate: string;
  address: string;
  phone: string;
  parentName: string;
  parentPhone: string;
  status: StudentStatus;
  createdAt: string;
  updatedAt: string;
};

export type StudentFilters = {
  fullName?: string;
  nisn?: string;
  className?: string;
  major?: string;
  status?: StudentStatus;
};

export type StudentListQuery = TableQueryParams<StudentFilters>;

export type StudentListResult = {
  items: Student[];
  filters: StudentFilters;
  pagination: PaginationMeta;
};

export type StudentFormErrors = Partial<Record<keyof StudentFormValues, string>>;

export type StudentFormState = {
  status: "idle" | "error";
  message?: string;
  errors: StudentFormErrors;
  values: StudentFormValues;
};
