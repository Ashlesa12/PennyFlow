import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "../../utils/cn";

const variants = {
  default:
    "bg-surface-elevated backdrop-blur-xl border border-border-strong text-text-primary shadow-lg shadow-black/[0.02]",
  dark:
    "bg-neutral-900/80 backdrop-blur-xl border border-neutral-700/50 text-white shadow-lg shadow-black/10",
  dashed:
    "bg-surface-subtle backdrop-blur-sm border-2 border-dashed border-border text-text-tertiary",
} as const;

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof variants;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("rounded-3xl p-6 lg:p-8", variants[variant], className)}
        {...props}
      />
    );
  },
);

Card.displayName = "Card";

export function CardHeader({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-5 space-y-1.5", className)} {...props} />;
}

export function CardTitle({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-lg font-semibold tracking-tight", className)}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-text-secondary", className)} {...props} />
  );
}

export function CardContent({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("", className)} {...props} />;
}

export function CardFooter({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mt-6 flex items-center gap-3", className)}
      {...props}
    />
  );
}
