"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { AppNavItem } from "@/lib/auth/permissions";

type MobileSidebarProps = {
  isOpen: boolean;
  items: AppNavItem[];
  onClose: () => void;
};

export function MobileSidebar({
  isOpen,
  items,
  onClose,
}: MobileSidebarProps) {
  const pathname = usePathname();

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
        className={`fixed inset-y-0 left-0 z-50 flex w-[86%] max-w-sm flex-col border-r border-slate-200 bg-white shadow-xl transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between border-b border-slate-200 px-5 py-5">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
              Aplikasi BK
            </p>
            <h2 className="mt-2 text-lg font-semibold text-slate-900">Menu</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 text-slate-700 transition hover:bg-slate-100"
            aria-label="Tutup menu"
          >
            ×
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-5">
          {items.map((item, index) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-start gap-3 rounded-2xl px-4 py-3 transition ${
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
