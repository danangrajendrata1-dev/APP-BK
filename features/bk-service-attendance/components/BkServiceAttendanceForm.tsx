"use client";

import { useActionState, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import {
  BK_SERVICE_PURPOSE_OPTIONS,
  BK_SERVICE_TYPE_OPTIONS,
} from "@/lib/constants/options";

import { INITIAL_BK_SERVICE_ATTENDANCE_FORM_STATE } from "@/features/bk-service-attendance/schemas/bkServiceAttendanceSchema";
import type {
  BkServiceAttendanceFormState,
} from "@/features/bk-service-attendance/types/bkServiceAttendance";
import type { StudentReference } from "@/features/school-attendance/types/schoolAttendance";

type BkServiceAttendanceFormProps = {
  students: StudentReference[];
  action: (
    state: BkServiceAttendanceFormState,
    formData: FormData,
  ) => Promise<BkServiceAttendanceFormState>;
};

function buildStudentOptions(students: StudentReference[]) {
  return students.map((student) => ({
    label: `${student.fullName} - ${student.className}`,
    value: student.id,
  }));
}

export function BkServiceAttendanceForm({
  students,
  action,
}: BkServiceAttendanceFormProps) {
  const [state, formAction, isPending] = useActionState(action, {
    ...INITIAL_BK_SERVICE_ATTENDANCE_FORM_STATE,
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
          name="serviceDate"
          label="Tanggal"
          defaultValue={state.values.serviceDate}
          error={state.errors.serviceDate}
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
        <Input
          type="time"
          name="arrivalTime"
          label="Jam Datang"
          defaultValue={state.values.arrivalTime}
          error={state.errors.arrivalTime}
        />
        <Input
          type="time"
          name="finishTime"
          label="Jam Selesai"
          defaultValue={state.values.finishTime}
          error={state.errors.finishTime}
        />
        <Select
          name="purpose"
          label="Keperluan"
          options={[...BK_SERVICE_PURPOSE_OPTIONS]}
          defaultValue={state.values.purpose}
          error={state.errors.purpose}
        />
        <Select
          name="serviceType"
          label="Jenis Layanan"
          options={[...BK_SERVICE_TYPE_OPTIONS]}
          defaultValue={state.values.serviceType}
          error={state.errors.serviceType}
        />
        <Input
          name="counselorName"
          label="Guru BK"
          defaultValue={state.values.counselorName}
          error={state.errors.counselorName}
          placeholder="Masukkan nama guru BK"
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
          Simpan Presensi Layanan BK
        </Button>
      </div>
    </form>
  );
}
