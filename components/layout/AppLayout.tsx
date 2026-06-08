"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { MobileSidebar } from "@/components/layout/MobileSidebar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import {
  BK_HOME_ROUTE,
  getVisibleMenuItems,
  isPublicRoute,
  normalizeRole,
  type AppRole,
} from "@/lib/auth/permissions";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type AppLayoutProps = {
  children: React.ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const [role, setRole] = useState<AppRole>("siswa");
  const [fullName, setFullName] = useState("Pengguna");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuOpenedOnPath, setMenuOpenedOnPath] = useState<string | null>(null);

  useEffect(() => {
    if (isPublicRoute(pathname)) {
      return;
    }

    let isMounted = true;

    async function loadUserProfile() {
      try {
        const supabase = createSupabaseBrowserClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user || !isMounted) {
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, role")
          .eq("id", user.id)
          .maybeSingle();

        const profileData = profile as
          | {
              full_name?: string | null;
              role?: string | null;
            }
          | null;

        setRole(normalizeRole(profileData?.role ?? user.user_metadata?.role));
        setFullName(
          profileData?.full_name ??
            user.user_metadata?.full_name ??
            user.email ??
            "Pengguna",
        );
      } catch (error) {
        console.error("Failed to load profile", error);
      }
    }

    void loadUserProfile();

    return () => {
      isMounted = false;
    };
  }, [pathname]);

  if (isPublicRoute(pathname)) {
    return <>{children}</>;
  }

  const menuItems = getVisibleMenuItems(role);
  const isMobileMenuOpen = isMenuOpen && menuOpenedOnPath === pathname;

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex min-h-screen">
        <Sidebar items={menuItems} />
        <MobileSidebar
          isOpen={isMobileMenuOpen}
          items={menuItems}
          onClose={() => {
            setIsMenuOpen(false);
            setMenuOpenedOnPath(null);
          }}
        />

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <Topbar
            fullName={fullName}
            role={role}
            onOpenMenu={() => {
              setIsMenuOpen(true);
              setMenuOpenedOnPath(pathname);
            }}
          />

          <main className="flex-1 overflow-x-hidden px-4 py-5 md:px-6 md:py-6">
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          </main>
        </div>
      </div>

      {role !== "siswa" && pathname === BK_HOME_ROUTE ? null : null}
    </div>
  );
}
