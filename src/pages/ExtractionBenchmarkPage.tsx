import {
  useState,
} from "react";

import {
  Activity,
  Clock3,
  FileCheck2,
  Gauge,
  Plus,
  X,
} from "lucide-react";

import {
  CreateExtractionBenchmarkDialog,
} from "@/features/extraction-benchmark/components/CreateExtractionBenchmarkDialog";

import {
  useExtractionBenchmarkHistoryQuery,
} from "@/features/extraction-benchmark/hooks/useExtractionBenchmarkHistoryQuery";

import {
  useExtractionBenchmarkQuery,
} from "@/features/extraction-benchmark/hooks/useExtractionBenchmarkQuery";

import {
  DashboardLayout,
} from "@/layouts/DashboardLayout";

function formatPercentage(
  value: number,
) {
  return `${value.toFixed(2)} %`;
}

function formatMilliseconds(
  value: number | null,
) {
  if (
    value === null
  ) {
    return "—";
  }

  if (
    value < 1000
  ) {
    return `${Math.round(value)} ms`;
  }

  return `${(value / 1000).toFixed(2)} s`;
}

function formatDate(
  value: string,
) {
  return new Intl.DateTimeFormat(
    "fr-FR",
    {
      dateStyle:
        "medium",

      timeStyle:
        "short",
    },
  ).format(
    new Date(value),
  );
}

export default function ExtractionBenchmarkPage() {
  const [
    selectedBenchmarkId,
    setSelectedBenchmarkId,
  ] =
    useState<number | null>(
      null,
    );

  const [
    isCreateDialogOpen,
    setIsCreateDialogOpen,
  ] =
    useState(false);

  const {
    data:
      benchmarks = [],

    isLoading,

    isError,
  } =
    useExtractionBenchmarkHistoryQuery();

  const {
    data:
      selectedBenchmark,

    isLoading:
      isDetailLoading,

    isError:
      isDetailError,
  } =
    useExtractionBenchmarkQuery(
      selectedBenchmarkId,
    );

  if (
    isLoading
  ) {
    return (
      <DashboardLayout>
        <div className="mx-auto w-full max-w-[1600px]">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-64 rounded-lg bg-slate-200 dark:bg-slate-800" />

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {Array.from({
                length: 4,
              }).map(
                (
                  _,
                  index,
                ) => (
                  <div
                    key={
                      index
                    }
                    className="h-32 rounded-2xl bg-slate-200 dark:bg-slate-800"
                  />
                ),
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (
    isError
  ) {
    return (
      <DashboardLayout>
        <div className="mx-auto w-full max-w-[1600px]">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-300">
            Impossible de charger les évaluations d’extraction.
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (
    benchmarks.length ===
    0
  ) {
    return (
      <DashboardLayout>
        <>
          <div className="mx-auto w-full max-w-[1600px] space-y-6">
            <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
                  Évaluation de l’extraction
                </h1>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Analyse de la qualité et des performances des méthodes
                  d’extraction documentaire.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setIsCreateDialogOpen(
                    true,
                  )
                }
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
              >
                <Plus className="size-4" />

                Nouvelle campagne
              </button>
            </section>

            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <FileCheck2 className="mx-auto mb-4 h-10 w-10 text-blue-600" />

              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Aucun benchmark disponible
              </h2>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Lancez une première campagne d’évaluation pour comparer les
                méthodes d’extraction.
              </p>
            </div>
          </div>

          <CreateExtractionBenchmarkDialog
            open={
              isCreateDialogOpen
            }
            onClose={() =>
              setIsCreateDialogOpen(
                false,
              )
            }
          />
        </>
      </DashboardLayout>
    );
  }

  const latestBenchmark =
    benchmarks[0];

  return (
    <DashboardLayout>
      <>
        <div className="mx-auto w-full max-w-[1600px] space-y-6">
          <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
                Évaluation de l’extraction
              </h1>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Analyse de la qualité et des performances des méthodes
                d’extraction documentaire.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setIsCreateDialogOpen(
                  true,
                )
              }
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
            >
              <Plus className="size-4" />

              Nouvelle campagne
            </button>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              title="Précision caractères"
              value={
                formatPercentage(
                  latestBenchmark.characterAccuracy,
                )
              }
              subtitle={`CER ${formatPercentage(
                latestBenchmark.cer * 100,
              )}`}
              icon={
                Gauge
              }
            />

            <MetricCard
              title="Précision mots"
              value={
                formatPercentage(
                  latestBenchmark.wordAccuracy,
                )
              }
              subtitle={`WER ${formatPercentage(
                latestBenchmark.wer * 100,
              )}`}
              icon={
                Activity
              }
            />

            <MetricCard
              title="Temps d’extraction"
              value={
                formatMilliseconds(
                  latestBenchmark.averageExtractionDurationMs,
                )
              }
              subtitle="Moyenne par document"
              icon={
                Clock3
              }
            />

            <MetricCard
              title="Documents évalués"
              value={
                String(
                  latestBenchmark.documentCount,
                )
              }
              subtitle="Dernière campagne"
              icon={
                FileCheck2
              }
            />
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
              <h2 className="font-semibold text-slate-950 dark:text-white">
                Comparaison des méthodes
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Résultats de la campagne la plus récente.
              </p>
            </div>

            <div className="grid gap-4 p-6 lg:grid-cols-2">
              {latestBenchmark.methods.map(
                (
                  method,
                ) => (
                  <article
                    key={
                      method.id
                    }
                    className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-base font-semibold text-slate-950 dark:text-white">
                          {
                            method.extractionMethod
                          }
                        </h3>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          {
                            method.documentCount
                          } document
                          {
                            method.documentCount >
                            1
                              ? "s"
                              : ""
                          }
                        </p>
                      </div>

                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                        {
                          formatPercentage(
                            method.wordAccuracy,
                          )
                        }
                      </span>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-4">
                      <MethodMetric
                        label="CER"
                        value={
                          formatPercentage(
                            method.cer * 100,
                          )
                        }
                      />

                      <MethodMetric
                        label="WER"
                        value={
                          formatPercentage(
                            method.wer * 100,
                          )
                        }
                      />

                      <MethodMetric
                        label="Précision caractères"
                        value={
                          formatPercentage(
                            method.characterAccuracy,
                          )
                        }
                      />

                      <MethodMetric
                        label="Temps extraction"
                        value={
                          formatMilliseconds(
                            method.averageExtractionDurationMs,
                          )
                        }
                      />
                    </div>
                  </article>
                ),
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
              <h2 className="font-semibold text-slate-950 dark:text-white">
                Historique des campagnes
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {
                  benchmarks.length
                } campagne
                {
                  benchmarks.length >
                  1
                    ? "s"
                    : ""
                } enregistrée
                {
                  benchmarks.length >
                  1
                    ? "s"
                    : ""
                }.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px]">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-xs font-medium uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:text-slate-400">
                    <th className="px-6 py-4">
                      Date
                    </th>

                    <th className="px-6 py-4">
                      Documents
                    </th>

                    <th className="px-6 py-4">
                      CER
                    </th>

                    <th className="px-6 py-4">
                      WER
                    </th>

                    <th className="px-6 py-4">
                      Précision mots
                    </th>

                    <th className="px-6 py-4">
                      Extraction
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {benchmarks.map(
                    (
                      benchmark,
                    ) => (
                      <tr
                        key={
                          benchmark.id
                        }
                        onClick={() =>
                          setSelectedBenchmarkId(
                            benchmark.id,
                          )
                        }
                        className="cursor-pointer border-b border-slate-100 text-sm transition-colors hover:bg-slate-50 last:border-b-0 dark:border-slate-800/70 dark:hover:bg-slate-800/40"
                      >
                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">
                          {
                            formatDate(
                              benchmark.createdAt,
                            )
                          }
                        </td>

                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                          {
                            benchmark.documentCount
                          }
                        </td>

                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                          {
                            formatPercentage(
                              benchmark.cer * 100,
                            )
                          }
                        </td>

                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                          {
                            formatPercentage(
                              benchmark.wer * 100,
                            )
                          }
                        </td>

                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                          {
                            formatPercentage(
                              benchmark.wordAccuracy,
                            )
                          }
                        </td>

                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                          {
                            formatMilliseconds(
                              benchmark.averageExtractionDurationMs,
                            )
                          }
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {selectedBenchmarkId !==
          null && (
          <div
            className="fixed inset-0 z-50 flex justify-end bg-slate-950/45 backdrop-blur-[2px]"
            onClick={() =>
              setSelectedBenchmarkId(
                null,
              )
            }
          >
            <aside
              className="h-full w-full max-w-xl overflow-y-auto border-l border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950"
              onClick={
                (
                  event,
                ) =>
                  event.stopPropagation()
              }
            >
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5 dark:border-slate-800 dark:bg-slate-950">
                <div>
                  <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
                    Détail de la campagne
                  </h2>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Benchmark #
                    {
                      selectedBenchmarkId
                    }
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedBenchmarkId(
                      null,
                    )
                  }
                  className="rounded-xl p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
                  aria-label="Fermer le détail du benchmark"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6">
                {isDetailLoading && (
                  <div className="space-y-4">
                    <div className="h-24 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-900" />

                    <div className="h-48 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-900" />
                  </div>
                )}

                {isDetailError && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-300">
                    Impossible de charger le détail de cette campagne.
                  </div>
                )}

                {!isDetailLoading
                  && !isDetailError
                  && selectedBenchmark && (
                    <div className="space-y-6">
                      <section>
                        <h3 className="mb-3 text-sm font-semibold text-slate-950 dark:text-white">
                          Résultats globaux
                        </h3>

                        <div className="grid grid-cols-2 gap-3">
                          <DetailMetric
                            label="Documents"
                            value={
                              String(
                                selectedBenchmark.documentCount,
                              )
                            }
                          />

                          <DetailMetric
                            label="Date"
                            value={
                              formatDate(
                                selectedBenchmark.createdAt,
                              )
                            }
                          />

                          <DetailMetric
                            label="CER"
                            value={
                              formatPercentage(
                                selectedBenchmark.cer * 100,
                              )
                            }
                          />

                          <DetailMetric
                            label="WER"
                            value={
                              formatPercentage(
                                selectedBenchmark.wer * 100,
                              )
                            }
                          />

                          <DetailMetric
                            label="Précision caractères"
                            value={
                              formatPercentage(
                                selectedBenchmark.characterAccuracy,
                              )
                            }
                          />

                          <DetailMetric
                            label="Précision mots"
                            value={
                              formatPercentage(
                                selectedBenchmark.wordAccuracy,
                              )
                            }
                          />

                          <DetailMetric
                            label="Temps extraction"
                            value={
                              formatMilliseconds(
                                selectedBenchmark.averageExtractionDurationMs,
                              )
                            }
                          />

                          <DetailMetric
                            label="Temps traitement"
                            value={
                              formatMilliseconds(
                                selectedBenchmark.averageProcessingDurationMs,
                              )
                            }
                          />

                          <DetailMetric
                            label="Extraction / page"
                            value={
                              formatMilliseconds(
                                selectedBenchmark.averageExtractionDurationPerPageMs,
                              )
                            }
                          />
                        </div>
                      </section>

                      <section>
                        <h3 className="mb-3 text-sm font-semibold text-slate-950 dark:text-white">
                          Documents évalués
                        </h3>

                        {selectedBenchmark.documents.length ===
                        0 ? (
                          <div className="rounded-2xl border border-dashed border-slate-200 p-5 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
                            Aucun détail par document n’est disponible pour cette
                            campagne.
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {selectedBenchmark.documents.map(
                              (
                                document,
                              ) => (
                                <article
                                  key={
                                    document.id
                                  }
                                  className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800"
                                >
                                  <div className="flex items-start justify-between gap-4">
                                    <div>
                                     <p className="break-words font-semibold text-slate-950 dark:text-white">
                                        {
                                            document.fileName
                                            ?? `Document #${document.documentId}`
                                        }
                                        </p>

                                        {document.fileName && (
                                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                            Document #
                                            {
                                            document.documentId
                                            }
                                        </p>
                                        )}
                                    </div>

                                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                                      {
                                        document.extractionMethod
                                      }
                                    </span>
                                  </div>

                                  <div className="mt-4 grid grid-cols-2 gap-3">
                                    <DetailMetric
                                      label="CER"
                                      value={
                                        formatPercentage(
                                          document.cer * 100,
                                        )
                                      }
                                    />

                                    <DetailMetric
                                      label="WER"
                                      value={
                                        formatPercentage(
                                          document.wer * 100,
                                        )
                                      }
                                    />

                                    <DetailMetric
                                      label="Précision caractères"
                                      value={
                                        formatPercentage(
                                          document.characterAccuracy,
                                        )
                                      }
                                    />

                                    <DetailMetric
                                      label="Précision mots"
                                      value={
                                        formatPercentage(
                                          document.wordAccuracy,
                                        )
                                      }
                                    />

                                    <DetailMetric
                                      label="Temps extraction"
                                      value={
                                        formatMilliseconds(
                                          document.extractionDurationMs,
                                        )
                                      }
                                    />

                                    <DetailMetric
                                      label="Temps traitement"
                                      value={
                                        formatMilliseconds(
                                          document.processingDurationMs,
                                        )
                                      }
                                    />

                                    <DetailMetric
                                      label="Extraction / page"
                                      value={
                                        formatMilliseconds(
                                          document.averageExtractionDurationPerPageMs,
                                        )
                                      }
                                    />
                                  </div>
                                </article>
                              ),
                            )}
                          </div>
                        )}
                      </section>

                      <section>
                        <h3 className="mb-3 text-sm font-semibold text-slate-950 dark:text-white">
                          Méthodes d’extraction
                        </h3>

                        <div className="space-y-3">
                          {selectedBenchmark.methods.map(
                            (
                              method,
                            ) => (
                              <article
                                key={
                                  method.id
                                }
                                className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800"
                              >
                                <div className="flex items-center justify-between gap-4">
                                  <div>
                                    <p className="font-semibold text-slate-950 dark:text-white">
                                      {
                                        method.extractionMethod
                                      }
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                      {
                                        method.documentCount
                                      } document
                                      {
                                        method.documentCount >
                                        1
                                          ? "s"
                                          : ""
                                      }
                                    </p>
                                  </div>

                                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                                    {
                                      formatPercentage(
                                        method.wordAccuracy,
                                      )
                                    }
                                  </span>
                                </div>

                                <div className="mt-4 grid grid-cols-2 gap-3">
                                  <DetailMetric
                                    label="CER"
                                    value={
                                      formatPercentage(
                                        method.cer * 100,
                                      )
                                    }
                                  />

                                  <DetailMetric
                                    label="WER"
                                    value={
                                      formatPercentage(
                                        method.wer * 100,
                                      )
                                    }
                                  />

                                  <DetailMetric
                                    label="Précision caractères"
                                    value={
                                      formatPercentage(
                                        method.characterAccuracy,
                                      )
                                    }
                                  />

                                  <DetailMetric
                                    label="Précision mots"
                                    value={
                                      formatPercentage(
                                        method.wordAccuracy,
                                      )
                                    }
                                  />

                                  <DetailMetric
                                    label="Temps extraction"
                                    value={
                                      formatMilliseconds(
                                        method.averageExtractionDurationMs,
                                      )
                                    }
                                  />

                                  <DetailMetric
                                    label="Temps traitement"
                                    value={
                                      formatMilliseconds(
                                        method.averageProcessingDurationMs,
                                      )
                                    }
                                  />

                                  <DetailMetric
                                    label="Extraction / page"
                                    value={
                                      formatMilliseconds(
                                        method.averageExtractionDurationPerPageMs,
                                      )
                                    }
                                  />
                                </div>
                              </article>
                            ),
                          )}
                        </div>
                      </section>
                    </div>
                  )}
              </div>
            </aside>
          </div>
        )}

        <CreateExtractionBenchmarkDialog
          open={
            isCreateDialogOpen
          }
          onClose={() =>
            setIsCreateDialogOpen(
              false,
            )
          }
        />
      </>
    </DashboardLayout>
  );
}

type MetricCardProps = {
  title: string;
  value: string;
  subtitle: string;
  icon: typeof Gauge;
};

function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
}: MetricCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {
              title
            }
          </p>

          <p className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">
            {
              value
            }
          </p>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {
              subtitle
            }
          </p>
        </div>

        <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </article>
  );
}

type MethodMetricProps = {
  label: string;
  value: string;
};

function MethodMetric({
  label,
  value,
}: MethodMetricProps) {
  return (
    <div>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        {
          label
        }
      </p>

      <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
        {
          value
        }
      </p>
    </div>
  );
}

type DetailMetricProps = {
  label: string;
  value: string;
};

function DetailMetric({
  label,
  value,
}: DetailMetricProps) {
  return (
    <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900">
      <p className="text-xs text-slate-500 dark:text-slate-400">
        {
          label
        }
      </p>

      <p className="mt-1 break-words text-sm font-semibold text-slate-950 dark:text-white">
        {
          value
        }
      </p>
    </div>
  );
}