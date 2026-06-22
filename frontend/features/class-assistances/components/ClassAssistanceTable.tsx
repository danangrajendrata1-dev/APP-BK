import { Button } from "@/components/ui/Button";

import type { ClassAssistanceRecapResult, RecapActionCode, RecapViolationCode } from "@/features/class-assistances/types/classAssistance";

type Props = {
  result: ClassAssistanceRecapResult;
  queryString: string;
};

const VIOLATION_COLUMNS: RecapViolationCode[] = ["T", "S", "D", "R", "RK", "K", "M", "L"];
const ACTION_COLUMNS: RecapActionCode[] = ["kontrak", "sp1", "sp2", "sp3"];

const VIOLATION_LABELS: Record<RecapViolationCode, string> = {
  T: "T",
  S: "S",
  D: "D",
  R: "R",
  RK: "RK",
  K: "K",
  M: "M",
  L: "L",
};

const ACTION_LABELS: Record<RecapActionCode, string> = {
  kontrak: "Kontrak Perilaku",
  sp1: "SP 1",
  sp2: "SP 2",
  sp3: "SP 3",
};

function createPageHref(queryString: string, page: number) {
  const params = new URLSearchParams(queryString);
  params.set("page", String(page));
  const nextQuery = params.toString();
  return nextQuery ? `/class-assistances?${nextQuery}` : "/class-assistances";
}

function formatMarkerCount(count: number) {
  if (count <= 0) return "";
  return count === 1 ? "✓" : String(count);
}

function getDisplayText(value: string) {
  const normalized = value.trim();
  return normalized || "-";
}

export function ClassAssistanceTable({ result, queryString }: Props) {
  const { items, pagination, filters } = result;
  const hasClassSelected = Boolean(filters.className);
  const emptyMessage = hasClassSelected ? "Belum ada data untuk kelas ini." : "Pilih kelas terlebih dahulu.";

  return (
    <section className="border border-slate-400 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-[1500px] border-collapse text-xs">
          <thead>
            <tr>
              <th rowSpan={2} className="border border-slate-400 bg-slate-50 px-2 py-2 text-center font-bold uppercase text-slate-900">
                NO.
              </th>
              <th rowSpan={2} className="border border-slate-400 bg-slate-50 px-3 py-2 text-left font-bold uppercase text-slate-900">
                NAMA SISWA
              </th>
              <th colSpan={VIOLATION_COLUMNS.length} className="border border-slate-400 bg-slate-50 px-3 py-2 text-center font-bold uppercase text-slate-900">
                JENIS PELANGGARAN
              </th>
              <th colSpan={ACTION_COLUMNS.length} className="border border-slate-400 bg-slate-50 px-3 py-2 text-center font-bold uppercase text-slate-900">
                BENTUK TINDAKAN
              </th>
              <th rowSpan={2} className="border border-slate-400 bg-slate-50 px-3 py-2 text-center font-bold uppercase text-slate-900">
                REMISI
              </th>
              <th rowSpan={2} className="border border-slate-400 bg-slate-50 px-3 py-2 text-center font-bold uppercase text-slate-900">
                KETERANGAN
              </th>
              <th rowSpan={2} className="border border-slate-400 bg-slate-50 px-3 py-2 text-center font-bold uppercase text-slate-900">
                SP AKHIR
              </th>
            </tr>
            <tr>
              {VIOLATION_COLUMNS.map((code) => (
                <th key={code} className="border border-slate-400 bg-white px-2 py-2 text-center font-bold text-slate-900">
                  {VIOLATION_LABELS[code]}
                </th>
              ))}
              {ACTION_COLUMNS.map((code) => (
                <th key={code} className="border border-slate-400 bg-white px-2 py-2 text-center font-bold text-slate-900">
                  {ACTION_LABELS[code]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!hasClassSelected ? (
              <tr>
                <td colSpan={2 + VIOLATION_COLUMNS.length + ACTION_COLUMNS.length + 3} className="border border-slate-400 px-4 py-8 text-center text-sm text-slate-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : items.length ? (
              items.map((item, index) => (
                <tr key={item.id} className="bg-white">
                  <td className="h-8 border border-slate-400 px-2 py-1 text-center text-xs text-slate-900">
                    {((pagination.page - 1) * pagination.pageSize) + index + 1}
                  </td>
                  <td className="h-8 border border-slate-400 px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-900">
                    {item.studentName.toUpperCase()}
                  </td>
                  {VIOLATION_COLUMNS.map((code) => (
                    <td key={code} className="h-8 border border-slate-400 px-2 py-1 text-center text-xs text-slate-900">
                      {formatMarkerCount(item.violationCounts[code])}
                    </td>
                  ))}
                  {ACTION_COLUMNS.map((code) => (
                    <td key={code} className="h-8 border border-slate-400 px-2 py-1 text-center text-xs text-slate-900">
                      {formatMarkerCount(item.actionCounts[code])}
                    </td>
                  ))}
                  <td className="h-8 border border-slate-400 px-3 py-1 text-center text-xs text-slate-900">
                    {getDisplayText(item.remission)}
                  </td>
                  <td className="h-8 border border-slate-400 px-3 py-1 text-xs text-slate-900">
                    {getDisplayText(item.description)}
                  </td>
                  <td className="h-8 border border-slate-400 px-3 py-1 text-center text-xs text-slate-900">
                    {getDisplayText(item.finalWarningLetter)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2 + VIOLATION_COLUMNS.length + ACTION_COLUMNS.length + 3} className="border border-slate-400 px-4 py-8 text-center text-sm text-slate-500">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col gap-3 border-t border-slate-300 px-3 py-3 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
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
    </section>
  );
}
