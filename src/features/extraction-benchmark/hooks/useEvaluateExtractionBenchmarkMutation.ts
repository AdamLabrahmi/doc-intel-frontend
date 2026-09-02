import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  evaluateExtractionBenchmark,
} from "../api/extraction-benchmark.api";

import {
  extractionBenchmarkQueryKeys,
} from "./useExtractionBenchmarkHistoryQuery";

export function useEvaluateExtractionBenchmarkMutation() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn:
      evaluateExtractionBenchmark,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey:
          extractionBenchmarkQueryKeys.history(),
      });
    },
  });
}