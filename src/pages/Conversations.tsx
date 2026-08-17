import { motion, useReducedMotion } from "framer-motion";
import {
  AlertCircle,
  FileText,
  LoaderCircle,
  MessageSquareText,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useConversations } from "@/features/conversations/hooks/useConversations";
import { DashboardLayout } from "@/layouts/DashboardLayout";

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

export default function Conversations() {
  const shouldReduceMotion = useReducedMotion();
  const navigate = useNavigate();

  const {
    data: conversations = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useConversations();

  const openConversation = (documentId: number) => {
    navigate(`/conversations/${documentId}`);
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
          duration: shouldReduceMotion ? 0 : 0.6,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="mx-auto w-full max-w-[1600px] space-y-6"
      >
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
              Conversations
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Retrouvez vos conversations documentaires et reprenez
              vos échanges avec l’assistant IA.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              void refetch();
            }}
            disabled={isFetching}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              className={`size-4 ${
                isFetching ? "animate-spin" : ""
              }`}
              aria-hidden="true"
            />

            Actualiser
          </button>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">
              Conversations
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-950">
              {conversations.length}
            </p>
          </article>
        </section>

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
                Récupération de votre historique documentaire.
              </p>
            </div>
          </section>
        ) : null}

        {isError ? (
          <section className="rounded-3xl border border-red-200 bg-red-50/60 p-6">
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
        conversations.length === 0 ? (
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
                Vos conversations apparaîtront ici après avoir posé
                une question à l’assistant sur un document.
              </p>
            </div>
          </section>
        ) : null}

        {!isLoading &&
        !isError &&
        conversations.length > 0 ? (
          <section className="space-y-3">
            {conversations.map((conversation) => (
              <article
                key={conversation.conversationId}
                role="link"
                tabIndex={0}
                onClick={() => {
                  openConversation(conversation.documentId);
                }}
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" ||
                    event.key === " "
                  ) {
                    event.preventDefault();

                    openConversation(
                      conversation.documentId,
                    );
                  }
                }}
                aria-label={`Ouvrir la conversation ${conversation.conversationId} du document ${conversation.documentId}`}
                className="group cursor-pointer rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg hover:shadow-slate-950/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                      <FileText
                        className="size-6"
                        aria-hidden="true"
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-base font-bold text-slate-950">
                          Document {conversation.documentFileName}
                        </h2>

                        {/* <span className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                          Conversation #{conversation.conversationId}
                        </span> */}
                      </div>

                      <p className="mt-2 text-sm text-slate-500">
                        Dernière activité :{" "}
                        <span className="font-medium text-slate-700">
                          {formatDate(conversation.updatedAt)}
                        </span>
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Créée le {formatDate(conversation.createdAt)}
                      </p>
                    </div>
                  </div>

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
            ))}
          </section>
        ) : null}
      </motion.div>
    </DashboardLayout>
  );
}