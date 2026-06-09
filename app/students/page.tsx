import { ErrorState } from "@/components/shared/ErrorState";
import { PageHeader } from "@/components/shared/PageHeader";
import { StudentFilter } from "@/features/students/components/StudentFilter";
import { StudentTable } from "@/features/students/components/StudentTable";
import { getStudents } from "@/features/students/services/studentService";
import type { StudentFilters } from "@/features/students/types/student";
import type { StudentStatus } from "@/types/common";

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
  const fullName = getSingleValue(searchParams.fullName)?.trim();
  const nisn = getSingleValue(searchParams.nisn)?.trim();
  const className = getSingleValue(searchParams.className)?.trim();
  const major = getSingleValue(searchParams.major)?.trim();
  const status = getSingleValue(searchParams.status)?.trim() as
    | StudentStatus
    | undefined;

  return {
    fullName: fullName || undefined,
    nisn: nisn || undefined,
    className: className || undefined,
    major: major || undefined,
    status: status || undefined,
  };
}

export default async function StudentsPage({ searchParams }: StudentsPageProps) {
  const resolvedSearchParams = await searchParams;
  const filters = parseFilters(resolvedSearchParams);
  const page = parsePage(getSingleValue(resolvedSearchParams.page));
  const queryString = new URLSearchParams({
    ...(filters.fullName ? { fullName: filters.fullName } : {}),
    ...(filters.nisn ? { nisn: filters.nisn } : {}),
    ...(filters.className ? { className: filters.className } : {}),
    ...(filters.major ? { major: filters.major } : {}),
    ...(filters.status ? { status: filters.status } : {}),
  }).toString();
  let loadError = "";
  let result: Awaited<ReturnType<typeof getStudents>> | null = null;

  try {
    result = await getStudents({
      page,
      pageSize: 20,
      filters,
    });
  } catch (error) {
    loadError = error instanceof Error ? error.message : "Data siswa gagal dimuat.";
  }

  return (
    <section className="space-y-6">
      <PageHeader
        title="Data Siswa"
        description="Kelola data siswa, cari data dengan mudah, dan lihat detailnya."
      />
      {loadError ? (
        <ErrorState description={loadError} />
      ) : (
        <>
          <StudentFilter filters={filters} />
          {result ? <StudentTable result={result} queryString={queryString} /> : null}
        </>
      )}
    </section>
  );
}
