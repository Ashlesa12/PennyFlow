import { useState } from "react";
import { Globe, Palette } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Select,
} from "../ui";
import { applyTheme, resolveTheme, type Theme } from "../../utils/theme";
import type { User, UserPreferences } from "../../types";

interface PreferencesSectionProps {
  user: User;
  onSave: (data: UserPreferences) => Promise<boolean>;
}

const CURRENCY_OPTIONS = [
  { value: "NPR", label: "Nepalese Rupee", symbol: "Rs." },
  { value: "USD", label: "US Dollar", symbol: "$" },
  { value: "EUR", label: "Euro", symbol: "€" },
  { value: "GBP", label: "British Pound", symbol: "£" },
  { value: "INR", label: "Indian Rupee", symbol: "₹" },
] as const;

const DATE_FORMAT_OPTIONS = [
  { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
  { value: "DD-MM-YYYY", label: "DD-MM-YYYY" },
  { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
  { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
] as const;

const THEME_OPTIONS = [
  { value: "Light", label: "Light" },
  { value: "Dark", label: "Dark" },
  { value: "System", label: "System" },
] as const;

function toPreferences(user: User): UserPreferences {
  return {
    currency: CURRENCY_OPTIONS.some((o) => o.value === user.currency)
      ? (user.currency as UserPreferences["currency"])
      : "NPR",
    date_format: DATE_FORMAT_OPTIONS.some((o) => o.value === user.date_format)
      ? (user.date_format as UserPreferences["date_format"])
      : "YYYY-MM-DD",
    theme:
      user.theme === "Dark" || user.theme === "System"
        ? (user.theme as UserPreferences["theme"])
        : "Light",
  };
}

function formatDateByPreference(date: Date, format: string): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  switch (format) {
    case "DD-MM-YYYY":
      return `${d}-${m}-${y}`;
    case "MM/DD/YYYY":
      return `${m}/${d}/${y}`;
    case "DD/MM/YYYY":
      return `${d}/${m}/${y}`;
    case "YYYY-MM-DD":
    default:
      return `${y}-${m}-${d}`;
  }
}

export function PreferencesSection({
  user,
  onSave,
}: PreferencesSectionProps) {
  const [prefs, setPrefs] = useState<UserPreferences>(() => toPreferences(user));
  const [isSaving, setIsSaving] = useState(false);

  const symbol =
    CURRENCY_OPTIONS.find((o) => o.value === prefs.currency)?.symbol ?? "Rs.";
  const exampleDate = formatDateByPreference(new Date(), prefs.date_format);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const ok = await onSave(prefs);
      if (ok) applyTheme(prefs.theme);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
        <CardDescription>Currency, dates, and appearance</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Select
            label="Currency"
            value={prefs.currency}
            onChange={(value) =>
              setPrefs((p) => ({
                ...p,
                currency: value as UserPreferences["currency"],
              }))
            }
            options={CURRENCY_OPTIONS}
          />
          <Select
            label="Date format"
            value={prefs.date_format}
            onChange={(value) =>
              setPrefs((p) => ({
                ...p,
                date_format: value as UserPreferences["date_format"],
              }))
            }
            options={DATE_FORMAT_OPTIONS}
          />
          <Select
            label="Theme"
            value={prefs.theme}
            onChange={(value) => {
              setPrefs((p) => ({
                ...p,
                theme: value as UserPreferences["theme"],
              }));
              applyTheme(value as Theme);
            }}
            options={THEME_OPTIONS}
          />
        </div>

        <p className="mt-2.5 text-xs text-text-tertiary" aria-live="polite">
          {prefs.theme === "System"
            ? `Following your device\u2019s appearance (${resolveTheme(prefs.theme)}) \u2014 updates automatically.`
            : "Changes apply instantly to every page."}
        </p>

        <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-border bg-surface-subtle p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm">
            <span className="flex items-center gap-2 text-text-secondary">
              <Globe className="h-4 w-4 text-text-tertiary" />
              {symbol} 1,250
            </span>
            <span className="flex items-center gap-2 text-text-secondary">
              <Palette className="h-4 w-4 text-text-tertiary" />
              {exampleDate}
            </span>
          </div>
          <span className="text-xs text-text-tertiary">Live preview</span>
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={handleSave} isLoading={isSaving}>
            Save preferences
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
