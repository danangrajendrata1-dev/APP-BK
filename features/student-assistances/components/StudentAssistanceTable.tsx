import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/shared/EmptyState";
import type { StudentAssistanceListResult } from "@/features/student-assistances/types/studentAssistance";

type Props = { result: StudentAssistanceListResult; queryString: string };
function createPageHref(queryString: string, page: number) {
  const params = new URLSearchParams(queryString);
  params.set("page", String(page));
  return `/student-assistances?${params.toString()}`;
}

export function StudentAssistanceTable({ result, queryString }: Props) {
  const { items, pagination } = result;
  if (!items.length) {
    return <EmptyState title="Belum ada catatan pendampingan" description="Tambahkan data pendampingan terlebih dahulu atau ubah filter yang digunakan." />;
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daftar Pendampingan Siswa Per Bulan</CardTitle>
        <CardDescription>Menampilkan {items.length} dari {pagination.totalItems} data pendampingan.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0 text-sm">
            <thead>
              <tr>
                <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left font-semibold text-slate-700">No</th>
                <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left font-semibold text-slate-700">Nama Siswa</th>
                {Array.from({ length: 31 }, (_, index) => (
                  <th key={index + 1} className="border-b border-slate-200 bg-slate-50 px-3 py-3 text-center font-semibold text-slate-700">{index + 1}</th>
                ))}
                <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left font-semibold text-slate-700">Jumlah</th>
                <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left font-semibold text-slate-700">Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="border-b border-slate-100 px-4 py-3">{index + 1}</td>
                  <td className="border-b border-slate-100 px-4 py-3 font-medium text-slate-900">{item.studentName}</td>
                  {Array.from({ length: 31 }, (_, dayIndex) => (
                    <td key={dayIndex + 1} className="border-b border-slate-100 px-3 py-3 text-center">{item.days[`day${dayIndex + 1}`] || "-"}</td>
                  ))}
                  <td className="border-b border-slate-100 px-4 py-3">{item.total}</td>
                  <td className="border-b border-slate-100 px-4 py-3">{item.description || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <p>Halaman {pagination.page} dari {pagination.totalPages}</p>
          <div className="flex gap-3">
            <Button href={createPageHref(queryString, pagination.page - 1)} variant="outline" disabled={pagination.page <= 1}>Sebelumnya</Button>
            <Button href={createPageHref(queryString, pagination.page + 1)} variant="outline" disabled={pagination.page >= pagination.totalPages}>Berikutnya</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
