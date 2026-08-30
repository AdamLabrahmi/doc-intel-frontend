import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
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
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { DocumentsTable } from "@/features/documents/components/DocumentsTable";
import { useDocumentsQuery } from "@/features/documents/hooks/useDocumentsQuery";
import type { DocumentStatus } from "@/features/documents/types/document.types";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { ROUTES } from "@/routes/routePaths";

type StatusFilter =
  | "ALL"
  | DocumentStatus;

type PaginationItem =
  | number
  | "ellipsis-start"
  | "ellipsis-end";

const PAGE_SIZE = 10;

const statusFilterOptions: readonly {
  label: string;
  value: StatusFilter;
}[] = [
  {
    label: "Tous les statuts",
    value: "ALL",
  },
  {
    label: "Terminés",
    value: "COMPLETED",
  },
  {
    label: "En cours",
    value: "PROCESSING",
  },
  {
    label: "En attente",
    value: "PENDING",
  },
  {
    label: "Échecs",
    value: "FAILED",
  },
] as const;

function buildPaginationItems(
  currentPage: number,
  totalPages: number,
): PaginationItem[] {
  if (totalPages <= 7) {
    return Array.from(
      {
        length: totalPages,
      },
      (_, index) =>
        index + 1,
    );
  }

  if (currentPage <= 4) {
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
    totalPages - 3
  ) {
    return [
      1,
      "ellipsis-start",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "ellipsis-start",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis-end",
    totalPages,
  ];
}

export default function Documents() {
  const shouldReduceMotion =
    useReducedMotion();

  const {
    user,
    isAdmin,
    isLoading:
      isCurrentUserLoading,
  } = useCurrentUser();

  const [searchTerm, setSearchTerm] =
    useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] =
    useState<StatusFilter>(
      "ALL",
    );

  const [
    currentPage,
    setCurrentPage,
  ] =
    useState(1);

  const {
    data: documents = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useDocumentsQuery();

  const filteredDocuments =
    useMemo(() => {
      const normalizedSearchTerm =
        searchTerm
          .trim()
          .toLowerCase();

      return documents.filter(
        (
          document,
        ) => {
          const matchesSearch =
            normalizedSearchTerm
              .length === 0 ||
            document.fileName
              .toLowerCase()
              .includes(
                normalizedSearchTerm,
              );

          const matchesStatus =
            statusFilter === "ALL" ||
            document.status ===
              statusFilter;

          return (
            matchesSearch &&
            matchesStatus
          );
        },
      );
    }, [
      documents,
      searchTerm,
      statusFilter,
    ]);

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredDocuments.length /
          PAGE_SIZE,
      ),
    );

  const safeCurrentPage =
    Math.min(
      currentPage,
      totalPages,
    );

  const startIndex =
    (safeCurrentPage - 1) *
    PAGE_SIZE;

  const paginatedDocuments =
    filteredDocuments.slice(
      startIndex,
      startIndex + PAGE_SIZE,
    );

  const paginationItems =
    buildPaginationItems(
      safeCurrentPage,
      totalPages,
    );

  const displayedStart =
    filteredDocuments.length === 0
      ? 0
      : startIndex + 1;

  const displayedEnd =
    Math.min(
      startIndex + PAGE_SIZE,
      filteredDocuments.length,
    );

  const completedCount =
    documents.filter(
      (document) =>
        document.status ===
        "COMPLETED",
    ).length;

  const failedCount =
    documents.filter(
      (document) =>
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
      value: StatusFilter,
    ) => {
      setStatusFilter(
        value,
      );

      setCurrentPage(
        1,
      );
    };

  const handlePageChange =
    (
      page: number,
    ) => {
      if (
        page < 1 ||
        page > totalPages ||
        page === safeCurrentPage
      ) {
        return;
      }

      setCurrentPage(
        page,
      );

      window.scrollTo({
        top: 0,
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
        className="mx-auto w-full max-w-[1600px] space-y-6"
      >
        <Link
          to={
            ROUTES.documentUpload
          }
          aria-label="Importer des documents"
          className="fixed bottom-6 right-6 z-40 flex size-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/25 transition-all duration-300 hover:scale-105 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          <Plus
            className="size-6"
            aria-hidden="true"
          />
        </Link>

        {!isCurrentUserLoading &&
        user ? (
          <section className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <span
                className={
                  isAdmin
                    ? "flex size-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700"
                    : "flex size-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-600"
                }
              >
                {isAdmin ? (
                  <ShieldCheck
                    className="size-5"
                    aria-hidden="true"
                  />
                ) : (
                  <UserRound
                    className="size-5"
                    aria-hidden="true"
                  />
                )}
              </span>

              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-950">
                  Documents
                </h1>

                <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
                  {isAdmin
                    ? "Vous consultez l’ensemble des documents enregistrés sur la plateforme."
                    : "Vous consultez uniquement les documents associés à votre compte."}
                </p>
              </div>
            </div>

            <span
              className={
                isAdmin
                  ? "w-fit rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700"
                  : "w-fit rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600"
              }
            >
              {isAdmin
                ? "Vue globale"
                : "Espace personnel"}
            </span>
          </section>
        ) : null}

        <section className="grid gap-4 sm:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">
              Total des documents
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-950">
              {isLoading
                ? "—"
                : documents.length}
            </p>
          </article>

          <article className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-emerald-700">
                  Traitements terminés
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-950">
                  {isLoading
                    ? "—"
                    : completedCount}
                </p>
              </div>

              <CheckCircle2
                className="size-6 text-emerald-600"
                aria-hidden="true"
              />
            </div>
          </article>

          <article className="rounded-2xl border border-red-100 bg-red-50/50 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-red-700">
                  Traitements échoués
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-950">
                  {isLoading
                    ? "—"
                    : failedCount}
                </p>
              </div>

              <CircleAlert
                className="size-6 text-red-600"
                aria-hidden="true"
              />
            </div>
          </article>
        </section>

        <section className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) => {
                handleSearchChange(
                  event.target.value,
                );
              }}
              placeholder="Rechercher par nom de document..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-950 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              aria-label="Rechercher un document"
            />
          </div>

          <div className="relative min-w-56">
            <Filter
              className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />

            <select
              value={
                statusFilter
              }
              onChange={(event) => {
                handleStatusChange(
                  event.target
                    .value as StatusFilter,
                );
              }}
              className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-11 pr-10 text-sm font-medium text-slate-700 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              aria-label="Filtrer les documents par statut"
            >
              {statusFilterOptions.map(
                (option) => (
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
              !isLoading && (
                <LoaderCircle
                  className="size-4 animate-spin text-blue-600"
                  aria-label="Actualisation des documents"
                />
              )}

            <p className="text-sm font-medium text-slate-500">
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

        {isLoading && (
          <section
            className="flex min-h-64 items-center justify-center rounded-3xl border border-slate-200 bg-white shadow-sm"
            aria-live="polite"
          >
            <div className="text-center">
              <LoaderCircle
                className="mx-auto size-8 animate-spin text-blue-600"
                aria-hidden="true"
              />

              <p className="mt-4 text-sm font-semibold text-slate-700">
                Chargement des documents...
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Récupération des données depuis le serveur.
              </p>
            </div>
          </section>
        )}

        {isError &&
          !isLoading && (
            <section
              className="rounded-3xl border border-red-200 bg-white p-6 shadow-sm"
              role="alert"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                    <AlertCircle
                      className="size-5"
                      aria-hidden="true"
                    />
                  </span>

                  <div>
                    <h2 className="font-bold text-slate-950">
                      Impossible de charger les documents
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
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
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
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
          )}

        {!isLoading &&
          !isError && (
            <div className="space-y-4">
              <DocumentsTable
                documents={
                  paginatedDocuments
                }
              />

              {filteredDocuments.length >
                0 && (
                <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
                  <p className="text-sm text-slate-500">
                    Affichage de{" "}
                    <span className="font-semibold text-slate-800">
                      {
                        displayedStart
                      }
                    </span>{" "}
                    à{" "}
                    <span className="font-semibold text-slate-800">
                      {
                        displayedEnd
                      }
                    </span>{" "}
                    sur{" "}
                    <span className="font-semibold text-slate-800">
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
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
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
                        (item) => {
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
                                className="flex size-10 items-center justify-center text-sm font-semibold text-slate-400"
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
                                  ? "flex size-10 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white shadow-sm shadow-blue-600/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                  : "flex size-10 items-center justify-center rounded-xl border border-transparent text-sm font-semibold text-slate-600 transition-all hover:border-slate-200 hover:bg-slate-50 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
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
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
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
              )}
            </div>
          )}
      </motion.div>
    </DashboardLayout>
  );
}