/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { addMonthsToKey, currentMonthKey, monthLabelFor, monthKeyParts } from "../utils/month";

export interface MonthContextValue {
  selectedMonth: string;
  selectedYear: number;
  selectedMonthNumber: number;
  monthLabel: string;
  isCurrentMonth: boolean;
  setSelectedMonth: (month: string) => void;
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
  goToCurrentMonth: () => void;
}

const MonthContext = createContext<MonthContextValue | null>(null);

export function MonthProvider({ children }: { children: ReactNode }) {
  const [selectedMonth, setSelectedMonth] = useState(currentMonthKey);

  const goToPreviousMonth = useCallback(
    () => setSelectedMonth((month) => addMonthsToKey(month, -1)),
    [],
  );
  const goToNextMonth = useCallback(
    () => setSelectedMonth((month) => addMonthsToKey(month, 1)),
    [],
  );
  const goToCurrentMonth = useCallback(() => setSelectedMonth(currentMonthKey()), []);

  const value = useMemo<MonthContextValue>(() => {
    const { year, month } = monthKeyParts(selectedMonth);
    const now = new Date();
    return {
      selectedMonth,
      selectedYear: year,
      selectedMonthNumber: month,
      monthLabel: monthLabelFor(selectedMonth),
      isCurrentMonth: now.getFullYear() === year && now.getMonth() + 1 === month,
      setSelectedMonth,
      goToPreviousMonth,
      goToNextMonth,
      goToCurrentMonth,
    };
  }, [selectedMonth, goToPreviousMonth, goToNextMonth, goToCurrentMonth]);

  return <MonthContext.Provider value={value}>{children}</MonthContext.Provider>;
}

export function useMonth(): MonthContextValue {
  const ctx = useContext(MonthContext);
  if (!ctx) {
    throw new Error("useMonth must be used within a MonthProvider");
  }
  return ctx;
}
