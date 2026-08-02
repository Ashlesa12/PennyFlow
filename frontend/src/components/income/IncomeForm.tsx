import { useState } from "react";
import { Button, Input } from "../ui";
import { useMonth } from "../../context/MonthContext";
import { defaultDateForMonth } from "../../utils/month";
import { getCurrencySymbol } from "../../utils/formatCurrency";
import type { IncomeCreate } from "../../types";

interface IncomeFormProps {
  onSubmit: (data: IncomeCreate) => Promise<void>;
  onCancel: () => void;
  initialData?: {
    title: string;
    amount: number;
    income_date: string;
  };
}

export function IncomeForm({
  onSubmit,
  onCancel,
  initialData,
}: IncomeFormProps) {
  const { selectedMonth } = useMonth();

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [amount, setAmount] = useState(initialData?.amount ?? 0);
  const [incomeDate, setIncomeDate] = useState(
    initialData?.income_date ?? defaultDateForMonth(selectedMonth),
  );
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (amount <= 0) {
      setError("Amount must be greater than zero");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      await onSubmit({
        title: title.trim(),
        amount,
        income_date: incomeDate,
      });
    } catch {
      setError("Something went wrong");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      {error && (
        <div className="rounded-xl bg-danger/10 px-4 py-3 text-sm font-medium text-danger">
          {error}
        </div>
      )}

      <Input
        label="Title"
        placeholder="e.g. Monthly salary"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <Input
        label={`Amount (${getCurrencySymbol()})`}
        type="number"
        min="0"
        step="0.01"
        placeholder="0"
        value={amount || ""}
        onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
      />

      <Input
        label="Date"
        type="date"
        value={incomeDate}
        onChange={(e) => setIncomeDate(e.target.value)}
      />

      <div className="flex items-center gap-3 pt-2">
        <Button variant="secondary" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button className="flex-1" onClick={handleSubmit} isLoading={isSaving}>
          {initialData ? "Save Changes" : "Add Income"}
        </Button>
      </div>
    </div>
  );
}
