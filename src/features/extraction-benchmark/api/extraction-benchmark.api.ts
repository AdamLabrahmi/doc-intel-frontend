import {
  httpClient,
} from "@/lib/http-client";

import type {
  ExtractionBenchmark,
  ExtractionBenchmarkEvaluationInput,
  ExtractionBenchmarkEvaluationResult,
} from "../types/extraction-benchmark.types";

const EXTRACTION_BENCHMARK_BASE_URL =
  "/api/extraction-benchmarks";

export async function getExtractionBenchmarkHistory():
  Promise<ExtractionBenchmark[]> {
  const response =
    await httpClient.get<
      ExtractionBenchmark[]
    >(
      EXTRACTION_BENCHMARK_BASE_URL,
    );

  return response.data;
}

export async function getExtractionBenchmarkById(
  benchmarkId: number,
): Promise<ExtractionBenchmark> {
  const response =
    await httpClient.get<
      ExtractionBenchmark
    >(
      `${EXTRACTION_BENCHMARK_BASE_URL}/${benchmarkId}`,
    );

  return response.data;
}

export async function evaluateExtractionBenchmark(
  input:
    ExtractionBenchmarkEvaluationInput,
): Promise<ExtractionBenchmarkEvaluationResult> {

  validateEvaluationInput(
    input,
  );

  const formData =
    new FormData();

  input.documentIds.forEach(
    (documentId) => {
      formData.append(
        "documentIds",
        String(
          documentId,
        ),
      );
    },
  );

  input.groundTruthFiles.forEach(
    (file) => {
      formData.append(
        "files",
        file,
      );
    },
  );

  const response =
    await httpClient.post<
      ExtractionBenchmarkEvaluationResult
    >(
      `${EXTRACTION_BENCHMARK_BASE_URL}/evaluate`,
      formData,
    );

  return response.data;
}

function validateEvaluationInput(
  input:
    ExtractionBenchmarkEvaluationInput,
) {
  if (
    input.documentIds.length ===
    0
  ) {
    throw new Error(
      "Au moins un document doit être sélectionné.",
    );
  }

  if (
    input.groundTruthFiles.length ===
    0
  ) {
    throw new Error(
      "Au moins un fichier de référence est obligatoire.",
    );
  }

  if (
    input.documentIds.length !==
    input.groundTruthFiles.length
  ) {
    throw new Error(
      "Chaque document doit posséder exactement un fichier de référence.",
    );
  }

  const uniqueDocumentIds =
    new Set(
      input.documentIds,
    );

  if (
    uniqueDocumentIds.size !==
    input.documentIds.length
  ) {
    throw new Error(
      "Un même document ne peut pas être ajouté plusieurs fois au benchmark.",
    );
  }
}