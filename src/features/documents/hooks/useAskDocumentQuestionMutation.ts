import { useMutation } from "@tanstack/react-query";

import { askDocumentQuestion } from "@/features/documents/api/documents.api";
import type {
  DocumentQuestionRequestDto,
} from "@/features/documents/types/document.types";

interface AskDocumentQuestionVariables {
  documentId: number;
  request: DocumentQuestionRequestDto;
}

export function useAskDocumentQuestionMutation() {
  return useMutation({
    mutationFn: (
      variables: AskDocumentQuestionVariables,
    ) =>
      askDocumentQuestion(
        variables.documentId,
        variables.request,
      ),
  });
}