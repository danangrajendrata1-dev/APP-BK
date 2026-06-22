import { ErrorState } from "@/components/shared/ErrorState";
import { PageHeader } from "@/components/shared/PageHeader";
import { StudentFilter } from "@/features/students/components/StudentFilter";
import { StudentTable } from "@/features/students/components/StudentTable";
import {
  getStudentClassOptions,
  getStudents,
} from "@/features/students/services/studentService";
import type { StudentFilters } from "@/features/students/types/student";

type StudentsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parsePage(value: string | undefined) {
  const page = Number(value);
  return Number.isFinite(page) && page > 0 ? page : 1;
}

function parseFilters(
  searchParams: Record<string, string | string[] | undefined>,
): StudentFilters {
  const className = getSingleValue(searchParams.className)?.trim();

  return {
    className: className || undefined,
  };
}

export default async function StudentsPage({ searchParams }: StudentsPageProps) {
  const resolvedSearchParams = await searchParams;
  const filters = parseFilters(resolvedSearchParams);
  const page = parsePage(getSingleValue(resolvedSearchParams.page));
  const queryString = new URLSearchParams({
    ...(filters.className ? { className: filters.className } : {}),
  }).toString();
  let loadError = "";
  let result: Awaited<ReturnType<typeof getStudents>> | null = null;
  let classOptions: string[] = [];

  try {
    classOptions = await getStudentClassOptions();
  } catch (error) {
    loadError = error instanceof Error ? error.message : "Daftar kelas gagal dimuat.";
  }

  if (!loadError && filters.className) {
    try {
      result = await getStudents({
        page,
        pageSize: 20,
        filters,
      });
    } catch (error) {
      loadError = error instanceof Error ? error.message : "Data siswa gagal dimuat.";
    }
  }

  return (
    <section className="space-y-6">
      <PageHeader
        title="Data Siswa"
        description="Kelola data siswa per kelas dalam tampilan tabel administrasi yang rapat."
      />
      {loadError ? (
        <ErrorState description={loadError} />
      ) : (
        <>
          <StudentFilter classOptions={classOptions} selectedClass={filters.className} />
          <StudentTable
            result={result}
            queryString={queryString}
            selectedClass={filters.className}
          />
        </>
      )}
    </section>
  );
}
