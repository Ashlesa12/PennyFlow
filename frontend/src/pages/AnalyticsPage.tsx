import { useState, useEffect } from "react";
import { SummaryCards } from "../components/analytics/SummaryCards";
import { CategoryChart } from "../components/analytics/CategoryChart";
import { MonthlyChart } from "../components/analytics/MonthlyChart";
import { InsightsSection } from "../components/analytics/InsightsSection";
import { AnalyticsSkeleton } from "../components/analytics/AnalyticsSkeleton";
import { AnalyticsEmptyState } from "../components/analytics/AnalyticsEmptyState";
import { MonthNavigator } from "../components/month/MonthNavigator";
import {
  fetchExpenseSummary,
  fetchCategorySummary,
  fetchMonthlySummary,
} from "../api/analytics";
import { useMonth } from "../context/MonthContext";
import type { ExpenseSummary, CategorySummary, MonthlySummary } from "../types";

export default function AnalyticsPage() {
  const { selectedMonthNumber, selectedYear, monthLabel } = useMonth();
  const [summary, setSummary] = useState<ExpenseSummary | null>(null);
  const [categorySummary, setCategorySummary] = useState<CategorySummary[]>([]);
  const [monthlySummary, setMonthlySummary] = useState<MonthlySummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError("");
      try {
        const [s, c, m] = await Promise.all([
          fetchExpenseSummary(selectedMonthNumber, selectedYear),
          fetchCategorySummary(selectedMonthNumber, selectedYear),
          fetchMonthlySummary(),
        ]);
        if (cancelled) return;
        setSummary(s);
        setCategorySummary(c);
        setMonthlySummary(m);
      } catch {
        if (!cancelled) setError("Failed to load analytics data");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [selectedMonthNumber, selectedYear]);

  if (error) {
    return (
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center py-24">
        <p className="text-sm text-danger">{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl">
        <AnalyticsSkeleton />
      </div>
    );
  }

  if (!summary || (summary.total_expenses === 0 && monthlySummary.length === 0)) {
    return (
      <div className="mx-auto max-w-6xl">
        <AnalyticsEmptyState />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Analytics
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Insights for {monthLabel}
          </p>
        </div>
        <MonthNavigator />
      </div>

      <SummaryCards summary={summary} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CategoryChart data={categorySummary} />
        <MonthlyChart data={monthlySummary} />
      </div>

      <InsightsSection
        summary={summary}
        categorySummary={categorySummary}
        monthlySummary={monthlySummary}
      />
    </div>
  );
}
