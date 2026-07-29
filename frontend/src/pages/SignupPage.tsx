import { Link } from "react-router-dom";
import {
  Alert,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
} from "../components/ui";

export default function SignupPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#F7F6F2] p-6">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full bg-emerald-500/5 blur-[150px]" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-amber-400/3 blur-[120px]" />
      </div>

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-sm shadow-emerald-500/20">
            <span className="text-lg font-bold text-white">P</span>
          </div>
          <CardTitle>Create account</CardTitle>
          <CardDescription>
            Start tracking your expenses with PennyFlow
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <Alert variant="default">
            <span className="font-medium">Phase 1 coming next</span> &mdash;
            Registration will be wired up in the next phase.
          </Alert>

          <Input
            label="Name"
            type="text"
            placeholder="Your name"
            disabled
          />
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            disabled
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            disabled
          />

          <Button className="w-full" disabled>
            Create account
          </Button>

          <p className="text-center text-sm text-neutral-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-emerald-600 underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
