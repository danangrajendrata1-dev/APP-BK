import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/shared/EmptyState";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@/components/ui/Table";
import type { HomeVisitListResult } from "@/features/home-visits/types/homeVisit";

type Props = { result: HomeVisitListResult; queryString: string };
function createPageHref(queryString: string, page: number) {
  const params = new URLSearchParams(queryString);
  params.set("page", String(page));
  return `/home-visits?${params.toString()}`;
}

export function HomeVisitTable({ result, queryString }: Props) {
  const { items, pagination } = result;
  if (!items.length) {
    return <EmptyState title="Belum ada data home visit" description="Tambahkan data home visit terlebih dahulu atau ubah filter yang digunakan." />;
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daftar Home Visit</CardTitle>
        <CardDescription>Menampilkan {items.length} dari {pagination.totalItems} data home visit.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Tanggal</TableHeaderCell>
              <TableHeaderCell>Nama Siswa</TableHeaderCell>
              <TableHeaderCell>Nama Orang Tua/Wali</TableHeaderCell>
              <TableHeaderCell>Kelas</TableHeaderCell>
              <TableHeaderCell>Alamat</TableHeaderCell>
              <TableHeaderCell>Hasil Kunjungan</TableHeaderCell>
              <TableHeaderCell>Tindak Lanjut</TableHeaderCell>
              <TableHeaderCell>Dokumentasi</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.visitDate}</TableCell>
                <TableCell className="font-medium text-slate-900">{item.studentName}</TableCell>
                <TableCell>{item.parentName}</TableCell>
                <TableCell>{item.className}</TableCell>
                <TableCell>{item.address}</TableCell>
                <TableCell>{item.visitResult}</TableCell>
                <TableCell>{item.followUp}</TableCell>
                <TableCell>
                    {item.documentationPath ? (
                      <Button href={`/home-visits/open/${item.id}`} variant="outline" size="sm">
                        Buka File
                      </Button>
                    ) : (
                      "-"
                    )}
                </TableCell>
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
