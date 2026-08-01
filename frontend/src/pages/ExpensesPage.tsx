import { useState, useEffect, useCallback, useMemo } from "react";
import { Download, Plus } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { Button, Modal, Toast } from "../components/ui";
import { ExpenseCard } from "../components/expenses/ExpenseCard";
import { ExpenseForm } from "../components/expenses/ExpenseForm";
import { ExpenseFilters } from "../components/expenses/ExpenseFilters";
import { ExpenseSkeleton } from "../components/expenses/ExpenseSkeleton";
import { EmptyState } from "../components/expenses/EmptyState";
import { ExportModal } from "../components/export/ExportModal";
import { MonthNavigator } from "../components/month/MonthNavigator";
import { useExpenses } from "../hooks/useExpenses";
import { useCategories } from "../hooks/useCategories";
import { useMonth } from "../context/MonthContext";
import type { ExpenseFilters as ApiExpenseFilters } from "../api/expenses";
import type { Expense, ExpenseCreate, ExpenseUpdate } from "../types";

const DEFAULT_FILTERS = {
  search: "",
  category_id: "",
  start_date: "",
  end_date: "",
  sort: "date_desc",
};

export default function ExpensesPage() {
  const { expenses, isLoading, error, success, load, create, update, remove, clearSuccess, clearError } = useExpenses();
  const { categories, refetch: refetchCategories } = useCategories();
  const { selectedMonthNumber, selectedYear, monthLabel } = useMonth();
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get("q") ?? "";

  const [filters, setFilters] = useState(() => ({
    ...DEFAULT_FILTERS,
    search: queryParam,
  }));
  const [prevQuery, setPrevQuery] = useState(queryParam);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [exportToast, setExportToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const notifyExport = useCallback(
    (message: string, type: "success" | "error") =>
      setExportToast({ message, type }),
    [],
  );
  const dismissExportToast = useCallback(() => setExportToast(null), []);

  if (prevQuery !== queryParam) {
    setPrevQuery(queryParam);
    setFilters((prev) => ({ ...prev, search: queryParam }));
  }

  const apiFilters: ApiExpenseFilters = useMemo(() => {
    const [sort_by, order] = filters.sort.split("_");
    return {
      category_id: filters.category_id
        ? Number(filters.category_id)
        : undefined,
      start_date: filters.start_date || undefined,
      end_date: filters.end_date || undefined,
      month: selectedMonthNumber,
      year: selectedYear,
      sort_by,
      order: order === "asc" ? "asc" : "desc",
    };
  }, [filters, selectedMonthNumber, selectedYear]);

  useEffect(() => {
    load(apiFilters);
    refetchCategories();
  }, [load, apiFilters, refetchCategories]);

  const hasActiveFilters =
    filters.search !== "" ||
    filters.category_id !== "" ||
    filters.start_date !== "" ||
    filters.end_date !== "" ||
    filters.sort !== "date_desc";

  const filteredExpenses = expenses.filter((expense) => {
    if (
      filters.search &&
      !expense.title.toLowerCase().includes(filters.search.toLowerCase())
    )
      return false;
    if (
      filters.category_id &&
      String(expense.category_id) !== filters.category_id
    )
      return false;
    if (filters.start_date && expense.expense_date < filters.start_date)
      return false;
    if (filters.end_date && expense.expense_date > filters.end_date)
      return false;
    return true;
  });

  const sortMap: Record<string, (a: Expense, b: Expense) => number> = {
    date_desc: (a, b) => b.expense_date.localeCompare(a.expense_date),
    date_asc: (a, b) => a.expense_date.localeCompare(b.expense_date),
    amount_desc: (a, b) => Number(b.amount) - Number(a.amount),
    amount_asc: (a, b) => Number(a.amount) - Number(b.amount),
  };

  const sortedExpenses = [...filteredExpenses].sort(
    sortMap[filters.sort] ?? sortMap.date_desc,
  );

  const handleAdd = useCallback(async (data: ExpenseCreate) => {
    const ok = await create(data, apiFilters);
    if (ok) setIsFormOpen(false);
  }, [create, apiFilters]);

  const handleEdit = useCallback(async (data: ExpenseUpdate) => {
    if (!editingExpense) return;
    const ok = await update(editingExpense.id, data, apiFilters);
    if (ok) setEditingExpense(null);
  }, [update, editingExpense, apiFilters]);

  const handleDelete = useCallback(async () => {
    if (deletingId === null) return;
    await remove(deletingId, apiFilters);
    setDeletingId(null);
  }, [remove, deletingId, apiFilters]);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col items-start gap-6">
        <div className="flex w-full flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
              Expenses
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              Track and manage your transactions for {monthLabel}.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <MonthNavigator />
            <Button
              variant="secondary"
              onClick={() => setIsExportOpen(true)}
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="h-4 w-4" />
              Add Expense
            </Button>
          </div>
        </div>
      </div>

      <ExpenseFilters
        values={filters}
        categories={categories}
        onChange={setFilters}
        onReset={() => setFilters(DEFAULT_FILTERS)}
        hasActiveFilters={hasActiveFilters}
      />

      {isLoading ? (
        <ExpenseSkeleton />
      ) : sortedExpenses.length === 0 ? (
        <EmptyState
          hasFilters={hasActiveFilters}
          onAdd={() => setIsFormOpen(true)}
          title={
            hasActiveFilters
              ? "No matching expenses"
              : `No expenses in ${monthLabel}`
          }
          description={
            hasActiveFilters
              ? undefined
              : "Browse another month or add your first expense to get started."
          }
        />
      ) : (
        <div className="space-y-3">
          {sortedExpenses.map((expense) => (
            <ExpenseCard
              key={expense.id}
              expense={expense}
              onEdit={setEditingExpense}
              onDelete={setDeletingId}
            />
          ))}
        </div>
      )}

      <Modal
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Add Expense"
        description="Create a new expense record."
      >
        <ExpenseForm
          categories={categories}
          onSubmit={handleAdd}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>

      <Modal
        open={editingExpense !== null}
        onClose={() => setEditingExpense(null)}
        title="Edit Expense"
        description="Update your expense details."
      >
        {editingExpense && (
          <ExpenseForm
            key={editingExpense.id}
            categories={categories}
            initialData={{
              title: editingExpense.title,
              amount: Number(editingExpense.amount),
              expense_date: editingExpense.expense_date,
              category_id: editingExpense.category_id,
            }}
            onSubmit={handleEdit}
            onCancel={() => setEditingExpense(null)}
          />
        )}
      </Modal>

      <Modal
        open={deletingId !== null}
        onClose={() => setDeletingId(null)}
        title="Delete Expense"
        description="This action cannot be undone."
      >
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setDeletingId(null)}>
            Cancel
          </Button>
          <Button onClick={handleDelete} variant="danger">
            Delete
          </Button>
        </div>
      </Modal>

      <ExportModal
        open={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        notify={notifyExport}
      />

      <Toast
        message={success}
        type="success"
        visible={success !== ""}
        onDismiss={clearSuccess}
      />
      <Toast
        message={error}
        type="error"
        visible={error !== ""}
        onDismiss={clearError}
      />
      <Toast
        message={exportToast?.message ?? ""}
        type={exportToast?.type ?? "success"}
        visible={exportToast !== null}
        onDismiss={dismissExportToast}
      />
    </div>
  );
}
