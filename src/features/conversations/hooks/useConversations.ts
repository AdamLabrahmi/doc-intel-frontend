import { useQuery } from "@tanstack/react-query";

import {
  getConversations,
  getDocumentConversation,
} from "@/features/conversations/api/conversation.api";

export const conversationQueryKeys = {
  all: ["conversations"] as const,

  detail: (documentId: number) =>
    [
      ...conversationQueryKeys.all,
      "document",
      documentId,
    ] as const,
};

export function useConversations() {
  return useQuery({
    queryKey: conversationQueryKeys.all,
    queryFn: getConversations,
  });
}

export function useDocumentConversation(
  documentId: number,
) {
  return useQuery({
    queryKey:
      conversationQueryKeys.detail(
        documentId,
      ),

    queryFn: () =>
      getDocumentConversation(
        documentId,
      ),

    enabled:
      Number.isInteger(documentId) &&
      documentId > 0,
  });
}