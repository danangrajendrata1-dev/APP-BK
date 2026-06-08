import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/shared/EmptyState";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@/components/ui/Table";
import type { CounselingRecordListResult } from "@/features/counseling-records/types/counselingRecord";

type Props = { result: CounselingRecordListResult; queryString: string };
function createPageHref(queryString: string, page: number) {
  const params = new URLSearchParams(queryString);
  params.set("page", String(page));
  return `/counseling-records?${params.toString()}`;
}

export function CounselingRecordTable({ result, queryString }: Props) {
  const { items, pagination } = result;
  if (!items.length) {
    return <EmptyState title="Belum ada catatan konseling" description="Tambahkan data konseling terlebih dahulu atau ubah filter yang digunakan." />;
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daftar Catatan Konseling</CardTitle>
        <CardDescription>Menampilkan {items.length} dari {pagination.totalItems} catatan konseling.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Tanggal</TableHeaderCell>
              <TableHeaderCell>Nama Siswa</TableHeaderCell>
              <TableHeaderCell>Kelas</TableHeaderCell>
              <TableHeaderCell>Pertemuan</TableHeaderCell>
              <TableHeaderCell>Media</TableHeaderCell>
              <TableHeaderCell>Jenis</TableHeaderCell>
              <TableHeaderCell>Topik</TableHeaderCell>
              <TableHeaderCell>Hasil Konseling</TableHeaderCell>
              <TableHeaderCell>Tindak Lanjut</TableHeaderCell>
              <TableHeaderCell>Keterangan</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.counselingDate}</TableCell>
                <TableCell className="font-medium text-slate-900">{item.studentName}</TableCell>
                <TableCell>{item.className}</TableCell>
                <TableCell>{item.meetingNumber ?? "-"}</TableCell>
                <TableCell>{item.media}</TableCell>
                <TableCell>{item.counselingType}</TableCell>
                <TableCell>{item.topic}</TableCell>
                <TableCell>{item.counselingResult}</TableCell>
                <TableCell>{item.followUp}</TableCell>
                <TableCell>{item.description || "-"}</TableCell>
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
