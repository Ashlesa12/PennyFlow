import { type ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  variant?: "login" | "signup";
}

export function AuthLayout({ children, variant = "login" }: AuthLayoutProps) {
  const isLogin = variant === "login";

  return (
    <div className="relative min-h-screen bg-layer">
      {/* Full-page background blobs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full bg-emerald-500/5 blur-[150px]" />
        <div className="absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full bg-amber-400/3 blur-[120px]" />
        <div className="absolute left-1/3 top-1/4 h-[280px] w-[280px] rounded-full bg-emerald-500/3 blur-[130px]" />
        <div className="absolute bottom-1/3 right-1/4 h-[200px] w-[200px] rounded-full bg-amber-400/2 blur-[100px]" />
      </div>

      {/* Centered composition — left content + card */}
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 lg:flex-row lg:gap-8 lg:px-8">
        {/* Left: Brand + Hero */}
        <div className="flex w-full max-w-lg flex-col justify-center py-12">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/20 lg:h-14 lg:w-14 lg:rounded-2xl">
              <span className="text-base font-bold text-white lg:text-xl">P</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-text-primary lg:text-2xl">
              PennyFlow
            </span>
          </div>

          {/* Tagline */}
          <h2 className="mt-8 max-w-lg text-2xl font-bold tracking-tight text-text-primary lg:mt-12 lg:text-3xl">
            {isLogin ? (
              <>
                <span className="text-accent">Spend smarter.</span>{" "}
                Live lighter.
              </>
            ) : (
              <>
                <span className="text-accent">Take control.</span>{" "}
                Start today.
              </>
            )}
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-text-secondary lg:text-base">
            {isLogin
              ? "Organize your finances with a calm, modern workspace designed to help you build better money habits."
              : "Build smarter money habits with tools designed for clarity and control."}
          </p>

          {/* Abstract illustration — hidden on mobile */}
          <div className="relative mt-8 hidden w-full max-w-lg md:block lg:mt-14">
            {isLogin ? (
              /* ── Login illustration: bar chart ── */
              <div className="rounded-3xl border border-white/50 bg-white/40 p-6 shadow-xl backdrop-blur-sm">
                <div className="flex h-40 items-end gap-3">
                  {[50, 75, 35, 95, 55, 70, 42].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-full bg-gradient-to-t from-accent/40 to-accent/5"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
                <div className="mt-4 flex gap-3">
                  {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                    <div key={i} className="flex-1 text-center text-xs text-text-tertiary">
                      {d}
                    </div>
                  ))}
                </div>
                <div className="mt-5 h-px bg-black/5" />
                <div className="mt-5 flex items-center justify-between">
                  {[32, 48, 28, 55, 38].map((w, i) => (
                    <div
                      key={i}
                      className="h-1.5 rounded-full bg-accent/20"
                      style={{ width: `${w}%` }}
                    />
                  ))}
                </div>
              </div>
            ) : (
              /* ── Signup illustration: category breakdown ── */
              <div className="rounded-3xl border border-white/50 bg-white/40 p-6 shadow-xl backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div className="h-2 w-24 rounded-full bg-accent/20" />
                  <div className="h-2 w-12 rounded-full bg-black/5" />
                </div>
                <div className="mt-6 space-y-4">
                  {[
                    { label: "Food & Dining", pct: 35, color: "bg-accent" },
                    { label: "Transport", pct: 22, color: "bg-info" },
                    { label: "Shopping", pct: 18, color: "bg-purple-400" },
                    { label: "Bills", pct: 15, color: "bg-amber-400" },
                    { label: "Entertainment", pct: 10, color: "bg-pink-400" },
                  ].map((cat) => (
                    <div key={cat.label}>
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="text-text-secondary">{cat.label}</span>
                        <span className="font-medium text-text-primary">{cat.pct}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-black/5">
                        <div
                          className={`h-full rounded-full ${cat.color}/30`}
                          style={{ width: `${cat.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Floating mini-card 1 */}
            <div className="absolute -bottom-4 -right-4 rounded-2xl border border-white/50 bg-white/80 px-5 py-4 shadow-lg backdrop-blur-sm">
              <p className="text-xs font-medium text-text-secondary">
                {isLogin ? "Total Expenses" : "Categories"}
              </p>
              <p className="mt-0.5 text-xl font-bold tracking-tight text-text-primary">
                {isLogin ? "Rs. 4,920" : "6"}
              </p>
              {isLogin && (
                <div className="mt-1 flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                  <span className="text-xs font-medium text-accent">+2.1% vs last month</span>
                </div>
              )}
            </div>

            {/* Floating mini-card 2 */}
            <div className="absolute -left-3 -top-3 rounded-xl border border-white/50 bg-white/80 px-4 py-3 shadow-lg backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-accent/30" />
                <span className="text-xs font-medium text-text-secondary">
                  {isLogin ? "Transactions" : "Monthly Budget"}
                </span>
              </div>
              <p className="mt-0.5 text-lg font-bold tracking-tight text-text-primary">
                {isLogin ? "156" : "Rs. 2,500"}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Auth card */}
        <div className="flex w-full max-w-sm items-center justify-center py-12">
          {children}
        </div>
      </div>
    </div>
  );
}
