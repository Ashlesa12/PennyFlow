import { useState } from "react";
import { Modal, Button, Input, Select, type SelectOption } from "../ui";
import { toISODateString } from "../../utils/formatDate";
import type { Category, RecurringExpense, RecurringFrequency } from "../../types";

interface RecurringFormModalProps {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  initial?: RecurringExpense | null;
  onSubmit: (data: {
    title: string;
    amount: number;
    category_id: number;
    frequency: RecurringFrequency;
    start_date: string;
  }) => Promise<boolean>;
}

const FREQUENCY_OPTIONS: RecurringFrequency[] = [
  "Daily",
  "Weekly",
  "Monthly",
  "Yearly",
];

const FREQUENCY_SELECT_OPTIONS: SelectOption[] = FREQUENCY_OPTIONS.map(
  (freq) => ({ value: freq, label: freq }),
);

export function RecurringFormModal({
  open,
  onClose,
  categories,
  initial,
  onSubmit,
}: RecurringFormModalProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [amount, setAmount] = useState(initial ? Number(initial.amount) : 0);
  const [categoryId, setCategoryId] = useState(
    initial?.category_id ?? categories[0]?.id ?? 1,
  );
  const [frequency, setFrequency] = useState<RecurringFrequency>(
    initial?.frequency ?? "Monthly",
  );
  const [startDate, setStartDate] = useState(
    initial?.start_date ?? toISODateString(new Date()),
  );
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [prevOpen, setPrevOpen] = useState(open);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setTitle(initial?.title ?? "");
      setAmount(initial ? Number(initial.amount) : 0);
      setCategoryId(initial?.category_id ?? categories[0]?.id ?? 1);
      setFrequency(initial?.frequency ?? "Monthly");
      setStartDate(initial?.start_date ?? toISODateString(new Date()));
      setError("");
    }
  }

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (amount <= 0) {
      setError("Amount must be greater than zero");
      return;
    }
    if (!startDate) {
      setError("Start date is required");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const ok = await onSubmit({
        title: title.trim(),
        amount,
        category_id: categoryId,
        frequency,
        start_date: startDate,
      });
      if (ok) onClose();
    } catch {
      setError("Something went wrong");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? "Edit Recurring Expense" : "Add Recurring Expense"}
      description={
        initial
          ? "Update your recurring expense details."
          : "Set up a bill or subscription that repeats automatically."
      }
    >
      <div className="space-y-5">
        {error && (
          <div className="rounded-xl bg-danger/10 px-4 py-3 text-sm font-medium text-danger">
            {error}
          </div>
        )}

        <Input
          label="Title"
          placeholder="e.g. Netflix"
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

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-primary">
              Frequency
            </label>
            <Select
              value={frequency}
              onChange={(value) => setFrequency(value as RecurringFrequency)}
              options={FREQUENCY_SELECT_OPTIONS}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-primary">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="flex h-11 w-full rounded-2xl border border-border-strong bg-surface-muted px-4 text-sm text-text-primary backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500/50"
            />
          </div>
        </div>

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
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button className="flex-1" onClick={handleSubmit} isLoading={isSaving}>
            {initial ? "Save Changes" : "Add Recurring Expense"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
