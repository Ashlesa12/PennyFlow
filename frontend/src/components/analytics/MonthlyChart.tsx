import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { TooltipContentProps } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui";
import { formatCurrency, getCurrencySymbol } from "../../utils/formatCurrency";
import type { MonthlySummary } from "../../types";

function formatMonthLabel(ym: string): string {
  const [, m] = ym.split("-");
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return months[parseInt(m, 10) - 1] || ym;
}

function ChartTooltip({ active, payload, label }: TooltipContentProps) {
  if (active && payload && payload.length) {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];
    const labelStr = String(label ?? "");
    const [, m] = labelStr.split("-");
    const monthName = months[parseInt(m, 10) - 1] || labelStr;
    return (
      <div className="rounded-xl border border-border-strong bg-surface-strong px-3 py-2 text-sm shadow-lg shadow-black/[0.02] backdrop-blur-xl">
        <p className="text-xs text-text-secondary">{monthName}</p>
        <p className="font-semibold text-text-primary">
          {formatCurrency(Number(payload[0].value ?? 0))}
        </p>
      </div>
    );
  }
  return null;
}

interface MonthlyChartProps {
  data: MonthlySummary[];
}

export function MonthlyChart({ data }: MonthlyChartProps) {
  const chartData = data.map((d) => ({
    month: formatMonthLabel(d.month),
    fullMonth: d.month,
    amount: Math.round(d.total),
  }));

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Monthly Spending</CardTitle>
          <CardDescription>Your spending over time</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="py-8 text-center text-sm text-text-secondary">
            No monthly data yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Spending</CardTitle>
        <CardDescription>Your spending over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                tickFormatter={(v: number) => `${getCurrencySymbol()} ${v}`}
              />
              <Tooltip content={ChartTooltip} />
              <Bar
                dataKey="amount"
                radius={[8, 8, 0, 0]}
                maxBarSize={48}
                fill="#10B981"
                animationDuration={300}
                activeBar={{ fill: "rgba(16, 185, 129, 0.8)" }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
