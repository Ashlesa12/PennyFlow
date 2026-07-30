import { useState, useEffect } from "react";
import { Button, Input } from "../ui";
import { toISODateString } from "../../utils/formatDate";
import type { ExpenseCreate, ExpenseUpdate, Category } from "../../types";

interface ExpenseFormProps {
  categories: Category[];
  onSubmit: (data: ExpenseCreate | ExpenseUpdate) => Promise<void>;
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
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [amount, setAmount] = useState(initialData?.amount ?? 0);
  const [expenseDate, setExpenseDate] = useState(
    initialData?.expense_date ?? toISODateString(new Date()),
  );
  const [categoryId, setCategoryId] = useState(
    initialData?.category_id ?? categories[0]?.id ?? 1,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setAmount(initialData.amount);
      setExpenseDate(initialData.expense_date);
      setCategoryId(initialData.category_id);
    }
  }, [initialData]);

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
        label="Amount (Rs.)"
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
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(Number(e.target.value))}
          className="flex h-11 w-full rounded-2xl border border-white/40 bg-white/60 px-4 text-sm text-text-primary backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500/50"
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
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
