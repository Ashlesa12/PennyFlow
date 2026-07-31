import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Modal,
} from "../ui";
import { removeAuthToken } from "../../api/client";

interface DangerZoneSectionProps {
  onDelete: () => Promise<boolean>;
}

export function DangerZoneSection({ onDelete }: DangerZoneSectionProps) {
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const ok = await onDelete();
      if (ok) {
        setConfirmOpen(false);
        removeAuthToken();
        navigate("/login");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="border-danger/20 bg-danger/[0.03]">
      <CardHeader>
        <CardTitle className="text-danger">Danger zone</CardTitle>
        <CardDescription>Irreversible account actions</CardDescription>
      </CardHeader>

      <CardContent>
        <p className="text-sm leading-relaxed text-text-secondary">
          Permanently delete your account along with all expenses, budgets, and
          recurring expenses.
        </p>
        <Button
          variant="danger"
          className="mt-4"
          onClick={() => setConfirmOpen(true)}
        >
          <AlertTriangle className="h-4 w-4" />
          Delete account
        </Button>
      </CardContent>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Delete account?"
        description="This action cannot be undone."
      >
        <p className="text-sm leading-relaxed text-text-secondary">
          Your profile, expenses, budgets, and recurring expenses will be
          permanently removed from PennyFlow. Are you sure you want to
          continue?
        </p>

        <div className="mt-6 flex items-center gap-3">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => setConfirmOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            className="flex-1"
            onClick={handleDelete}
            isLoading={isDeleting}
          >
            Delete account
          </Button>
        </div>
      </Modal>
    </Card>
  );
}
