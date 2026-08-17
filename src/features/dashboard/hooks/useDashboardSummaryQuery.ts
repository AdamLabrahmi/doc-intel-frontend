import { useQuery } from "@tanstack/react-query";

import { getDashboardSummary } from "@/features/dashboard/api/dashboard.api";

export const dashboardQueryKeys = {
  all: ["dashboard"] as const,
  summary: ["dashboard", "summary"] as const,
};

export function useDashboardSummaryQuery() {
 return useQuery({
  queryKey: dashboardQueryKeys.summary,
  queryFn: getDashboardSummary,

  // Temporaire :
  // l'endpoint backend /api/dashboard/summary
  // n'est pas encore implémenté.
  enabled: false,
});
}