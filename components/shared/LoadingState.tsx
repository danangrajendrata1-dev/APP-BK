type LoadingStateProps = {
  title?: string;
  description?: string;
};

export function LoadingState({
  title = "Memuat data",
  description = "Mohon tunggu sebentar, sistem sedang menyiapkan informasi yang dibutuhkan.",
}: LoadingStateProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}
