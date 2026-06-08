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
  primary: "bg-slate-900 text-white hover:bg-slate-700",
  secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
  outline: "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100",
  danger: "bg-rose-600 text-white hover:bg-rose-500",
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-2.5 text-sm",
  lg: "px-5 py-3 text-base",
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
    "inline-flex items-center justify-center rounded-xl font-semibold transition",
    "disabled:cursor-not-allowed disabled:opacity-60",
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
