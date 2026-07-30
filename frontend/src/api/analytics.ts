import api from "./client";
import type { ExpenseSummary, CategorySummary, MonthlySummary } from "../types";

export async function fetchExpenseSummary(): Promise<ExpenseSummary> {
  const res = await api.get<ExpenseSummary>("/expenses/summary");
  return res.data;
}

export async function fetchCategorySummary(): Promise<CategorySummary[]> {
  const res = await api.get<CategorySummary[]>("/expenses/category-summary");
  return res.data;
}

export async function fetchMonthlySummary(): Promise<MonthlySummary[]> {
  const res = await api.get<MonthlySummary[]>("/expenses/monthly-summary");
  return res.data;
}
