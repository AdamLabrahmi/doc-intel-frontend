import {
  motion,
  useReducedMotion,
} from "framer-motion";

import {
  Link,
} from "react-router-dom";

import type {
  DashboardStat,
  DashboardStatTone,
} from "@/features/dashboard/types/dashboard.types";

import {
  cn,
} from "@/lib/utils";

import {
  ROUTES,
} from "@/routes/routePaths";

interface DashboardStatCardProps {
  stat: DashboardStat;
  index: number;
}

const toneClasses: Record<
  DashboardStatTone,
  {
    icon: string;
    trend: string;
  }
> = {
  blue: {
    icon:
      "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",

    trend:
      "text-blue-600 dark:text-blue-400",
  },

  emerald: {
    icon:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",

    trend:
      "text-emerald-600 dark:text-emerald-400",
  },

  amber: {
    icon:
      "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",

    trend:
      "text-amber-600 dark:text-amber-400",
  },

  red: {
    icon:
      "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",

    trend:
      "text-red-600 dark:text-red-400",
  },
};

function resolveStatTarget(
  stat: DashboardStat,
): string {
  if (
    stat.documentStatusFilter ===
    "ALL"
  ) {
    return ROUTES.documents;
  }

  return `${ROUTES.documents}?status=${stat.documentStatusFilter}`;
}

export function DashboardStatCard({
  stat,
  index,
}: DashboardStatCardProps) {
  const shouldReduceMotion =
    useReducedMotion();

  const Icon =
    stat.icon;

  const tone =
    toneClasses[
      stat.tone
    ];

  const target =
    resolveStatTarget(
      stat,
    );

  return (
    <Link
      to={
        target
      }
      className="block rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
      aria-label={`${stat.title} : ${stat.value}. Voir les documents correspondants.`}
    >
      <motion.article
        initial={
          shouldReduceMotion
            ? false
            : {
                opacity:
                  0,

                y:
                  20,
              }
        }
        animate={{
          opacity:
            1,

          y:
            0,
        }}
        transition={{
          delay:
            shouldReduceMotion
              ? 0
              : index *
                0.08,

          duration:
            shouldReduceMotion
              ? 0
              : 0.55,

          ease: [
            0.22,
            1,
            0.36,
            1,
          ],
        }}
        whileHover={
          shouldReduceMotion
            ? undefined
            : {
                y:
                  -4,
              }
        }
        className="group h-full cursor-pointer rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-950/5 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-500/30 dark:hover:shadow-black/10"
      >
        <div className="flex items-start justify-between gap-4">
          <span
            className={cn(
              "flex size-12 items-center justify-center rounded-2xl transition-transform duration-200 group-hover:scale-105",
              tone.icon,
            )}
          >
            <Icon
              className="size-5"
              aria-hidden="true"
            />
          </span>

          <span
            className={cn(
              "text-xs font-bold",
              tone.trend,
            )}
          >
            {
              stat.trend
            }
          </span>
        </div>

        <p className="mt-5 text-sm font-semibold text-slate-500 dark:text-slate-400">
          {
            stat.title
          }
        </p>

        <p className="mt-1 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
          {
            stat.value
          }
        </p>

        <div className="mt-2 flex items-center justify-between gap-3">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {
              stat.description
            }
          </p>

          <span className="text-xs font-bold text-blue-600 opacity-0 transition-opacity group-hover:opacity-100 dark:text-blue-400">
            Voir →
          </span>
        </div>
      </motion.article>
    </Link>
  );
}