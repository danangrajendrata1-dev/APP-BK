import { Button } from "@/components/ui/Button";
import type { ClassAssistanceItem, ClassAssistanceListResult } from "@/features/class-assistances/types/classAssistance";

type Props = {
  result: ClassAssistanceListResult;
  queryString: string;
};

type ColumnKey =
  | "terlambat"
  | "seragam"
  | "idCard"
  | "lainnya"
  | "kontrak"
  | "sp1"
  | "sp2"
  | "sp3";

const VIOLATION_LABELS: Record<Exclude<ColumnKey, "kontrak" | "sp1" | "sp2" | "sp3">, string> = {
  terlambat: "Terlambat",
  seragam: "Seragam",
  idCard: "Id Card",
  lainnya: "Lainnya",
};

const ACTION_LABELS: Record<Exclude<ColumnKey, "terlambat" | "seragam" | "idCard" | "lainnya">, string> = {
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

function normalizeText(value: string | null | undefined) {
  return value?.trim() ?? "";
}

function matchViolationBucket(value: string): keyof typeof VIOLATION_LABELS {
  const normalized = value.toLowerCase();

  if (normalized.includes("terlambat")) return "terlambat";
  if (normalized.includes("seragam") && !normalized.includes("tidak")) return "seragam";
  if (normalized.includes("tidak seragam")) return "seragam";
  if (normalized.includes("id card") || normalized === "id" || normalized.includes("tidak memakai id card")) return "idCard";

  return "lainnya";
}

function matchActionBucket(value: string): keyof typeof ACTION_LABELS | null {
  const normalized = value.toLowerCase();

  if (normalized.includes("kontrak")) return "kontrak";
  if (normalized === "sp1" || normalized.includes("sp 1")) return "sp1";
  if (normalized === "sp2" || normalized.includes("sp 2")) return "sp2";
  if (normalized === "sp3" || normalized.includes("sp 3")) return "sp3";

  return null;
}

function getViolationCellValue(item: ClassAssistanceItem, bucket: keyof typeof VIOLATION_LABELS) {
  const itemBucket = matchViolationBucket(normalizeText(item.violationType));
  return itemBucket === bucket ? VIOLATION_LABELS[bucket] : "";
}

function getActionCellValue(item: ClassAssistanceItem, bucket: keyof typeof ACTION_LABELS) {
  const itemBucket = matchActionBucket(normalizeText(item.actionForm));
  return itemBucket === bucket ? ACTION_LABELS[bucket] : "";
}

function getCellDisplayValue(value: string) {
  return normalizeText(value);
}

export function ClassAssistanceTable({ result, queryString }: Props) {
  const { items, pagination } = result;
  const startNumber = (pagination.page - 1) * pagination.pageSize;

  return (
    <section className="border border-slate-300 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-[1280px] border-collapse text-sm">
          <thead>
            <tr>
              <th rowSpan={2} className="border border-slate-300 bg-slate-50 px-2 py-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-700">
                No.
              </th>
              <th rowSpan={2} className="border border-slate-300 bg-slate-50 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">
                Nama Siswa
              </th>
              <th colSpan={4} className="border border-slate-300 bg-slate-50 px-3 py-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-700">
                Jenis Pelanggaran
              </th>
              <th colSpan={4} className="border border-slate-300 bg-slate-50 px-3 py-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-700">
                Bentuk Tindakan
              </th>
              <th rowSpan={2} className="border border-slate-300 bg-slate-50 px-3 py-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-700">
                Remisi
              </th>
              <th rowSpan={2} className="border border-slate-300 bg-slate-50 px-3 py-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-700">
                Keterangan
              </th>
              <th rowSpan={2} className="border border-slate-300 bg-slate-50 px-3 py-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-700">
                SP Akhir
              </th>
            </tr>
            <tr>
              {Object.values(VIOLATION_LABELS).map((label) => (
                <th key={label} className="border border-slate-300 bg-white px-2 py-2 text-center text-xs font-semibold text-slate-700">
                  {label}
                </th>
              ))}
              {Object.values(ACTION_LABELS).map((label) => (
                <th key={label} className="border border-slate-300 bg-white px-2 py-2 text-center text-xs font-semibold text-slate-700">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.length ? (
              items.map((item, index) => (
                <tr key={item.id} className="bg-white">
                  <td className="border border-slate-300 px-2 py-2 text-center text-sm text-slate-700">
                    {startNumber + index + 1}
                  </td>
                  <td className="border border-slate-300 px-3 py-2 text-sm font-medium uppercase tracking-wide text-slate-900">
                    {item.studentName}
                  </td>
                  <td className="border border-slate-300 px-2 py-2 text-center text-xs text-slate-700">
                    {getViolationCellValue(item, "terlambat")}
                  </td>
                  <td className="border border-slate-300 px-2 py-2 text-center text-xs text-slate-700">
                    {getViolationCellValue(item, "seragam")}
                  </td>
                  <td className="border border-slate-300 px-2 py-2 text-center text-xs text-slate-700">
                    {getViolationCellValue(item, "idCard")}
                  </td>
                  <td className="border border-slate-300 px-2 py-2 text-center text-xs text-slate-700">
                    {getViolationCellValue(item, "lainnya")}
                  </td>
                  <td className="border border-slate-300 px-2 py-2 text-center text-xs text-slate-700">
                    {getActionCellValue(item, "kontrak")}
                  </td>
                  <td className="border border-slate-300 px-2 py-2 text-center text-xs text-slate-700">
                    {getActionCellValue(item, "sp1")}
                  </td>
                  <td className="border border-slate-300 px-2 py-2 text-center text-xs text-slate-700">
                    {getActionCellValue(item, "sp2")}
                  </td>
                  <td className="border border-slate-300 px-2 py-2 text-center text-xs text-slate-700">
                    {getActionCellValue(item, "sp3")}
                  </td>
                  <td className="border border-slate-300 px-3 py-2 text-center text-sm text-slate-700">
                    {getCellDisplayValue(item.remission)}
                  </td>
                  <td className="border border-slate-300 px-3 py-2 text-sm text-slate-700">
                    {getCellDisplayValue(item.description)}
                  </td>
                  <td className="border border-slate-300 px-3 py-2 text-center text-sm text-slate-700">
                    {getCellDisplayValue(item.finalWarningLetter)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={13} className="border border-slate-300 px-4 py-8 text-center text-sm text-slate-500">
                  Belum ada data untuk kelas ini.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col gap-3 border-t border-slate-200 px-3 py-3 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
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
