import { useEffect, useState } from "react";
import { Modal, Input, Button } from "../ui";
import { getCategoryName } from "../../constants/categories";
import { toISODateString } from "../../utils/formatDate";
import type { Expense, ExpenseCreate, ExpenseUpdate } from "../../types";

type Mode = "create" | "edit";

interface ExpenseModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: ExpenseCreate | ExpenseUpdate) => Promise<boolean>;
  mode: Mode;
  expense?: Expense | null;
}

const defaultForm: ExpenseCreate = {
  title: "",
  amount: 0,
  expense_date: toISODateString(new Date()),
  category_id: 1,
};

export function ExpenseModal({
  open,
  onClose,
  onSave,
  mode,
  expense,
}: ExpenseModalProps) {
  const [form, setForm] = useState<ExpenseCreate | ExpenseUpdate>(defaultForm);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      if (mode === "edit" && expense) {
        setForm({
          title: expense.title,
          amount: Number(expense.amount),
          expense_date: expense.expense_date,
          category_id: expense.category_id,
        });
      } else {
        setForm(defaultForm);
      }
      setError("");
    }
  }, [open, mode, expense]);

  const handleSave = async () => {
    if (mode === "create") {
      const c = form as ExpenseCreate;
      if (!c.title || !c.amount || !c.expense_date) {
        setError("Please fill in all required fields");
        return;
      }
      if (c.amount <= 0) {
        setError("Amount must be greater than zero");
        return;
      }
    }

    setIsSaving(true);
    setError("");

    try {
      const ok = await onSave(form);
      if (ok) onClose();
    } catch {
      setError("Something went wrong");
    } finally {
      setIsSaving(false);
    }
  };

  const update = (patch: Partial<ExpenseCreate | ExpenseUpdate>) => {
    setForm((prev) => ({ ...prev, ...patch }));
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === "create" ? "Add Expense" : "Edit Expense"}
      description={
        mode === "create"
          ? "Record a new transaction"
          : "Update transaction details"
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
          placeholder="e.g. Weekly groceries"
          value={"title" in form ? (form as ExpenseCreate).title : ""}
          onChange={(e) => update({ title: e.target.value })}
        />

        <Input
          label="Amount (Rs.)"
          type="number"
          min="0"
          step="0.01"
          placeholder="0"
          value={"amount" in form ? (form as ExpenseCreate).amount || "" : ""}
          onChange={(e) =>
            update({ amount: parseFloat(e.target.value) || 0 })
          }
        />

        <Input
          label="Date"
          type="date"
          value={"expense_date" in form ? (form as ExpenseCreate).expense_date : ""}
          onChange={(e) => update({ expense_date: e.target.value })}
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-700">
            Category
          </label>
          <select
            value={"category_id" in form ? (form as ExpenseCreate).category_id : 1}
            onChange={(e) =>
              update({ category_id: Number(e.target.value) })
            }
            className="flex h-11 w-full rounded-2xl border border-white/40 bg-white/60 px-4 text-sm text-neutral-900 backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500/50"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((id) => (
              <option key={id} value={id}>
                {getCategoryName(id)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button className="flex-1" onClick={handleSave} isLoading={isSaving}>
            {mode === "create" ? "Save Expense" : "Save Changes"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
