"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";

import { normalizeRole, type AppRole } from "@/lib/auth/permissions";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { logSupabaseError } from "@/lib/supabase/error";

const IDLE_TIMEOUT_MS = 60 * 60 * 1000;
const LAST_ACTIVITY_STORAGE_KEY = "bk_last_activity_at";
const LAST_ACTIVITY_COOKIE_NAME = "bk_last_activity_at";
const ACTIVITY_UPDATE_INTERVAL_MS = 60 * 1000;

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

function getNow() {
  return Date.now();
}

function writeLastActivity(timestamp: number) {
  if (typeof window === "undefined") {
    return;
  }

  const value = String(timestamp);
  window.localStorage.setItem(LAST_ACTIVITY_STORAGE_KEY, value);
  document.cookie = `${LAST_ACTIVITY_COOKIE_NAME}=${value}; path=/; max-age=3600; samesite=lax`;
}

function clearLastActivity() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(LAST_ACTIVITY_STORAGE_KEY);
  document.cookie = `${LAST_ACTIVITY_COOKIE_NAME}=; path=/; max-age=0; samesite=lax`;
}

function readLastActivity() {
  if (typeof window === "undefined") {
    return null;
  }

  const localValue = window.localStorage.getItem(LAST_ACTIVITY_STORAGE_KEY);
  const parsedLocalValue = Number(localValue);

  if (Number.isFinite(parsedLocalValue) && parsedLocalValue > 0) {
    return parsedLocalValue;
  }

  const cookieValue = document.cookie
    .split("; ")
    .find((item) => item.startsWith(`${LAST_ACTIVITY_COOKIE_NAME}=`))
    ?.split("=")[1];
  const parsedCookieValue = Number(cookieValue);

  return Number.isFinite(parsedCookieValue) && parsedCookieValue > 0
    ? parsedCookieValue
    : null;
}

function isSessionExpired(lastActivityAt: number | null) {
  if (!lastActivityAt) {
    return false;
  }

  return getNow() - lastActivityAt > IDLE_TIMEOUT_MS;
}

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
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .maybeSingle();

  const profileData = profile as ProfileRow | null;
  const resolvedRole = normalizeRole(
    profileData?.role ?? user.app_metadata?.role ?? user.user_metadata?.role,
  );

  if (profileError) {
    logSupabaseError("[AuthProvider] profile lookup", profileError, {
      userId: user.id,
    });
  }

  console.info("[AuthProvider] role result", {
    userId: user.id,
    profileRole: profileData?.role ?? null,
    appMetadataRole: user.app_metadata?.role ?? null,
    userMetadataRole: user.user_metadata?.role ?? null,
    resolvedRole,
    profileFound: Boolean(profileData),
  });

  return {
    user,
    role: resolvedRole,
    fullName:
      profileData?.full_name ??
      user.user_metadata?.full_name ??
      user.email ??
      "Pengguna",
    isLoading: false,
  };
}

type AuthProviderProps = { 
  children: ReactNode;
  initialUser?: User | null;
  initialRole?: AppRole;
  initialFullName?: string;
};

export function AuthProvider({ children, initialUser, initialRole, initialFullName }: AuthProviderProps) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [authState, setAuthState] = useState<AuthContextValue>({
    user: initialUser ?? null,
    role: initialRole ?? "siswa",
    fullName: initialFullName ?? "Pengguna",
    isLoading: initialUser === undefined,
  });
  const profileCacheRef = useRef<Record<string, AuthContextValue>>({});
  const profileFetchPromiseRef = useRef<Record<string, Promise<AuthContextValue> | undefined>>({});
  const lastResolvedUserIdRef = useRef<string | null>(null);
  const currentUserRef = useRef<User | null>(null);

  useEffect(() => {
    currentUserRef.current = authState.user;
  }, [authState.user]);

  useEffect(() => {
    let isMounted = true;

    async function resolveAuthState(user: User | null) {
      if (!user) {
        lastResolvedUserIdRef.current = null;
        profileFetchPromiseRef.current = {};
        return {
          user: null,
          role: "siswa",
          fullName: "Pengguna",
          isLoading: false,
        } satisfies AuthContextValue;
      }

      const cachedState = profileCacheRef.current[user.id];

      if (cachedState) {
        lastResolvedUserIdRef.current = user.id;
        return {
          ...cachedState,
          user,
        };
      }

      const pendingState = profileFetchPromiseRef.current[user.id];

      if (pendingState) {
        lastResolvedUserIdRef.current = user.id;
        return pendingState;
      }

      const nextStatePromise = buildAuthState(user)
        .then((nextState) => {
          profileCacheRef.current[user.id] = nextState;
          lastResolvedUserIdRef.current = user.id;
          delete profileFetchPromiseRef.current[user.id];
          return nextState;
        })
        .catch((error) => {
          delete profileFetchPromiseRef.current[user.id];
          throw error;
        });

      profileFetchPromiseRef.current[user.id] = nextStatePromise;

      return nextStatePromise;
    }

    async function signOutForIdleTimeout() {
      await supabase.auth.signOut();
      profileCacheRef.current = {};
      profileFetchPromiseRef.current = {};
      lastResolvedUserIdRef.current = null;
      clearLastActivity();

      if (typeof window !== "undefined") {
        const loginUrl = new URL("/login", window.location.origin);
        loginUrl.searchParams.set("reason", "idle-timeout");
        window.location.replace(loginUrl.toString());
      }
    }

    async function bootstrap() {
      if (isSessionExpired(readLastActivity())) {
        if (isMounted) {
          setAuthState({
            user: null,
            role: "siswa",
            fullName: "Pengguna",
            isLoading: false,
          });
        }

        await signOutForIdleTimeout();
        return;
      }

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        logSupabaseError("[AuthProvider] auth.getUser", authError);
      }

      if (!isMounted) {
        return;
      }

      if (user) {
        writeLastActivity(getNow());
      } else {
        profileCacheRef.current = {};
        profileFetchPromiseRef.current = {};
        lastResolvedUserIdRef.current = null;
        clearLastActivity();
      }

      const nextState = await resolveAuthState(user);

      if (isMounted) {
        setAuthState(nextState);
      }
    }

    void bootstrap();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      void (async () => {
        if (!isMounted) {
          return;
        }

        if (event === "SIGNED_OUT") {
          profileCacheRef.current = {};
          profileFetchPromiseRef.current = {};
          lastResolvedUserIdRef.current = null;
          clearLastActivity();
        } else if (session?.user) {
          writeLastActivity(getNow());
        }

        const nextUser = session?.user ?? null;

        if (nextUser?.id && lastResolvedUserIdRef.current === nextUser.id) {
          if (isMounted) {
            setAuthState((currentState) => ({
              ...currentState,
              user: nextUser,
              isLoading: false,
            }));
          }
          return;
        }

        const nextState = await resolveAuthState(nextUser);

        if (isMounted) {
          setAuthState(nextState);
        }
      })();
    });

    let lastRecordedActivityAt = readLastActivity();
    const activityEvents: Array<keyof WindowEventMap> = [
      "pointerdown",
      "keydown",
      "scroll",
      "touchstart",
    ];

    function recordActivity() {
      if (!currentUserRef.current) {
        return;
      }

      const now = getNow();

      if (
        lastRecordedActivityAt &&
        now - lastRecordedActivityAt < ACTIVITY_UPDATE_INTERVAL_MS
      ) {
        return;
      }

      lastRecordedActivityAt = now;
      writeLastActivity(now);
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        const lastActivityAt = readLastActivity();

        if (isSessionExpired(lastActivityAt)) {
          void signOutForIdleTimeout();
          return;
        }

        recordActivity();
      }
    }

    const intervalId = window.setInterval(() => {
      if (isSessionExpired(readLastActivity())) {
        void signOutForIdleTimeout();
      }
    }, 60 * 1000);

    activityEvents.forEach((eventName) => {
      window.addEventListener(eventName, recordActivity, { passive: true });
    });
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      window.clearInterval(intervalId);
      activityEvents.forEach((eventName) => {
        window.removeEventListener(eventName, recordActivity);
      });
      document.removeEventListener("visibilitychange", handleVisibilityChange);
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
