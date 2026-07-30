import { Search, RotateCcw } from "lucide-react";
import { Button } from "../ui";
import { getCategoryName } from "../../constants/categories";

interface FilterValues {
  search: string;
  category_id: string;
  start_date: string;
  end_date: string;
  sort: string;
}

interface ExpenseFiltersProps {
  values: FilterValues;
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
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          placeholder="Search expenses..."
          value={values.search}
          onChange={(e) => update({ search: e.target.value })}
          className="h-11 w-full rounded-2xl border border-white/40 bg-white/60 pl-11 pr-4 text-sm text-neutral-900 backdrop-blur-sm placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500/50"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <select
          value={values.category_id}
          onChange={(e) => update({ category_id: e.target.value })}
          className="h-11 rounded-2xl border border-white/40 bg-white/60 px-4 text-sm text-neutral-900 backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500/50"
        >
          <option value="">All Categories</option>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((id) => (
            <option key={id} value={id}>
              {getCategoryName(id)}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={values.start_date}
          onChange={(e) => update({ start_date: e.target.value })}
          className="h-11 rounded-2xl border border-white/40 bg-white/60 px-4 text-sm text-neutral-900 backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500/50"
        />
        <span className="hidden text-sm text-neutral-400 sm:inline">—</span>
        <input
          type="date"
          value={values.end_date}
          onChange={(e) => update({ end_date: e.target.value })}
          className="h-11 rounded-2xl border border-white/40 bg-white/60 px-4 text-sm text-neutral-900 backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500/50"
        />

        <select
          value={values.sort}
          onChange={(e) => update({ sort: e.target.value })}
          className="h-11 rounded-2xl border border-white/40 bg-white/60 px-4 text-sm text-neutral-900 backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500/50"
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
