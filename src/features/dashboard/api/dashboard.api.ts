import type { DashboardSummaryDto } from "@/features/dashboard/types/dashboard.types";
import { httpClient } from "@/lib/http-client";

export async function getDashboardSummary(): Promise<DashboardSummaryDto> {
  const response =
    await httpClient.get<DashboardSummaryDto>(
      "/api/dashboard/summary",
    );

  return response.data;
}