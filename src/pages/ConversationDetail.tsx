import {
  type FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  motion,
  useReducedMotion,
} from "framer-motion";

import {
  AlertCircle,
  ArrowLeft,
  BookOpenText,
  Bot,
  LoaderCircle,
  MessageSquareText,
  RefreshCw,
  Send,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  Link,
  Navigate,
  useParams,
} from "react-router-dom";

import {
  useCurrentUser,
} from "@/features/auth/hooks/useCurrentUser";

import {
  useAskDocumentQuestion,
} from "@/features/conversations/hooks/useAskDocumentQuestion";

import {
  useConversationById,
} from "@/features/conversations/hooks/useConversations";

import {
  useRequestDocumentSummary,
} from "@/features/conversations/hooks/useRequestDocumentSummary";

import {
  parseConversationSources,
} from "@/features/conversations/utils/conversation-sources";

import {
  DashboardLayout,
} from "@/layouts/DashboardLayout";

import {
  ROUTES,
} from "@/routes/routePaths";

import {
  useSettingsStore,
} from "@/stores/settings.store";

const MAX_QUESTION_LENGTH =
  2_000;

const SUMMARY_POLLING_INTERVAL_MS =
  3_000;

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

function normalizeSummaryCommand(
  value: string,
): string {
  return value
    .trim()
    .toLocaleLowerCase(
      "fr-FR",
    )
    .normalize(
      "NFD",
    )
    .replace(
      /[\u0300-\u036f]/g,
      "",
    )
    .replace(
      /\s+/g,
      " ",
    );
}

function isExplicitSummaryRequest(
  value: string,
): boolean {
  const normalized =
    normalizeSummaryCommand(
      value,
    );

  return [
    "resume",
    "resumer",
    "resume le document",
    "resumer le document",
    "resume ce document",
    "resumer ce document",
    "fais un resume",
    "fais un resume du document",
    "faire un resume du document",
  ].includes(
    normalized,
  );
}

function AssistantMarkdown({
  content,
}: {
  content: string;
}) {
  return (
    <div className="break-words text-sm leading-6 text-slate-800 dark:text-slate-200">
      <ReactMarkdown
        remarkPlugins={[
          remarkGfm,
        ]}
        components={{
          h1: ({
            children,
          }) => (
            <h1 className="mb-3 mt-5 text-lg font-bold text-slate-950 first:mt-0 dark:text-white">
              {children}
            </h1>
          ),

          h2: ({
            children,
          }) => (
            <h2 className="mb-2.5 mt-5 text-base font-bold text-slate-950 first:mt-0 dark:text-white">
              {children}
            </h2>
          ),

          h3: ({
            children,
          }) => (
            <h3 className="mb-2 mt-4 text-sm font-bold text-slate-900 first:mt-0 dark:text-slate-100">
              {children}
            </h3>
          ),

          p: ({
            children,
          }) => (
            <p className="mb-3 whitespace-pre-wrap leading-6 last:mb-0">
              {children}
            </p>
          ),

          strong: ({
            children,
          }) => (
            <strong className="font-bold text-slate-950 dark:text-white">
              {children}
            </strong>
          ),

          em: ({
            children,
          }) => (
            <em className="italic text-slate-700 dark:text-slate-300">
              {children}
            </em>
          ),

          ul: ({
            children,
          }) => (
            <ul className="mb-3 ml-5 list-disc space-y-1.5 last:mb-0">
              {children}
            </ul>
          ),

          ol: ({
            children,
          }) => (
            <ol className="mb-3 ml-5 list-decimal space-y-1.5 last:mb-0">
              {children}
            </ol>
          ),

          li: ({
            children,
          }) => (
            <li className="pl-1 leading-6">
              {children}
            </li>
          ),

          blockquote: ({
            children,
          }) => (
            <blockquote className="my-3 rounded-r-xl border-l-4 border-blue-200 bg-blue-50/60 px-4 py-2 text-slate-700 dark:border-blue-500/50 dark:bg-blue-500/10 dark:text-slate-300">
              {children}
            </blockquote>
          ),

          code: ({
            children,
          }) => (
            <code className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[0.9em] text-slate-800 dark:bg-slate-800 dark:text-slate-200">
              {children}
            </code>
          ),

          hr: () => (
            <hr className="my-4 border-slate-200 dark:border-slate-700" />
          ),

          a: ({
            children,
            href,
          }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              className="font-medium text-blue-600 underline decoration-blue-200 underline-offset-2 hover:text-blue-700 dark:text-blue-400 dark:decoration-blue-500/40 dark:hover:text-blue-300"
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default function ConversationDetail() {
  const shouldReduceMotion =
    useReducedMotion();

  const conversationAutoScroll =
    useSettingsStore(
      (
        state,
      ) =>
        state.conversationAutoScroll,
    );

  const showConversationSources =
    useSettingsStore(
      (
        state,
      ) =>
        state.showConversationSources,
    );

  const [
    question,
    setQuestion,
  ] =
    useState(
      "",
    );

  const [
    isSummaryRunning,
    setIsSummaryRunning,
  ] =
    useState(
      false,
    );

  const [
    summaryStartMessageCount,
    setSummaryStartMessageCount,
  ] =
    useState<
      number | null
    >(
      null,
    );

  const messagesContainerRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  const {
    user,
    isAdmin,
  } =
    useCurrentUser();

  const {
    conversationId,
  } =
    useParams<{
      conversationId: string;
    }>();

  const parsedConversationId =
    conversationId !==
    undefined
      ? Number(
          conversationId,
        )
      : Number.NaN;

  const isValidConversationId =
    Number.isInteger(
      parsedConversationId,
    ) &&
    parsedConversationId >
      0;

  const queryConversationId =
    isValidConversationId
      ? parsedConversationId
      : 0;

  const {
    data:
      conversation,

    isLoading,

    isError,

    error,

    refetch,

    isFetching,
  } =
    useConversationById(
      queryConversationId,
    );

  const conversationDocumentId =
    conversation?.documentId ??
    0;

  const isConversationOwner =
    user !==
      null &&
    conversation !==
      undefined &&
    conversation.userId ===
      user.id;

  const canAskQuestions =
    !isAdmin &&
    isConversationOwner;

  const askQuestionMutation =
    useAskDocumentQuestion(
      conversationDocumentId,
      queryConversationId,
    );

  const summaryMutation =
    useRequestDocumentSummary();

  const isSending =
    askQuestionMutation.isPending ||
    summaryMutation.isPending;

  const isBusy =
    isSending ||
    isSummaryRunning;

  /*
   * Scroll automatique configurable depuis Settings.
   */
  useEffect(
    () => {
      if (
        !conversationAutoScroll
      ) {
        return;
      }

      const container =
        messagesContainerRef.current;

      if (
        !container
      ) {
        return;
      }

      container.scrollTo({
        top:
          container.scrollHeight,

        behavior:
          shouldReduceMotion
            ? "auto"
            : "smooth",
      });
    },
    [
      conversation?.messages.length,
      isBusy,
      shouldReduceMotion,
      conversationAutoScroll,
    ],
  );

  /*
   * Polling du résumé asynchrone.
   */
  useEffect(
    () => {
      if (
        !isSummaryRunning ||
        summaryStartMessageCount ===
          null
      ) {
        return;
      }

      const intervalId =
        window.setInterval(
          () => {
            void refetch();
          },
          SUMMARY_POLLING_INTERVAL_MS,
        );

      return () => {
        window.clearInterval(
          intervalId,
        );
      };
    },
    [
      isSummaryRunning,
      summaryStartMessageCount,
      refetch,
    ],
  );

  /*
   * Détection de la fin du résumé.
   */
  useEffect(
    () => {
      if (
        !isSummaryRunning ||
        !conversation ||
        summaryStartMessageCount ===
          null
      ) {
        return;
      }

      const newMessages =
        conversation.messages.slice(
          summaryStartMessageCount,
        );

      const hasNewAssistantMessage =
        newMessages.some(
          (
            message,
          ) =>
            message.role ===
            "ASSISTANT",
        );

      if (
        !hasNewAssistantMessage
      ) {
        return;
      }

      setIsSummaryRunning(
        false,
      );

      setSummaryStartMessageCount(
        null,
      );
    },
    [
      conversation,
      isSummaryRunning,
      summaryStartMessageCount,
    ],
  );

  const normalizedQuestion =
    question.trim();

  const isQuestionValid =
    normalizedQuestion.length >
      0 &&
    normalizedQuestion.length <=
      MAX_QUESTION_LENGTH;

  const handleSubmit =
    async (
      event:
        FormEvent<HTMLFormElement>,
    ) => {
      event.preventDefault();

      if (
        !canAskQuestions ||
        !isQuestionValid ||
        conversationDocumentId <=
          0 ||
        isBusy
      ) {
        return;
      }

      const summaryRequest =
        isExplicitSummaryRequest(
          normalizedQuestion,
        );

      try {
        if (
          summaryRequest
        ) {
          const messageCountBeforeRequest =
            conversation
              ?.messages.length ??
            0;

          const response =
            await summaryMutation.mutateAsync(
              {
                documentId:
                  conversationDocumentId,

                request: {
                  request:
                    normalizedQuestion,
                },
              },
            );

          setQuestion(
            "",
          );

          if (
            response.status ===
              "QUEUED" ||
            response.status ===
              "ALREADY_RUNNING"
          ) {
            setSummaryStartMessageCount(
              messageCountBeforeRequest,
            );

            setIsSummaryRunning(
              true,
            );
          }

          await refetch();

          return;
        }

        await askQuestionMutation.mutateAsync(
          {
            question:
              normalizedQuestion,
          },
        );

        setQuestion(
          "",
        );
      } catch {
        // Les erreurs sont exposées par TanStack Query.
      }
    };

  if (
    !isValidConversationId
  ) {
    return (
      <Navigate
        to={
          ROUTES.conversations
        }
        replace
      />
    );
  }

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
                  16,
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
              : 0.5,

          ease: [
            0.22,
            1,
            0.36,
            1,
          ],
        }}
        className="mx-auto flex h-[calc(100vh-7rem)] w-full max-w-[1600px] flex-col gap-4 overflow-hidden"
      >
        <header className="shrink-0">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <Link
                to={
                  ROUTES.conversations
                }
                aria-label="Retour aux conversations"
                className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-500/40 dark:hover:bg-blue-500/10 dark:hover:text-blue-400 dark:focus-visible:ring-offset-slate-950"
              >
                <ArrowLeft
                  className="size-5"
                  aria-hidden="true"
                />
              </Link>

              <div className="min-w-0">
                <h1
                  className="max-w-4xl truncate text-2xl font-bold tracking-tight text-slate-950 dark:text-white"
                  title={
                    conversation
                      ?.documentFileName
                  }
                >
                  {conversation
                    ?.documentFileName ??
                    "Conversation documentaire"}
                </h1>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 lg:shrink-0">
              {!isLoading &&
              !isError &&
              conversation ? (
                <div className="inline-flex h-10 items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3.5 text-sm font-semibold text-blue-700 dark:border-blue-900/50 dark:bg-blue-500/10 dark:text-blue-400">
                  <MessageSquareText
                    className="size-4"
                    aria-hidden="true"
                  />

                  {
                    conversation.messages.length
                  }{" "}
                  message
                  {conversation.messages.length >
                  1
                    ? "s"
                    : ""}
                </div>
              ) : null}

              <button
                type="button"
                onClick={() => {
                  void refetch();
                }}
                disabled={
                  isFetching ||
                  isBusy
                }
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-600 shadow-sm transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-500/40 dark:hover:bg-blue-500/10 dark:hover:text-blue-400 dark:focus-visible:ring-offset-slate-950"
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
          </div>
        </header>

        {isLoading ? (
          <section className="flex min-h-0 flex-1 items-center justify-center rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-col items-center text-center">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-500/10">
                <LoaderCircle
                  className="size-6 animate-spin text-blue-600 dark:text-blue-400"
                  aria-hidden="true"
                />
              </div>

              <p className="mt-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                Chargement de la conversation...
              </p>
            </div>
          </section>
        ) : null}

        {isError ? (
          <section
            role="alert"
            className="shrink-0 rounded-3xl border border-red-200 bg-red-50/60 p-6 dark:border-red-900/50 dark:bg-red-950/25"
          >
            <div className="flex items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-500/10">
                <AlertCircle
                  className="size-5 text-red-600 dark:text-red-400"
                  aria-hidden="true"
                />
              </div>

              <div>
                <h2 className="font-bold text-slate-950 dark:text-white">
                  Impossible de charger la conversation
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

        {!isLoading &&
        !isError &&
        conversation ? (
          <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-100 bg-white px-5 py-3.5 dark:border-slate-800 dark:bg-slate-900 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                  <MessageSquareText
                    className="size-4"
                    aria-hidden="true"
                  />
                </div>

                <div>
                  <h2 className="text-sm font-bold text-slate-950 dark:text-white">
                    Historique
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                    Conversation documentaire
                  </p>
                </div>
              </div>

              {isAdmin ? (
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:border-blue-900/50 dark:bg-blue-500/10 dark:text-blue-400">
                  <ShieldCheck
                    className="size-3.5"
                    aria-hidden="true"
                  />

                  Lecture seule
                </div>
              ) : null}
            </div>

            {conversation.messages.length ===
            0 ? (
              <div className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto p-8 text-center">
                <div className="max-w-sm">
                  <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                    <MessageSquareText
                      className="size-7"
                      aria-hidden="true"
                    />
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-slate-950 dark:text-white">
                    Aucun message
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Cette conversation ne contient encore aucun message.
                  </p>
                </div>
              </div>
            ) : (
              <div
                ref={
                  messagesContainerRef
                }
                className="min-h-0 flex-1 space-y-5 overflow-y-auto bg-slate-50/40 px-4 py-6 dark:bg-slate-950/40 sm:px-6 lg:px-8"
              >
                {conversation.messages.map(
                  (
                    message,
                  ) => {
                    const isUser =
                      message.role ===
                      "USER";

                    const sources =
                      isUser
                        ? []
                        : parseConversationSources(
                            message.sourcesJson,
                          );

                    return (
                      <div
                        key={
                          message.id
                        }
                        className={`flex ${
                          isUser
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`flex w-full max-w-[90%] items-start gap-3 sm:max-w-[82%] lg:max-w-[74%] ${
                            isUser
                              ? "flex-row-reverse"
                              : ""
                          }`}
                        >
                          <div
                            className={`flex size-9 shrink-0 items-center justify-center rounded-xl shadow-sm ${
                              isUser
                                ? "bg-blue-600 text-white"
                                : "border border-slate-200 bg-white text-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-blue-400"
                            }`}
                          >
                            {isUser ? (
                              <User
                                className="size-4"
                                aria-hidden="true"
                              />
                            ) : (
                              <Bot
                                className="size-4"
                                aria-hidden="true"
                              />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div
                              className={`mb-1.5 flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 ${
                                isUser
                                  ? "justify-end"
                                  : ""
                              }`}
                            >
                              <span className="font-semibold text-slate-500 dark:text-slate-400">
                                {isUser
                                  ? isAdmin
                                    ? "Utilisateur"
                                    : "Vous"
                                  : "Assistant IA"}
                              </span>

                              <span>
                                ·
                              </span>

                              <span>
                                {formatDate(
                                  message.createdAt,
                                )}
                              </span>
                            </div>

                            <div
                              className={`rounded-2xl px-4 py-3.5 ${
                                isUser
                                  ? "rounded-tr-md bg-blue-600 text-white shadow-sm shadow-blue-600/15"
                                  : "rounded-tl-md border border-slate-200 bg-white text-slate-800 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                              }`}
                            >
                              {isUser ? (
                                <p className="whitespace-pre-wrap break-words text-sm leading-6">
                                  {
                                    message.content
                                  }
                                </p>
                              ) : (
                                <AssistantMarkdown
                                  content={
                                    message.content
                                  }
                                />
                              )}

                              {!isUser &&
                              showConversationSources &&
                              sources.length >
                                0 ? (
                                <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-700">
                                  <div className="mb-3 flex items-center gap-2">
                                    <BookOpenText
                                      className="size-4 text-blue-600 dark:text-blue-400"
                                      aria-hidden="true"
                                    />

                                    <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">
                                      Sources
                                    </p>

                                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                                      {
                                        sources.length
                                      }
                                    </span>
                                  </div>

                                  <div className="space-y-2">
                                    {sources.map(
                                      (
                                        source,
                                        sourceIndex,
                                      ) => (
                                        <details
                                          key={
                                            source.chunkId
                                          }
                                          className="group/source overflow-hidden rounded-xl border border-slate-200 bg-slate-50/70 dark:border-slate-700 dark:bg-slate-900/70"
                                        >
                                          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3.5 py-2.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-blue-50 hover:text-blue-700 dark:text-slate-300 dark:hover:bg-blue-500/10 dark:hover:text-blue-400">
                                            <span>
                                              Source{" "}
                                              {sourceIndex +
                                                1}

                                              {source.pageNumber !==
                                              null
                                                ? ` · Page ${source.pageNumber}`
                                                : ""}
                                            </span>

                                            <span className="text-slate-400 transition-transform group-open/source:rotate-180 dark:text-slate-500">
                                              ⌄
                                            </span>
                                          </summary>

                                          <div className="border-t border-slate-200 bg-white px-3.5 py-3 dark:border-slate-700 dark:bg-slate-800">
                                            <p className="whitespace-pre-wrap break-words text-xs leading-5 text-slate-600 dark:text-slate-300">
                                              {
                                                source.text
                                              }
                                            </p>
                                          </div>
                                        </details>
                                      ),
                                    )}
                                  </div>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  },
                )}

                {canAskQuestions &&
                askQuestionMutation.isPending ? (
                  <AssistantLoadingMessage
                    text="Analyse du document en cours..."
                  />
                ) : null}

                {canAskQuestions &&
                summaryMutation.isPending ? (
                  <AssistantLoadingMessage
                    text="Planification du résumé..."
                  />
                ) : null}

                {canAskQuestions &&
                isSummaryRunning &&
                !summaryMutation.isPending ? (
                  <AssistantLoadingMessage
                    text="Résumé du document en cours..."
                  />
                ) : null}
              </div>
            )}

            {canAskQuestions ? (
              <div className="z-10 shrink-0 border-t border-slate-200 bg-white p-3.5 shadow-[0_-8px_24px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-[0_-8px_24px_rgba(0,0,0,0.16)] sm:p-4">
                {askQuestionMutation.isError ? (
                  <ConversationError
                    title="Impossible d’obtenir une réponse"
                    message={
                      askQuestionMutation.error instanceof
                      Error
                        ? askQuestionMutation.error.message
                        : "Une erreur inattendue est survenue pendant le traitement RAG."
                    }
                  />
                ) : null}

                {summaryMutation.isError ? (
                  <ConversationError
                    title="Impossible de lancer le résumé"
                    message={
                      summaryMutation.error instanceof
                      Error
                        ? summaryMutation.error.message
                        : "Une erreur inattendue est survenue pendant la planification du résumé."
                    }
                  />
                ) : null}

                <form
                  onSubmit={
                    handleSubmit
                  }
                  className="rounded-2xl border border-slate-200 bg-slate-50/70 p-2 transition-all focus-within:border-blue-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-50 dark:border-slate-700 dark:bg-slate-800/60 dark:focus-within:border-blue-500/60 dark:focus-within:bg-slate-800 dark:focus-within:ring-blue-500/10"
                >
                  <textarea
                    value={
                      question
                    }
                    onChange={(
                      event,
                    ) => {
                      setQuestion(
                        event.target.value,
                      );
                    }}
                    onKeyDown={(
                      event,
                    ) => {
                      if (
                        event.key ===
                          "Enter" &&
                        !event.shiftKey
                      ) {
                        event.preventDefault();

                        event.currentTarget.form?.requestSubmit();
                      }
                    }}
                    disabled={
                      isBusy
                    }
                    maxLength={
                      MAX_QUESTION_LENGTH
                    }
                    rows={
                      2
                    }
                    placeholder={
                      isSummaryRunning
                        ? "Résumé du document en cours..."
                        : "Posez une question sur ce document..."
                    }
                    aria-label="Question à poser à l'assistant IA"
                    className="max-h-32 min-h-14 w-full resize-none bg-transparent px-3 py-2 text-sm leading-6 text-slate-800 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-60 dark:text-slate-200 dark:placeholder:text-slate-500"
                  />

                  <div className="flex flex-col gap-3 border-t border-slate-200/80 px-2 pt-2 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                      <Sparkles
                        className="size-3.5 text-blue-500 dark:text-blue-400"
                        aria-hidden="true"
                      />

                      <span>
                        {isSummaryRunning
                          ? "Résumé en cours de génération."
                          : "Entrée pour envoyer · Maj + Entrée pour une nouvelle ligne"}
                      </span>
                    </div>

                    <div className="flex items-center justify-end gap-3">
                      <span
                        className={`text-xs ${
                          question.length >=
                          MAX_QUESTION_LENGTH
                            ? "font-semibold text-red-600 dark:text-red-400"
                            : "text-slate-400 dark:text-slate-500"
                        }`}
                      >
                        {
                          question.length
                        }
                        /
                        {
                          MAX_QUESTION_LENGTH
                        }
                      </span>

                      <button
                        type="submit"
                        disabled={
                          !isQuestionValid ||
                          isBusy
                        }
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none dark:disabled:bg-slate-700 dark:disabled:text-slate-500"
                      >
                        {isBusy ? (
                          <>
                            <LoaderCircle
                              className="size-4 animate-spin"
                              aria-hidden="true"
                            />

                            Traitement...
                          </>
                        ) : (
                          <>
                            <Send
                              className="size-4"
                              aria-hidden="true"
                            />

                            Envoyer
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>

                <p className="mt-2 px-1 text-[11px] leading-5 text-slate-400 dark:text-slate-500">
                  Réponses générées à partir des informations retrouvées dans vos documents.
                </p>
              </div>
            ) : null}

            {isAdmin ? (
              <div className="z-10 shrink-0 border-t border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <ShieldCheck
                    className="size-4 text-blue-600 dark:text-blue-400"
                    aria-hidden="true"
                  />

                  Consultation administrateur en lecture seule.
                </div>
              </div>
            ) : null}
          </section>
        ) : null}
      </motion.div>
    </DashboardLayout>
  );
}

function AssistantLoadingMessage({
  text,
}: {
  text: string;
}) {
  return (
    <div className="flex justify-start">
      <div className="flex max-w-[85%] items-start gap-3 lg:max-w-[74%]">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-white text-blue-600 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-blue-400">
          <Bot
            className="size-4"
            aria-hidden="true"
          />
        </div>

        <div className="rounded-2xl rounded-tl-md border border-blue-100 bg-white px-4 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center gap-3">
            <LoaderCircle
              className="size-4 animate-spin text-blue-600 dark:text-blue-400"
              aria-hidden="true"
            />

            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Assistant IA
              </p>

              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                {
                  text
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConversationError({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <div
      role="alert"
      className="mb-3 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 dark:border-red-900/50 dark:bg-red-950/30"
    >
      <AlertCircle
        className="mt-0.5 size-4 shrink-0 text-red-600 dark:text-red-400"
        aria-hidden="true"
      />

      <div>
        <p className="text-sm font-semibold text-red-800 dark:text-red-300">
          {
            title
          }
        </p>

        <p className="mt-1 text-xs leading-5 text-red-700 dark:text-red-400">
          {
            message
          }
        </p>
      </div>
    </div>
  );
}