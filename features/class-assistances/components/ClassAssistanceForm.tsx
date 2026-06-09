"use client";

import { useActionState, useState } from "react";

import { ClassSearchSelect } from "@/components/shared/ClassSearchSelect";
import {
  StudentSearchSelect,
  type StudentSearchOption,
} from "@/components/shared/StudentSearchSelect";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { INITIAL_CLASS_ASSISTANCE_FORM_STATE } from "@/features/class-assistances/schemas/classAssistanceSchema";
import type { ClassAssistanceFormState } from "@/features/class-assistances/types/classAssistance";

type Props = {
  action: (
    state: ClassAssistanceFormState,
    formData: FormData,
  ) => Promise<ClassAssistanceFormState>;
};

type ClassAssistanceFormFieldsProps = {
  formAction: (
    formData: FormData,
  ) => void;
  isPending: boolean;
  state: ClassAssistanceFormState;
};

function ClassAssistanceFormFields({
  formAction,
  isPending,
  state,
}: ClassAssistanceFormFieldsProps) {
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
      {state.message ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{state.message}</div> : null}
      <div className="grid gap-5 md:grid-cols-2">
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
        <Input name="violationType" label="Jenis Pelanggaran" defaultValue={state.values.violationType} error={state.errors.violationType} />
        <Input name="actionForm" label="Bentuk Tindakan" defaultValue={state.values.actionForm} error={state.errors.actionForm} />
        <Input name="remission" label="Remisi" defaultValue={state.values.remission} error={state.errors.remission} />
        <Input name="finalWarningLetter" label="SP Akhir" defaultValue={state.values.finalWarningLetter} error={state.errors.finalWarningLetter} />
        <div className="md:col-span-2">
          <Textarea name="description" label="Keterangan" defaultValue={state.values.description} error={state.errors.description} rows={4} />
        </div>
      </div>
      <input type="hidden" name="studentId" value={studentId} />
      <input type="hidden" name="studentName" value={studentName} />
      <input type="hidden" name="className" value={className} />
      <div className="flex justify-end">
        <Button type="submit" isLoading={isPending}>Simpan Daftar Pendampingan</Button>
      </div>
    </form>
  );
}

export function ClassAssistanceForm({ action }: Props) {
  const [state, formAction, isPending] = useActionState(action, {
    ...INITIAL_CLASS_ASSISTANCE_FORM_STATE,
  });
  const formStateKey = [
    state.values.studentId,
    state.values.studentName,
    state.values.className,
    state.values.violationType,
    state.values.actionForm,
    state.values.remission,
    state.values.finalWarningLetter,
    state.values.description,
    state.message,
  ].join("|");

  return (
    <ClassAssistanceFormFields
      key={formStateKey}
      formAction={formAction}
      isPending={isPending}
      state={state}
    />
  );
}
