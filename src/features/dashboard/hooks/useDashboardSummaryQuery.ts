import { useMemo } from "react";

import { useDocumentsQuery } from "@/features/documents/hooks/useDocumentsQuery";

import type {
  DashboardSummaryDto,
} from "@/features/dashboard/types/dashboard.types";

export function useDashboardSummaryQuery() {
  const {
    data: documents = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useDocumentsQuery();

  const dashboardSummary =
    useMemo<DashboardSummaryDto>(() => {
      const totalDocuments =
        documents.length;

      const completedDocuments =
        documents.filter(
          (document) =>
            document.status === "COMPLETED",
        ).length;

      const pendingDocuments =
        documents.filter(
          (document) =>
            document.status === "PENDING" ||
            document.status === "PROCESSING",
        ).length;

      const failedDocuments =
        documents.filter(
          (document) =>
            document.status === "FAILED",
        ).length;

      return {
        totalDocuments,
        completedDocuments,
        pendingDocuments,
        failedDocuments,
      };
    }, [documents]);

  return {
    data: dashboardSummary,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  };
}