import { httpClient } from "@/lib/http-client";

import type {
  DocumentAiResultDto,
  DocumentDto,
  DocumentExtractedTextDto,
  DocumentExtractionDto,
  DocumentListItem,
  ProcessDocumentBatchResultDto,
  DocumentQuestionAnswerDto,
  DocumentQuestionRequestDto,
  DocumentConversationDto,
} from "@/features/documents/types/document.types";


import { mapDocumentStatus } from "@/features/documents/utils/document-status.utils";

import type {
  DocumentAiHistoryDto,
} from "@/features/documents/types/document.types";

function mapDocumentDtoToListItem(
  document: DocumentDto,
): DocumentListItem {
  return {
    id: document.id,
    fileName: document.fileName,
    version: document.version,
    status: mapDocumentStatus(document.status),
    createdAt: document.createdAt,
    updatedAt: document.updatedAt,
  };
}

export async function getDocuments(): Promise<DocumentListItem[]> {
  const response =
    await httpClient.get<DocumentDto[]>("/api/documents");

  return response.data.map(mapDocumentDtoToListItem);
}

export async function processDocumentBatch(
  files: readonly File[],
): Promise<ProcessDocumentBatchResultDto> {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append(
      "files",
      file,
    );
  });

  const response =
    await httpClient.post<ProcessDocumentBatchResultDto>(
      "/api/documents/batch-process",
      formData,
      {
        timeout: 120_000,
      },
    );

  return response.data;
}

export async function deleteDocument(documentId: number): Promise<void> {
  await httpClient.delete(`/api/documents/${documentId}`);
}


export async function getDocumentExtraction(
  documentId: number,
): Promise<DocumentExtractionDto> {
  const response =
    await httpClient.get<DocumentExtractionDto>(
      `/api/documents/${documentId}/extraction`,
    );

  return response.data;
}

export async function getDocumentExtractedText(
  documentId: number,
): Promise<DocumentExtractedTextDto> {
  const response =
    await httpClient.get<DocumentExtractedTextDto>(
      `/api/documents/${documentId}/extracted-text`,
    );

  return response.data;
}

export async function getDocumentAiResult(
  documentId: number,
): Promise<DocumentAiResultDto> {
  const response =
    await httpClient.get<DocumentAiResultDto>(
      `/api/documents/${documentId}/ai-result`,
    );

  return response.data;
}

export async function getDocumentAiHistory(
  documentId: number,
): Promise<DocumentAiHistoryDto> {
  const response =
    await httpClient.get<DocumentAiHistoryDto>(
      `/api/documents/${documentId}/ai-history`,
    );

  return response.data;
}

export async function askDocumentQuestion(
  documentId: number,
  request: DocumentQuestionRequestDto,
): Promise<DocumentQuestionAnswerDto> {
  const response =
    await httpClient.post<DocumentQuestionAnswerDto>(
      `/api/documents/${documentId}/ask`,
      request,
    );

  return response.data;
}

export async function getDocumentConversation(documentId : number,): Promise<DocumentConversationDto> {
  const response = await httpClient.get<DocumentConversationDto>(
    `/api/documents/${documentId}/conversation`,
  );
  return response.data;
}