import {
  useState,
} from "react";

import {
  Eye,
  FileText,
  Loader2,
  MessageSquareText,
  MoreHorizontal,
  RefreshCw,
  Trash2,
} from "lucide-react";

import {
  format,
} from "date-fns";

import {
  fr,
} from "date-fns/locale";

import {
  useNavigate,
} from "react-router-dom";

import {
  DeleteDocumentDialog,
} from "@/features/documents/components/DeleteDocumentDialog";

import {
  DocumentStatusBadge,
} from "@/features/documents/components/DocumentStatusBadge";

import {
  useDeleteDocumentMutation,
} from "@/features/documents/hooks/useDeleteDocumentMutation";

import type {
  DocumentListItem,
} from "@/features/documents/types/document.types";

import {
  ROUTES,
} from "@/routes/routePaths";

interface DocumentsTableProps {
  documents:
    readonly DocumentListItem[];
}

function formatDocumentDate(
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
    return "Date indisponible";
  }

  return format(
    date,
    "dd MMM yyyy à HH:mm",
    {
      locale:
        fr,
    },
  );
}

export function DocumentsTable({
  documents,
}: DocumentsTableProps) {
  const navigate =
    useNavigate();

  const [
    documentToDelete,
    setDocumentToDelete,
  ] =
    useState<DocumentListItem | null>(
      null,
    );

  const deleteDocumentMutation =
    useDeleteDocumentMutation();

  const openDeleteDialog =
    (
      document:
        DocumentListItem,
    ) => {
      deleteDocumentMutation.reset();

      setDocumentToDelete(
        document,
      );
    };

  const closeDeleteDialog =
    () => {
      if (
        deleteDocumentMutation.isPending
      ) {
        return;
      }

      deleteDocumentMutation.reset();

      setDocumentToDelete(
        null,
      );
    };

  const confirmDeleteDocument =
    async () => {
      if (
        !documentToDelete
      ) {
        return;
      }

      try {
        await deleteDocumentMutation.mutateAsync(
          documentToDelete.id,
        );

        setDocumentToDelete(
          null,
        );
      } catch (error) {
        console.error(
          "Erreur pendant la suppression du document :",
          error,
        );
      }
    };

  if (
    documents.length ===
    0
  ) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
        <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          <FileText
            className="size-5"
            aria-hidden="true"
          />
        </span>

        <h2 className="mt-5 text-lg font-bold text-slate-950 dark:text-white">
          Aucun document trouvé
        </h2>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Modifiez les critères de recherche ou importez un nouveau document.
        </p>
      </section>
    );
  }

  return (
    <>
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px]">
            <thead className="border-b border-slate-200 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-800/50">
              <tr>
                {[
                  "Document",
                  "Version",
                  "Statut",
                  "Création",
                  "Modification",
                ].map(
                  (
                    label,
                  ) => (
                    <th
                      key={
                        label
                      }
                      className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500 first:px-6 dark:text-slate-400"
                    >
                      {
                        label
                      }
                    </th>
                  ),
                )}

                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {documents.map(
                (
                  document,
                ) => {
                  const isDeleting =
                    deleteDocumentMutation.isPending &&
                    deleteDocumentMutation.variables ===
                      document.id;

                  const canChat =
                    document.status ===
                    "COMPLETED";

                  return (
                    <tr
                      key={
                        document.id
                      }
                      className={[
                        "border-b border-slate-100 transition-colors last:border-b-0 dark:border-slate-800",

                        isDeleting
                          ? "bg-red-50/40 opacity-60 dark:bg-red-950/20"
                          : "hover:bg-slate-50/70 dark:hover:bg-slate-800/50",
                      ].join(
                        " ",
                      )}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                            <FileText
                              className="size-5"
                              aria-hidden="true"
                            />
                          </span>

                          <div className="min-w-0">
                            <p
                              className="max-w-sm truncate text-sm font-bold text-slate-900 dark:text-slate-100"
                              title={
                                document.fileName
                              }
                            >
                              {
                                document.fileName
                              }
                            </p>

                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                              Document #
                              {
                                document.id
                              }
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          v
                          {
                            document.version
                          }
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <DocumentStatusBadge
                          status={
                            document.status
                          }
                        />
                      </td>

                      <td className="px-4 py-4">
                        <p className="whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                          {formatDocumentDate(
                            document.createdAt,
                          )}
                        </p>
                      </td>

                      <td className="px-4 py-4">
                        <p className="whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                          {formatDocumentDate(
                            document.updatedAt,
                          )}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-1">
                          <button
                            type="button"
                            disabled={
                              isDeleting
                            }
                            className="flex size-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 dark:text-slate-400 dark:hover:bg-blue-500/10 dark:hover:text-blue-400 dark:focus-visible:ring-offset-slate-900"
                            aria-label={`Consulter ${document.fileName}`}
                            title="Consulter le document"
                            onClick={() =>
                              navigate(
                                ROUTES.documentDetails(
                                  document.id,
                                ),
                              )
                            }
                          >
                            <Eye
                              className="size-4"
                              aria-hidden="true"
                            />
                          </button>

                          <button
                            type="button"
                            disabled={
                              isDeleting ||
                              !canChat
                            }
                            className="flex size-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent disabled:hover:text-slate-300 dark:text-slate-400 dark:hover:bg-blue-500/10 dark:hover:text-blue-400 dark:disabled:text-slate-600 dark:focus-visible:ring-offset-slate-900"
                            aria-label={
                              canChat
                                ? `Discuter avec ${document.fileName}`
                                : `Le document ${document.fileName} n'est pas encore prêt pour le chat`
                            }
                            title={
                              canChat
                                ? "Discuter avec ce document"
                                : "Le chat sera disponible après l’indexation du document"
                            }
                            onClick={() => {
                              if (
                                !canChat
                              ) {
                                return;
                              }

                              navigate(
                                `/conversations/${document.id}`,
                              );
                            }}
                          >
                            <MessageSquareText
                              className="size-4"
                              aria-hidden="true"
                            />
                          </button>

                          {document.status ===
                          "FAILED" ? (
                            <button
                              type="button"
                              disabled={
                                isDeleting
                              }
                              className="flex size-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-amber-50 hover:text-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 dark:text-slate-400 dark:hover:bg-amber-500/10 dark:hover:text-amber-400 dark:focus-visible:ring-offset-slate-900"
                              aria-label={`Relancer ${document.fileName}`}
                              title="Relancer le traitement"
                            >
                              <RefreshCw
                                className="size-4"
                                aria-hidden="true"
                              />
                            </button>
                          ) : null}

                          <button
                            type="button"
                            disabled={
                              isDeleting
                            }
                            onClick={() => {
                              openDeleteDialog(
                                document,
                              );
                            }}
                            className="flex size-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:text-slate-400 dark:hover:bg-red-500/10 dark:hover:text-red-400 dark:focus-visible:ring-offset-slate-900"
                            aria-label={
                              isDeleting
                                ? `Suppression de ${document.fileName} en cours`
                                : `Supprimer ${document.fileName}`
                            }
                            title="Supprimer le document"
                          >
                            {isDeleting ? (
                              <Loader2
                                className="size-4 animate-spin text-red-600 dark:text-red-400"
                                aria-hidden="true"
                              />
                            ) : (
                              <Trash2
                                className="size-4"
                                aria-hidden="true"
                              />
                            )}
                          </button>

                          <button
                            type="button"
                            disabled={
                              isDeleting
                            }
                            className="flex size-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white dark:focus-visible:ring-offset-slate-900"
                            aria-label={`Plus d’actions pour ${document.fileName}`}
                            title="Plus d’actions"
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
                },
              )}
            </tbody>
          </table>
        </div>
      </section>

      <DeleteDocumentDialog
        document={
          documentToDelete
        }
        isOpen={
          documentToDelete !==
          null
        }
        isDeleting={
          deleteDocumentMutation.isPending
        }
        isError={
          deleteDocumentMutation.isError
        }
        onClose={
          closeDeleteDialog
        }
        onConfirm={() => {
          void confirmDeleteDocument();
        }}
      />
    </>
  );
}