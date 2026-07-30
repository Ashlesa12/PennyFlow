import { Receipt } from "lucide-react";
import { Button } from "../ui";

interface EmptyStateProps {
  hasFilters?: boolean;
  onAdd: () => void;
}

export function EmptyState({ hasFilters, onAdd }: EmptyStateProps) {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-neutral-200/60 bg-white/40 px-6 py-16 text-center backdrop-blur-sm">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10">
        <Receipt className="h-8 w-8 text-accent" />
      </div>

      <h3 className="text-lg font-semibold tracking-tight text-neutral-900">
        {hasFilters ? "No matching expenses" : "No expenses yet"}
      </h3>

      <p className="mt-1.5 max-w-xs text-sm text-neutral-500">
        {hasFilters
          ? "Try changing your filters to see more results."
          : "Start tracking today and build better financial habits."}
      </p>

      {!hasFilters && (
        <Button className="mt-6" onClick={onAdd}>
          <Receipt className="h-4 w-4" />
          Add First Expense
        </Button>
      )}
    </div>
  );
}
