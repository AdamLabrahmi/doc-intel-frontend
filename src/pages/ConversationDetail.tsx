import {
  type FormEvent,
  useState,
} from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  BookOpenText,
  Bot,
  Clock3,
  FileText,
  LoaderCircle,
  MessageSquareText,
  RefreshCw,
  Send,
  Sparkles,
  User,
} from "lucide-react";
import {
  Link,
  Navigate,
  useParams,
} from "react-router-dom";

import { useAskDocumentQuestion } from "@/features/conversations/hooks/useAskDocumentQuestion";
import { useDocumentConversation } from "@/features/conversations/hooks/useConversations";
import { parseConversationSources } from "@/features/conversations/utils/conversation-sources";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { ROUTES } from "@/routes/routePaths";

const MAX_QUESTION_LENGTH = 2_000;

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date inconnue";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatDuration(
  durationMs: number | null,
): string | null {
  if (
    durationMs === null ||
    durationMs < 0
  ) {
    return null;
  }

  if (durationMs < 1_000) {
    return `${durationMs} ms`;
  }

  return `${(durationMs / 1_000).toFixed(1)} s`;
}

export default function ConversationDetail() {
  const shouldReduceMotion = useReducedMotion();

  const [question, setQuestion] =
    useState("");

  const { documentId } = useParams<{
    documentId: string;
  }>();

  const parsedDocumentId =
    documentId !== undefined
      ? Number(documentId)
      : Number.NaN;

  const isValidDocumentId =
    Number.isInteger(parsedDocumentId) &&
    parsedDocumentId > 0;

  const queryDocumentId =
    isValidDocumentId
      ? parsedDocumentId
      : 0;

  const {
    data: conversation,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useDocumentConversation(
    queryDocumentId,
  );

  const askQuestionMutation =
    useAskDocumentQuestion(
      queryDocumentId,
    );

  const normalizedQuestion =
    question.trim();

  const isQuestionValid =
    normalizedQuestion.length > 0 &&
    normalizedQuestion.length <=
      MAX_QUESTION_LENGTH;

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (
      !isQuestionValid ||
      askQuestionMutation.isPending
    ) {
      return;
    }

    try {
      await askQuestionMutation.mutateAsync({
        question: normalizedQuestion,
      });

      setQuestion("");
    } catch {
      /*
       * L'erreur est affichée via
       * askQuestionMutation.error.
       */
    }
  };

  if (!isValidDocumentId) {
    return (
      <Navigate
        to={ROUTES.conversations}
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
                opacity: 0,
                y: 16,
              }
        }
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: shouldReduceMotion
            ? 0
            : 0.5,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="mx-auto flex h-[calc(100vh-7rem)] w-full max-w-[1600px] flex-col gap-4 overflow-hidden"
      >
        <header className="shrink-0">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-4">
              <Link
                to={ROUTES.conversations}
                aria-label="Retour aux conversations"
                className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                <ArrowLeft
                  className="size-5"
                  aria-hidden="true"
                />
              </Link>

              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-blue-600">
                  <MessageSquareText
                    className="size-4"
                    aria-hidden="true"
                  />

                  Chat documentaire
                </div>

                <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                  Conversation du document #{parsedDocumentId}
                </h1>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Posez vos questions et consultez l’historique
                  des réponses générées à partir du document.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                void refetch();
              }}
              disabled={
                isFetching ||
                askQuestionMutation.isPending
              }
              className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
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
        </header>

        {isLoading ? (
          <section className="flex min-h-0 flex-1 items-center justify-center rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-50">
                <LoaderCircle
                  className="size-6 animate-spin text-blue-600"
                  aria-hidden="true"
                />
              </div>

              <p className="mt-4 text-sm font-semibold text-slate-700">
                Chargement de la conversation...
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Récupération de l’historique des messages.
              </p>
            </div>
          </section>
        ) : null}

        {isError ? (
          <section className="shrink-0 rounded-3xl border border-red-200 bg-red-50/60 p-6">
            <div className="flex items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-red-100">
                <AlertCircle
                  className="size-5 text-red-600"
                  aria-hidden="true"
                />
              </div>

              <div>
                <h2 className="font-bold text-slate-950">
                  Impossible de charger la conversation
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
                  className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-red-700"
                >
                  <RefreshCw
                    className="size-4"
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
          <>
            <section className="grid shrink-0 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <MessageSquareText
                      className="size-5"
                      aria-hidden="true"
                    />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Conversation
                    </p>

                    <p className="mt-1 font-bold text-slate-950">
                      #{conversation.conversationId}
                    </p>
                  </div>
                </div>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                    <FileText
                      className="size-5"
                      aria-hidden="true"
                    />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Document
                    </p>

                    <p className="mt-1 font-bold text-slate-950">
                      #{conversation.documentId}
                    </p>
                  </div>
                </div>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                    <MessageSquareText
                      className="size-5"
                      aria-hidden="true"
                    />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Messages
                    </p>

                    <p className="mt-1 font-bold text-slate-950">
                      {conversation.messages.length}
                    </p>
                  </div>
                </div>
              </article>
            </section>

            <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="shrink-0 border-b border-slate-100 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <MessageSquareText
                      className="size-5"
                      aria-hidden="true"
                    />
                  </div>

                  <div>
                    <h2 className="font-bold text-slate-950">
                      Historique
                    </h2>

                    <p className="mt-0.5 text-sm text-slate-500">
                      Créée le{" "}
                      {formatDate(
                        conversation.createdAt,
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {conversation.messages.length === 0 ? (
                <div className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto p-8 text-center">
                  <div className="max-w-sm">
                    <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                      <MessageSquareText
                        className="size-7"
                        aria-hidden="true"
                      />
                    </div>

                    <h3 className="mt-5 text-lg font-bold text-slate-950">
                      Commencez la conversation
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Posez une question sur le document pour
                      démarrer votre échange avec l’assistant IA.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="min-h-0 flex-1 space-y-6 overflow-y-auto bg-slate-50/40 p-6 lg:p-8">
                  {conversation.messages.map(
                    (message) => {
                      const isUser =
                        message.role === "USER";

                      const duration =
                        formatDuration(
                          message.durationMs,
                        );

                      const sources =
                        isUser
                          ? []
                          : parseConversationSources(
                              message.sourcesJson,
                            );

                      return (
                        <div
                          key={message.id}
                          className={`flex ${
                            isUser
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`flex max-w-[85%] items-start gap-3 lg:max-w-[75%] ${
                              isUser
                                ? "flex-row-reverse"
                                : ""
                            }`}
                          >
                            <div
                              className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${
                                isUser
                                  ? "bg-blue-600 text-white"
                                  : "border border-slate-200 bg-white text-blue-600"
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

                            <div
                              className={`min-w-0 rounded-2xl px-4 py-3 ${
                                isUser
                                  ? "rounded-tr-md bg-blue-600 text-white shadow-sm shadow-blue-600/10"
                                  : "rounded-tl-md border border-slate-200 bg-white text-slate-800 shadow-sm"
                              }`}
                            >
                              <div
                                className={`mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs ${
                                  isUser
                                    ? "text-blue-100"
                                    : "text-slate-400"
                                }`}
                              >
                                <span className="font-semibold">
                                  {isUser
                                    ? "Vous"
                                    : "Assistant IA"}
                                </span>

                                <span>
                                  {formatDate(
                                    message.createdAt,
                                  )}
                                </span>
                              </div>

                              <p className="whitespace-pre-wrap break-words text-sm leading-6">
                                {message.content}
                              </p>

                              {!isUser &&
                              (message.generationModel ||
                                duration) ? (
                                <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3 text-xs text-slate-400">
                                  {message.generationModel ? (
                                    <span className="rounded-lg bg-slate-50 px-2 py-1 font-medium">
                                      {
                                        message.generationModel
                                      }
                                    </span>
                                  ) : null}

                                  {duration ? (
                                    <span className="inline-flex items-center gap-1">
                                      <Clock3
                                        className="size-3.5"
                                        aria-hidden="true"
                                      />

                                      {duration}
                                    </span>
                                  ) : null}
                                </div>
                              ) : null}

                              {!isUser &&
                              sources.length > 0 ? (
                                <div className="mt-4 border-t border-slate-100 pt-4">
                                  <div className="mb-3 flex items-center gap-2">
                                    <BookOpenText
                                      className="size-4 text-blue-600"
                                      aria-hidden="true"
                                    />

                                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                                      Sources
                                    </p>

                                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
                                      {sources.length}
                                    </span>
                                  </div>

                                  <div className="space-y-2">
                                    {sources.map(
                                      (
                                        source,
                                        sourceIndex,
                                      ) => (
                                        <details
                                          key={source.chunkId}
                                          className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50/70"
                                        >
                                          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-2.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-blue-50 hover:text-blue-700">
                                            <span>
                                              Source{" "}
                                              {sourceIndex + 1}
                                              {source.pageNumber !==
                                              null
                                                ? ` · Page ${source.pageNumber}`
                                                : ""}
                                            </span>

                                            <span className="text-[11px] font-medium text-slate-400">
                                              Chunk #
                                              {
                                                source.chunkIndex
                                              }
                                            </span>
                                          </summary>

                                          <div className="border-t border-slate-200 bg-white px-3 py-3">
                                            <p className="whitespace-pre-wrap break-words text-xs leading-5 text-slate-600">
                                              {source.text}
                                            </p>

                                            <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-400">
                                              <span>
                                                Chunk ID #
                                                {
                                                  source.chunkId
                                                }
                                              </span>

                                              {source.tokenCount !==
                                              null ? (
                                                <span>
                                                  {
                                                    source.tokenCount
                                                  }{" "}
                                                  tokens
                                                </span>
                                              ) : null}
                                            </div>
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
                      );
                    },
                  )}

                  {askQuestionMutation.isPending ? (
                    <div className="flex justify-start">
                      <div className="flex max-w-[85%] items-start gap-3 lg:max-w-[75%]">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-white text-blue-600">
                          <Bot
                            className="size-4"
                            aria-hidden="true"
                          />
                        </div>

                        <div className="rounded-2xl rounded-tl-md border border-blue-100 bg-white px-4 py-3 shadow-sm">
                          <div className="flex items-center gap-3">
                            <LoaderCircle
                              className="size-4 animate-spin text-blue-600"
                              aria-hidden="true"
                            />

                            <div>
                              <p className="text-sm font-semibold text-slate-700">
                                Assistant IA
                              </p>

                              <p className="mt-0.5 text-xs text-slate-500">
                                Analyse du document en cours...
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}

              <div className="z-10 shrink-0 border-t border-slate-200 bg-white p-4 shadow-[0_-8px_24px_rgba(15,23,42,0.04)] sm:p-5">
                {askQuestionMutation.isError ? (
                  <div
                    role="alert"
                    className="mb-3 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3"
                  >
                    <AlertCircle
                      className="mt-0.5 size-4 shrink-0 text-red-600"
                      aria-hidden="true"
                    />

                    <div>
                      <p className="text-sm font-semibold text-red-800">
                        Impossible d’obtenir une réponse
                      </p>

                      <p className="mt-1 text-xs leading-5 text-red-700">
                        {askQuestionMutation.error instanceof Error
                          ? askQuestionMutation.error.message
                          : "Une erreur inattendue est survenue pendant le traitement RAG."}
                      </p>
                    </div>
                  </div>
                ) : null}

                <form
                  onSubmit={handleSubmit}
                  className="rounded-2xl border border-slate-200 bg-slate-50/70 p-2 transition-colors focus-within:border-blue-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-50"
                >
                  <textarea
                    value={question}
                    onChange={(event) => {
                      setQuestion(
                        event.target.value,
                      );
                    }}
                    onKeyDown={(event) => {
                      if (
                        event.key === "Enter" &&
                        !event.shiftKey
                      ) {
                        event.preventDefault();

                        event.currentTarget
                          .form?.requestSubmit();
                      }
                    }}
                    disabled={
                      askQuestionMutation.isPending
                    }
                    maxLength={
                      MAX_QUESTION_LENGTH
                    }
                    rows={2}
                    placeholder="Posez une question sur ce document..."
                    aria-label="Question à poser à l'assistant IA"
                    className="max-h-36 min-h-16 w-full resize-none bg-transparent px-3 py-2 text-sm leading-6 text-slate-800 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <div className="flex flex-col gap-3 border-t border-slate-200/80 px-2 pt-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Sparkles
                        className="size-3.5 text-blue-500"
                        aria-hidden="true"
                      />

                      <span>
                        Entrée pour envoyer · Maj + Entrée pour
                        une nouvelle ligne
                      </span>
                    </div>

                    <div className="flex items-center justify-end gap-3">
                      <span
                        className={`text-xs ${
                          question.length >=
                          MAX_QUESTION_LENGTH
                            ? "font-semibold text-red-600"
                            : "text-slate-400"
                        }`}
                      >
                        {question.length}/
                        {MAX_QUESTION_LENGTH}
                      </span>

                      <button
                        type="submit"
                        disabled={
                          !isQuestionValid ||
                          askQuestionMutation.isPending
                        }
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
                      >
                        {askQuestionMutation.isPending ? (
                          <>
                            <LoaderCircle
                              className="size-4 animate-spin"
                              aria-hidden="true"
                            />

                            Analyse...
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

                <p className="mt-2 px-1 text-xs leading-5 text-slate-400">
                  Les réponses sont générées uniquement à partir
                  des informations retrouvées dans vos documents.
                </p>
              </div>
            </section>
          </>
        ) : null}
      </motion.div>
    </DashboardLayout>
  );
}