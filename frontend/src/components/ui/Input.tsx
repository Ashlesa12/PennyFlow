import { type InputHTMLAttributes, forwardRef } from "react";
import { cn } from "../../utils/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id ?? props.name;

    return (
      <div className="w-full space-y-2">
        {label ? (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-neutral-700"
          >
            {label}
          </label>
        ) : null}

        <input
          ref={ref}
          id={inputId}
          className={cn(
            "flex h-11 w-full rounded-2xl border border-white/40 bg-white/60 px-4 text-sm text-neutral-900 backdrop-blur-sm",
            "placeholder:text-neutral-400",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500/50",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-400/60 focus-visible:ring-red-500/30",
            className,
          )}
          {...props}
        />

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
      </div>
    );
  },
);

Input.displayName = "Input";
