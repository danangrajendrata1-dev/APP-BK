import Link from "next/link";

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

import { StudentStatusBadge } from "@/features/students/components/StudentStatusBadge";
import type { StudentListResult } from "@/features/students/types/student";

type StudentTableProps = {
  result: StudentListResult;
  queryString: string;
};

function createPageHref(queryString: string, page: number) {
  const params = new URLSearchParams(queryString);
  params.set("page", String(page));
  return `/students?${params.toString()}`;
}

export function StudentTable({ result, queryString }: StudentTableProps) {
  const { items, pagination } = result;

  if (!items.length) {
    return (
      <EmptyState
        title="Belum ada data siswa"
        description="Tambahkan data siswa terlebih dahulu atau ubah filter pencarian Anda."
        action={<Button href="/students/create">Tambah Data Siswa</Button>}
      />
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle>Daftar Siswa</CardTitle>
          <CardDescription>
            Menampilkan {items.length} dari {pagination.totalItems} data siswa.
          </CardDescription>
        </div>
        <Button href="/students/create">Tambah Data Siswa</Button>
      </CardHeader>
      <CardContent className="space-y-5">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>NISN</TableHeaderCell>
              <TableHeaderCell>Nama Siswa</TableHeaderCell>
              <TableHeaderCell>Jenis Kelamin</TableHeaderCell>
              <TableHeaderCell>Kelas</TableHeaderCell>
              <TableHeaderCell>Jurusan</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell className="text-right">Aksi</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium text-slate-900">
                  {student.nisn}
                </TableCell>
                <TableCell>{student.fullName}</TableCell>
                <TableCell>{student.gender}</TableCell>
                <TableCell>{student.className}</TableCell>
                <TableCell>{student.major}</TableCell>
                <TableCell>
                  <StudentStatusBadge status={student.status} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/students/${student.id}`}
                      className="inline-flex items-center rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                    >
                      Detail
                    </Link>
                    <Link
                      href={`/students/${student.id}/edit`}
                      className="inline-flex items-center rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
                    >
                      Edit
                    </Link>
                  </div>
                </TableCell>
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
