import axios from "axios";

import {
  httpClient,
} from "@/lib/http-client";

import type {
  AskDocumentQuestionRequest,
  AskDocumentQuestionResponse,
  ConversationSummary,
  DocumentConversation,
  RequestDocumentSummaryRequest,
  RequestDocumentSummaryResponse,
} from "@/features/conversations/types/conversation.types";

const CONVERSATIONS_ENDPOINT =
  "/api/conversations";

const DOCUMENTS_ENDPOINT =
  "/api/documents";

interface ApiErrorResponse {
  code?: string;
  message?: string;
}

export async function getConversations():
  Promise<ConversationSummary[]> {

  const response =
    await httpClient.get<
      ConversationSummary[]
    >(
      CONVERSATIONS_ENDPOINT,
    );

  return response.data;
}

export async function getDocumentConversation(
  documentId: number,
): Promise<DocumentConversation | null> {

  try {

    const response =
      await httpClient.get<
        DocumentConversation
      >(
        `${DOCUMENTS_ENDPOINT}/${documentId}/conversation`,
      );

    return response.data;

  } catch (error: unknown) {

    if (
      axios.isAxiosError<
        ApiErrorResponse
      >(error) &&
      error.response?.status ===
        404 &&
      error.response.data?.code ===
        "CONVERSATION_NOT_FOUND"
    ) {
      return null;
    }

    throw error;
  }
}

export async function getConversationById(
  conversationId: number,
): Promise<DocumentConversation> {

  const response =
    await httpClient.get<
      DocumentConversation
    >(
      `${CONVERSATIONS_ENDPOINT}/${conversationId}`,
    );

  return response.data;
}

export async function askDocumentQuestion(
  documentId: number,
  request:
    AskDocumentQuestionRequest,
): Promise<AskDocumentQuestionResponse> {

  const response =
    await httpClient.post<
      AskDocumentQuestionResponse
    >(
      `${DOCUMENTS_ENDPOINT}/${documentId}/ask`,
      request,
    );

  return response.data;
}

export async function requestDocumentSummary(
  documentId: number,
  request:
    RequestDocumentSummaryRequest,
): Promise<RequestDocumentSummaryResponse> {

  const response =
    await httpClient.post<
      RequestDocumentSummaryResponse
    >(
      `${DOCUMENTS_ENDPOINT}/${documentId}/summary`,
      request,
    );

  return response.data;
}