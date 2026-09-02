import { useQuery } from "@tanstack/react-query";

import { getExtractionBenchmarkById } from "../api/extraction-benchmark.api";
import { extractionBenchmarkQueryKeys } from "./useExtractionBenchmarkHistoryQuery";

export function useExtractionBenchmarkQuery(
  benchmarkId: number | null,
) {
  return useQuery({
    queryKey:
      benchmarkId !== null
        ? extractionBenchmarkQueryKeys.detail(benchmarkId)
        : [
            ...extractionBenchmarkQueryKeys.all,
            "detail",
            "disabled",
          ],

    queryFn: () => {
      if (benchmarkId === null) {
        throw new Error(
          "L'identifiant du benchmark est obligatoire.",
        );
      }

      return getExtractionBenchmarkById(
        benchmarkId,
      );
    },

    enabled:
      benchmarkId !== null
      && benchmarkId > 0,

    staleTime: 30_000,
  });
}