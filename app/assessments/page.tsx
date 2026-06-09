import { revalidatePath } from "next/cache";

import { ErrorState } from "@/components/shared/ErrorState";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { AssessmentFilter } from "@/features/assessments/components/AssessmentFilter";
import { AssessmentTable } from "@/features/assessments/components/AssessmentTable";
import { AssessmentUploadForm } from "@/features/assessments/components/AssessmentUploadForm";
import { createAssessmentFormState, INITIAL_ASSESSMENT_FORM_STATE, parseAssessmentFormData, validateAssessmentForm } from "@/features/assessments/schemas/assessmentSchema";
import { createAssessment, getAssessments } from "@/features/assessments/services/assessmentService";
import type { AssessmentFilters, AssessmentFormState } from "@/features/assessments/types/assessment";
import type { AssessmentType } from "@/types/common";

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

function parseFilters(searchParams: Record<string, string | string[] | undefined>): AssessmentFilters {
  const assessmentType = getSingleValue(searchParams.assessmentType)?.trim() as AssessmentType | undefined;
  return {
    assessmentType: assessmentType || undefined,
  };
}

export default async function AssessmentsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const filters = parseFilters(resolvedSearchParams);
  const page = parsePage(getSingleValue(resolvedSearchParams.page));
  let loadError = "";
  let result: Awaited<ReturnType<typeof getAssessments>> | null = null;

  async function createAssessmentAction(
    _state: AssessmentFormState,
    formData: FormData,
  ): Promise<AssessmentFormState> {
    "use server";

    const values = parseAssessmentFormData(formData);
    const file = formData.get("fileAttachment");
    const parsedFile = file instanceof File ? file : null;
    const errors = validateAssessmentForm(values, parsedFile);

    if (Object.keys(errors).length > 0) {
      return createAssessmentFormState(values, errors, "Periksa kembali form upload asesmen.");
    }

    try {
      await createAssessment(values, parsedFile as File);
      revalidatePath("/assessments");
      return INITIAL_ASSESSMENT_FORM_STATE;
    } catch (error) {
      return createAssessmentFormState(values, {}, error instanceof Error ? error.message : "Gagal menyimpan file asesmen.");
    }
  }

  try {
    result = await getAssessments({ page, pageSize: 20, filters });
  } catch (error) {
    loadError =
      error instanceof Error ? error.message : "Data inventori dan asesmen gagal dimuat.";
  }

  const queryString = new URLSearchParams({
    ...(filters.assessmentType ? { assessmentType: filters.assessmentType } : {}),
  }).toString();

  return (
    <section className="space-y-6">
      <PageHeader title="Inventori dan Asesmen" description="Kelola file inventori dan asesmen BK serta pantau kelengkapannya." />
      <Card>
        <CardHeader>
          <CardTitle>Upload File Asesmen</CardTitle>
          <CardDescription>Unggah file asesmen agar mudah disimpan, dilihat, dan diunduh saat dibutuhkan.</CardDescription>
        </CardHeader>
        <CardContent>
          <AssessmentUploadForm action={createAssessmentAction} />
        </CardContent>
      </Card>
      {loadError ? (
        <ErrorState description={loadError} />
      ) : (
        <>
          <AssessmentFilter filters={filters} />
          {result ? <AssessmentTable result={result} queryString={queryString} /> : null}
        </>
      )}
    </section>
  );
}
