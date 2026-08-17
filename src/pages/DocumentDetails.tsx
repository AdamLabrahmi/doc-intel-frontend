import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BadgeEuro,
  BrainCircuit,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CircleAlert,
  Clock3,
  FileText,
  History,
  Languages,
  Loader2,
  ReceiptText,
  Route,
  ScanText,
  ShieldCheck,
  Sparkles,
  Tags,
  UserRound,
  UsersRound,
  WalletCards,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useDocumentAiHistoryQuery } from "@/features/documents/hooks/useDocumentAiHistoryQuery";
import { useDocumentAiResultQuery } from "@/features/documents/hooks/useDocumentAiResultQuery";
import { useDocumentExtractionQuery } from "@/features/documents/hooks/useDocumentExtractionQuery";
import { useDocumentExtractedTextQuery } from "@/features/documents/hooks/useDocumentExtractedTextQuery";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { ROUTES } from "@/routes/routePaths";

function formatConfidence(
  confidence: number | null | undefined,
): string {
  if (
    confidence === null ||
    confidence === undefined
  ) {
    return "Non disponible";
  }

  const normalizedConfidence =
    confidence <= 1
      ? confidence * 100
      : confidence;

  return `${normalizedConfidence.toFixed(1)} %`;
}

function formatDate(
  value: string | null | undefined,
): string {
  if (!value) {
    return "Non disponible";
  }

  const date =
    new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Non disponible";
  }

  return new Intl.DateTimeFormat(
    "fr-FR",
    {
      dateStyle: "medium",
      timeStyle: "short",
    },
  ).format(date);
}

function formatSimpleDate(
  value: string | null,
): string {
  if (!value) {
    return "Non disponible";
  }

  const date =
    new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "fr-FR",
    {
      dateStyle: "medium",
    },
  ).format(date);
}

function calculateDuration(
  startedAt: string | null | undefined,
  finishedAt: string | null | undefined,
): string {
  if (!startedAt || !finishedAt) {
    return "Non disponible";
  }

  const start =
    new Date(startedAt).getTime();

  const end =
    new Date(finishedAt).getTime();

  if (
    Number.isNaN(start) ||
    Number.isNaN(end) ||
    end < start
  ) {
    return "Non disponible";
  }

  const durationSeconds =
    (end - start) / 1000;

  if (durationSeconds < 60) {
    return `${durationSeconds.toFixed(2)} s`;
  }

  const minutes =
    Math.floor(
      durationSeconds / 60,
    );

  const seconds =
    Math.round(
      durationSeconds % 60,
    );

  return `${minutes} min ${seconds} s`;
}

function formatDurationMs(
  durationMs: number | null | undefined,
): string {
  if (
    durationMs === null ||
    durationMs === undefined ||
    durationMs < 0
  ) {
    return "Non disponible";
  }

  if (durationMs < 60_000) {
    return `${(
      durationMs /
      1000
    ).toFixed(2)} s`;
  }

  const minutes =
    Math.floor(
      durationMs /
      60_000,
    );

  const seconds =
    Math.round(
      (durationMs % 60_000) /
      1000,
    );

  return `${minutes} min ${seconds} s`;
}

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function getStringValue(
  object: Record<string, unknown> | null,
  key: string,
): string | null {
  if (!object) {
    return null;
  }

  const value =
    object[key];

  if (
    typeof value !== "string" ||
    value.trim().length === 0
  ) {
    return null;
  }

  return value.trim();
}

function getNumberValue(
  object: Record<string, unknown> | null,
  key: string,
): number | null {
  if (!object) {
    return null;
  }

  const value =
    object[key];

  if (
    typeof value === "number" &&
    Number.isFinite(value)
  ) {
    return value;
  }

  if (
    typeof value === "string" &&
    value.trim().length > 0
  ) {
    const normalized =
      value
        .replace(/\s/g, "")
        .replace(",", ".");

    const number =
      Number(normalized);

    if (Number.isFinite(number)) {
      return number;
    }
  }

  return null;
}

function getStringArray(
  object: Record<string, unknown> | null,
  key: string,
): string[] {
  if (!object) {
    return [];
  }

  const value =
    object[key];

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (item): item is string =>
      typeof item === "string" &&
      item.trim().length > 0,
  );
}

function formatMoney(
  amount: number | null,
  currency: string | null,
): string {
  if (amount === null) {
    return "Non disponible";
  }

  const formattedAmount =
    new Intl.NumberFormat(
      "fr-FR",
      {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      },
    ).format(amount);

  if (!currency) {
    return formattedAmount;
  }

  return `${formattedAmount} ${currency}`;
}

interface ImportantField {
  name: string;
  value: string;
}

function getImportantFields(
  object: Record<string, unknown> | null,
): ImportantField[] {
  if (!object) {
    return [];
  }

  const value =
    object.importantFields;

  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap(
    (
      item,
    ): ImportantField[] => {
      if (!isRecord(item)) {
        return [];
      }

      const name =
        item.name;

      const fieldValue =
        item.value;

      if (
        typeof name !== "string" ||
        typeof fieldValue !== "string"
      ) {
        return [];
      }

      return [
        {
          name: name.trim(),
          value: fieldValue.trim(),
        },
      ];
    },
  );
}

export default function DocumentDetails() {
  const navigate =
    useNavigate();

  const {
    documentId: documentIdParam,
  } = useParams<{
    documentId: string;
  }>();

  const [
    expandedAiRunId,
    setExpandedAiRunId,
  ] = useState<number | null>(
    null,
  );

  const documentId =
    Number(documentIdParam);

  const isDocumentIdValid =
    Number.isFinite(documentId) &&
    documentId > 0;

  const extractionQuery =
    useDocumentExtractionQuery(
      documentId,
    );

  const extractedTextQuery =
    useDocumentExtractedTextQuery(
      documentId,
    );

  const aiResultQuery =
    useDocumentAiResultQuery(
      documentId,
    );

  const aiHistoryQuery =
    useDocumentAiHistoryQuery(
      documentId,
    );

  const extraction =
    extractionQuery.data;

  const extractedText =
    extractedTextQuery.data;

  const aiResult =
    aiResultQuery.data;

  const aiHistory =
    aiHistoryQuery.data ??
    [];

  const isLoading =
    extractionQuery.isLoading ||
    extractedTextQuery.isLoading;

  const hasError =
    extractionQuery.isError ||
    extractedTextQuery.isError;

  const aiDocumentType =
    aiResult?.fieldsJson?.documentType ??
    null;

  const aiFields =
    aiResult?.fieldsJson?.fields;

  const aiFieldsRecord =
    isRecord(aiFields)
      ? aiFields
      : null;

  /*
   * Résultat générique.
   */
  const aiSummary =
    getStringValue(
      aiFieldsRecord,
      "summary",
    );

  const importantFields =
    getImportantFields(
      aiFieldsRecord,
    );

  const entities =
    getStringArray(
      aiFieldsRecord,
      "entities",
    );

  const dates =
    getStringArray(
      aiFieldsRecord,
      "dates",
    );

  const amounts =
    getStringArray(
      aiFieldsRecord,
      "amounts",
    );

  const references =
    getStringArray(
      aiFieldsRecord,
      "references",
    );

  const hasGenericStructuredData =
    Boolean(aiSummary) ||
    importantFields.length > 0 ||
    entities.length > 0 ||
    dates.length > 0 ||
    amounts.length > 0 ||
    references.length > 0;

  /*
   * Résultat facture.
   */
  const isInvoice =
    aiDocumentType === "FACTURE";

  const invoiceNumber =
    getStringValue(
      aiFieldsRecord,
      "invoiceNumber",
    );

  const invoiceDate =
    getStringValue(
      aiFieldsRecord,
      "invoiceDate",
    );

  const supplier =
    getStringValue(
      aiFieldsRecord,
      "supplier",
    );

  const customer =
    getStringValue(
      aiFieldsRecord,
      "customer",
    );

  const currency =
    getStringValue(
      aiFieldsRecord,
      "currency",
    );

  const amountExcludingTax =
    getNumberValue(
      aiFieldsRecord,
      "amountExcludingTax",
    );

  const taxAmount =
    getNumberValue(
      aiFieldsRecord,
      "taxAmount",
    );

  const amountIncludingTax =
    getNumberValue(
      aiFieldsRecord,
      "amountIncludingTax",
    );

  if (!isDocumentIdValid) {
    return (
      <DashboardLayout>
        <div className="mx-auto w-full max-w-[1400px]">
          <section className="rounded-3xl border border-red-200 bg-red-50 p-8">
            <div className="flex items-start gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white text-red-600 shadow-sm">
                <CircleAlert
                  className="size-5"
                  aria-hidden="true"
                />
              </span>

              <div>
                <h1 className="text-lg font-bold text-red-900">
                  Document invalide
                </h1>

                <p className="mt-2 text-sm leading-6 text-red-700">
                  L’identifiant du document présent dans l’URL
                  n’est pas valide.
                </p>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    navigate(
                      ROUTES.documents,
                    )
                  }
                  className="mt-5 rounded-xl border-red-200 bg-white"
                >
                  <ArrowLeft
                    className="size-4"
                    aria-hidden="true"
                  />

                  Retour aux documents
                </Button>


                
              </div>
            </div>
          </section>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-[1400px] space-y-6">
        {/* HEADER */}
        {/* HEADER */}
<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
  <div className="flex items-center gap-4">
    <Button
      type="button"
      variant="outline"
      onClick={() =>
        navigate(
          ROUTES.documents,
        )
      }
      className="size-10 shrink-0 rounded-xl p-0"
      aria-label="Retour à la liste des documents"
    >
      <ArrowLeft
        className="size-4"
        aria-hidden="true"
      />
    </Button>

    <div>
      <h1 className="text-2xl font-bold tracking-tight text-slate-950">
        Détail du document
      </h1>

      <p className="mt-1 text-sm text-slate-500">
        Document #{documentId}
      </p>
    </div>
  </div>

  <Button
    type="button"
    onClick={() =>
      navigate(
        ROUTES.documentQuestions(
          documentId,
        ),
      )
    }
    className="rounded-xl bg-blue-600 text-white hover:bg-blue-700"
  >
    <BrainCircuit
      className="size-4"
      aria-hidden="true"
    />

    Questions sur ce document
  </Button>
</div>

        {/* LOADING */}
        {isLoading && (
          <section className="rounded-3xl border border-slate-200 bg-white px-6 py-16 shadow-sm">
            <div className="flex flex-col items-center justify-center text-center">
              <Loader2
                className="size-7 animate-spin text-blue-600"
                aria-hidden="true"
              />

              <p className="mt-4 text-sm font-semibold text-slate-700">
                Chargement du document...
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Récupération des informations d’extraction.
              </p>
            </div>
          </section>
        )}

        {/* ERROR */}
        {!isLoading && hasError && (
          <section className="rounded-3xl border border-red-200 bg-red-50 p-6">
            <div className="flex items-start gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white text-red-600 shadow-sm">
                <CircleAlert
                  className="size-5"
                  aria-hidden="true"
                />
              </span>

              <div>
                <h2 className="font-bold text-red-900">
                  Impossible de charger le document
                </h2>

                <p className="mt-2 text-sm leading-6 text-red-700">
                  Les informations d’extraction ou le texte extrait
                  n’ont pas pu être récupérés depuis le backend.
                </p>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    void extractionQuery.refetch();
                    void extractedTextQuery.refetch();
                  }}
                  className="mt-4 rounded-xl border-red-200 bg-white"
                >
                  Réessayer
                </Button>
              </div>
            </div>
          </section>
        )}

        {!isLoading && !hasError && (
          <>
            {/* INFORMATIONS EXTRACTION */}
            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <ScanText
                    className="size-5"
                    aria-hidden="true"
                  />
                </span>

                <div>
                  <h2 className="font-bold text-slate-950">
                    Informations d’extraction
                  </h2>

                  <p className="mt-0.5 text-sm text-slate-500">
                    Métadonnées générées lors de l’extraction du document.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <article className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                  <div className="flex items-center gap-2 text-slate-500">
                    <ScanText
                      className="size-4"
                      aria-hidden="true"
                    />

                    <span className="text-xs font-bold uppercase tracking-wide">
                      Méthode
                    </span>
                  </div>

                  <p className="mt-3 font-bold text-slate-950">
                    {extraction?.extractionMethod ??
                      "Non disponible"}
                  </p>
                </article>

                <article className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Languages
                      className="size-4"
                      aria-hidden="true"
                    />

                    <span className="text-xs font-bold uppercase tracking-wide">
                      Langue
                    </span>
                  </div>

                  <p className="mt-3 font-bold text-slate-950">
                    {extraction?.language ??
                      "Non disponible"}
                  </p>
                </article>

                <article className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                  <div className="flex items-center gap-2 text-slate-500">
                    <ShieldCheck
                      className="size-4"
                      aria-hidden="true"
                    />

                    <span className="text-xs font-bold uppercase tracking-wide">
                      Confiance
                    </span>
                  </div>

                  <p className="mt-3 font-bold text-slate-950">
                    {formatConfidence(
                      extraction?.confidence,
                    )}
                  </p>
                </article>

                <article className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                  <div className="flex items-center gap-2 text-slate-500">
                    <FileText
                      className="size-4"
                      aria-hidden="true"
                    />

                    <span className="text-xs font-bold uppercase tracking-wide">
                      Identifiant
                    </span>
                  </div>

                  <p className="mt-3 font-bold text-slate-950">
                    #{documentId}
                  </p>
                </article>
              </div>

              <div className="mt-5 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Création
                  </p>

                  <p className="mt-2 text-sm font-semibold text-slate-700">
                    {formatDate(
                      extraction?.createdAt,
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Dernière modification
                  </p>

                  <p className="mt-2 text-sm font-semibold text-slate-700">
                    {formatDate(
                      extraction?.updatedAt,
                    )}
                  </p>
                </div>
              </div>
            </section>

            {/* TEXTE EXTRAIT */}
            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
                <div className="flex items-center gap-3">
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700">
                    <FileText
                      className="size-5"
                      aria-hidden="true"
                    />
                  </span>

                  <div>
                    <h2 className="font-bold text-slate-950">
                      Texte extrait
                    </h2>

                    <p className="mt-0.5 text-sm text-slate-500">
                      Contenu textuel récupéré automatiquement
                      depuis le document.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-7">
                {extractedText?.extractedText?.trim() ? (
                  <pre className="max-h-[650px] overflow-auto whitespace-pre-wrap break-words rounded-2xl border border-slate-200 bg-slate-50 p-5 font-mono text-sm leading-7 text-slate-700">
                    {extractedText.extractedText}
                  </pre>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
                    <FileText
                      className="mx-auto size-6 text-slate-400"
                      aria-hidden="true"
                    />

                    <p className="mt-3 text-sm font-semibold text-slate-700">
                      Aucun texte extrait disponible
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* ANALYSE IA */}
            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
                <div className="flex items-center gap-3">
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
                    <BrainCircuit
                      className="size-5"
                      aria-hidden="true"
                    />
                  </span>

                  <div>
                    <h2 className="font-bold text-slate-950">
                      Analyse IA
                    </h2>

                    <p className="mt-0.5 text-sm text-slate-500">
                      Résultat structuré produit automatiquement
                      par le pipeline LangGraph4j.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-7">
                {aiResultQuery.isLoading && (
                  <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-6 py-12">
                    <Loader2
                      className="size-6 animate-spin text-violet-600"
                      aria-hidden="true"
                    />

                    <span className="ml-3 text-sm font-semibold text-slate-600">
                      Chargement de l’analyse IA...
                    </span>
                  </div>
                )}

                {aiResultQuery.isError && (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                    <div className="flex items-start gap-3">
                      <CircleAlert
                        className="mt-0.5 size-5 shrink-0 text-amber-600"
                        aria-hidden="true"
                      />

                      <div>
                        <p className="font-bold text-amber-900">
                          Analyse IA indisponible
                        </p>

                        <p className="mt-1 text-sm leading-6 text-amber-700">
                          Aucun résultat IA exploitable n’est encore disponible
                          pour ce document, ou le traitement n’est pas terminé.
                        </p>

                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            void aiResultQuery.refetch();
                          }}
                          className="mt-4 rounded-xl border-amber-200 bg-white"
                        >
                          Réessayer
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {!aiResultQuery.isLoading &&
                  !aiResultQuery.isError &&
                  aiResult && (
                    <div className="space-y-7">
                      {/* MÉTADONNÉES IA */}
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                        <article className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                            Type
                          </p>

                          <p className="mt-3 font-bold text-slate-950">
                            {aiResult.fieldsJson?.documentType ??
                              "Non disponible"}
                          </p>
                        </article>

                        <article className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                          <div className="flex items-center gap-2 text-slate-400">
                            <Route
                              className="size-4"
                              aria-hidden="true"
                            />

                            <p className="text-xs font-bold uppercase tracking-wide">
                              Route métier
                            </p>
                          </div>

                          <p className="mt-3 font-bold text-slate-950">
                            {aiResult.fieldsJson?.processingRoute ??
                              "Non disponible"}
                          </p>
                        </article>

                        <article className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                          <div className="flex items-center gap-2 text-slate-400">
                            <Sparkles
                              className="size-4"
                              aria-hidden="true"
                            />

                            <p className="text-xs font-bold uppercase tracking-wide">
                              Extracteur
                            </p>
                          </div>

                          <p className="mt-3 font-bold text-slate-950">
                            {aiResult.fieldsJson?.routeExecuted ??
                              "Non disponible"}
                          </p>
                        </article>

                        <article className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                            Modèle
                          </p>

                          <p className="mt-3 break-words font-bold text-slate-950">
                            {aiResult.modelName ??
                              "Non disponible"}
                          </p>
                        </article>

                        <article className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
                          <p className="text-xs font-bold uppercase tracking-wide text-emerald-600">
                            Statut
                          </p>

                          <p className="mt-3 font-bold text-emerald-800">
                            {aiResult.status ??
                              "Non disponible"}
                          </p>
                        </article>

                        <article className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                          <div className="flex items-center gap-2 text-slate-400">
                            <Clock3
                              className="size-4"
                              aria-hidden="true"
                            />

                            <p className="text-xs font-bold uppercase tracking-wide">
                              Durée
                            </p>
                          </div>

                          <p className="mt-3 font-bold text-slate-950">
                            {calculateDuration(
                              aiResult.startedAt,
                              aiResult.finishedAt,
                            )}
                          </p>
                        </article>
                      </div>

                      {/* DATES IA */}
                      <div className="grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2 lg:grid-cols-3">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                            Début du traitement IA
                          </p>

                          <p className="mt-2 text-sm font-semibold text-slate-700">
                            {formatDate(
                              aiResult.startedAt,
                            )}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                            Fin du traitement IA
                          </p>

                          <p className="mt-2 text-sm font-semibold text-slate-700">
                            {formatDate(
                              aiResult.finishedAt,
                            )}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                            Confiance
                          </p>

                          <p className="mt-2 text-sm font-semibold text-slate-700">
                            {formatConfidence(
                              aiResult.confidence,
                            )}
                          </p>
                        </div>
                      </div>

                      {/* FACTURE */}
                      {isInvoice && (
                        <section className="border-t border-slate-100 pt-6">
                          <div className="flex items-center gap-3">
                            <span className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                              <ReceiptText
                                className="size-5"
                                aria-hidden="true"
                              />
                            </span>

                            <div>
                              <h3 className="font-bold text-slate-950">
                                Données de la facture
                              </h3>

                              <p className="mt-1 text-sm text-slate-500">
                                Informations financières extraites automatiquement.
                              </p>
                            </div>
                          </div>

                          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            <article className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
                              <div className="flex items-center gap-2 text-slate-400">
                                <ReceiptText
                                  className="size-4"
                                  aria-hidden="true"
                                />

                                <p className="text-xs font-bold uppercase tracking-wide">
                                  N° de facture
                                </p>
                              </div>

                              <p className="mt-3 text-lg font-bold text-slate-950">
                                {invoiceNumber ??
                                  "Non disponible"}
                              </p>
                            </article>

                            <article className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
                              <div className="flex items-center gap-2 text-slate-400">
                                <CalendarDays
                                  className="size-4"
                                  aria-hidden="true"
                                />

                                <p className="text-xs font-bold uppercase tracking-wide">
                                  Date
                                </p>
                              </div>

                              <p className="mt-3 font-bold text-slate-950">
                                {formatSimpleDate(
                                  invoiceDate,
                                )}
                              </p>
                            </article>

                            <article className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
                              <div className="flex items-center gap-2 text-slate-400">
                                <UsersRound
                                  className="size-4"
                                  aria-hidden="true"
                                />

                                <p className="text-xs font-bold uppercase tracking-wide">
                                  Fournisseur
                                </p>
                              </div>

                              <p className="mt-3 font-bold text-slate-950">
                                {supplier ??
                                  "Non disponible"}
                              </p>
                            </article>

                            <article className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
                              <div className="flex items-center gap-2 text-slate-400">
                                <UserRound
                                  className="size-4"
                                  aria-hidden="true"
                                />

                                <p className="text-xs font-bold uppercase tracking-wide">
                                  Client
                                </p>
                              </div>

                              <p className="mt-3 font-bold text-slate-950">
                                {customer ??
                                  "Non disponible"}
                              </p>
                            </article>
                          </div>

                          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                              <div className="flex items-center gap-2 text-slate-400">
                                <WalletCards
                                  className="size-4"
                                  aria-hidden="true"
                                />

                                <p className="text-xs font-bold uppercase tracking-wide">
                                  Montant HT
                                </p>
                              </div>

                              <p className="mt-3 text-xl font-bold text-slate-950">
                                {formatMoney(
                                  amountExcludingTax,
                                  currency,
                                )}
                              </p>
                            </article>

                            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                              <div className="flex items-center gap-2 text-slate-400">
                                <BadgeEuro
                                  className="size-4"
                                  aria-hidden="true"
                                />

                                <p className="text-xs font-bold uppercase tracking-wide">
                                  TVA
                                </p>
                              </div>

                              <p className="mt-3 text-xl font-bold text-slate-950">
                                {formatMoney(
                                  taxAmount,
                                  currency,
                                )}
                              </p>
                            </article>

                            <article className="rounded-2xl border border-blue-200 bg-blue-50 p-5 md:col-span-2 xl:col-span-2">
                              <div className="flex items-center gap-2 text-blue-600">
                                <BadgeEuro
                                  className="size-4"
                                  aria-hidden="true"
                                />

                                <p className="text-xs font-bold uppercase tracking-wide">
                                  Total TTC
                                </p>
                              </div>

                              <p className="mt-3 text-2xl font-bold text-blue-800">
                                {formatMoney(
                                  amountIncludingTax,
                                  currency,
                                )}
                              </p>
                            </article>
                          </div>

                          <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                            <span className="font-semibold">
                              Devise :
                            </span>

                            <span>
                              {currency ??
                                "Non disponible"}
                            </span>
                          </div>
                        </section>
                      )}

                      {/* EXTRACTION GÉNÉRIQUE */}
                      {!isInvoice &&
                        hasGenericStructuredData && (
                          <>
                            {aiSummary && (
                              <section className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
                                <div className="flex items-start gap-3">
                                  <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                                    <BrainCircuit
                                      className="size-4"
                                      aria-hidden="true"
                                    />
                                  </span>

                                  <div>
                                    <h3 className="font-bold text-slate-950">
                                      Résumé IA
                                    </h3>

                                    <p className="mt-2 text-sm leading-7 text-slate-700">
                                      {aiSummary}
                                    </p>
                                  </div>
                                </div>
                              </section>
                            )}

                            {importantFields.length > 0 && (
                              <section className="border-t border-slate-100 pt-6">
                                <h3 className="font-bold text-slate-950">
                                  Champs importants
                                </h3>

                                <p className="mt-1 text-sm text-slate-500">
                                  Informations principales identifiées
                                  automatiquement dans le document.
                                </p>

                                <div className="mt-4 grid gap-4 md:grid-cols-2">
                                  {importantFields.map(
                                    (
                                      field,
                                      index,
                                    ) => (
                                      <article
                                        key={`${field.name}-${index}`}
                                        className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5"
                                      >
                                        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                          {field.name}
                                        </p>

                                        <p className="mt-3 text-sm font-semibold leading-6 text-slate-800">
                                          {field.value}
                                        </p>
                                      </article>
                                    ),
                                  )}
                                </div>
                              </section>
                            )}

                            {entities.length > 0 && (
                              <section className="border-t border-slate-100 pt-6">
                                <div className="flex items-center gap-2">
                                  <Tags
                                    className="size-4 text-slate-500"
                                    aria-hidden="true"
                                  />

                                  <h3 className="font-bold text-slate-950">
                                    Entités identifiées
                                  </h3>
                                </div>

                                <div className="mt-4 flex flex-wrap gap-2">
                                  {entities.map(
                                    (
                                      entity,
                                      index,
                                    ) => (
                                      <span
                                        key={`${entity}-${index}`}
                                        className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700"
                                      >
                                        {entity}
                                      </span>
                                    ),
                                  )}
                                </div>
                              </section>
                            )}

                            {(dates.length > 0 ||
                              amounts.length > 0) && (
                              <section className="grid gap-5 border-t border-slate-100 pt-6 lg:grid-cols-2">
                                {dates.length > 0 && (
                                  <div className="rounded-2xl border border-slate-200 p-5">
                                    <div className="flex items-center gap-2">
                                      <CalendarDays
                                        className="size-4 text-slate-500"
                                        aria-hidden="true"
                                      />

                                      <h3 className="font-bold text-slate-950">
                                        Dates détectées
                                      </h3>
                                    </div>

                                    <div className="mt-4 flex flex-wrap gap-2">
                                      {dates.map(
                                        (
                                          date,
                                          index,
                                        ) => (
                                          <span
                                            key={`${date}-${index}`}
                                            className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700"
                                          >
                                            {date}
                                          </span>
                                        ),
                                      )}
                                    </div>
                                  </div>
                                )}

                                {amounts.length > 0 && (
                                  <div className="rounded-2xl border border-slate-200 p-5">
                                    <h3 className="font-bold text-slate-950">
                                      Montants / valeurs numériques
                                    </h3>

                                    <div className="mt-4 flex flex-wrap gap-2">
                                      {amounts.map(
                                        (
                                          amount,
                                          index,
                                        ) => (
                                          <span
                                            key={`${amount}-${index}`}
                                            className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700"
                                          >
                                            {amount}
                                          </span>
                                        ),
                                      )}
                                    </div>
                                  </div>
                                )}
                              </section>
                            )}

                            {references.length > 0 && (
                              <section className="border-t border-slate-100 pt-6">
                                <h3 className="font-bold text-slate-950">
                                  Références détectées
                                </h3>

                                <div className="mt-4 flex flex-wrap gap-2">
                                  {references.map(
                                    (
                                      reference,
                                      index,
                                    ) => (
                                      <span
                                        key={`${reference}-${index}`}
                                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 font-mono text-xs font-semibold text-slate-600"
                                      >
                                        {reference}
                                      </span>
                                    ),
                                  )}
                                </div>
                              </section>
                            )}
                          </>
                        )}

                      {/* FALLBACK */}
                      {!isInvoice &&
                        !hasGenericStructuredData &&
                        aiFields && (
                          <section className="border-t border-slate-100 pt-6">
                            <div className="mb-4">
                              <h3 className="font-bold text-slate-950">
                                Données structurées
                              </h3>

                              <p className="mt-1 text-sm text-slate-500">
                                Résultat métier produit par le pipeline IA.
                              </p>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                              <pre className="overflow-x-auto whitespace-pre-wrap break-words font-mono text-sm leading-7 text-slate-700">
                                {JSON.stringify(
                                  aiFields,
                                  null,
                                  2,
                                )}
                              </pre>
                            </div>
                          </section>
                        )}

                      {!aiFields && (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
                          <BrainCircuit
                            className="mx-auto size-6 text-slate-400"
                            aria-hidden="true"
                          />

                          <p className="mt-3 text-sm font-semibold text-slate-700">
                            Aucun champ structuré disponible
                          </p>
                        </div>
                      )}
                    </div>
                  )}
              </div>
            </section>

            {/* HISTORIQUE IA */}
            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
                <div className="flex items-center gap-3">
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
                    <History
                      className="size-5"
                      aria-hidden="true"
                    />
                  </span>

                  <div>
                    <h2 className="font-bold text-slate-950">
                      Historique des traitements IA
                    </h2>

                    <p className="mt-0.5 text-sm text-slate-500">
                      Exécutions successives du pipeline IA réalisées
                      sur ce document.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-7">
                {aiHistoryQuery.isLoading && (
                  <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-6 py-12">
                    <Loader2
                      className="size-6 animate-spin text-indigo-600"
                      aria-hidden="true"
                    />

                    <span className="ml-3 text-sm font-semibold text-slate-600">
                      Chargement de l’historique IA...
                    </span>
                  </div>
                )}

                {aiHistoryQuery.isError && (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                    <div className="flex items-start gap-3">
                      <CircleAlert
                        className="mt-0.5 size-5 shrink-0 text-amber-600"
                        aria-hidden="true"
                      />

                      <div>
                        <p className="font-bold text-amber-900">
                          Historique IA indisponible
                        </p>

                        <p className="mt-1 text-sm leading-6 text-amber-700">
                          Les anciennes exécutions IA n’ont pas pu être
                          récupérées depuis le backend.
                        </p>

                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            void aiHistoryQuery.refetch();
                          }}
                          className="mt-4 rounded-xl border-amber-200 bg-white"
                        >
                          Réessayer
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {!aiHistoryQuery.isLoading &&
                  !aiHistoryQuery.isError &&
                  aiHistory.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
                      <History
                        className="mx-auto size-6 text-slate-400"
                        aria-hidden="true"
                      />

                      <p className="mt-3 text-sm font-semibold text-slate-700">
                        Aucun historique IA disponible
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Aucun traitement IA n’a encore été enregistré
                        pour ce document.
                      </p>
                    </div>
                  )}

                {!aiHistoryQuery.isLoading &&
                  !aiHistoryQuery.isError &&
                  aiHistory.length > 0 && (
                    <div className="space-y-4">
                      {aiHistory.map(
                        (
                          run,
                          index,
                        ) => {
                          const isSuccess =
                            run.status === "SUCCESS";

                          const isProcessing =
                            run.status === "PROCESSING";

                          const isExpanded =
                            expandedAiRunId ===
                            run.llmRunId;

                          const isLatest =
                            index === 0;

                          return (
                            <article
                              key={run.llmRunId}
                              className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                            >
                              <div className="p-5">
                                <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                                  <div className="flex items-start gap-4">
                                    <span
                                      className={
                                        isSuccess
                                          ? "flex size-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600"
                                          : isProcessing
                                            ? "flex size-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600"
                                            : "flex size-11 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600"
                                      }
                                    >
                                      {isSuccess ? (
                                        <CheckCircle2
                                          className="size-5"
                                          aria-hidden="true"
                                        />
                                      ) : isProcessing ? (
                                        <Loader2
                                          className="size-5 animate-spin"
                                          aria-hidden="true"
                                        />
                                      ) : (
                                        <XCircle
                                          className="size-5"
                                          aria-hidden="true"
                                        />
                                      )}
                                    </span>

                                    <div>
                                      <div className="flex flex-wrap items-center gap-2">
                                        <h3 className="font-bold text-slate-950">
                                          Run #{run.llmRunId}
                                        </h3>

                                        <span
                                          className={
                                            isSuccess
                                              ? "rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700"
                                              : isProcessing
                                                ? "rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700"
                                                : "rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700"
                                          }
                                        >
                                          {run.status}
                                        </span>

                                        {isLatest && (
                                          <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700">
                                            Plus récent
                                          </span>
                                        )}
                                      </div>

                                      <p className="mt-2 text-sm text-slate-500">
                                        {formatDate(
                                          run.startedAt,
                                        )}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                    <div className="min-w-40 rounded-xl bg-slate-50 px-4 py-3">
                                      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                                        Modèle
                                      </p>

                                      <p className="mt-1 break-words text-sm font-semibold text-slate-700">
                                        {run.modelName ??
                                          "Non disponible"}
                                      </p>
                                    </div>

                                    <div className="min-w-32 rounded-xl bg-slate-50 px-4 py-3">
                                      <div className="flex items-center gap-1.5 text-slate-400">
                                        <Clock3
                                          className="size-3.5"
                                          aria-hidden="true"
                                        />

                                        <p className="text-[11px] font-bold uppercase tracking-wide">
                                          Durée
                                        </p>
                                      </div>

                                      <p className="mt-1 text-sm font-semibold text-slate-700">
                                        {formatDurationMs(
                                          run.durationMs,
                                        )}
                                      </p>
                                    </div>

                                    <div className="min-w-32 rounded-xl bg-slate-50 px-4 py-3">
                                      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                                        Confiance
                                      </p>

                                      <p className="mt-1 text-sm font-semibold text-slate-700">
                                        {formatConfidence(
                                          run.confidence,
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <div className="mt-5 grid gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2">
                                  <div>
                                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                      Début
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-slate-700">
                                      {formatDate(
                                        run.startedAt,
                                      )}
                                    </p>
                                  </div>

                                  <div>
                                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                      Fin
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-slate-700">
                                      {formatDate(
                                        run.finishedAt,
                                      )}
                                    </p>
                                  </div>
                                </div>

                                {isSuccess &&
                                  run.fields && (
                                    <div className="mt-5 border-t border-slate-100 pt-4">
                                      <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                          setExpandedAiRunId(
                                            isExpanded
                                              ? null
                                              : run.llmRunId,
                                          );
                                        }}
                                        className="rounded-xl"
                                      >
                                        {isExpanded ? (
                                          <ChevronUp
                                            className="size-4"
                                            aria-hidden="true"
                                          />
                                        ) : (
                                          <ChevronDown
                                            className="size-4"
                                            aria-hidden="true"
                                          />
                                        )}

                                        {isExpanded
                                          ? "Masquer le résultat"
                                          : "Voir le résultat"}
                                      </Button>
                                    </div>
                                  )}

                                {!isSuccess &&
                                  !isProcessing && (
                                    <div className="mt-5 rounded-xl border border-red-100 bg-red-50/60 px-4 py-3">
                                      <p className="text-sm font-medium text-red-700">
                                        Cette exécution a échoué. Aucun résultat
                                        métier n’est disponible.
                                      </p>
                                    </div>
                                  )}

                                {isProcessing && (
                                  <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3">
                                    <p className="text-sm font-medium text-blue-700">
                                      Cette exécution est toujours en cours.
                                    </p>
                                  </div>
                                )}
                              </div>

                              {isExpanded &&
                                run.fields && (
                                  <div className="border-t border-slate-200 bg-slate-50/60 p-5">
                                    <div className="mb-4 flex items-center gap-2">
                                      <BrainCircuit
                                        className="size-4 text-indigo-600"
                                        aria-hidden="true"
                                      />

                                      <h4 className="font-bold text-slate-950">
                                        Résultat du Run #{run.llmRunId}
                                      </h4>
                                    </div>

                                    <div className="mb-4 grid gap-3 sm:grid-cols-3">
                                      <div className="rounded-xl border border-slate-200 bg-white p-4">
                                        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                          Type
                                        </p>

                                        <p className="mt-2 text-sm font-semibold text-slate-800">
                                          {run.fields.documentType ??
                                            "Non disponible"}
                                        </p>
                                      </div>

                                      <div className="rounded-xl border border-slate-200 bg-white p-4">
                                        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                          Route métier
                                        </p>

                                        <p className="mt-2 text-sm font-semibold text-slate-800">
                                          {run.fields.processingRoute ??
                                            "Non disponible"}
                                        </p>
                                      </div>

                                      <div className="rounded-xl border border-slate-200 bg-white p-4">
                                        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                          Extracteur
                                        </p>

                                        <p className="mt-2 text-sm font-semibold text-slate-800">
                                          {run.fields.routeExecuted ??
                                            "Non disponible"}
                                        </p>
                                      </div>
                                    </div>

                                    <pre className="max-h-[500px] overflow-auto whitespace-pre-wrap break-words rounded-2xl border border-slate-200 bg-white p-5 font-mono text-xs leading-6 text-slate-700">
                                      {JSON.stringify(
                                        run.fields.fields,
                                        null,
                                        2,
                                      )}
                                    </pre>
                                  </div>
                                )}
                            </article>
                          );
                        },
                      )}
                    </div>
                  )}
              </div>
            </section>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}