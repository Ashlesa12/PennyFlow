import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input } from "../components/ui";
import { AuthLayout } from "./AuthLayout";
import { api, setAuthToken } from "../api/client";

export default function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post("/auth/signup", { name, email, password });

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
      setError(detail || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout variant="signup">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-3xl border border-white/40 bg-white/70 p-8 shadow-xl shadow-black/[0.02] backdrop-blur-xl transition-all duration-300 hover:shadow-2xl"
      >
        {/* Header */}
        <div className="text-center">
          <h1 className="text-xl font-bold tracking-tight text-text-primary">
            Create Account
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Start tracking with PennyFlow
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
            label="Name"
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isSubmitting}
          />
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
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isSubmitting}
          />
          <Input
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isSubmitting}
          />

          <Button className="w-full" isLoading={isSubmitting}>
            Create Account
          </Button>
        </div>

        {/* Bottom link */}
        <p className="mt-8 text-center text-sm text-text-secondary">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-accent transition-colors hover:text-accent/80"
          >
            Sign In
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
