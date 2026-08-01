import { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button, Select, type SelectOption } from "../ui";
import { useMonth } from "../../context/MonthContext";
import { monthLabelFor } from "../../utils/month";
import { cn } from "../../utils/cn";

interface MonthNavigatorProps {
  className?: string;
}

export function MonthNavigator({ className }: MonthNavigatorProps) {
  const {
    selectedMonth,
    isCurrentMonth,
    setSelectedMonth,
    goToPreviousMonth,
    goToNextMonth,
    goToCurrentMonth,
  } = useMonth();

  const monthOptions = useMemo<SelectOption[]>(() => {
    const options: SelectOption[] = [];
    const now = new Date();
    const startYear = now.getFullYear() - 5;
    const endYear = now.getFullYear() + 1;

    for (let year = startYear; year <= endYear; year++) {
      for (let month = 1; month <= 12; month++) {
        const value = `${year}-${String(month).padStart(2, "0")}`;
        options.push({ value, label: monthLabelFor(value) });
      }
    }

    return options;
  }, []);

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-2xl border border-border-strong bg-surface-elevated p-1.5 shadow-sm",
        className,
      )}
    >
      <button
        type="button"
        onClick={goToPreviousMonth}
        aria-label="Previous month"
        className="flex h-9 w-9 items-center justify-center rounded-xl text-text-secondary transition-colors duration-200 hover:bg-surface-soft hover:text-text-primary"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <Select
        value={selectedMonth}
        onChange={setSelectedMonth}
        options={monthOptions}
        ariaLabel="Select month"
        className="h-9 min-w-[10.5rem] border-0 bg-transparent text-sm font-medium shadow-none sm:min-w-[11.5rem]"
      />

      <button
        type="button"
        onClick={goToNextMonth}
        aria-label="Next month"
        className="flex h-9 w-9 items-center justify-center rounded-xl text-text-secondary transition-colors duration-200 hover:bg-surface-soft hover:text-text-primary"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      {!isCurrentMonth && (
        <Button
          variant="ghost"
          size="sm"
          className="h-9 px-3 text-xs"
          onClick={goToCurrentMonth}
        >
          Today
        </Button>
      )}
    </div>
  );
}
