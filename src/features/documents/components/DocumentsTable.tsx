import {
  Download,
  Eye,
  FileText,
  MoreHorizontal,
  RefreshCw,
  Trash2,
} from "lucide-react";

import { DocumentStatusBadge } from "@/features/documents/components/DocumentStatusBadge";
import type { DocumentListItem } from "@/features/documents/types/document.types";
import { cn } from "@/lib/utils";

interface DocumentsTableProps {
  documents: readonly DocumentListItem[];
}

const extractionMethodLabels = {
  TIKA: "Apache Tika",
  OCR: "Tesseract OCR",
  UNDEFINED: "À déterminer",
} as const;

export function DocumentsTable({
  documents,
}: DocumentsTableProps) {
  if (documents.length === 0) {
    return (
      <section className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
          <FileText
            className="size-6"
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
        <table className="w-full min-w-[1100px]">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80 text-left">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                Document
              </th>

              <th className="px-4 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                Version
              </th>

              <th className="px-4 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                Extraction
              </th>

              <th className="px-4 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                Langue
              </th>

              <th className="px-4 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                Statut
              </th>

              <th className="px-4 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                Modification
              </th>

              <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {documents.map((document) => (
              <tr
                key={document.id}
                className="border-b border-slate-100 transition-colors last:border-b-0 hover:bg-slate-50/70"
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
                      <p className="max-w-xs truncate text-sm font-bold text-slate-900">
                        {document.fileName}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {document.fileType} · {document.fileSize}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-4">
                  <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-bold text-slate-600">
                    v{document.version}
                  </span>
                </td>

                <td className="px-4 py-4 text-sm font-medium text-slate-600">
                  {extractionMethodLabels[document.extractionMethod]}
                </td>

                <td className="px-4 py-4 text-sm text-slate-600">
                  {document.language}
                </td>

                <td className="px-4 py-4">
                  <DocumentStatusBadge status={document.status} />
                </td>

                <td className="px-4 py-4">
                  <p className="text-sm text-slate-600">
                    {document.updatedAt}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {document.createdAt}
                  </p>
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
                      className="flex size-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-blue-50 hover:text-blue-700"
                      aria-label={`Télécharger ${document.fileName}`}
                    >
                      <Download
                        className="size-4"
                        aria-hidden="true"
                      />
                    </button>

                    {document.status === "FAILED" && (
                      <button
                        type="button"
                        className="flex size-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-amber-50 hover:text-amber-700"
                        aria-label={`Relancer ${document.fileName}`}
                      >
                        <RefreshCw
                          className="size-4"
                          aria-hidden="true"
                        />
                      </button>
                    )}

                    <button
                      type="button"
                      className="flex size-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
                      aria-label={`Supprimer ${document.fileName}`}
                    >
                      <Trash2
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
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}