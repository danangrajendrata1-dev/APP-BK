import { Button } from "@/components/ui/Button";
import type { StudentListResult } from "@/features/students/types/student";

type StudentTableProps = {
  result: StudentListResult | null;
  queryString: string;
  selectedClass?: string;
};

const PLACEHOLDER_ROW_COUNT = 6;

function createPageHref(queryString: string, page: number) {
  const params = new URLSearchParams(queryString);
  params.set("page", String(page));
  const nextQuery = params.toString();
  return nextQuery ? `/students?${nextQuery}` : "/students";
}

function normalizeText(value: string | null | undefined) {
  return value?.trim() ?? "";
}

function normalizeGender(value: string) {
  const normalized = value.trim().toLowerCase();

  if (normalized.startsWith("l")) return "L";
  if (normalized.startsWith("p")) return "P";

  return value;
}

export function StudentTable({
  result,
  queryString,
  selectedClass = "",
}: StudentTableProps) {
  const items = result?.items ?? [];
  const pagination = result?.pagination;
  const visibleRowCount = Math.max(items.length, PLACEHOLDER_ROW_COUNT);
  const showPagination = Boolean(pagination && selectedClass);

  return (
    <section className="border border-slate-500 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-[1200px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="border border-slate-500 bg-slate-50 px-2 py-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-900">
                NISN
              </th>
              <th className="border border-slate-500 bg-slate-50 px-3 py-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-900">
                NAMA LENGKAP
              </th>
              <th className="border border-slate-500 bg-slate-50 px-3 py-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-900">
                KELAS
              </th>
              <th className="border border-slate-500 bg-slate-50 px-3 py-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-900">
                L / P
              </th>
              <th className="border border-slate-500 bg-slate-50 px-3 py-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-900">
                TTL
              </th>
              <th className="border border-slate-500 bg-slate-50 px-3 py-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-900">
                ALAMAT
              </th>
              <th className="border border-slate-500 bg-slate-50 px-3 py-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-900">
                NO. HP
              </th>
              <th className="border border-slate-500 bg-slate-50 px-3 py-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-900">
                NAMA ORANG TUA/WALI
              </th>
              <th className="border border-slate-500 bg-slate-50 px-3 py-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-900">
                STATUS
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: visibleRowCount }, (_, index) => {
              const student = items[index];

              return (
                <tr key={student?.id ?? `placeholder-${index}`} className="bg-white">
                  <td className="h-8 border border-slate-500 px-2 py-1 text-center text-xs text-slate-900">
                    {student?.nisn ?? ""}
                  </td>
                  <td className="h-8 border border-slate-500 px-3 py-1 text-xs uppercase tracking-wide text-slate-900">
                    {student ? student.fullName.toUpperCase() : ""}
                  </td>
                  <td className="h-8 border border-slate-500 px-3 py-1 text-center text-xs text-slate-900">
                    {student?.className ?? ""}
                  </td>
                  <td className="h-8 border border-slate-500 px-3 py-1 text-center text-xs text-slate-900">
                    {student ? normalizeGender(student.gender) : ""}
                  </td>
                  <td className="h-8 border border-slate-500 px-3 py-1 text-xs text-slate-900">
                    {student ? normalizeText(student.birthPlaceDate) : ""}
                  </td>
                  <td className="h-8 border border-slate-500 px-3 py-1 text-xs text-slate-900">
                    {student ? normalizeText(student.address) : ""}
                  </td>
                  <td className="h-8 border border-slate-500 px-3 py-1 text-xs text-slate-900">
                    {student ? normalizeText(student.phone) : ""}
                  </td>
                  <td className="h-8 border border-slate-500 px-3 py-1 text-xs text-slate-900">
                    {student ? normalizeText(student.parentName) : ""}
                  </td>
                  <td className="h-8 border border-slate-500 px-3 py-1 text-center text-xs text-slate-900">
                    {student?.status ?? ""}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {showPagination && pagination ? (
        <div className="flex flex-col gap-3 border-t border-slate-500 px-3 py-2 text-sm text-slate-700 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Halaman {pagination.page} dari {pagination.totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              href={createPageHref(queryString, pagination.page - 1)}
              variant="outline"
              size="sm"
              disabled={pagination.page <= 1}
            >
              Sebelumnya
            </Button>
            <Button
              href={createPageHref(queryString, pagination.page + 1)}
              variant="outline"
              size="sm"
              disabled={pagination.page >= pagination.totalPages}
            >
              Berikutnya
            </Button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
