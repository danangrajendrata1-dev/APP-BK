import { forwardRef, type TextareaHTMLAttributes } from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
  hint?: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ className = "", error, hint, label, rows = 5, ...props }, ref) {
    return (
      <label className="block space-y-2">
        {label ? (
          <span className="text-sm font-medium text-slate-700">{label}</span>
        ) : null}
        <textarea
          ref={ref}
          rows={rows}
          className={[
            "w-full rounded-xl border px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400",
            "resize-y",
            error
              ? "border-rose-300 bg-rose-50/50 focus:border-rose-500 focus:bg-white focus:ring-4 focus:ring-rose-500/10"
              : "border-slate-200 bg-slate-50/50 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-700/10 hover:border-slate-300",
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
  },
);
