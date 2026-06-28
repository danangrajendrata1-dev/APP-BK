import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppLayout } from "@/components/layout/AppLayout";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { normalizeRole, type AppRole } from "@/lib/auth/permissions";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Aplikasi BK Sederhana",
  description: "Sistem administrasi dan layanan BK sekolah.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let role: AppRole = "siswa";
  let fullName = "Pengguna";
  
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, role")
      .eq("id", user.id)
      .maybeSingle();
      
    const profileRow = profile as { role?: string; full_name?: string } | null;
    role = normalizeRole(profileRow?.role ?? user.app_metadata?.role ?? user.user_metadata?.role);
    fullName = profileRow?.full_name ?? user.user_metadata?.full_name ?? user.email ?? "Pengguna";
  }

  return (
    <html lang="id" className={`h-full antialiased ${inter.variable}`}>
      <body className="min-h-full flex flex-col bg-background font-sans text-foreground">
        <AppLayout initialUser={user} initialRole={role} initialFullName={fullName}>
          {children}
        </AppLayout>
      </body>
    </html>
  );
}
