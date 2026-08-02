export type CurrencyCode = "NPR" | "USD" | "EUR" | "GBP" | "INR";

export interface CurrencyInfo {
  label: string;
  symbol: string;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  NPR: { label: "Nepalese Rupee", symbol: "Rs." },
  USD: { label: "US Dollar", symbol: "$" },
  EUR: { label: "Euro", symbol: "€" },
  GBP: { label: "British Pound", symbol: "£" },
  INR: { label: "Indian Rupee", symbol: "₹" },
};

const CURRENCY_STORAGE_KEY = "pennyflow_currency";

let currentCurrency: CurrencyCode = "NPR";

export function getCurrencyCode(): CurrencyCode {
  return currentCurrency;
}

export function getCurrencySymbol(): string {
  return CURRENCIES[currentCurrency].symbol;
}

export function setCurrency(code: string): void {
  if (code in CURRENCIES) {
    currentCurrency = code as CurrencyCode;
    localStorage.setItem(CURRENCY_STORAGE_KEY, code);
  }
}

export function initCurrency(): void {
  const stored = localStorage.getItem(CURRENCY_STORAGE_KEY);
  if (stored && stored in CURRENCIES) {
    currentCurrency = stored as CurrencyCode;
  }
}

export function formatCurrency(amount: number): string {
  const formatted = new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
  return `${getCurrencySymbol()} ${formatted}`;
}
