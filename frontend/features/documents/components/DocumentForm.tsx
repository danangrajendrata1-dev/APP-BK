"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { INITIAL_DOCUMENT_FORM_STATE } from "@/features/documents/schemas/documentSchema";
import type { DocumentFormState } from "@/features/documents/types/document";

type Props = {
  action: (
    state: DocumentFormState,
    formData: FormData,
  ) => Promise<DocumentFormState>;
};

type DocumentFormFieldsProps = {
  formAction: (formData: FormData) => void;
  isPending: boolean;
  state: DocumentFormState;
};

function DocumentFormFields({
  formAction,
  isPending,
  state,
}: DocumentFormFieldsProps) {
  return (
    <form action={formAction} className="space-y-5">
      {state.message ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {state.message}
        </div>
      ) : null}
      <div className="grid gap-5 md:grid-cols-2">
        <Input
          name="title"
          label="Judul Surat / Dokumen"
          defaultValue={state.values.title}
          error={state.errors.title}
          placeholder="Contoh: Surat Panggilan Orang Tua"
        />
        <Input
          type="file"
          name="fileAttachment"
          label="File Lampiran"
          error={state.errors.fileAttachment}
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
        />
        <div className="md:col-span-2">
          <Textarea
            name="description"
            label="Deskripsi / Preview Isi"
            defaultValue={state.values.description}
            rows={4}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" isLoading={isPending}>
          Simpan Surat / Dokumen
        </Button>
      </div>
    </form>
  );
}

export function DocumentForm({ action }: Props) {
  const [state, formAction, isPending] = useActionState(action, {
    ...INITIAL_DOCUMENT_FORM_STATE,
  });
  const formStateKey = [
    state.values.title,
    state.values.description,
    state.message,
  ].join("|");

  return (
    <DocumentFormFields
      key={formStateKey}
      formAction={formAction}
      isPending={isPending}
      state={state}
    />
  );
}
