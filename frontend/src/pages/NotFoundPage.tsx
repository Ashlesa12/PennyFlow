import { Link } from "react-router-dom";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-100 p-6">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle>Page not found</CardTitle>
          <CardDescription>The page you are looking for does not exist.</CardDescription>
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
