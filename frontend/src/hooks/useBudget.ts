import { useState, useCallback, useRef } from "react";
import type { BudgetProgress, BudgetCreate } from "../types";
import {
  fetchBudget as apiFetchBudget,
  createBudget as apiCreateBudget,
  updateBudget as apiUpdateBudget,
  deleteBudget as apiDeleteBudget,
  currentMonth,
} from "../api/budgets";

export function useBudget() {
  const [budget, setBudget] = useState<BudgetProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const abortRef = useRef(false);

  const load = useCallback(async (month?: string) => {
    abortRef.current = false;
    setIsLoading(true);
    setError("");
    try {
      const data = await apiFetchBudget(month ?? currentMonth());
      if (!abortRef.current) setBudget(data);
    } catch (err) {
      if (abortRef.current) return;
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 404) {
        setBudget(null);
      } else {
        setError("Failed to load budget");
      }
    } finally {
      if (!abortRef.current) setIsLoading(false);
    }
  }, []);

  const save = useCallback(
    async (data: BudgetCreate) => {
      setError("");
      setSuccess("");
      try {
        const saved = budget
          ? await apiUpdateBudget(budget.id, { amount: data.amount })
          : await apiCreateBudget(data);
        setBudget(saved);
        setSuccess(budget ? "Budget updated successfully" : "Budget set successfully");
        return true;
      } catch {
        setError("Failed to save budget");
        return false;
      }
    },
    [budget],
  );

  const remove = useCallback(async () => {
    if (!budget) return false;
    setError("");
    setSuccess("");
    try {
      await apiDeleteBudget(budget.id);
      setBudget(null);
      setSuccess("Budget removed");
      return true;
    } catch {
      setError("Failed to remove budget");
      return false;
    }
  }, [budget]);

  const clearSuccess = useCallback(() => setSuccess(""), []);
  const clearError = useCallback(() => setError(""), []);

  return {
    budget,
    isLoading,
    error,
    success,
    load,
    save,
    remove,
    clearSuccess,
    clearError,
  };
}
