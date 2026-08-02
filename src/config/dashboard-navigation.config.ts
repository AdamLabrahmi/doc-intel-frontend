import type { LucideIcon } from "lucide-react";
import { ROUTES } from "@/routes/routePaths";

import {
  Activity,
  Files,
  LayoutDashboard,
  Settings,
  UploadCloud,
} from "lucide-react";

export interface DashboardNavigationItem {
  label: string;
  path: string;
  icon: LucideIcon;
  end?: boolean;
}

export const dashboardNavigationItems: readonly DashboardNavigationItem[] = [
  {
    label: "Vue d’ensemble",
    path: ROUTES.dashboard,
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: "Documents",
    path: ROUTES.documents,
    icon: Files,
  },
  {
    label: "Importer",
    path: ROUTES.documentUpload,
    icon: UploadCloud,
  },
  {
    label: "Activité",
    path: "/dashboard/activity",
    icon: Activity,
  },
  {
    label: "Paramètres",
    path: "/dashboard/settings",
    icon: Settings,
  },
] as const;