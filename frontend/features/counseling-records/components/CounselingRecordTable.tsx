import type { CounselingRecordSheetResult } from "@/features/counseling-records/types/counselingRecord";

type Props = {
  result: CounselingRecordSheetResult;
};

const DAYS_IN_MONTH = 31;
const PLACEHOLDER_ROWS = 8;
const TOTAL_COLUMNS = 4 + DAYS_IN_MONTH + 2;

function displayValue(value: string) {
  const normalized = value.trim();
  return normalized || "-";
}

export function CounselingRecordTable({ result }: Props) {
  const { filters, items } = result;
  const hasFilter = Boolean(filters.className && filters.month && filters.year);
  const emptyMessage = hasFilter
    ? "Belum ada data untuk filter ini."
    : "Pilih kelas, bulan, dan tahun terlebih dahulu.";
  const hasData = items.length > 0;
  const visibleRowCount = hasData ? Math.max(items.length, PLACEHOLDER_ROWS) : 1;

  return (
    <section className="border border-slate-500 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-[1700px] border-collapse text-sm">
          <thead>
            <tr>
              <th
                rowSpan={2}
                className="border border-slate-500 bg-slate-50 px-2 py-2 text-center text-xs font-bold uppercase text-slate-900"
              >
                NO.
              </th>
              <th
                rowSpan={2}
                className="border border-slate-500 bg-slate-50 px-3 py-2 text-center text-xs font-bold uppercase text-slate-900"
              >
                NAMA LENGKAP
              </th>
              <th
                rowSpan={2}
                className="border border-slate-500 bg-slate-50 px-3 py-2 text-center text-xs font-bold uppercase text-slate-900"
              >
                KELAS
              </th>
              <th
                rowSpan={2}
                className="border border-slate-500 bg-slate-50 px-3 py-2 text-center text-xs font-bold uppercase text-slate-900"
              >
                JUMLAH SEBELUMNYA
              </th>
              <th
                colSpan={DAYS_IN_MONTH}
                className="border border-slate-500 bg-slate-50 px-3 py-2 text-center text-xs font-bold uppercase text-slate-900"
              >
                BULAN
              </th>
              <th
                rowSpan={2}
                className="border border-slate-500 bg-slate-50 px-3 py-2 text-center text-xs font-bold uppercase text-slate-900"
              >
                JUMLAH
              </th>
              <th
                rowSpan={2}
                className="border border-slate-500 bg-slate-50 px-3 py-2 text-center text-xs font-bold uppercase text-slate-900"
              >
                KETERANGAN
              </th>
            </tr>
            <tr>
              {Array.from({ length: DAYS_IN_MONTH }, (_, index) => (
                <th
                  key={index + 1}
                  className="border border-slate-500 bg-white px-1 py-1 text-center text-xs font-bold text-slate-900"
                >
                  {index + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!hasData ? (
              <tr>
                <td
                  colSpan={TOTAL_COLUMNS}
                  className="border border-slate-500 px-4 py-8 text-center text-sm text-slate-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              Array.from({ length: visibleRowCount }, (_, index) => {
                const item = items[index];

                return (
                  <tr key={item?.id ?? `blank-${index}`} className="bg-white">
                    <td className="h-8 border border-slate-500 px-2 py-1 text-center text-xs text-slate-900">
                      {item ? index + 1 : ""}
                    </td>
                    <td className="h-8 border border-slate-500 px-3 py-1 text-xs uppercase tracking-wide text-slate-900">
                      {item ? item.studentName.toUpperCase() : ""}
                    </td>
                    <td className="h-8 border border-slate-500 px-3 py-1 text-xs text-slate-900">
                      {item?.className ?? ""}
                    </td>
                    <td className="h-8 border border-slate-500 px-3 py-1 text-center text-xs text-slate-900">
                      {item ? displayValue(item.previousSummary) : ""}
                    </td>
                    {Array.from({ length: DAYS_IN_MONTH }, (_, dayIndex) => (
                      <td
                        key={dayIndex + 1}
                        className="h-8 border border-slate-500 px-1 py-1 text-center text-xs text-slate-900"
                      >
                        {item?.days[dayIndex] ?? ""}
                      </td>
                    ))}
                    <td className="h-8 border border-slate-500 px-3 py-1 text-center text-xs text-slate-900">
                      {item ? displayValue(item.currentSummary) : ""}
                    </td>
                    <td className="h-8 border border-slate-500 px-3 py-1 text-xs text-slate-900">
                      {item ? displayValue(item.description) : ""}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
