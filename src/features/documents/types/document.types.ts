export type DocumentBackendStatus =
  | "CREATED"
  | "UPLOADING"
  | "UPLOADED"
  | "PROCESSING"
  | "EXTRACTED"
  | "INDEXING_QUEUED"
  | "INDEXING"
  | "INDEXED"
  | "INDEXING_FAILED"
  | "FAILED";

export type DocumentStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED";

export interface DocumentDto {
  id: number;
  fileName: string;
  status: DocumentBackendStatus;
  documentGroupId: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentListItem {
  id: number;
  fileName: string;
  version: number;
  status: DocumentStatus;
  createdAt: string;
  updatedAt: string;
}

export type UploadFileStatus =
  | "READY"
  | "INVALID";

export interface UploadFileItem {
  id: string;
  file: File;
  status: UploadFileStatus;
  error?: string;
}

export interface BatchAcceptedDocumentDto {
  id: number;
  fileName: string;
  status: DocumentBackendStatus;
  documentGroupId: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface BatchRejectedDocumentDto {
  fileName: string;
  reason: string;
}

export interface ProcessDocumentBatchResultDto {
  requestDocuments: number;
  acceptedDocuments: number;
  rejectedDocuments: number;
  documents: BatchAcceptedDocumentDto[];
  rejectedFiles: BatchRejectedDocumentDto[];
}

export interface DocumentExtractionDto {
  id: number;
  documentId: number;
  extractionMethod: string;
  language: string | null;
  confidence: number | null;
  extractedTextStoragePath: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentExtractedTextDto {
  documentId: number;
  extractedText: string;
}

/*
 * Extraction générique IA
 */
export interface GenericDocumentImportantFieldDto {
  name: string;
  value: string;
}

export interface GenericDocumentFieldsDto {
  summary?: string;
  importantFields?: GenericDocumentImportantFieldDto[];
  entities?: string[];
  dates?: string[];
  amounts?: string[];
  references?: string[];
}

/*
 * Structure commune des données IA persistées.
 *
 * Exemple :
 *
 * {
 *   documentType: "RAPPORT",
 *   processingRoute: "RAPPORT",
 *   routeExecuted: "GENERIQUE",
 *   fields: { ... }
 * }
 */
export interface DocumentAiFieldsJsonDto {
  documentType: string;
  processingRoute: string;
  routeExecuted: string;

  fields:
    | GenericDocumentFieldsDto
    | Record<string, unknown>;
}

export type DocumentAiRunStatus =
  | "PROCESSING"
  | "SUCCESS"
  | "FAILED";


export interface DocumentAiResultDto {
  documentId: number;
  llmRunId: number;

  modelName: string | null;

  status: DocumentAiRunStatus;

  fieldsJson: DocumentAiFieldsJsonDto;

  confidence: number | null;

  startedAt: string | null;
  finishedAt: string | null;
}


export interface DocumentAiHistoryItemDto {
  llmRunId: number;
  documentId: number;

  modelName: string | null;

  status: DocumentAiRunStatus;

  startedAt: string | null;
  finishedAt: string | null;

  durationMs: number | null;

  fields: DocumentAiFieldsJsonDto | null;

  confidence: number | null;
}

export type DocumentAiHistoryDto =
  DocumentAiHistoryItemDto[];


//   export interface DocumentQuestionRequestDto {
//   question: string;
// }

// export interface DocumentQuestionSourceDto {
//   chunkId: number;
//   documentId: number;
//   chunkIndex: number;
//   text: string;

//   pageNumber: number | null;
//   tokenCount: number;

//   similarityScore: number;
// }

// export interface DocumentQuestionAnswerDto {
//   documentId: number;

//   question: string;
//   answer: string;

//   generationModel: string | null;

//   requestedTopK: number;
//   retrievedChunkCount: number;

//   contextFound: boolean;

//   durationMs: number;

//   sources: DocumentQuestionSourceDto[];
// }



// export type DocumentConversationMessageRole =
//   | "USER"
//   | "ASSISTANT";

// export interface DocumentConversationMessageDto {
//   id: number;
//   conversationId: number;
//   role: DocumentConversationMessageRole;
//   content: string;

//   sourcesJson: string | null;

//   generationModel: string | null;
//   durationMs: number | null;

//   createdAt: string;
// }

// export interface DocumentConversationDto {
//   conversationId: number;
//   documentId: number;
//   userId: number | null;

//   createdAt: string;
//   updatedAt: string;

//   messages: DocumentConversationMessageDto[];
// }