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
  birthPlaceDate: string;
  address: string;
  phone: string;
  parentName: string;
  status: StudentStatus;
  createdAt: string;
  updatedAt: string;
};

export type StudentFilters = {
  className?: string;
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
