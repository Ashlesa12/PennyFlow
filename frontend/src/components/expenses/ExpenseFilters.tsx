import { useMemo } from "react";
import { Search, RotateCcw } from "lucide-react";
import { Button, Select, type SelectOption } from "../ui";
import type { Category } from "../../types";

interface FilterValues {
  search: string;
  category_id: string;
  start_date: string;
  end_date: string;
  sort: string;
}

interface ExpenseFiltersProps {
  values: FilterValues;
  categories: Category[];
  onChange: (values: FilterValues) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

const SORT_OPTIONS: SelectOption[] = [
  { value: "date_desc", label: "Newest" },
  { value: "date_asc", label: "Oldest" },
  { value: "amount_desc", label: "Highest Amount" },
  { value: "amount_asc", label: "Lowest Amount" },
];

export function ExpenseFilters({
  values,
  categories,
  onChange,
  onReset,
  hasActiveFilters,
}: ExpenseFiltersProps) {
  const categoryOptions = useMemo<SelectOption[]>(
    () => [
      { value: "", label: "All Categories" },
      ...categories.map((cat) => ({ value: String(cat.id), label: cat.name })),
    ],
    [categories],
  );

  const update = (patch: Partial<FilterValues>) => {
    onChange({ ...values, ...patch });
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
        <input
          type="text"
          placeholder="Search expenses..."
          value={values.search}
          onChange={(e) => update({ search: e.target.value })}
          className="h-11 w-full rounded-2xl border border-border-strong bg-surface-muted pl-11 pr-4 text-sm text-text-primary backdrop-blur-sm placeholder:text-text-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500/50"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <Select
          value={values.category_id}
          onChange={(value) => update({ category_id: value })}
          options={categoryOptions}
          className="sm:w-auto sm:min-w-[11rem]"
        />

        <div className="flex items-center gap-2 sm:gap-3">
          <input
            type="date"
            value={values.start_date}
            onChange={(e) => update({ start_date: e.target.value })}
            className="h-11 flex-1 rounded-2xl border border-border-strong bg-surface-muted px-4 text-sm text-text-primary backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500/50 sm:flex-initial"
          />
          <span className="hidden shrink-0 text-sm text-text-tertiary sm:inline">—</span>
          <input
            type="date"
            value={values.end_date}
            onChange={(e) => update({ end_date: e.target.value })}
            className="h-11 flex-1 rounded-2xl border border-border-strong bg-surface-muted px-4 text-sm text-text-primary backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500/50 sm:flex-initial"
          />
        </div>

        <Select
          value={values.sort}
          onChange={(value) => update({ sort: value })}
          options={SORT_OPTIONS}
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
