import { revalidatePath } from "next/cache";

import { ErrorState } from "@/components/shared/ErrorState";
import { PageHeader } from "@/components/shared/PageHeader";
import { DocumentForm } from "@/features/documents/components/DocumentForm";
import { DocumentTable } from "@/features/documents/components/DocumentTable";
import { createDocumentFormState, INITIAL_DOCUMENT_FORM_STATE, parseDocumentFormData, validateDocumentForm } from "@/features/documents/schemas/documentSchema";
import { createDocument, getDocuments } from "@/features/documents/services/documentService";
import type { DocumentFormState } from "@/features/documents/types/document";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parsePage(value: string | undefined) {
  const page = Number(value);
  return Number.isFinite(page) && page > 0 ? page : 1;
}

export default async function DocumentsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const page = parsePage(getSingleValue(resolvedSearchParams.page));
  let loadError = "";
  let result: Awaited<ReturnType<typeof getDocuments>> | null = null;

  async function createDocumentAction(
    _state: DocumentFormState,
    formData: FormData,
  ): Promise<DocumentFormState> {
    "use server";

    const values = parseDocumentFormData(formData);
    const file = formData.get("fileAttachment");
    const parsedFile = file instanceof File ? file : null;
    const errors = validateDocumentForm(values, parsedFile);

    if (Object.keys(errors).length > 0) {
      return createDocumentFormState(values, errors, "Periksa kembali form surat & dokumen.");
    }

    try {
      await createDocument(values, parsedFile as File);
      revalidatePath("/documents");
      return INITIAL_DOCUMENT_FORM_STATE;
    } catch (error) {
      return createDocumentFormState(values, {}, error instanceof Error ? error.message : "Gagal menyimpan surat & dokumen.");
    }
  }

  try {
    result = await getDocuments({ page, pageSize: 20 });
  } catch (error) {
    loadError =
      error instanceof Error
        ? error.message
        : "Data surat & dokumen gagal dimuat.";
  }

  return (
    <section className="space-y-6">
      <PageHeader
        title="Surat & Dokumen"
        description="Daftar surat dan dokumen BK yang sudah diunggah."
      />
      <details className="border border-slate-300 bg-white">
        <summary className="cursor-pointer list-none border-b border-slate-200 px-3 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
          Import Surat / Dokumen
        </summary>
        <div className="px-3 py-3">
          <DocumentForm action={createDocumentAction} />
        </div>
      </details>
      {loadError ? (
        <ErrorState description={loadError} />
      ) : (
        result ? <DocumentTable result={result} /> : null
      )}
    </section>
  );
}
