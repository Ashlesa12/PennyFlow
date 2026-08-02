import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { getAuthToken } from "../api/client";
import { AppLayout } from "../components/layout/AppLayout";
import AnalyticsPage from "../pages/AnalyticsPage";
import CategoriesPage from "../pages/CategoriesPage";
import DashboardPage from "../pages/DashboardPage";
import ExpensesPage from "../pages/ExpensesPage";
import IncomePage from "../pages/IncomePage";
import LoginPage from "../pages/LoginPage";
import NotFoundPage from "../pages/NotFoundPage";
import RecurringPage from "../pages/RecurringPage";
import SettingsPage from "../pages/SettingsPage";
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
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/income" element={<IncomePage />} />
          <Route path="/recurring" element={<RecurringPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
