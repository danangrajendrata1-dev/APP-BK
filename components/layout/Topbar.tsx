"use client";

import { LogoutButton } from "@/components/layout/LogoutButton";
import { useAuth } from "@/components/providers/AuthProvider";
import type { AppRole } from "@/lib/auth/permissions";

type TopbarProps = {
  onOpenMenu: () => void;
};

const ROLE_LABELS: Record<AppRole, string> = {
  admin: "Admin",
  guru_bk: "Guru BK",
  siswa: "Siswa",
};

export function Topbar({ onOpenMenu }: TopbarProps) {
  const { fullName, isLoading, role } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex min-h-[72px] items-center justify-between gap-3 px-3 py-3 sm:px-4 md:px-5 lg:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onOpenMenu}
            className="inline-flex h-10 items-center justify-center rounded-full border border-slate-300 px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 lg:hidden"
            aria-label="Buka menu"
          >
            Menu
          </button>

          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-500">
              Selamat datang
            </p>
            <h1 className="truncate text-base font-semibold text-slate-900 sm:text-lg md:text-xl">
              {isLoading ? "Memuat profil..." : fullName}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 sm:inline-flex">
            {isLoading ? "Memuat..." : ROLE_LABELS[role]}
          </div>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
