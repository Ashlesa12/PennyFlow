import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "../../utils/cn";

const variants = {
  default: "bg-white border border-neutral-200 text-neutral-900 shadow-sm",
  dark: "bg-neutral-900 border border-neutral-800 text-white shadow-sm",
  dashed:
    "bg-neutral-50 border-2 border-dashed border-neutral-300 text-neutral-500",
} as const;

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof variants;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("rounded-3xl p-6", variants[variant], className)}
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
  return <div className={cn("mb-4 space-y-1", className)} {...props} />;
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
    <p className={cn("text-sm text-neutral-500", className)} {...props} />
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
      className={cn("mt-4 flex items-center gap-3", className)}
      {...props}
    />
  );
}
