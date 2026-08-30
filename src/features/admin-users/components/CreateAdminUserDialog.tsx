import {
  useEffect,
  useState,
} from "react";

import {
  LoaderCircle,
  UserPlus,
  X,
} from "lucide-react";

import {
  useCreateAdminUserMutation,
} from "@/features/admin-users/hooks/useCreateAdminUserMutation";

import type {
  AdminUserRole,
} from "@/features/admin-users/types/admin-user.types";

interface CreateAdminUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormState {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: AdminUserRole;
}

const initialFormState: FormState = {
  username: "",
  email: "",
  firstName: "",
  lastName: "",
  password: "",
  role: "USER",
};

export function CreateAdminUserDialog({
  isOpen,
  onClose,
}: CreateAdminUserDialogProps) {
  const [
    form,
    setForm,
  ] = useState<FormState>(
    initialFormState,
  );

  const createUserMutation =
    useCreateAdminUserMutation();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setForm(
      initialFormState,
    );

    createUserMutation.reset();
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (
    field: keyof FormState,
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    try {
      await createUserMutation.mutateAsync({
        username:
          form.username.trim(),

        email:
          form.email
            .trim()
            .toLowerCase(),

        firstName:
          form.firstName.trim(),

        lastName:
          form.lastName.trim(),

        password:
          form.password,

        role:
          form.role,
      });

      onClose();
    } catch {
      /*
       * L'erreur est affichée
       * directement dans le formulaire.
       */
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm"
        aria-label="Fermer la fenêtre de création"
      />

      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/20">
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5 sm:px-7">
          <div className="flex gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <UserPlus
                className="size-5"
                aria-hidden="true"
              />
            </span>

            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-600">
                Administration
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-950">
                Créer un utilisateur
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Créez un compte IntelliSearch et attribuez-lui un rôle.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex size-10 shrink-0 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="Fermer"
          >
            <X
              className="size-5"
              aria-hidden="true"
            />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 px-6 py-6 sm:px-7"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="admin-user-first-name"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Prénom
              </label>

              <input
                id="admin-user-first-name"
                type="text"
                value={form.firstName}
                onChange={(event) =>
                  handleChange(
                    "firstName",
                    event.target.value,
                  )
                }
                required
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                placeholder="Ex. Adam"
              />
            </div>

            <div>
              <label
                htmlFor="admin-user-last-name"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Nom
              </label>

              <input
                id="admin-user-last-name"
                type="text"
                value={form.lastName}
                onChange={(event) =>
                  handleChange(
                    "lastName",
                    event.target.value,
                  )
                }
                required
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                placeholder="Ex. Labrahmi"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="admin-user-username"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Nom d'utilisateur
            </label>

            <input
              id="admin-user-username"
              type="text"
              value={form.username}
              onChange={(event) =>
                handleChange(
                  "username",
                  event.target.value,
                )
              }
              required
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              placeholder="Ex. adam.labrahmi"
            />
          </div>

          <div>
            <label
              htmlFor="admin-user-email"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Adresse e-mail
            </label>

            <input
              id="admin-user-email"
              type="email"
              value={form.email}
              onChange={(event) =>
                handleChange(
                  "email",
                  event.target.value,
                )
              }
              required
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              placeholder="nom@exemple.com"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="admin-user-password"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Mot de passe
              </label>

              <input
                id="admin-user-password"
                type="password"
                value={form.password}
                onChange={(event) =>
                  handleChange(
                    "password",
                    event.target.value,
                  )
                }
                minLength={8}
                required
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                placeholder="Minimum 8 caractères"
              />
            </div>

            <div>
              <label
                htmlFor="admin-user-role"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Rôle
              </label>

              <select
                id="admin-user-role"
                value={form.role}
                onChange={(event) =>
                  handleChange(
                    "role",
                    event.target.value,
                  )
                }
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              >
                <option value="USER">
                  Utilisateur
                </option>

                <option value="ADMIN">
                  Administrateur
                </option>
              </select>
            </div>
          </div>

          {createUserMutation.isError ? (
            <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3">
              <p className="text-sm font-semibold text-red-700">
                Impossible de créer l'utilisateur.
              </p>

              <p className="mt-1 text-xs leading-5 text-red-600">
                Vérifiez que le nom d'utilisateur et l'adresse e-mail ne sont pas déjà utilisés.
              </p>
            </div>
          ) : null}

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={
                createUserMutation.isPending
              }
              className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={
                createUserMutation.isPending
              }
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {createUserMutation.isPending ? (
                <>
                  <LoaderCircle
                    className="size-4 animate-spin"
                    aria-hidden="true"
                  />

                  Création...
                </>
              ) : (
                <>
                  <UserPlus
                    className="size-4"
                    aria-hidden="true"
                  />

                  Créer l'utilisateur
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}