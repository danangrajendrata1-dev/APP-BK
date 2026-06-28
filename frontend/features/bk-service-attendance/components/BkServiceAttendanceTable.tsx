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
    <div className="rounded-2xl border border-slate-100 bg-white shadow-[0_2px_12px_rgb(0,0,0,0.03)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1400px] text-sm">
          <thead>
            <tr>
              <th className="border-b border-slate-100 bg-slate-100/60 px-3 py-3.5 text-center text-sm font-extrabold uppercase text-slate-800">
                NO
              </th>
              <th className="border-b border-slate-100 bg-slate-100/60 px-4 py-3.5 text-center text-sm font-extrabold uppercase text-slate-800">
                TANGGAL
              </th>
              <th className="border-b border-slate-100 bg-slate-100/60 px-4 py-3.5 text-center text-sm font-extrabold uppercase text-slate-800">
                NAMA LENGKAP
              </th>
              <th className="border-b border-slate-100 bg-slate-100/60 px-4 py-3.5 text-center text-sm font-extrabold uppercase text-slate-800">
                KELAS
              </th>
              <th className="border-b border-slate-100 bg-slate-100/60 px-4 py-3.5 text-center text-sm font-extrabold uppercase text-slate-800">
                KEPERLUAN
              </th>
              <th className="border-b border-slate-100 bg-slate-100/60 px-4 py-3.5 text-center text-sm font-extrabold uppercase text-slate-800">
                URAIAN
              </th>
              <th className="border-b border-slate-100 bg-slate-100/60 px-4 py-3.5 text-center text-sm font-extrabold uppercase text-slate-800">
                HASIL
              </th>
              <th className="border-b border-slate-100 bg-slate-100/60 px-4 py-3.5 text-center text-sm font-extrabold uppercase text-slate-800">
                TINDAK LANJUT
              </th>
              <th className="border-b border-slate-100 bg-slate-100/60 px-4 py-3.5 text-center text-sm font-extrabold uppercase text-slate-800">
                TTD
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: visibleRowCount }, (_, index) => {
              const item = items[index];

              return (
                <tr key={item?.id ?? `blank-${index}`} className="bg-white">
                  <td className="border-b border-slate-100 px-3 py-3 text-center text-sm text-slate-800">
                    {item ? index + 1 : ""}
                  </td>
                  <td className="border-b border-slate-100 px-4 py-3 text-sm text-slate-800">
                    {item?.serviceDate ?? ""}
                  </td>
                  <td className="border-b border-slate-100 px-4 py-3 text-sm uppercase tracking-wide text-slate-800">
                    {item ? item.studentName.toUpperCase() : ""}
                  </td>
                  <td className="border-b border-slate-100 px-4 py-3 text-sm text-slate-800">
                    {item?.className ?? ""}
                  </td>
              <td className="border-b border-slate-100 px-4 py-3 text-sm text-slate-800">
                {item?.purpose ?? ""}
              </td>
              <td className="border-b border-slate-100 px-4 py-3 text-sm text-slate-800">
                {item?.description ?? ""}
              </td>
              <td className="border-b border-slate-100 px-4 py-3 text-sm text-slate-800">
                {item?.result ?? ""}
              </td>
              <td className="border-b border-slate-100 px-4 py-3 text-sm text-slate-800">
                {item?.followUp ?? ""}
              </td>
              <td className="border-b border-slate-100 px-4 py-3 text-sm text-slate-800">
                {item?.signature ?? ""}
              </td>
            </tr>
          );
        })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
