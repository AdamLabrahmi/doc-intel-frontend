import {
  AlertTriangle,
  CircleAlert,
  Clock3,
  Eye,
  LoaderCircle,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import {
  useDocumentsQuery,
} from "@/features/documents/hooks/useDocumentsQuery";

import type {
  DocumentStatus,
} from "@/features/documents/types/document.types";

import {
  cn,
} from "@/lib/utils";

import {
  ROUTES,
} from "@/routes/routePaths";

interface AttentionStatusPresentation {
  label: string;
  className: string;
  icon: typeof CircleAlert;
  priority: number;
}

const ATTENTION_STATUS_STYLES: Partial<
  Record<
    DocumentStatus,
    AttentionStatusPresentation
  >
> = {
  FAILED: {
    label:
      "Échec",

    className:
      "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",

    icon:
      CircleAlert,

    priority:
      1,
  },

  PENDING: {
    label:
      "En attente",

    className:
      "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",

    icon:
      Clock3,

    priority:
      2,
  },

  PROCESSING: {
    label:
      "En cours",

    className:
      "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",

    icon:
      LoaderCircle,

    priority:
      3,
  },
};

function formatDate(
  value: string,
): string {
  const date =
    new Date(
      value,
    );

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
      dateStyle:
        "medium",

      timeStyle:
        "short",
    },
  ).format(
    date,
  );
}

export function DocumentsAttentionPanel() {
  const {
  data:
    documents = [],

  isLoading,

  isError,
} =
  useDocumentsQuery();

  const attentionDocuments =
    documents
      .filter(
        (
          document,
        ) =>
          document.status ===
            "FAILED" ||
          document.status ===
            "PENDING" ||
          document.status ===
            "PROCESSING",
      )
      .sort(
        (
          firstDocument,
          secondDocument,
        ) => {
          const firstPriority =
            ATTENTION_STATUS_STYLES[
              firstDocument.status
            ]?.priority ??
            Number.MAX_SAFE_INTEGER;

          const secondPriority =
            ATTENTION_STATUS_STYLES[
              secondDocument.status
            ]?.priority ??
            Number.MAX_SAFE_INTEGER;

          if (
            firstPriority !==
            secondPriority
          ) {
            return (
              firstPriority -
              secondPriority
            );
          }

          return (
            new Date(
              secondDocument.updatedAt,
            ).getTime() -
            new Date(
              firstDocument.updatedAt,
            ).getTime()
          );
        },
      )
      .slice(
        0,
        5,
      );

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
            <AlertTriangle
              className="size-5"
              aria-hidden="true"
            />
          </span>

          <div>
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">
              À surveiller
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Documents en échec, en attente ou encore en cours de traitement.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!isLoading &&
          !isError ? (
            <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {
                attentionDocuments.length
              }{" "}
              affiché
              {attentionDocuments.length >
              1
                ? "s"
                : ""}
            </span>
          ) : null}

          
        </div>
      </div>

      {isLoading ? (
        <div className="flex min-h-48 items-center justify-center">
          <div className="text-center">
            <LoaderCircle
              className="mx-auto size-6 animate-spin text-blue-600 dark:text-blue-400"
              aria-hidden="true"
            />

            <p className="mt-3 text-sm font-medium text-slate-500 dark:text-slate-400">
              Analyse des documents...
            </p>
          </div>
        </div>
      ) : null}

      {!isLoading &&
      isError ? (
        <div className="p-6">
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 dark:border-red-900/50 dark:bg-red-950/30"
          >
            <p className="text-sm font-semibold text-red-700 dark:text-red-300">
              Impossible de récupérer les documents nécessitant une attention.
            </p>
          </div>
        </div>
      ) : null}

      {!isLoading &&
      !isError &&
      attentionDocuments.length ===
        0 ? (
        <div className="flex min-h-48 items-center justify-center p-6 text-center">
          <div>
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
              <AlertTriangle
                className="size-5"
                aria-hidden="true"
              />
            </div>

            <p className="mt-4 font-bold text-slate-900 dark:text-white">
              Aucun document à surveiller
            </p>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Aucun traitement en échec, en attente ou en cours n’est actuellement signalé.
            </p>
          </div>
        </div>
      ) : null}

      {!isLoading &&
      !isError &&
      attentionDocuments.length >
        0 ? (
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {attentionDocuments.map(
            (
              document,
            ) => {
              const status =
                ATTENTION_STATUS_STYLES[
                  document.status
                ];

              if (
                !status
              ) {
                return null;
              }

              const StatusIcon =
                status.icon;

              return (
                <article
                  key={
                    document.id
                  }
                  className="flex flex-col gap-4 px-5 py-4 transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <p
                        className="max-w-xl truncate text-sm font-bold text-slate-900 dark:text-slate-100"
                        title={
                          document.fileName
                        }
                      >
                        {
                          document.fileName
                        }
                      </p>

                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold",
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

                        {
                          status.label
                        }
                      </span>
                    </div>

                    <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                      Dernière mise à jour :{" "}
                      {formatDate(
                        document.updatedAt,
                      )}
                    </p>
                  </div>

                  <Link
                    to={ROUTES.documentDetails(
                      document.id,
                    )}
                    className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-bold text-slate-600 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-blue-500/40 dark:hover:bg-blue-500/10 dark:hover:text-blue-400 dark:focus-visible:ring-offset-slate-900"
                  >
                    <Eye
                      className="size-3.5"
                      aria-hidden="true"
                    />

                    Voir
                  </Link>
                </article>
              );
            },
          )}
        </div>
      ) : null}

      {!isLoading &&
      !isError &&
      attentionDocuments.length >
        0 ? (
        <div className="border-t border-slate-100 bg-slate-50/50 px-5 py-3.5 dark:border-slate-800 dark:bg-slate-800/30 sm:px-6">
          <Link
            to={
              ROUTES.documents
            }
            className="text-sm font-bold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Voir tous les documents
          </Link>
        </div>
      ) : null}
    </section>
  );
}