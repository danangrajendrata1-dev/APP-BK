export type AppRole = "admin" | "guru_bk" | "kepala_sekolah" | "siswa";
export type AppNavItem = {
  label: string;
  href: string;
};

export const PUBLIC_ROUTES = ["/login", "/register"] as const;
export const STUDENT_HOME_ROUTE = "/confession-box";
export const BK_HOME_ROUTE = "/dashboard";

export const PROTECTED_ROUTE_PREFIXES = [
  "/dashboard",
  "/assessments",
  "/students",
  "/school-attendance",
  "/bk-service-attendance",
  "/counseling-records",
  "/student-assistances",
  "/class-assistances",
  "/documents",
  "/home-visits",
  "/confession-box",
  "/reports",
] as const;

export const APP_NAV_ITEMS: AppNavItem[] = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Inventori dan Asesmen", href: "/assessments" },
  { label: "Data Siswa", href: "/students" },
  { label: "Daftar Hadir Sekolah", href: "/school-attendance" },
  {
    label: "Daftar Hadir dan Catatan Kunjungan BK",
    href: "/bk-service-attendance",
  },
  { label: "Catatan Pelanggaran", href: "/counseling-records" },
  {
    label: "Catatan Pendampingan Siswa Per Bulan",
    href: "/student-assistances",
  },
  {
    label: "Rekapan Pelanggaran Siswa",
    href: "/class-assistances",
  },
  { label: "Surat & Dokumen", href: "/documents" },
  { label: "Home Visit", href: "/home-visits" },
  { label: "Kotak Curhat Digital", href: "/confession-box" },
  { label: "Laporan dan Statistik", href: "/reports" },
];

export function isPublicRoute(pathname: string) {
  return PUBLIC_ROUTES.some((route) => pathname === route);
}

export function isProtectedRoute(pathname: string) {
  return PROTECTED_ROUTE_PREFIXES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export function canAccessPath(role: AppRole, pathname: string) {
  if (role === "admin" || role === "guru_bk") {
    return true;
  }

  if (role === "kepala_sekolah") {
    return pathname === "/dashboard" || pathname.startsWith("/dashboard/") || pathname === "/reports" || pathname.startsWith("/reports/");
  }

  return (
    pathname === STUDENT_HOME_ROUTE ||
    pathname.startsWith(`${STUDENT_HOME_ROUTE}/`)
  );
}

export function getDefaultRouteForRole(role: AppRole) {
  if (role === "siswa") {
    return STUDENT_HOME_ROUTE;
  }

  return BK_HOME_ROUTE;
}

export function normalizeRole(value: string | null | undefined): AppRole {
  if (
    value === "admin" ||
    value === "guru_bk" ||
    value === "kepala_sekolah" ||
    value === "siswa"
  ) {
    return value;
  }

  return "siswa";
}

export function getVisibleMenuItems(role: AppRole) {
  if (role === "siswa") {
    return APP_NAV_ITEMS.filter((item) => item.href === STUDENT_HOME_ROUTE);
  }

  if (role === "kepala_sekolah") {
    return APP_NAV_ITEMS.filter(
      (item) => item.href === "/dashboard" || item.href === "/reports",
    );
  }

  return APP_NAV_ITEMS;
}
