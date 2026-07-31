export function BudgetSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-border-strong bg-surface-elevated p-6 shadow-lg shadow-black/[0.02] lg:p-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-neutral-200/60" />
          <div className="space-y-2.5">
            <div className="h-4 w-32 rounded-full bg-neutral-200/60" />
            <div className="h-8 w-40 rounded-full bg-neutral-200/60" />
          </div>
        </div>
        <div className="h-9 w-9 rounded-full bg-neutral-200/40" />
      </div>

      <div className="mt-8 space-y-3">
        <div className="h-3 w-full rounded-full bg-neutral-200/40" />
        <div className="h-3 w-2/3 rounded-full bg-neutral-200/40" />
      </div>

      <div className="mt-8 grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 w-14 rounded-full bg-neutral-200/40" />
            <div className="h-5 w-24 rounded-full bg-neutral-200/60" />
          </div>
        ))}
      </div>

      <div
        className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
        }}
      />
    </div>
  );
}
