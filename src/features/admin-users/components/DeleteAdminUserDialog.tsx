import {
  LoaderCircle,
  Trash2,
  TriangleAlert,
  X,
} from "lucide-react";

import {
  useDeleteAdminUserMutation,
} from "@/features/admin-users/hooks/useDeleteAdminUserMutation";

import type {
  AdminUser,
} from "@/features/admin-users/types/admin-user.types";

interface DeleteAdminUserDialogProps {
  user: AdminUser | null;
  onClose: () => void;
}

export function DeleteAdminUserDialog({
  user,
  onClose,
}: DeleteAdminUserDialogProps) {
  const deleteUserMutation =
    useDeleteAdminUserMutation();

  if (!user) {
    return null;
  }

  const handleDelete =
    async () => {
      try {
        await deleteUserMutation.mutateAsync(
          user.keycloakId,
        );

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
          deleteUserMutation.isPending
        }
        className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm dark:bg-black/65"
        aria-label="Fermer la confirmation"
      />

      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/20 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/40">
        {/* Header */}

        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
              <TriangleAlert
                className="size-5"
                aria-hidden="true"
              />
            </span>

            <h2 className="text-lg font-bold text-slate-950 dark:text-white">
              Supprimer l’utilisateur ?
            </h2>
          </div>

          <button
            type="button"
            onClick={
              onClose
            }
            disabled={
              deleteUserMutation.isPending
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

        <div className="px-6 py-6">
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
            Le compte de{" "}
            <span className="font-bold text-slate-900 dark:text-white">
              {
                user.fullName
              }
            </span>{" "}
            sera supprimé définitivement.
          </p>

          {user.email ? (
            <p className="mt-2 break-all text-sm text-slate-500 dark:text-slate-400">
              {
                user.email
              }
            </p>
          ) : null}

          <div className="mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 dark:border-red-900/40 dark:bg-red-950/20">
            <p className="text-sm text-red-700 dark:text-red-300">
              Cet utilisateur perdra immédiatement son accès à IntelliSearch.
            </p>
          </div>

          {deleteUserMutation.isError ? (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 dark:border-red-900/50 dark:bg-red-950/30">
              <p className="text-sm font-semibold text-red-700 dark:text-red-300">
                Impossible de supprimer l’utilisateur.
              </p>

              <p className="mt-1 text-xs leading-5 text-red-600 dark:text-red-400">
                Vérifiez que le compte existe encore et que votre session administrateur est valide.
              </p>
            </div>
          ) : null}

          <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 dark:border-slate-800 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={
                onClose
              }
              disabled={
                deleteUserMutation.isPending
              }
              className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Annuler
            </button>

            <button
              type="button"
              onClick={
                handleDelete
              }
              disabled={
                deleteUserMutation.isPending
              }
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 text-sm font-bold text-white shadow-sm shadow-red-600/20 transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {deleteUserMutation.isPending ? (
                <>
                  <LoaderCircle
                    className="size-4 animate-spin"
                    aria-hidden="true"
                  />

                  Suppression...
                </>
              ) : (
                <>
                  <Trash2
                    className="size-4"
                    aria-hidden="true"
                  />

                  Supprimer
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}