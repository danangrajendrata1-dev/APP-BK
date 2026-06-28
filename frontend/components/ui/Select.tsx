import { forwardRef, type SelectHTMLAttributes } from "react";

type SelectOption = {
  label: string;
  value: string;
};

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    className = "",
    error,
    hint,
    label,
    options,
    placeholder = "Pilih salah satu",
    ...props
  },
  ref,
) {
  return (
    <label className="block space-y-2">
      {label ? (
        <span className="text-sm font-medium text-slate-700">{label}</span>
      ) : null}
      <select
        ref={ref}
        className={[
          "w-full rounded-xl border px-4 py-2.5 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400",
          error
            ? "border-rose-300 bg-rose-50/50 focus:border-rose-500 focus:bg-white focus:ring-4 focus:ring-rose-500/10"
            : "border-slate-200 bg-slate-50/50 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-700/10 hover:border-slate-300",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? (
        <span className="text-sm text-rose-600">{error}</span>
      ) : hint ? (
        <span className="text-sm text-slate-500">{hint}</span>
      ) : null}
    </label>
  );
});
