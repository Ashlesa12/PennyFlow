import { useState, useEffect, useCallback, useMemo } from "react";
import { Plus } from "lucide-react";
import { Button, Toast } from "../components/ui";
import { RecurringCard } from "../components/recurring/RecurringCard";
import { RecurringFormModal } from "../components/recurring/RecurringFormModal";
import { RecurringDeleteModal } from "../components/recurring/RecurringDeleteModal";
import { RecurringFilters } from "../components/recurring/RecurringFilters";
import { RecurringSkeleton } from "../components/recurring/RecurringSkeleton";
import { RecurringEmptyState } from "../components/recurring/RecurringEmptyState";
import type { RecurringFilterValues } from "../components/recurring/RecurringFilters";
import type { RecurringAction } from "../components/recurring/RecurringCard";
import { useRecurring } from "../hooks/useRecurring";
import { useCategories } from "../hooks/useCategories";
import type { RecurringExpense, RecurringFrequency } from "../types";

const DEFAULT_FILTERS: RecurringFilterValues = {
  search: "",
  frequency: "",
  status: "",
  sort: "due",
};

interface FormValues {
  title: string;
  amount: number;
  category_id: number;
  frequency: RecurringFrequency;
  start_date: string;
}

export default function RecurringPage() {
  const { items, isLoading, error, success, load, create, update, complete, toggle, remove, clearSuccess, clearError } =
    useRecurring();
  const { categories, refetch: refetchCategories } = useCategories();

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RecurringExpense | null>(null);
  const [deletingItem, setDeletingItem] = useState<RecurringExpense | null>(null);
  const [pending, setPending] = useState<{
    type: RecurringAction;
    id: number;
  } | null>(null);

  useEffect(() => {
    load();
    refetchCategories();
  }, [load, refetchCategories]);

  const hasActiveFilters =
    filters.search !== "" ||
    filters.frequency !== "" ||
    filters.status !== "" ||
    filters.sort !== "due";

  const filteredItems = useMemo(() => {
    const result = items.filter((item) => {
      if (
        filters.search &&
        !item.title.toLowerCase().includes(filters.search.toLowerCase())
      )
        return false;
      if (filters.frequency && item.frequency !== filters.frequency)
        return false;
      if (filters.status === "active" && !item.is_active) return false;
      if (filters.status === "paused" && item.is_active) return false;
      return true;
    });

    const sortMap: Record<string, (a: RecurringExpense, b: RecurringExpense) => number> = {
      due: (a, b) => a.next_due_date.localeCompare(b.next_due_date),
      due_desc: (a, b) => b.next_due_date.localeCompare(a.next_due_date),
      amount_desc: (a, b) => Number(b.amount) - Number(a.amount),
      amount_asc: (a, b) => Number(a.amount) - Number(b.amount),
      title: (a, b) => a.title.localeCompare(b.title),
    };

    return [...result].sort(sortMap[filters.sort] ?? sortMap.due);
  }, [items, filters]);

  const handleAdd = useCallback(
    async (data: FormValues) => {
      const ok = await create(data);
      if (ok) setIsFormOpen(false);
      return ok;
    },
    [create],
  );

  const handleEdit = useCallback(
    async (data: FormValues) => {
      if (!editingItem) return false;
      const ok = await update(editingItem.id, data);
      if (ok) setEditingItem(null);
      return ok;
    },
    [update, editingItem],
  );

  const handleDeleteRequest = useCallback(
    (id: number) => {
      const item = items.find((i) => i.id === id);
      if (item) setDeletingItem(item);
    },
    [items],
  );

  const handleComplete = useCallback(
    async (id: number) => {
      setPending({ type: "complete", id });
      await complete(id);
      setPending(null);
    },
    [complete],
  );

  const handleToggle = useCallback(
    async (id: number) => {
      setPending({ type: "toggle", id });
      await toggle(id);
      setPending(null);
    },
    [toggle],
  );

  const handleDelete = useCallback(async () => {
    if (!deletingItem) return;
    setPending({ type: "delete", id: deletingItem.id });
    const ok = await remove(deletingItem.id);
    setPending(null);
    if (ok) setDeletingItem(null);
  }, [remove, deletingItem]);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex w-full items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
            Recurring Expenses
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Track subscriptions and bills that repeat automatically.
          </p>
        </div>

        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Recurring
        </Button>
      </div>

      <RecurringFilters
        values={filters}
        onChange={setFilters}
        onReset={() => setFilters(DEFAULT_FILTERS)}
        hasActiveFilters={hasActiveFilters}
      />

      {isLoading ? (
        <RecurringSkeleton />
      ) : filteredItems.length === 0 ? (
        <RecurringEmptyState
          hasFilters={hasActiveFilters}
          onAdd={() => setIsFormOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <RecurringCard
              key={item.id}
              item={item}
              pending={pending?.id === item.id ? pending.type : null}
              onComplete={handleComplete}
              onToggle={handleToggle}
              onEdit={setEditingItem}
              onDelete={handleDeleteRequest}
            />
          ))}
        </div>
      )}

      <RecurringFormModal
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        categories={categories}
        onSubmit={handleAdd}
      />

      <RecurringFormModal
        open={editingItem !== null}
        onClose={() => setEditingItem(null)}
        categories={categories}
        initial={editingItem}
        onSubmit={handleEdit}
      />

      <RecurringDeleteModal
        open={deletingItem !== null}
        onClose={() => setDeletingItem(null)}
        title={deletingItem?.title}
        isDeleting={pending?.type === "delete"}
        onConfirm={handleDelete}
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
    </div>
  );
}
