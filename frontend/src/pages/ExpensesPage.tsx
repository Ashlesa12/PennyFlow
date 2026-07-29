import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui";

export default function ExpensesPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header className="flex items-center gap-4">
        <Link
          to="/dashboard"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/70 text-neutral-500 shadow-sm shadow-black/[0.02] backdrop-blur-sm transition-all duration-200 hover:bg-white/90 hover:text-neutral-800"
          aria-label="Back to dashboard"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Expenses
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Manage your transactions
          </p>
        </div>
      </header>

      <Card
        variant="dashed"
        className="flex min-h-80 items-center justify-center"
      >
        <CardHeader className="mb-0 text-center">
          <CardTitle>Expense list</CardTitle>
          <CardDescription>
            Your expense table will be built in Phase 2
          </CardDescription>
        </CardHeader>
        <CardContent />
      </Card>
    </div>
  );
}
