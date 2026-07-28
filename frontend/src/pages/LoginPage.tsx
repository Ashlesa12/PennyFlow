import { Link } from "react-router-dom";
import { Alert, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input } from "../components/ui";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-100 p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>Sign in to your PennyFlow account</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Alert variant="info" title="Phase 1 coming next">
            Authentication forms will be wired up in the next phase.
          </Alert>

          <Input label="Email" type="email" placeholder="you@example.com" disabled />
          <Input label="Password" type="password" placeholder="••••••••" disabled />

          <Button className="w-full" disabled>
            Sign in
          </Button>

          <p className="text-center text-sm text-neutral-500">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="font-medium text-neutral-900 underline-offset-4 hover:underline">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
