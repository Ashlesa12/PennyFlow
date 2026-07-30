export function ExpenseSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-3xl border border-white/40 bg-white/70 p-5 shadow-lg shadow-black/[0.02]"
        >
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-neutral-200/60" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-4 w-3/5 rounded-full bg-neutral-200/60" />
              <div className="h-3 w-2/5 rounded-full bg-neutral-200/40" />
            </div>
            <div className="hidden items-center gap-3 sm:flex">
              <div className="h-3 w-20 rounded-full bg-neutral-200/40" />
            </div>
            <div className="text-right">
              <div className="ml-auto h-5 w-24 rounded-full bg-neutral-200/60" />
            </div>
            <div className="flex gap-1">
              <div className="h-9 w-9 rounded-full bg-neutral-200/40" />
              <div className="h-9 w-9 rounded-full bg-neutral-200/40" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
