import { useState, useCallback, useRef } from "react";
import type { Expense, ExpenseCreate, ExpenseUpdate } from "../types";
import {
  fetchExpenses as apiFetchExpenses,
  createExpense as apiCreateExpense,
  updateExpense as apiUpdateExpense,
  deleteExpense as apiDeleteExpense,
  type ExpenseFilters,
} from "../api/expenses";

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const abortRef = useRef(false);

  const load = useCallback(async (filters?: ExpenseFilters) => {
    abortRef.current = false;
    setIsLoading(true);
    setError("");
    try {
      const data = await apiFetchExpenses(filters);
      if (!abortRef.current) setExpenses(data);
    } catch {
      if (!abortRef.current) setError("Failed to load expenses");
    } finally {
      if (!abortRef.current) setIsLoading(false);
    }
  }, []);

  const create = useCallback(
    async (data: ExpenseCreate, filters?: ExpenseFilters) => {
      setError("");
      setSuccess("");
      try {
        await apiCreateExpense(data);
        setSuccess("Expense added successfully");
        await load(filters);
        return true;
      } catch {
        setError("Failed to create expense");
        return false;
      }
    },
    [load],
  );

  const update = useCallback(
    async (id: number, data: ExpenseUpdate, filters?: ExpenseFilters) => {
      setError("");
      setSuccess("");
      try {
        await apiUpdateExpense(id, data);
        setSuccess("Expense updated successfully");
        await load(filters);
        return true;
      } catch {
        setError("Failed to update expense");
        return false;
      }
    },
    [load],
  );

  const remove = useCallback(
    async (id: number, filters?: ExpenseFilters) => {
      setError("");
      setSuccess("");
      try {
        await apiDeleteExpense(id);
        setSuccess("Expense deleted successfully");
        await load(filters);
        return true;
      } catch {
        setError("Failed to delete expense");
        return false;
      }
    },
    [load],
  );

  const clearSuccess = useCallback(() => setSuccess(""), []);
  const clearError = useCallback(() => setError(""), []);

  return {
    expenses,
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
