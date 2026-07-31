import { type ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { api, getAuthToken } from "../../api/client";
import type { User } from "../../types";
import { applyTheme, type Theme } from "../../utils/theme";

interface AppLayoutProps {
  children: ReactNode;
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (!getAuthToken()) return;
    let cancelled = false;

    api
      .get<User>("/users/me")
      .then((res) => {
        if (!cancelled && res.data.theme) {
          applyTheme(res.data.theme as Theme, false);
        }
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-bg">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full bg-emerald-500/5 blur-[150px]" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-amber-400/3 blur-[120px]" />
      </div>

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-[18rem]">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-6 lg:p-8">
          <div
            key={location.pathname}
            className={prefersReducedMotion() ? "" : "animate-[pageEnter_250ms_ease-out]"}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
