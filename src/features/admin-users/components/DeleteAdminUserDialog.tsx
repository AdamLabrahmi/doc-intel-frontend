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

  const handleDelete = async () => {
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
        onClick={onClose}
        disabled={
          deleteUserMutation.isPending
        }
        className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm"
        aria-label="Fermer la confirmation"
      />

      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/20">
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div className="flex gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <TriangleAlert
                className="size-5"
                aria-hidden="true"
              />
            </span>

            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-red-600">
                Suppression
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-950">
                Supprimer l'utilisateur ?
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={
              deleteUserMutation.isPending
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

        <div className="px-6 py-6">
          <p className="text-sm leading-6 text-slate-600">
            Vous êtes sur le point de supprimer
            définitivement le compte de
            <span className="font-bold text-slate-900">
              {" "}
              {user.fullName}
            </span>
            .
          </p>

          {user.email ? (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Compte
              </p>

              <p className="mt-1 break-all text-sm font-semibold text-slate-700">
                {user.email}
              </p>
            </div>
          ) : null}

          <p className="mt-4 text-sm leading-6 text-slate-500">
            Cette action supprimera l'accès de cet utilisateur à IntelliSearch.
          </p>

          {deleteUserMutation.isError ? (
            <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3">
              <p className="text-sm font-semibold text-red-700">
                Impossible de supprimer l'utilisateur.
              </p>

              <p className="mt-1 text-xs leading-5 text-red-600">
                Vérifiez que le compte existe encore et que votre session administrateur est valide.
              </p>
            </div>
          ) : null}

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={
                deleteUserMutation.isPending
              }
              className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Annuler
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={
                deleteUserMutation.isPending
              }
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
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