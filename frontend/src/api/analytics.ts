import api from "./client";
import type { ExpenseSummary, CategorySummary, MonthlySummary } from "../types";

export async function fetchExpenseSummary(
  month?: number,
  year?: number,
): Promise<ExpenseSummary> {
  const res = await api.get<ExpenseSummary>("/expenses/summary", {
    params: { month, year },
  });
  return res.data;
}

export async function fetchCategorySummary(
  month?: number,
  year?: number,
): Promise<CategorySummary[]> {
  const res = await api.get<CategorySummary[]>("/expenses/category-summary", {
    params: { month, year },
  });
  return res.data;
}

export async function fetchMonthlySummary(): Promise<MonthlySummary[]> {
  const res = await api.get<MonthlySummary[]>("/expenses/monthly-summary");
  return res.data;
}
