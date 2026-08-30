import { useQuery } from "@tanstack/react-query";

import { getDashboardAnalytics } from "@/features/dashboard/api/dashboard-analytics.api";

export const dashboardAnalyticsQueryKeys = {
  all: ["dashboard", "analytics"] as const,
};

export function useDashboardAnalyticsQuery() {
  return useQuery({
    queryKey: dashboardAnalyticsQueryKeys.all,
    queryFn: getDashboardAnalytics,
  });
}