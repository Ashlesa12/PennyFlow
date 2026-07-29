import { cn } from "../../utils/cn";

const sizes = {
  sm: "h-5 w-5 border-2",
  md: "h-8 w-8 border-[3px]",
  lg: "h-12 w-12 border-4",
} as const;

export interface SpinnerProps {
  size?: keyof typeof sizes;
  className?: string;
  label?: string;
}

export function Spinner({
  size = "md",
  className,
  label = "Loading",
}: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label={label}
      className={cn(
        "animate-spin rounded-full border-neutral-200/60 border-t-neutral-800",
        sizes[size],
        className,
      )}
    />
  );
}

export function SpinnerOverlay({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex min-h-40 items-center justify-center">
      <Spinner size="lg" label={label} />
    </div>
  );
}
