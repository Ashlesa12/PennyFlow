import { CalendarClock } from "lucide-react";
import { Button } from "../ui";

interface RecurringEmptyStateProps {
  hasFilters?: boolean;
  onAdd: () => void;
}

export function RecurringEmptyState({
  hasFilters,
  onAdd,
}: RecurringEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border bg-surface-subtle px-6 py-20 text-center backdrop-blur-sm">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-accent/10 text-accent">
        <CalendarClock className="h-9 w-9" />
      </div>

      <h3 className="text-lg font-semibold tracking-tight text-text-primary">
        {hasFilters
          ? "No matching recurring expenses"
          : "No recurring expenses yet."}
      </h3>

      <p className="mt-1.5 max-w-xs text-sm text-text-secondary">
        {hasFilters
          ? "Try adjusting your filters to find what you're looking for."
          : "Add subscriptions and bills that repeat, and we'll track the next due date for you."}
      </p>

      {!hasFilters && (
        <Button className="mt-6" onClick={onAdd}>
          Add Recurring Expense
        </Button>
      )}
    </div>
  );
}
