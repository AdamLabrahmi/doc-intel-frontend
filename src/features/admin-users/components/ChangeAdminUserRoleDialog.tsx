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
  ] = useState<AdminUserRole>(
    "USER",
  );

  const changeRoleMutation =
    useChangeAdminUserRoleMutation();

  useEffect(() => {
    if (!user) {
      return;
    }

    setSelectedRole(
      user.role,
    );

    changeRoleMutation.reset();
  }, [user]);

  if (!user) {
    return null;
  }

  const roleHasChanged =
    selectedRole !== user.role;

  const handleSubmit = async () => {
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
        onClick={onClose}
        disabled={
          changeRoleMutation.isPending
        }
        className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm"
        aria-label="Fermer la fenêtre"
      />

      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/20">
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div className="flex gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <ShieldCheck
                className="size-5"
                aria-hidden="true"
              />
            </span>

            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-600">
                Administration
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-950">
                Modifier le rôle
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={
              changeRoleMutation.isPending
            }
            className="flex size-10 shrink-0 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Fermer"
          >
            <X
              className="size-5"
              aria-hidden="true"
            />
          </button>
        </div>

        <div className="space-y-5 px-6 py-6">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Utilisateur
            </p>

            <p className="mt-1 text-sm font-bold text-slate-900">
              {user.fullName}
            </p>

            {user.email ? (
              <p className="mt-1 text-sm text-slate-500">
                {user.email}
              </p>
            ) : null}
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-slate-700">
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
                  selectedRole === "USER"
                    ? "flex items-center gap-3 rounded-2xl border-2 border-blue-500 bg-blue-50 px-4 py-4 text-left"
                    : "flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left transition hover:border-slate-300 hover:bg-slate-50"
                }
              >
                <span
                  className={
                    selectedRole === "USER"
                      ? "flex size-9 items-center justify-center rounded-xl bg-blue-600 text-white"
                      : "flex size-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500"
                  }
                >
                  <UserRound
                    className="size-4"
                    aria-hidden="true"
                  />
                </span>

                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Utilisateur
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
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
                  selectedRole === "ADMIN"
                    ? "flex items-center gap-3 rounded-2xl border-2 border-blue-500 bg-blue-50 px-4 py-4 text-left"
                    : "flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left transition hover:border-slate-300 hover:bg-slate-50"
                }
              >
                <span
                  className={
                    selectedRole === "ADMIN"
                      ? "flex size-9 items-center justify-center rounded-xl bg-blue-600 text-white"
                      : "flex size-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500"
                  }
                >
                  <ShieldCheck
                    className="size-4"
                    aria-hidden="true"
                  />
                </span>

                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Administrateur
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Accès administration
                  </p>
                </div>
              </button>
            </div>
          </div>

          {changeRoleMutation.isError ? (
            <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3">
              <p className="text-sm font-semibold text-red-700">
                Impossible de modifier le rôle.
              </p>

              <p className="mt-1 text-xs leading-5 text-red-600">
                Vérifiez votre session administrateur et réessayez.
              </p>
            </div>
          ) : null}

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={
                changeRoleMutation.isPending
              }
              className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Annuler
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={
                changeRoleMutation.isPending ||
                !roleHasChanged
              }
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
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
                <>
                  <ShieldCheck
                    className="size-4"
                    aria-hidden="true"
                  />

                  Enregistrer
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}