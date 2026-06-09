"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuth } from "@/components/providers/AuthProvider";
import { getVisibleMenuItems } from "@/lib/auth/permissions";

export function Sidebar() {
  const pathname = usePathname();
  const { isLoading, role } = useAuth();
  const items = useMemo(() => getVisibleMenuItems(role), [role]);

  return (
    <aside className="hidden shrink-0 border-r border-slate-200 bg-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-72 lg:flex-col lg:overflow-hidden xl:w-80">
      <div className="border-b border-slate-200 px-5 py-5 xl:px-6 xl:py-6">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
          Aplikasi BK
        </p>
        <h2 className="mt-2 text-xl font-semibold text-slate-900">
          Navigasi Utama
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Pilih menu untuk mengelola data dan layanan BK.
        </p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4 xl:px-4 xl:py-5">
        {isLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600">
            Memuat menu...
          </div>
        ) : null}
        {items.map((item, index) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-start gap-3 rounded-2xl px-3.5 py-3 transition ${
                isActive
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <span
                className={`mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  isActive
                    ? "bg-white/15 text-white"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                {index + 1}
              </span>
              <span className="text-sm font-medium leading-6">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
