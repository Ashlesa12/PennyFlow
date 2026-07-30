import { useState } from "react";
import { Modal, Button } from "../ui";

interface DeleteConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<boolean>;
}

export function DeleteConfirmationModal({
  open,
  onClose,
  onConfirm,
}: DeleteConfirmationModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const ok = await onConfirm();
      if (ok) onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Delete Expense?"
      description="This action cannot be undone."
    >
      <p className="text-sm text-neutral-600">
        Are you sure you want to delete this expense? This will permanently
        remove it from your account.
      </p>

      <div className="mt-6 flex items-center gap-3">
        <Button variant="secondary" className="flex-1" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="danger"
          className="flex-1"
          onClick={handleDelete}
          isLoading={isDeleting}
        >
          Delete
        </Button>
      </div>
    </Modal>
  );
}
