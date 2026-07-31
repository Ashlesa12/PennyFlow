import {
  useCallback,
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import axios from "axios";
import type { ChangePassword, User, UserPreferences } from "../types";
import {
  changePassword as apiChangePassword,
  deleteAccount as apiDeleteAccount,
  fetchMe,
  updatePreferences as apiUpdatePreferences,
  updateProfile as apiUpdateProfile,
  type ProfileUpdate,
} from "../api/users";

function getErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    const detail = (err.response?.data as { detail?: string } | undefined)
      ?.detail;
    if (typeof detail === "string") return detail;
  }
  return fallback;
}

function useSettingsLoad(
  setUser: Dispatch<SetStateAction<User | null>>,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  setError: Dispatch<SetStateAction<string>>,
) {
  useEffect(() => {
    let cancelled = false;

    fetchMe()
      .then((data) => {
        if (!cancelled) setUser(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(getErrorMessage(err, "Failed to load profile"));
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [setUser, setIsLoading, setError]);
}

export function useSettings() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useSettingsLoad(setUser, setIsLoading, setError);

  const saveProfile = useCallback(async (data: ProfileUpdate) => {
    setError("");
    setSuccess("");
    try {
      const updated = await apiUpdateProfile(data);
      setUser(updated);
      setSuccess("Profile updated successfully");
      return true;
    } catch (err) {
      setError(getErrorMessage(err, "Failed to update profile"));
      return false;
    }
  }, []);

  const savePreferences = useCallback(async (data: UserPreferences) => {
    setError("");
    setSuccess("");
    try {
      const updated = await apiUpdatePreferences(data);
      setUser(updated);
      setSuccess("Preferences saved");
      return true;
    } catch (err) {
      setError(getErrorMessage(err, "Failed to save preferences"));
      return false;
    }
  }, []);

  const savePassword = useCallback(async (data: ChangePassword) => {
    setError("");
    setSuccess("");
    try {
      await apiChangePassword(data);
      setSuccess("Password changed successfully");
      return true;
    } catch (err) {
      setError(getErrorMessage(err, "Failed to change password"));
      return false;
    }
  }, []);

  const removeAccount = useCallback(async () => {
    setError("");
    setSuccess("");
    try {
      await apiDeleteAccount();
      setSuccess("Account deleted");
      return true;
    } catch (err) {
      setError(getErrorMessage(err, "Failed to delete account"));
      return false;
    }
  }, []);

  const clearSuccess = useCallback(() => setSuccess(""), []);
  const clearError = useCallback(() => setError(""), []);

  return {
    user,
    isLoading,
    success,
    error,
    saveProfile,
    savePreferences,
    savePassword,
    removeAccount,
    clearSuccess,
    clearError,
  };
}
