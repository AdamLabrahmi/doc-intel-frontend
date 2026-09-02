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
  username:
    "",

  email:
    "",

  firstName:
    "",

  lastName:
    "",

  password:
    "",

  role:
    "USER",
};

const inputClassName =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-500";

const labelClassName =
  "mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300";

export function CreateAdminUserDialog({
  isOpen,
  onClose,
}: CreateAdminUserDialogProps) {
  const [
    form,
    setForm,
  ] =
    useState<FormState>(
      initialFormState,
    );

  const createUserMutation =
    useCreateAdminUserMutation();

  useEffect(
    () => {
      if (!isOpen) {
        return;
      }

      setForm(
        initialFormState,
      );

      createUserMutation.reset();
    },
    [isOpen],
  );

  if (!isOpen) {
    return null;
  }

  const handleChange = (
    field:
      keyof FormState,
    value:
      string,
  ) => {
    setForm(
      (
        current,
      ) => ({
        ...current,

        [field]:
          value,
      }),
    );
  };

  const handleSubmit =
    async (
      event:
        React.FormEvent<HTMLFormElement>,
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
        onClick={
          onClose
        }
        disabled={
          createUserMutation.isPending
        }
        className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm dark:bg-black/65"
        aria-label="Fermer la fenêtre de création"
      />

      <div className="relative z-10 max-h-[calc(100vh-3rem)] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/20 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/40">
        {/* Header */}

        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5 dark:border-slate-800 sm:px-7">
          <div>
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">
              Créer un utilisateur
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Ajoutez un compte et définissez son rôle.
            </p>
          </div>

          <button
            type="button"
            onClick={
              onClose
            }
            disabled={
              createUserMutation.isPending
            }
            className="flex size-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="Fermer"
          >
            <X
              className="size-5"
              aria-hidden="true"
            />
          </button>
        </div>

        {/* Form */}

        <form
          onSubmit={
            handleSubmit
          }
          className="space-y-5 px-6 py-6 sm:px-7"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="admin-user-first-name"
                className={
                  labelClassName
                }
              >
                Prénom
              </label>

              <input
                id="admin-user-first-name"
                type="text"
                value={
                  form.firstName
                }
                onChange={(
                  event,
                ) =>
                  handleChange(
                    "firstName",
                    event.target.value,
                  )
                }
                required
                className={
                  inputClassName
                }
                placeholder="Ex. Adam"
              />
            </div>

            <div>
              <label
                htmlFor="admin-user-last-name"
                className={
                  labelClassName
                }
              >
                Nom
              </label>

              <input
                id="admin-user-last-name"
                type="text"
                value={
                  form.lastName
                }
                onChange={(
                  event,
                ) =>
                  handleChange(
                    "lastName",
                    event.target.value,
                  )
                }
                required
                className={
                  inputClassName
                }
                placeholder="Ex. Labrahmi"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="admin-user-username"
              className={
                labelClassName
              }
            >
              Nom d’utilisateur
            </label>

            <input
              id="admin-user-username"
              type="text"
              value={
                form.username
              }
              onChange={(
                event,
              ) =>
                handleChange(
                  "username",
                  event.target.value,
                )
              }
              required
              className={
                inputClassName
              }
              placeholder="Ex. adam.labrahmi"
            />
          </div>

          <div>
            <label
              htmlFor="admin-user-email"
              className={
                labelClassName
              }
            >
              Adresse e-mail
            </label>

            <input
              id="admin-user-email"
              type="email"
              value={
                form.email
              }
              onChange={(
                event,
              ) =>
                handleChange(
                  "email",
                  event.target.value,
                )
              }
              required
              className={
                inputClassName
              }
              placeholder="nom@exemple.com"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="admin-user-password"
                className={
                  labelClassName
                }
              >
                Mot de passe
              </label>

              <input
                id="admin-user-password"
                type="password"
                value={
                  form.password
                }
                onChange={(
                  event,
                ) =>
                  handleChange(
                    "password",
                    event.target.value,
                  )
                }
                minLength={
                  8
                }
                required
                className={
                  inputClassName
                }
                placeholder="Minimum 8 caractères"
              />
            </div>

            <div>
              <label
                htmlFor="admin-user-role"
                className={
                  labelClassName
                }
              >
                Rôle
              </label>

              <select
                id="admin-user-role"
                value={
                  form.role
                }
                onChange={(
                  event,
                ) =>
                  handleChange(
                    "role",
                    event.target.value,
                  )
                }
                className={`${inputClassName} font-medium`}
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

          {/* Erreur */}

          {createUserMutation.isError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 dark:border-red-900/50 dark:bg-red-950/30">
              <p className="text-sm font-semibold text-red-700 dark:text-red-300">
                Impossible de créer l’utilisateur.
              </p>

              <p className="mt-1 text-xs leading-5 text-red-600 dark:text-red-400">
                Vérifiez que le nom d’utilisateur et l’adresse e-mail ne sont pas déjà utilisés.
              </p>
            </div>
          ) : null}

          {/* Actions */}

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 dark:border-slate-800 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={
                onClose
              }
              disabled={
                createUserMutation.isPending
              }
              className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={
                createUserMutation.isPending
              }
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-bold text-white shadow-sm shadow-blue-600/20 transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
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

                  Créer
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}