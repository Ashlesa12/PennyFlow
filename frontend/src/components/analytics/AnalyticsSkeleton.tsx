export function AnalyticsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/70 p-5 shadow-lg shadow-black/[0.02]"
          >
            <div className="mb-4 h-10 w-10 rounded-xl bg-neutral-200/60" />
            <div className="space-y-2">
              <div className="h-3 w-3/5 rounded-full bg-neutral-200/60" />
              <div className="h-5 w-4/5 rounded-full bg-neutral-200/40" />
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/70 p-6 shadow-lg shadow-black/[0.02]">
          <div className="mb-6 space-y-1.5">
            <div className="h-5 w-40 rounded-full bg-neutral-200/60" />
            <div className="h-3.5 w-56 rounded-full bg-neutral-200/40" />
          </div>
          <div className="flex items-center gap-6">
            <div className="h-44 w-44 shrink-0 rounded-full bg-neutral-200/40" />
            <div className="flex-1 space-y-3">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="flex items-center gap-3">
                  <div className="h-5 w-5 rounded bg-neutral-200/40" />
                  <div className="h-3 w-24 rounded-full bg-neutral-200/40" />
                  <div className="ml-auto h-3 w-16 rounded-full bg-neutral-200/40" />
                </div>
              ))}
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

        <div className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/70 p-6 shadow-lg shadow-black/[0.02]">
          <div className="mb-6 space-y-1.5">
            <div className="h-5 w-40 rounded-full bg-neutral-200/60" />
            <div className="h-3.5 w-48 rounded-full bg-neutral-200/40" />
          </div>
          <div className="space-y-4">
            <div className="flex items-end gap-3">
              {Array.from({ length: 6 }).map((_, j) => (
                <div
                  key={j}
                  className="flex-1 rounded-t-lg bg-neutral-200/40"
                  style={{ height: `${40 + Math.random() * 80}px` }}
                />
              ))}
            </div>
            <div className="flex justify-between">
              {Array.from({ length: 6 }).map((_, j) => (
                <div key={j} className="h-3 w-10 rounded-full bg-neutral-200/40" />
              ))}
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
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/70 p-5 shadow-lg shadow-black/[0.02]"
          >
            <div className="mb-3 h-9 w-9 rounded-xl bg-neutral-200/60" />
            <div className="space-y-2">
              <div className="h-3 w-2/3 rounded-full bg-neutral-200/60" />
              <div className="h-4 w-3/4 rounded-full bg-neutral-200/40" />
              <div className="h-3 w-1/2 rounded-full bg-neutral-200/40" />
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
    </div>
  );
}
