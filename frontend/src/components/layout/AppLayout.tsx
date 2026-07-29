import { type ReactNode, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#F7F6F2]">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full bg-emerald-500/5 blur-[150px]" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-amber-400/3 blur-[120px]" />
      </div>

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-[18rem]">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
