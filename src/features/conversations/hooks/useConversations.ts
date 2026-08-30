import {
  useQuery,
} from "@tanstack/react-query";

import {
  getConversationById,
  getConversations,
  getDocumentConversation,
} from "@/features/conversations/api/conversation.api";

export const conversationQueryKeys = {
  all:
    ["conversations"] as const,

  byDocument: (
    documentId: number,
  ) =>
    [
      ...conversationQueryKeys.all,
      "document",
      documentId,
    ] as const,

  byId: (
    conversationId: number,
  ) =>
    [
      ...conversationQueryKeys.all,
      "conversation",
      conversationId,
    ] as const,
};

export function useConversations() {
  return useQuery({
    queryKey:
      conversationQueryKeys.all,

    queryFn:
      getConversations,
  });
}

export function useDocumentConversation(
  documentId: number,
) {
  return useQuery({
    queryKey:
      conversationQueryKeys.byDocument(
        documentId,
      ),

    queryFn: () =>
      getDocumentConversation(
        documentId,
      ),

    enabled:
      Number.isInteger(
        documentId,
      ) &&
      documentId > 0,
  });
}

export function useConversationById(
  conversationId: number,
) {
  return useQuery({
    queryKey:
      conversationQueryKeys.byId(
        conversationId,
      ),

    queryFn: () =>
      getConversationById(
        conversationId,
      ),

    enabled:
      Number.isInteger(
        conversationId,
      ) &&
      conversationId > 0,
  });
}