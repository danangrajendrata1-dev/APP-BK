import type { SchoolAttendanceListResult } from "@/features/school-attendance/types/schoolAttendance";

type SchoolAttendanceTableProps = {
  result: SchoolAttendanceListResult;
};

const DAYS_IN_MONTH = 31;
const PLACEHOLDER_ROWS = 8;
const TOTAL_COLUMNS = 3 + DAYS_IN_MONTH + 4;

function getVisibleRowCount(totalRows: number) {
  return Math.max(totalRows, PLACEHOLDER_ROWS);
}

export function SchoolAttendanceTable({ result }: SchoolAttendanceTableProps) {
  const { filters, items, month } = result;
  const visibleRowCount = getVisibleRowCount(items.length);
  const hasFilter = Boolean(filters.className && filters.month && filters.year);
  const emptyMessage = hasFilter
    ? "Belum ada data untuk filter ini."
    : "Pilih kelas, bulan, dan tahun terlebih dahulu.";

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
  const monthName = MONTH_NAMES[month - 1] || "BULAN";

  return (
    <div className="rounded-2xl border border-slate-100 bg-white shadow-[0_2px_12px_rgb(0,0,0,0.03)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1700px] text-sm">
          <thead>
            <tr>
              <th rowSpan={2} className="border-b border-r border-slate-100 bg-slate-100/60 px-2 py-3 text-center text-sm font-bold uppercase tracking-wider text-slate-800">
                NO.
              </th>
              <th rowSpan={2} className="border-b border-r border-slate-100 bg-slate-100/60 px-3 py-3 text-center text-sm font-bold uppercase tracking-wider text-slate-800">
                NAMA LENGKAP
              </th>
              <th rowSpan={2} className="border-b border-r border-slate-100 bg-slate-100/60 px-3 py-3 text-center text-sm font-bold uppercase tracking-wider text-slate-800">
                KELAS
              </th>
              <th colSpan={DAYS_IN_MONTH} className="border-b border-r border-slate-100 bg-slate-100/60 px-4 py-3.5 text-center text-sm font-bold uppercase tracking-wider text-slate-800">
                {monthName}
              </th>
              <th colSpan={3} className="border-b border-r border-slate-100 bg-slate-100/60 px-4 py-3.5 text-center text-sm font-bold uppercase tracking-wider text-slate-800">
                JUMLAH
              </th>
              <th rowSpan={2} className="border-b border-slate-100 bg-slate-100/60 px-3 py-3 text-center text-sm font-bold uppercase tracking-wider text-slate-800">
                KETERANGAN
              </th>
            </tr>
            <tr>
              {Array.from({ length: DAYS_IN_MONTH }, (_, index) => (
                <th key={index + 1} className="border-b border-r border-slate-100 bg-white px-1 py-1.5 text-center text-sm font-bold text-slate-500">
                  {index + 1}
                </th>
              ))}
              <th className="border-b border-r border-slate-100 bg-white px-3 py-3.5 text-center text-sm font-bold text-slate-500">S</th>
              <th className="border-b border-r border-slate-100 bg-white px-3 py-3.5 text-center text-sm font-bold text-slate-500">I</th>
              <th className="border-b border-r border-slate-100 bg-white px-3 py-3.5 text-center text-sm font-bold text-slate-500">A</th>
            </tr>
          </thead>
          <tbody>
            {items.length ? (
              Array.from({ length: visibleRowCount }, (_, index) => {
                const row = items[index];

                return (
                  <tr key={row?.id ?? `blank-${index}`} className="group transition-colors hover:bg-slate-50/80">
                    <td className="border-b border-slate-100 px-2 py-3 text-center text-sm text-slate-800 group-last:border-0">
                      {row ? index + 1 : ""}
                    </td>
                    <td className="border-b border-slate-100 px-3 py-3 text-sm font-medium uppercase text-slate-800 group-last:border-0">
                      {row ? row.studentName.toUpperCase() : ""}
                    </td>
                    <td className="border-b border-slate-100 px-3 py-3 text-center text-sm text-slate-800 group-last:border-0">
                      {row ? row.className : ""}
                    </td>
                    {Array.from({ length: DAYS_IN_MONTH }, (_, dayIndex) => (
                      <td key={dayIndex + 1} className="border-b border-slate-100 px-1 py-3 text-center text-sm text-slate-800 group-last:border-0">
                        {row?.days[dayIndex] ?? ""}
                      </td>
                    ))}
                    <td className="border-b border-slate-100 px-2 py-3 text-center text-sm text-slate-800 group-last:border-0">
                      {row ? row.totalS : ""}
                    </td>
                    <td className="border-b border-slate-100 px-2 py-3 text-center text-sm text-slate-800 group-last:border-0">
                      {row ? row.totalI : ""}
                    </td>
                    <td className="border-b border-slate-100 px-2 py-3 text-center text-sm text-slate-800 group-last:border-0">
                      {row ? row.totalA : ""}
                    </td>
                    <td className="border-b border-slate-100 px-3 py-3 text-sm text-slate-800 group-last:border-0">
                      {row ? row.description : ""}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={TOTAL_COLUMNS}
                  className="px-4 py-12 text-center text-sm text-slate-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
