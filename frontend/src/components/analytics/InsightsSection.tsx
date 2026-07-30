import { useMemo } from "react";
import {
  TrendingUp,
  Calendar,
  Award,
  Hash,
} from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";
import type { ExpenseSummary, CategorySummary, MonthlySummary } from "../../types";

interface Insight {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
  subtitle: string;
}

interface InsightsSectionProps {
  summary: ExpenseSummary;
  categorySummary: CategorySummary[];
  monthlySummary: MonthlySummary[];
}

export function InsightsSection({
  summary,
  categorySummary,
  monthlySummary,
}: InsightsSectionProps) {
  const insights: Insight[] = useMemo(() => {
    const highestCategory = categorySummary.length > 0
      ? categorySummary.reduce((max, c) => (c.total > max.total ? c : max), categorySummary[0])
      : null;

    const totalMonths = monthlySummary.length;
    const avgMonthly = totalMonths > 0
      ? monthlySummary.reduce((sum, m) => sum + m.total, 0) / totalMonths
      : 0;

    return [
      {
        icon: TrendingUp,
        title: "Highest Spending Category",
        value: highestCategory
          ? `${highestCategory.category} (${formatCurrency(highestCategory.total)})`
          : "N/A",
        subtitle: highestCategory
          ? `${((highestCategory.total / summary.total_amount) * 100).toFixed(0)}% of total spending`
          : "Add expenses to see insights",
      },
      {
        icon: Calendar,
        title: "Average Monthly Spending",
        value: formatCurrency(avgMonthly),
        subtitle: totalMonths > 0
          ? `Across ${totalMonths} month${totalMonths !== 1 ? "s" : ""}`
          : "No monthly data yet",
      },
      {
        icon: Award,
        title: "Biggest Expense",
        value: formatCurrency(summary.highest_expense),
        subtitle: "Single largest transaction",
      },
      {
        icon: Hash,
        title: "Total Transactions",
        value: String(summary.total_expenses),
        subtitle: summary.total_expenses > 0
          ? `${summary.total_expenses} expense${summary.total_expenses !== 1 ? "s" : ""} tracked`
          : "No expenses recorded",
      },
    ];
  }, [summary, categorySummary, monthlySummary]);

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {insights.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.title}
            className="rounded-3xl border border-white/40 bg-white/70 p-5 shadow-lg shadow-black/[0.02] backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
          >
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <Icon className="h-4.5 w-4.5" />
            </div>
            <p className="text-xs font-medium text-text-secondary">
              {item.title}
            </p>
            <p className="mt-1 text-base font-semibold tracking-tight text-text-primary">
              {item.value}
            </p>
            <p className="mt-1 text-xs text-text-tertiary">{item.subtitle}</p>
          </div>
        );
      })}
    </div>
  );
}
