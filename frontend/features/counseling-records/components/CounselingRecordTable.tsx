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

  const monthVal = result.month || filters.month || (new Date().getMonth() + 1);
  const MONTH_NAMES = [
    "JANUARI",
    "FEBRUARI",
    "MARET",
    "APRIL",
    "MEI",
    "JUNI",
    "JULI",
    "AGUSTUS",
    "SEPTEMBER",
    "OKTOBER",
    "NOVEMBER",
    "DESEMBER",
  ];
  const monthName = MONTH_NAMES[monthVal - 1] || "BULAN";

  return (
    <div className="rounded-2xl border border-slate-100 bg-white shadow-[0_2px_12px_rgb(0,0,0,0.03)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1700px] text-sm">
          <thead>
            <tr>
              <th
                rowSpan={2}
                className="border-b border-slate-100 bg-slate-100/60 px-3 py-3.5 text-center text-sm font-extrabold uppercase text-slate-800"
              >
                NO.
              </th>
              <th
                rowSpan={2}
                className="border-b border-slate-100 bg-slate-100/60 px-4 py-3.5 text-center text-sm font-extrabold uppercase text-slate-800"
              >
                NAMA LENGKAP
              </th>
              <th
                rowSpan={2}
                className="border-b border-slate-100 bg-slate-100/60 px-4 py-3.5 text-center text-sm font-extrabold uppercase text-slate-800"
              >
                KELAS
              </th>
              <th
                rowSpan={2}
                className="border-b border-slate-100 bg-slate-100/60 px-4 py-3.5 text-center text-sm font-extrabold uppercase text-slate-800"
              >
                JUMLAH SEBELUMNYA
              </th>
              <th
                colSpan={DAYS_IN_MONTH}
                className="border-b border-slate-100 bg-slate-100/60 px-4 py-3.5 text-center text-sm font-extrabold uppercase text-slate-800"
              >
                {monthName}
              </th>
              <th
                rowSpan={2}
                className="border-b border-slate-100 bg-slate-100/60 px-4 py-3.5 text-center text-sm font-extrabold uppercase text-slate-800"
              >
                JUMLAH
              </th>
              <th
                rowSpan={2}
                className="border-b border-slate-100 bg-slate-100/60 px-4 py-3.5 text-center text-sm font-extrabold uppercase text-slate-800"
              >
                KETERANGAN
              </th>
            </tr>
            <tr>
              {Array.from({ length: DAYS_IN_MONTH }, (_, index) => (
                <th
                  key={index + 1}
                  className="border-b border-slate-100 bg-white px-1 py-1 text-center text-sm font-extrabold text-slate-800"
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
                  className="border-b border-slate-100 px-4 py-8 text-center text-sm text-slate-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              Array.from({ length: visibleRowCount }, (_, index) => {
                const item = items[index];

                return (
                  <tr key={item?.id ?? `blank-${index}`} className="bg-white">
                    <td className="border-b border-slate-100 px-3 py-3 text-center text-sm text-slate-800">
                      {item ? index + 1 : ""}
                    </td>
                    <td className="border-b border-slate-100 px-4 py-3 text-sm uppercase tracking-wide text-slate-800">
                      {item ? item.studentName.toUpperCase() : ""}
                    </td>
                    <td className="border-b border-slate-100 px-4 py-3 text-sm text-slate-800">
                      {item?.className ?? ""}
                    </td>
                    <td className="border-b border-slate-100 px-4 py-3 text-center text-sm text-slate-800">
                      {item ? displayValue(item.previousSummary) : ""}
                    </td>
                    {Array.from({ length: DAYS_IN_MONTH }, (_, dayIndex) => (
                      <td
                        key={dayIndex + 1}
                        className="border-b border-slate-100 px-1 py-1 text-center text-sm text-slate-800"
                      >
                        {item?.days[dayIndex] ?? ""}
                      </td>
                    ))}
                    <td className="border-b border-slate-100 px-4 py-3 text-center text-sm text-slate-800">
                      {item ? displayValue(item.currentSummary) : ""}
                    </td>
                    <td className="border-b border-slate-100 px-4 py-3 text-sm text-slate-800">
                      {item ? displayValue(item.description) : ""}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
