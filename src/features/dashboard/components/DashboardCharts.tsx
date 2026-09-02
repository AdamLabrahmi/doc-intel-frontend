import {
  motion,
  useReducedMotion,
} from "framer-motion";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  useDashboardAnalyticsQuery,
} from "@/features/dashboard/hooks/useDashboardAnalyticsQuery";

import type {
  DashboardExtractionDistributionDto,
  DashboardExtractionMethod,
  DashboardProcessingEvolutionDto,
} from "@/features/dashboard/types/dashboard.types";

function formatDayLabel(
  value: string,
): string {
  const date =
    new Date(value);

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
      weekday: "short",
    },
  )
    .format(date)
    .replace(".", "")
    .toLowerCase();
}

function formatPercentage(
  value: number,
): string {
  return `${value.toLocaleString(
    "fr-FR",
    {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    },
  )} %`;
}

function resolveExtractionLabel(
  method: DashboardExtractionMethod,
): string {
  if (method === "TESSERACT") {
    return "OCR";
  }

  return "Extraction native";
}

function resolveExtractionColor(
  method: DashboardExtractionMethod,
): string {
  if (method === "TESSERACT") {
    return "#06B6D4";
  }

  return "#2563EB";
}

function buildProcessingEvolutionData(
  items:
    | DashboardProcessingEvolutionDto[]
    | undefined,
) {
  if (!items) {
    return [];
  }

  return items.map(
    (item) => ({
      label:
        formatDayLabel(
          item.date,
        ),
      importedDocuments:
        item.importedDocuments,
      completedDocuments:
        item.completedDocuments,
    }),
  );
}

function buildExtractionDistributionData(
  items:
    | DashboardExtractionDistributionDto[]
    | undefined,
) {
  if (!items || items.length === 0) {
    return [];
  }

  const total =
    items.reduce(
      (
        sum,
        item,
      ) =>
        sum + item.count,
      0,
    );

  return items
    .filter(
      (item) =>
        item.count > 0,
    )
    .map((item) => ({
      label:
        resolveExtractionLabel(
          item.extractionMethod,
        ),
      percentage:
        total === 0
          ? 0
          : (item.count / total) *
            100,
      color:
        resolveExtractionColor(
          item.extractionMethod,
        ),
    }));
}

function ChartsSkeleton() {
  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(360px,1fr)]">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="h-6 w-52 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />

        <div className="mt-3 h-4 w-72 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />

        <div className="mt-8 h-[320px] animate-pulse rounded-2xl bg-slate-50 dark:bg-slate-800/70" />
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="h-6 w-48 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />

        <div className="mt-3 h-4 w-72 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />

        <div className="mt-8 flex justify-center">
          <div className="size-56 animate-pulse rounded-full bg-slate-50 dark:bg-slate-800/70" />
        </div>

        <div className="mt-8 space-y-3">
          <div className="h-14 animate-pulse rounded-2xl bg-slate-50 dark:bg-slate-800/70" />
          <div className="h-14 animate-pulse rounded-2xl bg-slate-50 dark:bg-slate-800/70" />
        </div>
      </div>
    </section>
  );
}

export function DashboardCharts() {
  const shouldReduceMotion =
    useReducedMotion();

  const {
    data,
    isLoading,
    isError,
  } =
    useDashboardAnalyticsQuery();

  const processingEvolutionData =
    buildProcessingEvolutionData(
      data?.processingEvolution,
    );

  const extractionDistributionData =
    buildExtractionDistributionData(
      data?.extractionDistribution,
    );

  if (isLoading) {
    return <ChartsSkeleton />;
  }

  if (isError) {
    return (
      <section
        role="alert"
        className="rounded-3xl border border-red-200 bg-red-50 px-5 py-4 dark:border-red-900/50 dark:bg-red-950/30"
      >
        <p className="text-sm font-semibold text-red-700 dark:text-red-300">
          Impossible de charger les graphiques du tableau de bord.
        </p>
      </section>
    );
  }

  return (
    <motion.section
      initial={
        shouldReduceMotion
          ? false
          : {
              opacity: 0,
              y: 16,
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
            : 0.45,
        ease: [
          0.22,
          1,
          0.36,
          1,
        ],
      }}
      className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(360px,1fr)]"
    >
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-950 dark:text-white">
              Évolution des traitements
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Documents importés et terminés sur les 7 derniers jours
            </p>
          </div>

          <span className="inline-flex rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
            7 derniers jours
          </span>
        </div>

        <div className="mt-6 h-[340px]">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <AreaChart
              data={
                processingEvolutionData
              }
              margin={{
                top: 12,
                right: 8,
                left: -20,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient
                  id="importedGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#2563EB"
                    stopOpacity={0.28}
                  />
                  <stop
                    offset="95%"
                    stopColor="#2563EB"
                    stopOpacity={0.02}
                  />
                </linearGradient>

                <linearGradient
                  id="completedGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#06B6D4"
                    stopOpacity={0.22}
                  />
                  <stop
                    offset="95%"
                    stopColor="#06B6D4"
                    stopOpacity={0.02}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                vertical={false}
                strokeDasharray="4 4"
                stroke="rgba(148, 163, 184, 0.25)"
              />

              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#64748B",
                  fontSize: 12,
                }}
              />

              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#64748B",
                  fontSize: 12,
                }}
              />

              <Tooltip
                cursor={{
                  stroke:
                    "rgba(37,99,235,0.15)",
                  strokeWidth: 1,
                }}
                contentStyle={{
                  borderRadius: 16,
                  border:
                    "1px solid rgba(226,232,240,1)",
                  boxShadow:
                    "0 12px 30px rgba(15,23,42,0.08)",
                  backgroundColor:
                    "#FFFFFF",
                }}
                labelStyle={{
                  color: "#0F172A",
                  fontWeight: 700,
                }}
              />

              <Area
                type="monotone"
                dataKey="importedDocuments"
                name="Documents importés"
                stroke="#2563EB"
                strokeWidth={3}
                fill="url(#importedGradient)"
              />

              <Area
                type="monotone"
                dataKey="completedDocuments"
                name="Traitements terminés"
                stroke="#06B6D4"
                strokeWidth={3}
                fill="url(#completedGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-5">
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <span className="size-3 rounded-full bg-blue-600" />
            Documents importés
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <span className="size-3 rounded-full bg-cyan-500" />
            Traitements terminés
          </div>
        </div>
      </article>

      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-950 dark:text-white">
            Méthodes d’extraction
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Répartition des documents dont l’extraction est disponible
          </p>
        </div>

        {extractionDistributionData.length >
        0 ? (
          <>
            <div className="relative mt-6 flex justify-center">
              <div className="relative h-64 w-full max-w-[320px]">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <PieChart>
                    <Pie
                      data={
                        extractionDistributionData
                      }
                      dataKey="percentage"
                      nameKey="label"
                      innerRadius={78}
                      outerRadius={110}
                      paddingAngle={3}
                      stroke="none"
                    >
                      {extractionDistributionData.map(
                        (
                          item,
                        ) => (
                          <Cell
                            key={
                              item.label
                            }
                            fill={
                              item.color
                            }
                          />
                        ),
                      )}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>

                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                    Répartition
                  </p>

                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                    en %
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 divide-y divide-slate-200 border-t border-slate-200 dark:divide-slate-800 dark:border-slate-800">
              {extractionDistributionData.map(
                (
                  item,
                ) => (
                  <div
                    key={
                      item.label
                    }
                    className="flex items-center gap-3 py-4"
                  >
                    <span
                      className="size-3 shrink-0 rounded-full"
                      style={{
                        backgroundColor:
                          item.color,
                      }}
                    />

                    <span className="flex-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
                      {
                        item.label
                      }
                    </span>

                    <span className="text-sm font-bold text-slate-950 dark:text-white">
                      {formatPercentage(
                        item.percentage,
                      )}
                    </span>
                  </div>
                ),
              )}
            </div>
          </>
        ) : (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-6 text-center dark:border-slate-800 dark:bg-slate-950/40">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Aucune donnée d’extraction disponible.
            </p>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Les statistiques apparaîtront dès que des documents seront traités.
            </p>
          </div>
        )}
      </article>
    </motion.section>
  );
}