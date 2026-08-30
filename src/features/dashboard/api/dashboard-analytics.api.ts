import type {
  DashboardAnalyticsDto,
} from "@/features/dashboard/types/dashboard.types";
import { httpClient } from "@/lib/http-client";

export async function getDashboardAnalytics(): Promise<DashboardAnalyticsDto> {
  const response =
    await httpClient.get<DashboardAnalyticsDto>(
      "/api/dashboard/analytics",
    );

  return response.data;
}