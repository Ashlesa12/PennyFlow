import { Link } from "react-router-dom";

export function AnalyticsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border bg-white/40 px-6 py-24 text-center backdrop-blur-sm">
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
        className="mb-6 text-accent"
        aria-hidden="true"
      >
        <circle cx="60" cy="48" r="28" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.2" />
        <circle cx="60" cy="48" r="16" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.3" />
        <path d="M60 20v56M32 48h56" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.15" />
        <rect x="30" y="82" width="60" height="6" rx="3" fill="currentColor" opacity="0.12" />
        <rect x="40" y="92" width="40" height="6" rx="3" fill="currentColor" opacity="0.08" />
        <rect x="50" y="102" width="20" height="6" rx="3" fill="currentColor" opacity="0.05" />
      </svg>

      <h3 className="text-lg font-semibold tracking-tight text-text-primary">
        No analytics yet
      </h3>

      <p className="mt-1.5 max-w-xs text-sm text-text-secondary">
        Start tracking your expenses to unlock spending insights and trends.
      </p>

      <Link
        to="/expenses"
        className="mt-6 inline-flex h-10 items-center gap-2 rounded-full bg-accent px-5 text-sm font-medium text-surface shadow-sm shadow-accent/20 transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
      >
        Add Your First Expense
      </Link>
    </div>
  );
}
