import {
  CheckCircle2,
  CircleAlert,
  Clock3,
  Eye,
  FileText,
  LoaderCircle,
  MoreHorizontal,
} from "lucide-react";

import { recentDocuments } from "@/features/dashboard/data/dashboard.mock";
import { cn } from "@/lib/utils";

const statusStyles = {
  Terminé: {
    className: "bg-emerald-50 text-emerald-700",
    icon: CheckCircle2,
  },
  "En cours": {
    className: "bg-blue-50 text-blue-700",
    icon: LoaderCircle,
  },
  "En attente": {
    className: "bg-amber-50 text-amber-700",
    icon: Clock3,
  },
  Échec: {
    className: "bg-red-50 text-red-700",
    icon: CircleAlert,
  },
} as const;

export function RecentDocumentsTable() {
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h2 className="text-lg font-bold text-slate-950">
            Documents récents
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Derniers documents importés et traités
          </p>
        </div>

        <button
          type="button"
          className="w-fit text-sm font-bold text-blue-600 transition-colors hover:text-blue-700"
        >
          Voir tous les documents
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px]">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-left">
              <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wide text-slate-500">
                Document
              </th>

              <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wide text-slate-500">
                Méthode
              </th>

              <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wide text-slate-500">
                Statut
              </th>

              <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wide text-slate-500">
                Traitement
              </th>

              <th className="px-6 py-3.5 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {recentDocuments.map((document) => {
              const status = statusStyles[document.status];
              const StatusIcon = status.icon;

              return (
                <tr
                  key={document.id}
                  className="border-b border-slate-100 transition-colors last:border-b-0 hover:bg-slate-50/70"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <FileText
                          className="size-4.5"
                          aria-hidden="true"
                        />
                      </span>

                      <div className="min-w-0">
                        <p className="max-w-xs truncate text-sm font-bold text-slate-900">
                          {document.fileName}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {document.type} · {document.size}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-bold text-slate-600">
                      {document.extractionMethod}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold",
                        status.className,
                      )}
                    >
                      <StatusIcon
                        className={cn(
                          "size-3.5",
                          document.status === "En cours" &&
                            "animate-spin",
                        )}
                        aria-hidden="true"
                      />

                      {document.status}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-sm text-slate-500">
                    {document.processedAt}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        className="flex size-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-blue-50 hover:text-blue-700"
                        aria-label={`Consulter ${document.fileName}`}
                      >
                        <Eye
                          className="size-4"
                          aria-hidden="true"
                        />
                      </button>

                      <button
                        type="button"
                        className="flex size-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                        aria-label={`Plus d’actions pour ${document.fileName}`}
                      >
                        <MoreHorizontal
                          className="size-4"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}