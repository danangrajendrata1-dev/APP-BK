"use client";

import { useActionState, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { INITIAL_CLASS_ASSISTANCE_FORM_STATE } from "@/features/class-assistances/schemas/classAssistanceSchema";
import type { ClassAssistanceFormState } from "@/features/class-assistances/types/classAssistance";
import type { StudentReference } from "@/features/school-attendance/types/schoolAttendance";

type Props = {
  students: StudentReference[];
  action: (
    state: ClassAssistanceFormState,
    formData: FormData,
  ) => Promise<ClassAssistanceFormState>;
};

function buildStudentOptions(students: StudentReference[]) {
  return students.map((student) => ({ label: `${student.fullName} - ${student.className}`, value: student.id }));
}

export function ClassAssistanceForm({ students, action }: Props) {
  const [state, formAction, isPending] = useActionState(action, { ...INITIAL_CLASS_ASSISTANCE_FORM_STATE });
  const [selectedStudentId, setSelectedStudentId] = useState(state.values.studentId ?? "");
  const selectedStudent = students.find((student) => student.id === selectedStudentId);
  const className = selectedStudent?.className ?? state.values.className;
  const studentName = selectedStudent?.fullName ?? state.values.studentName;

  return (
    <form action={formAction} className="space-y-5">
      {state.message ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{state.message}</div> : null}
      <div className="grid gap-5 md:grid-cols-2">
        <Select name="studentId" label="Nama Siswa" options={buildStudentOptions(students)} value={selectedStudentId} error={state.errors.studentId} onChange={(event) => setSelectedStudentId(event.target.value)} placeholder="Pilih siswa" />
        <Input name="classNameDisplay" label="Kelas" value={className} readOnly />
        <Input name="violationType" label="Jenis Pelanggaran" defaultValue={state.values.violationType} error={state.errors.violationType} />
        <Input name="actionForm" label="Bentuk Tindakan" defaultValue={state.values.actionForm} error={state.errors.actionForm} />
        <Input name="remission" label="Remisi" defaultValue={state.values.remission} error={state.errors.remission} />
        <Input name="finalWarningLetter" label="SP Akhir" defaultValue={state.values.finalWarningLetter} error={state.errors.finalWarningLetter} />
        <div className="md:col-span-2">
          <Textarea name="description" label="Keterangan" defaultValue={state.values.description} error={state.errors.description} rows={4} />
        </div>
      </div>
      <input type="hidden" name="studentName" value={studentName} />
      <input type="hidden" name="className" value={className} />
      <div className="flex justify-end">
        <Button type="submit" isLoading={isPending}>Simpan Daftar Pendampingan</Button>
      </div>
    </form>
  );
}
