import { Receipt, TrendingDown, BarChart3, ArrowUp, ArrowDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";
import type { ExpenseSummary } from "../../types";

interface CardItem {
  icon: LucideIcon;
  title: string;
  value: string;
  accent: "accent" | "danger" | "info" | "warning" | "purple";
}

const accentStyles: Record<string, string> = {
  accent: "bg-accent/10 text-accent",
  danger: "bg-danger/10 text-danger",
  info: "bg-info/10 text-info",
  warning: "bg-warning/10 text-warning",
  purple: "bg-purple-500/10 text-purple-600",
};

interface SummaryCardsProps {
  summary: ExpenseSummary;
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  const items: CardItem[] = [
    {
      icon: Receipt,
      title: "Total Expenses",
      value: String(summary.total_expenses),
      accent: "accent",
    },
    {
      icon: TrendingDown,
      title: "Total Amount Spent",
      value: formatCurrency(summary.total_amount),
      accent: "danger",
    },
    {
      icon: BarChart3,
      title: "Average Expense",
      value: formatCurrency(summary.average_expense),
      accent: "info",
    },
    {
      icon: ArrowUp,
      title: "Highest Expense",
      value: formatCurrency(summary.highest_expense),
      accent: "warning",
    },
    {
      icon: ArrowDown,
      title: "Lowest Expense",
      value: formatCurrency(summary.lowest_expense),
      accent: "purple",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.title}
            className="flex flex-col gap-3 rounded-3xl border border-white/40 bg-white/70 p-5 shadow-lg shadow-black/[0.02] backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${accentStyles[item.accent]}`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-text-secondary">
                {item.title}
              </p>
              <p className="mt-1 text-xl font-bold tracking-tight text-text-primary">
                {item.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
