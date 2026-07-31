import { Toast } from "../components/ui";
import { ChangePasswordSection } from "../components/settings/ChangePasswordSection";
import { DangerZoneSection } from "../components/settings/DangerZoneSection";
import { PreferencesSection } from "../components/settings/PreferencesSection";
import { ProfileSection } from "../components/settings/ProfileSection";
import { SettingsSkeleton } from "../components/settings/SettingsSkeleton";
import { useSettings } from "../hooks/useSettings";

export default function SettingsPage() {
  const {
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
  } = useSettings();

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-5xl">
        <SettingsSkeleton />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto w-full max-w-5xl">
        <div className="rounded-3xl border border-border-strong bg-surface-elevated p-8 text-center shadow-lg shadow-black/[0.02] backdrop-blur-xl">
          <p className="text-sm text-text-secondary">
            Unable to load your profile. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
          Settings
        </h1>
        <p className="text-sm text-text-secondary">
          Manage your account and preferences.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <ProfileSection user={user} onSave={saveProfile} />
          <PreferencesSection user={user} onSave={savePreferences} />
        </div>

        <div className="space-y-6">
          <ChangePasswordSection onSave={savePassword} />
          <DangerZoneSection onDelete={removeAccount} />
        </div>
      </div>

      <Toast
        message={success}
        type="success"
        visible={success !== ""}
        onDismiss={clearSuccess}
      />
      <Toast
        message={error}
        type="error"
        visible={error !== ""}
        onDismiss={clearError}
      />
    </div>
  );
}
