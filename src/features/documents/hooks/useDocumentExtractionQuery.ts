import { useQuery } from "@tanstack/react-query";

import { getDocumentExtraction } from "@/features/documents/api/documents.api";

export function useDocumentExtractionQuery(
  documentId: number,
) {
  return useQuery({
    queryKey: [
      "documents",
      documentId,
      "extraction",
    ],

    queryFn: () =>
      getDocumentExtraction(
        documentId,
      ),

    enabled:
      Number.isFinite(documentId) &&
      documentId > 0,
  });
}