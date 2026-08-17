import type { DocumentQuestionAnsweringSource } from "@/features/conversations/types/conversation.types";

function isDocumentQuestionAnsweringSource(
  value: unknown,
): value is DocumentQuestionAnsweringSource {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return false;
  }

  const source = value as Record<
    string,
    unknown
  >;

  return (
    typeof source.chunkId === "number" &&
    typeof source.documentId === "number" &&
    typeof source.chunkIndex === "number" &&
    typeof source.text === "string" &&
    (
      source.pageNumber === null ||
      typeof source.pageNumber === "number"
    ) &&
    (
      source.tokenCount === null ||
      typeof source.tokenCount === "number"
    ) &&
    typeof source.similarityScore === "number"
  );
}

export function parseConversationSources(
  sourcesJson: string | null,
): DocumentQuestionAnsweringSource[] {
  if (
    sourcesJson === null ||
    sourcesJson.trim() === ""
  ) {
    return [];
  }

  try {
    const parsed: unknown =
      JSON.parse(sourcesJson);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      isDocumentQuestionAnsweringSource,
    );
  } catch {
    return [];
  }
}