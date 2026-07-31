import api from "./client";
import type { Expense, ExpenseCreate, ExpenseUpdate } from "../types";

export interface ExpenseFilters {
  search?: string;
  category_id?: number;
  min_amount?: number;
  max_amount?: number;
  start_date?: string;
  end_date?: string;
  sort_by?: string;
  order?: string;
}

export function buildExpenseFilterParams(
  filters?: ExpenseFilters,
): Record<string, string | number> {
  const params: Record<string, string | number> = {};
  if (filters) {
    if (filters.search) params.search = filters.search;
    if (filters.category_id) params.category_id = filters.category_id;
    if (filters.min_amount !== undefined) params.min_amount = filters.min_amount;
    if (filters.max_amount !== undefined) params.max_amount = filters.max_amount;
    if (filters.start_date) params.start_date = filters.start_date;
    if (filters.end_date) params.end_date = filters.end_date;
    if (filters.sort_by) params.sort_by = filters.sort_by;
    if (filters.order) params.order = filters.order;
  }
  return params;
}

export async function fetchExpenses(
  filters?: ExpenseFilters,
): Promise<Expense[]> {
  const res = await api.get<Expense[]>("/expenses/", {
    params: buildExpenseFilterParams(filters),
  });
  return res.data;
}

export async function createExpense(
  data: ExpenseCreate,
): Promise<Expense> {
  const res = await api.post<Expense>("/expenses/", data);
  return res.data;
}

export async function updateExpense(
  id: number,
  data: ExpenseUpdate,
): Promise<Expense> {
  const res = await api.put<Expense>(`/expenses/${id}`, data);
  return res.data;
}

export async function deleteExpense(id: number): Promise<void> {
  await api.delete(`/expenses/${id}`);
}
