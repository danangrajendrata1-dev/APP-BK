"use client";

import { useState } from "react";

import { ClassSearchSelect } from "@/components/shared/ClassSearchSelect";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import type {
  ClassAssistanceRecapFilters,
  RecapFinalWarningLetter,
  RecapViolationCode,
} from "@/features/class-assistances/types/classAssistance";

type Props = {
  filters: ClassAssistanceRecapFilters;
};

const VIOLATION_OPTIONS: Array<{ label: string; value: RecapViolationCode }> = [
  { label: "T - Terlambat", value: "T" },
  { label: "S - Tak Seragam", value: "S" },
  { label: "D - Tidak Memakai ID", value: "D" },
  { label: "R - Rambut Panjang / Semir", value: "R" },
  { label: "RK - Rokok", value: "RK" },
  { label: "K - Korek", value: "K" },
  { label: "M - Makeup Menor", value: "M" },
  { label: "L - Lainnya", value: "L" },
];

const FINAL_WARNING_OPTIONS: Array<{ label: string; value: RecapFinalWarningLetter }> = [
  { label: "SP 1", value: "SP 1" },
  { label: "SP 2", value: "SP 2" },
  { label: "SP 3", value: "SP 3" },
];

export function ClassAssistanceFilter({ filters }: Props) {
  const [className, setClassName] = useState(filters.className ?? "");

  return (
    <section className="border border-slate-300 bg-white">
      <div className="border-b border-slate-200 px-3 py-2">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
          Filter Kelas
        </p>
      </div>
      <form className="space-y-4 px-3 py-3" method="get">
        <input type="hidden" name="className" value={className} />
        <input type="hidden" name="page" value="1" />
        <div className="grid gap-3 lg:grid-cols-[minmax(280px,1.3fr)_minmax(220px,0.9fr)_minmax(180px,0.8fr)_auto]">
          <ClassSearchSelect
            key={className || "all-classes"}
            label="Kelas"
            value={className}
            hint="Cari kelas lalu pilih dari daftar."
            onSelectClass={setClassName}
          />
          <Select
            name="violationType"
            label="Jenis Pelanggaran"
            defaultValue={filters.violationType ?? ""}
            options={VIOLATION_OPTIONS}
            placeholder="Semua"
          />
          <Select
            name="finalWarningLetter"
            label="SP Akhir"
            defaultValue={filters.finalWarningLetter ?? ""}
            options={FINAL_WARNING_OPTIONS}
            placeholder="Semua"
          />
          <div className="flex items-end gap-2">
            <Button type="submit" size="sm">
              Terapkan
            </Button>
            <Button href="/class-assistances" size="sm" variant="outline">
              Reset
            </Button>
          </div>
        </div>
      </form>
    </section>
  );
}
