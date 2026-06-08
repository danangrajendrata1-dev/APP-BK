"use client";

import { LogoutButton } from "@/components/layout/LogoutButton";
import type { AppRole } from "@/lib/auth/permissions";

type TopbarProps = {
  fullName: string;
  role: AppRole;
  onOpenMenu: () => void;
};

const ROLE_LABELS: Record<AppRole, string> = {
  admin: "Admin",
  guru_bk: "Guru BK",
  siswa: "Siswa",
};

export function Topbar({ fullName, role, onOpenMenu }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex min-h-20 items-center justify-between gap-4 px-4 py-4 md:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMenu}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 text-slate-700 transition hover:bg-slate-100 lg:hidden"
            aria-label="Buka menu"
          >
            ☰
          </button>

          <div>
            <p className="text-sm font-medium text-slate-500">
              Selamat datang
            </p>
            <h1 className="text-lg font-semibold text-slate-900 md:text-xl">
              {fullName}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 sm:inline-flex">
            {ROLE_LABELS[role]}
          </div>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
