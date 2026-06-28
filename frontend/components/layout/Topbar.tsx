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
  kepala_sekolah: "Kepala Sekolah",
  siswa: "Siswa",
};

export function Topbar({ onOpenMenu }: TopbarProps) {
  const { fullName, isLoading, role } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/80 backdrop-blur-lg shadow-sm">
      <div className="flex min-h-[72px] items-center justify-between gap-3 px-4 py-3 sm:px-6 md:px-8">
        <div className="flex min-w-0 items-center gap-4">
          <button
            type="button"
            onClick={onOpenMenu}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 active:scale-95 lg:hidden shadow-sm"
            aria-label="Buka menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          </button>

          <div className="min-w-0">
            <p className="text-xs font-medium text-primary/80 uppercase tracking-wider mb-0.5">
              Selamat datang kembali,
            </p>
            <h1 className="truncate text-lg font-bold text-slate-800 sm:text-xl">
              {isLoading ? "Memuat profil..." : fullName}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden rounded-full border border-primary-light bg-primary-light/30 px-3.5 py-1.5 text-xs font-semibold text-primary sm:inline-flex shadow-sm">
            {isLoading ? "Memuat..." : ROLE_LABELS[role]}
          </div>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
