import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "../../utils/cn";

const variants = {
  primary:
    "bg-neutral-900 text-white hover:bg-neutral-800 focus-visible:ring-neutral-900",
  secondary:
    "bg-white text-neutral-900 border border-neutral-200 hover:bg-neutral-50 focus-visible:ring-neutral-400",
  ghost:
    "bg-transparent text-neutral-700 hover:bg-neutral-100 focus-visible:ring-neutral-400",
  danger:
    "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600",
} as const;

const sizes = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
  icon: "h-10 w-10",
} as const;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      >
        {isLoading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
