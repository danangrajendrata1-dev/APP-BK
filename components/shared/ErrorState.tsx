import type { ReactNode } from "react";

type ErrorStateProps = {
  title?: string;
  description: string;
  action?: ReactNode;
};

export function ErrorState({
  action,
  description,
  title = "Terjadi kesalahan",
}: ErrorStateProps) {
  return (
    <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 shadow-sm">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white text-lg text-rose-600">
        !
      </div>
      <h3 className="text-lg font-semibold text-rose-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-rose-800">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
