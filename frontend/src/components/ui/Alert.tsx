import * as React from "react";
import { cn } from "../../utils/cn";

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive" | "success";
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    const variantStyles = {
      default:
        "bg-white/50 backdrop-blur-sm text-neutral-700 border border-white/40",
      destructive:
        "bg-red-50/80 backdrop-blur-sm text-red-800 border border-red-200/60",
      success:
        "bg-emerald-50/80 backdrop-blur-sm text-emerald-800 border border-emerald-200/60",
    };

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          "relative w-full rounded-2xl border p-4 text-sm [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
          variantStyles[variant],
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Alert.displayName = "Alert";
