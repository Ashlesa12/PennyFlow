import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui";

export default function ExpensesPage() {
  return (
    <div className="min-h-screen bg-neutral-100 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex items-center gap-4">
          <Link
            to="/dashboard"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 transition-colors hover:bg-neutral-50"
            aria-label="Back to dashboard"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>

          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">Expenses</h1>
            <p className="text-sm text-neutral-500">Manage your transactions</p>
          </div>
        </header>

        <Card variant="dashed" className="flex min-h-64 items-center justify-center">
          <CardHeader className="mb-0 text-center">
            <CardTitle>Expense list</CardTitle>
            <CardDescription>
              Your expense table will be built in Phase 2
            </CardDescription>
          </CardHeader>
          <CardContent />
        </Card>
      </div>
    </div>
  );
}
