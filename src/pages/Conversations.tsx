import {
  motion,
  useReducedMotion,
} from "framer-motion";

import {
  AlertCircle,
  FileText,
  LoaderCircle,
  Mail,
  MessageSquareText,
  RefreshCw,
  UserRound,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useCurrentUser,
} from "@/features/auth/hooks/useCurrentUser";

import {
  useConversations,
} from "@/features/conversations/hooks/useConversations";

import {
  DashboardLayout,
} from "@/layouts/DashboardLayout";

import {
  ROUTES,
} from "@/routes/routePaths";

function formatDate(
  value: string,
): string {
  const date =
    new Date(
      value,
    );

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "Date inconnue";
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

function getOwnerName(
  fullName:
    | string
    | null,

  userId: number,
): string {
  const normalizedFullName =
    fullName?.trim();

  if (
    normalizedFullName
  ) {
    return normalizedFullName;
  }

  return `Utilisateur #${userId}`;
}

export default function Conversations() {
  const shouldReduceMotion =
    useReducedMotion();

  const navigate =
    useNavigate();

  const {
    isAdmin,
  } =
    useCurrentUser();

  const {
    data:
      conversations = [],

    isLoading,

    isError,

    error,

    refetch,

    isFetching,
  } =
    useConversations();

  const openConversation =
    (
      conversationId:
        number,
    ) => {
      navigate(
        ROUTES.conversationDetail.replace(
          ":conversationId",
          String(
            conversationId,
          ),
        ),
      );
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
        {/* =====================================================
            Barre d'actions compacte
        ===================================================== */}

        <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* <p className="text-sm text-slate-500 dark:text-slate-400">
            {isAdmin
              ? "Historique des conversations documentaires de la plateforme."
              : "Retrouvez vos échanges avec l’assistant documentaire."}
          </p> */}

          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex h-10 items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3.5 text-sm font-semibold text-blue-700 dark:border-blue-900/50 dark:bg-blue-500/10 dark:text-blue-400">
              <MessageSquareText
                className="size-4"
                aria-hidden="true"
              />

              <span>
                {isLoading
                  ? "Chargement..."
                  : `${conversations.length} conversation${
                      conversations.length >
                      1
                        ? "s"
                        : ""
                    }`}
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                void refetch();
              }}
              disabled={
                isFetching
              }
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-500/40 dark:hover:bg-blue-500/10 dark:hover:text-blue-400 dark:focus-visible:ring-offset-slate-950"
            >
              <RefreshCw
                className={`size-4 ${
                  isFetching
                    ? "animate-spin"
                    : ""
                }`}
                aria-hidden="true"
              />

              Actualiser
            </button>
          </div>
        </section>

        {/* =====================================================
            Chargement
        ===================================================== */}

        {isLoading ? (
          <section className="flex min-h-72 items-center justify-center rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-col items-center text-center">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-500/10">
                <LoaderCircle
                  className="size-6 animate-spin text-blue-600 dark:text-blue-400"
                  aria-hidden="true"
                />
              </div>

              <p className="mt-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                Chargement des conversations...
              </p>
            </div>
          </section>
        ) : null}

        {/* =====================================================
            Erreur
        ===================================================== */}

        {isError ? (
          <section
            role="alert"
            className="rounded-3xl border border-red-200 bg-red-50/60 p-6 dark:border-red-900/50 dark:bg-red-950/25"
          >
            <div className="flex items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-500/10">
                <AlertCircle
                  className="size-5 text-red-600 dark:text-red-400"
                  aria-hidden="true"
                />
              </div>

              <div className="min-w-0">
                <h2 className="font-bold text-slate-950 dark:text-white">
                  Impossible de charger les conversations
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {error instanceof
                  Error
                    ? error.message
                    : "Une erreur inattendue est survenue."}
                </p>

                <button
                  type="button"
                  onClick={() => {
                    void refetch();
                  }}
                  disabled={
                    isFetching
                  }
                  className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <RefreshCw
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
            </div>
          </section>
        ) : null}

        {/* =====================================================
            Empty state
        ===================================================== */}

        {!isLoading &&
        !isError &&
        conversations.length ===
          0 ? (
          <section className="flex min-h-80 items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-900">
            <div className="max-w-md">
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                <MessageSquareText
                  className="size-7"
                  aria-hidden="true"
                />
              </div>

              <h2 className="mt-5 text-xl font-bold text-slate-950 dark:text-white">
                Aucune conversation
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                {isAdmin
                  ? "Aucune conversation documentaire n’est disponible actuellement."
                  : "Vos conversations apparaîtront ici après avoir utilisé l’assistant documentaire."}
              </p>
            </div>
          </section>
        ) : null}

        {/* =====================================================
            Liste
        ===================================================== */}

        {!isLoading &&
        !isError &&
        conversations.length >
          0 ? (
          <section
            className="space-y-3"
            aria-label="Liste des conversations"
          >
            {conversations.map(
              (
                conversation,
              ) => {
                const ownerName =
                  getOwnerName(
                    conversation.userFullName,
                    conversation.userId,
                  );

                return (
                  <article
                    key={
                      conversation.conversationId
                    }
                    role="link"
                    tabIndex={
                      0
                    }
                    onClick={() => {
                      openConversation(
                        conversation.conversationId,
                      );
                    }}
                    onKeyDown={(
                      event,
                    ) => {
                      if (
                        event.key ===
                          "Enter" ||
                        event.key ===
                          " "
                      ) {
                        event.preventDefault();

                        openConversation(
                          conversation.conversationId,
                        );
                      }
                    }}
                    aria-label={`Ouvrir la conversation du document ${conversation.documentFileName}`}
                    className="group cursor-pointer rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg hover:shadow-slate-950/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-500/40 dark:hover:bg-slate-900 dark:hover:shadow-black/10 dark:focus-visible:ring-offset-slate-950"
                  >
                    <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                      <div className="flex min-w-0 items-start gap-4">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                          <FileText
                            className="size-6"
                            aria-hidden="true"
                          />
                        </div>

                        <div className="min-w-0">
                          <h2 className="truncate text-base font-bold text-slate-950 dark:text-white">
                            {
                              conversation.documentFileName
                            }
                          </h2>

                          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            Dernière activité :{" "}
                            <span className="font-medium text-slate-700 dark:text-slate-300">
                              {formatDate(
                                conversation.updatedAt,
                              )}
                            </span>
                          </p>
                        </div>
                      </div>

                      {isAdmin ? (
                        <div className="xl:ml-auto xl:w-[320px]">
                          <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/60">
                            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm dark:bg-slate-900 dark:text-blue-400">
                              <UserRound
                                className="size-5"
                                aria-hidden="true"
                              />
                            </span>

                            <div className="min-w-0">
                              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">
                                Propriétaire
                              </p>

                              <p className="mt-1 truncate text-sm font-bold text-slate-900 dark:text-slate-100">
                                {
                                  ownerName
                                }
                              </p>

                              {conversation.userEmail ? (
                                <div className="mt-1 flex min-w-0 items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                  <Mail
                                    className="size-3.5 shrink-0"
                                    aria-hidden="true"
                                  />

                                  <span className="truncate">
                                    {
                                      conversation.userEmail
                                    }
                                  </span>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      ) : null}

                      <div className="flex items-center">
                        <div className="inline-flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-500 transition-colors group-hover:bg-blue-50 group-hover:text-blue-700 dark:bg-slate-800 dark:text-slate-400 dark:group-hover:bg-blue-500/10 dark:group-hover:text-blue-400">
                          <MessageSquareText
                            className="size-4"
                            aria-hidden="true"
                          />

                          Ouvrir la conversation
                        </div>
                      </div>
                    </div>
                  </article>
                );
              },
            )}
          </section>
        ) : null}
      </motion.div>
    </DashboardLayout>
  );
}