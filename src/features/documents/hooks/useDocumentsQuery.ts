import { useQuery } from "@tanstack/react-query";

import { getDocuments } from "@/features/documents/api/documents.api";

export const documentQueryKeys = {
  all: ["documents"] as const,
};

export function useDocumentsQuery() {
  return useQuery({
    queryKey: documentQueryKeys.all,
    queryFn: getDocuments,
    refetchInterval: (query) => {
      const documents = query.state.data;

      if (!documents) {
        return false;
      }

      const hasProcessingDocuments = documents.some(
        (document) =>
          document.status === "PROCESSING" ||
          document.status === "PENDING",
      );

      return hasProcessingDocuments ? 5_000 : false;
    },
  });
}