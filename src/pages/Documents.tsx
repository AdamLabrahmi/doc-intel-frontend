import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  useSearchParams,
} from "react-router-dom";

import {
  motion,
  useReducedMotion,
} from "framer-motion";

import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Filter,
  LoaderCircle,
  Plus,
  Search,
} from "lucide-react";

import {
  DocumentsTable,
} from "@/features/documents/components/DocumentsTable";

import {
  useDocumentsQuery,
} from "@/features/documents/hooks/useDocumentsQuery";

import type {
  DocumentStatus,
} from "@/features/documents/types/document.types";

import {
  DashboardLayout,
} from "@/layouts/DashboardLayout";

import {
  ROUTES,
} from "@/routes/routePaths";

import {
  useSettingsStore,
} from "@/stores/settings.store";

type StatusFilter =
  | "ALL"
  | "ACTIVE"
  | DocumentStatus;

type PaginationItem =
  | number
  | "ellipsis-start"
  | "ellipsis-end";

const statusFilterOptions:
  readonly {
    label: string;
    value: StatusFilter;
  }[] =
[
  {
    label:
      "Tous les statuts",

    value:
      "ALL",
  },

  {
    label:
      "Terminés",

    value:
      "COMPLETED",
  },

  {
    label:
      "En attente / en cours",

    value:
      "ACTIVE",
  },

  {
    label:
      "En cours",

    value:
      "PROCESSING",
  },

  {
    label:
      "En attente",

    value:
      "PENDING",
  },

  {
    label:
      "Échecs",

    value:
      "FAILED",
  },
];

function resolveStatusFilter(
  value:
    string | null,
): StatusFilter {
  if (
    value ===
      "COMPLETED" ||
    value ===
      "PROCESSING" ||
    value ===
      "PENDING" ||
    value ===
      "FAILED" ||
    value ===
      "ACTIVE"
  ) {
    return value;
  }

  return "ALL";
}

function buildPaginationItems(
  currentPage: number,
  totalPages: number,
): PaginationItem[] {
  if (
    totalPages <=
    7
  ) {
    return Array.from(
      {
        length:
          totalPages,
      },
      (
        _,
        index,
      ) =>
        index +
        1,
    );
  }

  if (
    currentPage <=
    4
  ) {
    return [
      1,
      2,
      3,
      4,
      5,
      "ellipsis-end",
      totalPages,
    ];
  }

  if (
    currentPage >=
    totalPages -
      3
  ) {
    return [
      1,
      "ellipsis-start",
      totalPages -
        4,
      totalPages -
        3,
      totalPages -
        2,
      totalPages -
        1,
      totalPages,
    ];
  }

  return [
    1,
    "ellipsis-start",
    currentPage -
      1,
    currentPage,
    currentPage +
      1,
    "ellipsis-end",
    totalPages,
  ];
}

export default function Documents() {
  const shouldReduceMotion =
    useReducedMotion();

  const [
    searchParams,
    setSearchParams,
  ] =
    useSearchParams();

  const documentsPerPage =
    useSettingsStore(
      (
        state,
      ) =>
        state.documentsPerPage,
    );

  const [
    searchTerm,
    setSearchTerm,
  ] =
    useState(
      "",
    );

  const [
    statusFilter,
    setStatusFilter,
  ] =
    useState<StatusFilter>(
      () =>
        resolveStatusFilter(
          searchParams.get(
            "status",
          ),
        ),
    );

  const [
    currentPage,
    setCurrentPage,
  ] =
    useState(
      1,
    );

  const {
    data:
      documents = [],

    isLoading,

    isError,

    error,

    refetch,

    isFetching,
  } =
    useDocumentsQuery();

  /*
   * Synchronise le filtre avec l'URL.
   *
   * Important lorsque l'utilisateur arrive
   * depuis un KPI du Dashboard.
   */
  useEffect(
    () => {
      const filterFromUrl =
        resolveStatusFilter(
          searchParams.get(
            "status",
          ),
        );

      setStatusFilter(
        filterFromUrl,
      );

      setCurrentPage(
        1,
      );
    },
    [
      searchParams,
    ],
  );

  const filteredDocuments =
    useMemo(
      () => {
        const normalizedSearchTerm =
          searchTerm
            .trim()
            .toLowerCase();

        return documents.filter(
          (
            document,
          ) => {
            const matchesSearch =
              normalizedSearchTerm.length ===
                0 ||
              document.fileName
                .toLowerCase()
                .includes(
                  normalizedSearchTerm,
                );

            const matchesStatus =
              statusFilter ===
              "ALL"
                ? true
                : statusFilter ===
                    "ACTIVE"
                  ? document.status ===
                      "PENDING" ||
                    document.status ===
                      "PROCESSING"
                  : document.status ===
                    statusFilter;

            return (
              matchesSearch &&
              matchesStatus
            );
          },
        );
      },
      [
        documents,
        searchTerm,
        statusFilter,
      ],
    );

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredDocuments.length /
          documentsPerPage,
      ),
    );

  const safeCurrentPage =
    Math.min(
      currentPage,
      totalPages,
    );

  const startIndex =
    (
      safeCurrentPage -
      1
    ) *
    documentsPerPage;

  const paginatedDocuments =
    filteredDocuments.slice(
      startIndex,
      startIndex +
        documentsPerPage,
    );

  const paginationItems =
    buildPaginationItems(
      safeCurrentPage,
      totalPages,
    );

  const displayedStart =
    filteredDocuments.length ===
    0
      ? 0
      : startIndex +
        1;

  const displayedEnd =
    Math.min(
      startIndex +
        documentsPerPage,
      filteredDocuments.length,
    );

  const completedCount =
    documents.filter(
      (
        document,
      ) =>
        document.status ===
        "COMPLETED",
    ).length;

  const failedCount =
    documents.filter(
      (
        document,
      ) =>
        document.status ===
        "FAILED",
    ).length;

  const handleSearchChange =
    (
      value: string,
    ) => {
      setSearchTerm(
        value,
      );

      setCurrentPage(
        1,
      );
    };

  const handleStatusChange =
    (
      value:
        StatusFilter,
    ) => {
      setStatusFilter(
        value,
      );

      setCurrentPage(
        1,
      );

      const nextSearchParams =
        new URLSearchParams(
          searchParams,
        );

      if (
        value ===
        "ALL"
      ) {
        nextSearchParams.delete(
          "status",
        );
      } else {
        nextSearchParams.set(
          "status",
          value,
        );
      }

      setSearchParams(
        nextSearchParams,
        {
          replace:
            true,
        },
      );
    };

  const handlePageChange =
    (
      page: number,
    ) => {
      if (
        page <
          1 ||
        page >
          totalPages ||
        page ===
          safeCurrentPage
      ) {
        return;
      }

      setCurrentPage(
        page,
      );

      window.scrollTo({
        top:
          0,

        behavior:
          shouldReduceMotion
            ? "auto"
            : "smooth",
      });
    };

  return (
    <DashboardLayout>
      <motion.div
        initial={
          shouldReduceMotion
            ? false
            : {
                opacity:
                  0,

                y:
                  20,
              }
        }
        animate={{
          opacity:
            1,

          y:
            0,
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
        className="mx-auto w-full max-w-[1600px] space-y-6"
      >
        <Link
          to={
            ROUTES.documentUpload
          }
          aria-label="Importer des documents"
          className="fixed bottom-6 right-6 z-40 flex size-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/25 transition-all duration-300 hover:scale-105 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
        >
          <Plus
            className="size-6"
            aria-hidden="true"
          />
        </Link>

        <section className="grid gap-4 sm:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              Total des documents
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">
              {isLoading
                ? "—"
                : documents.length}
            </p>
          </article>

          <article className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5 dark:border-emerald-900/40 dark:bg-emerald-500/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                  Traitements terminés
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">
                  {isLoading
                    ? "—"
                    : completedCount}
                </p>
              </div>

              <CheckCircle2
                className="size-6 text-emerald-600 dark:text-emerald-400"
                aria-hidden="true"
              />
            </div>
          </article>

          <article className="rounded-2xl border border-red-100 bg-red-50/50 p-5 dark:border-red-900/40 dark:bg-red-500/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-red-700 dark:text-red-400">
                  Traitements échoués
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">
                  {isLoading
                    ? "—"
                    : failedCount}
                </p>
              </div>

              <CircleAlert
                className="size-6 text-red-600 dark:text-red-400"
                aria-hidden="true"
              />
            </div>
          </article>
        </section>

        <section className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
              aria-hidden="true"
            />

            <input
              type="search"
              value={
                searchTerm
              }
              onChange={(
                event,
              ) => {
                handleSearchChange(
                  event.target.value,
                );
              }}
              placeholder="Rechercher par nom de document..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-950 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:bg-slate-800"
              aria-label="Rechercher un document"
            />
          </div>

          <div className="relative min-w-56">
            <Filter
              className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
              aria-hidden="true"
            />

            <select
              value={
                statusFilter
              }
              onChange={(
                event,
              ) => {
                handleStatusChange(
                  event.target.value as StatusFilter,
                );
              }}
              className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-11 pr-10 text-sm font-medium text-slate-700 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              aria-label="Filtrer les documents par statut"
            >
              {statusFilterOptions.map(
                (
                  option,
                ) => (
                  <option
                    key={
                      option.value
                    }
                    value={
                      option.value
                    }
                  >
                    {
                      option.label
                    }
                  </option>
                ),
              )}
            </select>
          </div>

          <div className="flex min-w-fit items-center gap-2">
            {isFetching &&
            !isLoading ? (
              <LoaderCircle
                className="size-4 animate-spin text-blue-600 dark:text-blue-400"
                aria-label="Actualisation des documents"
              />
            ) : null}

            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {isLoading ? (
                "Chargement..."
              ) : (
                <>
                  {
                    filteredDocuments.length
                  }{" "}
                  résultat
                  {filteredDocuments.length >
                  1
                    ? "s"
                    : ""}
                </>
              )}
            </p>
          </div>
        </section>

        {isLoading ? (
          <section
            className="flex min-h-64 items-center justify-center rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
            aria-live="polite"
          >
            <div className="text-center">
              <LoaderCircle
                className="mx-auto size-8 animate-spin text-blue-600 dark:text-blue-400"
                aria-hidden="true"
              />

              <p className="mt-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                Chargement des documents...
              </p>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Récupération des données depuis le serveur.
              </p>
            </div>
          </section>
        ) : null}

        {isError &&
        !isLoading ? (
          <section
            className="rounded-3xl border border-red-200 bg-white p-6 shadow-sm dark:border-red-900/50 dark:bg-slate-900"
            role="alert"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
                  <AlertCircle
                    className="size-5"
                    aria-hidden="true"
                  />
                </span>

                <div>
                  <h2 className="font-bold text-slate-950 dark:text-white">
                    Impossible de charger les documents
                  </h2>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {error instanceof
                    Error
                      ? error.message
                      : "Une erreur est survenue lors de la communication avec le serveur."}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  void refetch();
                }}
                disabled={
                  isFetching
                }
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <LoaderCircle
                  className={`size-4 ${
                    isFetching
                      ? "animate-spin"
                      : ""
                  }`}
                  aria-hidden="true"
                />

                Réessayer
              </button>
            </div>
          </section>
        ) : null}

        {!isLoading &&
        !isError ? (
          <div className="space-y-4">
            <DocumentsTable
              documents={
                paginatedDocuments
              }
            />

            {filteredDocuments.length >
            0 ? (
              <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:flex-row lg:items-center lg:justify-between">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Affichage de{" "}
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {
                      displayedStart
                    }
                  </span>{" "}
                  à{" "}
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {
                      displayedEnd
                    }
                  </span>{" "}
                  sur{" "}
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {
                      filteredDocuments.length
                    }
                  </span>{" "}
                  document
                  {filteredDocuments.length >
                  1
                    ? "s"
                    : ""}
                </p>

                <nav
                  className="flex flex-wrap items-center gap-2"
                  aria-label="Pagination des documents"
                >
                  <button
                    type="button"
                    onClick={() =>
                      handlePageChange(
                        safeCurrentPage -
                          1,
                      )
                    }
                    disabled={
                      safeCurrentPage ===
                      1
                    }
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-500/40 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
                  >
                    <ChevronLeft
                      className="size-4"
                      aria-hidden="true"
                    />

                    <span className="hidden sm:inline">
                      Précédent
                    </span>
                  </button>

                  <div className="flex items-center gap-1">
                    {paginationItems.map(
                      (
                        item,
                      ) => {
                        if (
                          item ===
                            "ellipsis-start" ||
                          item ===
                            "ellipsis-end"
                        ) {
                          return (
                            <span
                              key={
                                item
                              }
                              className="flex size-10 items-center justify-center text-sm font-semibold text-slate-400 dark:text-slate-500"
                              aria-hidden="true"
                            >
                              …
                            </span>
                          );
                        }

                        const isActive =
                          item ===
                          safeCurrentPage;

                        return (
                          <button
                            key={
                              item
                            }
                            type="button"
                            onClick={() =>
                              handlePageChange(
                                item,
                              )
                            }
                            aria-current={
                              isActive
                                ? "page"
                                : undefined
                            }
                            aria-label={`Page ${item}`}
                            className={
                              isActive
                                ? "flex size-10 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white shadow-sm shadow-blue-600/20"
                                : "flex size-10 items-center justify-center rounded-xl border border-transparent text-sm font-semibold text-slate-600 transition-all hover:border-slate-200 hover:bg-slate-50 hover:text-slate-950 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
                            }
                          >
                            {
                              item
                            }
                          </button>
                        );
                      },
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handlePageChange(
                        safeCurrentPage +
                          1,
                      )
                    }
                    disabled={
                      safeCurrentPage ===
                      totalPages
                    }
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-500/40 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
                  >
                    <span className="hidden sm:inline">
                      Suivant
                    </span>

                    <ChevronRight
                      className="size-4"
                      aria-hidden="true"
                    />
                  </button>
                </nav>
              </section>
            ) : null}
          </div>
        ) : null}
      </motion.div>
    </DashboardLayout>
  );
}