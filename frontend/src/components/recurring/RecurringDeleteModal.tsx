import { Modal, Button } from "../ui";

interface RecurringDeleteModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export function RecurringDeleteModal({
  open,
  onClose,
  title,
  onConfirm,
  isDeleting,
}: RecurringDeleteModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Delete Recurring Expense"
      description="This action cannot be undone."
    >
      <p className="text-sm leading-relaxed text-text-secondary">
        Are you sure you want to delete{" "}
        <span className="font-medium text-text-primary">{title}</span>? It will
        be removed permanently.
      </p>

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="ghost" onClick={onClose} disabled={isDeleting}>
          Cancel
        </Button>
        <Button onClick={onConfirm} variant="danger" isLoading={isDeleting}>
          Delete
        </Button>
      </div>
    </Modal>
  );
}
