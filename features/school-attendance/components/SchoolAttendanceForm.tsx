"use client";

import { useActionState, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { SCHOOL_ATTENDANCE_STATUS_OPTIONS } from "@/lib/constants/options";

import { INITIAL_SCHOOL_ATTENDANCE_FORM_STATE } from "@/features/school-attendance/schemas/schoolAttendanceSchema";
import type {
  SchoolAttendanceFormState,
  StudentReference,
} from "@/features/school-attendance/types/schoolAttendance";

type SchoolAttendanceFormProps = {
  students: StudentReference[];
  action: (
    state: SchoolAttendanceFormState,
    formData: FormData,
  ) => Promise<SchoolAttendanceFormState>;
};

function buildStudentOptions(students: StudentReference[]) {
  return students.map((student) => ({
    label: `${student.fullName} - ${student.className}`,
    value: student.id,
  }));
}

export function SchoolAttendanceForm({
  action,
  students,
}: SchoolAttendanceFormProps) {
  const [state, formAction, isPending] = useActionState(action, {
    ...INITIAL_SCHOOL_ATTENDANCE_FORM_STATE,
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
        <Input
          type="date"
          name="attendanceDate"
          label="Tanggal"
          defaultValue={state.values.attendanceDate}
          error={state.errors.attendanceDate}
        />
        <Select
          name="studentId"
          label="Nama Siswa"
          options={buildStudentOptions(students)}
          value={selectedStudentId}
          error={state.errors.studentId}
          onChange={(event) => setSelectedStudentId(event.target.value)}
          placeholder="Pilih siswa"
        />
        <Input
          name="classNameDisplay"
          label="Kelas"
          value={className}
          readOnly
          hint="Kelas mengikuti data siswa yang dipilih."
        />
        <Select
          name="status"
          label="Status"
          options={[...SCHOOL_ATTENDANCE_STATUS_OPTIONS]}
          defaultValue={state.values.status}
          error={state.errors.status}
        />
        <div className="md:col-span-2">
          <Textarea
            name="description"
            label="Keterangan"
            defaultValue={state.values.description}
            rows={4}
          />
        </div>
      </div>

      <input type="hidden" name="studentName" value={studentName} />
      <input type="hidden" name="className" value={className} />

      <div className="flex justify-end">
        <Button type="submit" isLoading={isPending}>
          Simpan Presensi Sekolah
        </Button>
      </div>
    </form>
  );
}
