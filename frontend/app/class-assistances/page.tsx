import { ErrorState } from "@/components/shared/ErrorState";
import { PageHeader } from "@/components/shared/PageHeader";
import { ClassAssistanceFilter } from "@/features/class-assistances/components/ClassAssistanceFilter";
import { ClassAssistanceTable } from "@/features/class-assistances/components/ClassAssistanceTable";
import { getClassAssistanceRecap } from "@/features/class-assistances/services/classAssistanceService";
import type { ClassAssistanceRecapFilters } from "@/features/class-assistances/types/classAssistance";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parsePage(value: string | undefined) {
  const page = Number(value);
  return Number.isFinite(page) && page > 0 ? page : 1;
}

function parseFilters(searchParams: Record<string, string | string[] | undefined>): ClassAssistanceRecapFilters {
  const className = getSingleValue(searchParams.className)?.trim();
  const violationType = getSingleValue(searchParams.violationType)?.trim().toUpperCase();
  const finalWarningLetter = getSingleValue(searchParams.finalWarningLetter)?.trim().toUpperCase();

  return {
    className: className || undefined,
    violationType: violationType === "T" || violationType === "S" || violationType === "D" || violationType === "R" || violationType === "RK" || violationType === "K" || violationType === "M" || violationType === "L" ? violationType : undefined,
    finalWarningLetter: finalWarningLetter === "SP 1" || finalWarningLetter === "SP 2" || finalWarningLetter === "SP 3" ? finalWarningLetter : undefined,
  };
}

export default async function ClassAssistancesPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const filters = parseFilters(resolvedSearchParams);
  const page = parsePage(getSingleValue(resolvedSearchParams.page));
  let loadError = "";
  let result: Awaited<ReturnType<typeof getClassAssistanceRecap>> | null = null;

  try {
    result = await getClassAssistanceRecap({ page, pageSize: 25, filters });
  } catch (error) {
    loadError = error instanceof Error ? error.message : "Gagal memuat data rekapan pelanggaran.";
  }

  const queryString = new URLSearchParams({
    ...(filters.className ? { className: filters.className } : {}),
    ...(filters.violationType ? { violationType: filters.violationType } : {}),
    ...(filters.finalWarningLetter ? { finalWarningLetter: filters.finalWarningLetter } : {}),
  }).toString();

  return (
    <section className="space-y-4">
      <PageHeader
        title="Rekapan Pelanggaran Siswa"
        description="Tampilan spreadsheet untuk rekap pelanggaran siswa per kelas."
      />
      <ClassAssistanceFilter filters={filters} />
      {loadError ? (
        <ErrorState description="Gagal memuat data rekapan pelanggaran." />
      ) : result ? (
        <ClassAssistanceTable result={result} queryString={queryString} />
      ) : null}
    </section>
  );
}
