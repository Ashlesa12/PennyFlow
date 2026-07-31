import { useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Sector,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { TooltipContentProps, PieSectorDataItem } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui";
import { formatCurrency } from "../../utils/formatCurrency";
import {
  getCategoryColor,
  getCategoryIconByName,
} from "../../constants/categories";
import type { CategorySummary } from "../../types";

interface Slice {
  name: string;
  value: number;
  total: number;
  percentage: number;
  color: string;
}

function ChartTooltip({ active, payload }: TooltipContentProps) {
  if (active && payload && payload.length) {
    const data = payload[0].payload as Slice;
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

function renderActiveShape(props: PieSectorDataItem) {
  return (
    <Sector
      cx={props.cx}
      cy={props.cy}
      innerRadius={props.innerRadius}
      outerRadius={(props.outerRadius ?? 80) + 5}
      startAngle={props.startAngle}
      endAngle={props.endAngle}
      fill={props.fill}
      cornerRadius={3}
    />
  );
}

interface CategoryChartProps {
  data: CategorySummary[];
}

export function CategoryChart({ data }: CategoryChartProps) {
  const [activeIndex, setActiveIndex] = useState(-1);

  const slices: Slice[] = useMemo(() => {
    const grandTotal = data.reduce((sum, c) => sum + c.total, 0);
    return data.map((c) => ({
      name: c.category,
      value: grandTotal > 0 ? Math.round((c.total / grandTotal) * 100) : 0,
      total: c.total,
      percentage: grandTotal > 0 ? Math.round((c.total / grandTotal) * 100) : 0,
      color: getCategoryColor(c.category),
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

  const grandTotal = slices.reduce((sum, s) => sum + s.total, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Spending</CardTitle>
        <CardDescription>Where your money goes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <div className="relative h-48 w-48 shrink-0">
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-xs font-medium text-text-secondary">Total</p>
              <p className="text-lg font-bold tracking-tight text-text-primary">
                {formatCurrency(grandTotal)}
              </p>
            </div>
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
                  activeShape={renderActiveShape}
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(-1)}
                >
                  {slices.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={ChartTooltip} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="w-full space-y-2.5 sm:w-auto sm:min-w-48">
            {slices.map((item, index) => {
              const Icon = getCategoryIconByName(item.name);
              return (
                <div
                  key={item.name}
                  className={`flex items-center gap-3 rounded-xl px-2 py-1.5 transition-colors duration-200 ${
                    activeIndex === index ? "bg-border" : ""
                  }`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(-1)}
                >
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
