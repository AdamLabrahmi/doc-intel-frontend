import {
  CheckCircle2,
  CircleAlert,
  Clock3,
  Eye,
  FileText,
  LoaderCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useDocumentsQuery } from "@/features/documents/hooks/useDocumentsQuery";
import type { DocumentStatus } from "@/features/documents/types/document.types";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/routes/routePaths";

interface StatusPresentation {
  label: string;
  className: string;
  icon: typeof CheckCircle2;
}

const statusStyles: Record<
  DocumentStatus,
  StatusPresentation
> = {
  COMPLETED: {
    label: "Terminé",
    className:
      "bg-emerald-50 text-emerald-700",
    icon: CheckCircle2,
  },

  PROCESSING: {
    label: "En cours",
    className:
      "bg-blue-50 text-blue-700",
    icon: LoaderCircle,
  },

  PENDING: {
    label: "En attente",
    className:
      "bg-amber-50 text-amber-700",
    icon: Clock3,
  },

  FAILED: {
    label: "Échec",
    className:
      "bg-red-50 text-red-700",
    icon: CircleAlert,
  },
};

function formatDate(
  value: string,
): string {
  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "Date inconnue";
  }

  return new Intl.DateTimeFormat(
    "fr-FR",
    {
      dateStyle: "medium",
      timeStyle: "short",
    },
  ).format(date);
}

function resolveFileType(
  fileName: string,
): string {
  const parts =
    fileName.split(".");

  if (parts.length < 2) {
    return "Fichier";
  }

  const extension =
    parts
      .at(-1)
      ?.trim()
      .toUpperCase();

  if (!extension) {
    return "Fichier";
  }

  return extension;
}

export function RecentDocumentsTable() {
  const {
    data: documents = [],
    isLoading,
    isError,
  } = useDocumentsQuery();

  const recentDocuments =
    [...documents]
      .sort(
        (
          firstDocument,
          secondDocument,
        ) =>
          new Date(
            secondDocument.createdAt,
          ).getTime() -
          new Date(
            firstDocument.createdAt,
          ).getTime(),
      )
      .slice(
        0,
        5,
      );

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h2 className="text-lg font-bold text-slate-950">
            Documents récents
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Derniers documents réellement enregistrés
            dans votre espace
          </p>
        </div>

        <Link
          to={ROUTES.documents}
          className="w-fit text-sm font-bold text-blue-600 transition-colors hover:text-blue-700"
        >
          Voir tous les documents
        </Link>
      </div>

      {isLoading && (
        <div className="flex min-h-52 items-center justify-center">
          <div className="text-center">
            <LoaderCircle
              className="mx-auto size-6 animate-spin text-blue-600"
              aria-hidden="true"
            />

            <p className="mt-3 text-sm font-medium text-slate-500">
              Chargement des documents...
            </p>
          </div>
        </div>
      )}

      {!isLoading && isError && (
        <div className="p-6">
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4"
          >
            <p className="text-sm font-semibold text-red-700">
              Impossible de charger les documents récents.
            </p>
          </div>
        </div>
      )}

      {!isLoading &&
        !isError &&
        recentDocuments.length === 0 && (
          <div className="flex min-h-52 items-center justify-center p-6 text-center">
            <div>
              <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <FileText
                  className="size-5"
                  aria-hidden="true"
                />
              </div>

              <p className="mt-4 font-bold text-slate-900">
                Aucun document
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Vos derniers documents apparaîtront ici.
              </p>
            </div>
          </div>
        )}

      {!isLoading &&
        !isError &&
        recentDocuments.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-left">
                  <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wide text-slate-500">
                    Document
                  </th>

                  <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wide text-slate-500">
                    Version
                  </th>

                  <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wide text-slate-500">
                    Statut
                  </th>

                  <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wide text-slate-500">
                    Dernière mise à jour
                  </th>

                  <th className="px-6 py-3.5 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {recentDocuments.map(
                  (document) => {
                    const status =
                      statusStyles[
                        document.status
                      ];

                    const StatusIcon =
                      status.icon;

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
                                {
                                  document.fileName
                                }
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                {resolveFileType(
                                  document.fileName,
                                )}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <span className="inline-flex rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-bold text-slate-600">
                            v{document.version}
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
                                document.status ===
                                  "PROCESSING" &&
                                  "animate-spin",
                              )}
                              aria-hidden="true"
                            />

                            {status.label}
                          </span>
                        </td>

                        <td className="px-4 py-4 text-sm text-slate-500">
                          {formatDate(
                            document.updatedAt,
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex justify-end">
                            <Link
                              to={ROUTES.documentDetails(
                                document.id,
                              )}
                              className="flex size-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                              aria-label={`Consulter ${document.fileName}`}
                              title="Consulter le document"
                            >
                              <Eye
                                className="size-4"
                                aria-hidden="true"
                              />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  },
                )}
              </tbody>
            </table>
          </div>
        )}
    </section>
  );
}