import api from "./client";
import type {
  RecurringExpense,
  RecurringCreate,
  RecurringUpdate,
  RecurringFrequency,
} from "../types";

export interface RecurringFilters {
  search?: string;
  frequency?: RecurringFrequency | "";
  is_active?: boolean;
  sort?: string;
}

export async function fetchRecurringExpenses(
  filters?: RecurringFilters,
): Promise<RecurringExpense[]> {
  const params: Record<string, string | number | boolean> = {};
  if (filters) {
    if (filters.search) params.search = filters.search;
    if (filters.frequency) params.frequency = filters.frequency;
    if (filters.is_active !== undefined) params.is_active = filters.is_active;
    if (filters.sort) params.sort = filters.sort;
  }
  const res = await api.get<RecurringExpense[]>("/recurring/", { params });
  return res.data;
}

export async function createRecurringExpense(
  data: RecurringCreate,
): Promise<RecurringExpense> {
  const res = await api.post<RecurringExpense>("/recurring/", data);
  return res.data;
}

export async function updateRecurringExpense(
  id: number,
  data: RecurringUpdate,
): Promise<RecurringExpense> {
  const res = await api.put<RecurringExpense>(`/recurring/${id}`, data);
  return res.data;
}

export async function completeRecurringExpense(
  id: number,
): Promise<RecurringExpense> {
  const res = await api.post<RecurringExpense>(`/recurring/${id}/complete`);
  return res.data;
}

export async function toggleRecurringExpense(
  id: number,
): Promise<RecurringExpense> {
  const res = await api.patch<RecurringExpense>(`/recurring/${id}/toggle`);
  return res.data;
}

export async function deleteRecurringExpense(id: number): Promise<void> {
  await api.delete(`/recurring/${id}`);
}
