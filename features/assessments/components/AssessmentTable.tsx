import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/shared/EmptyState";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@/components/ui/Table";
import { ASSESSMENT_TYPE_OPTIONS } from "@/lib/constants/options";

import type { AssessmentListResult } from "@/features/assessments/types/assessment";

type Props = {
  result: AssessmentListResult;
  queryString: string;
};

function createPageHref(queryString: string, page: number) {
  const params = new URLSearchParams(queryString);
  params.set("page", String(page));
  return `/assessments?${params.toString()}`;
}

export function AssessmentTable({ result, queryString }: Props) {
  const { items, pagination } = result;
  const latestByType = new Map(items.map((item) => [item.assessmentType, item]));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daftar File Asesmen Wajib</CardTitle>
        <CardDescription>Semua file yang diwajibkan PRD harus tersedia dan dapat diakses sesuai hak role.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Jenis Asesmen</TableHeaderCell>
              <TableHeaderCell>Status File</TableHeaderCell>
              <TableHeaderCell>Terakhir Diperbarui</TableHeaderCell>
              <TableHeaderCell>File</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ASSESSMENT_TYPE_OPTIONS.map((requiredType) => {
              const fileItem = latestByType.get(requiredType.value);

              return (
                <TableRow key={requiredType.value}>
                  <TableCell className="font-medium text-slate-900">{requiredType.label}</TableCell>
                  <TableCell>{fileItem ? "Tersedia" : "Belum tersedia"}</TableCell>
                  <TableCell>{fileItem?.updatedAt ? new Date(fileItem.updatedAt).toLocaleString("id-ID") : "-"}</TableCell>
                  <TableCell>
                    {fileItem?.fileUrl ? (
                      <Link href={fileItem.fileUrl} target="_blank" className="font-medium text-slate-900 underline underline-offset-4">
                        Lihat / Download
                      </Link>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {!items.length ? (
          <EmptyState title="Belum ada file asesmen" description="Upload file pertama agar daftar inventori dan asesmen mulai terisi." />
        ) : null}

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
