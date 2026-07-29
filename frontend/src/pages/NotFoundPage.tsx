import { Link } from "react-router-dom";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui";

export default function NotFoundPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#F7F6F2] p-6">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full bg-emerald-500/5 blur-[150px]" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-amber-400/3 blur-[120px]" />
      </div>

      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle>Page not found</CardTitle>
          <CardDescription>
            The page you are looking for does not exist.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link to="/dashboard">
            <Button>Go to dashboard</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
