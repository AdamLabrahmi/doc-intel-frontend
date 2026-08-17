import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { deleteDocument } from "@/features/documents/api/documents.api";
import { documentQueryKeys } from "@/features/documents/hooks/useDocumentsQuery";

export function useDeleteDocumentMutation() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: deleteDocument,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey:
          documentQueryKeys.all,
      });
    },
  });
}