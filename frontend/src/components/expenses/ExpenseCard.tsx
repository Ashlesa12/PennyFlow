import { Pencil, Trash2 } from "lucide-react";
import { Button } from "../ui";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { getCategoryName } from "../../constants/categories";
import type { Expense } from "../../types";
import { getCategoryIcon } from "../../constants/categories";

interface ExpenseCardProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (id: number) => void;
}

export function ExpenseCard({ expense, onEdit, onDelete }: ExpenseCardProps) {
  const Icon = getCategoryIcon(expense.category_id);

  return (
    <div className="group rounded-3xl border border-white/40 bg-white/70 p-5 shadow-lg shadow-black/[0.02] backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
          <Icon className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-neutral-900">
            {expense.title}
          </p>
          <p className="mt-0.5 text-xs text-neutral-500">
            {getCategoryName(expense.category_id)}
          </p>
        </div>

        <div className="hidden text-right sm:block">
          <p className="whitespace-nowrap text-sm font-semibold text-neutral-900">
            -{formatCurrency(Number(expense.amount))}
          </p>
          <p className="mt-0.5 whitespace-nowrap text-xs text-neutral-400">
            {formatDate(expense.expense_date)}
          </p>
        </div>

        <div className="flex gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(expense)}
            aria-label="Edit expense"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(expense.id)}
            aria-label="Delete expense"
            className="text-danger/70 hover:text-danger"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between sm:hidden">
        <span className="text-xs text-neutral-400">
          {formatDate(expense.expense_date)}
        </span>
        <span className="text-sm font-semibold text-neutral-900">
          -{formatCurrency(Number(expense.amount))}
        </span>
      </div>
    </div>
  );
}
