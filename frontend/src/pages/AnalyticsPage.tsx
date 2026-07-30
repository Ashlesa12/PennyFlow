import { useState, useEffect } from "react";
import { SummaryCards } from "../components/analytics/SummaryCards";
import { CategoryChart } from "../components/analytics/CategoryChart";
import { MonthlyChart } from "../components/analytics/MonthlyChart";
import { InsightsSection } from "../components/analytics/InsightsSection";
import { AnalyticsSkeleton } from "../components/analytics/AnalyticsSkeleton";
import { AnalyticsEmptyState } from "../components/analytics/AnalyticsEmptyState";
import {
  fetchExpenseSummary,
  fetchCategorySummary,
  fetchMonthlySummary,
} from "../api/analytics";
import type { ExpenseSummary, CategorySummary, MonthlySummary } from "../types";

export default function AnalyticsPage() {
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
          fetchExpenseSummary(),
          fetchCategorySummary(),
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
  }, []);

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

  if (!summary || summary.total_expenses === 0) {
    return (
      <div className="mx-auto max-w-6xl">
        <AnalyticsEmptyState />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
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
