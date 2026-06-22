"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { MobileSidebar } from "@/components/layout/MobileSidebar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { AuthProvider, useAuth } from "@/components/providers/AuthProvider";
import {
  canAccessPath,
  getDefaultRouteForRole,
  isPublicRoute,
} from "@/lib/auth/permissions";

type AppLayoutProps = {
  children: React.ReactNode;
};

function ProtectedAppShell({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoading, role } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuOpenedOnPath, setMenuOpenedOnPath] = useState<string | null>(null);
  const isMobileMenuOpen = isMenuOpen && menuOpenedOnPath === pathname;
  const defaultRoute = getDefaultRouteForRole(role);
  const canAccessCurrentPath = canAccessPath(role, pathname);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!canAccessCurrentPath) {
      router.replace(defaultRoute);
    }
  }, [canAccessCurrentPath, defaultRoute, isLoading, router]);

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex min-h-screen items-start bg-slate-100">
        <Sidebar />
        <MobileSidebar
          isOpen={isMobileMenuOpen}
          onClose={() => {
            setIsMenuOpen(false);
            setMenuOpenedOnPath(null);
          }}
        />

        <div className="flex min-h-screen min-w-0 flex-1 flex-col bg-slate-100">
          <Topbar
            onOpenMenu={() => {
              setIsMenuOpen(true);
              setMenuOpenedOnPath(pathname);
            }}
          />

          <main className="flex-1 overflow-x-hidden bg-slate-100 px-3 py-4 sm:px-4 md:px-5 md:py-5 lg:px-6">
            <div className="mx-auto w-full max-w-7xl">
              {canAccessCurrentPath ? children : null}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();

  if (isPublicRoute(pathname)) {
    return <>{children}</>;
  }

  return (
    <AuthProvider>
      <ProtectedAppShell>{children}</ProtectedAppShell>
    </AuthProvider>
  );
}
