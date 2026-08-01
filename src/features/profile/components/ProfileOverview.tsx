import {
  CalendarDays,
  CheckCircle2,
  FileText,
  ShieldCheck,
} from "lucide-react";

import type { UserProfile } from "@/features/profile/data/profile.mock";

interface ProfileOverviewProps {
  profile: UserProfile;
}

export function ProfileOverview({
  profile,
}: ProfileOverviewProps) {
  return (
    <aside className="space-y-6">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="h-24 bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500" />

        <div className="px-6 pb-6">
          <div className="-mt-12 flex size-24 items-center justify-center rounded-3xl border-4 border-white bg-gradient-to-br from-blue-600 to-blue-700 text-2xl font-bold text-white shadow-xl shadow-blue-600/20">
            {profile.initials}
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-950">
            {profile.fullName}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {profile.email}
          </p>

          <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
            <ShieldCheck
              className="size-3.5"
              aria-hidden="true"
            />

            {profile.role}
          </span>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-bold text-slate-950">
          Informations du compte
        </h2>

        <div className="mt-5 space-y-4">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <CalendarDays
                className="size-4"
                aria-hidden="true"
              />
            </span>

            <div>
              <p className="text-xs text-slate-500">
                Compte créé le
              </p>

              <p className="mt-1 text-sm font-bold text-slate-900">
                {profile.createdAt}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2
                className="size-4"
                aria-hidden="true"
              />
            </span>

            <div>
              <p className="text-xs text-slate-500">
                Dernière connexion
              </p>

              <p className="mt-1 text-sm font-bold text-slate-900">
                {profile.lastLoginAt}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4">
        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <FileText
              className="size-4"
              aria-hidden="true"
            />
          </span>

          <p className="mt-4 text-2xl font-bold text-slate-950">
            {profile.documentsCount}
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Documents importés
          </p>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <CheckCircle2
              className="size-4"
              aria-hidden="true"
            />
          </span>

          <p className="mt-4 text-2xl font-bold text-slate-950">
            {profile.completedDocumentsCount}
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Traitements terminés
          </p>
        </article>
      </section>
    </aside>
  );
}