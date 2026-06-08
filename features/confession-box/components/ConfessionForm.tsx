"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { CONFESSION_CATEGORY_OPTIONS } from "@/lib/constants/options";
import { INITIAL_CONFESSION_FORM_STATE } from "@/features/confession-box/schemas/confessionSchema";
import type { ConfessionFormState } from "@/features/confession-box/types/confession";

type Props = {
  action: (
    state: ConfessionFormState,
    formData: FormData,
  ) => Promise<ConfessionFormState>;
};

export function ConfessionForm({ action }: Props) {
  const [state, formAction, isPending] = useActionState(action, {
    ...INITIAL_CONFESSION_FORM_STATE,
  });

  return (
    <form action={formAction} className="space-y-5">
      {state.message ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {state.message}
        </div>
      ) : null}
      <div className="grid gap-5 md:grid-cols-2">
        <Input type="date" name="confessionDate" label="Tanggal" defaultValue={state.values.confessionDate} error={state.errors.confessionDate} />
        <Input name="studentName" label="Nama Siswa (Opsional)" defaultValue={state.values.studentName} hint="Boleh dikosongkan sesuai PRD." />
        <Input name="className" label="Kelas" defaultValue={state.values.className} error={state.errors.className} />
        <Select name="category" label="Kategori" options={[...CONFESSION_CATEGORY_OPTIONS]} defaultValue={state.values.category} error={state.errors.category} />
        <div className="md:col-span-2">
          <Textarea name="content" label="Isi Curhat" defaultValue={state.values.content} error={state.errors.content} rows={5} />
        </div>
        <div className="md:col-span-2">
          <Textarea name="description" label="Keterangan" defaultValue={state.values.description} rows={4} />
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" isLoading={isPending}>Kirim Curhat</Button>
      </div>
    </form>
  );
}
