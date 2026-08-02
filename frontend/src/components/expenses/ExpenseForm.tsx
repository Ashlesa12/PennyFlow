import { useState } from "react";
import { Button, Input, Select } from "../ui";
import { useMonth } from "../../context/MonthContext";
import { defaultDateForMonth } from "../../utils/month";
import { getCurrencySymbol } from "../../utils/formatCurrency";
import type { ExpenseCreate, Category } from "../../types";

interface ExpenseFormProps {
  categories: Category[];
  onSubmit: (data: ExpenseCreate) => Promise<void>;
  onCancel: () => void;
  initialData?: {
    title: string;
    amount: number;
    expense_date: string;
    category_id: number;
  };
}

export function ExpenseForm({
  categories,
  onSubmit,
  onCancel,
  initialData,
}: ExpenseFormProps) {
  const { selectedMonth } = useMonth();

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [amount, setAmount] = useState(initialData?.amount ?? 0);
  const [expenseDate, setExpenseDate] = useState(
    initialData?.expense_date ?? defaultDateForMonth(selectedMonth),
  );
  const [categoryId, setCategoryId] = useState(
    initialData?.category_id ?? categories[0]?.id ?? 1,
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
        expense_date: expenseDate,
        category_id: categoryId,
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
        placeholder="e.g. Weekly groceries"
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
        value={expenseDate}
        onChange={(e) => setExpenseDate(e.target.value)}
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-text-primary">
          Category
        </label>
        <Select
          value={String(categoryId)}
          onChange={(value) => setCategoryId(Number(value))}
          options={categories.map((cat) => ({
            value: String(cat.id),
            label: cat.name,
          }))}
        />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button variant="secondary" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button className="flex-1" onClick={handleSubmit} isLoading={isSaving}>
          {initialData ? "Save Changes" : "Add Expense"}
        </Button>
      </div>
    </div>
  );
}
