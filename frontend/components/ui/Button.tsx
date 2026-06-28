import Link from "next/link";
import type { LinkProps } from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "danger";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  isLoading?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  href?: LinkProps["href"];
};

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary: "bg-teal-700 text-white hover:bg-teal-800 shadow-sm active:scale-[0.98]",
  secondary: "bg-slate-200 text-slate-900 hover:bg-slate-300 active:scale-[0.98]",
  outline: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 active:scale-[0.98]",
  danger: "bg-rose-600 text-white hover:bg-rose-700 shadow-sm active:scale-[0.98]",
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-base",
};

export function Button({
  children,
  className = "",
  disabled,
  fullWidth = false,
  href,
  isLoading = false,
  size = "md",
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  const classNames = [
    "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200",
    "disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100",
    VARIANT_STYLES[variant],
    SIZE_STYLES[size],
    fullWidth ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (href) {
    return (
      <Link
        href={disabled ? "#" : href}
        aria-disabled={disabled || isLoading}
        tabIndex={disabled || isLoading ? -1 : undefined}
        className={[
          classNames,
          disabled || isLoading ? "pointer-events-none" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={classNames}
      {...props}
    >
      {isLoading ? "Memproses..." : children}
    </button>
  );
}
