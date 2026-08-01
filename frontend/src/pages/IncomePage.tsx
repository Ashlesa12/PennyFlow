import { useState, useEffect, useCallback, useMemo } from "react";
import { Plus, Wallet } from "lucide-react";
import { Button, Card, CardContent, Modal, Toast } from "../components/ui";
import { IncomeCard } from "../components/income/IncomeCard";
import { IncomeForm } from "../components/income/IncomeForm";
import { IncomeSkeleton } from "../components/income/IncomeSkeleton";
import { EmptyState } from "../components/expenses/EmptyState";
import { MonthNavigator } from "../components/month/MonthNavigator";
import { useIncome } from "../hooks/useIncome";
import { useMonth } from "../context/MonthContext";
import { fetchIncomeSummary } from "../api/income";
import { formatCurrency } from "../utils/formatCurrency";
import type { IncomeFilters } from "../api/income";
import type { Income, IncomeCreate, IncomeUpdate, IncomeSummary } from "../types";

export default function IncomePage() {
  const { incomes, isLoading, error, success, load, create, update, remove, clearSuccess, clearError } =
    useIncome();
  const { selectedMonthNumber, selectedYear, monthLabel } = useMonth();
  const [summary, setSummary] = useState<IncomeSummary | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const apiFilters: IncomeFilters = useMemo(
    () => ({
      month: selectedMonthNumber,
      year: selectedYear,
      sort_by: "date",
      order: "desc",
    }),
    [selectedMonthNumber, selectedYear],
  );

  useEffect(() => {
    load(apiFilters);
  }, [load, apiFilters]);

  useEffect(() => {
    let cancelled = false;
    fetchIncomeSummary(selectedMonthNumber, selectedYear)
      .then((data) => {
        if (!cancelled) setSummary(data);
      })
      .catch(() => {
        if (!cancelled) setSummary(null);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedMonthNumber, selectedYear]);

  const refreshSummary = useCallback(
    async (month = selectedMonthNumber, year = selectedYear) => {
      try {
        const data = await fetchIncomeSummary(month, year);
        setSummary(data);
      } catch {
        setSummary(null);
      }
    },
    [selectedMonthNumber, selectedYear],
  );

  const handleAdd = useCallback(
    async (data: IncomeCreate) => {
      const ok = await create(data, apiFilters);
      if (ok) {
        setIsFormOpen(false);
        setSummary((prev) => {
          if (!prev) return prev;
          return { ...prev, total_amount: prev.total_amount + data.amount, total_incomes: prev.total_incomes + 1 };
        });
      }
    },
    [create, apiFilters],
  );

  const handleEdit = useCallback(
    async (data: IncomeUpdate) => {
      if (!editingIncome) return;
      const ok = await update(editingIncome.id, data, apiFilters);
      if (ok) {
        setEditingIncome(null);
        await refreshSummary();
      }
    },
    [update, editingIncome, apiFilters, refreshSummary],
  );

  const handleDelete = useCallback(async () => {
    if (deletingId === null) return;
    const ok = await remove(deletingId, apiFilters);
    if (ok) {
      setDeletingId(null);
      await refreshSummary();
    }
  }, [remove, deletingId, apiFilters, refreshSummary]);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col items-start gap-6">
        <div className="flex w-full flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
              Income
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              Track your earnings for {monthLabel}.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <MonthNavigator />
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="h-4 w-4" />
              Add Income
            </Button>
          </div>
        </div>
      </div>

      <Card>
        <CardContent>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <Wallet className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-text-secondary">
                  Total Income
                </p>
                <p className="text-sm font-semibold text-text-tertiary">
                  {monthLabel}
                </p>
              </div>
            </div>
            <p className="text-2xl font-bold tracking-tight text-accent">
              {summary ? formatCurrency(summary.total_amount) : formatCurrency(0)}
            </p>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <IncomeSkeleton />
      ) : incomes.length === 0 ? (
        <EmptyState
          onAdd={() => setIsFormOpen(true)}
          title={`No income in ${monthLabel}`}
          description="Browse another month or add your first income to get started."
          actionLabel="Add First Income"
        />
      ) : (
        <div className="space-y-3">
          {incomes.map((income) => (
            <IncomeCard
              key={income.id}
              income={income}
              onEdit={setEditingIncome}
              onDelete={setDeletingId}
            />
          ))}
        </div>
      )}

      <Modal
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Add Income"
        description="Create a new income record."
      >
        <IncomeForm
          onSubmit={handleAdd}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>

      <Modal
        open={editingIncome !== null}
        onClose={() => setEditingIncome(null)}
        title="Edit Income"
        description="Update your income details."
      >
        {editingIncome && (
          <IncomeForm
            key={editingIncome.id}
            initialData={{
              title: editingIncome.title,
              amount: Number(editingIncome.amount),
              income_date: editingIncome.income_date,
            }}
            onSubmit={handleEdit}
            onCancel={() => setEditingIncome(null)}
          />
        )}
      </Modal>

      <Modal
        open={deletingId !== null}
        onClose={() => setDeletingId(null)}
        title="Delete Income"
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
