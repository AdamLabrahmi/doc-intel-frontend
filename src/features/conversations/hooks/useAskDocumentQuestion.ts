import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  askDocumentQuestion,
} from "@/features/conversations/api/conversation.api";

import {
  conversationQueryKeys,
} from "@/features/conversations/hooks/useConversations";

import type {
  AskDocumentQuestionRequest,
  AskDocumentQuestionResponse,
} from "@/features/conversations/types/conversation.types";

export function useAskDocumentQuestion(
  documentId: number,
  conversationId?: number,
) {
  const queryClient =
    useQueryClient();

  return useMutation<
    AskDocumentQuestionResponse,
    Error,
    AskDocumentQuestionRequest
  >({
    mutationFn: (
      request,
    ) =>
      askDocumentQuestion(
        documentId,
        request,
      ),

    onSuccess:
      async () => {
        const invalidations:
          Promise<unknown>[] =
          [];

        /*
         * Conversation obtenue depuis
         * un document.
         */
        invalidations.push(
          queryClient.invalidateQueries({
            queryKey:
              conversationQueryKeys
                .byDocument(
                  documentId,
                ),
          }),
        );

        /*
         * Page /conversations/:conversationId.
         */
        if (
          conversationId !==
            undefined &&
          conversationId > 0
        ) {
          invalidations.push(
            queryClient.invalidateQueries({
              queryKey:
                conversationQueryKeys
                  .byId(
                    conversationId,
                  ),
            }),
          );
        }

        
        invalidations.push(
          queryClient.invalidateQueries({
            queryKey:
              conversationQueryKeys.all,
          }),
        );

        await Promise.all(
          invalidations,
        );
      },
  });
}