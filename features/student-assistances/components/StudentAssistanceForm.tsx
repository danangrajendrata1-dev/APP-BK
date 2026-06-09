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
import { ASSISTANCE_CODE_OPTIONS } from "@/lib/constants/options";
import { INITIAL_STUDENT_ASSISTANCE_FORM_STATE, calculateStudentAssistanceTotal } from "@/features/student-assistances/schemas/studentAssistanceSchema";
import type { StudentAssistanceFormState } from "@/features/student-assistances/types/studentAssistance";

type Props = {
  action: (
    state: StudentAssistanceFormState,
    formData: FormData,
  ) => Promise<StudentAssistanceFormState>;
};

const MONTH_OPTIONS = Array.from({ length: 12 }, (_, index) => ({ label: String(index + 1), value: String(index + 1) }));

type StudentAssistanceFormFieldsProps = {
  formAction: (
    formData: FormData,
  ) => void;
  isPending: boolean;
  state: StudentAssistanceFormState;
};

function StudentAssistanceFormFields({
  formAction,
  isPending,
  state,
}: StudentAssistanceFormFieldsProps) {
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

  const total = calculateStudentAssistanceTotal(state.values.days);

  return (
    <form action={formAction} className="space-y-5">
      {state.message ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{state.message}</div> : null}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <Select name="month" label="Bulan" options={MONTH_OPTIONS} defaultValue={state.values.month ? String(state.values.month) : ""} error={state.errors.month} placeholder="Pilih bulan" />
        <Input name="year" label="Tahun" type="number" min={2000} max={2100} defaultValue={state.values.year ? String(state.values.year) : ""} error={state.errors.year} />
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
      </div>
      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="min-w-full border-separate border-spacing-0 text-sm">
          <thead>
            <tr>
              {Array.from({ length: 31 }, (_, index) => (
                <th key={index + 1} className="border-b border-slate-200 bg-slate-50 px-3 py-2 text-center font-semibold text-slate-700">
                  {index + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {Array.from({ length: 31 }, (_, index) => (
                <td key={index + 1} className="border-b border-slate-100 px-2 py-2">
                  <Select
                    name={`day${index + 1}`}
                    options={[...ASSISTANCE_CODE_OPTIONS]}
                    defaultValue={state.values.days[`day${index + 1}`]}
                    placeholder="-"
                    className="min-w-[140px]"
                  />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <div className="grid gap-5 md:grid-cols-[200px_1fr]">
        <Input name="totalDisplay" label="Jumlah" value={String(total)} readOnly hint="Dihitung otomatis dari isian tanggal 1-31." />
        <Textarea name="description" label="Keterangan" defaultValue={state.values.description} rows={4} />
      </div>
      <input type="hidden" name="studentId" value={studentId} />
      <input type="hidden" name="studentName" value={studentName} />
      <input type="hidden" name="className" value={className} />
      <div className="flex justify-end">
        <Button type="submit" isLoading={isPending}>Simpan Catatan Pendampingan</Button>
      </div>
    </form>
  );
}

export function StudentAssistanceForm({ action }: Props) {
  const [state, formAction, isPending] = useActionState(action, {
    ...INITIAL_STUDENT_ASSISTANCE_FORM_STATE,
  });
  const formStateKey = [
    state.values.month,
    state.values.year,
    state.values.studentId,
    state.values.studentName,
    state.values.className,
    ...Array.from({ length: 31 }, (_, index) => state.values.days[`day${index + 1}`]),
    state.values.description,
    state.message,
  ].join("|");

  return (
    <StudentAssistanceFormFields
      key={formStateKey}
      formAction={formAction}
      isPending={isPending}
      state={state}
    />
  );
}
