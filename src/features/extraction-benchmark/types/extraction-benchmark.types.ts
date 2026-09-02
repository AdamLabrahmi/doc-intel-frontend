export type ExtractionMethod =
  | "TIKA"
  | "TESSERACT";

export interface ExtractionBenchmarkMethod {
  id: number;

  extractionMethod:
    ExtractionMethod;

  documentCount:
    number;

  cer:
    number;

  characterAccuracy:
    number;

  wer:
    number;

  wordAccuracy:
    number;

  averageExtractionDurationMs:
    number | null;

  averageProcessingDurationMs:
    number | null;

  averageExtractionDurationPerPageMs:
    number | null;
}

export interface ExtractionBenchmarkDocument {
  id: number;

  documentId:
    number;

  fileName:
    string | null;

  extractionMethod:
    ExtractionMethod;

  cer:
    number;

  characterAccuracy:
    number;

  wer:
    number;

  wordAccuracy:
    number;

  extractionDurationMs:
    number | null;

  processingDurationMs:
    number | null;

  averageExtractionDurationPerPageMs:
    number | null;
}

export interface ExtractionBenchmark {
  id: number;

  createdByUserId:
    number;

  documentCount:
    number;

  cer:
    number;

  characterAccuracy:
    number;

  wer:
    number;

  wordAccuracy:
    number;

  averageExtractionDurationMs:
    number | null;

  averageProcessingDurationMs:
    number | null;

  averageExtractionDurationPerPageMs:
    number | null;

  createdAt:
    string;

  methods:
    ExtractionBenchmarkMethod[];

  documents:
    ExtractionBenchmarkDocument[];
}

export interface CreateExtractionBenchmarkInput {
  documentIds:
    number[];

  groundTruthFiles:
    File[];
}