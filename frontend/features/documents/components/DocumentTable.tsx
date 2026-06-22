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
      <td className="border border-slate-300 px-2 py-2" />
      <td className="border border-slate-300 px-2 py-2" />
    </tr>
  ));
}

export function DocumentTable({ result }: Props) {
  const { items, pagination } = result;

  if (!items.length) {
    return (
      <div className="border border-slate-300 bg-white">
        <EmptyState
          title="Belum ada surat & dokumen"
          description="Gunakan tombol Import Surat / Dokumen untuk menambahkan dokumen pertama."
        />
      </div>
    );
  }

  const emptyRowCount = Math.max(0, 8 - items.length);

  return (
    <section className="space-y-4 border border-slate-300 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse bg-white text-xs text-slate-800 sm:text-sm">
          <thead>
            <tr>
              <th className="border border-slate-300 bg-slate-50 px-2 py-2 text-left font-semibold uppercase tracking-normal text-slate-900">
                Surat &amp; Dokumen
              </th>
              <th className="border border-slate-300 bg-slate-50 px-2 py-2 text-left font-semibold uppercase tracking-normal text-slate-900">
                Deskripsi / Preview Isi
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="align-top">
                <td className="border border-slate-300 px-2 py-2">
                  <p className="font-medium text-slate-900">{getDocumentLabel(item)}</p>
                </td>
                <td className="border border-slate-300 px-2 py-2">
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
                      <p className="text-xs text-slate-500">Preview belum tersedia</p>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {renderEmptyRows(emptyRowCount)}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col gap-3 border-t border-slate-200 px-3 py-3 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
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
    </section>
  );
}
