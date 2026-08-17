import { httpClient } from "@/lib/http-client";

import type {
  AskDocumentQuestionRequest,
  AskDocumentQuestionResponse,
  ConversationSummary,
  DocumentConversation,
} from "@/features/conversations/types/conversation.types";

const CONVERSATIONS_ENDPOINT =
  "/api/conversations";

const DOCUMENTS_ENDPOINT =
  "/api/documents";

export async function getConversations(): Promise<
  ConversationSummary[]
> {
  const response =
    await httpClient.get<ConversationSummary[]>(
      CONVERSATIONS_ENDPOINT,
    );

  return response.data;
}

export async function getDocumentConversation(
  documentId: number,
): Promise<DocumentConversation> {
  const response =
    await httpClient.get<DocumentConversation>(
      `${DOCUMENTS_ENDPOINT}/${documentId}/conversation`,
    );

  return response.data;
}

export async function askDocumentQuestion(
  documentId: number,
  request: AskDocumentQuestionRequest,
): Promise<AskDocumentQuestionResponse> {
  const response =
    await httpClient.post<AskDocumentQuestionResponse>(
      `${DOCUMENTS_ENDPOINT}/${documentId}/ask`,
      request,
    );

  return response.data;
}