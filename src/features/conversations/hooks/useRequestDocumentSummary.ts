import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  requestDocumentSummary,
} from "@/features/conversations/api/conversation.api";

import type {
  RequestDocumentSummaryRequest,
} from "@/features/conversations/types/conversation.types";

interface RequestDocumentSummaryVariables {
  documentId: number;
  request: RequestDocumentSummaryRequest;
}

export function useRequestDocumentSummary() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn:
      ({
        documentId,
        request,
      }: RequestDocumentSummaryVariables) =>
        requestDocumentSummary(
          documentId,
          request,
        ),

    onSuccess:
      async (response) => {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: [
              "conversation",
              response.conversationId,
            ],
          }),

          queryClient.invalidateQueries({
            queryKey: [
              "conversations",
            ],
          }),
        ]);
      },
  });
}