import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import {
  Eye,
  EyeOff,
  KeyRound,
  LoaderCircle,
  LockKeyhole,
  ShieldCheck,
  X,
} from "lucide-react";

import {
  useChangePasswordMutation,
} from "@/features/profile/hooks/useChangePasswordMutation";

interface ChangePasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PasswordFormState {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const initialFormState:
  PasswordFormState =
{
  currentPassword:
    "",

  newPassword:
    "",

  confirmPassword:
    "",
};

export function ChangePasswordDialog({
  isOpen,
  onClose,
}: ChangePasswordDialogProps) {
  const [
    form,
    setForm,
  ] =
    useState<PasswordFormState>(
      initialFormState,
    );

  const [
    showCurrentPassword,
    setShowCurrentPassword,
  ] =
    useState(
      false,
    );

  const [
    showNewPassword,
    setShowNewPassword,
  ] =
    useState(
      false,
    );

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] =
    useState(
      false,
    );

  const [
    validationError,
    setValidationError,
  ] =
    useState<
      string | null
    >(
      null,
    );

  const [
    successMessage,
    setSuccessMessage,
  ] =
    useState<
      string | null
    >(
      null,
    );

  const changePasswordMutation =
    useChangePasswordMutation();

  useEffect(
    () => {
      if (
        !isOpen
      ) {
        return;
      }

      setForm(
        initialFormState,
      );

      setValidationError(
        null,
      );

      setSuccessMessage(
        null,
      );

      setShowCurrentPassword(
        false,
      );

      setShowNewPassword(
        false,
      );

      setShowConfirmPassword(
        false,
      );

      changePasswordMutation.reset();
    },
    [
      isOpen,
    ],
  );

  if (
    !isOpen
  ) {
    return null;
  }

  const handleChange =
    (
      field:
        keyof PasswordFormState,

      value:
        string,
    ) => {
      setValidationError(
        null,
      );

      setSuccessMessage(
        null,
      );

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

  const validateForm =
    () => {
      if (
        !form.currentPassword.trim()
      ) {
        setValidationError(
          "Le mot de passe actuel est obligatoire.",
        );

        return false;
      }

      if (
        form.newPassword.length <
        8
      ) {
        setValidationError(
          "Le nouveau mot de passe doit contenir au moins 8 caractères.",
        );

        return false;
      }

      if (
        form.newPassword ===
        form.currentPassword
      ) {
        setValidationError(
          "Le nouveau mot de passe doit être différent du mot de passe actuel.",
        );

        return false;
      }

      if (
        form.newPassword !==
        form.confirmPassword
      ) {
        setValidationError(
          "La confirmation du mot de passe ne correspond pas.",
        );

        return false;
      }

      return true;
    };

  const handleSubmit =
    async (
      event:
        FormEvent<HTMLFormElement>,
    ) => {
      event.preventDefault();

      setValidationError(
        null,
      );

      setSuccessMessage(
        null,
      );

      if (
        !validateForm()
      ) {
        return;
      }

      try {
        await changePasswordMutation.mutateAsync(
          {
            currentPassword:
              form.currentPassword,

            newPassword:
              form.newPassword,
          },
        );

        setSuccessMessage(
          "Votre mot de passe a été modifié avec succès.",
        );

        setForm(
          initialFormState,
        );
      } catch {
        /*
         * L'erreur backend est affichée
         * via l'état de la mutation.
         */
      }
    };

  const isPending =
    changePasswordMutation.isPending;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6">
      <button
        type="button"
        onClick={
          onClose
        }
        disabled={
          isPending
        }
        className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm dark:bg-black/60"
        aria-label="Fermer la fenêtre"
      />

      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/20 transition-colors dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/40">
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5 dark:border-slate-800">
          <div className="flex gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              <KeyRound
                className="size-5"
                aria-hidden="true"
              />
            </span>

            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400">
                Sécurité
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-950 dark:text-white">
                Modifier le mot de passe
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Confirmez votre mot de passe actuel avant d'en définir un nouveau.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={
              onClose
            }
            disabled={
              isPending
            }
            className="flex size-10 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="Fermer"
          >
            <X
              className="size-5"
              aria-hidden="true"
            />
          </button>
        </div>

        <form
          onSubmit={
            handleSubmit
          }
          className="space-y-5 px-6 py-6"
        >
          <PasswordField
            id="current-password"
            label="Mot de passe actuel"
            value={
              form.currentPassword
            }
            showPassword={
              showCurrentPassword
            }
            disabled={
              isPending
            }
            autoComplete="current-password"
            onChange={(
              value,
            ) => {
              handleChange(
                "currentPassword",
                value,
              );
            }}
            onToggleVisibility={() => {
              setShowCurrentPassword(
                (
                  current,
                ) =>
                  !current,
              );
            }}
          />

          <PasswordField
            id="new-password"
            label="Nouveau mot de passe"
            value={
              form.newPassword
            }
            showPassword={
              showNewPassword
            }
            disabled={
              isPending
            }
            autoComplete="new-password"
            onChange={(
              value,
            ) => {
              handleChange(
                "newPassword",
                value,
              );
            }}
            onToggleVisibility={() => {
              setShowNewPassword(
                (
                  current,
                ) =>
                  !current,
              );
            }}
          />

          <PasswordField
            id="confirm-password"
            label="Confirmer le nouveau mot de passe"
            value={
              form.confirmPassword
            }
            showPassword={
              showConfirmPassword
            }
            disabled={
              isPending
            }
            autoComplete="new-password"
            onChange={(
              value,
            ) => {
              handleChange(
                "confirmPassword",
                value,
              );
            }}
            onToggleVisibility={() => {
              setShowConfirmPassword(
                (
                  current,
                ) =>
                  !current,
              );
            }}
          />

          <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 dark:border-blue-900/50 dark:bg-blue-500/10">
            <div className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm dark:bg-slate-950 dark:text-blue-400">
                <ShieldCheck
                  className="size-5"
                  aria-hidden="true"
                />
              </span>

              <div>
                <p className="text-sm font-bold text-slate-950 dark:text-white">
                  Sécurité Keycloak
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-400">
                  Votre mot de passe actuel est vérifié avant toute modification. Aucun mot de passe n'est stocké dans IntelliSearch.
                </p>
              </div>
            </div>
          </div>

          {validationError ? (
            <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 dark:border-red-900/50 dark:bg-red-950/30">
              <p className="text-sm font-semibold text-red-700 dark:text-red-400">
                {
                  validationError
                }
              </p>
            </div>
          ) : null}

          {changePasswordMutation.isError ? (
            <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 dark:border-red-900/50 dark:bg-red-950/30">
              <p className="text-sm font-semibold text-red-700 dark:text-red-400">
                Impossible de modifier le mot de passe.
              </p>

              <p className="mt-1 text-xs leading-5 text-red-600 dark:text-red-400">
                Vérifiez notamment que le mot de passe actuel est correct.
              </p>
            </div>
          ) : null}

          {successMessage ? (
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 dark:border-emerald-900/50 dark:bg-emerald-500/10">
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                {
                  successMessage
                }
              </p>
            </div>
          ) : null}

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 dark:border-slate-800 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={
                onClose
              }
              disabled={
                isPending
              }
              className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={
                isPending
              }
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
            >
              {isPending ? (
                <>
                  <LoaderCircle
                    className="size-4 animate-spin"
                    aria-hidden="true"
                  />

                  Modification...
                </>
              ) : (
                <>
                  <LockKeyhole
                    className="size-4"
                    aria-hidden="true"
                  />

                  Modifier le mot de passe
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  showPassword: boolean;
  disabled: boolean;

  autoComplete:
    | "current-password"
    | "new-password";

  onChange: (
    value: string,
  ) => void;

  onToggleVisibility:
    () => void;
}

function PasswordField({
  id,
  label,
  value,
  showPassword,
  disabled,
  autoComplete,
  onChange,
  onToggleVisibility,
}: PasswordFieldProps) {
  return (
    <div>
      <label
        htmlFor={
          id
        }
        className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200"
      >
        {
          label
        }
      </label>

      <div className="relative">
        <LockKeyhole
          className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
          aria-hidden="true"
        />

        <input
          id={
            id
          }
          type={
            showPassword
              ? "text"
              : "password"
          }
          value={
            value
          }
          onChange={(
            event,
          ) => {
            onChange(
              event.target.value,
            );
          }}
          disabled={
            disabled
          }
          autoComplete={
            autoComplete
          }
          minLength={
            autoComplete ===
            "new-password"
              ? 8
              : undefined
          }
          required
          className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-12 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-blue-500 dark:focus:ring-blue-500/10"
        />

        <button
          type="button"
          onClick={
            onToggleVisibility
          }
          disabled={
            disabled
          }
          className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:pointer-events-none dark:text-slate-500 dark:hover:bg-slate-700 dark:hover:text-slate-200"
          aria-label={
            showPassword
              ? "Masquer le mot de passe"
              : "Afficher le mot de passe"
          }
        >
          {showPassword ? (
            <EyeOff
              className="size-4"
              aria-hidden="true"
            />
          ) : (
            <Eye
              className="size-4"
              aria-hidden="true"
            />
          )}
        </button>
      </div>
    </div>
  );
}