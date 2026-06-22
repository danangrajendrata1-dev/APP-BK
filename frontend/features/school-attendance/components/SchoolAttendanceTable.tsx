import type { SchoolAttendanceListResult } from "@/features/school-attendance/types/schoolAttendance";

type SchoolAttendanceTableProps = {
  result: SchoolAttendanceListResult;
};

const DAYS_IN_MONTH = 31;
const PLACEHOLDER_ROWS = 8;

function getVisibleRowCount(totalRows: number) {
  return Math.max(totalRows, PLACEHOLDER_ROWS);
}

export function SchoolAttendanceTable({ result }: SchoolAttendanceTableProps) {
  const { items } = result;
  const visibleRowCount = getVisibleRowCount(items.length);

  return (
    <section className="border border-slate-500 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-[1700px] border-collapse text-sm">
          <thead>
            <tr>
              <th rowSpan={2} className="border border-slate-500 bg-slate-50 px-2 py-2 text-center text-xs font-bold uppercase text-slate-900">
                NO.
              </th>
              <th rowSpan={2} className="border border-slate-500 bg-slate-50 px-3 py-2 text-center text-xs font-bold uppercase text-slate-900">
                NAMA LENGKAP
              </th>
              <th rowSpan={2} className="border border-slate-500 bg-slate-50 px-3 py-2 text-center text-xs font-bold uppercase text-slate-900">
                KELAS
              </th>
              <th colSpan={DAYS_IN_MONTH} className="border border-slate-500 bg-slate-50 px-3 py-2 text-center text-xs font-bold uppercase text-slate-900">
                BULAN
              </th>
              <th colSpan={3} className="border border-slate-500 bg-slate-50 px-3 py-2 text-center text-xs font-bold uppercase text-slate-900">
                JUMLAH
              </th>
              <th rowSpan={2} className="border border-slate-500 bg-slate-50 px-3 py-2 text-center text-xs font-bold uppercase text-slate-900">
                KETERANGAN
              </th>
            </tr>
            <tr>
              {Array.from({ length: DAYS_IN_MONTH }, (_, index) => (
                <th key={index + 1} className="border border-slate-500 bg-white px-1 py-1 text-center text-xs font-bold text-slate-900">
                  {index + 1}
                </th>
              ))}
              <th className="border border-slate-500 bg-white px-2 py-1 text-center text-xs font-bold text-slate-900">S</th>
              <th className="border border-slate-500 bg-white px-2 py-1 text-center text-xs font-bold text-slate-900">I</th>
              <th className="border border-slate-500 bg-white px-2 py-1 text-center text-xs font-bold text-slate-900">A</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: visibleRowCount }, (_, index) => {
              const row = items[index];

              return (
                <tr key={row?.id ?? `blank-${index}`} className="bg-white">
                  <td className="h-8 border border-slate-500 px-2 py-1 text-center text-xs text-slate-900">
                    {row ? index + 1 : ""}
                  </td>
                  <td className="h-8 border border-slate-500 px-3 py-1 text-xs uppercase text-slate-900">
                    {row ? row.studentName.toUpperCase() : ""}
                  </td>
                  <td className="h-8 border border-slate-500 px-3 py-1 text-center text-xs text-slate-900">
                    {row ? row.className : ""}
                  </td>
                  {Array.from({ length: DAYS_IN_MONTH }, (_, dayIndex) => (
                    <td key={dayIndex + 1} className="h-8 border border-slate-500 px-1 py-1 text-center text-xs text-slate-900">
                      {row?.days[dayIndex] ?? ""}
                    </td>
                  ))}
                  <td className="h-8 border border-slate-500 px-2 py-1 text-center text-xs text-slate-900">
                    {row ? row.totalS : ""}
                  </td>
                  <td className="h-8 border border-slate-500 px-2 py-1 text-center text-xs text-slate-900">
                    {row ? row.totalI : ""}
                  </td>
                  <td className="h-8 border border-slate-500 px-2 py-1 text-center text-xs text-slate-900">
                    {row ? row.totalA : ""}
                  </td>
                  <td className="h-8 border border-slate-500 px-3 py-1 text-xs text-slate-900">
                    {row ? row.description : ""}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
