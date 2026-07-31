import { Check, Pause, Play, Pencil, Trash2 } from "lucide-react";
import { Button } from "../ui";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { dueLabel } from "../../utils/dueLabel";
import { getCategoryColor, getCategoryName, CATEGORY_ICON_MAP } from "../../constants/categories";
import { cn } from "../../utils/cn";
import type { RecurringExpense } from "../../types";

export type RecurringAction = "complete" | "toggle" | "delete" | "edit";

interface RecurringCardProps {
  item: RecurringExpense;
  pending?: RecurringAction | null;
  onComplete: (id: number) => void;
  onToggle: (id: number) => void;
  onEdit: (item: RecurringExpense) => void;
  onDelete: (id: number) => void;
}

export function RecurringCard({
  item,
  pending,
  onComplete,
  onToggle,
  onEdit,
  onDelete,
}: RecurringCardProps) {
  const categoryName = getCategoryName(item.category_id);
  const color = getCategoryColor(categoryName);
  const Icon = CATEGORY_ICON_MAP[item.category_id];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const nextDueTime = new Date(`${item.next_due_date}T00:00:00`).getTime();
  const isOverdue = item.is_active && nextDueTime < today.getTime();
  const isDue = item.is_active && nextDueTime <= today.getTime();

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-border-strong bg-surface-elevated p-5 shadow-lg shadow-black/[0.02] backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-black/[0.04]",
        !item.is_active && "opacity-70",
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(600px circle at 50% 0%, rgba(16,185,129,0.04) 0%, transparent 60%)",
        }}
      />

      <div className="relative">
        <div className="flex items-center gap-4">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110"
            style={{
              backgroundColor: `${color}1A`,
              color,
            }}
          >
            <Icon className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-medium text-text-primary">
                {item.title}
              </p>
              <span className="shrink-0 rounded-full bg-neutral-900/5 px-2 py-0.5 text-[11px] font-medium text-text-secondary">
                {item.frequency}
              </span>
            </div>
            <p className="mt-0.5 truncate text-xs text-text-secondary">
              {categoryName}
              <span className="mx-1.5 text-text-tertiary">·</span>
              <span
                className={cn(
                  isOverdue ? "font-medium text-warning" : "text-text-tertiary",
                )}
              >
                {isDue
                  ? dueLabel(item.next_due_date)
                  : item.is_active
                    ? `Next due: ${formatDate(item.next_due_date)}`
                    : dueLabel(item.next_due_date)}
              </span>
            </p>
          </div>

          <div className="shrink-0 text-right">
            <p className="whitespace-nowrap text-base font-bold tracking-tight text-text-primary">
              {formatCurrency(Number(item.amount))}
            </p>
            <span
              className={cn(
                "mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
                item.is_active
                  ? "bg-emerald-500/10 text-emerald-700"
                  : "bg-neutral-900/5 text-text-secondary",
              )}
            >
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  item.is_active ? "bg-emerald-500" : "bg-neutral-400",
                )}
              />
              {item.is_active ? "Active" : "Paused"}
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border-strong pt-3.5">
          <p className="text-xs text-text-tertiary">
            First due {formatDate(item.start_date)}
          </p>

          <div className="flex gap-1">
            {isDue && (
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-emerald-700 hover:bg-emerald-500/10"
                onClick={() => onComplete(item.id)}
                isLoading={pending === "complete"}
                disabled={pending !== null && pending !== "complete"}
                aria-label={`Mark ${item.title} as completed`}
              >
                <Check className="h-4 w-4" />
                <span className="hidden sm:inline">Done</span>
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggle(item.id)}
              isLoading={pending === "toggle"}
              disabled={pending !== null && pending !== "toggle"}
              aria-label={item.is_active ? "Pause" : "Resume"}
            >
              {item.is_active ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(item)}
              disabled={pending !== null && pending !== "edit"}
              aria-label="Edit recurring expense"
            >
              <Pencil className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(item.id)}
              isLoading={pending === "delete"}
              disabled={pending !== null && pending !== "delete"}
              aria-label="Delete recurring expense"
              className="text-danger/70 hover:text-danger"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
