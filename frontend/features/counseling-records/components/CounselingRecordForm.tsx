"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
  EMPTY_COUNSELING_RECORD_FORM_VALUES,
  INITIAL_COUNSELING_RECORD_FORM_STATE,
  MONTH_OPTIONS,
  VIOLATION_CODE_OPTIONS,
} from "@/features/counseling-records/schemas/counselingRecordSchema";
import type {
  CounselingRecordFormAction,
  CounselingRecordFormState,
} from "@/features/counseling-records/types/counselingRecord";

type CounselingRecordFormProps = {
  action: CounselingRecordFormAction;
  initialValues?: Partial<typeof EMPTY_COUNSELING_RECORD_FORM_VALUES>;
  isOpen: boolean;
  onClose: () => void;
};

function CounselingRecordFormFields({
  formAction,
  isPending,
  onClose,
  state,
}: {
  formAction: (formData: FormData) => void;
  isPending: boolean;
  onClose: () => void;
  state: CounselingRecordFormState;
}) {
  const router = useRouter();
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
  const studentId = selectedStudent?.id ?? state.values.studentId ?? "";
  const studentName = selectedStudent?.fullName ?? state.values.studentName ?? "";
  const messageClass =
    state.status === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : "border-rose-200 bg-rose-50 text-rose-700";

  useEffect(() => {
    if (state.status !== "success") {
      return;
    }

    const timeout = window.setTimeout(() => {
      router.refresh();
      onClose();
    }, 700);

    return () => window.clearTimeout(timeout);
  }, [onClose, router, state.status]);

  return (
    <form action={formAction} className="space-y-5">
      {state.message ? (
        <div className={`rounded-2xl border px-4 py-3 text-sm ${messageClass}`}>
          {state.message}
        </div>
      ) : null}
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
        <Select
          name="violationCode"
          label="Jenis Pelanggaran"
          options={[...VIOLATION_CODE_OPTIONS]}
          defaultValue={state.values.violationCode}
          error={state.errors.violationCode}
          placeholder="Pilih jenis pelanggaran"
        />
        <Input
          type="number"
          name="violationDay"
          label="Tanggal"
          min={1}
          max={31}
          defaultValue={state.values.violationDay}
          error={state.errors.violationDay}
        />
        <Select
          name="violationMonth"
          label="Bulan"
          options={[...MONTH_OPTIONS]}
          defaultValue={state.values.violationMonth}
          error={state.errors.violationMonth}
          placeholder="Pilih bulan"
        />
        <Input
          type="number"
          name="violationYear"
          label="Tahun"
          min={2000}
          max={2100}
          defaultValue={state.values.violationYear}
          error={state.errors.violationYear}
        />
        <div className="md:col-span-2">
          <Textarea
            name="description"
            label="Keterangan"
            defaultValue={state.values.description}
            error={state.errors.description}
            rows={4}
          />
        </div>
      </div>
      <input type="hidden" name="studentId" value={studentId} />
      <input type="hidden" name="studentName" value={studentName} />
      <input type="hidden" name="className" value={className} />
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onClose}>
          Batal
        </Button>
        <Button type="submit" isLoading={isPending} disabled={state.status === "success"}>
          Simpan
        </Button>
      </div>
    </form>
  );
}

export function CounselingRecordForm({
  action,
  initialValues,
  isOpen,
  onClose,
}: CounselingRecordFormProps) {
  const [state, formAction, isPending] = useActionState(action, {
    ...INITIAL_COUNSELING_RECORD_FORM_STATE,
    values: {
      ...EMPTY_COUNSELING_RECORD_FORM_VALUES,
      ...initialValues,
    },
  });

  if (!isOpen) {
    return null;
  }

  return (
    <div
      aria-hidden={!isOpen}
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">
              Input Pelanggaran
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Tambahkan catatan pelanggaran untuk rekap bulanan.
            </p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Tutup
          </Button>
        </div>
        <CounselingRecordFormFields
          formAction={formAction}
          isPending={isPending}
          onClose={onClose}
          state={state}
        />
      </div>
    </div>
  );
}
