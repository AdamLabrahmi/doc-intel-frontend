import {
  useEffect,
} from "react";

import {
  AlertTriangle,
  FileText,
  Loader2,
  Trash2,
  X,
} from "lucide-react";

import type {
  DocumentListItem,
} from "@/features/documents/types/document.types";

interface DeleteDocumentDialogProps {
  document:
    | DocumentListItem
    | null;

  isOpen: boolean;

  isDeleting: boolean;

  isError: boolean;

  onClose: () => void;

  onConfirm: () => void;
}

export function DeleteDocumentDialog({
  document,
  isOpen,
  isDeleting,
  isError,
  onClose,
  onConfirm,
}: DeleteDocumentDialogProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (
        event.key === "Escape" &&
        !isDeleting
      ) {
        onClose();
      }
    };

    documentBodyLock(
      true,
    );

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      documentBodyLock(
        false,
      );

      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [
    isOpen,
    isDeleting,
    onClose,
  ]);

  if (
    !isOpen ||
    !document
  ) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6">
      <button
        type="button"
        onClick={
          onClose
        }
        disabled={
          isDeleting
        }
        className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm"
        aria-label="Fermer la fenêtre de suppression"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-document-title"
        aria-describedby="delete-document-description"
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/20"
      >
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div className="flex gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <Trash2
                className="size-5"
                aria-hidden="true"
              />
            </span>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-red-600">
                Suppression
              </p>

              <h2
                id="delete-document-title"
                className="mt-1 text-xl font-bold text-slate-950"
              >
                Supprimer le document ?
              </h2>

              <p
                id="delete-document-description"
                className="mt-1 text-sm leading-6 text-slate-500"
              >
                Cette action supprimera définitivement ce document de votre espace.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={
              onClose
            }
            disabled={
              isDeleting
            }
            className="flex size-10 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Fermer"
          >
            <X
              className="size-5"
              aria-hidden="true"
            />
          </button>
        </div>

        <div className="space-y-5 px-6 py-6">
          <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
              <FileText
                className="size-5"
                aria-hidden="true"
              />
            </span>

            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Document concerné
              </p>

              <p
                className="mt-1 truncate text-sm font-bold text-slate-950"
                title={
                  document.fileName
                }
              >
                {document.fileName}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Document #{document.id} · version {document.version}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-red-100 bg-red-50/70 p-4">
            <div className="flex items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-red-600 shadow-sm">
                <AlertTriangle
                  className="size-4"
                  aria-hidden="true"
                />
              </span>

              <div>
                <p className="text-sm font-bold text-red-800">
                  Action irréversible
                </p>

                <p className="mt-1 text-xs leading-5 text-red-700">
                  Une fois le document supprimé, cette opération ne pourra pas être annulée.
                </p>
              </div>
            </div>
          </div>

          {isError ? (
            <div
              role="alert"
              className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3"
            >
              <p className="text-sm font-semibold text-red-700">
                Impossible de supprimer le document.
              </p>

              <p className="mt-1 text-xs leading-5 text-red-600">
                Vérifiez la connexion avec le serveur puis réessayez.
              </p>
            </div>
          ) : null}

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={
                onClose
              }
              disabled={
                isDeleting
              }
              className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Annuler
            </button>

            <button
              type="button"
              onClick={
                onConfirm
              }
              disabled={
                isDeleting
              }
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isDeleting ? (
                <>
                  <Loader2
                    className="size-4 animate-spin"
                    aria-hidden="true"
                  />

                  Suppression...
                </>
              ) : (
                <>
                  <Trash2
                    className="size-4"
                    aria-hidden="true"
                  />

                  Supprimer définitivement
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function documentBodyLock(
  locked: boolean,
) {
  if (
    typeof document ===
    "undefined"
  ) {
    return;
  }

  document.body.style.overflow =
    locked
      ? "hidden"
      : "";
}