import { useState } from "react";
import { Modal, Button, Input } from "../ui";
import { formatMonthYear } from "../../utils/formatDate";
import type { BudgetCreate } from "../../types";

interface BudgetModalProps {
  open: boolean;
  onClose: () => void;
  month: string;
  initialAmount?: number | null;
  onSubmit: (data: BudgetCreate) => Promise<boolean>;
}

export function BudgetModal({
  open,
  onClose,
  month,
  initialAmount,
  onSubmit,
}: BudgetModalProps) {
  const [amount, setAmount] = useState(initialAmount ?? 0);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [prevOpen, setPrevOpen] = useState(open);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setAmount(initialAmount ?? 0);
      setError("");
    }
  }

  const monthLabel = formatMonthYear(
    new Date(Number(month.slice(0, 4)), Number(month.slice(5, 7)) - 1, 1),
  );

  const handleSubmit = async () => {
    if (!amount || amount <= 0) {
      setError("Budget must be greater than zero");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const ok = await onSubmit({ amount, month });
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
      title={initialAmount ? "Edit Budget" : "Set a Budget"}
      description={`Choose a monthly spending goal for ${monthLabel}.`}
    >
      <div className="space-y-5">
        {error && (
          <div className="rounded-xl bg-danger/10 px-4 py-3 text-sm font-medium text-danger">
            {error}
          </div>
        )}

        <Input
          label="Monthly budget (Rs.)"
          type="number"
          min="0"
          step="0.01"
          placeholder="0"
          autoFocus
          value={amount || ""}
          onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
        />

        <div className="flex items-center gap-3 pt-2">
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button className="flex-1" onClick={handleSubmit} isLoading={isSaving}>
            {initialAmount ? "Save Changes" : "Set Budget"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
