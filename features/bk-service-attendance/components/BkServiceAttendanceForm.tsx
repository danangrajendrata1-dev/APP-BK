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
  BK_SERVICE_PURPOSE_OPTIONS,
  BK_SERVICE_TYPE_OPTIONS,
} from "@/lib/constants/options";

import { INITIAL_BK_SERVICE_ATTENDANCE_FORM_STATE } from "@/features/bk-service-attendance/schemas/bkServiceAttendanceSchema";
import type {
  BkServiceAttendanceFormState,
} from "@/features/bk-service-attendance/types/bkServiceAttendance";

type BkServiceAttendanceFormProps = {
  action: (
    state: BkServiceAttendanceFormState,
    formData: FormData,
  ) => Promise<BkServiceAttendanceFormState>;
};

type BkServiceAttendanceFormFieldsProps = {
  formAction: (
    formData: FormData,
  ) => void;
  isPending: boolean;
  state: BkServiceAttendanceFormState;
};

function BkServiceAttendanceFormFields({
  formAction,
  isPending,
  state,
}: BkServiceAttendanceFormFieldsProps) {
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
        <Input
          type="date"
          name="serviceDate"
          label="Tanggal"
          defaultValue={state.values.serviceDate}
          error={state.errors.serviceDate}
        />
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

      <input type="hidden" name="studentId" value={studentId} />
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

export function BkServiceAttendanceForm({
  action,
}: BkServiceAttendanceFormProps) {
  const [state, formAction, isPending] = useActionState(action, {
    ...INITIAL_BK_SERVICE_ATTENDANCE_FORM_STATE,
  });
  const formStateKey = [
    state.values.serviceDate,
    state.values.studentId,
    state.values.studentName,
    state.values.className,
    state.values.arrivalTime,
    state.values.finishTime,
    state.values.purpose,
    state.values.serviceType,
    state.values.counselorName,
    state.values.description,
    state.message,
  ].join("|");

  return (
    <BkServiceAttendanceFormFields
      key={formStateKey}
      formAction={formAction}
      isPending={isPending}
      state={state}
    />
  );
}
