import { createElement, type ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--northline-accent)] text-[var(--northline-background)] hover:bg-[#d8fa8e]",
  secondary:
    "border border-[var(--northline-border)] bg-[var(--northline-surface-raised)] text-[var(--northline-text)] hover:border-[var(--northline-accent)] hover:text-[var(--northline-accent)]",
  ghost:
    "text-[var(--northline-text-muted)] hover:bg-[var(--northline-surface)] hover:text-[var(--northline-text)]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-9 px-3 text-xs",
  md: "min-h-11 px-4 text-sm",
  lg: "min-h-13 px-5 text-sm",
};

export function Button({
  children,
  className = "",
  type = "button",
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return createElement(
    "button",
    {
      ...props,
      type,
      className: `inline-flex items-center justify-center gap-2 rounded-[10px] font-semibold tracking-[-0.01em] transition-[background-color,border-color,color,transform] duration-200 ease-out active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none motion-reduce:active:scale-100 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`,
    },
    children,
  );
}
