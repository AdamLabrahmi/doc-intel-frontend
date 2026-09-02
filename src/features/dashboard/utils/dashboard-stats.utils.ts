import {
  CircleAlert,
  Clock3,
  FileCheck2,
  Files,
} from "lucide-react";

import type {
  DashboardStat,
  DashboardSummaryDto,
} from "@/features/dashboard/types/dashboard.types";

function calculatePercentage(
  value: number,
  total: number,
): number {
  if (
    total ===
    0
  ) {
    return 0;
  }

  return (
    value /
    total
  ) * 100;
}

export function buildDashboardStats(
  summary: DashboardSummaryDto,
): DashboardStat[] {
  const successRate =
    calculatePercentage(
      summary.completedDocuments,
      summary.totalDocuments,
    );

  const pendingRate =
    calculatePercentage(
      summary.pendingDocuments,
      summary.totalDocuments,
    );

  const failureRate =
    calculatePercentage(
      summary.failedDocuments,
      summary.totalDocuments,
    );

  return [
    {
      title:
        "Documents importés",

      value:
        summary.totalDocuments.toLocaleString(
          "fr-FR",
        ),

      description:
        "Documents enregistrés",

      trend:
        "Total enregistré",

      icon:
        Files,

      tone:
        "blue",

      documentStatusFilter:
        "ALL",
    },

    {
      title:
        "Traitements terminés",

      value:
        summary.completedDocuments.toLocaleString(
          "fr-FR",
        ),

      description:
        "Indexation terminée",

      trend:
        `${successRate.toLocaleString(
          "fr-FR",
          {
            maximumFractionDigits:
              1,
          },
        )} % du total`,

      icon:
        FileCheck2,

      tone:
        "emerald",

      documentStatusFilter:
        "COMPLETED",
    },

    {
      title:
        "En attente",

      value:
        summary.pendingDocuments.toLocaleString(
          "fr-FR",
        ),

      description:
        "Traitements en cours ou en attente",

      trend:
        `${pendingRate.toLocaleString(
          "fr-FR",
          {
            maximumFractionDigits:
              1,
          },
        )} % du total`,

      icon:
        Clock3,

      tone:
        "amber",

      documentStatusFilter:
        "ACTIVE",
    },

    {
      title:
        "Traitements échoués",

      value:
        summary.failedDocuments.toLocaleString(
          "fr-FR",
        ),

      description:
        "Documents à vérifier",

      trend:
        `${failureRate.toLocaleString(
          "fr-FR",
          {
            maximumFractionDigits:
              1,
          },
        )} % du total`,

      icon:
        CircleAlert,

      tone:
        "red",

      documentStatusFilter:
        "FAILED",
    },
  ];
}