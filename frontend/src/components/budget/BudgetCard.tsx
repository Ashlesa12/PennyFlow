import { useEffect, useState } from "react";
import { Target, Plus, Pencil } from "lucide-react";
import { Button, Card, Toast } from "../ui";
import { BudgetModal } from "./BudgetModal";
import { BudgetSkeleton } from "./BudgetSkeleton";
import { useBudget } from "../../hooks/useBudget";
import { formatCurrency } from "../../utils/formatCurrency";
import { currentMonth } from "../../api/budgets";
import { cn } from "../../utils/cn";

const MONTH_LABEL = new Intl.DateTimeFormat(undefined, {
  month: "long",
  year: "numeric",
});

function monthLabel(month: string): string {
  const year = Number(month.slice(0, 4));
  const monthIndex = Number(month.slice(5, 7)) - 1;
  return MONTH_LABEL.format(new Date(year, monthIndex, 1));
}

export function BudgetCard() {
  const { budget, isLoading, error, success, load, save, clearSuccess, clearError } =
    useBudget();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    load();
  }, [load]);

  if (isLoading) {
    return <BudgetSkeleton />;
  }

  if (!budget) {
    return (
      <>
        <Card variant="dashed">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">Monthly Budget</p>
                <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                  No budget set for {monthLabel(currentMonth())} yet. Set a goal to
                  keep your spending on track.
                </p>
              </div>
            </div>
            <Button onClick={() => setIsModalOpen(true)} className="shrink-0">
              <Plus className="h-4 w-4" />
              Set a Budget
            </Button>
          </div>
        </Card>

        <BudgetModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          month={currentMonth()}
          onSubmit={save}
        />
      </>
    );
  }

  const percentage = budget.percentage;
  const isOver = percentage >= 100;
  const isClose = percentage >= 80;
  const usedPercent = Math.round(percentage);
  const barWidth = Math.min(percentage, 100);
  const statusColor = isOver
    ? "var(--color-danger)"
    : isClose
      ? "var(--color-warning)"
      : "var(--color-accent)";
  const statusText = isOver
    ? "text-danger"
    : isClose
      ? "text-warning"
      : "text-accent";

  const remainingStat =
    budget.remaining >= 0
      ? { label: "Left", value: formatCurrency(budget.remaining), over: false }
      : {
          label: "Over",
          value: formatCurrency(Math.abs(budget.remaining)),
          over: true,
        };

  const statusMessage = isOver
    ? `${formatCurrency(Math.abs(budget.remaining))} over budget`
    : isClose
      ? "Close to your monthly budget"
      : "You're on track";

  const statusDetail = isOver
    ? `Budget used up for ${monthLabel(budget.month)}`
    : `${formatCurrency(budget.remaining)} left this month`;

  return (
    <>
      <Card className="hover-elevate">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">Monthly Budget</p>
              <p className="text-xs text-text-tertiary">{monthLabel(budget.month)}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Edit budget"
            onClick={() => setIsModalOpen(true)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>

        <p className="mt-6 text-3xl font-bold tracking-tight text-text-primary lg:text-4xl">
          {formatCurrency(Number(budget.amount))}
        </p>

        <div className="mt-6">
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={usedPercent}
            aria-label={`${usedPercent}% of monthly budget used`}
            className="h-2.5 w-full overflow-hidden rounded-full bg-neutral-200/50"
          >
            <div
              className="h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${barWidth}%`, backgroundColor: statusColor }}
            />
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <p className={cn("text-sm font-medium", statusText)}>{statusMessage}</p>
          <p className="text-xs text-text-tertiary">{statusDetail}</p>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4 border-t border-border-strong pt-6">
          <div>
            <p className="text-xs font-medium text-text-secondary">Spent</p>
            <p className="mt-1 text-lg font-semibold tracking-tight text-text-primary">
              {formatCurrency(budget.spent)}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-text-secondary">
              {remainingStat.label}
            </p>
            <p
              className={cn(
                "mt-1 text-lg font-semibold tracking-tight",
                remainingStat.over ? "text-danger" : "text-text-primary",
              )}
            >
              {remainingStat.value}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-text-secondary">Used</p>
            <p className="mt-1 text-lg font-semibold tracking-tight text-text-primary">
              {usedPercent}%
            </p>
          </div>
        </div>
      </Card>

      <BudgetModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        month={budget.month}
        initialAmount={Number(budget.amount)}
        onSubmit={save}
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
    </>
  );
}
