import type { BkServiceAttendanceListResult } from "@/features/bk-service-attendance/types/bkServiceAttendance";

type BkServiceAttendanceTableProps = {
  result: BkServiceAttendanceListResult;
};

const PLACEHOLDER_ROWS = 5;

export function BkServiceAttendanceTable({
  result,
}: BkServiceAttendanceTableProps) {
  const items = result.items;
  const visibleRowCount = Math.max(items.length, PLACEHOLDER_ROWS);

  return (
    <section className="border border-slate-500 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-[1400px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="border border-slate-500 bg-slate-50 px-2 py-2 text-center text-xs font-bold uppercase text-slate-900">
                NO
              </th>
              <th className="border border-slate-500 bg-slate-50 px-3 py-2 text-center text-xs font-bold uppercase text-slate-900">
                TANGGAL
              </th>
              <th className="border border-slate-500 bg-slate-50 px-3 py-2 text-center text-xs font-bold uppercase text-slate-900">
                NAMA LENGKAP
              </th>
              <th className="border border-slate-500 bg-slate-50 px-3 py-2 text-center text-xs font-bold uppercase text-slate-900">
                KELAS
              </th>
              <th className="border border-slate-500 bg-slate-50 px-3 py-2 text-center text-xs font-bold uppercase text-slate-900">
                KEPERLUAN
              </th>
              <th className="border border-slate-500 bg-slate-50 px-3 py-2 text-center text-xs font-bold uppercase text-slate-900">
                URAIAN
              </th>
              <th className="border border-slate-500 bg-slate-50 px-3 py-2 text-center text-xs font-bold uppercase text-slate-900">
                HASIL
              </th>
              <th className="border border-slate-500 bg-slate-50 px-3 py-2 text-center text-xs font-bold uppercase text-slate-900">
                TINDAK LANJUT
              </th>
              <th className="border border-slate-500 bg-slate-50 px-3 py-2 text-center text-xs font-bold uppercase text-slate-900">
                TTD
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: visibleRowCount }, (_, index) => {
              const item = items[index];

              return (
                <tr key={item?.id ?? `blank-${index}`} className="bg-white">
                  <td className="h-8 border border-slate-500 px-2 py-1 text-center text-xs text-slate-900">
                    {item ? index + 1 : ""}
                  </td>
                  <td className="h-8 border border-slate-500 px-3 py-1 text-xs text-slate-900">
                    {item?.serviceDate ?? ""}
                  </td>
                  <td className="h-8 border border-slate-500 px-3 py-1 text-xs uppercase tracking-wide text-slate-900">
                    {item ? item.studentName.toUpperCase() : ""}
                  </td>
                  <td className="h-8 border border-slate-500 px-3 py-1 text-xs text-slate-900">
                    {item?.className ?? ""}
                  </td>
                  <td className="h-8 border border-slate-500 px-3 py-1 text-xs text-slate-900">
                    {item?.purpose ?? ""}
                  </td>
                  <td className="h-8 border border-slate-500 px-3 py-1 text-xs text-slate-900">
                    {item?.description ?? ""}
                  </td>
                  <td className="h-8 border border-slate-500 px-3 py-1 text-center text-xs text-slate-900" />
                  <td className="h-8 border border-slate-500 px-3 py-1 text-center text-xs text-slate-900" />
                  <td className="h-8 border border-slate-500 px-3 py-1 text-center text-xs text-slate-900" />
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
