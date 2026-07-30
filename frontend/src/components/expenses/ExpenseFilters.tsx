import { Search, RotateCcw } from "lucide-react";
import { Button } from "../ui";
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

const SORT_OPTIONS = [
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
          className="h-11 w-full rounded-2xl border border-white/40 bg-white/60 pl-11 pr-4 text-sm text-text-primary backdrop-blur-sm placeholder:text-text-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500/50"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <select
          value={values.category_id}
          onChange={(e) => update({ category_id: e.target.value })}
          className="h-11 w-full rounded-2xl border border-white/40 bg-white/60 px-4 text-sm text-text-primary backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500/50 sm:w-auto"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2 sm:gap-3">
          <input
            type="date"
            value={values.start_date}
            onChange={(e) => update({ start_date: e.target.value })}
            className="h-11 flex-1 rounded-2xl border border-white/40 bg-white/60 px-4 text-sm text-text-primary backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500/50 sm:flex-initial"
          />
          <span className="hidden shrink-0 text-sm text-text-tertiary sm:inline">—</span>
          <input
            type="date"
            value={values.end_date}
            onChange={(e) => update({ end_date: e.target.value })}
            className="h-11 flex-1 rounded-2xl border border-white/40 bg-white/60 px-4 text-sm text-text-primary backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500/50 sm:flex-initial"
          />
        </div>

        <select
          value={values.sort}
          onChange={(e) => update({ sort: e.target.value })}
          className="h-11 w-full rounded-2xl border border-white/40 bg-white/60 px-4 text-sm text-text-primary backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500/50 sm:w-auto"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

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
