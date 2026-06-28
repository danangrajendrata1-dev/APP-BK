"use client";

import { useState } from "react";

import { ClassSearchSelect } from "@/components/shared/ClassSearchSelect";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { BkServiceAttendanceForm } from "@/features/bk-service-attendance/components/BkServiceAttendanceForm";
import {
  BK_SERVICE_PURPOSE_OPTIONS,
} from "@/lib/constants/options";

import type {
  BkServiceAttendanceFilters,
  BkServiceAttendanceFormState,
} from "@/features/bk-service-attendance/types/bkServiceAttendance";

type BkServiceAttendanceFilterProps = {
  action: (
    state: BkServiceAttendanceFormState,
    formData: FormData,
  ) => Promise<BkServiceAttendanceFormState>;
  filters: BkServiceAttendanceFilters;
};

const MONTH_OPTIONS = Array.from({ length: 12 }, (_, index) => ({
  label: String(index + 1),
  value: String(index + 1),
}));

export function BkServiceAttendanceFilter({
  action,
  filters,
}: BkServiceAttendanceFilterProps) {
  const [selectedClass, setSelectedClass] = useState(filters.className ?? "");
  const [isInputOpen, setIsInputOpen] = useState(false);

  return (
    <>
      <section className="border border-slate-300 bg-white">
        <div className="flex flex-col gap-3 border-b border-slate-200 px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Filter Rekap Kunjungan BK
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Saring data berdasarkan kelas, bulan, tahun, dan keperluan layanan.
            </p>
          </div>
          <Button type="button" size="sm" onClick={() => setIsInputOpen(true)}>
            Input Kunjungan BK
          </Button>
        </div>
        <form className="space-y-4 px-3 py-3" method="get">
          <input type="hidden" name="className" value={selectedClass} />
          <div className="grid gap-3 lg:grid-cols-[minmax(250px,1.2fr)_minmax(120px,0.6fr)_minmax(120px,0.6fr)_minmax(200px,1fr)_auto]">
            <ClassSearchSelect
              key={selectedClass || "all-classes"}
              label="Kelas"
              value={selectedClass}
              hint="Cari kelas lalu pilih."
              onSelectClass={setSelectedClass}
            />
            <Select
              name="month"
              label="Bulan"
              defaultValue={filters.month ? String(filters.month) : ""}
              options={MONTH_OPTIONS}
              placeholder="Semua"
            />
            <Input
              name="year"
              label="Tahun"
              type="number"
              min={2000}
              max={2100}
              defaultValue={filters.year ? String(filters.year) : ""}
              placeholder="Tahun"
            />
            <Select
              name="purpose"
              label="Keperluan"
              options={[...BK_SERVICE_PURPOSE_OPTIONS]}
              defaultValue={filters.purpose}
              placeholder="Semua keperluan"
            />
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
              <Button type="submit" size="sm">
                Terapkan
              </Button>
              <Button href="/bk-service-attendance" size="sm" variant="outline">
                Reset
              </Button>
            </div>
          </div>
        </form>
      </section>

      <BkServiceAttendanceForm
        action={action}
        initialValues={{
          className: filters.className ?? "",
          serviceDate: new Date().toISOString().slice(0, 10),
        }}
        isOpen={isInputOpen}
        onClose={() => setIsInputOpen(false)}
      />
    </>
  );
}
