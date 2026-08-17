import type {
  DocumentBackendStatus,
  DocumentStatus,
} from "@/features/documents/types/document.types";

export function mapDocumentStatus(
  status: DocumentBackendStatus,
): DocumentStatus {
  switch (status) {
    case "CREATED":
    case "UPLOADING":
    case "UPLOADED":
      return "PENDING";

    case "PROCESSING":
    case "INDEXING_QUEUED":
    case "INDEXING":
      return "PROCESSING";

    case "EXTRACTED":
    case "INDEXED":
      return "COMPLETED";

    case "INDEXING_FAILED":
    case "FAILED":
      return "FAILED";
  }
}