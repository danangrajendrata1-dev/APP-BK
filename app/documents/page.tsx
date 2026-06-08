import { revalidatePath } from "next/cache";

import { ErrorState } from "@/components/shared/ErrorState";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { DocumentFilter } from "@/features/documents/components/DocumentFilter";
import { DocumentForm } from "@/features/documents/components/DocumentForm";
import { DocumentTable } from "@/features/documents/components/DocumentTable";
import { createDocumentFormState, INITIAL_DOCUMENT_FORM_STATE, parseDocumentFormData, validateDocumentForm } from "@/features/documents/schemas/documentSchema";
import { createDocument, getDocuments } from "@/features/documents/services/documentService";
import type { DocumentFilters, DocumentFormState } from "@/features/documents/types/document";
import { getStudentReferences } from "@/features/school-attendance/services/schoolAttendanceService";
import type { DocumentType } from "@/types/common";

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

function parseFilters(searchParams: Record<string, string | string[] | undefined>): DocumentFilters {
  const documentDate = getSingleValue(searchParams.documentDate)?.trim();
  const studentName = getSingleValue(searchParams.studentName)?.trim();
  const className = getSingleValue(searchParams.className)?.trim();
  const documentType = getSingleValue(searchParams.documentType)?.trim() as DocumentType | undefined;
  return {
    documentDate: documentDate || undefined,
    documentType: documentType || undefined,
    studentName: studentName || undefined,
    className: className || undefined,
  };
}

export default async function DocumentsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const filters = parseFilters(resolvedSearchParams);
  const page = parsePage(getSingleValue(resolvedSearchParams.page));
  let loadError = "";
  let students: Awaited<ReturnType<typeof getStudentReferences>> = [];
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
    [students, result] = await Promise.all([
      getStudentReferences(),
      getDocuments({ page, pageSize: 10, filters }),
    ]);
  } catch (error) {
    loadError =
      error instanceof Error
        ? error.message
        : "Data surat & dokumen gagal dimuat.";
  }

  const queryString = new URLSearchParams({
    ...(filters.documentDate ? { documentDate: filters.documentDate } : {}),
    ...(filters.documentType ? { documentType: filters.documentType } : {}),
    ...(filters.studentName ? { studentName: filters.studentName } : {}),
    ...(filters.className ? { className: filters.className } : {}),
  }).toString();

  return (
    <section className="space-y-6">
      <PageHeader title="Surat & Dokumen" description="Kelola surat dan dokumen BK sesuai PRD, termasuk upload file lampiran ke penyimpanan aman dan filter berdasarkan tanggal, jenis surat, nama siswa, serta kelas." />
      <Card>
        <CardHeader>
          <CardTitle>Input Surat & Dokumen</CardTitle>
          <CardDescription>File lampiran disimpan ke Supabase Storage bucket `document-files` dan hanya dibuka melalui akses terkontrol.</CardDescription>
        </CardHeader>
        <CardContent>
          <DocumentForm students={students} action={createDocumentAction} />
        </CardContent>
      </Card>
      {loadError ? (
        <ErrorState description={loadError} />
      ) : (
        <>
          <DocumentFilter filters={filters} />
          {result ? <DocumentTable result={result} queryString={queryString} /> : null}
        </>
      )}
    </section>
  );
}
