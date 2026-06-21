type SupabaseErrorLike = {
  code?: string | null;
  details?: string | null;
  hint?: string | null;
  message?: string | null;
  status?: number | null;
};

function formatSupabaseErrorDetails(error: SupabaseErrorLike | null | undefined) {
  if (!error) {
    return "unknown supabase error";
  }

  return [
    error.code ? `code=${error.code}` : null,
    error.message ? `message=${error.message}` : null,
    error.details ? `details=${error.details}` : null,
    error.hint ? `hint=${error.hint}` : null,
    typeof error.status === "number" ? `status=${error.status}` : null,
  ]
    .filter(Boolean)
    .join(" | ");
}

export function logSupabaseError(
  context: string,
  error: SupabaseErrorLike | null | undefined,
  extra?: Record<string, unknown>,
) {
  console.error(`[${context}] Supabase error`, {
    ...extra,
    code: error?.code ?? null,
    message: error?.message ?? null,
    details: error?.details ?? null,
    hint: error?.hint ?? null,
    status: error?.status ?? null,
  });
}

export function buildSupabaseErrorMessage(
  context: string,
  error: SupabaseErrorLike | null | undefined,
) {
  return `${context}: ${formatSupabaseErrorDetails(error)}`;
}
