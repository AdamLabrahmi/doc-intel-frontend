import { motion, useReducedMotion } from "framer-motion";
import { UserRound } from "lucide-react";

import { ProfileForm } from "@/features/profile/components/ProfileForm";
import { ProfileOverview } from "@/features/profile/components/ProfileOverview";
import { currentUserProfile } from "@/features/profile/data/profile.mock";
import { DashboardLayout } from "@/layouts/DashboardLayout";

export default function Profile() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <DashboardLayout>
      <motion.div
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
          duration: shouldReduceMotion ? 0 : 0.6,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="mx-auto w-full max-w-[1400px] space-y-6"
      >
        <section className="flex flex-col gap-4 rounded-3xl border border-blue-100 bg-gradient-to-br from-white via-blue-50/60 to-cyan-50/50 p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
              <UserRound
                className="size-3.5"
                aria-hidden="true"
              />

              Mon espace personnel
            </span>

            <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Profil utilisateur
            </h1>

            <p className="mt-2 max-w-2xl leading-7 text-slate-600">
              Consultez les informations associées à votre compte et mettez à
              jour votre identité utilisateur.
            </p>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
          <ProfileOverview profile={currentUserProfile} />

          <ProfileForm profile={currentUserProfile} />
        </div>
      </motion.div>
    </DashboardLayout>
  );
}