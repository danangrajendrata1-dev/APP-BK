import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/shared/EmptyState";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@/components/ui/Table";
import type { ClassAssistanceListResult } from "@/features/class-assistances/types/classAssistance";

type Props = { result: ClassAssistanceListResult; queryString: string };
function createPageHref(queryString: string, page: number) {
  const params = new URLSearchParams(queryString);
  params.set("page", String(page));
  return `/class-assistances?${params.toString()}`;
}

export function ClassAssistanceTable({ result, queryString }: Props) {
  const { items, pagination } = result;
  if (!items.length) {
    return <EmptyState title="Belum ada daftar pendampingan per kelas" description="Tambahkan data pendampingan terlebih dahulu atau ubah filter yang digunakan." />;
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daftar Pendampingan Siswa Per Kelas</CardTitle>
        <CardDescription>Menampilkan {items.length} dari {pagination.totalItems} data pendampingan per kelas.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Nomor</TableHeaderCell>
              <TableHeaderCell>Nama Siswa</TableHeaderCell>
              <TableHeaderCell>Jenis Pelanggaran</TableHeaderCell>
              <TableHeaderCell>Bentuk Tindakan</TableHeaderCell>
              <TableHeaderCell>Remisi</TableHeaderCell>
              <TableHeaderCell>Keterangan</TableHeaderCell>
              <TableHeaderCell>SP Akhir</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell className="font-medium text-slate-900">{item.studentName}</TableCell>
                <TableCell>{item.violationType}</TableCell>
                <TableCell>{item.actionForm}</TableCell>
                <TableCell>{item.remission}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.finalWarningLetter}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
