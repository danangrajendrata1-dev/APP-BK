"use client";

import { useEffect, useRef, useState } from "react";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

import { useDebouncedValue } from "@/components/shared/useDebouncedValue";

const MIN_CLASS_SEARCH_LENGTH = 1;
const CLASS_SEARCH_LIMIT = 20;
const DEBOUNCE_MS = 400;

type ClassSearchSelectProps = {
  error?: string;
  hint?: string;
  label: string;
  onSelectClass: (value: string) => void;
  value: string;
};

export function ClassSearchSelect({
  error,
  hint,
  label,
  onSelectClass,
  value,
}: ClassSearchSelectProps) {
  const [supabase] = useState(() => createSupabaseBrowserClient());
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value);
  const [results, setResults] = useState<string[]>([]);
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

    if (!isOpen || keyword.length < MIN_CLASS_SEARCH_LENGTH) {
      return;
    }

    let isCancelled = false;

    async function searchClasses() {
      setIsLoading(true);
      setErrorMessage("");

      const { data, error: queryError } = await supabase
        .from("students")
        .select("class_name")
        .ilike("class_name", `%${keyword}%`)
        .order("class_name", { ascending: true })
        .limit(CLASS_SEARCH_LIMIT);

      if (isCancelled) {
        return;
      }

      if (queryError) {
        setResults([]);
        setErrorMessage("Pencarian kelas gagal.");
        setIsLoading(false);
        return;
      }

      const uniqueClassNames = [...new Set((data ?? []).map((item) => item.class_name).filter(Boolean))];
      setResults(uniqueClassNames);
      setIsLoading(false);
    }

    void searchClasses();

    return () => {
      isCancelled = true;
    };
  }, [debouncedSearchTerm, isOpen, supabase]);

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

            if (nextValue !== value) {
              onSelectClass("");
            }
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Cari kelas"
          value={searchTerm}
        />
        {isOpen ? (
          <div className="absolute z-20 mt-2 w-full rounded-2xl border border-slate-200 bg-white shadow-lg">
            {searchTerm.trim().length < MIN_CLASS_SEARCH_LENGTH ? (
              <p className="px-4 py-3 text-sm text-slate-500">
                Ketik minimal 1 karakter untuk mencari kelas.
              </p>
            ) : isLoading ? (
              <p className="px-4 py-3 text-sm text-slate-500">Mencari kelas...</p>
            ) : errorMessage ? (
              <p className="px-4 py-3 text-sm text-rose-600">{errorMessage}</p>
            ) : results.length ? (
              <ul className="max-h-64 overflow-y-auto py-2">
                {results.map((className) => (
                  <li key={className}>
                    <button
                      className="block w-full px-4 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-100"
                      onClick={() => {
                        setSearchTerm(className);
                        onSelectClass(className);
                        setIsOpen(false);
                      }}
                      type="button"
                    >
                      {className}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-4 py-3 text-sm text-slate-500">Kelas tidak ditemukan.</p>
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
