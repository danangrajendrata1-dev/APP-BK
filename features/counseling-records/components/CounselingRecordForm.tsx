"use client";

import { useActionState, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import {
  COUNSELING_MEDIA_OPTIONS,
  COUNSELING_TYPE_OPTIONS,
} from "@/lib/constants/options";
import { INITIAL_COUNSELING_RECORD_FORM_STATE } from "@/features/counseling-records/schemas/counselingRecordSchema";
import type { CounselingRecordFormState } from "@/features/counseling-records/types/counselingRecord";
import type { StudentReference } from "@/features/school-attendance/types/schoolAttendance";

type Props = {
  students: StudentReference[];
  action: (
    state: CounselingRecordFormState,
    formData: FormData,
  ) => Promise<CounselingRecordFormState>;
};

function buildStudentOptions(students: StudentReference[]) {
  return students.map((student) => ({
    label: `${student.fullName} - ${student.className}`,
    value: student.id,
  }));
}

export function CounselingRecordForm({ students, action }: Props) {
  const [state, formAction, isPending] = useActionState(action, {
    ...INITIAL_COUNSELING_RECORD_FORM_STATE,
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
        <Input type="date" name="counselingDate" label="Tanggal" defaultValue={state.values.counselingDate} error={state.errors.counselingDate} />
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
        <Input type="number" min={1} name="meetingNumber" label="Pertemuan Ke-" defaultValue={state.values.meetingNumber ? String(state.values.meetingNumber) : ""} error={state.errors.meetingNumber} />
        <Select name="media" label="Media" options={[...COUNSELING_MEDIA_OPTIONS]} defaultValue={state.values.media} error={state.errors.media} />
        <Select name="counselingType" label="Jenis Konseling" options={[...COUNSELING_TYPE_OPTIONS]} defaultValue={state.values.counselingType} error={state.errors.counselingType} />
        <Input name="topic" label="Topik" defaultValue={state.values.topic} error={state.errors.topic} />
        <div className="md:col-span-2">
          <Textarea name="counselingResult" label="Hasil Konseling" defaultValue={state.values.counselingResult} error={state.errors.counselingResult} rows={4} />
        </div>
        <div className="md:col-span-2">
          <Textarea name="followUp" label="Tindak Lanjut" defaultValue={state.values.followUp} error={state.errors.followUp} rows={4} />
        </div>
        <div className="md:col-span-2">
          <Textarea name="description" label="Keterangan" defaultValue={state.values.description} rows={4} />
        </div>
      </div>
      <input type="hidden" name="studentName" value={studentName} />
      <input type="hidden" name="className" value={className} />
      <div className="flex justify-end">
        <Button type="submit" isLoading={isPending}>Simpan Catatan Konseling</Button>
      </div>
    </form>
  );
}
