import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Mail } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
} from "../ui";
import { removeAuthToken } from "../../api/client";
import type { User } from "../../types";
import type { ProfileUpdate } from "../../api/users";

interface ProfileSectionProps {
  user: User;
  onSave: (data: ProfileUpdate) => Promise<boolean>;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function ProfileSection({ user, onSave }: ProfileSectionProps) {
  const navigate = useNavigate();
  const [name, setName] = useState(user.name);
  const [localError, setLocalError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      setLocalError("Name cannot be empty");
      return;
    }
    setLocalError("");
    setIsSaving(true);
    try {
      await onSave({ name: name.trim() });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = () => {
    removeAuthToken();
    navigate("/login");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Your account details</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-lg font-bold text-white shadow-lg shadow-emerald-500/20">
            {getInitials(user.name)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold tracking-tight text-text-primary">
              {user.name}
            </p>
            <p className="truncate text-sm text-text-secondary">
              {user.email}
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-5">
          <div>
            <label
              htmlFor="profile-name"
              className="mb-2 block text-sm font-medium text-text-secondary"
            >
              Full name
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Input
                id="profile-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="flex-1"
                error={localError}
              />
              <Button onClick={handleSave} isLoading={isSaving}>
                Save
              </Button>
            </div>
          </div>

          <div>
            <label
              htmlFor="profile-email"
              className="mb-2 block text-sm font-medium text-text-secondary"
            >
              Email
            </label>
            <div
              id="profile-email"
              className="flex h-11 items-center gap-2 rounded-2xl border border-border-strong bg-surface-muted px-4 text-sm text-text-primary backdrop-blur-sm"
            >
              <Mail className="h-4 w-4 shrink-0 text-text-tertiary" />
              <span className="truncate">{user.email}</span>
            </div>
          </div>
        </div>
      </CardContent>

      <div className="mt-6 flex items-center justify-between border-t border-border pt-6">
        <Button variant="secondary" onClick={handleSignOut}>
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    </Card>
  );
}
