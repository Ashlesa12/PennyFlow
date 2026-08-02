import { useEffect, useState } from "react";
import { Tag } from "lucide-react";
import { MonthNavigator } from "../components/month/MonthNavigator";
import { SpinnerOverlay } from "../components/ui";
import { useCategories } from "../hooks/useCategories";
import { useMonth } from "../context/MonthContext";
import { fetchCategorySummary } from "../api/analytics";
import { formatCurrency } from "../utils/formatCurrency";
import {
  getCategoryColor,
  getCategoryIconByName,
} from "../constants/categories";
import type { CategorySummary } from "../types";

export default function CategoriesPage() {
  const { categories, isLoading, error, refetch } = useCategories();
  const { selectedMonthNumber, selectedYear, monthLabel } = useMonth();
  const [spending, setSpending] = useState<CategorySummary[]>([]);
  const [spendingMonth, setSpendingMonth] = useState("");

  const currentMonthKey = `${selectedYear}-${selectedMonthNumber}`;

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    let cancelled = false;

    fetchCategorySummary(selectedMonthNumber, selectedYear)
      .then((data) => {
        if (!cancelled) {
          setSpending(Array.isArray(data) ? data : []);
          setSpendingMonth(currentMonthKey);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSpending([]);
          setSpendingMonth(currentMonthKey);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectedMonthNumber, selectedYear, currentMonthKey]);

  const spendingByCategory = new Map(
    spending.map((s) => [s.category.toLowerCase(), s.total]),
  );
  const totalSpent = spending.reduce((sum, s) => sum + s.total, 0);
  const showSpending = spendingMonth === currentMonthKey;

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <SpinnerOverlay label="Loading categories" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
            Categories
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Your spending categories for {monthLabel}.
          </p>
        </div>
        <MonthNavigator />
      </div>

      {error ? (
        <div className="rounded-3xl border border-border-strong bg-surface-elevated p-8 text-center shadow-lg shadow-black/[0.02] backdrop-blur-xl">
          <p className="text-sm text-danger">{error}</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border bg-surface-subtle px-6 py-20 text-center backdrop-blur-sm">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 text-accent">
            <Tag className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-semibold tracking-tight text-text-primary">
            No categories found
          </h3>
          <p className="mt-1.5 max-w-xs text-sm text-text-secondary">
            Categories will appear here once they are set up.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const Icon = getCategoryIconByName(category.name);
              const color = getCategoryColor(category.name);
              const spent =
                spendingByCategory.get(category.name.toLowerCase()) ?? 0;
              const percentage =
                totalSpent > 0 && spent > 0
                  ? Math.round((spent / totalSpent) * 100)
                  : 0;

              return (
                <div
                  key={category.id}
                  className="group relative overflow-hidden rounded-3xl border border-border-strong bg-surface-elevated p-6 shadow-lg shadow-black/[0.02] backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-black/[0.04]"
                >
                  <div
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      background: `radial-gradient(600px circle at 50% 0%, ${color}10 0%, transparent 60%)`,
                    }}
                  />
                  <div className="relative flex items-center gap-4">
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                      style={{ backgroundColor: `${color}18`, color }}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-text-primary">
                        {category.name}
                      </p>
                      {showSpending ? (
                        <p className="mt-0.5 text-xs text-text-secondary">
                          {spent > 0
                            ? formatCurrency(spent)
                            : "No spending yet"}
                        </p>
                      ) : (
                        <p className="mt-0.5 text-xs text-text-tertiary">
                          Loading spending...
                        </p>
                      )}
                    </div>
                  </div>

                  {spent > 0 && (
                    <div className="relative mt-5">
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-200/50">
                        <div
                          className="h-full rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${percentage}%`, backgroundColor: color }}
                        />
                      </div>
                      <p className="mt-1.5 text-xs text-text-tertiary">
                        {percentage}% of spending
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {showSpending && totalSpent > 0 && (
            <div className="flex items-center justify-between gap-4 rounded-3xl border border-border-strong bg-surface-elevated px-6 py-5 shadow-lg shadow-black/[0.02] backdrop-blur-xl">
              <p className="text-sm text-text-secondary">
                Total spent in {monthLabel}
              </p>
              <p className="text-lg font-semibold tracking-tight text-text-primary">
                {formatCurrency(totalSpent)}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
