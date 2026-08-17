import { motion, useReducedMotion } from "framer-motion";

import type {
  DashboardStat,
  DashboardStatTone,
} from "@/features/dashboard/types/dashboard.types";


import { cn } from "@/lib/utils";

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
    icon: "bg-blue-50 text-blue-600",
    trend: "text-blue-600",
  },
  emerald: {
    icon: "bg-emerald-50 text-emerald-600",
    trend: "text-emerald-600",
  },
  amber: {
    icon: "bg-amber-50 text-amber-600",
    trend: "text-amber-600",
  },
  red: {
    icon: "bg-red-50 text-red-600",
    trend: "text-red-600",
  },
};

export function DashboardStatCard({
  stat,
  index,
}: DashboardStatCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const Icon = stat.icon;
  const tone = toneClasses[stat.tone];

  return (
    <motion.article
      initial={
        shouldReduceMotion
          ? false
          : {
              opacity: 0,
              y: 20,
            }
      }
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay: shouldReduceMotion ? 0 : index * 0.08,
        duration: shouldReduceMotion ? 0 : 0.55,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={
        shouldReduceMotion
          ? undefined
          : {
              y: -4,
            }
      }
      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-slate-950/5"
    >
      <div className="flex items-start justify-between gap-4">
        <span
          className={cn(
            "flex size-12 items-center justify-center rounded-2xl",
            tone.icon,
          )}
        >
          <Icon
            className="size-5"
            aria-hidden="true"
          />
        </span>

        <span className={cn("text-xs font-bold", tone.trend)}>
          {stat.trend}
        </span>
      </div>

      <p className="mt-5 text-sm font-semibold text-slate-500">
        {stat.title}
      </p>

      <p className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
        {stat.value}
      </p>

      <p className="mt-2 text-xs text-slate-500">
        {stat.description}
      </p>
    </motion.article>
  );
}