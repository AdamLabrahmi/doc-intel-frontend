import type {
  LucideIcon,
} from "lucide-react";

export type DashboardStatTone =
  | "blue"
  | "emerald"
  | "amber"
  | "red";

export type DashboardDocumentStatusFilter =
  | "ALL"
  | "COMPLETED"
  | "ACTIVE"
  | "FAILED";

export interface DashboardStat {
  title: string;

  value: string;

  description: string;

  trend: string;

  icon: LucideIcon;

  tone: DashboardStatTone;

  documentStatusFilter:
    DashboardDocumentStatusFilter;
}

export interface DashboardSummaryDto {
  totalDocuments: number;

  completedDocuments: number;

  pendingDocuments: number;

  failedDocuments: number;
}

export interface DashboardProcessingEvolutionDto {
  date: string;

  importedDocuments: number;

  completedDocuments: number;
}

export type DashboardExtractionMethod =
  | "TIKA"
  | "TESSERACT";

export interface DashboardExtractionDistributionDto {
  extractionMethod:
    DashboardExtractionMethod;

  count: number;
}

export interface DashboardAnalyticsDto {
  processingEvolution:
    DashboardProcessingEvolutionDto[];

  extractionDistribution:
    DashboardExtractionDistributionDto[];
}