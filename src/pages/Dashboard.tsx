import {
  useEffect,
  useState,
} from "react";

import {
  Plus,
  RefreshCw,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import {
  useCurrentUser,
} from "@/features/auth/hooks/useCurrentUser";

import {
  AdminUsersOverview,
} from "@/features/dashboard/components/AdminUsersOverview";

import {
  DashboardCharts,
} from "@/features/dashboard/components/DashboardCharts";

import {
  DashboardStatCard,
} from "@/features/dashboard/components/DashboardStatCard";

import {
  DocumentsAttentionPanel,
} from "@/features/dashboard/components/DocumentsAttentionPanel";

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
  useDocumentsQuery,
} from "@/features/documents/hooks/useDocumentsQuery";

import {
  DashboardLayout,
} from "@/layouts/DashboardLayout";

import {
  ROUTES,
} from "@/routes/routePaths";

function formatLastUpdate(
  value: Date | null,
): string {
  if (!value) {
    return "Non disponible";
  }

  return new Intl.DateTimeFormat(
    "fr-FR",
    {
      hour:
        "2-digit",

      minute:
        "2-digit",

      second:
        "2-digit",
    },
  ).format(
    value,
  );
}

export default function Dashboard() {
  const [
    lastUpdatedAt,
    setLastUpdatedAt,
  ] =
    useState<Date | null>(
      null,
    );

  const {
    isLoading:
      isCurrentUserLoading,
  } =
    useCurrentUser();

  const {
    data:
      dashboardSummary,

    isLoading:
      isDashboardSummaryLoading,

    isError:
      isDashboardSummaryError,

    isFetching:
      isDashboardSummaryFetching,

    refetch:
      refetchDashboardSummary,
  } =
    useDashboardSummaryQuery();

  const {
    data:
      documents,

    isFetching:
      isDocumentsFetching,

    refetch:
      refetchDocuments,
  } =
    useDocumentsQuery();

  const dashboardStats =
    dashboardSummary
      ? buildDashboardStats(
          dashboardSummary,
        )
      : [];

  const isLoading =
    isCurrentUserLoading ||
    isDashboardSummaryLoading;

  const isRefreshing =
    isDashboardSummaryFetching ||
    isDocumentsFetching;

  useEffect(
    () => {
      if (
        !dashboardSummary ||
        documents === undefined
      ) {
        return;
      }

      setLastUpdatedAt(
        new Date(),
      );
    },
    [
      dashboardSummary,
      documents,
    ],
  );

  const handleRefresh =
    async () => {
      await Promise.allSettled([
        refetchDashboardSummary(),
        refetchDocuments(),
      ]);

      setLastUpdatedAt(
        new Date(),
      );
    };

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-[1600px] space-y-6">
        {/* =====================================================
            Action principale
        ===================================================== */}

        <Link
          to={
            ROUTES.documentUpload
          }
          aria-label="Importer des documents"
          className="fixed bottom-6 right-6 z-40 flex size-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/25 transition-all duration-300 hover:scale-105 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
        >
          <Plus
            className="size-6"
            aria-hidden="true"
          />
        </Link>

        {/* =====================================================
            Introduction + actualisation
        ===================================================== */}

        <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-slate-950 dark:text-white">
              Vue d’ensemble
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Suivi global de l’activité documentaire
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="text-right">
              <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
                Dernière mise à jour
              </p>

              <p className="mt-0.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
                {formatLastUpdate(
                  lastUpdatedAt,
                )}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                void handleRefresh();
              }}
              disabled={
                isRefreshing
              }
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-600 shadow-sm transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-500/40 dark:hover:bg-blue-500/10 dark:hover:text-blue-400 dark:focus-visible:ring-offset-slate-950"
            >
              <RefreshCw
                className={`size-4 ${
                  isRefreshing
                    ? "animate-spin"
                    : ""
                }`}
                aria-hidden="true"
              />

              {isRefreshing
                ? "Actualisation..."
                : "Actualiser"}
            </button>
          </div>
        </section>

        {/* =====================================================
            Erreur Dashboard
        ===================================================== */}

        {isDashboardSummaryError ? (
          <section
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 dark:border-red-900/50 dark:bg-red-950/30"
          >
            <p className="text-sm font-semibold text-red-700 dark:text-red-300">
              Impossible de charger les statistiques du tableau de bord.
            </p>
          </section>
        ) : null}

        {/* =====================================================
            KPI
        ===================================================== */}

        <section
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
          aria-label="Indicateurs principaux"
        >
          {isLoading
            ? Array.from({
                length:
                  4,
              }).map(
                (
                  _,
                  index,
                ) => (
                  <div
                    key={
                      index
                    }
                    className="h-[190px] animate-pulse rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className="p-5">
                      <div className="size-12 rounded-2xl bg-slate-100 dark:bg-slate-800" />

                      <div className="mt-5 h-4 w-32 rounded bg-slate-100 dark:bg-slate-800" />

                      <div className="mt-3 h-8 w-20 rounded bg-slate-100 dark:bg-slate-800" />

                      <div className="mt-3 h-3 w-40 rounded bg-slate-100 dark:bg-slate-800" />
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

        {/* =====================================================
            Graphiques
        ===================================================== */}

        <DashboardCharts />

        {/* =====================================================
            Documents nécessitant une attention
        ===================================================== */}

        <DocumentsAttentionPanel />

        {/* =====================================================
            Administration
        ===================================================== */}

        <AdminUsersOverview />

        {/* =====================================================
            Documents récents
        ===================================================== */}

        <RecentDocumentsTable />
      </div>
    </DashboardLayout>
  );
}