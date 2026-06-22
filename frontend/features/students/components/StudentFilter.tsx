"use client";

import { useRef } from "react";

import { Button } from "@/components/ui/Button";

type StudentFilterProps = {
  classOptions: string[];
  selectedClass?: string;
};

export function StudentFilter({
  classOptions,
  selectedClass = "",
}: StudentFilterProps) {
  const formRef = useRef<HTMLFormElement | null>(null);

  return (
    <div className="flex flex-col gap-3 border border-slate-400 bg-white px-3 py-2 md:flex-row md:items-end md:justify-between">
      <form ref={formRef} className="w-full max-w-sm" method="get">
        <label className="block space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-700">
            Kelas
          </span>
          <select
            className="h-9 w-full border border-slate-500 bg-white px-2 text-sm text-slate-900 outline-none"
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
      </form>
      <div className="flex items-center justify-end">
        <Button href="/students/create" size="sm">
          Tambah Data Siswa
        </Button>
      </div>
    </div>
  );
}
