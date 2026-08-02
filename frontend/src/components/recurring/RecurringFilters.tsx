import { Search, RotateCcw } from "lucide-react";
import { Button, Select, type SelectOption } from "../ui";
import type { RecurringFrequency } from "../../types";

export interface RecurringFilterValues {
  search: string;
  frequency: RecurringFrequency | "";
  status: "active" | "paused" | "";
  sort: string;
}

interface RecurringFiltersProps {
  values: RecurringFilterValues;
  onChange: (values: RecurringFilterValues) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

const FREQUENCY_OPTIONS: SelectOption[] = [
  { value: "", label: "All Frequencies" },
  { value: "Daily", label: "Daily" },
  { value: "Weekly", label: "Weekly" },
  { value: "Monthly", label: "Monthly" },
  { value: "Yearly", label: "Yearly" },
];

const STATUS_OPTIONS: SelectOption[] = [
  { value: "", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "paused", label: "Paused" },
];

const SORT_OPTIONS: SelectOption[] = [
  { value: "due", label: "Next Due" },
  { value: "due_desc", label: "Latest Due" },
  { value: "amount_desc", label: "Highest Amount" },
  { value: "amount_asc", label: "Lowest Amount" },
  { value: "title", label: "Title A–Z" },
];

export function RecurringFilters({
  values,
  onChange,
  onReset,
  hasActiveFilters,
}: RecurringFiltersProps) {
  const update = (patch: Partial<RecurringFilterValues>) => {
    onChange({ ...values, ...patch });
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
        <input
          type="text"
          placeholder="Search recurring expenses..."
          value={values.search}
          onChange={(e) => update({ search: e.target.value })}
          className="h-11 w-full rounded-2xl border border-border-strong bg-surface-muted pl-11 pr-4 text-sm text-text-primary backdrop-blur-sm placeholder:text-text-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500/50"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <Select
          value={values.frequency}
          onChange={(value) =>
            update({ frequency: value as RecurringFrequency | "" })
          }
          options={FREQUENCY_OPTIONS}
          ariaLabel="Filter by frequency"
          className="sm:w-auto sm:min-w-[10rem]"
        />

        <Select
          value={values.status}
          onChange={(value) =>
            update({ status: value as "active" | "paused" | "" })
          }
          options={STATUS_OPTIONS}
          ariaLabel="Filter by status"
          className="sm:w-auto sm:min-w-[10rem]"
        />

        <Select
          value={values.sort}
          onChange={(value) => update({ sort: value })}
          options={SORT_OPTIONS}
          ariaLabel="Sort recurring expenses"
          className="sm:w-auto sm:min-w-[11rem]"
        />

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onReset}>
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
