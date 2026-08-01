import { useState, useCallback, useRef } from "react";
import type { Income, IncomeCreate, IncomeUpdate } from "../types";
import {
  fetchIncomes as apiFetchIncomes,
  createIncome as apiCreateIncome,
  updateIncome as apiUpdateIncome,
  deleteIncome as apiDeleteIncome,
  type IncomeFilters,
} from "../api/income";

export function useIncome() {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const abortRef = useRef(false);
  const prevRef = useRef<Income[]>([]);

  const load = useCallback(async (filters?: IncomeFilters) => {
    abortRef.current = false;
    setIsLoading(true);
    setError("");
    try {
      const data = await apiFetchIncomes(filters);
      if (!abortRef.current) setIncomes(data);
    } catch {
      if (!abortRef.current) setError("Failed to load income");
    } finally {
      if (!abortRef.current) setIsLoading(false);
    }
  }, []);

  const create = useCallback(
    async (data: IncomeCreate, filters?: IncomeFilters) => {
      setError("");
      setSuccess("");

      const optimistic: Income = {
        id: -Date.now(),
        title: data.title,
        amount: data.amount,
        income_date: data.income_date,
        user_id: 0,
      };

      prevRef.current = incomes;
      setIncomes((prev) => [optimistic, ...prev]);

      try {
        await apiCreateIncome(data);
        setSuccess("Income added successfully");
        await load(filters);
        return true;
      } catch {
        setIncomes(prevRef.current);
        setError("Failed to create income");
        return false;
      }
    },
    [load, incomes],
  );

  const update = useCallback(
    async (id: number, data: IncomeUpdate, filters?: IncomeFilters) => {
      setError("");
      setSuccess("");

      prevRef.current = incomes;
      setIncomes((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...data } : item)),
      );

      try {
        await apiUpdateIncome(id, data);
        setSuccess("Income updated successfully");
        await load(filters);
        return true;
      } catch {
        setIncomes(prevRef.current);
        setError("Failed to update income");
        return false;
      }
    },
    [load, incomes],
  );

  const remove = useCallback(
    async (id: number, filters?: IncomeFilters) => {
      setError("");
      setSuccess("");

      prevRef.current = incomes;
      setIncomes((prev) => prev.filter((item) => item.id !== id));

      try {
        await apiDeleteIncome(id);
        setSuccess("Income deleted successfully");
        await load(filters);
        return true;
      } catch {
        setIncomes(prevRef.current);
        setError("Failed to delete income");
        return false;
      }
    },
    [load, incomes],
  );

  const clearSuccess = useCallback(() => setSuccess(""), []);
  const clearError = useCallback(() => setError(""), []);

  return {
    incomes,
    isLoading,
    error,
    success,
    load,
    create,
    update,
    remove,
    clearSuccess,
    clearError,
  };
}
