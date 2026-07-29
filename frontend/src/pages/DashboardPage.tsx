import { useMemo } from "react";
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
} from "recharts";
import type { TooltipProps } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui";

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

interface ExpenseRow {
  category: string;
  color: string;
  title: string;
  date: string;
  amount: string;
}

interface QuickAction {
  icon: LucideIcon;
  label: string;
  to?: string;
  disabled?: boolean;
}

interface CategorySlice {
  name: string;
  value: number;
  color: string;
}

/* ─── Placeholder Data ──────────────────────────── */

const overviewItems: OverviewItem[] = [
  {
    icon: TrendingDown,
    title: "Total Expenses",
    amount: "$4,920.00",
    subtitle: "2.1% vs last month",
    accent: "danger",
  },
  {
    icon: Calendar,
    title: "This Month",
    amount: "$1,245.00",
    subtitle: "12 transactions so far",
    accent: "accent",
  },
  {
    icon: Receipt,
    title: "Average Expense",
    amount: "$54.67",
    subtitle: "Across 90 transactions",
    accent: "accent",
  },
  {
    icon: List,
    title: "Total Transactions",
    amount: "156",
    subtitle: "8 this month",
    accent: "accent",
  },
];

const weeklyData: WeeklyPoint[] = [
  { day: "Mon", spend: 580 },
  { day: "Tue", spend: 720 },
  { day: "Wed", spend: 450 },
  { day: "Thu", spend: 890 },
  { day: "Fri", spend: 340 },
  { day: "Sat", spend: 620 },
  { day: "Sun", spend: 280 },
];

const categoryData: CategorySlice[] = [
  { name: "Food", value: 35, color: "#10B981" },
  { name: "Transport", value: 20, color: "#3B82F6" },
  { name: "Shopping", value: 15, color: "#8B5CF6" },
  { name: "Bills", value: 12, color: "#F59E0B" },
  { name: "Entertainment", value: 10, color: "#EC4899" },
  { name: "Healthcare", value: 8, color: "#06B6D4" },
];

const recentExpenses: ExpenseRow[] = [
  { category: "Food", color: "#10B981", title: "Burger King", date: "Today", amount: "-$18.00" },
  { category: "Transport", color: "#3B82F6", title: "Uber", date: "Yesterday", amount: "-$11.00" },
  { category: "Bills", color: "#F59E0B", title: "Electricity", date: "2 days ago", amount: "-$45.00" },
  { category: "Shopping", color: "#8B5CF6", title: "Amazon", date: "4 days ago", amount: "-$79.00" },
  { category: "Healthcare", color: "#06B6D4", title: "Pharmacy", date: "Last week", amount: "-$22.00" },
];

const quickActions: QuickAction[] = [
  { icon: Plus, label: "Add Expense", to: "/expenses" },
  { icon: List, label: "View All Expenses", to: "/expenses" },
  { icon: BarChart3, label: "View Analytics", disabled: true },
  { icon: Tags, label: "Manage Categories", disabled: true },
];

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

/* ─── Chart Tooltip ─────────────────────────────── */

function ChartTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-white/40 bg-white/80 px-3 py-2 text-sm shadow-lg shadow-black/[0.02] backdrop-blur-xl">
        <p className="text-xs text-text-secondary">{label}</p>
        <p className="font-semibold text-text-primary">
          ${payload[0].value?.toLocaleString()}
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
            className="rounded-3xl border border-white/40 bg-white/70 p-6 shadow-lg shadow-black/[0.02] backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
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
                stroke="rgba(0,0,0,0.04)"
                vertical={false}
              />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#8c8a8b" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#8c8a8b" }}
                tickFormatter={(v: number) => `$${v}`}
              />
              <Tooltip content={<ChartTooltip />} />
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

function CategoryDonut({ data }: { data: CategorySlice[] }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Category Breakdown</CardTitle>
        <CardDescription>Where your money goes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <div className="h-44 w-44 shrink-0">
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
                >
                  {data.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid w-full grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-1 sm:w-auto">
            {data.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
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

function ExpensesTable({ rows }: { rows: ExpenseRow[] }) {
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
              <tr className="border-b border-white/40 text-left text-xs font-medium text-text-secondary">
                <th className="px-6 pb-3 font-medium">Category</th>
                <th className="px-6 pb-3 font-medium">Title</th>
                <th className="px-6 pb-3 font-medium">Date</th>
                <th className="px-6 pb-3 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={`${row.title}-${i}`}
                  className="border-b border-white/20 transition-colors last:border-none hover:bg-black/[0.02]"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: row.color }}
                      />
                      <span className="text-sm text-text-primary">
                        {row.category}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-primary">
                    {row.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary">
                    {row.date}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium text-text-primary">
                    {row.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-white/40 p-4 text-center sm:hidden">
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
                  className="flex cursor-not-allowed flex-col items-center gap-2 rounded-2xl border border-white/30 bg-white/50 px-4 py-4 text-sm font-medium text-text-secondary/50 opacity-50 transition-all duration-200"
                >
                  <Icon className="h-5 w-5" />
                  {action.label}
                </button>
              );
            }

            if (action.to) {
              return (
                <Link
                  key={action.label}
                  to={action.to}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-white/30 bg-white/50 px-4 py-4 text-sm font-medium text-text-primary transition-all duration-200 hover:bg-white/80 hover:shadow-md hover:-translate-y-0.5"
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

/* ─── Page ──────────────────────────────────────── */

export default function DashboardPage() {
  const greeting = useMemo(() => getGreeting(), []);
  const today = useMemo(() => formatDate(new Date()), []);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* ── 1. Header ───────────────────────────── */}
      <header className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            {greeting}, Ashlesa 👋
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
            className="inline-flex h-10 items-center gap-2 rounded-full bg-accent px-5 text-sm font-medium text-surface shadow-sm shadow-accent/20 transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Expense</span>
          </Link>
        </div>
      </header>

      {/* ── 2. Financial Overview ──────────────── */}
      <OverviewGrid items={overviewItems} />

      {/* ── 3. Spending Analytics ───────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <WeeklyChart data={weeklyData} />
        </div>
        <CategoryDonut data={categoryData} />
      </div>

      {/* ── 4. Recent Expenses ──────────────────── */}
      <ExpensesTable rows={recentExpenses} />

      {/* ── 5. Quick Actions ────────────────────── */}
      <QuickActionsGrid actions={quickActions} />
    </div>
  );
}
