import api from "./client";
import type { BudgetProgress, BudgetCreate, BudgetUpdate } from "../types";

export function currentMonth(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${now.getFullYear()}-${month}`;
}

export async function fetchBudget(month?: string): Promise<BudgetProgress> {
  const res = await api.get<BudgetProgress>("/budgets/", {
    params: month ? { month } : undefined,
  });
  return res.data;
}

export async function createBudget(data: BudgetCreate): Promise<BudgetProgress> {
  const res = await api.post<BudgetProgress>("/budgets/", data);
  return res.data;
}

export async function updateBudget(
  id: number,
  data: BudgetUpdate,
): Promise<BudgetProgress> {
  const res = await api.put<BudgetProgress>(`/budgets/${id}`, data);
  return res.data;
}

export async function deleteBudget(id: number): Promise<void> {
  await api.delete(`/budgets/${id}`);
}
