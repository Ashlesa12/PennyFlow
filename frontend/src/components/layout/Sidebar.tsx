import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Receipt,
  Wallet,
  BarChart3,
  RefreshCw,
  Tags,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "../../utils/cn";
import { removeAuthToken } from "../../api/client";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Expenses", path: "/expenses", icon: Receipt },
  { label: "Income", path: "/income", icon: Wallet },
  { label: "Analytics", path: "/analytics", icon: BarChart3 },
  { label: "Recurring", path: "/recurring", icon: RefreshCw },
  { label: "Categories", path: "/categories", icon: Tags },
  { label: "Settings", path: "/settings", icon: Settings },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    removeAuthToken();
    navigate("/login");
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-[var(--color-overlay)] backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed left-6 top-6 z-50 flex h-[calc(100vh-3rem)] w-60 flex-col glass-strong rounded-2xl p-6 shadow-glass transition-transform duration-300 ease-out-expo",
          "lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="mb-10 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent shadow-sm shadow-accent/20">
            <span className="text-sm font-bold text-white">P</span>
          </div>
          <span className="text-lg font-semibold tracking-tight text-text-primary">
            PennyFlow
          </span>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-surface text-accent shadow-sm"
                    : "text-text-secondary hover:translate-x-0.5 hover:bg-surface/40 hover:text-text-primary",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-text-secondary transition-all duration-200 hover:translate-x-0.5 hover:bg-surface/40 hover:text-danger"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Logout
        </button>
      </aside>
    </>
  );
}
