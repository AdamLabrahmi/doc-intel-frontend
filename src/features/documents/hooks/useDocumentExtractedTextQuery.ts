import { useQuery } from "@tanstack/react-query";

import { getDocumentExtractedText } from "@/features/documents/api/documents.api";

export function useDocumentExtractedTextQuery(
  documentId: number,
) {
  return useQuery({
    queryKey: [
      "documents",
      documentId,
      "extracted-text",
    ],

    queryFn: () =>
      getDocumentExtractedText(
        documentId,
      ),

    enabled:
      Number.isFinite(documentId) &&
      documentId > 0,
  });
}