import { useMutation, useQueryClient } from "@tanstack/react-query";

import { processDocumentBatch } from "@/features/documents/api/documents.api";
import { documentQueryKeys } from "@/features/documents/hooks/useDocumentsQuery";

export function useProcessDocumentBatchMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: processDocumentBatch,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: documentQueryKeys.all,
      });
    },
  });
}