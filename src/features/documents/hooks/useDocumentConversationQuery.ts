import { useQuery } from "@tanstack/react-query";

import { getDocumentConversation } from "@/features/documents/api/documents.api";

export function useDocumentConversationQuery(
  documentId: number,
) {
  return useQuery({
    queryKey: [
      "documents",
      documentId,
      "conversation",
    ],

    queryFn: () =>
      getDocumentConversation(
        documentId,
      ),

    enabled:
      Number.isFinite(documentId) &&
      documentId > 0,

    retry: false,
  });
}