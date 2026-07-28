import { Link } from "react-router-dom";
import { Alert, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input } from "../components/ui";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-100 p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create account</CardTitle>
          <CardDescription>Start tracking your expenses with PennyFlow</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Alert variant="info" title="Phase 1 coming next">
            Registration will be wired up in the next phase.
          </Alert>

          <Input label="Name" type="text" placeholder="Your name" disabled />
          <Input label="Email" type="email" placeholder="you@example.com" disabled />
          <Input label="Password" type="password" placeholder="••••••••" disabled />

          <Button className="w-full" disabled>
            Create account
          </Button>

          <p className="text-center text-sm text-neutral-500">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-neutral-900 underline-offset-4 hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
