import {
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";

import { DashboardHeader } from "@/components/navigation/DashboardHeader";
import { DashboardSidebar } from "@/components/navigation/DashboardSidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const navigate = useNavigate();

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] =
    useState(false);

  const handleLogout = () => {
    console.log("Déconnexion statique");

    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <DashboardSidebar
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => {
          setIsMobileSidebarOpen(false);
        }}
        onLogout={handleLogout}
      />

      <div className="min-h-screen lg:pl-72">
        <DashboardHeader
          onOpenSidebar={() => {
            setIsMobileSidebarOpen(true);
          }}
        />

        <main className="px-5 py-6 sm:px-8 sm:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}