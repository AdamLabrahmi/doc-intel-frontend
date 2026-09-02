import {
  useEffect,
  useState,
} from "react";

import {
  LoaderCircle,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";

import {
  useChangeAdminUserRoleMutation,
} from "@/features/admin-users/hooks/useChangeAdminUserRoleMutation";

import type {
  AdminUser,
  AdminUserRole,
} from "@/features/admin-users/types/admin-user.types";

interface ChangeAdminUserRoleDialogProps {
  user: AdminUser | null;
  onClose: () => void;
}

export function ChangeAdminUserRoleDialog({
  user,
  onClose,
}: ChangeAdminUserRoleDialogProps) {
  const [
    selectedRole,
    setSelectedRole,
  ] =
    useState<AdminUserRole>(
      "USER",
    );

  const changeRoleMutation =
    useChangeAdminUserRoleMutation();

  useEffect(
    () => {
      if (!user) {
        return;
      }

      setSelectedRole(
        user.role,
      );

      changeRoleMutation.reset();
    },
    [user],
  );

  if (!user) {
    return null;
  }

  const roleHasChanged =
    selectedRole !==
    user.role;

  const handleSubmit =
    async () => {
      if (!roleHasChanged) {
        return;
      }

      try {
        await changeRoleMutation.mutateAsync({
          keycloakId:
            user.keycloakId,

          role:
            selectedRole,
        });

        onClose();
      } catch {
        /*
         * L'erreur est affichée
         * directement dans le dialog.
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
          changeRoleMutation.isPending
        }
        className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm dark:bg-black/65"
        aria-label="Fermer la fenêtre"
      />

      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/20 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/40">
        {/* Header */}

        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">
              Modifier le rôle
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {user.fullName}
            </p>
          </div>

          <button
            type="button"
            onClick={
              onClose
            }
            disabled={
              changeRoleMutation.isPending
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

        <div className="space-y-5 px-6 py-6">
          {/* Utilisateur */}

          {user.email ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {
                user.email
              }
            </p>
          ) : null}

          {/* Sélection rôle */}

          <div>
            <p className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
              Nouveau rôle
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedRole(
                    "USER",
                  );
                }}
                className={
                  selectedRole ===
                  "USER"
                    ? "flex items-center gap-3 rounded-2xl border border-blue-500 bg-blue-50 px-4 py-4 text-left ring-2 ring-blue-500/10 dark:bg-blue-500/10"
                    : "flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600 dark:hover:bg-slate-800"
                }
              >
                <span
                  className={
                    selectedRole ===
                    "USER"
                      ? "flex size-9 items-center justify-center rounded-xl bg-blue-600 text-white"
                      : "flex size-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                  }
                >
                  <UserRound
                    className="size-4"
                    aria-hidden="true"
                  />
                </span>

                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Utilisateur
                  </p>

                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    Accès standard
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedRole(
                    "ADMIN",
                  );
                }}
                className={
                  selectedRole ===
                  "ADMIN"
                    ? "flex items-center gap-3 rounded-2xl border border-blue-500 bg-blue-50 px-4 py-4 text-left ring-2 ring-blue-500/10 dark:bg-blue-500/10"
                    : "flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600 dark:hover:bg-slate-800"
                }
              >
                <span
                  className={
                    selectedRole ===
                    "ADMIN"
                      ? "flex size-9 items-center justify-center rounded-xl bg-blue-600 text-white"
                      : "flex size-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                  }
                >
                  <ShieldCheck
                    className="size-4"
                    aria-hidden="true"
                  />
                </span>

                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Administrateur
                  </p>

                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    Accès administration
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Erreur */}

          {changeRoleMutation.isError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 dark:border-red-900/50 dark:bg-red-950/30">
              <p className="text-sm font-semibold text-red-700 dark:text-red-300">
                Impossible de modifier le rôle.
              </p>

              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                Vérifiez votre session administrateur et réessayez.
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
                changeRoleMutation.isPending
              }
              className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Annuler
            </button>

            <button
              type="button"
              onClick={
                handleSubmit
              }
              disabled={
                changeRoleMutation.isPending ||
                !roleHasChanged
              }
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-bold text-white shadow-sm shadow-blue-600/20 transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {changeRoleMutation.isPending ? (
                <>
                  <LoaderCircle
                    className="size-4 animate-spin"
                    aria-hidden="true"
                  />

                  Modification...
                </>
              ) : (
                "Enregistrer"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}