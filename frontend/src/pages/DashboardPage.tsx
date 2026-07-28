import { LayoutDashboard, Receipt } from "lucide-react";
import { Link } from "react-router-dom";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-neutral-100 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">Dashboard</h1>
            <p className="text-sm text-neutral-500">Your spending overview</p>
          </div>

          <Link
            to="/expenses"
            className="inline-flex h-9 items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-50"
          >
            <Receipt className="h-4 w-4" />
            Expenses
          </Link>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          <Card variant="dark">
            <CardHeader>
              <CardTitle className="text-white">Overall Summary</CardTitle>
              <CardDescription className="text-neutral-400">
                Charts and stats will appear here in Phase 4
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {["Total spent", "Transactions", "Average", "Highest"].map((label) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-neutral-700 px-4 py-3"
                  >
                    <p className="text-xs text-neutral-400">{label}</p>
                    <p className="mt-1 text-lg font-semibold text-white">—</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LayoutDashboard className="h-5 w-5" />
                Quick actions
              </CardTitle>
              <CardDescription>Foundation routes are ready</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" disabled>
                + Add expense
              </Button>
              <Link to="/expenses" className="block">
                <Button variant="secondary" className="w-full">
                  View all expenses
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
