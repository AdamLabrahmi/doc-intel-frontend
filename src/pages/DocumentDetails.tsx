import {
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

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

import {
  Button,
} from "@/components/ui/button";

import {
  useDocumentAiHistoryQuery,
} from "@/features/documents/hooks/useDocumentAiHistoryQuery";

import {
  useDocumentAiResultQuery,
} from "@/features/documents/hooks/useDocumentAiResultQuery";

import {
  useDocumentExtractionQuery,
} from "@/features/documents/hooks/useDocumentExtractionQuery";

import {
  useDocumentExtractedTextQuery,
} from "@/features/documents/hooks/useDocumentExtractedTextQuery";

import {
  DashboardLayout,
} from "@/layouts/DashboardLayout";

import {
  ROUTES,
} from "@/routes/routePaths";

import {
  useSettingsStore,
} from "@/stores/settings.store";

function formatConfidence(
  confidence:
    | number
    | null
    | undefined,
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

  return `${normalizedConfidence.toFixed(
    1,
  )} %`;
}

function formatDate(
  value:
    | string
    | null
    | undefined,
): string {
  if (!value) {
    return "Non disponible";
  }

  const date =
    new Date(
      value,
    );

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "Non disponible";
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

function formatSimpleDate(
  value:
    | string
    | null,
): string {
  if (!value) {
    return "Non disponible";
  }

  const date =
    new Date(
      value,
    );

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "fr-FR",
    {
      dateStyle:
        "medium",
    },
  ).format(
    date,
  );
}

function calculateDuration(
  startedAt:
    | string
    | null
    | undefined,

  finishedAt:
    | string
    | null
    | undefined,
): string {
  if (
    !startedAt ||
    !finishedAt
  ) {
    return "Non disponible";
  }

  const start =
    new Date(
      startedAt,
    ).getTime();

  const end =
    new Date(
      finishedAt,
    ).getTime();

  if (
    Number.isNaN(
      start,
    ) ||
    Number.isNaN(
      end,
    ) ||
    end < start
  ) {
    return "Non disponible";
  }

  const durationSeconds =
    (
      end -
      start
    ) /
    1000;

  if (
    durationSeconds <
    60
  ) {
    return `${durationSeconds.toFixed(
      2,
    )} s`;
  }

  const minutes =
    Math.floor(
      durationSeconds /
        60,
    );

  const seconds =
    Math.round(
      durationSeconds %
        60,
    );

  return `${minutes} min ${seconds} s`;
}

function formatDurationMs(
  durationMs:
    | number
    | null
    | undefined,
): string {
  if (
    durationMs === null ||
    durationMs === undefined ||
    durationMs < 0
  ) {
    return "Non disponible";
  }

  if (
    durationMs <
    60_000
  ) {
    return `${(
      durationMs /
      1000
    ).toFixed(
      2,
    )} s`;
  }

  const minutes =
    Math.floor(
      durationMs /
        60_000,
    );

  const seconds =
    Math.round(
      (
        durationMs %
        60_000
      ) /
        1000,
    );

  return `${minutes} min ${seconds} s`;
}

function isRecord(
  value: unknown,
): value is Record<
  string,
  unknown
> {
  return (
    typeof value ===
      "object" &&
    value !==
      null &&
    !Array.isArray(
      value,
    )
  );
}

function getStringValue(
  object:
    | Record<
        string,
        unknown
      >
    | null,

  key: string,
): string | null {
  if (!object) {
    return null;
  }

  const value =
    object[
      key
    ];

  if (
    typeof value !==
      "string" ||
    value.trim()
      .length ===
      0
  ) {
    return null;
  }

  return value.trim();
}

function getNumberValue(
  object:
    | Record<
        string,
        unknown
      >
    | null,

  key: string,
): number | null {
  if (!object) {
    return null;
  }

  const value =
    object[
      key
    ];

  if (
    typeof value ===
      "number" &&
    Number.isFinite(
      value,
    )
  ) {
    return value;
  }

  if (
    typeof value ===
      "string" &&
    value.trim()
      .length >
      0
  ) {
    const normalized =
      value
        .replace(
          /\s/g,
          "",
        )
        .replace(
          ",",
          ".",
        );

    const number =
      Number(
        normalized,
      );

    if (
      Number.isFinite(
        number,
      )
    ) {
      return number;
    }
  }

  return null;
}

function getStringArray(
  object:
    | Record<
        string,
        unknown
      >
    | null,

  key: string,
): string[] {
  if (!object) {
    return [];
  }

  const value =
    object[
      key
    ];

  if (
    !Array.isArray(
      value,
    )
  ) {
    return [];
  }

  return value.filter(
    (
      item,
    ): item is string =>
      typeof item ===
        "string" &&
      item.trim()
        .length >
        0,
  );
}

function formatMoney(
  amount:
    | number
    | null,

  currency:
    | string
    | null,
): string {
  if (
    amount ===
    null
  ) {
    return "Non disponible";
  }

  const formattedAmount =
    new Intl.NumberFormat(
      "fr-FR",
      {
        minimumFractionDigits:
          0,

        maximumFractionDigits:
          2,
      },
    ).format(
      amount,
    );

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
  object:
    | Record<
        string,
        unknown
      >
    | null,
): ImportantField[] {
  if (!object) {
    return [];
  }

  const value =
    object.importantFields;

  if (
    !Array.isArray(
      value,
    )
  ) {
    return [];
  }

  return value.flatMap(
    (
      item,
    ): ImportantField[] => {
      if (
        !isRecord(
          item,
        )
      ) {
        return [];
      }

      const name =
        item.name;

      const fieldValue =
        item.value;

      if (
        typeof name !==
          "string" ||
        typeof fieldValue !==
          "string"
      ) {
        return [];
      }

      return [
        {
          name:
            name.trim(),

          value:
            fieldValue.trim(),
        },
      ];
    },
  );
}

export default function DocumentDetails() {
  const navigate =
    useNavigate();

  const technicalDetailsMode =
    useSettingsStore(
      (
        state,
      ) =>
        state.technicalDetailsMode,
    );

  const showTechnicalDetails =
    technicalDetailsMode ===
    "detailed";

  const {
    documentId:
      documentIdParam,
  } =
    useParams<{
      documentId: string;
    }>();

  const [
    expandedAiRunId,
    setExpandedAiRunId,
  ] =
    useState<
      number | null
    >(
      null,
    );

  const documentId =
    Number(
      documentIdParam,
    );

  const isDocumentIdValid =
    Number.isFinite(
      documentId,
    ) &&
    documentId >
      0;

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
    aiResult?.fieldsJson
      ?.documentType ??
    null;

  const aiFields =
    aiResult?.fieldsJson
      ?.fields;

  const aiFieldsRecord =
    isRecord(
      aiFields,
    )
      ? aiFields
      : null;

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
    Boolean(
      aiSummary,
    ) ||
    importantFields.length >
      0 ||
    entities.length >
      0 ||
    dates.length >
      0 ||
    amounts.length >
      0 ||
    references.length >
      0;

  const isInvoice =
    aiDocumentType ===
    "FACTURE";

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

  if (
    !isDocumentIdValid
  ) {
    return (
      <DashboardLayout>
        <div className="mx-auto w-full max-w-[1400px]">
          <section className="rounded-3xl border border-red-200 bg-red-50 p-8 dark:border-red-900/50 dark:bg-red-950/30">
            <div className="flex items-start gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white text-red-600 shadow-sm dark:bg-slate-900 dark:text-red-400">
                <CircleAlert
                  className="size-5"
                  aria-hidden="true"
                />
              </span>

              <div>
                <h1 className="text-lg font-bold text-red-900 dark:text-red-300">
                  Document invalide
                </h1>

                <p className="mt-2 text-sm leading-6 text-red-700 dark:text-red-400">
                  L’identifiant du document présent dans l’URL n’est pas valide.
                </p>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    navigate(
                      ROUTES.documents,
                    )
                  }
                  className="mt-5 rounded-xl border-red-200 bg-white dark:border-red-900/50 dark:bg-slate-900 dark:text-slate-200"
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
        {/* =====================================================
            Header
        ===================================================== */}

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
              className="size-10 shrink-0 rounded-xl border-slate-200 bg-white p-0 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Retour à la liste des documents"
            >
              <ArrowLeft
                className="size-4"
                aria-hidden="true"
              />
            </Button>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
                Détail du document
              </h1>

              {showTechnicalDetails ? (
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Document #{documentId}
                </p>
              ) : null}
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

        {/* =====================================================
            Loading
        ===================================================== */}

        {isLoading ? (
          <section className="rounded-3xl border border-slate-200 bg-white px-6 py-16 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-col items-center justify-center text-center">
              <Loader2
                className="size-7 animate-spin text-blue-600 dark:text-blue-400"
                aria-hidden="true"
              />

              <p className="mt-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                Chargement du document...
              </p>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Récupération des informations d’extraction.
              </p>
            </div>
          </section>
        ) : null}

        {/* =====================================================
            Erreur
        ===================================================== */}

        {!isLoading &&
        hasError ? (
          <section className="rounded-3xl border border-red-200 bg-red-50 p-6 dark:border-red-900/50 dark:bg-red-950/30">
            <div className="flex items-start gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white text-red-600 shadow-sm dark:bg-slate-900 dark:text-red-400">
                <CircleAlert
                  className="size-5"
                  aria-hidden="true"
                />
              </span>

              <div>
                <h2 className="font-bold text-red-900 dark:text-red-300">
                  Impossible de charger le document
                </h2>

                <p className="mt-2 text-sm leading-6 text-red-700 dark:text-red-400">
                  Les informations d’extraction ou le texte extrait n’ont pas pu être récupérés depuis le backend.
                </p>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    void extractionQuery.refetch();
                    void extractedTextQuery.refetch();
                  }}
                  className="mt-4 rounded-xl border-red-200 bg-white dark:border-red-900/50 dark:bg-slate-900 dark:text-slate-200"
                >
                  Réessayer
                </Button>
              </div>
            </div>
          </section>
        ) : null}

        {!isLoading &&
        !hasError ? (
          <>
            {/* =================================================
                Informations d'extraction
            ================================================= */}

            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-7">
              <div className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                  <ScanText
                    className="size-5"
                    aria-hidden="true"
                  />
                </span>

                <div>
                  <h2 className="font-bold text-slate-950 dark:text-white">
                    Informations d’extraction
                  </h2>

                  <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                    Informations générées lors de l’extraction du document.
                  </p>
                </div>
              </div>

              <div
                className={[
                  "mt-6 grid gap-4 sm:grid-cols-2",
                  showTechnicalDetails
                    ? "xl:grid-cols-4"
                    : "xl:grid-cols-3",
                ].join(
                  " ",
                )}
              >
                <article className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-700 dark:bg-slate-800/60">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <ScanText
                      className="size-4"
                      aria-hidden="true"
                    />

                    <span className="text-xs font-bold uppercase tracking-wide">
                      Méthode
                    </span>
                  </div>

                  <p className="mt-3 font-bold text-slate-950 dark:text-white">
                    {extraction?.extractionMethod ??
                      "Non disponible"}
                  </p>
                </article>

                <article className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-700 dark:bg-slate-800/60">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <Languages
                      className="size-4"
                      aria-hidden="true"
                    />

                    <span className="text-xs font-bold uppercase tracking-wide">
                      Langue
                    </span>
                  </div>

                  <p className="mt-3 font-bold text-slate-950 dark:text-white">
                    {extraction?.language ??
                      "Non disponible"}
                  </p>
                </article>

                <article className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-700 dark:bg-slate-800/60">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <ShieldCheck
                      className="size-4"
                      aria-hidden="true"
                    />

                    <span className="text-xs font-bold uppercase tracking-wide">
                      Confiance
                    </span>
                  </div>

                  <p className="mt-3 font-bold text-slate-950 dark:text-white">
                    {formatConfidence(
                      extraction?.confidence,
                    )}
                  </p>
                </article>

                {showTechnicalDetails ? (
                  <article className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-700 dark:bg-slate-800/60">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                      <FileText
                        className="size-4"
                        aria-hidden="true"
                      />

                      <span className="text-xs font-bold uppercase tracking-wide">
                        Identifiant
                      </span>
                    </div>

                    <p className="mt-3 font-bold text-slate-950 dark:text-white">
                      #{documentId}
                    </p>
                  </article>
                ) : null}
              </div>

              {showTechnicalDetails ? (
                <div className="mt-5 grid gap-4 border-t border-slate-100 pt-5 dark:border-slate-800 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                      Création
                    </p>

                    <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {formatDate(
                        extraction?.createdAt,
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                      Dernière modification
                    </p>

                    <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {formatDate(
                        extraction?.updatedAt,
                      )}
                    </p>
                  </div>
                </div>
              ) : null}
            </section>

            {/* =================================================
                Texte extrait
            ================================================= */}

            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="border-b border-slate-100 px-5 py-5 dark:border-slate-800 sm:px-7">
                <div className="flex items-center gap-3">
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400">
                    <FileText
                      className="size-5"
                      aria-hidden="true"
                    />
                  </span>

                  <div>
                    <h2 className="font-bold text-slate-950 dark:text-white">
                      Texte extrait
                    </h2>

                    <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                      Contenu textuel récupéré automatiquement depuis le document.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-7">
                {extractedText
                  ?.extractedText
                  ?.trim() ? (
                  <pre className="max-h-[650px] overflow-auto whitespace-pre-wrap break-words rounded-2xl border border-slate-200 bg-slate-50 p-5 font-mono text-sm leading-7 text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
                    {
                      extractedText.extractedText
                    }
                  </pre>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-800/50">
                    <FileText
                      className="mx-auto size-6 text-slate-400 dark:text-slate-500"
                      aria-hidden="true"
                    />

                    <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Aucun texte extrait disponible
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* =================================================
                Analyse IA
            ================================================= */}

            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="border-b border-slate-100 px-5 py-5 dark:border-slate-800 sm:px-7">
                <div className="flex items-center gap-3">
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400">
                    <BrainCircuit
                      className="size-5"
                      aria-hidden="true"
                    />
                  </span>

                  <div>
                    <h2 className="font-bold text-slate-950 dark:text-white">
                      Analyse IA
                    </h2>

                    <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                      Résultat structuré produit automatiquement par l’intelligence artificielle.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-7">
                {aiResultQuery.isLoading ? (
                  <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-6 py-12 dark:border-slate-700 dark:bg-slate-800/50">
                    <Loader2
                      className="size-6 animate-spin text-violet-600 dark:text-violet-400"
                      aria-hidden="true"
                    />

                    <span className="ml-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
                      Chargement de l’analyse IA...
                    </span>
                  </div>
                ) : null}

                {aiResultQuery.isError ? (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900/50 dark:bg-amber-950/25">
                    <div className="flex items-start gap-3">
                      <CircleAlert
                        className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400"
                        aria-hidden="true"
                      />

                      <div>
                        <p className="font-bold text-amber-900 dark:text-amber-300">
                          Analyse IA indisponible
                        </p>

                        <p className="mt-1 text-sm leading-6 text-amber-700 dark:text-amber-400">
                          Aucun résultat IA exploitable n’est encore disponible pour ce document, ou le traitement n’est pas terminé.
                        </p>

                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            void aiResultQuery.refetch();
                          }}
                          className="mt-4 rounded-xl border-amber-200 bg-white dark:border-amber-900/50 dark:bg-slate-900 dark:text-slate-200"
                        >
                          Réessayer
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : null}

                {!aiResultQuery.isLoading &&
                !aiResultQuery.isError &&
                aiResult ? (
                  <div className="space-y-7">
                    {/* =========================================
                        Métadonnées IA
                    ========================================= */}

                    <div
                      className={[
                        "grid gap-4 sm:grid-cols-2",
                        showTechnicalDetails
                          ? "lg:grid-cols-3 xl:grid-cols-6"
                          : "lg:grid-cols-3",
                      ].join(
                        " ",
                      )}
                    >
                      <article className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-700 dark:bg-slate-800/60">
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                          Type
                        </p>

                        <p className="mt-3 font-bold text-slate-950 dark:text-white">
                          {aiResult.fieldsJson?.documentType ??
                            "Non disponible"}
                        </p>
                      </article>

                      {showTechnicalDetails ? (
                        <>
                          <article className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-700 dark:bg-slate-800/60">
                            <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                              <Route
                                className="size-4"
                                aria-hidden="true"
                              />

                              <p className="text-xs font-bold uppercase tracking-wide">
                                Route métier
                              </p>
                            </div>

                            <p className="mt-3 font-bold text-slate-950 dark:text-white">
                              {aiResult.fieldsJson?.processingRoute ??
                                "Non disponible"}
                            </p>
                          </article>

                          <article className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-700 dark:bg-slate-800/60">
                            <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                              <Sparkles
                                className="size-4"
                                aria-hidden="true"
                              />

                              <p className="text-xs font-bold uppercase tracking-wide">
                                Extracteur
                              </p>
                            </div>

                            <p className="mt-3 font-bold text-slate-950 dark:text-white">
                              {aiResult.fieldsJson?.routeExecuted ??
                                "Non disponible"}
                            </p>
                          </article>

                          <article className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-700 dark:bg-slate-800/60">
                            <p className="text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                              Modèle
                            </p>

                            <p className="mt-3 break-words font-bold text-slate-950 dark:text-white">
                              {aiResult.modelName ??
                                "Non disponible"}
                            </p>
                          </article>
                        </>
                      ) : null}

                      <article className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 dark:border-emerald-900/50 dark:bg-emerald-500/10">
                        <p className="text-xs font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                          Statut
                        </p>

                        <p className="mt-3 font-bold text-emerald-800 dark:text-emerald-300">
                          {aiResult.status ??
                            "Non disponible"}
                        </p>
                      </article>

                      {showTechnicalDetails ? (
                        <article className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-700 dark:bg-slate-800/60">
                          <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                            <Clock3
                              className="size-4"
                              aria-hidden="true"
                            />

                            <p className="text-xs font-bold uppercase tracking-wide">
                              Durée
                            </p>
                          </div>

                          <p className="mt-3 font-bold text-slate-950 dark:text-white">
                            {calculateDuration(
                              aiResult.startedAt,
                              aiResult.finishedAt,
                            )}
                          </p>
                        </article>
                      ) : (
                        <article className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-700 dark:bg-slate-800/60">
                          <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                            <ShieldCheck
                              className="size-4"
                              aria-hidden="true"
                            />

                            <p className="text-xs font-bold uppercase tracking-wide">
                              Confiance
                            </p>
                          </div>

                          <p className="mt-3 font-bold text-slate-950 dark:text-white">
                            {formatConfidence(
                              aiResult.confidence,
                            )}
                          </p>
                        </article>
                      )}
                    </div>

                    {showTechnicalDetails ? (
                      <div className="grid gap-4 border-t border-slate-100 pt-5 dark:border-slate-800 sm:grid-cols-2 lg:grid-cols-3">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                            Début du traitement IA
                          </p>

                          <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                            {formatDate(
                              aiResult.startedAt,
                            )}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                            Fin du traitement IA
                          </p>

                          <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                            {formatDate(
                              aiResult.finishedAt,
                            )}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                            Confiance
                          </p>

                          <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                            {formatConfidence(
                              aiResult.confidence,
                            )}
                          </p>
                        </div>
                      </div>
                    ) : null}

                    {/* =========================================
                        Facture
                    ========================================= */}

                    {isInvoice ? (
                      <section className="border-t border-slate-100 pt-6 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                          <span className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                            <ReceiptText
                              className="size-5"
                              aria-hidden="true"
                            />
                          </span>

                          <div>
                            <h3 className="font-bold text-slate-950 dark:text-white">
                              Données de la facture
                            </h3>

                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                              Informations financières extraites automatiquement.
                            </p>
                          </div>
                        </div>

                        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                          {[
                            {
                              label:
                                "N° de facture",

                              value:
                                invoiceNumber ??
                                "Non disponible",

                              icon:
                                ReceiptText,
                            },

                            {
                              label:
                                "Date",

                              value:
                                formatSimpleDate(
                                  invoiceDate,
                                ),

                              icon:
                                CalendarDays,
                            },

                            {
                              label:
                                "Fournisseur",

                              value:
                                supplier ??
                                "Non disponible",

                              icon:
                                UsersRound,
                            },

                            {
                              label:
                                "Client",

                              value:
                                customer ??
                                "Non disponible",

                              icon:
                                UserRound,
                            },
                          ].map(
                            (
                              item,
                            ) => {
                              const Icon =
                                item.icon;

                              return (
                                <article
                                  key={
                                    item.label
                                  }
                                  className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 dark:border-slate-700 dark:bg-slate-800/60"
                                >
                                  <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                                    <Icon
                                      className="size-4"
                                      aria-hidden="true"
                                    />

                                    <p className="text-xs font-bold uppercase tracking-wide">
                                      {
                                        item.label
                                      }
                                    </p>
                                  </div>

                                  <p className="mt-3 font-bold text-slate-950 dark:text-white">
                                    {
                                      item.value
                                    }
                                  </p>
                                </article>
                              );
                            },
                          )}
                        </div>

                        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                            <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                              <WalletCards
                                className="size-4"
                                aria-hidden="true"
                              />

                              <p className="text-xs font-bold uppercase tracking-wide">
                                Montant HT
                              </p>
                            </div>

                            <p className="mt-3 text-xl font-bold text-slate-950 dark:text-white">
                              {formatMoney(
                                amountExcludingTax,
                                currency,
                              )}
                            </p>
                          </article>

                          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                            <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                              <BadgeEuro
                                className="size-4"
                                aria-hidden="true"
                              />

                              <p className="text-xs font-bold uppercase tracking-wide">
                                TVA
                              </p>
                            </div>

                            <p className="mt-3 text-xl font-bold text-slate-950 dark:text-white">
                              {formatMoney(
                                taxAmount,
                                currency,
                              )}
                            </p>
                          </article>

                          <article className="rounded-2xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-900/50 dark:bg-blue-500/10 md:col-span-2 xl:col-span-2">
                            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                              <BadgeEuro
                                className="size-4"
                                aria-hidden="true"
                              />

                              <p className="text-xs font-bold uppercase tracking-wide">
                                Total TTC
                              </p>
                            </div>

                            <p className="mt-3 text-2xl font-bold text-blue-800 dark:text-blue-300">
                              {formatMoney(
                                amountIncludingTax,
                                currency,
                              )}
                            </p>
                          </article>
                        </div>

                        <div className="mt-4 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                          <span className="font-semibold">
                            Devise :
                          </span>

                          <span>
                            {currency ??
                              "Non disponible"}
                          </span>
                        </div>
                      </section>
                    ) : null}

                    {/* =========================================
                        Extraction générique
                    ========================================= */}

                    {!isInvoice &&
                    hasGenericStructuredData ? (
                      <>
                        {aiSummary ? (
                          <section className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5 dark:border-blue-900/40 dark:bg-blue-500/5">
                            <div className="flex items-start gap-3">
                              <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm dark:bg-slate-900 dark:text-blue-400">
                                <BrainCircuit
                                  className="size-4"
                                  aria-hidden="true"
                                />
                              </span>

                              <div>
                                <h3 className="font-bold text-slate-950 dark:text-white">
                                  Résumé IA
                                </h3>

                                <p className="mt-2 text-sm leading-7 text-slate-700 dark:text-slate-300">
                                  {
                                    aiSummary
                                  }
                                </p>
                              </div>
                            </div>
                          </section>
                        ) : null}

                        {importantFields.length >
                        0 ? (
                          <section className="border-t border-slate-100 pt-6 dark:border-slate-800">
                            <h3 className="font-bold text-slate-950 dark:text-white">
                              Champs importants
                            </h3>

                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                              Informations principales identifiées automatiquement dans le document.
                            </p>

                            <div className="mt-4 grid gap-4 md:grid-cols-2">
                              {importantFields.map(
                                (
                                  field,
                                  index,
                                ) => (
                                  <article
                                    key={`${field.name}-${index}`}
                                    className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 dark:border-slate-700 dark:bg-slate-800/60"
                                  >
                                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                                      {
                                        field.name
                                      }
                                    </p>

                                    <p className="mt-3 text-sm font-semibold leading-6 text-slate-800 dark:text-slate-200">
                                      {
                                        field.value
                                      }
                                    </p>
                                  </article>
                                ),
                              )}
                            </div>
                          </section>
                        ) : null}

                        {entities.length >
                        0 ? (
                          <section className="border-t border-slate-100 pt-6 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                              <Tags
                                className="size-4 text-slate-500 dark:text-slate-400"
                                aria-hidden="true"
                              />

                              <h3 className="font-bold text-slate-950 dark:text-white">
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
                                    className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:border-blue-900/50 dark:bg-blue-500/10 dark:text-blue-400"
                                  >
                                    {
                                      entity
                                    }
                                  </span>
                                ),
                              )}
                            </div>
                          </section>
                        ) : null}

                        {(dates.length >
                          0 ||
                          amounts.length >
                            0) ? (
                          <section className="grid gap-5 border-t border-slate-100 pt-6 dark:border-slate-800 lg:grid-cols-2">
                            {dates.length >
                            0 ? (
                              <div className="rounded-2xl border border-slate-200 p-5 dark:border-slate-700">
                                <div className="flex items-center gap-2">
                                  <CalendarDays
                                    className="size-4 text-slate-500 dark:text-slate-400"
                                    aria-hidden="true"
                                  />

                                  <h3 className="font-bold text-slate-950 dark:text-white">
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
                                        className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                      >
                                        {
                                          date
                                        }
                                      </span>
                                    ),
                                  )}
                                </div>
                              </div>
                            ) : null}

                            {amounts.length >
                            0 ? (
                              <div className="rounded-2xl border border-slate-200 p-5 dark:border-slate-700">
                                <h3 className="font-bold text-slate-950 dark:text-white">
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
                                        className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                      >
                                        {
                                          amount
                                        }
                                      </span>
                                    ),
                                  )}
                                </div>
                              </div>
                            ) : null}
                          </section>
                        ) : null}

                        {references.length >
                        0 ? (
                          <section className="border-t border-slate-100 pt-6 dark:border-slate-800">
                            <h3 className="font-bold text-slate-950 dark:text-white">
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
                                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 font-mono text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                  >
                                    {
                                      reference
                                    }
                                  </span>
                                ),
                              )}
                            </div>
                          </section>
                        ) : null}
                      </>
                    ) : null}

                    {!isInvoice &&
                    !hasGenericStructuredData &&
                    aiFields ? (
                      <section className="border-t border-slate-100 pt-6 dark:border-slate-800">
                        <div className="mb-4">
                          <h3 className="font-bold text-slate-950 dark:text-white">
                            Données structurées
                          </h3>

                          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Résultat métier produit par le pipeline IA.
                          </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-950">
                          <pre className="overflow-x-auto whitespace-pre-wrap break-words font-mono text-sm leading-7 text-slate-700 dark:text-slate-300">
                            {JSON.stringify(
                              aiFields,
                              null,
                              2,
                            )}
                          </pre>
                        </div>
                      </section>
                    ) : null}

                    {!aiFields ? (
                      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center dark:border-slate-700 dark:bg-slate-800/50">
                        <BrainCircuit
                          className="mx-auto size-6 text-slate-400 dark:text-slate-500"
                          aria-hidden="true"
                        />

                        <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
                          Aucun champ structuré disponible
                        </p>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </section>

            {/* =================================================
                Historique IA
                Visible uniquement en mode détaillé
            ================================================= */}

            {showTechnicalDetails ? (
              <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="border-b border-slate-100 px-5 py-5 dark:border-slate-800 sm:px-7">
                  <div className="flex items-center gap-3">
                    <span className="flex size-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400">
                      <History
                        className="size-5"
                        aria-hidden="true"
                      />
                    </span>

                    <div>
                      <h2 className="font-bold text-slate-950 dark:text-white">
                        Historique des traitements IA
                      </h2>

                      <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                        Exécutions successives du pipeline IA réalisées sur ce document.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5 sm:p-7">
                  {aiHistoryQuery.isLoading ? (
                    <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-6 py-12 dark:border-slate-700 dark:bg-slate-800/50">
                      <Loader2
                        className="size-6 animate-spin text-indigo-600 dark:text-indigo-400"
                        aria-hidden="true"
                      />

                      <span className="ml-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
                        Chargement de l’historique IA...
                      </span>
                    </div>
                  ) : null}

                  {aiHistoryQuery.isError ? (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900/50 dark:bg-amber-950/25">
                      <div className="flex items-start gap-3">
                        <CircleAlert
                          className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400"
                          aria-hidden="true"
                        />

                        <div>
                          <p className="font-bold text-amber-900 dark:text-amber-300">
                            Historique IA indisponible
                          </p>

                          <p className="mt-1 text-sm leading-6 text-amber-700 dark:text-amber-400">
                            Les anciennes exécutions IA n’ont pas pu être récupérées depuis le backend.
                          </p>

                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              void aiHistoryQuery.refetch();
                            }}
                            className="mt-4 rounded-xl border-amber-200 bg-white dark:border-amber-900/50 dark:bg-slate-900 dark:text-slate-200"
                          >
                            Réessayer
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {!aiHistoryQuery.isLoading &&
                  !aiHistoryQuery.isError &&
                  aiHistory.length ===
                    0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-800/50">
                      <History
                        className="mx-auto size-6 text-slate-400 dark:text-slate-500"
                        aria-hidden="true"
                      />

                      <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Aucun historique IA disponible
                      </p>

                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Aucun traitement IA n’a encore été enregistré pour ce document.
                      </p>
                    </div>
                  ) : null}

                  {!aiHistoryQuery.isLoading &&
                  !aiHistoryQuery.isError &&
                  aiHistory.length >
                    0 ? (
                    <div className="space-y-4">
                      {aiHistory.map(
                        (
                          run,
                          index,
                        ) => {
                          const isSuccess =
                            run.status ===
                            "SUCCESS";

                          const isProcessing =
                            run.status ===
                            "PROCESSING";

                          const isExpanded =
                            expandedAiRunId ===
                            run.llmRunId;

                          const isLatest =
                            index ===
                            0;

                          return (
                            <article
                              key={
                                run.llmRunId
                              }
                              className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/40"
                            >
                              <div className="p-5">
                                <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                                  <div className="flex items-start gap-4">
                                    <span
                                      className={
                                        isSuccess
                                          ? "flex size-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                                          : isProcessing
                                            ? "flex size-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                                            : "flex size-11 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
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
                                        <h3 className="font-bold text-slate-950 dark:text-white">
                                          Run #{run.llmRunId}
                                        </h3>

                                        <span
                                          className={
                                            isSuccess
                                              ? "rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                                              : isProcessing
                                                ? "rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
                                                : "rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700 dark:bg-red-500/10 dark:text-red-400"
                                          }
                                        >
                                          {
                                            run.status
                                          }
                                        </span>

                                        {isLatest ? (
                                          <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400">
                                            Plus récent
                                          </span>
                                        ) : null}
                                      </div>

                                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                        {formatDate(
                                          run.startedAt,
                                        )}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                    <div className="min-w-40 rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
                                      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                                        Modèle
                                      </p>

                                      <p className="mt-1 break-words text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        {run.modelName ??
                                          "Non disponible"}
                                      </p>
                                    </div>

                                    <div className="min-w-32 rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
                                      <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
                                        <Clock3
                                          className="size-3.5"
                                          aria-hidden="true"
                                        />

                                        <p className="text-[11px] font-bold uppercase tracking-wide">
                                          Durée
                                        </p>
                                      </div>

                                      <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        {formatDurationMs(
                                          run.durationMs,
                                        )}
                                      </p>
                                    </div>

                                    <div className="min-w-32 rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
                                      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                                        Confiance
                                      </p>

                                      <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        {formatConfidence(
                                          run.confidence,
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <div className="mt-5 grid gap-4 border-t border-slate-100 pt-4 dark:border-slate-700 sm:grid-cols-2">
                                  <div>
                                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                                      Début
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                      {formatDate(
                                        run.startedAt,
                                      )}
                                    </p>
                                  </div>

                                  <div>
                                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                                      Fin
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                      {formatDate(
                                        run.finishedAt,
                                      )}
                                    </p>
                                  </div>
                                </div>

                                {isSuccess &&
                                run.fields ? (
                                  <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-700">
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
                                      className="rounded-xl dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
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
                                ) : null}

                                {!isSuccess &&
                                !isProcessing ? (
                                  <div className="mt-5 rounded-xl border border-red-100 bg-red-50/60 px-4 py-3 dark:border-red-900/50 dark:bg-red-950/25">
                                    <p className="text-sm font-medium text-red-700 dark:text-red-400">
                                      Cette exécution a échoué. Aucun résultat métier n’est disponible.
                                    </p>
                                  </div>
                                ) : null}

                                {isProcessing ? (
                                  <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3 dark:border-blue-900/50 dark:bg-blue-500/10">
                                    <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
                                      Cette exécution est toujours en cours.
                                    </p>
                                  </div>
                                ) : null}
                              </div>

                              {isExpanded &&
                              run.fields ? (
                                <div className="border-t border-slate-200 bg-slate-50/60 p-5 dark:border-slate-700 dark:bg-slate-950/60">
                                  <div className="mb-4 flex items-center gap-2">
                                    <BrainCircuit
                                      className="size-4 text-indigo-600 dark:text-indigo-400"
                                      aria-hidden="true"
                                    />

                                    <h4 className="font-bold text-slate-950 dark:text-white">
                                      Résultat du Run #{run.llmRunId}
                                    </h4>
                                  </div>

                                  <div className="mb-4 grid gap-3 sm:grid-cols-3">
                                    {[
                                      {
                                        label:
                                          "Type",

                                        value:
                                          run.fields.documentType ??
                                          "Non disponible",
                                      },

                                      {
                                        label:
                                          "Route métier",

                                        value:
                                          run.fields.processingRoute ??
                                          "Non disponible",
                                      },

                                      {
                                        label:
                                          "Extracteur",

                                        value:
                                          run.fields.routeExecuted ??
                                          "Non disponible",
                                      },
                                    ].map(
                                      (
                                        item,
                                      ) => (
                                        <div
                                          key={
                                            item.label
                                          }
                                          className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
                                        >
                                          <p className="text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                                            {
                                              item.label
                                            }
                                          </p>

                                          <p className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                                            {
                                              item.value
                                            }
                                          </p>
                                        </div>
                                      ),
                                    )}
                                  </div>

                                  <pre className="max-h-[500px] overflow-auto whitespace-pre-wrap break-words rounded-2xl border border-slate-200 bg-white p-5 font-mono text-xs leading-6 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                                    {JSON.stringify(
                                      run.fields.fields,
                                      null,
                                      2,
                                    )}
                                  </pre>
                                </div>
                              ) : null}
                            </article>
                          );
                        },
                      )}
                    </div>
                  ) : null}
                </div>
              </section>
            ) : null}
          </>
        ) : null}
      </div>
    </DashboardLayout>
  );
}