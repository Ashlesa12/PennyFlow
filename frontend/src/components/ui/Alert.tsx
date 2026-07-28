import * as React from "react";
import { cn } from "../../utils/cn"; // Adjust path if your cn helper is directly in src/utils

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive" | "success";
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    const variantStyles = {
      default: "bg-slate-100 text-slate-900 border-slate-200",
      destructive: "bg-red-50 text-red-900 border-red-200 dark:bg-red-950/50 dark:text-red-200 dark:border-red-800",
      success: "bg-emerald-50 text-emerald-900 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-200 dark:border-emerald-800",
    };

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          "relative w-full rounded-xl border p-4 text-sm [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Alert.displayName = "Alert";