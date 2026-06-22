"use client";

import { useRef } from "react";

type SchoolAttendanceFilterProps = {
  classOptions: string[];
  selectedClass: string;
  selectedMonth: number;
  selectedYear: number;
};

const MONTH_OPTIONS = Array.from({ length: 12 }, (_, index) => ({
  label: String(index + 1),
  value: String(index + 1),
}));

export function SchoolAttendanceFilter({
  classOptions,
  selectedClass,
  selectedMonth,
  selectedYear,
}: SchoolAttendanceFilterProps) {
  const formRef = useRef<HTMLFormElement | null>(null);

  return (
    <form className="flex flex-col gap-3 border border-slate-500 bg-white px-2 py-2 md:flex-row md:items-end" method="get" ref={formRef}>
      <label className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-800">
          Kelas
        </span>
        <select
          className="h-9 border border-slate-500 bg-white px-2 text-sm text-slate-900 outline-none"
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
      <label className="flex w-24 flex-col gap-1">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-800">
          Bulan
        </span>
        <select
          className="h-9 border border-slate-500 bg-white px-2 text-sm text-slate-900 outline-none"
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
      <label className="flex w-28 flex-col gap-1">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-800">
          Tahun
        </span>
        <input
          className="h-9 border border-slate-500 bg-white px-2 text-sm text-slate-900 outline-none"
          defaultValue={String(selectedYear)}
          min={2000}
          max={2100}
          name="year"
          onBlur={() => formRef.current?.requestSubmit()}
          type="number"
        />
      </label>
    </form>
  );
}
