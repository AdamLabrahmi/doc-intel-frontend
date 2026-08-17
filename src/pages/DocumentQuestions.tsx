import { useState } from "react";
import {
  ArrowLeft,
  BrainCircuit,
  CircleAlert,
  Clock3,
  FileText,
  Loader2,
  MessageSquareText,
  Send,
  UserRound,
} from "lucide-react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useAskDocumentQuestionMutation } from "@/features/documents/hooks/useAskDocumentQuestionMutation";
import { useDocumentConversationQuery } from "@/features/documents/hooks/useDocumentConversationQuery";
import type {
  DocumentQuestionSourceDto,
} from "@/features/documents/types/document.types";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { ROUTES } from "@/routes/routePaths";

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

function formatMessageDate(
  value: string | null | undefined,
): string {
  if (!value) {
    return "Date indisponible";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "Date indisponible";
  }

  return new Intl.DateTimeFormat(
    "fr-FR",
    {
      dateStyle: "medium",
      timeStyle: "short",
    },
  ).format(date);
}

function parseSourcesJson(
  sourcesJson: string | null,
): DocumentQuestionSourceDto[] {
  if (
    !sourcesJson ||
    sourcesJson.trim().length === 0
  ) {
    return [];
  }

  try {
    const parsed =
      JSON.parse(
        sourcesJson,
      ) as unknown;

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (
        item,
      ): item is DocumentQuestionSourceDto => {
        if (
          typeof item !== "object" ||
          item === null
        ) {
          return false;
        }

        const source =
          item as Record<
            string,
            unknown
          >;

        return (
          typeof source.chunkId ===
            "number" &&
          typeof source.documentId ===
            "number" &&
          typeof source.chunkIndex ===
            "number" &&
          typeof source.text ===
            "string" &&
          typeof source.tokenCount ===
            "number" &&
          typeof source.similarityScore ===
            "number"
        );
      },
    );
  } catch {
    return [];
  }
}

export default function DocumentQuestions() {
  const navigate =
    useNavigate();

  const {
    documentId: documentIdParam,
  } = useParams<{
    documentId: string;
  }>();

  const documentId =
    Number(
      documentIdParam,
    );

  const isDocumentIdValid =
    Number.isFinite(
      documentId,
    ) &&
    documentId > 0;

  const [
    question,
    setQuestion,
  ] =
    useState("");

  const askQuestionMutation =
    useAskDocumentQuestionMutation();

  const conversationQuery =
    useDocumentConversationQuery(
      documentId,
    );

  const conversation =
    conversationQuery.data;

  const messages =
    conversation?.messages ??
    [];

  const handleSubmit =
    () => {
      const normalizedQuestion =
        question.trim();

      if (
        !normalizedQuestion ||
        !isDocumentIdValid ||
        askQuestionMutation.isPending
      ) {
        return;
      }

      askQuestionMutation.mutate(
        {
          documentId,
          request: {
            question:
              normalizedQuestion,
          },
        },
        {
          onSuccess: async () => {
            setQuestion("");

            await conversationQuery.refetch();
          },
        },
      );
    };

  if (!isDocumentIdValid) {
    return (
      <DashboardLayout>
        <div className="mx-auto w-full max-w-[1200px]">
          <section className="rounded-3xl border border-red-200 bg-red-50 p-8">
            <h1 className="text-lg font-bold text-red-900">
              Document invalide
            </h1>

            <p className="mt-2 text-sm text-red-700">
              L’identifiant du document n’est pas valide.
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
          </section>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-[1200px] space-y-6">
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
              aria-label="Retour aux documents"
            >
              <ArrowLeft
                className="size-4"
                aria-hidden="true"
              />
            </Button>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-950">
                Questions sur le document
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Document #{documentId}
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              navigate(
                ROUTES.documentDetails(
                  documentId,
                ),
              )
            }
            className="rounded-xl"
          >
            <FileText
              className="size-4"
              aria-hidden="true"
            />

            Voir le document
          </Button>
        </div>

        {/* INTRO */}
        <section className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm">
              <BrainCircuit
                className="size-5"
                aria-hidden="true"
              />
            </span>

            <div>
              <h2 className="font-bold text-slate-950">
                Assistant documentaire RAG
              </h2>

              <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">
                Posez des questions sur ce document. Les réponses sont
                générées à partir des passages retrouvés dans le document
                et l’historique est conservé.
              </p>
            </div>
          </div>
        </section>

        {/* HISTORIQUE */}
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-5">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <MessageSquareText
                  className="size-5"
                  aria-hidden="true"
                />
              </span>

              <div>
                <h2 className="font-bold text-slate-950">
                  Historique de la conversation
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {messages.length} message
                  {messages.length > 1
                    ? "s"
                    : ""}
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-7">
            {/* CHARGEMENT */}
            {conversationQuery.isLoading && (
              <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-6 py-14">
                <Loader2
                  className="size-6 animate-spin text-blue-600"
                  aria-hidden="true"
                />

                <span className="ml-3 text-sm font-semibold text-slate-600">
                  Chargement de la conversation...
                </span>
              </div>
            )}

            {/* ERREUR / AUCUNE CONVERSATION */}
            {!conversationQuery.isLoading &&
              conversationQuery.isError && (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
                  <MessageSquareText
                    className="mx-auto size-7 text-slate-400"
                    aria-hidden="true"
                  />

                  <h3 className="mt-4 font-bold text-slate-800">
                    Aucune conversation chargée
                  </h3>

                  <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
                    Si aucune conversation n’existe encore pour ce document,
                    posez simplement votre première question ci-dessous.
                  </p>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      void conversationQuery.refetch();
                    }}
                    className="mt-4 rounded-xl"
                  >
                    Réessayer
                  </Button>
                </div>
              )}

            {/* CONVERSATION VIDE */}
            {!conversationQuery.isLoading &&
              !conversationQuery.isError &&
              messages.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
                  <MessageSquareText
                    className="mx-auto size-7 text-slate-400"
                    aria-hidden="true"
                  />

                  <h3 className="mt-4 font-bold text-slate-800">
                    Aucune question pour le moment
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    Posez votre première question sur ce document.
                  </p>
                </div>
              )}

            {/* MESSAGES */}
            {!conversationQuery.isLoading &&
              messages.length > 0 && (
                <div className="space-y-5">
                  {messages.map(
                    (message) => {
                      const isUser =
                        message.role ===
                        "USER";

                      const sources =
                        isUser
                          ? []
                          : parseSourcesJson(
                              message.sourcesJson,
                            );

                      return (
                        <article
                          key={
                            message.id
                          }
                          className={
                            isUser
                              ? "ml-auto max-w-[85%]"
                              : "mr-auto max-w-[95%]"
                          }
                        >
                          <div
                            className={
                              isUser
                                ? "rounded-3xl rounded-br-lg bg-blue-600 p-5 text-white shadow-sm"
                                : "rounded-3xl rounded-bl-lg border border-slate-200 bg-slate-50 p-5"
                            }
                          >
                            <div className="flex items-center gap-2">
                              {isUser ? (
                                <UserRound
                                  className="size-4"
                                  aria-hidden="true"
                                />
                              ) : (
                                <BrainCircuit
                                  className="size-4 text-violet-600"
                                  aria-hidden="true"
                                />
                              )}

                              <span
                                className={
                                  isUser
                                    ? "text-xs font-bold uppercase tracking-wide text-blue-100"
                                    : "text-xs font-bold uppercase tracking-wide text-slate-500"
                                }
                              >
                                {isUser
                                  ? "Vous"
                                  : "Assistant IA"}
                              </span>
                            </div>

                            <p
                              className={
                                isUser
                                  ? "mt-3 whitespace-pre-wrap text-sm leading-7 text-white"
                                  : "mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700"
                              }
                            >
                              {
                                message.content
                              }
                            </p>

                            <div
                              className={
                                isUser
                                  ? "mt-4 border-t border-blue-500 pt-3"
                                  : "mt-4 border-t border-slate-200 pt-3"
                              }
                            >
                              <p
                                className={
                                  isUser
                                    ? "text-xs text-blue-100"
                                    : "text-xs text-slate-400"
                                }
                              >
                                {formatMessageDate(
                                  message.createdAt,
                                )}
                              </p>
                            </div>
                          </div>

                          {/* MÉTADONNÉES ASSISTANT */}
                          {!isUser && (
                            <div className="mt-3 space-y-3">
                              <div className="flex flex-wrap gap-2">
                                {message.generationModel && (
                                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                                    {
                                      message.generationModel
                                    }
                                  </span>
                                )}

                                {message.durationMs !==
                                  null && (
                                  <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                                    <Clock3
                                      className="size-3"
                                      aria-hidden="true"
                                    />

                                    {formatDurationMs(
                                      message.durationMs,
                                    )}
                                  </span>
                                )}

                                {sources.length > 0 && (
                                  <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                    {sources.length} source
                                    {sources.length >
                                    1
                                      ? "s"
                                      : ""}
                                  </span>
                                )}
                              </div>

                              {/* SOURCES */}
                              {sources.length > 0 && (
                                <details className="rounded-2xl border border-slate-200 bg-white">
                                  <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-slate-700">
                                    Voir les sources documentaires
                                  </summary>

                                  <div className="space-y-3 border-t border-slate-100 p-4">
                                    {sources.map(
                                      (
                                        source,
                                        index,
                                      ) => (
                                        <div
                                          key={`${message.id}-${source.chunkId}-${index}`}
                                          className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                                        >
                                          <div className="flex flex-wrap items-center justify-between gap-2">
                                            <div className="flex flex-wrap gap-2">
                                              <span className="rounded-lg bg-blue-50 px-2 py-1 text-xs font-bold text-blue-700">
                                                Source{" "}
                                                {index +
                                                  1}
                                              </span>

                                              <span className="text-xs font-semibold text-slate-500">
                                                Chunk #
                                                {
                                                  source.chunkIndex
                                                }
                                              </span>

                                              {source.pageNumber !==
                                                null && (
                                                <span className="text-xs font-semibold text-slate-500">
                                                  Page{" "}
                                                  {
                                                    source.pageNumber
                                                  }
                                                </span>
                                              )}
                                            </div>

                                            <span className="text-xs font-bold text-slate-500">
                                              Similarité{" "}
                                              {(
                                                source.similarityScore *
                                                100
                                              ).toFixed(
                                                1,
                                              )}
                                              %
                                            </span>
                                          </div>

                                          <p className="mt-3 max-h-48 overflow-auto whitespace-pre-wrap text-sm leading-6 text-slate-600">
                                            {
                                              source.text
                                            }
                                          </p>
                                        </div>
                                      ),
                                    )}
                                  </div>
                                </details>
                              )}
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

        {/* ERREUR QUESTION */}
        {askQuestionMutation.isError && (
          <section className="rounded-3xl border border-red-200 bg-red-50 p-5">
            <div className="flex items-start gap-3">
              <CircleAlert
                className="mt-0.5 size-5 shrink-0 text-red-600"
                aria-hidden="true"
              />

              <div>
                <h2 className="font-bold text-red-900">
                  Impossible de répondre
                </h2>

                <p className="mt-1 text-sm leading-6 text-red-700">
                  Une erreur est survenue pendant l’exécution
                  du pipeline de question-réponse.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* QUESTION */}
        <section className="sticky bottom-4 rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-xl shadow-slate-950/5 backdrop-blur sm:p-6">
          <label
            htmlFor="document-question"
            className="text-sm font-bold text-slate-800"
          >
            Votre question
          </label>

          <textarea
            id="document-question"
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

                handleSubmit();
              }
            }}
            rows={3}
            placeholder="Exemple : Quel est le montant TTC de cette facture ?"
            className="mt-3 min-h-24 w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
          />

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-400">
              Entrée pour envoyer, Maj + Entrée pour passer à la ligne.
            </p>

            <Button
              type="button"
              onClick={
                handleSubmit
              }
              disabled={
                !question.trim() ||
                askQuestionMutation.isPending
              }
              className="rounded-xl bg-blue-600 px-5 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {askQuestionMutation.isPending ? (
                <Loader2
                  className="size-4 animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <Send
                  className="size-4"
                  aria-hidden="true"
                />
              )}

              {askQuestionMutation.isPending
                ? "Analyse en cours..."
                : "Poser la question"}
            </Button>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}