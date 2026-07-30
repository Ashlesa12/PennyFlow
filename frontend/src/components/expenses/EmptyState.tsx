import { Button } from "../ui";

interface EmptyStateProps {
  hasFilters?: boolean;
  onAdd: () => void;
}

export function EmptyState({ hasFilters, onAdd }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border bg-white/40 px-6 py-20 text-center backdrop-blur-sm">
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
        className="mb-6 text-accent"
        aria-hidden="true"
      >
        <rect
          x="20"
          y="30"
          width="80"
          height="65"
          rx="16"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          opacity="0.3"
        />
        <rect
          x="28"
          y="42"
          width="28"
          height="8"
          rx="4"
          fill="currentColor"
          opacity="0.15"
        />
        <rect
          x="28"
          y="58"
          width="20"
          height="8"
          rx="4"
          fill="currentColor"
          opacity="0.1"
        />
        <circle
          cx="82"
          cy="56"
          r="18"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          opacity="0.25"
        />
        <path
          d="M76 56h12M82 50v12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.4"
        />
        <rect
          x="28"
          y="74"
          width="24"
          height="8"
          rx="4"
          fill="currentColor"
          opacity="0.15"
        />
        <circle
          cx="82"
          cy="82"
          r="4"
          fill="currentColor"
          opacity="0.15"
        />
      </svg>

      <h3 className="text-lg font-semibold tracking-tight text-text-primary">
        {hasFilters ? "No matching expenses" : "No expenses yet."}
      </h3>

      <p className="mt-1.5 max-w-xs text-sm text-text-secondary">
        {hasFilters
          ? "Try adjusting your filters to find what you're looking for."
          : "Start tracking today and build better financial habits."}
      </p>

      {!hasFilters && (
        <Button className="mt-6" onClick={onAdd}>
          Add First Expense
        </Button>
      )}
    </div>
  );
}
