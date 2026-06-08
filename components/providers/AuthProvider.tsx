"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";

import { normalizeRole, type AppRole } from "@/lib/auth/permissions";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type AuthContextValue = {
  fullName: string;
  isLoading: boolean;
  role: AppRole;
  user: User | null;
};

type ProfileRow = {
  full_name?: string | null;
  role?: string | null;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function buildAuthState(user: User | null): Promise<AuthContextValue> {
  if (!user) {
    return {
      user: null,
      role: "siswa",
      fullName: "Pengguna",
      isLoading: false,
    };
  }

  const supabase = createSupabaseBrowserClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .maybeSingle();

  const profileData = profile as ProfileRow | null;

  return {
    user,
    role: normalizeRole(profileData?.role ?? user.user_metadata?.role),
    fullName:
      profileData?.full_name ??
      user.user_metadata?.full_name ??
      user.email ??
      "Pengguna",
    isLoading: false,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [authState, setAuthState] = useState<AuthContextValue>({
    user: null,
    role: "siswa",
    fullName: "Pengguna",
    isLoading: true,
  });

  useEffect(() => {
    let isMounted = true;

    async function bootstrap() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!isMounted) {
        return;
      }

      const nextState = await buildAuthState(user);

      if (isMounted) {
        setAuthState(nextState);
      }
    }

    void bootstrap();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      void (async () => {
        if (!isMounted) {
          return;
        }

        const nextState = await buildAuthState(session?.user ?? null);

        if (isMounted) {
          setAuthState(nextState);
        }
      })();
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  return <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
