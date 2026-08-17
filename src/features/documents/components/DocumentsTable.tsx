import {
  Eye,
  FileText,
  Loader2,
  MoreHorizontal,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes/routePaths"; 

import { DocumentStatusBadge } from "@/features/documents/components/DocumentStatusBadge";
import { useDeleteDocumentMutation } from "@/features/documents/hooks/useDeleteDocumentMutation";
import type { DocumentListItem } from "@/features/documents/types/document.types";

interface DocumentsTableProps {
  documents: readonly DocumentListItem[];
}

function formatDocumentDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date indisponible";
  }

  return format(date, "dd MMM yyyy à HH:mm", {
    locale: fr,
  });
}

export function DocumentsTable({
  documents,
}: DocumentsTableProps) {

  const navigate = useNavigate();

  const deleteDocumentMutation =
    useDeleteDocumentMutation();

  const handleDeleteDocument = async (
    document: DocumentListItem,
  ) => {
    const confirmed =
      window.confirm(
        `Voulez-vous vraiment supprimer le document "${document.fileName}" ?\n\nCette action est irréversible.`,
      );

    if (!confirmed) {
      return;
    }

    try {
      await deleteDocumentMutation.mutateAsync(
        document.id,
      );
    } catch (error) {
      console.error(
        "Erreur pendant la suppression du document :",
        error,
      );

      window.alert(
        "Impossible de supprimer le document. Vérifiez que le backend est disponible puis réessayez.",
      );
    }
  };

  if (documents.length === 0) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
        <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
          <FileText
            className="size-5"
            aria-hidden="true"
          />
        </span>

        <h2 className="mt-5 text-lg font-bold text-slate-950">
          Aucun document trouvé
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Modifiez les critères de recherche ou importez un nouveau document.
        </p>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px]">
          <thead className="border-b border-slate-200 bg-slate-50/80">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                Document
              </th>

              <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                Version
              </th>

              <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                Statut
              </th>

              <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                Création
              </th>

              <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                Modification
              </th>

              <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {documents.map((document) => {
              const isDeleting =
                deleteDocumentMutation.isPending &&
                deleteDocumentMutation.variables ===
                  document.id;

              return (
                <tr
                  key={document.id}
                  className={[
                    "border-b border-slate-100 transition-colors last:border-b-0",
                    isDeleting
                      ? "bg-red-50/40 opacity-60"
                      : "hover:bg-slate-50/70",
                  ].join(" ")}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <FileText
                          className="size-5"
                          aria-hidden="true"
                        />
                      </span>

                      <div className="min-w-0">
                        <p
                          className="max-w-sm truncate text-sm font-bold text-slate-900"
                          title={
                            document.fileName
                          }
                        >
                          {
                            document.fileName
                          }
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Document #
                          {document.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-bold text-slate-600">
                      v{document.version}
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
                    <p className="whitespace-nowrap text-sm text-slate-600">
                      {formatDocumentDate(
                        document.createdAt,
                      )}
                    </p>
                  </td>

                  <td className="px-4 py-4">
                    <p className="whitespace-nowrap text-sm text-slate-600">
                      {formatDocumentDate(
                        document.updatedAt,
                      )}
                    </p>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-1">
                      {/* Voir le document - sera branché à l'étape suivante */}
                      <button
                        type="button"
                        disabled={
                          isDeleting
                        }
                        className="flex size-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40"
                        aria-label={`Consulter ${document.fileName}`}
                        onClick={() =>
                          navigate(
                            ROUTES.documentDetails(
                              document.id
                            )
                          )
                        }
                      >
                        <Eye
                          className="size-4"
                          aria-hidden="true"
                        />
                      </button>

                      {document.status ===
                        "FAILED" && (
                        <button
                          type="button"
                          disabled={
                            isDeleting
                          }
                          className="flex size-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-amber-50 hover:text-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40"
                          aria-label={`Relancer ${document.fileName}`}
                        >
                          <RefreshCw
                            className="size-4"
                            aria-hidden="true"
                          />
                        </button>
                      )}

                      {/* DELETE réel */}
                      <button
                        type="button"
                        disabled={
                          isDeleting
                        }
                        onClick={() =>
                          void handleDeleteDocument(
                            document,
                          )
                        }
                        className="flex size-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                        aria-label={
                          isDeleting
                            ? `Suppression de ${document.fileName} en cours`
                            : `Supprimer ${document.fileName}`
                        }
                      >
                        {isDeleting ? (
                          <Loader2
                            className="size-4 animate-spin text-red-600"
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
                        className="flex size-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40"
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