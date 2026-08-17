import type { LucideIcon } from "lucide-react";

export type DashboardStatTone =
  | "blue"
  | "emerald"
  | "amber"
  | "red";

export interface DashboardStat {
  title: string;
  value: string;
  description: string;
  trend: string;
  icon: LucideIcon;
  tone: DashboardStatTone;
}

export interface DashboardSummaryDto {
  totalDocuments: number;
  completedDocuments: number;
  pendingDocuments: number;
  failedDocuments: number;
}