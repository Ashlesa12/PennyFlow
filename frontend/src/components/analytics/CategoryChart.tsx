import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { TooltipProps } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui";
import { formatCurrency } from "../../utils/formatCurrency";
import { getCategoryIcon } from "../../constants/categories";
import type { CategorySummary } from "../../types";

const CATEGORY_COLORS: Record<string, string> = {
  "Food & Dining": "#10B981",
  Transportation: "#3B82F6",
  Shopping: "#8B5CF6",
  Entertainment: "#EC4899",
  "Bills & Utilities": "#F59E0B",
  Health: "#06B6D4",
  Travel: "#F97316",
  Other: "#6B7280",
};

interface Slice {
  name: string;
  value: number;
  total: number;
  percentage: number;
  color: string;
}

function ChartTooltip({ active, payload }: TooltipProps<number, string>) {
  if (active && payload && payload.length) {
    const data = payload[0].payload as Slice;
    return (
      <div className="rounded-xl border border-white/40 bg-white/80 px-3 py-2 text-sm shadow-lg shadow-black/[0.02] backdrop-blur-xl">
        <p className="font-medium text-text-primary">{data.name}</p>
        <p className="text-xs text-text-secondary">
          {formatCurrency(data.total)} ({data.percentage}%)
        </p>
      </div>
    );
  }
  return null;
}

interface CategoryChartProps {
  data: CategorySummary[];
}

export function CategoryChart({ data }: CategoryChartProps) {
  const slices: Slice[] = useMemo(() => {
    const grandTotal = data.reduce((sum, c) => sum + c.total, 0);
    return data.map((c) => ({
      name: c.category,
      value: grandTotal > 0 ? Math.round((c.total / grandTotal) * 100) : 0,
      total: c.total,
      percentage: grandTotal > 0 ? Math.round((c.total / grandTotal) * 100) : 0,
      color: CATEGORY_COLORS[c.category] || "#6B7280",
    }));
  }, [data]);

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Category Spending</CardTitle>
          <CardDescription>Where your money goes</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="py-8 text-center text-sm text-text-secondary">
            No category data yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Spending</CardTitle>
        <CardDescription>Where your money goes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <div className="h-48 w-48 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={slices}
                  cx="50%"
                  cy="50%"
                  innerRadius={56}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {slices.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="w-full space-y-2.5 sm:w-auto sm:min-w-48">
            {slices.map((item) => {
              const Icon = getCategoryIcon(
                item.name === "Food & Dining" ? 1
                : item.name === "Transportation" ? 2
                : item.name === "Shopping" ? 3
                : item.name === "Entertainment" ? 4
                : item.name === "Bills & Utilities" ? 5
                : item.name === "Health" ? 6
                : item.name === "Travel" ? 7
                : 8
              );
              return (
                <div key={item.name} className="flex items-center gap-3">
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${item.color}18` }}
                  >
                    <Icon className="h-3.5 w-3.5" style={{ color: item.color }} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-text-primary">
                      {item.name}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {formatCurrency(item.total)} &middot; {item.percentage}%
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
