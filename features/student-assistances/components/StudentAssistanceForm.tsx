"use client";

import { useActionState, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { ASSISTANCE_CODE_OPTIONS } from "@/lib/constants/options";
import { INITIAL_STUDENT_ASSISTANCE_FORM_STATE, calculateStudentAssistanceTotal } from "@/features/student-assistances/schemas/studentAssistanceSchema";
import type { StudentAssistanceFormState } from "@/features/student-assistances/types/studentAssistance";
import type { StudentReference } from "@/features/school-attendance/types/schoolAttendance";

type Props = {
  students: StudentReference[];
  action: (
    state: StudentAssistanceFormState,
    formData: FormData,
  ) => Promise<StudentAssistanceFormState>;
};

function buildStudentOptions(students: StudentReference[]) {
  return students.map((student) => ({ label: `${student.fullName} - ${student.className}`, value: student.id }));
}

const MONTH_OPTIONS = Array.from({ length: 12 }, (_, index) => ({ label: String(index + 1), value: String(index + 1) }));

export function StudentAssistanceForm({ students, action }: Props) {
  const [state, formAction, isPending] = useActionState(action, { ...INITIAL_STUDENT_ASSISTANCE_FORM_STATE });
  const [selectedStudentId, setSelectedStudentId] = useState(state.values.studentId ?? "");
  const selectedStudent = students.find((student) => student.id === selectedStudentId);
  const className = selectedStudent?.className ?? state.values.className;
  const studentName = selectedStudent?.fullName ?? state.values.studentName;

  const total = calculateStudentAssistanceTotal(state.values.days);

  return (
    <form action={formAction} className="space-y-5">
      {state.message ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{state.message}</div> : null}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <Select name="month" label="Bulan" options={MONTH_OPTIONS} defaultValue={state.values.month ? String(state.values.month) : ""} error={state.errors.month} placeholder="Pilih bulan" />
        <Input name="year" label="Tahun" type="number" min={2000} max={2100} defaultValue={state.values.year ? String(state.values.year) : ""} error={state.errors.year} />
        <Select name="studentId" label="Nama Siswa" options={buildStudentOptions(students)} value={selectedStudentId} error={state.errors.studentId} onChange={(event) => setSelectedStudentId(event.target.value)} placeholder="Pilih siswa" />
        <Input name="classNameDisplay" label="Kelas" value={className} readOnly />
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
      <input type="hidden" name="studentName" value={studentName} />
      <input type="hidden" name="className" value={className} />
      <div className="flex justify-end">
        <Button type="submit" isLoading={isPending}>Simpan Catatan Pendampingan</Button>
      </div>
    </form>
  );
}
