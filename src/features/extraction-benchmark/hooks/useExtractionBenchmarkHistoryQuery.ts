import { useQuery } from "@tanstack/react-query";

import { getExtractionBenchmarkHistory } from "../api/extraction-benchmark.api";

export const extractionBenchmarkQueryKeys = {
  all: ["extraction-benchmarks"] as const,

  history: () =>
    [...extractionBenchmarkQueryKeys.all, "history"] as const,

  detail: (benchmarkId: number) =>
    [
      ...extractionBenchmarkQueryKeys.all,
      "detail",
      benchmarkId,
    ] as const,
};

export function useExtractionBenchmarkHistoryQuery() {
  return useQuery({
    queryKey: extractionBenchmarkQueryKeys.history(),

    queryFn: getExtractionBenchmarkHistory,

    staleTime: 30_000,
  });
}