"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { SchoolAttendanceForm } from "@/features/school-attendance/components/SchoolAttendanceForm";
import type { SchoolAttendanceFormState } from "@/features/school-attendance/types/schoolAttendance";

type SchoolAttendanceFilterProps = {
  classOptions: string[];
  selectedClass: string;
  selectedMonth: number;
  selectedYear: number;
  action: (
    state: SchoolAttendanceFormState,
    formData: FormData,
  ) => Promise<SchoolAttendanceFormState>;
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

export function SchoolAttendanceFilter({
  classOptions,
  selectedClass,
  selectedMonth,
  selectedYear,
  action,
}: SchoolAttendanceFilterProps) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [isInputOpen, setIsInputOpen] = useState(false);

  return (
    <>
      <section className="rounded-2xl border border-slate-100 bg-white shadow-[0_2px_12px_rgb(0,0,0,0.03)]">
        <div className="flex flex-col gap-3 border-b border-slate-200 px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Filter Daftar Hadir
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Pilih kelas, bulan, dan tahun untuk memuat rekap bulanan.
            </p>
          </div>
          <Button type="button" size="sm" onClick={() => setIsInputOpen(true)}>
            Input Kehadiran
          </Button>
        </div>
        <form
          className="grid gap-3 px-3 py-3 sm:grid-cols-3"
          method="get"
          ref={formRef}
        >
          <label className="flex min-w-0 flex-1 flex-col gap-2">
            <span className="text-sm font-medium text-slate-700">Kelas</span>
            <select
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
              defaultValue={selectedClass}
              name="className"
              onChange={() => formRef.current?.requestSubmit()}
            >
              <option value="">Pilih kelas</option>
              {classOptions.map((className) => (
                <option key={className} value={className}>
                  {className}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-700">Bulan</span>
            <select
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
              defaultValue={String(selectedMonth)}
              name="month"
              onChange={() => formRef.current?.requestSubmit()}
            >
              {MONTH_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-700">Tahun</span>
            <input
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
              defaultValue={String(selectedYear)}
              min={2000}
              max={2100}
              name="year"
              onBlur={() => formRef.current?.requestSubmit()}
              type="number"
            />
          </label>
        </form>
      </section>

      <SchoolAttendanceForm
        action={action}
        initialValues={{
          className: selectedClass,
          month: String(selectedMonth),
          year: String(selectedYear),
          day: new Date().getDate().toString(),
        }}
        isOpen={isInputOpen}
        onClose={() => setIsInputOpen(false)}
      />
    </>
  );
}
