"use client";

import { useActionState, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { DOCUMENT_TYPE_OPTIONS } from "@/lib/constants/options";
import { INITIAL_DOCUMENT_FORM_STATE } from "@/features/documents/schemas/documentSchema";
import type { DocumentFormState } from "@/features/documents/types/document";
import type { StudentReference } from "@/features/school-attendance/types/schoolAttendance";

type Props = {
  students: StudentReference[];
  action: (
    state: DocumentFormState,
    formData: FormData,
  ) => Promise<DocumentFormState>;
};

function buildStudentOptions(students: StudentReference[]) {
  return students.map((student) => ({
    label: `${student.fullName} - ${student.className}`,
    value: student.id,
  }));
}

export function DocumentForm({ students, action }: Props) {
  const [state, formAction, isPending] = useActionState(action, {
    ...INITIAL_DOCUMENT_FORM_STATE,
  });
  const [selectedStudentId, setSelectedStudentId] = useState(
    state.values.studentId ?? "",
  );
  const selectedStudent = students.find((student) => student.id === selectedStudentId);
  const className = selectedStudent?.className ?? state.values.className;
  const studentName = selectedStudent?.fullName ?? state.values.studentName;

  return (
    <form action={formAction} className="space-y-5">
      {state.message ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {state.message}
        </div>
      ) : null}
      <div className="grid gap-5 md:grid-cols-2">
        <Input name="letterNumber" label="Nomor Surat" defaultValue={state.values.letterNumber} error={state.errors.letterNumber} />
        <Input type="date" name="documentDate" label="Tanggal" defaultValue={state.values.documentDate} error={state.errors.documentDate} />
        <Select
          name="studentId"
          label="Nama Siswa"
          options={buildStudentOptions(students)}
          value={selectedStudentId}
          error={state.errors.studentId}
          onChange={(event) => setSelectedStudentId(event.target.value)}
          placeholder="Pilih siswa"
        />
        <Input name="classNameDisplay" label="Kelas" value={className} readOnly />
        <Select name="documentType" label="Jenis Surat" options={[...DOCUMENT_TYPE_OPTIONS]} defaultValue={state.values.documentType} error={state.errors.documentType} />
        <Input type="file" name="fileAttachment" label="File Lampiran" error={state.errors.fileAttachment} accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp" />
        <div className="md:col-span-2">
          <Textarea name="description" label="Keterangan" defaultValue={state.values.description} rows={4} />
        </div>
      </div>
      <input type="hidden" name="studentName" value={studentName} />
      <input type="hidden" name="className" value={className} />
      <div className="flex justify-end">
        <Button type="submit" isLoading={isPending}>Simpan Surat & Dokumen</Button>
      </div>
    </form>
  );
}
