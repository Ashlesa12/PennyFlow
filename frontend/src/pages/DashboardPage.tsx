import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  TrendingDown,
  Calendar,
  Receipt,
  List,
  Plus,
  ArrowUpRight,
  BarChart3,
  Tags,
  Download,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Sector,
} from "recharts";
import type { TooltipContentProps, PieSectorDataItem } from "recharts";
import { api } from "../api/client";
import { BudgetCard } from "../components/budget/BudgetCard";
import { UpcomingBillsCard } from "../components/recurring/UpcomingBillsCard";
import { ExportModal } from "../components/export/ExportModal";
import { Toast } from "../components/ui";
import { formatCurrency } from "../utils/formatCurrency";
import { getCategoryColor, getCategoryName } from "../constants/categories";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui";
import type {
  ExpenseSummary,
  CategorySummary,
  Expense,
  User,
} from "../types";

/* ─── Types ─────────────────────────────────────── */

interface OverviewItem {
  icon: LucideIcon;
  title: string;
  amount: string;
  subtitle: string;
  accent: "accent" | "danger";
}

interface WeeklyPoint {
  day: string;
  spend: number;
}

interface CategorySlice {
  name: string;
  value: number;
  total: number;
  percentage: number;
  color: string;
}

interface QuickAction {
  icon: LucideIcon;
  label: string;
  to?: string;
  disabled?: boolean;
  onClick?: () => void;
}

/* ─── Constants ──────────────────────────────────── */

/* ─── Helpers ───────────────────────────────────── */

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatRelativeDate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function isCurrentMonth(date: Date): boolean {
  const now = new Date();
  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
}

/* ─── Chart Tooltip ─────────────────────────────── */

function ChartTooltip({ active, payload, label }: TooltipContentProps) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-border-strong bg-surface-strong px-3 py-2 text-sm shadow-lg shadow-black/[0.02] backdrop-blur-xl">
        <p className="text-xs text-text-secondary">{label}</p>
        <p className="font-semibold text-text-primary">
          Rs. {payload[0].value?.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
}

/* ─── Sub-components ────────────────────────────── */

function OverviewGrid({ items }: { items: OverviewItem[] }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="rounded-3xl border border-border-strong bg-surface-elevated p-6 shadow-lg shadow-black/[0.02] backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
          >
            <div
              className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${
                item.accent === "accent"
                  ? "bg-accent/10 text-accent"
                  : "bg-danger/10 text-danger"
              }`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <p className="text-xs font-medium text-text-secondary">
              {item.title}
            </p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-text-primary">
              {item.amount}
            </p>
            <p className="mt-1 text-xs text-text-tertiary">{item.subtitle}</p>
          </div>
        );
      })}
    </div>
  );
}

function WeeklyChart({ data }: { data: WeeklyPoint[] }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Weekly Spending</CardTitle>
        <CardDescription>Your spending pattern this week</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity={0.12} />
                  <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                tickFormatter={(v: number) => `Rs. ${v}`}
              />
              <Tooltip content={ChartTooltip} />
              <Area
                type="monotone"
                dataKey="spend"
                stroke="#10B981"
                strokeWidth={2}
                fill="url(#spendGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function DonutTooltip({ active, payload }: TooltipContentProps) {
  if (active && payload && payload.length) {
    const data = payload[0].payload as CategorySlice;
    return (
      <div className="rounded-xl border border-border-strong bg-surface-strong px-3 py-2 text-sm shadow-lg shadow-black/[0.02] backdrop-blur-xl">
        <p className="font-medium text-text-primary">{data.name}</p>
        <p className="text-xs text-text-secondary">
          {formatCurrency(data.total)} ({data.percentage}%)
        </p>
      </div>
    );
  }
  return null;
}

function renderDonutActiveShape(props: PieSectorDataItem) {
  return (
    <Sector
      cx={props.cx}
      cy={props.cy}
      innerRadius={props.innerRadius}
      outerRadius={(props.outerRadius ?? 75) + 5}
      startAngle={props.startAngle}
      endAngle={props.endAngle}
      fill={props.fill}
      cornerRadius={3}
    />
  );
}

function CategoryDonut({ data }: { data: CategorySlice[] }) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const total = data.reduce((sum, item) => sum + item.total, 0);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Category Breakdown</CardTitle>
        <CardDescription>Where your money goes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <div className="relative h-44 w-44 shrink-0">
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-xs font-medium text-text-secondary">Total</p>
              <p className="text-base font-bold tracking-tight text-text-primary">
                {formatCurrency(total)}
              </p>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                  activeShape={renderDonutActiveShape}
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(-1)}
                >
                  {data.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={DonutTooltip} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid w-full grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-1 sm:w-auto">
            {data.map((item, index) => (
              <div
                key={item.name}
                className={`flex items-center gap-2 rounded-lg px-2 py-1 transition-colors duration-200 ${
                  activeIndex === index ? "bg-border" : ""
                }`}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(-1)}
              >
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-text-secondary">{item.name}</span>
                <span className="ml-auto font-medium text-text-primary">
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ExpensesTable({ rows }: { rows: Expense[] }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Expenses</CardTitle>
            <CardDescription>Your latest transactions</CardDescription>
          </div>
          <Link
            to="/expenses"
            className="hidden items-center gap-1 text-sm font-medium text-accent transition-colors hover:text-accent/80 sm:inline-flex"
          >
            View all
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-0 sm:p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-strong text-left text-xs font-medium text-text-secondary">
                <th className="px-6 pb-3 font-medium">Category</th>
                <th className="px-6 pb-3 font-medium">Title</th>
                <th className="px-6 pb-3 font-medium">Date</th>
                <th className="px-6 pb-3 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((expense) => (
                <tr
                  key={expense.id}
                  className="border-b border-border transition-colors last:border-none hover:bg-border"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{
                          backgroundColor: getCategoryColor(
                            getCategoryName(expense.category_id),
                          ),
                        }}
                      />
                      <span className="text-sm text-text-primary">
                        {getCategoryName(expense.category_id)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-primary">
                    {expense.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary">
                    {formatRelativeDate(new Date(expense.expense_date))}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium text-text-primary">
                    -{formatCurrency(Number(expense.amount))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-border-strong p-4 text-center sm:hidden">
          <Link
            to="/expenses"
            className="inline-flex items-center gap-1 text-sm font-medium text-accent"
          >
            View all expenses
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function QuickActionsGrid({ actions }: { actions: QuickAction[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Frequently used tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {actions.map((action) => {
            const Icon = action.icon;

            if (action.disabled) {
              return (
                <button
                  key={action.label}
                  disabled
                  className="flex cursor-not-allowed flex-col items-center gap-2 rounded-2xl border border-border bg-surface-soft px-4 py-4 text-sm font-medium text-text-secondary/50 opacity-50 transition-all duration-200"
                >
                  <Icon className="h-5 w-5" />
                  {action.label}
                </button>
              );
            }

            if (action.onClick) {
              return (
                <button
                  key={action.label}
                  type="button"
                  onClick={action.onClick}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-surface-soft px-4 py-4 text-sm font-medium text-text-primary transition-all duration-200 hover:bg-surface-strong hover:shadow-md hover:-translate-y-0.5"
                >
                  <Icon className="h-5 w-5 text-accent" />
                  {action.label}
                </button>
              );
            }

            if (action.to) {
              return (
                <Link
                  key={action.label}
                  to={action.to}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-surface-soft px-4 py-4 text-sm font-medium text-text-primary transition-all duration-200 hover:bg-surface-strong hover:shadow-md hover:-translate-y-0.5"
                >
                  <Icon className="h-5 w-5 text-accent" />
                  {action.label}
                </Link>
              );
            }

            return null;
          })}
        </div>
      </CardContent>
    </Card>
  );
}

/* ─── Skeleton ───────────────────────────────────── */

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

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-6">
        <div className="space-y-2.5">
          <div className="h-6 w-64 rounded-full bg-neutral-200/60" />
          <div className="h-3.5 w-52 rounded-full bg-neutral-200/40" />
        </div>
        <div className="hidden h-10 w-36 rounded-full bg-neutral-200/60 lg:block" />
      </div>

      <SkeletonBlock className="p-6">
        <div className="space-y-3">
          <div className="h-4 w-36 rounded-full bg-neutral-200/60" />
          <div className="h-2.5 w-full rounded-full bg-neutral-200/40" />
          <div className="flex items-end justify-between">
            <div className="h-6 w-32 rounded-full bg-neutral-200/60" />
            <div className="h-4 w-24 rounded-full bg-neutral-200/40" />
          </div>
        </div>
      </SkeletonBlock>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonBlock key={i} className="p-6">
            <div className="mb-4 h-10 w-10 rounded-xl bg-neutral-200/60" />
            <div className="space-y-2">
              <div className="h-3 w-3/5 rounded-full bg-neutral-200/60" />
              <div className="h-5 w-4/5 rounded-full bg-neutral-200/40" />
              <div className="h-3 w-2/5 rounded-full bg-neutral-200/40" />
            </div>
          </SkeletonBlock>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <SkeletonBlock className="p-6 lg:col-span-2">
          <div className="mb-6 space-y-1.5">
            <div className="h-5 w-40 rounded-full bg-neutral-200/60" />
            <div className="h-3.5 w-52 rounded-full bg-neutral-200/40" />
          </div>
          <div className="flex items-end gap-4 pt-4">
            {[60, 90, 45, 75, 100, 55, 85].map((h, j) => (
              <div
                key={j}
                className="flex-1 rounded-t-lg bg-neutral-200/40"
                style={{ height: `${h * 0.45}px` }}
              />
            ))}
          </div>
        </SkeletonBlock>
        <SkeletonBlock className="p-6">
          <div className="mb-6 space-y-1.5">
            <div className="h-5 w-40 rounded-full bg-neutral-200/60" />
            <div className="h-3.5 w-44 rounded-full bg-neutral-200/40" />
          </div>
          <div className="flex items-center gap-6">
            <div className="h-36 w-36 shrink-0 rounded-full bg-neutral-200/40" />
            <div className="flex-1 space-y-3">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="h-3 w-full rounded-full bg-neutral-200/40" />
              ))}
            </div>
          </div>
        </SkeletonBlock>
      </div>

      <SkeletonBlock className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="space-y-1.5">
            <div className="h-5 w-40 rounded-full bg-neutral-200/60" />
            <div className="h-3.5 w-52 rounded-full bg-neutral-200/40" />
          </div>
          <div className="h-4 w-16 rounded-full bg-neutral-200/40" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, j) => (
            <div key={j} className="h-4 w-full rounded-full bg-neutral-200/40" />
          ))}
        </div>
      </SkeletonBlock>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────── */

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [summary, setSummary] = useState<ExpenseSummary | null>(null);
  const [categorySummary, setCategorySummary] = useState<CategorySummary[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [exportToast, setExportToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const quickActions: QuickAction[] = [
    { icon: Plus, label: "Add Expense", to: "/expenses" },
    { icon: List, label: "View All Expenses", to: "/expenses" },
    { icon: BarChart3, label: "View Analytics", to: "/analytics" },
    { icon: Download, label: "Export Expenses", onClick: () => setIsExportOpen(true) },
    { icon: Tags, label: "Manage Categories", disabled: true },
  ];

  useEffect(() => {
    async function fetchData() {
      try {
        const [userRes, summaryRes, categoryRes, expensesRes] =
          await Promise.all([
            api.get<User>("/auth/me"),
            api.get<ExpenseSummary>("/expenses/summary"),
            api.get<CategorySummary[]>("/expenses/category-summary"),
            api.get<Expense[]>("/expenses/", {
              params: { sort_by: "date", order: "desc" },
            }),
          ]);

        setUser(userRes.data);
        setSummary(summaryRes.data);
        setCategorySummary(categoryRes.data);
        setExpenses(expensesRes.data);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const greeting = useMemo(() => getGreeting(), []);
  const today = useMemo(() => formatDate(new Date()), []);
  const userName = user?.name || "there";

  const recentExpenses = useMemo(() => expenses.slice(0, 5), [expenses]);

  const currentMonthExpenses = useMemo(
    () => expenses.filter((e) => isCurrentMonth(new Date(e.expense_date))),
    [expenses],
  );

  const overviewItems: OverviewItem[] = useMemo(() => {
    if (!summary) return [];

    const monthTotal = currentMonthExpenses.reduce(
      (sum, e) => sum + Number(e.amount),
      0,
    );

    return [
      {
        icon: TrendingDown,
        title: "Total Expenses",
        amount: formatCurrency(summary.total_amount),
        subtitle: `${summary.total_expenses} transactions total`,
        accent: "danger" as const,
      },
      {
        icon: Calendar,
        title: "This Month",
        amount: formatCurrency(monthTotal),
        subtitle: `${currentMonthExpenses.length} transactions so far`,
        accent: "accent" as const,
      },
      {
        icon: Receipt,
        title: "Average Expense",
        amount: formatCurrency(summary.average_expense),
        subtitle: `Across ${summary.total_expenses} transactions`,
        accent: "accent" as const,
      },
      {
        icon: List,
        title: "Total Transactions",
        amount: String(summary.total_expenses),
        subtitle: `${currentMonthExpenses.length} this month`,
        accent: "accent" as const,
      },
    ];
  }, [summary, currentMonthExpenses]);

  const weeklyData: WeeklyPoint[] = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now);
      date.setDate(date.getDate() - (6 - i));
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
      const total = expenses
        .filter((e) => {
          const d = new Date(e.expense_date);
          return d.toDateString() === date.toDateString();
        })
        .reduce((sum, e) => sum + Number(e.amount), 0);
      return { day: dayName, spend: total };
    });
  }, [expenses]);

  const categoryData: CategorySlice[] = useMemo(() => {
    const total = categorySummary.reduce((sum, c) => sum + c.total, 0);
    return categorySummary.map((c) => ({
      name: c.category,
      value: total > 0 ? Math.round((c.total / total) * 100) : 0,
      total: c.total,
      percentage: total > 0 ? Math.round((c.total / total) * 100) : 0,
      color: getCategoryColor(c.category),
    }));
  }, [categorySummary]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl">
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* ── 1. Header ───────────────────────────── */}
      <header className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            {greeting}, {userName} 👋
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Here&apos;s an overview of your spending.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-text-secondary lg:block">
            {today}
          </span>
          <Link
            to="/expenses"
            className="inline-flex h-10 items-center gap-2 rounded-full bg-accent px-5 text-sm font-medium text-white shadow-sm shadow-accent/20 transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Expense</span>
          </Link>
        </div>
      </header>

      {/* ── 2. Budget Goal ─────────────────────── */}
      <BudgetCard />

      {/* ── 3. Financial Overview ──────────────── */}
      <OverviewGrid items={overviewItems} />

      {/* ── 4. Spending Analytics ───────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <WeeklyChart data={weeklyData} />
        </div>
        <CategoryDonut data={categoryData} />
      </div>

      {/* ── 5. Recent Expenses + Upcoming Bills ─── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {recentExpenses.length > 0 ? (
            <ExpensesTable rows={recentExpenses} />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Recent Expenses</CardTitle>
                <CardDescription>Your latest transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="py-8 text-center text-sm text-text-secondary">
                  No expenses yet. Add your first expense to get started.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
        <UpcomingBillsCard />
      </div>

      {/* ── 6. Quick Actions ────────────────────── */}
      <QuickActionsGrid actions={quickActions} />

      <ExportModal
        open={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        notify={(message, type) => setExportToast({ message, type })}
      />
      <Toast
        message={exportToast?.message ?? ""}
        type={exportToast?.type ?? "success"}
        visible={exportToast !== null}
        onDismiss={() => setExportToast(null)}
      />
    </div>
  );
}
