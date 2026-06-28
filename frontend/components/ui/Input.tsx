import { forwardRef, type InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  hint?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className = "", error, hint, id, label, ...props },
  ref,
) {
  return (
    <label className="block space-y-2">
      {label ? (
        <span className="text-sm font-medium text-slate-700">{label}</span>
      ) : null}
      <input
        ref={ref}
        id={id}
        className={[
          "w-full rounded-xl border px-4 py-2.5 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400",
          error
            ? "border-rose-300 bg-rose-50/50 focus:border-rose-500 focus:bg-white focus:ring-4 focus:ring-rose-500/10"
            : "border-slate-200 bg-slate-50/50 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 hover:border-slate-300",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />
      {error ? (
        <span className="text-sm text-rose-600">{error}</span>
      ) : hint ? (
        <span className="text-sm text-slate-500">{hint}</span>
      ) : null}
    </label>
  );
});
