"use client";

import { useActionState, useState } from "react";

import { ClassSearchSelect } from "@/components/shared/ClassSearchSelect";
import {
  StudentSearchSelect,
  type StudentSearchOption,
} from "@/components/shared/StudentSearchSelect";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { DOCUMENT_TYPE_OPTIONS } from "@/lib/constants/options";
import { INITIAL_DOCUMENT_FORM_STATE } from "@/features/documents/schemas/documentSchema";
import type { DocumentFormState } from "@/features/documents/types/document";

type Props = {
  action: (
    state: DocumentFormState,
    formData: FormData,
  ) => Promise<DocumentFormState>;
};

type DocumentFormFieldsProps = {
  formAction: (
    formData: FormData,
  ) => void;
  isPending: boolean;
  state: DocumentFormState;
};

function DocumentFormFields({
  formAction,
  isPending,
  state,
}: DocumentFormFieldsProps) {
  const [selectedClass, setSelectedClass] = useState(state.values.className ?? "");
  const [selectedStudent, setSelectedStudent] = useState<StudentSearchOption | null>(
    state.values.studentId
      ? {
          id: state.values.studentId,
          fullName: state.values.studentName,
          nis: "",
          className: state.values.className,
        }
      : null,
  );
  const [classSearchKey, setClassSearchKey] = useState(0);
  const [studentSearchKey, setStudentSearchKey] = useState(0);
  const className = selectedStudent?.className ?? selectedClass;
  const studentId = selectedStudent?.id ?? "";
  const studentName = selectedStudent?.fullName ?? "";

  return (
    <form action={formAction} className="space-y-5">
      {state.message ? (
        <div className="border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {state.message}
        </div>
      ) : null}
      <div className="grid gap-5 md:grid-cols-2">
        <Input name="letterNumber" label="Nomor Surat" defaultValue={state.values.letterNumber} error={state.errors.letterNumber} />
        <Input type="date" name="documentDate" label="Tanggal" defaultValue={state.values.documentDate} error={state.errors.documentDate} />
        <StudentSearchSelect
          key={`student-search-${studentSearchKey}`}
          label="Nama Siswa"
          selectedClass={selectedClass}
          value={selectedStudent}
          error={state.errors.studentId}
          hint={
            selectedClass
              ? "Pencarian siswa dibatasi ke kelas yang dipilih."
              : "Cari siswa langsung, atau pilih kelas dulu untuk mempersempit hasil."
          }
          onSelectStudent={(student) => {
            setSelectedStudent(student);
            if (student) {
              setSelectedClass(student.className);
              setClassSearchKey((currentValue) => currentValue + 1);
            }
          }}
        />
        <ClassSearchSelect
          key={`class-search-${classSearchKey}`}
          label="Kelas"
          value={className}
          error={state.errors.className}
          hint={
            selectedStudent
              ? "Kelas mengikuti siswa yang dipilih. Mengubah kelas akan mengosongkan siswa bila tidak sesuai."
              : "Cari kelas minimal 1 karakter untuk mempersempit pencarian siswa."
          }
          onSelectClass={(nextClass) => {
            setSelectedClass(nextClass);
            if (selectedStudent && selectedStudent.className !== nextClass) {
              setSelectedStudent(null);
              setStudentSearchKey((currentValue) => currentValue + 1);
            }
          }}
        />
        <Select name="documentType" label="Jenis Surat" options={[...DOCUMENT_TYPE_OPTIONS]} defaultValue={state.values.documentType} error={state.errors.documentType} />
        <Input type="file" name="fileAttachment" label="File Lampiran" error={state.errors.fileAttachment} accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp" />
        <div className="md:col-span-2">
          <Textarea name="description" label="Keterangan" defaultValue={state.values.description} rows={4} />
        </div>
      </div>
      <input type="hidden" name="studentId" value={studentId} />
      <input type="hidden" name="studentName" value={studentName} />
      <input type="hidden" name="className" value={className} />
      <div className="flex justify-end">
        <Button type="submit" isLoading={isPending}>Simpan Surat & Dokumen</Button>
      </div>
    </form>
  );
}

export function DocumentForm({ action }: Props) {
  const [state, formAction, isPending] = useActionState(action, {
    ...INITIAL_DOCUMENT_FORM_STATE,
  });
  const formStateKey = [
    state.values.letterNumber,
    state.values.documentDate,
    state.values.studentId,
    state.values.studentName,
    state.values.className,
    state.values.documentType,
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
