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
          : "Mohon maaf, login gagal. Silakan periksa kembali email dan kata sandi Anda.";
      setErrorMessage(message);
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-teal-50/30 px-4 py-10 relative overflow-hidden">
      {/* Soft background decorative elements */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-teal-700/5 blur-3xl" />
      <div className="absolute top-1/2 -right-24 w-72 h-72 rounded-full bg-blue-400/5 blur-3xl" />
      
      <div className="relative w-full max-w-md rounded-3xl border border-white/60 bg-white/80 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl sm:p-10">
        <div className="space-y-3 text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 mb-2 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.745.745 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.745.745 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z" clipRule="evenodd" />
              <path d="M5.082 14.254a8.287 8.287 0 0 0-1.308 5.135 9.687 9.687 0 0 1-1.764-.44l-.115-.04a.563.563 0 0 1-.373-.487l-.01-.121a3.75 3.75 0 0 1 3.57-4.047ZM20.226 19.389a8.288 8.288 0 0 0-1.308-5.135 3.75 3.75 0 0 1 3.57 4.047l-.01.121a.563.563 0 0 1-.373.486l-.115.04c-.56.195-1.15.349-1.764.441Z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">Ruang BK</h1>
          <p className="text-sm leading-relaxed text-slate-500">
            Selamat datang kembali! Silakan masuk untuk melanjutkan aktivitas pelayanan dan pendampingan siswa.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Email Pengguna</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-700/10"
              placeholder="contoh: nama@sekolah.sch.id"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Kata Sandi</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-700/10"
              placeholder="Masukkan kata sandi Anda"
              required
            />
          </div>

          {errorMessage ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
              <p className="text-sm text-rose-600">{errorMessage}</p>
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-teal-700 px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? "Memproses..." : "Masuk ke Aplikasi"}
          </button>
        </form>

        <div className="mt-8 border-t border-slate-100 pt-6 text-center">
          <p className="text-sm text-slate-500">
            Belum memiliki akun?{" "}
            <Link href="/register" className="font-semibold text-teal-700 hover:text-teal-800 hover:underline underline-offset-4">
              Daftar di sini
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
