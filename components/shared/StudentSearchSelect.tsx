"use client";

import { useEffect, useRef, useState } from "react";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

import { useDebouncedValue } from "@/components/shared/useDebouncedValue";

const MIN_STUDENT_SEARCH_LENGTH = 2;
const STUDENT_SEARCH_LIMIT = 20;
const DEBOUNCE_MS = 400;

export type StudentSearchOption = {
  className: string;
  fullName: string;
  id: string;
  nis: string;
};

type StudentSearchSelectProps = {
  error?: string;
  hint?: string;
  label: string;
  onSelectStudent: (value: StudentSearchOption | null) => void;
  selectedClass?: string;
  value: StudentSearchOption | null;
};

function formatStudentLabel(student: StudentSearchOption) {
  return student.nis
    ? `${student.fullName} - ${student.nis} - ${student.className}`
    : `${student.fullName} - ${student.className}`;
}

export function StudentSearchSelect({
  error,
  hint,
  label,
  onSelectStudent,
  selectedClass,
  value,
}: StudentSearchSelectProps) {
  const [supabase] = useState(() => createSupabaseBrowserClient());
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value ? formatStudentLabel(value) : "");
  const [results, setResults] = useState<StudentSearchOption[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const debouncedSearchTerm = useDebouncedValue(searchTerm, DEBOUNCE_MS);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [isOpen]);

  useEffect(() => {
    const keyword = debouncedSearchTerm.trim();

    if (!isOpen || keyword.length < MIN_STUDENT_SEARCH_LENGTH) {
      return;
    }

    let isCancelled = false;

    async function searchStudents() {
      setIsLoading(true);
      setErrorMessage("");

      let query = supabase
        .from("students")
        .select("id, full_name, nisn, class_name")
        .or(`full_name.ilike.%${keyword}%,nisn.ilike.%${keyword}%`)
        .order("full_name", { ascending: true })
        .limit(STUDENT_SEARCH_LIMIT);

      if (selectedClass) {
        query = query.eq("class_name", selectedClass);
      }

      const { data, error: queryError } = await query;

      if (isCancelled) {
        return;
      }

      if (queryError) {
        setResults([]);
        setErrorMessage("Pencarian siswa gagal.");
        setIsLoading(false);
        return;
      }

      setResults(
        (data ?? []).map((student) => ({
          id: student.id,
          fullName: student.full_name,
          nis: student.nisn,
          className: student.class_name,
        })),
      );
      setIsLoading(false);
    }

    void searchStudents();

    return () => {
      isCancelled = true;
    };
  }, [debouncedSearchTerm, isOpen, selectedClass, supabase]);

  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <div className="relative" ref={containerRef}>
        <input
          className={[
            "w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition",
            error
              ? "border-rose-400 focus:border-rose-500"
              : "border-slate-300 focus:border-slate-500",
          ].join(" ")}
          onChange={(event) => {
            const nextValue = event.target.value;
            setSearchTerm(nextValue);
            setIsOpen(true);

            if (!value || nextValue !== formatStudentLabel(value)) {
              onSelectStudent(null);
            }
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Cari nama siswa atau NIS"
          value={searchTerm}
        />
        {isOpen ? (
          <div className="absolute z-20 mt-2 w-full rounded-2xl border border-slate-200 bg-white shadow-lg">
            {searchTerm.trim().length < MIN_STUDENT_SEARCH_LENGTH ? (
              <p className="px-4 py-3 text-sm text-slate-500">
                Ketik minimal 2 karakter untuk mencari siswa.
              </p>
            ) : isLoading ? (
              <p className="px-4 py-3 text-sm text-slate-500">Mencari siswa...</p>
            ) : errorMessage ? (
              <p className="px-4 py-3 text-sm text-rose-600">{errorMessage}</p>
            ) : results.length ? (
              <ul className="max-h-64 overflow-y-auto py-2">
                {results.map((student) => (
                  <li key={student.id}>
                    <button
                      className="block w-full px-4 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-100"
                      onClick={() => {
                        setSearchTerm(formatStudentLabel(student));
                        onSelectStudent(student);
                        setIsOpen(false);
                      }}
                      type="button"
                    >
                      {formatStudentLabel(student)}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-4 py-3 text-sm text-slate-500">Siswa tidak ditemukan.</p>
            )}
          </div>
        ) : null}
      </div>
      {error ? (
        <span className="text-sm text-rose-600">{error}</span>
      ) : hint ? (
        <span className="text-sm text-slate-500">{hint}</span>
      ) : null}
    </label>
  );
}
