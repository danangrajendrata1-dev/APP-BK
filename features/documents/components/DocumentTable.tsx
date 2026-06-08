import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/shared/EmptyState";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@/components/ui/Table";
import type { DocumentListResult } from "@/features/documents/types/document";

type Props = { result: DocumentListResult; queryString: string };

function createPageHref(queryString: string, page: number) {
  const params = new URLSearchParams(queryString);
  params.set("page", String(page));
  return `/documents?${params.toString()}`;
}

export function DocumentTable({ result, queryString }: Props) {
  const { items, pagination } = result;

  if (!items.length) {
    return <EmptyState title="Belum ada surat & dokumen" description="Tambahkan data dokumen terlebih dahulu atau ubah filter yang digunakan." />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daftar Surat & Dokumen</CardTitle>
        <CardDescription>Menampilkan {items.length} dari {pagination.totalItems} data surat & dokumen.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Nomor Surat</TableHeaderCell>
              <TableHeaderCell>Tanggal</TableHeaderCell>
              <TableHeaderCell>Nama Siswa</TableHeaderCell>
              <TableHeaderCell>Kelas</TableHeaderCell>
              <TableHeaderCell>Jenis Surat</TableHeaderCell>
              <TableHeaderCell>File Lampiran</TableHeaderCell>
              <TableHeaderCell>Keterangan</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium text-slate-900">{item.letterNumber}</TableCell>
                <TableCell>{item.documentDate}</TableCell>
                <TableCell>{item.studentName}</TableCell>
                <TableCell>{item.className}</TableCell>
                <TableCell>{item.documentType}</TableCell>
                <TableCell>
                  {item.fileUrl ? (
                    <Link href={item.fileUrl} target="_blank" className="font-medium text-slate-900 underline underline-offset-4">
                      Buka File
                    </Link>
                  ) : (
                    "-"
                  )}
                </TableCell>
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
