import {
  CalendarDays,
  CheckCircle2,
  FileText,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import type {
  AuthenticatedUserDto,
} from "@/features/auth/types/authenticated-user.types";

interface ProfileOverviewProps {
  profile: AuthenticatedUserDto;
  documentsCount: number;
  completedDocumentsCount: number;
}

function formatDate(
  value: string,
): string {
  const date =
    new Date(
      value,
    );

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "Date inconnue";
  }

  return new Intl.DateTimeFormat(
    "fr-FR",
    {
      dateStyle:
        "medium",

      timeStyle:
        "short",
    },
  ).format(
    date,
  );
}

function resolveRoleLabel(
  role: AuthenticatedUserDto["role"],
): string {
  if (
    role ===
    "ADMIN"
  ) {
    return "Administrateur";
  }

  return "Utilisateur";
}

function resolveInitials(
  fullName: string,
): string {
  const parts =
    fullName
      .trim()
      .split(
        /\s+/,
      )
      .filter(
        Boolean,
      );

  if (
    parts.length ===
    0
  ) {
    return "U";
  }

  if (
    parts.length ===
    1
  ) {
    return parts[0]
      .slice(
        0,
        2,
      )
      .toUpperCase();
  }

  return (
    parts[0].charAt(
      0,
    ) +
    parts[
      parts.length -
        1
    ].charAt(
      0,
    )
  ).toUpperCase();
}

export function ProfileOverview({
  profile,
  documentsCount,
  completedDocumentsCount,
}: ProfileOverviewProps) {
  const initials =
    resolveInitials(
      profile.fullName,
    );

  const roleLabel =
    resolveRoleLabel(
      profile.role,
    );

  return (
    <aside className="space-y-6">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
        <div className="h-24 bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500" />

        <div className="px-6 pb-6">
          <div className="-mt-12 flex size-24 items-center justify-center rounded-3xl border-4 border-white bg-gradient-to-br from-blue-600 to-blue-700 text-2xl font-bold text-white shadow-xl shadow-blue-600/20 dark:border-slate-900">
            {
              initials
            }
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-950 dark:text-white">
            {
              profile.fullName
            }
          </h2>

          <p className="mt-1 break-all text-sm text-slate-500 dark:text-slate-400">
            {
              profile.email
            }
          </p>

          <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
            <ShieldCheck
              className="size-3.5"
              aria-hidden="true"
            />

            {
              roleLabel
            }
          </span>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
        <h2 className="font-bold text-slate-950 dark:text-white">
          Informations du compte
        </h2>

        <div className="mt-5 space-y-4">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              <CalendarDays
                className="size-4"
                aria-hidden="true"
              />
            </span>

            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Compte créé le
              </p>

              <p className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-200">
                {formatDate(
                  profile.createdAt,
                )}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
              <RefreshCw
                className="size-4"
                aria-hidden="true"
              />
            </span>

            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Dernière mise à jour
              </p>

              <p className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-200">
                {formatDate(
                  profile.updatedAt,
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4">
        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
          <span className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
            <FileText
              className="size-4"
              aria-hidden="true"
            />
          </span>

          <p className="mt-4 text-2xl font-bold text-slate-950 dark:text-white">
            {
              documentsCount
            }
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
            Documents importés
          </p>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
          <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
            <CheckCircle2
              className="size-4"
              aria-hidden="true"
            />
          </span>

          <p className="mt-4 text-2xl font-bold text-slate-950 dark:text-white">
            {
              completedDocumentsCount
            }
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
            Traitements terminés
          </p>
        </article>
      </section>
    </aside>
  );
}