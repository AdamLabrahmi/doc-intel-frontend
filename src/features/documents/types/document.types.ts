export type DocumentStatus =
  | "COMPLETED"
  | "PROCESSING"
  | "PENDING"
  | "FAILED";

export type ExtractionMethod =
  | "TIKA"
  | "OCR"
  | "UNDEFINED";

export interface DocumentListItem {
  id: number;
  fileName: string;
  fileType: string;
  fileSize: string;
  version: number;
  language: string;
  extractionMethod: ExtractionMethod;
  status: DocumentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface UploadFileItem {
  id: string;
  file: File;
  status: "READY" | "INVALID";
  error?: string;
}