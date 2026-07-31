import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, CalendarClock, Plus } from "lucide-react";
import { Card } from "../ui";
import { fetchRecurringExpenses } from "../../api/recurring";
import { formatCurrency } from "../../utils/formatCurrency";
import { dueLabel } from "../../utils/dueLabel";
import { getCategoryColor, getCategoryIcon, getCategoryName } from "../../constants/categories";
import { cn } from "../../utils/cn";
import type { RecurringExpense } from "../../types";

export function UpcomingBillsCard() {
  const [items, setItems] = useState<RecurringExpense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchRecurringExpenses({ is_active: true, sort: "due" })
      .then((data) => {
        if (active) setItems(data);
      })
      .catch(() => {
        if (active) setItems([]);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const upcoming = items.slice(0, 3);

  return (
    <Card className="h-full">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold tracking-tight text-text-primary">
            <CalendarClock className="h-5 w-5 text-accent" />
            Upcoming Bills
          </h3>
          <p className="mt-1 text-sm text-text-secondary">
            Subscriptions due soon
          </p>
        </div>
        <Link
          to="/recurring"
          className="inline-flex items-center gap-1 text-sm font-medium text-accent transition-colors hover:text-accent/80"
        >
          View All
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="relative overflow-hidden rounded-2xl border border-border bg-surface-subtle p-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-neutral-200/60" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-2/5 rounded-full bg-neutral-200/60" />
                  <div className="h-2.5 w-1/3 rounded-full bg-neutral-200/40" />
                </div>
                <div className="h-4 w-16 rounded-full bg-neutral-200/60" />
              </div>
              <div
                className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
                }}
              />
            </div>
          ))}
        </div>
      ) : upcoming.length === 0 ? (
        <div className="flex flex-col items-start gap-4 rounded-2xl border-2 border-dashed border-border bg-surface-subtle p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
            <CalendarClock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-text-primary">
              No upcoming bills
            </p>
            <p className="mt-1 text-xs text-text-secondary">
              Add recurring expenses to see what&apos;s due next.
            </p>
          </div>
          <Link
            to="/recurring"
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-neutral-900 px-4 text-sm font-medium text-white transition-all duration-200 hover:bg-neutral-800 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            Add Recurring
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {upcoming.map((item) => {
            const categoryName = getCategoryName(item.category_id);
            const color = getCategoryColor(categoryName);
            const Icon = getCategoryIcon(item.category_id);
            const isOverdue =
              new Date(`${item.next_due_date}T00:00:00`).getTime() <
              new Date().setHours(0, 0, 0, 0);

            return (
              <div
                key={item.id}
                className="group flex items-center gap-3 rounded-2xl border border-border bg-surface-subtle p-4 transition-all duration-200 hover:bg-surface-elevated hover:shadow-md"
              >
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105"
                  style={{ backgroundColor: `${color}1A`, color }}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-text-primary">
                    {item.title}
                  </p>
                  <p
                    className={cn(
                      "mt-0.5 text-xs",
                      isOverdue ? "font-medium text-warning" : "text-text-secondary",
                    )}
                  >
                    {dueLabel(item.next_due_date)}
                  </p>
                </div>
                <p className="whitespace-nowrap text-sm font-semibold text-text-primary">
                  {formatCurrency(Number(item.amount))}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
