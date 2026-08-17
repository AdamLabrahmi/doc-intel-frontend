import { useQuery } from "@tanstack/react-query";

import { getDocumentAiResult } from "@/features/documents/api/documents.api";

export function useDocumentAiResultQuery(
  documentId: number,
) {
  return useQuery({
    queryKey: [
      "documents",
      documentId,
      "ai-result",
    ],

    queryFn: () =>
      getDocumentAiResult(
        documentId,
      ),

    enabled:
      Number.isFinite(documentId) &&
      documentId > 0,

    retry: false,
  });
}