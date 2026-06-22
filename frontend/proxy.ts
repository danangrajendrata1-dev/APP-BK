import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import {
  getDefaultRouteForRole,
  isProtectedRoute,
  isPublicRoute,
  normalizeRole,
} from "@/lib/auth/permissions";

const IDLE_TIMEOUT_MS = 60 * 60 * 1000;
const LAST_ACTIVITY_COOKIE_NAME = "bk_last_activity_at";

function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Supabase environment variables are missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  return { url, anonKey };
}

function hasExpiredByIdleTimeout(request: NextRequest) {
  const lastActivityValue = Number(
    request.cookies.get(LAST_ACTIVITY_COOKIE_NAME)?.value ?? "",
  );

  return Number.isFinite(lastActivityValue) && Date.now() - lastActivityValue > IDLE_TIMEOUT_MS;
}

function clearSessionCookies(request: NextRequest, response: NextResponse) {
  request.cookies.getAll().forEach(({ name }) => {
    if (name.startsWith("sb-") || name === LAST_ACTIVITY_COOKIE_NAME) {
      response.cookies.set(name, "", { maxAge: 0, path: "/" });
    }
  });
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (!isProtectedRoute(pathname) && !isPublicRoute(pathname)) {
    return NextResponse.next({
      request,
    });
  }

  const response = NextResponse.next({ request });

  if (hasExpiredByIdleTimeout(request)) {
    if (isProtectedRoute(pathname)) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("reason", "idle-timeout");
      const redirectResponse = NextResponse.redirect(loginUrl);
      clearSessionCookies(request, redirectResponse);
      return redirectResponse;
    }

    clearSessionCookies(request, response);
    return response;
  }

  const { url, anonKey } = getSupabaseEnv();
  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    if (isProtectedRoute(pathname)) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("redirectedFrom", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return response;
  }

  if (isPublicRoute(pathname)) {
    const role = normalizeRole(
      session.user.app_metadata?.role ?? session.user.user_metadata?.role,
    );
    const defaultRoute = getDefaultRouteForRole(role);
    const destinationUrl = request.nextUrl.clone();
    destinationUrl.pathname = defaultRoute;
    destinationUrl.search = "";
    return NextResponse.redirect(destinationUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json|.*\\..*).*)",
  ],
};
