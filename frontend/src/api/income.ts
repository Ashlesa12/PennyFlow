import api from "./client";
import type {
  Income,
  IncomeCreate,
  IncomeSummary,
  IncomeUpdate,
} from "../types";

export interface IncomeFilters {
  month?: number;
  year?: number;
  search?: string;
  min_amount?: number;
  max_amount?: number;
  start_date?: string;
  end_date?: string;
  sort_by?: string;
  order?: string;
}

export function buildIncomeFilterParams(
  filters?: IncomeFilters,
): Record<string, string | number> {
  const params: Record<string, string | number> = {};
  if (filters) {
    if (filters.month !== undefined) params.month = filters.month;
    if (filters.year !== undefined) params.year = filters.year;
    if (filters.search) params.search = filters.search;
    if (filters.min_amount !== undefined) params.min_amount = filters.min_amount;
    if (filters.max_amount !== undefined) params.max_amount = filters.max_amount;
    if (filters.start_date) params.start_date = filters.start_date;
    if (filters.end_date) params.end_date = filters.end_date;
    if (filters.sort_by) params.sort_by = filters.sort_by;
    if (filters.order) params.order = filters.order;
  }
  return params;
}

export async function fetchIncomes(
  filters?: IncomeFilters,
): Promise<Income[]> {
  const res = await api.get<Income[]>("/income/", {
    params: buildIncomeFilterParams(filters),
  });
  return res.data;
}

export async function fetchIncomeSummary(
  month?: number,
  year?: number,
): Promise<IncomeSummary> {
  const res = await api.get<IncomeSummary>("/income/summary", {
    params: { month, year },
  });
  return res.data;
}

export async function createIncome(data: IncomeCreate): Promise<Income> {
  const res = await api.post<Income>("/income/", data);
  return res.data;
}

export async function updateIncome(
  id: number,
  data: IncomeUpdate,
): Promise<Income> {
  const res = await api.put<Income>(`/income/${id}`, data);
  return res.data;
}

export async function deleteIncome(id: number): Promise<void> {
  await api.delete(`/income/${id}`);
}
