import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

import { DashboardCharts } from "@/features/dashboard/components/DashboardCharts";
import { DashboardStatCard } from "@/features/dashboard/components/DashboardStatCard";
import { RecentDocumentsTable } from "@/features/dashboard/components/RecentDocumentsTable";
import { useDashboardSummaryQuery } from "@/features/dashboard/hooks/useDashboardSummaryQuery";
import { buildDashboardStats } from "@/features/dashboard/utils/dashboard-stats.utils";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { ROUTES } from "@/routes/routePaths";

export default function Dashboard() {
  const {
    data: dashboardSummary,
    isLoading: isDashboardSummaryLoading,
    isError: isDashboardSummaryError,
  } = useDashboardSummaryQuery();

  const dashboardStats = dashboardSummary
    ? buildDashboardStats(dashboardSummary)
    : [];

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-[1600px] space-y-6">
        <Link
          to={ROUTES.documentUpload}
          aria-label="Importer des documents"
          className="fixed bottom-6 right-6 z-40 flex size-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/25 transition-all duration-300 hover:scale-105 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          <Plus
            className="size-6"
            aria-hidden="true"
          />
        </Link>

        {isDashboardSummaryError && (
          <section
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4"
          >
            <p className="text-sm font-semibold text-red-700">
              Impossible de charger les statistiques du tableau de bord.
            </p>
          </section>
        )}

        <section
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
          aria-label="Indicateurs principaux"
        >
          {isDashboardSummaryLoading
            ? Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[190px] animate-pulse rounded-3xl border border-slate-200 bg-white shadow-sm"
                >
                  <div className="p-5">
                    <div className="size-12 rounded-2xl bg-slate-100" />

                    <div className="mt-5 h-4 w-32 rounded bg-slate-100" />

                    <div className="mt-3 h-8 w-20 rounded bg-slate-100" />

                    <div className="mt-3 h-3 w-40 rounded bg-slate-100" />
                  </div>
                </div>
              ))
            : dashboardStats.map((stat, index) => (
                <DashboardStatCard
                  key={stat.title}
                  stat={stat}
                  index={index}
                />
              ))}
        </section>

        <DashboardCharts />

        <RecentDocumentsTable />
      </div>
    </DashboardLayout>
  );
}