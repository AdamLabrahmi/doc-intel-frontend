import {
  CircleAlert,
  FileCheck2,
  FileText,
  Trash2,
  UploadCloud,
} from "lucide-react";

import type {
  UploadFileItem,
} from "@/features/documents/types/document.types";

import {
  cn,
} from "@/lib/utils";

interface UploadDropzoneProps {
  files: readonly UploadFileItem[];
  maxFiles: number;

  onFilesSelected: (
    files: FileList | null,
  ) => void;

  onRemoveFile: (
    fileId: string,
  ) => void;
}

function formatFileSize(
  size: number,
): string {
  if (
    size <
    1024
  ) {
    return `${size} octets`;
  }

  if (
    size <
    1024 * 1024
  ) {
    return `${Math.round(
      size / 1024,
    )} Ko`;
  }

  return `${(
    size /
    (1024 * 1024)
  ).toFixed(1)} Mo`;
}

export function UploadDropzone({
  files,
  maxFiles,
  onFilesSelected,
  onRemoveFile,
}: UploadDropzoneProps) {
  return (
    <div className="space-y-5">
      <label
        htmlFor="document-files"
        className="group flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-blue-200 bg-blue-50/40 px-6 py-12 text-center transition-all hover:border-blue-400 hover:bg-blue-50 dark:border-blue-500/30 dark:bg-blue-500/5 dark:hover:border-blue-400 dark:hover:bg-blue-500/10"
      >
        <span className="flex size-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-600/20 transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-105">
          <UploadCloud
            className="size-7"
            aria-hidden="true"
          />
        </span>

        <h2 className="mt-5 text-lg font-bold text-slate-950 dark:text-white">
          Déposez vos documents ici
        </h2>

        <p className="mt-2 max-w-lg text-sm leading-6 text-slate-600 dark:text-slate-400">
          Glissez-déposez vos fichiers ou cliquez pour les sélectionner depuis votre ordinateur.
        </p>

        <span className="mt-4 rounded-xl border border-blue-200 bg-white px-4 py-2 text-sm font-bold text-blue-700 shadow-sm dark:border-blue-500/30 dark:bg-slate-900 dark:text-blue-400">
          Sélectionner des fichiers
        </span>

        <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
          PDF, DOCX, TXT, PNG ou JPEG · maximum {maxFiles} fichiers par batch
        </p>
      </label>

      <input
        id="document-files"
        type="file"
        multiple
        accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
        className="sr-only"
        onChange={(
          event,
        ) => {
          onFilesSelected(
            event.target.files,
          );

          event.target.value =
            "";
        }}
      />

      {files.length >
      0 ? (
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white transition-colors dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-slate-950 dark:text-white">
                Fichiers sélectionnés
              </h3>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {files.length} fichier
                {files.length >
                1
                  ? "s"
                  : ""}{" "}
                dans le batch
              </p>
            </div>

            <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
              {files.length}/
              {maxFiles}
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {files.map(
              (
                fileItem,
              ) => (
                <article
                  key={
                    fileItem.id
                  }
                  className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-800/40"
                >
                  <span
                    className={cn(
                      "flex size-11 shrink-0 items-center justify-center rounded-xl",

                      fileItem.status ===
                        "READY"
                        ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                        : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
                    )}
                  >
                    {fileItem.status ===
                    "READY" ? (
                      <FileText
                        className="size-5"
                        aria-hidden="true"
                      />
                    ) : (
                      <CircleAlert
                        className="size-5"
                        aria-hidden="true"
                      />
                    )}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">
                      {
                        fileItem.file.name
                      }
                    </p>

                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {formatFileSize(
                        fileItem.file.size,
                      )}
                    </p>

                    {fileItem.error ? (
                      <p className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">
                        {
                          fileItem.error
                        }
                      </p>
                    ) : null}
                  </div>

                  {fileItem.status ===
                  "READY" ? (
                    <span className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 sm:inline-flex">
                      <FileCheck2
                        className="size-3.5"
                        aria-hidden="true"
                      />

                      Prêt
                    </span>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => {
                      onRemoveFile(
                        fileItem.id,
                      );
                    }}
                    className="flex size-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-slate-500 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                    aria-label={`Retirer ${fileItem.file.name}`}
                  >
                    <Trash2
                      className="size-4"
                      aria-hidden="true"
                    />
                  </button>
                </article>
              ),
            )}
          </div>
        </section>
      ) : null}
    </div>
  );
}