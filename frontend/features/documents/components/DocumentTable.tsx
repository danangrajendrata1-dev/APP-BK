import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/shared/EmptyState";
import type { DocumentListResult } from "@/features/documents/types/document";

type Props = { result: DocumentListResult };

function createPageHref(page: number) {
  return `/documents?page=${page}`;
}

function getDocumentLabel(item: DocumentListResult["items"][number]) {
  if (item.title) {
    return item.title;
  }

  return "Dokumen tanpa judul";
}

function renderEmptyRows(count: number) {
  return Array.from({ length: count }, (_, index) => (
    <tr key={`empty-row-${index}`} className="h-10">
      <td className="border-b border-slate-100 px-3 py-3.5" />
      <td className="border-b border-slate-100 px-3 py-3.5" />
    </tr>
  ));
}

export function DocumentTable({ result }: Props) {
  const { items, pagination } = result;

  if (!items.length) {
    return (
      <div className="border-b border-slate-100 bg-white">
        <EmptyState
          title="Belum ada surat & dokumen"
          description="Gunakan tombol Import Surat / Dokumen untuk menambahkan dokumen pertama."
        />
      </div>
    );
  }

  const emptyRowCount = Math.max(0, 8 - items.length);

  return (
    <div className="space-y-4 rounded-2xl border border-slate-100 bg-white shadow-[0_2px_12px_rgb(0,0,0,0.03)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full  bg-white text-sm text-slate-800 sm:text-sm">
          <thead>
            <tr>
              <th className="border-b border-slate-100 bg-slate-100/60 px-3 py-3.5 text-left font-semibold uppercase tracking-normal text-slate-800">
                Surat &amp; Dokumen
              </th>
              <th className="border-b border-slate-100 bg-slate-100/60 px-3 py-3.5 text-left font-semibold uppercase tracking-normal text-slate-800">
                Deskripsi / Preview Isi
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="align-top">
                <td className="border-b border-slate-100 px-3 py-3.5">
                  <p className="font-medium text-slate-800">{getDocumentLabel(item)}</p>
                </td>
                <td className="border-b border-slate-100 px-3 py-3.5">
                  <div className="space-y-2">
                    <p className="whitespace-pre-wrap leading-5 text-slate-700">
                      {item.description || "Preview belum tersedia"}
                    </p>
                    {item.filePath ? (
                      <Button
                        href={`/documents/open/${item.id}`}
                        variant="outline"
                        size="sm"
                      >
                        Buka dokumen
                      </Button>
                    ) : (
                      <p className="text-sm text-slate-500">Preview belum tersedia</p>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {renderEmptyRows(emptyRowCount)}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col gap-3 border-t border-slate-200 px-3 py-3 text-sm text-slate-800 sm:flex-row sm:items-center sm:justify-between">
        <p>
          Halaman {pagination.page} dari {pagination.totalPages}
        </p>
        <div className="flex gap-3">
          <Button
            href={createPageHref(pagination.page - 1)}
            variant="outline"
            disabled={pagination.page <= 1}
          >
            Sebelumnya
          </Button>
          <Button
            href={createPageHref(pagination.page + 1)}
            variant="outline"
            disabled={pagination.page >= pagination.totalPages}
          >
            Berikutnya
          </Button>
        </div>
      </div>
    </div>
  );
}
