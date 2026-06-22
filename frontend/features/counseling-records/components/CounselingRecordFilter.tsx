"use client";

import { useState } from "react";

import { ClassSearchSelect } from "@/components/shared/ClassSearchSelect";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { CounselingRecordForm } from "@/features/counseling-records/components/CounselingRecordForm";
import { MONTH_OPTIONS } from "@/features/counseling-records/schemas/counselingRecordSchema";
import type {
  CounselingRecordFormAction,
  CounselingRecordSheetFilters,
} from "@/features/counseling-records/types/counselingRecord";

type Props = {
  action: CounselingRecordFormAction;
  filters: CounselingRecordSheetFilters;
};

export function CounselingRecordFilter({ action, filters }: Props) {
  const [selectedClass, setSelectedClass] = useState(filters.className ?? "");
  const [isInputOpen, setIsInputOpen] = useState(false);

  return (
    <>
      <section className="border border-slate-300 bg-white">
        <div className="flex flex-col gap-3 border-b border-slate-200 px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Filter Rekap Pelanggaran
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Pilih kelas, bulan, dan tahun untuk memuat rekap bulanan.
            </p>
          </div>
          <Button type="button" size="sm" onClick={() => setIsInputOpen(true)}>
            Input Pelanggaran
          </Button>
        </div>
        <form className="space-y-4 px-3 py-3" method="get">
          <input type="hidden" name="className" value={selectedClass} />
          <div className="grid gap-3 lg:grid-cols-[minmax(280px,1.3fr)_minmax(180px,0.7fr)_minmax(180px,0.7fr)_auto]">
            <ClassSearchSelect
              key={selectedClass || "all-classes"}
              label="Kelas"
              value={selectedClass}
              hint="Cari kelas lalu pilih dari daftar."
              onSelectClass={setSelectedClass}
            />
            <Select
              name="month"
              label="Bulan"
              defaultValue={filters.month ? String(filters.month) : ""}
              options={[...MONTH_OPTIONS]}
              placeholder="Pilih bulan"
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
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
              <Button type="submit" size="sm">
                Terapkan
              </Button>
              <Button href="/counseling-records" size="sm" variant="outline">
                Reset
              </Button>
            </div>
          </div>
        </form>
      </section>
      <CounselingRecordForm
        action={action}
        initialValues={{
          className: filters.className ?? "",
          violationMonth: filters.month ? String(filters.month) : "",
          violationYear: filters.year ? String(filters.year) : "",
        }}
        isOpen={isInputOpen}
        onClose={() => setIsInputOpen(false)}
      />
    </>
  );
}
