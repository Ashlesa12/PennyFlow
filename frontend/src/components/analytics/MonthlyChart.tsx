import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { TooltipProps } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui";
import { formatCurrency } from "../../utils/formatCurrency";
import type { MonthlySummary } from "../../types";

function formatMonthLabel(ym: string): string {
  const [, m] = ym.split("-");
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return months[parseInt(m, 10) - 1] || ym;
}

function ChartTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (active && payload && payload.length) {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];
    const [, m] = label.split("-");
    const monthName = months[parseInt(m, 10) - 1] || label;
    return (
      <div className="rounded-xl border border-white/40 bg-white/80 px-3 py-2 text-sm shadow-lg shadow-black/[0.02] backdrop-blur-xl">
        <p className="text-xs text-text-secondary">{monthName}</p>
        <p className="font-semibold text-text-primary">
          {formatCurrency(payload[0].value ?? 0)}
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
                stroke="rgba(0,0,0,0.04)"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#8c8a8b" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#8c8a8b" }}
                tickFormatter={(v: number) => `Rs. ${v}`}
              />
              <Tooltip content={<ChartTooltip />} />
              <Bar
                dataKey="amount"
                radius={[8, 8, 0, 0]}
                maxBarSize={48}
                fill="#10B981"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
