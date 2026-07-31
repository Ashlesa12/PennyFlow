import type { ReactNode } from "react";

function SkeletonBlock({
  className,
  children,
}: {
  className: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-border-strong bg-surface-elevated shadow-lg shadow-black/[0.02] ${className}`}
    >
      {children}
      <div
        className="pointer-events-none absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
        }}
      />
    </div>
  );
}

export function SettingsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2.5">
        <div className="h-6 w-40 rounded-full bg-neutral-200/60" />
        <div className="h-3.5 w-64 rounded-full bg-neutral-200/40" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <SkeletonBlock className="p-6 lg:p-8">
            <div className="mb-6 space-y-1.5">
              <div className="h-5 w-24 rounded-full bg-neutral-200/60" />
              <div className="h-3.5 w-40 rounded-full bg-neutral-200/40" />
            </div>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-neutral-200/60" />
              <div className="space-y-2">
                <div className="h-4 w-32 rounded-full bg-neutral-200/60" />
                <div className="h-3 w-48 rounded-full bg-neutral-200/40" />
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <div className="h-3 w-16 rounded-full bg-neutral-200/40" />
              <div className="h-11 w-full rounded-2xl bg-neutral-200/40" />
            </div>
          </SkeletonBlock>

          <SkeletonBlock className="p-6 lg:p-8">
            <div className="mb-6 space-y-1.5">
              <div className="h-5 w-28 rounded-full bg-neutral-200/60" />
              <div className="h-3.5 w-48 rounded-full bg-neutral-200/40" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-3 w-14 rounded-full bg-neutral-200/40" />
                  <div className="h-11 w-full rounded-2xl bg-neutral-200/40" />
                </div>
              ))}
            </div>
          </SkeletonBlock>
        </div>

        <div className="space-y-6">
          <SkeletonBlock className="p-6">
            <div className="mb-6 space-y-1.5">
              <div className="h-5 w-32 rounded-full bg-neutral-200/60" />
              <div className="h-3.5 w-40 rounded-full bg-neutral-200/40" />
            </div>
            <div className="space-y-3">
              <div className="h-11 w-full rounded-2xl bg-neutral-200/40" />
              <div className="h-11 w-full rounded-2xl bg-neutral-200/40" />
              <div className="h-11 w-full rounded-2xl bg-neutral-200/40" />
            </div>
          </SkeletonBlock>

          <SkeletonBlock className="p-6">
            <div className="mb-6 space-y-1.5">
              <div className="h-5 w-24 rounded-full bg-neutral-200/60" />
              <div className="h-3.5 w-40 rounded-full bg-neutral-200/40" />
            </div>
            <div className="h-10 w-36 rounded-full bg-neutral-200/60" />
          </SkeletonBlock>
        </div>
      </div>
    </div>
  );
}
