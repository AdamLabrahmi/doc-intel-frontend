import {
  useEffect,
  useState,
} from "react";

import {
  LoaderCircle,
  Mail,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import {
  useUpdateProfileMutation,
} from "@/features/profile/hooks/useUpdateProfileMutation";

import type {
  AuthenticatedUserDto,
} from "@/features/auth/types/authenticated-user.types";

interface ProfileFormProps {
  profile: AuthenticatedUserDto;
}

interface ProfileFormState {
  firstName: string;
  lastName: string;
  email: string;
}

function resolveRoleLabel(
  role: AuthenticatedUserDto["role"],
): string {
  if (role === "ADMIN") {
    return "Administrateur";
  }

  return "Utilisateur";
}

export function ProfileForm({
  profile,
}: ProfileFormProps) {
  const [
    form,
    setForm,
  ] = useState<ProfileFormState>({
    firstName:
      profile.firstName,

    lastName:
      profile.lastName,

    email:
      profile.email,
  });

  const [
    successMessage,
    setSuccessMessage,
  ] = useState<string | null>(
    null,
  );

  const updateProfileMutation =
    useUpdateProfileMutation();

  useEffect(() => {
    setForm({
      firstName:
        profile.firstName,

      lastName:
        profile.lastName,

      email:
        profile.email,
    });
  }, [
    profile.firstName,
    profile.lastName,
    profile.email,
  ]);

  const roleLabel =
    resolveRoleLabel(
      profile.role,
    );

  const hasChanges =
    form.firstName.trim() !==
      profile.firstName ||
    form.lastName.trim() !==
      profile.lastName ||
    form.email.trim().toLowerCase() !==
      profile.email.toLowerCase();

  const handleChange = (
    field: keyof ProfileFormState,
    value: string,
  ) => {
    setSuccessMessage(
      null,
    );

    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!hasChanges) {
      return;
    }

    try {
      await updateProfileMutation.mutateAsync({
        firstName:
          form.firstName.trim(),

        lastName:
          form.lastName.trim(),

        email:
          form.email
            .trim()
            .toLowerCase(),
      });

      setSuccessMessage(
        "Vos informations ont été mises à jour avec succès.",
      );
    } catch {
      /*
       * L'erreur est affichée
       * dans le formulaire.
       */
    }
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-6 py-5">
        <h2 className="text-lg font-bold text-slate-950">
          Informations personnelles
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Modifiez les informations associées à votre compte.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 p-6"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="profile-first-name"
              className="text-sm font-semibold text-slate-800"
            >
              Prénom
            </label>

            <div className="relative">
              <UserRound
                className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />

              <input
                id="profile-first-name"
                type="text"
                value={
                  form.firstName
                }
                onChange={(event) => {
                  handleChange(
                    "firstName",
                    event.target.value,
                  );
                }}
                required
                className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="profile-last-name"
              className="text-sm font-semibold text-slate-800"
            >
              Nom
            </label>

            <div className="relative">
              <UserRound
                className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />

              <input
                id="profile-last-name"
                type="text"
                value={
                  form.lastName
                }
                onChange={(event) => {
                  handleChange(
                    "lastName",
                    event.target.value,
                  );
                }}
                required
                className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
          </div>
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
              value={
                form.email
              }
              onChange={(event) => {
                handleChange(
                  "email",
                  event.target.value,
                );
              }}
              required
              className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          <p className="text-xs leading-5 text-slate-500">
            Cette adresse sera mise à jour dans Keycloak ainsi que dans votre profil local.
          </p>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="profile-role"
            className="text-sm font-semibold text-slate-800"
          >
            Rôle
          </label>

          <div className="relative">
            <ShieldCheck
              className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />

            <input
              id="profile-role"
              type="text"
              value={
                roleLabel
              }
              readOnly
              className="h-12 w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-semibold text-slate-600 outline-none"
            />
          </div>

          <p className="text-xs leading-5 text-slate-500">
            Votre rôle ne peut être modifié que par un administrateur.
          </p>
        </div>

        {successMessage ? (
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
            <p className="text-sm font-semibold text-emerald-700">
              {successMessage}
            </p>
          </div>
        ) : null}

        {updateProfileMutation.isError ? (
          <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3">
            <p className="text-sm font-semibold text-red-700">
              Impossible de mettre à jour votre profil.
            </p>

            <p className="mt-1 text-xs leading-5 text-red-600">
              Vérifiez les informations saisies et assurez-vous que l'adresse e-mail n'est pas déjà utilisée.
            </p>
          </div>
        ) : null}

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
                Identité sécurisée par Keycloak
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-600">
                Vos informations d'identité sont mises à jour dans Keycloak puis synchronisées avec le profil local. Votre rôle reste administré séparément.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-100 pt-5">
          <button
            type="submit"
            disabled={
              updateProfileMutation.isPending ||
              !hasChanges
            }
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {updateProfileMutation.isPending ? (
              <>
                <LoaderCircle
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
          </button>
        </div>
      </form>
    </section>
  );
}