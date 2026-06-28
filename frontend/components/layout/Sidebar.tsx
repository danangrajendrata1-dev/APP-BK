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
    <aside className="hidden shrink-0 border-r border-slate-100 bg-white shadow-[1px_0_15px_rgb(0,0,0,0.02)] lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-72 lg:flex-col lg:overflow-hidden xl:w-80">
      <div className="border-b border-slate-100 px-6 py-7">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/70">
          Aplikasi BK
        </p>
        <h2 className="mt-2 text-xl font-bold text-slate-800">
          Ruang BK
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
          Pilih menu untuk mengelola data dan layanan bimbingan.
        </p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-5 scrollbar-thin scrollbar-thumb-slate-200">
        {isLoading ? (
          <div className="rounded-2xl border border-slate-100 bg-slate-50/50 px-4 py-4 text-sm text-slate-500 text-center animate-pulse">
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
              prefetch={false}
              className={`group flex items-center gap-3 rounded-xl px-4 py-3.5 transition-all duration-200 ${
                isActive
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "text-slate-600 hover:bg-primary-light/50 hover:text-primary-hover"
              }`}
            >
              <span
                className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-semibold transition-colors duration-200 ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-500 group-hover:bg-primary-light group-hover:text-primary"
                }`}
              >
                {index + 1}
              </span>
              <span className="text-sm font-medium leading-tight">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
