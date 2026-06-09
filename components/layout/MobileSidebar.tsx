"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuth } from "@/components/providers/AuthProvider";
import { getVisibleMenuItems } from "@/lib/auth/permissions";

type MobileSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function MobileSidebar({
  isOpen,
  onClose,
}: MobileSidebarProps) {
  const pathname = usePathname();
  const { isLoading, role } = useAuth();
  const items = useMemo(() => getVisibleMenuItems(role), [role]);

  return (
    <div
      className={`lg:hidden ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
    >
      <div
        className={`fixed inset-0 z-40 bg-slate-950/40 transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[88%] max-w-xs flex-col border-r border-slate-200 bg-white shadow-xl transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between border-b border-slate-200 px-4 py-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
              Aplikasi BK
            </p>
            <h2 className="mt-2 text-lg font-semibold text-slate-900">Menu</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 items-center justify-center rounded-full border border-slate-300 px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            aria-label="Tutup menu"
          >
            Tutup
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
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
                onClick={onClose}
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
                <span className="text-sm font-medium leading-6">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </div>
  );
}
