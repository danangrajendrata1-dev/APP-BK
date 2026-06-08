"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ASSESSMENT_TYPE_OPTIONS } from "@/lib/constants/options";
import { INITIAL_ASSESSMENT_FORM_STATE } from "@/features/assessments/schemas/assessmentSchema";
import type { AssessmentFormState } from "@/features/assessments/types/assessment";

type Props = {
  action: (
    state: AssessmentFormState,
    formData: FormData,
  ) => Promise<AssessmentFormState>;
};

export function AssessmentUploadForm({ action }: Props) {
  const [state, formAction, isPending] = useActionState(action, {
    ...INITIAL_ASSESSMENT_FORM_STATE,
  });

  return (
    <form action={formAction} className="space-y-5">
      {state.message ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {state.message}
        </div>
      ) : null}
      <div className="grid gap-5 md:grid-cols-2">
        <Select
          name="assessmentType"
          label="Jenis File Asesmen"
          options={[...ASSESSMENT_TYPE_OPTIONS]}
          defaultValue={state.values.assessmentType}
          error={state.errors.assessmentType}
        />
        <Input
          type="file"
          name="fileAttachment"
          label="File Asesmen"
          error={state.errors.fileAttachment}
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
        />
      </div>
      <div className="flex justify-end">
        <Button type="submit" isLoading={isPending}>
          Upload File Asesmen
        </Button>
      </div>
    </form>
  );
}
