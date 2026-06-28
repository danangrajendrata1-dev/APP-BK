"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
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
  EMPTY_SCHOOL_ATTENDANCE_FORM_VALUES,
  INITIAL_SCHOOL_ATTENDANCE_FORM_STATE,
  SCHOOL_ATTENDANCE_FORM_STATUS_OPTIONS,
} from "@/features/school-attendance/schemas/schoolAttendanceSchema";
import type { SchoolAttendanceFormState } from "@/features/school-attendance/types/schoolAttendance";
import type { SchoolAttendanceFormValues } from "@/types/common";

type SchoolAttendanceFormProps = {
  action: (
    state: SchoolAttendanceFormState,
    formData: FormData,
  ) => Promise<SchoolAttendanceFormState>;
  initialValues?: Partial<SchoolAttendanceFormValues>;
  isOpen: boolean;
  onClose: () => void;
};

type SchoolAttendanceFormFieldsProps = {
  formAction: (formData: FormData) => void;
  isPending: boolean;
  state: SchoolAttendanceFormState;
  onClose: () => void;
};

const MONTH_NAMES = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const MONTH_OPTIONS = MONTH_NAMES.map((name, index) => ({
  label: name,
  value: String(index + 1),
}));

function getDaysInMonth(monthValue: string, yearValue: string) {
  const month = Number(monthValue);
  const year = Number(yearValue);

  if (!Number.isInteger(month) || month < 1 || month > 12) {
    return 31;
  }

  if (!Number.isInteger(year) || year < 2000 || year > 2100) {
    return 31;
  }

  return new Date(year, month, 0).getDate();
}

function buildDayOptions(monthValue: string, yearValue: string) {
  const daysInMonth = getDaysInMonth(monthValue, yearValue);

  return Array.from({ length: daysInMonth }, (_, index) => {
    const value = String(index + 1);
    return { label: value, value };
  });
}

function SchoolAttendanceFormFields({
  formAction,
  isPending,
  state,
  onClose,
}: SchoolAttendanceFormFieldsProps) {
  const router = useRouter();
  const [selectedClass, setSelectedClass] = useState(
    state.values.className ?? "",
  );
  const [selectedStudent, setSelectedStudent] =
    useState<StudentSearchOption | null>(
      state.values.studentId
        ? {
            id: state.values.studentId,
            fullName: state.values.studentName,
            nis: "",
            className: state.values.className,
          }
        : null,
    );
  const [month, setMonth] = useState(state.values.month ?? "");
  const [year, setYear] = useState(state.values.year ?? "");
  const [day, setDay] = useState(state.values.day ?? "");
  const [status, setStatus] = useState<string>(state.values.status ?? "");
  const [classSearchKey, setClassSearchKey] = useState(0);
  const [studentSearchKey, setStudentSearchKey] = useState(0);
  const className = selectedStudent?.className ?? selectedClass;
  const studentId = selectedStudent?.id ?? state.values.studentId ?? "";
  const studentName = selectedStudent?.fullName ?? state.values.studentName ?? "";
  const dayOptions = useMemo(() => buildDayOptions(month, year), [month, year]);

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

      <div className="grid gap-4 md:grid-cols-2">
        <StudentSearchSelect
          key={`student-search-${studentSearchKey}`}
          label="Nama Lengkap Siswa"
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
          name="month"
          label="Bulan"
          options={MONTH_OPTIONS}
          placeholder="Pilih bulan"
          value={month}
          error={state.errors.month}
          onChange={(event) => setMonth(event.target.value)}
        />
        <Input
          type="number"
          name="year"
          label="Tahun"
          min={2000}
          max={2100}
          placeholder="Contoh: 2026"
          value={year}
          error={state.errors.year}
          onChange={(event) => setYear(event.target.value)}
        />
        <Select
          name="day"
          label="Tanggal"
          options={dayOptions}
          placeholder="Pilih tanggal"
          value={day}
          error={state.errors.day}
          onChange={(event) => setDay(event.target.value)}
        />
        <Select
          name="status"
          label="Status"
          options={[...SCHOOL_ATTENDANCE_FORM_STATUS_OPTIONS]}
          placeholder="Pilih status"
          value={status}
          error={state.errors.status}
          onChange={(event) => setStatus(event.target.value)}
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

export function SchoolAttendanceForm({
  action,
  initialValues,
  isOpen,
  onClose,
}: SchoolAttendanceFormProps) {
  const initialState: SchoolAttendanceFormState = {
    ...INITIAL_SCHOOL_ATTENDANCE_FORM_STATE,
    values: {
      ...EMPTY_SCHOOL_ATTENDANCE_FORM_VALUES,
      ...initialValues,
      className: initialValues?.className ?? "",
      month: initialValues?.month ?? "",
      year: initialValues?.year ?? "",
      day: initialValues?.day ?? "",
      status: (initialValues?.status ?? "") as SchoolAttendanceFormValues["status"],
      studentId: initialValues?.studentId ?? "",
      studentName: initialValues?.studentName ?? "",
      description: initialValues?.description ?? "",
    },
  };
  const [state, formAction, isPending] = useActionState(action, initialState);

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
              Input Daftar Hadir
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Tambahkan catatan kehadiran/ketidakhadiran siswa di sekolah.
            </p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Tutup
          </Button>
        </div>
        <SchoolAttendanceFormFields
          formAction={formAction}
          isPending={isPending}
          state={state}
          onClose={onClose}
        />
      </div>
    </div>
  );
}
