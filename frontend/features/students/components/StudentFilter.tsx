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
    <section className="border border-slate-300 bg-white">
      <div className="flex flex-col gap-3 border-b border-slate-200 px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Filter Kelas
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Pilih kelas untuk menampilkan daftar siswa.
          </p>
        </div>
        <Button href="/students/create" size="sm">
          Tambah Data Siswa
        </Button>
      </div>
      <form ref={formRef} className="px-3 py-3" method="get">
        <label className="block max-w-sm space-y-2">
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
      </form>
    </section>
  );
}
