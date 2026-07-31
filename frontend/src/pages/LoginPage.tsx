import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input } from "../components/ui";
import { AuthLayout } from "./AuthLayout";
import { api, setAuthToken } from "../api/client";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const params = new URLSearchParams();
      params.append("username", email);
      params.append("password", password);

      const res = await api.post("/auth/login", params, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      setAuthToken(res.data.access_token);
      navigate("/dashboard", { replace: true });
    } catch (err: unknown) {
      const detail =
        (err as { response?: { data?: { detail?: string } } })?.response?.data
          ?.detail;
      setError(detail || "Invalid email or password");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-3xl border border-border-strong bg-surface-elevated p-8 shadow-xl shadow-black/[0.02] backdrop-blur-xl transition-all duration-300 hover:shadow-2xl"
      >
        {/* Header */}
        <div className="text-center">
          <h1 className="text-xl font-bold tracking-tight text-text-primary">
            Welcome Back 👋
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Continue where you left off.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-xl bg-danger/10 px-4 py-3 text-sm font-medium text-danger">
            {error}
          </div>
        )}

        {/* Form fields */}
        <div className="mt-6 space-y-5">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isSubmitting}
          />

          {/* Remember me + Forgot password */}
          <div className="flex items-center justify-between">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-border-strong bg-surface-muted text-accent accent-accent focus:ring-accent/30"
              />
              <span className="text-sm text-text-secondary">Remember me</span>
            </label>
            <button
              type="button"
              className="text-sm font-medium text-accent transition-colors hover:text-accent/80"
            >
              Forgot password?
            </button>
          </div>

          <Button className="w-full" isLoading={isSubmitting}>
            Sign In
          </Button>
        </div>

        {/* Bottom link */}
        <p className="mt-8 text-center text-sm text-text-secondary">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-accent transition-colors hover:text-accent/80"
          >
            Create Account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
