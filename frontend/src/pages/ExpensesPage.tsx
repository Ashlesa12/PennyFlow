import { useEffect, useMemo, useState, useCallback } from "react";
import { Plus, X, CheckCircle } from "lucide-react";
import { useExpenses } from "../hooks/useExpenses";
import { ExpenseList } from "../components/expenses/ExpenseList";
import { ExpenseFilters } from "../components/expenses/ExpenseFilters";
import { ExpenseModal } from "../components/expenses/ExpenseModal";
import { DeleteConfirmationModal } from "../components/expenses/DeleteConfirmationModal";
import { Button } from "../components/ui";
import type { Expense } from "../types";
import type { ExpenseFilters as FilterParams } from "../api/expenses";
import { getCategoryName } from "../constants/categories";

interface FilterValues {
  search: string;
  category_id: string;
  start_date: string;
  end_date: string;
  sort: string;
}

const defaultFilters: FilterValues = {
  search: "",
  category_id: "",
  start_date: "",
  end_date: "",
  sort: "date_desc",
};

function filtersToParams(f: FilterValues): FilterParams {
  const params: FilterParams = {};
  if (f.category_id) params.category_id = Number(f.category_id);
  if (f.start_date) params.start_date = f.start_date;
  if (f.end_date) params.end_date = f.end_date;
  const [sort_by, order] = f.sort.split("_") as [string, string];
  params.sort_by = sort_by;
  params.order = order;
  return params;
}

export default function ExpensesPage() {
  const {
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
  } = useExpenses();

  const [filters, setFilters] = useState<FilterValues>(defaultFilters);

  // Debounced params for API (skip search — that's client-side)
  const apiParams = useMemo(() => {
    const { search: _, ...rest } = filters;
    return filtersToParams(rest);
  }, [filters]);

  useEffect(() => {
    load(apiParams);
  }, [load, apiParams]);

  // Client-side search (title + category name)
  const searchQuery = filters.search.toLowerCase().trim();

  const displayExpenses = useMemo(() => {
    if (!searchQuery) return expenses;
    return expenses.filter((e) => {
      const matchesTitle = e.title.toLowerCase().includes(searchQuery);
      const matchesCategory = getCategoryName(e.category_id)
        .toLowerCase()
        .includes(searchQuery);
      return matchesTitle || matchesCategory;
    });
  }, [expenses, searchQuery]);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [successVisible, setSuccessVisible] = useState(false);

  // Show success toast when success message changes
  useEffect(() => {
    if (success) {
      setSuccessVisible(true);
      const timer = setTimeout(() => {
        setSuccessVisible(false);
        clearSuccess();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, clearSuccess]);

  const openCreate = useCallback(() => {
    setModalMode("create");
    setEditingExpense(null);
    setModalOpen(true);
  }, []);

  const openEdit = useCallback((expense: Expense) => {
    setModalMode("edit");
    setEditingExpense(expense);
    setModalOpen(true);
  }, []);

  const openDelete = useCallback((id: number) => {
    setDeletingId(id);
    setDeleteOpen(true);
  }, []);

  const handleSave = useCallback(
    async (data: unknown) => {
      if (modalMode === "create") {
        return create(data as Parameters<typeof create>[0], apiParams);
      }
      if (editingExpense) {
        return update(editingExpense.id, data as Parameters<typeof update>[1], apiParams);
      }
      return false;
    },
    [modalMode, editingExpense, create, update, apiParams],
  );

  const handleDelete = useCallback(async () => {
    if (deletingId === null) return false;
    return remove(deletingId, apiParams);
  }, [deletingId, remove, apiParams]);

  const hasActiveFilters = useMemo(
    () =>
      filters.category_id !== "" ||
      filters.start_date !== "" ||
      filters.end_date !== "" ||
      filters.sort !== "date_desc",
    [filters],
  );

  const handleReset = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  // Auto-hide error after 5s
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => clearError(), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* ── Success Toast ───────────────────── */}
      {successVisible && (
        <div className="fixed right-6 top-6 z-50 flex animate-[slideIn_0.3s_ease-out] items-center gap-3 rounded-2xl border border-emerald-200/60 bg-emerald-50/90 px-5 py-3 text-sm font-medium text-emerald-800 shadow-lg backdrop-blur-xl">
          <CheckCircle className="h-5 w-5 shrink-0 text-emerald-600" />
          {success}
          <button onClick={() => { setSuccessVisible(false); clearSuccess(); }}>
            <X className="h-4 w-4 ml-2 shrink-0 text-emerald-600/60 hover:text-emerald-600" />
          </button>
        </div>
      )}

      {/* ── Header ─────────────────────────── */}
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Expenses
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Manage your daily spending.
          </p>
        </div>

        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          <span>Add Expense</span>
        </Button>
      </header>

      {/* ── Error Alert ────────────────────── */}
      {error && (
        <div className="flex items-center justify-between rounded-xl bg-danger/10 px-5 py-3 text-sm font-medium text-danger">
          <span>{error}</span>
          <button onClick={clearError}>
            <X className="h-4 w-4 shrink-0" />
          </button>
        </div>
      )}

      {/* ── Filters ────────────────────────── */}
      <ExpenseFilters
        values={filters}
        onChange={setFilters}
        onReset={handleReset}
        hasActiveFilters={hasActiveFilters}
      />

      {/* ── List ───────────────────────────── */}
      <ExpenseList
        expenses={displayExpenses}
        isLoading={isLoading}
        hasFilters={hasActiveFilters || searchQuery !== ""}
        onEdit={openEdit}
        onDelete={openDelete}
        onAdd={openCreate}
      />

      {/* ── Create / Edit Modal ────────────── */}
      <ExpenseModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        mode={modalMode}
        expense={editingExpense}
      />

      {/* ── Delete Confirmation ────────────── */}
      <DeleteConfirmationModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
