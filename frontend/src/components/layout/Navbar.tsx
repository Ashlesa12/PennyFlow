import { useState } from "react";
import { Search, Bell, Menu, ChevronDown } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

interface NavbarProps {
  onMenuClick: () => void;
}

const routeTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/expenses": "Expenses",
  "/income": "Income",
  "/analytics": "Analytics",
  "/recurring": "Recurring",
  "/categories": "Categories",
  "/settings": "Settings",
};

const routeSubtitles: Record<string, string> = {
  "/dashboard": "Welcome back",
  "/expenses": "Manage your transactions",
  "/income": "Track your earnings",
  "/analytics": "Spending insights",
  "/recurring": "Subscriptions & bills",
  "/categories": "Organize your spending",
  "/settings": "Account preferences",
};

export function Navbar({ onMenuClick }: NavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const term = query.trim();
    navigate(term ? `/expenses?q=${encodeURIComponent(term)}` : "/expenses");
    setQuery("");
  };

  const title = routeTitles[location.pathname] || "Overview";
  const subtitle = routeSubtitles[location.pathname] || "";

  return (
    <header className="sticky top-6 z-30 mx-6 flex h-[72px] items-center justify-between gap-6 rounded-full glass px-5 shadow-glass lg:px-6">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <button
          onClick={onMenuClick}
          className="flex h-10 w-10 items-center justify-center rounded-full text-text-secondary transition-all duration-200 hover:bg-surface/50 hover:text-text-primary lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="min-w-0">
          <h1 className="truncate text-base font-semibold tracking-tight text-text-primary">
            {title}
          </h1>
          {subtitle && (
            <p className="truncate text-xs text-text-secondary">{subtitle}</p>
          )}
        </div>
      </div>

      <form onSubmit={handleSearch} role="search" className="hidden sm:block">
        <div className="relative">
          <button
            type="submit"
            aria-label="Search expenses"
            className="absolute left-4 top-1/2 flex h-4 w-4 -translate-y-1/2 items-center justify-center text-text-tertiary transition-colors hover:text-accent"
          >
            <Search className="h-4 w-4" />
          </button>
          <input
            type="search"
            placeholder="Search expenses..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-10 w-56 rounded-full border border-border bg-surface-soft pl-10 pr-4 text-sm text-text-primary outline-none transition-all duration-200 placeholder:text-text-tertiary focus:w-72 focus:border-accent/30 focus:bg-surface-elevated lg:w-64"
          />
        </div>
      </form>

      <div className="flex items-center gap-2 flex-1 justify-end">
        <button
          className="relative flex h-10 w-10 items-center justify-center rounded-full text-text-secondary transition-all duration-200 hover:bg-surface/50 hover:text-text-primary"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-accent ring-2 ring-surface" />
        </button>

        <button className="flex items-center gap-2 rounded-full bg-accent py-1 pl-1 pr-3 text-sm font-medium text-white transition-all duration-200 hover:opacity-90">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-xs font-semibold">
            U
          </span>
          <span className="hidden lg:inline">User</span>
          <ChevronDown className="h-3.5 w-3.5 opacity-70" />
        </button>
      </div>
    </header>
  );
}
