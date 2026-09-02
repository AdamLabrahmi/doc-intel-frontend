import {
  useState,
  type ReactNode,
} from "react";

import {
  DashboardHeader,
} from "@/components/navigation/DashboardHeader";

import {
  DashboardSidebar,
} from "@/components/navigation/DashboardSidebar";

import {
  logoutCurrentUser,
} from "@/features/auth/services/logout.service";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const [
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
  ] = useState(false);

  const handleLogout =
    async () => {
      await logoutCurrentUser();
    };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
      <DashboardSidebar
        isMobileOpen={
          isMobileSidebarOpen
        }
        onMobileClose={() => {
          setIsMobileSidebarOpen(
            false,
          );
        }}
        onLogout={() => {
          void handleLogout();
        }}
      />

      <div className="min-h-screen lg:pl-72">
        <DashboardHeader
          onOpenSidebar={() => {
            setIsMobileSidebarOpen(
              true,
            );
          }}
          onLogout={() => {
            void handleLogout();
          }}
        />

        <main className="px-5 py-6 sm:px-8 sm:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}