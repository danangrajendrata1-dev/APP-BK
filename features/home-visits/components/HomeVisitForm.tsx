"use client";

import { useActionState, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { INITIAL_HOME_VISIT_FORM_STATE } from "@/features/home-visits/schemas/homeVisitSchema";
import type { HomeVisitFormState } from "@/features/home-visits/types/homeVisit";
import type { StudentReference } from "@/features/school-attendance/types/schoolAttendance";

type Props = {
  students: StudentReference[];
  action: (
    state: HomeVisitFormState,
    formData: FormData,
  ) => Promise<HomeVisitFormState>;
};

function buildStudentOptions(students: StudentReference[]) {
  return students.map((student) => ({
    label: `${student.fullName} - ${student.className}`,
    value: student.id,
  }));
}

export function HomeVisitForm({ students, action }: Props) {
  const [state, formAction, isPending] = useActionState(action, {
    ...INITIAL_HOME_VISIT_FORM_STATE,
  });
  const [selectedStudentId, setSelectedStudentId] = useState(
    state.values.studentId ?? "",
  );
  const selectedStudent = students.find((student) => student.id === selectedStudentId);
  const studentName = selectedStudent?.fullName ?? state.values.studentName;
  const className = selectedStudent?.className ?? state.values.className;
  const parentName = selectedStudent?.parentName ?? state.values.parentName;
  const address = selectedStudent?.address ?? state.values.address;

  return (
    <form action={formAction} className="space-y-5">
      {state.message ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {state.message}
        </div>
      ) : null}
      <div className="grid gap-5 md:grid-cols-2">
        <Input type="date" name="visitDate" label="Tanggal" defaultValue={state.values.visitDate} error={state.errors.visitDate} />
        <Select
          name="studentId"
          label="Nama Siswa"
          options={buildStudentOptions(students)}
          value={selectedStudentId}
          error={state.errors.studentId}
          onChange={(event) => setSelectedStudentId(event.target.value)}
          placeholder="Pilih siswa"
        />
        <Input name="parentNameDisplay" label="Nama Orang Tua/Wali" value={parentName} readOnly />
        <Input name="classNameDisplay" label="Kelas" value={className} readOnly />
        <div className="md:col-span-2">
          <Textarea name="addressDisplay" label="Alamat" value={address} readOnly rows={3} />
        </div>
        <div className="md:col-span-2">
          <Textarea name="visitResult" label="Hasil Kunjungan" defaultValue={state.values.visitResult} error={state.errors.visitResult} rows={4} />
        </div>
        <div className="md:col-span-2">
          <Textarea name="followUp" label="Tindak Lanjut" defaultValue={state.values.followUp} error={state.errors.followUp} rows={4} />
        </div>
        <Input type="file" name="documentation" label="Dokumentasi" error={state.errors.documentation} accept=".jpg,.jpeg,.png,.webp,.pdf" />
      </div>
      <input type="hidden" name="studentName" value={studentName} />
      <input type="hidden" name="parentName" value={parentName} />
      <input type="hidden" name="className" value={className} />
      <input type="hidden" name="address" value={address} />
      <div className="flex justify-end">
        <Button type="submit" isLoading={isPending}>Simpan Home Visit</Button>
      </div>
    </form>
  );
}
