import { useState } from "react";
import { KeyRound } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
} from "../ui";
import type { ChangePassword } from "../../types";

interface ChangePasswordSectionProps {
  onSave: (data: ChangePassword) => Promise<boolean>;
}

export function ChangePasswordSection({
  onSave,
}: ChangePasswordSectionProps) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [localError, setLocalError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!current || !next || !confirm) {
      setLocalError("All fields are required");
      return;
    }
    if (next.length < 6) {
      setLocalError("New password must be at least 6 characters");
      return;
    }
    if (next !== confirm) {
      setLocalError("New passwords do not match");
      return;
    }
    if (next === current) {
      setLocalError("New password must be different from the current password");
      return;
    }

    setLocalError("");
    setIsSaving(true);
    try {
      const ok = await onSave({
        current_password: current,
        new_password: next,
        confirm_new_password: confirm,
      });
      if (ok) {
        setCurrent("");
        setNext("");
        setConfirm("");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change password</CardTitle>
        <CardDescription>Keep your account secure</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {localError && (
            <div className="rounded-xl bg-danger/10 px-4 py-3 text-sm font-medium text-danger">
              {localError}
            </div>
          )}

          <Input
            type="password"
            label="Current password"
            placeholder="Enter current password"
            autoComplete="current-password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
          />
          <Input
            type="password"
            label="New password"
            placeholder="At least 6 characters"
            autoComplete="new-password"
            value={next}
            onChange={(e) => setNext(e.target.value)}
          />
          <Input
            type="password"
            label="Confirm new password"
            placeholder="Repeat new password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleSave}
            isLoading={isSaving}
            className="w-full sm:w-auto"
          >
            <KeyRound className="h-4 w-4" />
            Update password
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
