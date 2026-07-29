import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { getAuthToken } from "../api/client";
import { AppLayout } from "../components/layout/AppLayout";
import DashboardPage from "../pages/DashboardPage";
import ExpensesPage from "../pages/ExpensesPage";
import LoginPage from "../pages/LoginPage";
import NotFoundPage from "../pages/NotFoundPage";
import SignupPage from "../pages/SignupPage";
import { ProtectedRoute } from "./ProtectedRoute";

function PublicOnlyRoute() {
  const token = getAuthToken();

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout><Outlet /></AppLayout>}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/expenses" element={<ExpensesPage />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
