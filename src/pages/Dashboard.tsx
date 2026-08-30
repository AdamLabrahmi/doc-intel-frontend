import {
  Plus,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import {
  Link,
} from "react-router-dom";

import {
  useCurrentUser,
} from "@/features/auth/hooks/useCurrentUser";
import {
  DashboardCharts,
} from "@/features/dashboard/components/DashboardCharts";
import {
  DashboardStatCard,
} from "@/features/dashboard/components/DashboardStatCard";
import {
  RecentDocumentsTable,
} from "@/features/dashboard/components/RecentDocumentsTable";
import {
  useDashboardSummaryQuery,
} from "@/features/dashboard/hooks/useDashboardSummaryQuery";
import {
  buildDashboardStats,
} from "@/features/dashboard/utils/dashboard-stats.utils";
import {
  DashboardLayout,
} from "@/layouts/DashboardLayout";
import {
  ROUTES,
} from "@/routes/routePaths";

export default function Dashboard() {
  const {
    user,
    isAdmin,
    isLoading:
      isCurrentUserLoading,
  } = useCurrentUser();

  const {
    data:
      dashboardSummary,
    isLoading:
      isDashboardSummaryLoading,
    isError:
      isDashboardSummaryError,
  } = useDashboardSummaryQuery();

  const dashboardStats =
    dashboardSummary
      ? buildDashboardStats(
          dashboardSummary,
        )
      : [];

  const isLoading =
    isCurrentUserLoading ||
    isDashboardSummaryLoading;

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-[1600px] space-y-6">
        <Link
          to={
            ROUTES.documentUpload
          }
          aria-label="Importer des documents"
          className="fixed bottom-6 right-6 z-40 flex size-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/25 transition-all duration-300 hover:scale-105 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          <Plus
            className="size-6"
            aria-hidden="true"
          />
        </Link>

        {/* =====================================================
            Contexte USER / ADMIN
        ===================================================== */}

        {!isCurrentUserLoading &&
        user ? (
          <section className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-start gap-4">
              <div
                className={
                  isAdmin
                    ? "flex size-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700"
                    : "flex size-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-600"
                }
              >
                {isAdmin ? (
                  <ShieldCheck
                    className="size-5"
                    aria-hidden="true"
                  />
                ) : (
                  <UserRound
                    className="size-5"
                    aria-hidden="true"
                  />
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight text-slate-950">
                    Bonjour,{" "}
                    {user.fullName}
                  </h1>

                  <span
                    className={
                      isAdmin
                        ? "rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-blue-700"
                        : "rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-slate-600"
                    }
                  >
                    {isAdmin
                      ? "Administrateur"
                      : "Utilisateur"}
                  </span>
                </div>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                  {isAdmin
                    ? "Vous consultez une vue globale de l’activité documentaire de la plateforme : tous les documents, conversations et indicateurs disponibles."
                    : "Vous consultez votre espace personnel. Les documents, conversations et statistiques affichés correspondent uniquement à votre activité."}
                </p>
              </div>
            </div>
          </section>
        ) : null}

        {/* =====================================================
            Erreur Dashboard
        ===================================================== */}

        {isDashboardSummaryError && (
          <section
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4"
          >
            <p className="text-sm font-semibold text-red-700">
              Impossible de charger
              les statistiques du
              tableau de bord.
            </p>
          </section>
        )}

        {/* =====================================================
            Statistiques principales
        ===================================================== */}

        <section
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
          aria-label="Indicateurs principaux"
        >
          {isLoading
            ? Array.from({
                length: 4,
              }).map(
                (
                  _,
                  index,
                ) => (
                  <div
                    key={
                      index
                    }
                    className="h-[190px] animate-pulse rounded-3xl border border-slate-200 bg-white shadow-sm"
                  >
                    <div className="p-5">
                      <div className="size-12 rounded-2xl bg-slate-100" />

                      <div className="mt-5 h-4 w-32 rounded bg-slate-100" />

                      <div className="mt-3 h-8 w-20 rounded bg-slate-100" />

                      <div className="mt-3 h-3 w-40 rounded bg-slate-100" />
                    </div>
                  </div>
                ),
              )
            : dashboardStats.map(
                (
                  stat,
                  index,
                ) => (
                  <DashboardStatCard
                    key={
                      stat.title
                    }
                    stat={
                      stat
                    }
                    index={
                      index
                    }
                  />
                ),
              )}
        </section>

       

        <DashboardCharts />

       

        <RecentDocumentsTable />
      </div>
    </DashboardLayout>
  );
}