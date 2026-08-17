import { useQuery } from "@tanstack/react-query";

import { getDocumentAiHistory } from "@/features/documents/api/documents.api";

export function useDocumentAiHistoryQuery(
  documentId: number,
) {
  return useQuery({
    queryKey: [
      "documents",
      documentId,
      "ai-history",
    ],

    queryFn: () =>
      getDocumentAiHistory(
        documentId,
      ),

    enabled:
      Number.isFinite(documentId) &&
      documentId > 0,

    retry: false,
  });
}