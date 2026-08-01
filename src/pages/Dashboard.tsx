import {
  ArrowRight,
  CircleAlert,
  HardDrive,
  UploadCloud,
} from "lucide-react";
import { Link } from "react-router-dom";

import { buttonVariants } from "@/components/ui/button";
import { DashboardCharts } from "@/features/dashboard/components/DashboardCharts";
import { DashboardStatCard } from "@/features/dashboard/components/DashboardStatCard";
import { RecentDocumentsTable } from "@/features/dashboard/components/RecentDocumentsTable";
import { dashboardStats } from "@/features/dashboard/data/dashboard.mock";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-[1600px] space-y-6">
        <section className="flex flex-col gap-5 rounded-3xl border border-blue-100 bg-gradient-to-br from-white via-blue-50/60 to-cyan-50/60 p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="text-sm font-bold text-blue-600">
              Bonjour Adam 👋
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Supervisez vos traitements documentaires
            </h2>

            <p className="mt-3 max-w-2xl leading-7 text-slate-600">
              Consultez les indicateurs importants, suivez les traitements
              asynchrones et identifiez rapidement les documents nécessitant
              votre attention.
            </p>
          </div>

          <Link
            to="/documents/upload"
            className={cn(
              buttonVariants({
                size: "lg",
              }),
              "group h-12 shrink-0 rounded-xl bg-blue-600 px-6 font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700",
            )}
          >
            <UploadCloud
              className="size-4"
              aria-hidden="true"
            />

            Importer des documents

            <ArrowRight
              className="size-4 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </section>

        <section
          className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4"
          aria-label="Indicateurs principaux"
        >
          {dashboardStats.map((stat, index) => (
            <DashboardStatCard
              key={stat.title}
              stat={stat}
              index={index}
            />
          ))}
        </section>

        <DashboardCharts />

        <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
          <RecentDocumentsTable />

          <aside className="space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <HardDrive
                    className="size-5"
                    aria-hidden="true"
                  />
                </span>

                <div>
                  <h2 className="font-bold text-slate-950">
                    Stockage MinIO
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Espace utilisé
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-end justify-between">
                  <p className="text-3xl font-bold text-slate-950">
                    68,4
                    <span className="ml-1 text-base text-slate-500">
                      Go
                    </span>
                  </p>

                  <p className="text-xs font-bold text-blue-600">
                    68 %
                  </p>
                </div>

                <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-blue-600 to-cyan-400" />
                </div>

                <p className="mt-3 text-xs text-slate-500">
                  Capacité totale : 100 Go
                </p>
              </div>
            </section>

            <section className="rounded-3xl border border-red-100 bg-red-50/70 p-5">
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-red-600 shadow-sm">
                  <CircleAlert
                    className="size-5"
                    aria-hidden="true"
                  />
                </span>

                <div>
                  <h2 className="font-bold text-slate-950">
                    Documents à vérifier
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    22 traitements ont échoué et nécessitent une intervention.
                  </p>

                  <button
                    type="button"
                    className="mt-4 text-sm font-bold text-red-600 hover:text-red-700"
                  >
                    Consulter les erreurs
                  </button>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
}