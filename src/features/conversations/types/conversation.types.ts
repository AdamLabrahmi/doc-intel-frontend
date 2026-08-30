export type ConversationMessageRole =
  | "USER"
  | "ASSISTANT";

export interface ConversationSummary {
  conversationId: number;
  documentId: number;
  documentFileName: string;

  userId: number;
  userFullName: string | null;
  userEmail: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface ConversationMessage {
  id: number;
  conversationId: number;

  role: ConversationMessageRole;

  content: string;

  sourcesJson: string | null;

  generationModel: string | null;

  durationMs: number | null;

  createdAt: string;
}

export interface DocumentConversation {
  conversationId: number;
  documentId: number;
  documentFileName: string;

  userId: number;

  createdAt: string;
  updatedAt: string;

  messages: ConversationMessage[];
}

export interface AskDocumentQuestionRequest {
  question: string;
  topK?: number;
}

export interface DocumentQuestionAnsweringSource {
  chunkId: number;
  documentId: number;
  chunkIndex: number;

  text: string;

  pageNumber: number | null;

  tokenCount: number | null;

  similarityScore: number;
}

export interface AskDocumentQuestionResponse {
  conversationId: number;
  documentId: number;

  question: string;
  answer: string;

  generationModel: string;

  requestedTopK: number;
  retrievedChunkCount: number;

  contextFound: boolean;

  durationMs: number;

  sources: DocumentQuestionAnsweringSource[];
}

export interface RequestDocumentSummaryRequest {
  request: string;
}

export interface RequestDocumentSummaryResponse {
  conversationId: number;
  documentId: number;
  request: string;
  status:
    | "QUEUED"
    | "ALREADY_RUNNING";
}
