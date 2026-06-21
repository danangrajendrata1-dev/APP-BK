"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import {
  getDefaultRouteForRole,
  normalizeRole,
} from "@/lib/auth/permissions";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { logSupabaseError } from "@/lib/supabase/error";

const LAST_ACTIVITY_STORAGE_KEY = "bk_last_activity_at";
const LAST_ACTIVITY_COOKIE_NAME = "bk_last_activity_at";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        logSupabaseError("[Login] auth.getUser", authError);
      }

      if (!user) {
        throw new Error("Session login tidak ditemukan setelah login berhasil.");
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      const profileRole = (profile as { role?: string } | null)?.role;
      const role = normalizeRole(
        profileRole ?? user.app_metadata?.role ?? user.user_metadata?.role,
      );
      if (profileError) {
        logSupabaseError("[Login] profile lookup", profileError, {
          userId: user.id,
        });
      }
      console.info("[Login] role result", {
        userId: user.id,
        profileRole: profileRole ?? null,
        appMetadataRole: user.app_metadata?.role ?? null,
        userMetadataRole: user.user_metadata?.role ?? null,
        resolvedRole: role,
        profileFound: Boolean(profile),
      });
      const destination = getDefaultRouteForRole(role);

      if (typeof window !== "undefined") {
        const now = String(Date.now());
        window.localStorage.setItem(LAST_ACTIVITY_STORAGE_KEY, now);
        document.cookie = `${LAST_ACTIVITY_COOKIE_NAME}=${now}; path=/; max-age=3600; samesite=lax`;
        window.location.replace(destination);
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Login gagal. Periksa email dan password.";
      setErrorMessage(message);
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
            Aplikasi BK
          </p>
          <h1 className="text-3xl font-semibold text-slate-900">Login</h1>
          <p className="text-sm text-slate-600">
            Masuk untuk mengelola data dan layanan BK sekolah.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-black outline-none transition placeholder:text-gray-500 focus:border-slate-500"
              placeholder="nama@sekolah.sch.id"
              required
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-black outline-none transition placeholder:text-gray-500 focus:border-slate-500"
              placeholder="Masukkan password"
              required
            />
          </label>

          {errorMessage ? (
            <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {errorMessage}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-600">
          Belum punya akun?{" "}
          <Link href="/register" className="font-semibold text-slate-900">
            Daftar di sini
          </Link>
        </p>
      </div>
    </main>
  );
}
