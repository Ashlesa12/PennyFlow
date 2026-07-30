import type { Expense } from "../../types";
import { ExpenseCard } from "./ExpenseCard";
import { ExpenseSkeleton } from "./ExpenseSkeleton";
import { EmptyState } from "./EmptyState";

interface ExpenseListProps {
  expenses: Expense[];
  isLoading: boolean;
  hasFilters: boolean;
  onEdit: (expense: Expense) => void;
  onDelete: (id: number) => void;
  onAdd: () => void;
}

export function ExpenseList({
  expenses,
  isLoading,
  hasFilters,
  onEdit,
  onDelete,
  onAdd,
}: ExpenseListProps) {
  if (isLoading) {
    return <ExpenseSkeleton />;
  }

  if (expenses.length === 0) {
    return <EmptyState hasFilters={hasFilters} onAdd={onAdd} />;
  }

  return (
    <div className="space-y-3">
      {expenses.map((expense) => (
        <ExpenseCard
          key={expense.id}
          expense={expense}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
