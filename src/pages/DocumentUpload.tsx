import axios from "axios";
import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  CheckCircle2,
  CircleAlert,
  Files,
  Loader2,
  ShieldCheck,
  UploadCloud,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { UploadDropzone } from "@/features/documents/components/UploadDropzone";
import { useProcessDocumentBatchMutation } from "@/features/documents/hooks/useProcessDocumentBatchMutation";
import type { UploadFileItem } from "@/features/documents/types/document.types";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { ROUTES } from "@/routes/routePaths";

const MAX_BATCH_FILES = 10;
const MAX_FILE_SIZE = 20 * 1024 * 1024;

const allowedExtensions = [
  "pdf",
  "doc",
  "docx",
  "txt",
  "png",
  "jpg",
  "jpeg",
] as const;

function validateFile(file: File): string | undefined {
  const extension =
    file.name
      .split(".")
      .pop()
      ?.toLowerCase();

  if (
    !extension ||
    !allowedExtensions.includes(
      extension as (typeof allowedExtensions)[number],
    )
  ) {
    return "Format de fichier non autorisé.";
  }

  if (file.size > MAX_FILE_SIZE) {
    return "Le fichier dépasse la taille maximale de 20 Mo.";
  }

  return undefined;
}

function extractBackendErrorMessage(
  error: unknown,
): string | undefined {
  if (!axios.isAxiosError(error)) {
    return undefined;
  }

  const responseData = error.response?.data;

  if (
    typeof responseData === "object" &&
    responseData !== null &&
    "message" in responseData
  ) {
    const message = responseData.message;

    if (
      typeof message === "string" &&
      message.trim().length > 0
    ) {
      return message;
    }
  }

  if (
    typeof responseData === "string" &&
    responseData.trim().length > 0
  ) {
    return responseData;
  }

  return undefined;
}

export default function DocumentUpload() {
  const shouldReduceMotion = useReducedMotion();

  const navigate = useNavigate();

  const processBatchMutation =
    useProcessDocumentBatchMutation();

  const [files, setFiles] =
    useState<UploadFileItem[]>([]);

  const [batchError, setBatchError] =
    useState<string>();

  const [isCompleted, setIsCompleted] =
    useState(false);

  const [
    acceptedDocumentsCount,
    setAcceptedDocumentsCount,
  ] = useState(0);

  const [
    rejectedDocumentsCount,
    setRejectedDocumentsCount,
  ] = useState(0);

  const isSubmitting =
    processBatchMutation.isPending;

  const validFiles = useMemo(
    () =>
      files.filter(
        (fileItem) =>
          fileItem.status === "READY",
      ),
    [files],
  );

  const handleFilesSelected = (
    selectedFiles: FileList | null,
  ) => {
    if (!selectedFiles) {
      return;
    }

    setIsCompleted(false);
    setBatchError(undefined);
    setAcceptedDocumentsCount(0);
    setRejectedDocumentsCount(0);

    const incomingFiles =
      Array.from(selectedFiles);

    if (
      files.length +
        incomingFiles.length >
      MAX_BATCH_FILES
    ) {
      setBatchError(
        `Le batch ne peut pas contenir plus de ${MAX_BATCH_FILES} fichiers.`,
      );

      return;
    }

    const newItems: UploadFileItem[] =
      incomingFiles.map((file) => {
        const validationError =
          validateFile(file);

        return {
          id: `${file.name}-${file.size}-${file.lastModified}-${crypto.randomUUID()}`,
          file,
          status: validationError
            ? "INVALID"
            : "READY",
          error: validationError,
        };
      });

    setFiles((currentFiles) => [
      ...currentFiles,
      ...newItems,
    ]);
  };

  const handleRemoveFile = (
    fileId: string,
  ) => {
    setFiles((currentFiles) =>
      currentFiles.filter(
        (fileItem) =>
          fileItem.id !== fileId,
      ),
    );

    setBatchError(undefined);
    setIsCompleted(false);
    setAcceptedDocumentsCount(0);
    setRejectedDocumentsCount(0);
  };

  const handleClearSelection = () => {
    setFiles([]);
    setBatchError(undefined);
    setIsCompleted(false);
    setAcceptedDocumentsCount(0);
    setRejectedDocumentsCount(0);
  };

  const handleSubmitBatch = async () => {
    if (validFiles.length === 0) {
      setBatchError(
        "Ajoutez au moins un fichier valide avant de lancer le traitement.",
      );

      return;
    }

    setBatchError(undefined);
    setIsCompleted(false);
    setAcceptedDocumentsCount(0);
    setRejectedDocumentsCount(0);

    try {
      const result =
        await processBatchMutation.mutateAsync(
          validFiles.map(
            (fileItem) =>
              fileItem.file,
          ),
        );

      setAcceptedDocumentsCount(
        result.acceptedDocuments,
      );

      setRejectedDocumentsCount(
        result.rejectedDocuments,
      );

      if (
        result.acceptedDocuments === 0
      ) {
        const rejectedReasons =
          result.rejectedFiles
            .map(
              (rejectedFile) =>
                `${rejectedFile.fileName} : ${rejectedFile.reason}`,
            )
            .join(" ");

        setBatchError(
          rejectedReasons ||
            "Aucun document n'a été accepté par le serveur.",
        );

        return;
      }

      if (
        result.rejectedDocuments > 0
      ) {
        const rejectedReasons =
          result.rejectedFiles
            .map(
              (rejectedFile) =>
                `${rejectedFile.fileName} : ${rejectedFile.reason}`,
            )
            .join(" ");

        setBatchError(
          `${result.acceptedDocuments} document${
            result.acceptedDocuments > 1
              ? "s ont"
              : " a"
          } été accepté${
            result.acceptedDocuments > 1
              ? "s"
              : ""
          }, mais ${result.rejectedDocuments} fichier${
            result.rejectedDocuments > 1
              ? "s ont"
              : " a"
          } été rejeté${
            result.rejectedDocuments > 1
              ? "s"
              : ""
          }. ${rejectedReasons}`,
        );
      }

      setIsCompleted(true);

      window.setTimeout(() => {
        navigate(
          ROUTES.documents,
        );
      }, 1500);
    } catch (error) {
      const backendMessage =
        extractBackendErrorMessage(
          error,
        );

      setBatchError(
        backendMessage ??
          "Une erreur est survenue pendant l'envoi des documents. Vérifiez que le backend est disponible puis réessayez.",
      );
    }
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={
          shouldReduceMotion
            ? false
            : {
                opacity: 0,
                y: 20,
              }
        }
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration:
            shouldReduceMotion
              ? 0
              : 0.6,
          ease: [
            0.22,
            1,
            0.36,
            1,
          ],
        }}
        className="mx-auto w-full max-w-[1400px] space-y-6"
      >
        <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <UploadDropzone
              files={files}
              maxFiles={
                MAX_BATCH_FILES
              }
              onFilesSelected={
                handleFilesSelected
              }
              onRemoveFile={
                handleRemoveFile
              }
            />

            {batchError && (
              <div
                className="mt-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4"
                role="alert"
                translate="no"
              >
                <CircleAlert
                  className="mt-0.5 size-5 shrink-0 text-red-600"
                  aria-hidden="true"
                />

                <div>
                  <p className="text-sm font-bold text-red-800">
                    {isCompleted
                      ? "Traitement partiellement accepté"
                      : "Import impossible"}
                  </p>

                  <p className="mt-1 text-sm leading-6 text-red-700">
                    {batchError}
                  </p>
                </div>
              </div>
            )}

            {isCompleted && (
              <div
                className="mt-5 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4"
                role="status"
                translate="no"
              >
                <CheckCircle2
                  className="mt-0.5 size-5 shrink-0 text-emerald-600"
                  aria-hidden="true"
                />

                <div>
                  <p className="text-sm font-bold text-emerald-800">
                    Traitement lancé avec succès
                  </p>

                  <p className="mt-1 text-sm leading-6 text-emerald-700">
                    {
                      acceptedDocumentsCount
                    }{" "}
                    document
                    {acceptedDocumentsCount >
                    1
                      ? "s"
                      : ""}{" "}
                    accepté
                    {acceptedDocumentsCount >
                    1
                      ? "s"
                      : ""}{" "}
                    par le serveur.

                    {rejectedDocumentsCount >
                      0 &&
                      ` ${rejectedDocumentsCount} fichier${
                        rejectedDocumentsCount >
                        1
                          ? "s ont"
                          : " a"
                      } été rejeté${
                        rejectedDocumentsCount >
                        1
                          ? "s"
                          : ""
                      }.`}
                  </p>

                  <p className="mt-1 text-sm text-emerald-700">
                    Le traitement automatique est en cours.
                    Redirection vers la liste des documents...
                  </p>
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-end">
              <Button
                type="button"
                variant="outline"
                disabled={
                  files.length === 0 ||
                  isSubmitting
                }
                onClick={
                  handleClearSelection
                }
                className="h-11 rounded-xl border-slate-300"
                translate="no"
              >
                Vider la sélection
              </Button>

              <Button
                type="button"
                disabled={
                  validFiles.length ===
                    0 ||
                  isSubmitting
                }
                onClick={
                  handleSubmitBatch
                }
                translate="no"
                className="h-11 rounded-xl bg-blue-600 px-6 font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50"
              >
                <span
                  className="flex items-center gap-2"
                  translate="no"
                >
                  <span className="relative block size-4 shrink-0">
                    <UploadCloud
                      className={[
                        "absolute inset-0 size-4 transition-opacity duration-150",
                        isSubmitting
                          ? "opacity-0"
                          : "opacity-100",
                      ].join(" ")}
                      aria-hidden="true"
                    />

                    <Loader2
                      className={[
                        "absolute inset-0 size-4 transition-opacity duration-150",
                        isSubmitting
                          ? "animate-spin opacity-100"
                          : "opacity-0",
                      ].join(" ")}
                      aria-hidden="true"
                    />
                  </span>

                  <span>
                    {isSubmitting
                      ? "Envoi et traitement..."
                      : "Lancer le traitement"}
                  </span>
                </span>
              </Button>
            </div>
          </section>

          <aside className="space-y-5">
            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <Files
                    className="size-5"
                    aria-hidden="true"
                  />
                </span>

                <div>
                  <h2 className="font-bold text-slate-950">
                    Résumé du batch
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Avant envoi au serveur
                  </p>
                </div>
              </div>

              <dl className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-slate-500">
                    Fichiers sélectionnés
                  </dt>

                  <dd className="font-bold text-slate-950">
                    {files.length}
                  </dd>
                </div>

                <div className="flex items-center justify-between">
                  <dt className="text-sm text-slate-500">
                    Fichiers valides
                  </dt>

                  <dd className="font-bold text-emerald-600">
                    {
                      validFiles.length
                    }
                  </dd>
                </div>

                <div className="flex items-center justify-between">
                  <dt className="text-sm text-slate-500">
                    Fichiers invalides
                  </dt>

                  <dd className="font-bold text-red-600">
                    {files.length -
                      validFiles.length}
                  </dd>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                  <dt className="text-sm text-slate-500">
                    Limite du batch
                  </dt>

                  <dd className="font-bold text-blue-600">
                    {
                      MAX_BATCH_FILES
                    }
                  </dd>
                </div>
              </dl>
            </section>

            <section className="rounded-3xl border border-blue-100 bg-blue-50/60 p-5">
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                  <ShieldCheck
                    className="size-5"
                    aria-hidden="true"
                  />
                </span>

                <div>
                  <h2 className="font-bold text-slate-950">
                    Traitement automatique
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Le backend déterminera automatiquement la version,
                    le groupe documentaire, la langue et le moteur
                    d’extraction.
                  </p>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}