import type {
  LucideIcon,
} from "lucide-react";

import {
  Activity,
  Files,
  Gauge,
  LayoutDashboard,
  MessageSquareText,
  Settings,
  UploadCloud,
} from "lucide-react";

import type {
  AuthenticatedUserRole,
} from "@/features/auth/types/authenticated-user.types";

import {
  ROUTES,
} from "@/routes/routePaths";

export interface DashboardNavigationItem {
  label: string;
  path: string;
  icon: LucideIcon;
  end?: boolean;

 
  roles: readonly AuthenticatedUserRole[];
}

export const dashboardNavigationItems:
  readonly DashboardNavigationItem[] = [
    {
      label: "Vue d’ensemble",
      path: ROUTES.dashboard,
      icon: LayoutDashboard,
      end: true,
      roles: [
        "USER",
        "ADMIN",
      ],
    },

    {
      label: "Documents",
      path: ROUTES.documents,
      icon: Files,
      roles: [
        "USER",
        "ADMIN",
      ],
    },

    {
      label: "Conversations",
      path: ROUTES.conversations,
      icon: MessageSquareText,
      roles: [
        "USER",
        "ADMIN",
      ],
    },

    {
      label: "Importer",
      path: ROUTES.documentUpload,
      icon: UploadCloud,
      roles: [
        "USER",
        "ADMIN",
      ],
    },

    {
      label: "Évaluation extraction",
      path: ROUTES.extractionBenchmark,
      icon: Gauge,
      end: true,
      roles: [
        "ADMIN",
      ],
    },

    {
      label: "Activité",
      path: ROUTES.activity,
      icon: Activity,
      roles: [
        "ADMIN",
      ],
    },

    {
      label: "Paramètres",
      path: ROUTES.settings,
      icon: Settings,
      roles: [
        "USER",
        "ADMIN",
      ],
    },
  ] as const;