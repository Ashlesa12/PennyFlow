export function RecurringSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="relative overflow-hidden rounded-3xl border border-border-strong bg-surface-elevated p-5 shadow-lg shadow-black/[0.02]"
        >
          <div className="relative flex items-center gap-4">
            <div className="h-11 w-11 shrink-0 rounded-2xl bg-neutral-200/60" />
            <div className="min-w-0 flex-1 space-y-2.5">
              <div className="h-3.5 w-3/5 rounded-full bg-neutral-200/60" />
              <div className="h-3 w-2/5 rounded-full bg-neutral-200/40" />
            </div>
            <div className="text-right">
              <div className="ml-auto h-5 w-20 rounded-full bg-neutral-200/60" />
              <div className="ml-auto mt-2 h-3 w-12 rounded-full bg-neutral-200/40" />
            </div>
          </div>

          <div className="relative mt-4 flex items-center justify-between border-t border-border pt-3.5">
            <div className="h-3 w-20 rounded-full bg-neutral-200/40" />
            <div className="flex gap-1">
              <div className="h-9 w-14 rounded-full bg-neutral-200/40" />
              <div className="h-9 w-9 rounded-full bg-neutral-200/40" />
              <div className="h-9 w-9 rounded-full bg-neutral-200/40" />
              <div className="h-9 w-9 rounded-full bg-neutral-200/40" />
            </div>
          </div>

          <div
            className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
            }}
          />
        </div>
      ))}
    </div>
  );
}
