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
  ShieldCheck,
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
    new Date(value);

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
      dateStyle: "medium",
      timeStyle: "short",
    },
  ).format(date);
}

function getOwnerName(
  fullName: string | null,
  userId: number,
): string {
  const normalizedFullName =
    fullName?.trim();

  if (normalizedFullName) {
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
    user,
    isAdmin,
    isLoading:
      isCurrentUserLoading,
  } = useCurrentUser();

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

  const openConversation = (
  conversationId: number,
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
        {/* =====================================================
            EN-TÊTE
        ===================================================== */}

        <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-600">
              <MessageSquareText
                className="size-4"
                aria-hidden="true"
              />

              Chat documentaire
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-950">
              {isAdmin
                ? "Toutes les conversations"
                : "Vos conversations"}
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              {isAdmin
                ? "Consultez l’ensemble des conversations documentaires ainsi que les utilisateurs auxquels elles appartiennent."
                : "Retrouvez vos conversations documentaires et reprenez vos échanges avec l’assistant IA."}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              void refetch();
            }}
            disabled={
              isFetching
            }
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
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
        </section>

        {/* =====================================================
            CONTEXTE USER / ADMIN
        ===================================================== */}

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
                <p className="font-bold text-slate-950">
                  {isAdmin
                    ? "Vue administrateur"
                    : "Espace personnel"}
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  {isAdmin
                    ? "Vous pouvez consulter les conversations de l’ensemble des utilisateurs ainsi que leur propriétaire."
                    : "Les conversations affichées sont uniquement celles associées à votre compte."}
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
                : "Mes conversations"}
            </span>
          </section>
        ) : null}

        {/* =====================================================
            STATISTIQUE
        ===================================================== */}

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">
              {isAdmin
                ? "Conversations disponibles"
                : "Mes conversations"}
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-950">
              {isLoading
                ? "—"
                : conversations.length}
            </p>

            <p className="mt-2 text-xs text-slate-400">
              {isAdmin
                ? "Toutes les conversations accessibles à l’administrateur"
                : "Associées à votre compte"}
            </p>
          </article>
        </section>

        {/* =====================================================
            CHARGEMENT
        ===================================================== */}

        {isLoading ? (
          <section className="flex min-h-72 items-center justify-center rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-50">
                <LoaderCircle
                  className="size-6 animate-spin text-blue-600"
                  aria-hidden="true"
                />
              </div>

              <p className="mt-4 text-sm font-semibold text-slate-700">
                Chargement des conversations...
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Récupération de l’historique documentaire.
              </p>
            </div>
          </section>
        ) : null}

        {/* =====================================================
            ERREUR
        ===================================================== */}

        {isError ? (
          <section
            role="alert"
            className="rounded-3xl border border-red-200 bg-red-50/60 p-6"
          >
            <div className="flex items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-red-100">
                <AlertCircle
                  className="size-5 text-red-600"
                  aria-hidden="true"
                />
              </div>

              <div className="min-w-0">
                <h2 className="font-bold text-slate-950">
                  Impossible de charger les conversations
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {error instanceof Error
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
            VIDE
        ===================================================== */}

        {!isLoading &&
        !isError &&
        conversations.length ===
          0 ? (
          <section className="flex min-h-80 items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <div className="max-w-md">
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-blue-50">
                <MessageSquareText
                  className="size-7 text-blue-600"
                  aria-hidden="true"
                />
              </div>

              <h2 className="mt-5 text-xl font-bold text-slate-950">
                Aucune conversation
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {isAdmin
                  ? "Aucune conversation documentaire n’est disponible actuellement."
                  : "Vos conversations apparaîtront ici après avoir posé une question à l’assistant sur un document."}
              </p>
            </div>
          </section>
        ) : null}

        {/* =====================================================
            LISTE
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
                    tabIndex={0}
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
                    className="group cursor-pointer rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg hover:shadow-slate-950/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  >
                    <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

                      {/* Document */}
                      <div className="flex min-w-0 items-start gap-4">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                          <FileText
                            className="size-6"
                            aria-hidden="true"
                          />
                        </div>

                        <div className="min-w-0">
                          <h2 className="truncate text-base font-bold text-slate-950">
                            {
                              conversation.documentFileName
                            }
                          </h2>

                          <p className="mt-2 text-sm text-slate-500">
                            Dernière activité :{" "}

                            <span className="font-medium text-slate-700">
                              {formatDate(
                                conversation.updatedAt,
                              )}
                            </span>
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            Créée le{" "}
                            {formatDate(
                              conversation.createdAt,
                            )}
                          </p>
                        </div>
                      </div>

                      {/* =========================================
                          PROPRIÉTAIRE — ADMIN UNIQUEMENT
                      ========================================= */}

                      {isAdmin ? (
                        <div className="xl:ml-auto xl:w-[320px]">
                          <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3">
                            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                              <UserRound
                                className="size-5"
                                aria-hidden="true"
                              />
                            </span>

                            <div className="min-w-0">
                              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                                Propriétaire
                              </p>

                              <p className="mt-1 truncate text-sm font-bold text-slate-900">
                                {
                                  ownerName
                                }
                              </p>

                              {conversation.userEmail ? (
                                <div className="mt-1 flex min-w-0 items-center gap-1.5 text-xs text-slate-500">
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
                              ) : (
                                <p className="mt-1 text-xs text-slate-400">
                                  E-mail indisponible
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : null}

                      {/* Action */}
                      <div className="flex items-center gap-2">
                        <div className="inline-flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-500 transition-colors group-hover:bg-blue-50 group-hover:text-blue-700">
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