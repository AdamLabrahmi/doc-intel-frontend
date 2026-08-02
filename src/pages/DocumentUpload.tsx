import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  CircleAlert,
  Files,
  Loader2,
  ShieldCheck,
  UploadCloud,
} from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { UploadDropzone } from "@/features/documents/components/UploadDropzone";
import type { UploadFileItem } from "@/features/documents/types/document.types";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { cn } from "@/lib/utils";
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
  const extension = file.name.split(".").pop()?.toLowerCase();

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

export default function DocumentUpload() {
  const shouldReduceMotion = useReducedMotion();

  const [files, setFiles] = useState<UploadFileItem[]>([]);
  const [batchError, setBatchError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const validFiles = useMemo(
    () => files.filter((fileItem) => fileItem.status === "READY"),
    [files],
  );

  const handleFilesSelected = (selectedFiles: FileList | null) => {
    if (!selectedFiles) {
      return;
    }

    setIsCompleted(false);
    setBatchError(undefined);

    const incomingFiles = Array.from(selectedFiles);

    if (files.length + incomingFiles.length > MAX_BATCH_FILES) {
      setBatchError(
        `Le batch ne peut pas contenir plus de ${MAX_BATCH_FILES} fichiers.`,
      );

      return;
    }

    const newItems: UploadFileItem[] = incomingFiles.map((file) => {
      const validationError = validateFile(file);

      return {
        id: `${file.name}-${file.size}-${file.lastModified}-${crypto.randomUUID()}`,
        file,
        status: validationError ? "INVALID" : "READY",
        error: validationError,
      };
    });

    setFiles((currentFiles) => [
      ...currentFiles,
      ...newItems,
    ]);
  };

  const handleRemoveFile = (fileId: string) => {
    setFiles((currentFiles) =>
      currentFiles.filter((fileItem) => fileItem.id !== fileId),
    );

    setBatchError(undefined);
    setIsCompleted(false);
  };

  const handleSubmitBatch = async () => {
    if (validFiles.length === 0) {
      setBatchError(
        "Ajoutez au moins un fichier valide avant de lancer le traitement.",
      );

      return;
    }

    setIsSubmitting(true);
    setBatchError(undefined);
    setIsCompleted(false);

    try {
      await new Promise((resolve) => {
        window.setTimeout(resolve, 1200);
      });

      console.log(
        "Batch statique prêt à être envoyé :",
        validFiles.map((fileItem) => fileItem.file),
      );

      setIsCompleted(true);
    } finally {
      setIsSubmitting(false);
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
          duration: shouldReduceMotion ? 0 : 0.6,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="mx-auto w-full max-w-[1400px] space-y-6"
      >
        <section className="flex flex-col gap-5 rounded-3xl border border-blue-100 bg-gradient-to-br from-white via-blue-50/60 to-cyan-50/50 p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
              <UploadCloud
                className="size-3.5"
                aria-hidden="true"
              />

              Nouveau traitement
            </span>

            <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Importateur de documents
            </h1>

            <p className="mt-2 max-w-2xl leading-7 text-slate-600">
              Sélectionnez un ou plusieurs documents. Les métadonnées et la
              méthode d’extraction seront déterminées automatiquement par le
              backend.
            </p>
          </div>

          <Link
            to={ROUTES.documents}
            className={cn(
              buttonVariants({
                variant: "outline",
              }),
              "h-11 shrink-0 rounded-xl border-slate-300 bg-white",
            )}
          >
            <ArrowLeft
              className="size-4"
              aria-hidden="true"
            />

            Retour aux documents
          </Link>
        </section>

        <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <UploadDropzone
              files={files}
              maxFiles={MAX_BATCH_FILES}
              onFilesSelected={handleFilesSelected}
              onRemoveFile={handleRemoveFile}
            />

            {batchError && (
              <div
                className="mt-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4"
                role="alert"
              >
                <CircleAlert
                  className="mt-0.5 size-5 shrink-0 text-red-600"
                  aria-hidden="true"
                />

                <div>
                  <p className="text-sm font-bold text-red-800">
                    Import impossible
                  </p>

                  <p className="mt-1 text-sm text-red-700">
                    {batchError}
                  </p>
                </div>
              </div>
            )}

            {isCompleted && (
              <div
                className="mt-5 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4"
                role="status"
              >
                <CheckCircle2
                  className="mt-0.5 size-5 shrink-0 text-emerald-600"
                  aria-hidden="true"
                />

                <div>
                  <p className="text-sm font-bold text-emerald-800">
                    Batch préparé avec succès
                  </p>

                  <p className="mt-1 text-sm text-emerald-700">
                    La simulation contient {validFiles.length} fichier
                    {validFiles.length > 1 ? "s" : ""} valide
                    {validFiles.length > 1 ? "s" : ""}.
                  </p>
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-end">
              <Button
                type="button"
                variant="outline"
                disabled={files.length === 0 || isSubmitting}
                onClick={() => {
                  setFiles([]);
                  setBatchError(undefined);
                  setIsCompleted(false);
                }}
                className="h-11 rounded-xl border-slate-300"
              >
                Vider la sélection
              </Button>

              <Button
                type="button"
                disabled={
                  validFiles.length === 0 ||
                  isSubmitting
                }
                onClick={handleSubmitBatch}
                className="h-11 rounded-xl bg-blue-600 px-6 font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2
                      className="size-4 animate-spin"
                      aria-hidden="true"
                    />

                    Préparation du batch...
                  </>
                ) : (
                  <>
                    <UploadCloud
                      className="size-4"
                      aria-hidden="true"
                    />

                    Lancer le traitement
                  </>
                )}
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
                    {validFiles.length}
                  </dd>
                </div>

                <div className="flex items-center justify-between">
                  <dt className="text-sm text-slate-500">
                    Fichiers invalides
                  </dt>

                  <dd className="font-bold text-red-600">
                    {files.length - validFiles.length}
                  </dd>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                  <dt className="text-sm text-slate-500">
                    Limite du batch
                  </dt>

                  <dd className="font-bold text-blue-600">
                    {MAX_BATCH_FILES}
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
                    Le backend déterminera automatiquement la version, le
                    groupe documentaire, la langue et le moteur d’extraction.
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