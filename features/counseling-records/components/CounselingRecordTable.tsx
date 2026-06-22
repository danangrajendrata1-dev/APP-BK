import type { CounselingRecordSheetResult } from "@/features/counseling-records/types/counselingRecord";

type Props = {
  result: CounselingRecordSheetResult;
};

const DAYS_IN_MONTH = 31;
const PLACEHOLDER_ROWS = 8;

function formatCount(value: number) {
  return value > 0 ? String(value) : "";
}

export function CounselingRecordTable({ result }: Props) {
  const { items } = result;
  const visibleRowCount = Math.max(items.length, PLACEHOLDER_ROWS);

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
              <th rowSpan={2} className="border border-slate-500 bg-slate-50 px-3 py-2 text-center text-xs font-bold uppercase text-slate-900">
                JUMLAH SEBELUMNYA
              </th>
              <th colSpan={DAYS_IN_MONTH} className="border border-slate-500 bg-slate-50 px-3 py-2 text-center text-xs font-bold uppercase text-slate-900">
                BULAN
              </th>
              <th rowSpan={2} className="border border-slate-500 bg-slate-50 px-3 py-2 text-center text-xs font-bold uppercase text-slate-900">
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
                  <td className="h-8 border border-slate-500 px-3 py-1 text-xs uppercase tracking-wide text-slate-900">
                    {item ? item.studentName.toUpperCase() : ""}
                  </td>
                  <td className="h-8 border border-slate-500 px-3 py-1 text-xs text-slate-900">
                    {item?.className ?? ""}
                  </td>
                  <td className="h-8 border border-slate-500 px-3 py-1 text-center text-xs text-slate-900">
                    {item ? formatCount(item.previousTotal) : ""}
                  </td>
                  {Array.from({ length: DAYS_IN_MONTH }, (_, dayIndex) => (
                    <td key={dayIndex + 1} className="h-8 border border-slate-500 px-1 py-1 text-center text-xs text-slate-900">
                      {item?.days[dayIndex] ?? ""}
                    </td>
                  ))}
                  <td className="h-8 border border-slate-500 px-3 py-1 text-center text-xs text-slate-900">
                    {item ? formatCount(item.total) : ""}
                  </td>
                  <td className="h-8 border border-slate-500 px-3 py-1 text-xs text-slate-900">
                    {item ? item.description : ""}
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
