import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/ui/Table";

import type { BkServiceAttendanceListResult } from "@/features/bk-service-attendance/types/bkServiceAttendance";

type BkServiceAttendanceTableProps = {
  result: BkServiceAttendanceListResult;
  queryString: string;
};

function createPageHref(queryString: string, page: number) {
  const params = new URLSearchParams(queryString);
  params.set("page", String(page));
  return `/bk-service-attendance?${params.toString()}`;
}

export function BkServiceAttendanceTable({
  result,
  queryString,
}: BkServiceAttendanceTableProps) {
  const { items, pagination } = result;

  if (!items.length) {
    return (
      <EmptyState
        title="Belum ada presensi layanan BK"
        description="Tambahkan data kunjungan BK terlebih dahulu atau ubah filter yang digunakan."
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daftar Presensi Layanan BK</CardTitle>
        <CardDescription>
          Menampilkan {items.length} dari {pagination.totalItems} data kunjungan BK.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Tanggal</TableHeaderCell>
              <TableHeaderCell>Nama Siswa</TableHeaderCell>
              <TableHeaderCell>Kelas</TableHeaderCell>
              <TableHeaderCell>Jam Datang</TableHeaderCell>
              <TableHeaderCell>Jam Selesai</TableHeaderCell>
              <TableHeaderCell>Keperluan</TableHeaderCell>
              <TableHeaderCell>Jenis Layanan</TableHeaderCell>
              <TableHeaderCell>Guru BK</TableHeaderCell>
              <TableHeaderCell>Keterangan</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.serviceDate}</TableCell>
                <TableCell className="font-medium text-slate-900">
                  {item.studentName}
                </TableCell>
                <TableCell>{item.className}</TableCell>
                <TableCell>{item.arrivalTime}</TableCell>
                <TableCell>{item.finishTime}</TableCell>
                <TableCell>{item.purpose}</TableCell>
                <TableCell>{item.serviceType}</TableCell>
                <TableCell>{item.counselorName}</TableCell>
                <TableCell>{item.description || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Halaman {pagination.page} dari {pagination.totalPages}
          </p>
          <div className="flex gap-3">
            <Button
              href={createPageHref(queryString, pagination.page - 1)}
              variant="outline"
              disabled={pagination.page <= 1}
            >
              Sebelumnya
            </Button>
            <Button
              href={createPageHref(queryString, pagination.page + 1)}
              variant="outline"
              disabled={pagination.page >= pagination.totalPages}
            >
              Berikutnya
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
