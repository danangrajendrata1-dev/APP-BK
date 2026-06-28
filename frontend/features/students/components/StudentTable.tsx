import { Button } from "@/components/ui/Button";
import { formatBirthPlaceDate } from "@/lib/format";
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
  const showPagination = Boolean(pagination && selectedClass);

  return (
    <div className="rounded-2xl border border-slate-100 bg-white shadow-[0_2px_12px_rgb(0,0,0,0.03)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px] text-sm">
          <thead>
            <tr>
              <th className="border-b border-slate-100 bg-slate-100/60 px-4 py-3.5 text-center text-sm font-bold uppercase tracking-wider text-slate-800">
                NISN
              </th>
              <th className="border-b border-slate-100 bg-slate-100/60 px-4 py-3.5 text-left text-sm font-bold uppercase tracking-wider text-slate-800">
                NAMA LENGKAP
              </th>
              <th className="border-b border-slate-100 bg-slate-100/60 px-4 py-3.5 text-center text-sm font-bold uppercase tracking-wider text-slate-800">
                KELAS
              </th>
              <th className="border-b border-slate-100 bg-slate-100/60 px-4 py-3.5 text-center text-sm font-bold uppercase tracking-wider text-slate-800">
                L / P
              </th>
              <th className="border-b border-slate-100 bg-slate-100/60 px-4 py-3.5 text-left text-sm font-bold uppercase tracking-wider text-slate-800">
                TTL
              </th>
              <th className="border-b border-slate-100 bg-slate-100/60 px-4 py-3.5 text-left text-sm font-bold uppercase tracking-wider text-slate-800">
                ALAMAT
              </th>
              <th className="border-b border-slate-100 bg-slate-100/60 px-4 py-3.5 text-left text-sm font-bold uppercase tracking-wider text-slate-800">
                NO. HP
              </th>
              <th className="border-b border-slate-100 bg-slate-100/60 px-4 py-3.5 text-left text-sm font-bold uppercase tracking-wider text-slate-800">
                NAMA ORANG TUA/WALI
              </th>
              <th className="border-b border-slate-100 bg-slate-100/60 px-4 py-3.5 text-center text-sm font-bold uppercase tracking-wider text-slate-800">
                STATUS
              </th>
            </tr>
          </thead>
          <tbody>
            {!selectedClass ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-12 text-center text-sm text-slate-500"
                >
                  Pilih kelas terlebih dahulu.
                </td>
              </tr>
            ) : items.length ? (
              Array.from({ length: Math.max(items.length, PLACEHOLDER_ROW_COUNT) }, (_, index) => {
                const student = items[index];

                return (
                  <tr key={student?.id ?? `placeholder-${index}`} className="group transition-colors hover:bg-slate-50/80">
                    <td className="border-b border-slate-100 px-4 py-3.5 text-center text-sm text-slate-700 group-last:border-0">
                      {student?.nisn ?? ""}
                    </td>
                    <td className="border-b border-slate-100 px-4 py-3.5 text-sm uppercase text-slate-700 group-last:border-0">
                      {student ? student.fullName.toUpperCase() : ""}
                    </td>
                    <td className="border-b border-slate-100 px-4 py-3.5 text-center text-sm text-slate-700 group-last:border-0">
                      {student?.className ?? ""}
                    </td>
                    <td className="border-b border-slate-100 px-4 py-3.5 text-center text-sm text-slate-700 group-last:border-0">
                      {student ? normalizeGender(student.gender) : ""}
                    </td>
                    <td className="border-b border-slate-100 px-4 py-3.5 text-sm text-slate-700 group-last:border-0">
                      {student ? formatBirthPlaceDate(student.birthPlaceDate) : ""}
                    </td>
                    <td className="border-b border-slate-100 px-4 py-3.5 text-sm text-slate-700 group-last:border-0">
                      {student ? normalizeText(student.address) : ""}
                    </td>
                    <td className="border-b border-slate-100 px-4 py-3.5 text-sm text-slate-700 group-last:border-0">
                      {student ? normalizeText(student.phone) : ""}
                    </td>
                    <td className="border-b border-slate-100 px-4 py-3.5 text-sm text-slate-700 group-last:border-0">
                      {student ? normalizeText(student.parentName) : ""}
                    </td>
                    <td className="border-b border-slate-100 px-4 py-3.5 text-center text-sm text-slate-700 group-last:border-0">
                      {student?.status ?? ""}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-12 text-center text-sm text-slate-500"
                >
                  Belum ada data untuk kelas ini.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {showPagination && pagination ? (
        <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-3.5 text-sm text-slate-700 sm:flex-row sm:items-center sm:justify-between">
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
    </div>
  );
}
