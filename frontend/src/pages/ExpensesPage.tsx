import { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import { Button, Modal, Toast } from "../components/ui";
import { ExpenseCard } from "../components/expenses/ExpenseCard";
import { ExpenseForm } from "../components/expenses/ExpenseForm";
import { ExpenseFilters } from "../components/expenses/ExpenseFilters";
import { ExpenseSkeleton } from "../components/expenses/ExpenseSkeleton";
import { EmptyState } from "../components/expenses/EmptyState";
import { useExpenses } from "../hooks/useExpenses";
import { useCategories } from "../hooks/useCategories";
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
  const { categories } = useCategories();

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    load();
  }, [load]);

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
    const ok = await create(data, filters);
    if (ok) setIsFormOpen(false);
  }, [create, filters]);

  const handleEdit = useCallback(async (data: ExpenseUpdate) => {
    if (!editingExpense) return;
    const ok = await update(editingExpense.id, data, filters);
    if (ok) setEditingExpense(null);
  }, [update, editingExpense, filters]);

  const handleDelete = useCallback(async () => {
    if (deletingId === null) return;
    await remove(deletingId, filters);
    setDeletingId(null);
  }, [remove, deletingId, filters]);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col items-start gap-6">
        <div className="flex w-full items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
              Expenses
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              Track and manage all your transactions.
            </p>
          </div>

          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Expense
          </Button>
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
    </div>
  );
}
