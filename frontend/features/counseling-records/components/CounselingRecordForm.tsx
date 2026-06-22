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
import {
  COUNSELING_MEDIA_OPTIONS,
  COUNSELING_TYPE_OPTIONS,
} from "@/lib/constants/options";
import { INITIAL_COUNSELING_RECORD_FORM_STATE } from "@/features/counseling-records/schemas/counselingRecordSchema";
import type { CounselingRecordFormState } from "@/features/counseling-records/types/counselingRecord";

type Props = {
  action: (
    state: CounselingRecordFormState,
    formData: FormData,
  ) => Promise<CounselingRecordFormState>;
};

type CounselingRecordFormFieldsProps = {
  formAction: (
    formData: FormData,
  ) => void;
  isPending: boolean;
  state: CounselingRecordFormState;
};

function CounselingRecordFormFields({
  formAction,
  isPending,
  state,
}: CounselingRecordFormFieldsProps) {
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
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {state.message}
        </div>
      ) : null}
      <div className="grid gap-5 md:grid-cols-2">
        <Input type="date" name="counselingDate" label="Tanggal" defaultValue={state.values.counselingDate} error={state.errors.counselingDate} />
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
      <input type="hidden" name="studentId" value={studentId} />
      <input type="hidden" name="studentName" value={studentName} />
      <input type="hidden" name="className" value={className} />
      <div className="flex justify-end">
        <Button type="submit" isLoading={isPending}>Simpan Catatan Pelanggaran</Button>
      </div>
    </form>
  );
}

export function CounselingRecordForm({ action }: Props) {
  const [state, formAction, isPending] = useActionState(action, {
    ...INITIAL_COUNSELING_RECORD_FORM_STATE,
  });
  const formStateKey = [
    state.values.counselingDate,
    state.values.studentId,
    state.values.studentName,
    state.values.className,
    state.values.meetingNumber,
    state.values.media,
    state.values.counselingType,
    state.values.topic,
    state.values.counselingResult,
    state.values.followUp,
    state.values.description,
    state.message,
  ].join("|");

  return (
    <CounselingRecordFormFields
      key={formStateKey}
      formAction={formAction}
      isPending={isPending}
      state={state}
    />
  );
}
