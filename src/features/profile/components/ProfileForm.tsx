import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, useReducedMotion } from "framer-motion";
import { useForm } from "react-hook-form";
import {
  CheckCircle2,
  Loader2,
  Mail,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import type { UserProfile } from "@/features/profile/data/profile.mock";
import {
  profileSchema,
  type ProfileFormValues,
} from "@/features/profile/schemas/profileSchema";

interface ProfileFormProps {
  profile: UserProfile;
}

export function ProfileForm({
  profile,
}: ProfileFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const shouldReduceMotion = useReducedMotion();

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isDirty,
    },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: profile.fullName,
      email: profile.email,
    },
    mode: "onTouched",
  });

  const onSubmit = async (values: ProfileFormValues) => {
    setIsSaving(true);
    setIsSaved(false);

    try {
      await new Promise((resolve) => {
        window.setTimeout(resolve, 900);
      });

      const updateProfilePayload = {
        full_name: values.fullName,
        email: values.email,
      };

      console.log(
        "Mise à jour statique du profil :",
        updateProfilePayload,
      );

      setIsSaved(true);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-6 py-5">
        <h2 className="text-lg font-bold text-slate-950">
          Informations personnelles
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Modifiez les informations principales associées à votre compte.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 p-6"
        noValidate
      >
        {isSaved && (
          <motion.div
            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    y: -8,
                  }
            }
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4"
            role="status"
          >
            <CheckCircle2
              className="mt-0.5 size-5 shrink-0 text-emerald-600"
              aria-hidden="true"
            />

            <div>
              <p className="text-sm font-bold text-emerald-800">
                Profil mis à jour
              </p>

              <p className="mt-1 text-xs leading-5 text-emerald-700">
                La simulation de sauvegarde a été effectuée avec succès.
              </p>
            </div>
          </motion.div>
        )}

        <div className="space-y-2">
          <label
            htmlFor="profile-full-name"
            className="text-sm font-semibold text-slate-800"
          >
            Nom complet
          </label>

          <div className="relative">
            <UserRound
              className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />

            <input
              id="profile-full-name"
              type="text"
              autoComplete="name"
              aria-invalid={Boolean(errors.fullName)}
              aria-describedby={
                errors.fullName
                  ? "profile-full-name-error"
                  : undefined
              }
              className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-950 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 aria-[invalid=true]:border-red-400 aria-[invalid=true]:focus:ring-red-500/10"
              {...register("fullName")}
            />
          </div>

          {errors.fullName && (
            <p
              id="profile-full-name-error"
              className="text-sm font-medium text-red-600"
              role="alert"
            >
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="profile-email"
            className="text-sm font-semibold text-slate-800"
          >
            Adresse e-mail
          </label>

          <div className="relative">
            <Mail
              className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />

            <input
              id="profile-email"
              type="email"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={
                errors.email
                  ? "profile-email-error"
                  : "profile-email-help"
              }
              className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-950 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 aria-[invalid=true]:border-red-400 aria-[invalid=true]:focus:ring-red-500/10"
              {...register("email")}
            />
          </div>

          {errors.email ? (
            <p
              id="profile-email-error"
              className="text-sm font-medium text-red-600"
              role="alert"
            >
              {errors.email.message}
            </p>
          ) : (
            <p
              id="profile-email-help"
              className="text-xs leading-5 text-slate-500"
            >
              Cette adresse sera utilisée pour l’identification et les futures
              notifications.
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
              <ShieldCheck
                className="size-5"
                aria-hidden="true"
              />
            </span>

            <div>
              <p className="text-sm font-bold text-slate-950">
                Sécurité du compte
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-600">
                La gestion du mot de passe et des sessions sera confiée à
                Keycloak lors de son intégration.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-100 pt-6">
          <Button
            type="submit"
            disabled={isSaving || !isDirty}
            className="h-11 rounded-xl bg-blue-600 px-6 font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2
                  className="size-4 animate-spin"
                  aria-hidden="true"
                />

                Enregistrement...
              </>
            ) : (
              <>
                <Save
                  className="size-4"
                  aria-hidden="true"
                />

                Enregistrer les modifications
              </>
            )}
          </Button>
        </div>
      </form>
    </section>
  );
}