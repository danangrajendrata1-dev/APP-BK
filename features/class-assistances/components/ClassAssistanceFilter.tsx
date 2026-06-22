"use client";

import { useState } from "react";

import { ClassSearchSelect } from "@/components/shared/ClassSearchSelect";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { ClassAssistanceFilters } from "@/features/class-assistances/types/classAssistance";

type Props = {
  filters: ClassAssistanceFilters;
};

export function ClassAssistanceFilter({ filters }: Props) {
  const [className, setClassName] = useState(filters.className ?? "");

  return (
    <section className="border border-slate-300 bg-white">
      <div className="border-b border-slate-200 px-3 py-2">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
          Filter Kelas
        </p>
      </div>
      <form className="space-y-3 px-3 py-3" method="get">
        <input type="hidden" name="className" value={className} />
        <div className="grid gap-3 lg:grid-cols-[minmax(280px,1.3fr)_minmax(180px,0.9fr)_minmax(180px,0.9fr)_auto]">
          <ClassSearchSelect
            key={className || "all-classes"}
            label="Kelas"
            value={className}
            hint="Cari kelas lalu pilih dari daftar."
            onSelectClass={setClassName}
          />
          <Input
            name="violationType"
            label="Jenis Pelanggaran"
            defaultValue={filters.violationType}
            placeholder="Semua"
            className="py-2.5"
          />
          <Input
            name="finalWarningLetter"
            label="SP Akhir"
            defaultValue={filters.finalWarningLetter}
            placeholder="Semua"
            className="py-2.5"
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
