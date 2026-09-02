import {
  CheckCircle2,
  CircleAlert,
  Clock3,
  LoaderCircle,
} from "lucide-react";

import type {
  DocumentStatus,
} from "@/features/documents/types/document.types";

import {
  cn,
} from "@/lib/utils";

interface DocumentStatusBadgeProps {
  status: DocumentStatus;
}

const statusConfiguration = {
  COMPLETED: {
    label:
      "Terminé",

    icon:
      CheckCircle2,

    className:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  },

  PROCESSING: {
    label:
      "En cours",

    icon:
      LoaderCircle,

    className:
      "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  },

  PENDING: {
    label:
      "En attente",

    icon:
      Clock3,

    className:
      "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  },

  FAILED: {
    label:
      "Échec",

    icon:
      CircleAlert,

    className:
      "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
  },
} as const;

export function DocumentStatusBadge({
  status,
}: DocumentStatusBadgeProps) {
  const configuration =
    statusConfiguration[
      status
    ];

  const Icon =
    configuration.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold",
        configuration.className,
      )}
    >
      <Icon
        className={cn(
          "size-3.5",
          status ===
            "PROCESSING" &&
            "animate-spin",
        )}
        aria-hidden="true"
      />

      {
        configuration.label
      }
    </span>
  );
}