import {
  Plus,
  Trash2,
  X,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import {
  toast,
} from "sonner";

import {
  useDocumentsQuery,
} from "@/features/documents/hooks/useDocumentsQuery";

import {
  useEvaluateExtractionBenchmarkMutation,
} from "@/features/extraction-benchmark/hooks/useEvaluateExtractionBenchmarkMutation";

interface CreateExtractionBenchmarkDialogProps {
  open: boolean;
  onClose: () => void;
}

interface BenchmarkRow {
  id: string;
  documentId: number | null;
  file: File | null;
}

function createEmptyRow(): BenchmarkRow {
  return {
    id: crypto.randomUUID(),
    documentId: null,
    file: null,
  };
}

export function CreateExtractionBenchmarkDialog({
  open,
  onClose,
}: CreateExtractionBenchmarkDialogProps) {
  const [
    rows,
    setRows,
  ] = useState<BenchmarkRow[]>([
    createEmptyRow(),
  ]);

  const {
    data: documents = [],
    isLoading: isDocumentsLoading,
  } = useDocumentsQuery();

  const benchmarkMutation =
    useEvaluateExtractionBenchmarkMutation();

  const selectedDocumentIds =
    useMemo(
      () =>
        rows
          .map(
            (row) =>
              row.documentId,
          )
          .filter(
            (
              documentId,
            ): documentId is number =>
              documentId !== null,
          ),
      [
        rows,
      ],
    );

  const canSubmit =
    rows.length > 0
    && rows.every(
      (row) =>
        row.documentId !== null
        && row.file !== null,
    )
    && new Set(
      selectedDocumentIds,
    ).size ===
      selectedDocumentIds.length
    && !benchmarkMutation.isPending;

  if (!open) {
    return null;
  }

  const handleAddRow =
    () => {
      setRows(
        (currentRows) => [
          ...currentRows,
          createEmptyRow(),
        ],
      );
    };

  const handleRemoveRow =
    (
      rowId: string,
    ) => {
      setRows(
        (currentRows) => {
          if (
            currentRows.length ===
            1
          ) {
            return currentRows;
          }

          return currentRows.filter(
            (row) =>
              row.id !==
              rowId,
          );
        },
      );
    };

  const handleDocumentChange =
    (
      rowId: string,
      value: string,
    ) => {
      const documentId =
        value
          ? Number(value)
          : null;

      setRows(
        (currentRows) =>
          currentRows.map(
            (row) =>
              row.id === rowId
                ? {
                    ...row,
                    documentId,
                  }
                : row,
          ),
      );
    };

  const handleFileChange =
    (
      rowId: string,
      file: File | null,
    ) => {
      if (
        file
        && !file.name
          .toLowerCase()
          .endsWith(
            ".txt",
          )
      ) {
        toast.error(
          "Le fichier de référence doit être au format .txt.",
        );

        return;
      }

      setRows(
        (currentRows) =>
          currentRows.map(
            (row) =>
              row.id === rowId
                ? {
                    ...row,
                    file,
                  }
                : row,
          ),
      );
    };

  const handleClose =
    () => {
      if (
        benchmarkMutation.isPending
      ) {
        return;
      }

      setRows([
        createEmptyRow(),
      ]);

      onClose();
    };

  const handleSubmit =
    async () => {
      if (!canSubmit) {
        toast.error(
          "Chaque document doit avoir un fichier de référence valide.",
        );

        return;
      }

      const documentIds =
        rows.map(
          (row) =>
            row.documentId as number,
        );

      const groundTruthFiles =
        rows.map(
          (row) =>
            row.file as File,
        );

      try {
        await benchmarkMutation.mutateAsync({
          documentIds,
          groundTruthFiles,
        });

        toast.success(
          "Benchmark terminé avec succès.",
        );

        setRows([
          createEmptyRow(),
        ]);

        onClose();

      } catch {
        toast.error(
          "Impossible de lancer le benchmark.",
        );
      }
    };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
      onClick={
        handleClose
      }
    >
      <div
        className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950"
        onClick={
          (
            event,
          ) =>
            event.stopPropagation()
        }
      >
        <header className="flex items-start justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
              Nouvelle campagne
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Associez chaque document à son texte de référence vérifié.
            </p>
          </div>

          <button
            type="button"
            onClick={
              handleClose
            }
            disabled={
              benchmarkMutation.isPending
            }
            className="rounded-xl p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-slate-800 dark:hover:text-white"
            aria-label="Fermer"
          >
            <X className="size-5" />
          </button>
        </header>

        <div className="overflow-y-auto p-6">
          <div className="space-y-4">
            {rows.map(
              (
                row,
                index,
              ) => {
                const duplicate =
                  row.documentId !== null
                  && selectedDocumentIds.filter(
                    (documentId) =>
                      documentId ===
                      row.documentId,
                  ).length > 1;

                return (
                  <div
                    key={
                      row.id
                    }
                    className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-950 dark:text-white">
                        Document {index + 1}
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveRow(
                            row.id,
                          )
                        }
                        disabled={
                          rows.length ===
                          1
                        }
                        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-red-950/20 dark:hover:text-red-400"
                        aria-label="Supprimer cette ligne"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label
                          htmlFor={`benchmark-document-${row.id}`}
                          className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                        >
                          Document
                        </label>

                        <select
                          id={`benchmark-document-${row.id}`}
                          value={
                            row.documentId
                            ?? ""
                          }
                          disabled={
                            isDocumentsLoading
                            || benchmarkMutation.isPending
                          }
                          onChange={
                            (
                              event,
                            ) =>
                              handleDocumentChange(
                                row.id,
                                event.target.value,
                              )
                          }
                          className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                        >
                          <option value="">
                            Sélectionner un document
                          </option>

                          {documents.map(
                            (
                              document,
                            ) => (
                              <option
                                key={
                                  document.id
                                }
                                value={
                                  document.id
                                }
                              >
                                {document.fileName}
                              </option>
                            ),
                          )}
                        </select>

                        {duplicate ? (
                          <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                            Ce document est déjà sélectionné.
                          </p>
                        ) : null}
                      </div>

                      <div>
                        <label
                          htmlFor={`benchmark-file-${row.id}`}
                          className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                        >
                          Texte de référence
                        </label>

                        <input
                          id={`benchmark-file-${row.id}`}
                          type="file"
                          accept=".txt,text/plain"
                          disabled={
                            benchmarkMutation.isPending
                          }
                          onChange={
                            (
                              event,
                            ) =>
                              handleFileChange(
                                row.id,
                                event.target.files?.[0]
                                ?? null,
                              )
                          }
                          className="block w-full cursor-pointer rounded-xl border border-slate-200 bg-white text-sm text-slate-600 file:mr-4 file:border-0 file:bg-blue-50 file:px-4 file:py-3 file:text-sm file:font-medium file:text-blue-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:file:bg-blue-950/40 dark:file:text-blue-300"
                        />

                        {row.file ? (
                          <p className="mt-2 truncate text-xs text-slate-500 dark:text-slate-400">
                            {row.file.name}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              },
            )}
          </div>

          <button
            type="button"
            onClick={
              handleAddRow
            }
            disabled={
              benchmarkMutation.isPending
            }
            className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
          >
            <Plus className="size-4" />

            Ajouter un document
          </button>
        </div>

        <footer className="flex items-center justify-between gap-4 border-t border-slate-200 px-6 py-4 dark:border-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {rows.length} document
            {rows.length > 1
              ? "s"
              : ""} à évaluer
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={
                handleClose
              }
              disabled={
                benchmarkMutation.isPending
              }
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
            >
              Annuler
            </button>

            <button
              type="button"
              onClick={
                handleSubmit
              }
              disabled={
                !canSubmit
              }
              className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {benchmarkMutation.isPending
                ? "Évaluation..."
                : "Lancer l’évaluation"}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}