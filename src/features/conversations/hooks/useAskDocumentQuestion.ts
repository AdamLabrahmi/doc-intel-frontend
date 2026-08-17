import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { askDocumentQuestion } from "@/features/conversations/api/conversation.api";
import { conversationQueryKeys } from "@/features/conversations/hooks/useConversations";

import type {
  AskDocumentQuestionRequest,
  AskDocumentQuestionResponse,
} from "@/features/conversations/types/conversation.types";

export function useAskDocumentQuestion(
  documentId: number,
) {
  const queryClient = useQueryClient();

  return useMutation<
    AskDocumentQuestionResponse,
    Error,
    AskDocumentQuestionRequest
  >({
    mutationFn: (request) =>
      askDocumentQuestion(
        documentId,
        request,
      ),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey:
            conversationQueryKeys.detail(
              documentId,
            ),
        }),

        queryClient.invalidateQueries({
          queryKey:
            conversationQueryKeys.all,
        }),
      ]);
    },
  });
}