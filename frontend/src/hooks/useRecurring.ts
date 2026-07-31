import { useState, useCallback, useRef } from "react";
import type { RecurringExpense, RecurringCreate, RecurringUpdate } from "../types";
import {
  fetchRecurringExpenses as apiFetchRecurringExpenses,
  createRecurringExpense as apiCreateRecurringExpense,
  updateRecurringExpense as apiUpdateRecurringExpense,
  completeRecurringExpense as apiCompleteRecurringExpense,
  toggleRecurringExpense as apiToggleRecurringExpense,
  deleteRecurringExpense as apiDeleteRecurringExpense,
  type RecurringFilters,
} from "../api/recurring";

export function useRecurring() {
  const [items, setItems] = useState<RecurringExpense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const abortRef = useRef(false);
  const prevRef = useRef<RecurringExpense[]>([]);

  const load = useCallback(async (filters?: RecurringFilters) => {
    abortRef.current = false;
    setIsLoading(true);
    setError("");
    try {
      const data = await apiFetchRecurringExpenses(filters);
      if (!abortRef.current) setItems(data);
    } catch {
      if (!abortRef.current) setError("Failed to load recurring expenses");
    } finally {
      if (!abortRef.current) setIsLoading(false);
    }
  }, []);

  const create = useCallback(
    async (data: RecurringCreate, filters?: RecurringFilters) => {
      setError("");
      setSuccess("");
      prevRef.current = items;
      try {
        await apiCreateRecurringExpense(data);
        setSuccess("Recurring expense added");
        await load(filters);
        return true;
      } catch {
        setItems(prevRef.current);
        setError("Failed to create recurring expense");
        return false;
      }
    },
    [load, items],
  );

  const update = useCallback(
    async (
      id: number,
      data: RecurringUpdate,
      filters?: RecurringFilters,
    ) => {
      setError("");
      setSuccess("");
      prevRef.current = items;
      try {
        await apiUpdateRecurringExpense(id, data);
        setSuccess("Recurring expense updated");
        await load(filters);
        return true;
      } catch {
        setItems(prevRef.current);
        setError("Failed to update recurring expense");
        return false;
      }
    },
    [load, items],
  );

  const complete = useCallback(
    async (id: number) => {
      setError("");
      setSuccess("");
      prevRef.current = items;
      try {
        const updated = await apiCompleteRecurringExpense(id);
        setItems((prev) =>
          prev.map((item) => (item.id === id ? updated : item)),
        );
        setSuccess("Occurrence completed, expense added");
        return true;
      } catch {
        setItems(prevRef.current);
        setError("Failed to complete occurrence");
        return false;
      }
    },
    [items],
  );

  const toggle = useCallback(
    async (id: number) => {
      setError("");
      setSuccess("");
      prevRef.current = items;
      try {
        const updated = await apiToggleRecurringExpense(id);
        setItems((prev) =>
          prev.map((item) => (item.id === id ? updated : item)),
        );
        setSuccess(
          updated.is_active
            ? "Recurring expense resumed"
            : "Recurring expense paused",
        );
        return true;
      } catch {
        setItems(prevRef.current);
        setError("Failed to update recurring expense");
        return false;
      }
    },
    [items],
  );

  const remove = useCallback(
    async (id: number) => {
      setError("");
      setSuccess("");
      prevRef.current = items;
      setItems((prev) => prev.filter((item) => item.id !== id));
      try {
        await apiDeleteRecurringExpense(id);
        setSuccess("Recurring expense deleted");
        return true;
      } catch {
        setItems(prevRef.current);
        setError("Failed to delete recurring expense");
        return false;
      }
    },
    [items],
  );

  const clearSuccess = useCallback(() => setSuccess(""), []);
  const clearError = useCallback(() => setError(""), []);

  return {
    items,
    isLoading,
    error,
    success,
    load,
    create,
    update,
    complete,
    toggle,
    remove,
    clearSuccess,
    clearError,
  };
}
