import {
  useState,
} from "react";

import {
  LoaderCircle,
  LockKeyhole,
  Pencil,
  ShieldCheck,
  Trash2,
  UserPlus,
  UserRound,
  UsersRound,
} from "lucide-react";

import {
  DashboardLayout,
} from "@/layouts/DashboardLayout";

import {
  CreateAdminUserDialog,
} from "@/features/admin-users/components/CreateAdminUserDialog";

import {
  DeleteAdminUserDialog,
} from "@/features/admin-users/components/DeleteAdminUserDialog";

import {
  ChangeAdminUserRoleDialog,
} from "@/features/admin-users/components/ChangeAdminUserRoleDialog";

import {
  useAdminUsersQuery,
} from "@/features/admin-users/hooks/useAdminUsersQuery";

import {
  useCurrentUser,
} from "@/features/auth/hooks/useCurrentUser";

import type {
  AdminUser,
} from "@/features/admin-users/types/admin-user.types";

export default function Users() {
  const [
    isCreateDialogOpen,
    setIsCreateDialogOpen,
  ] = useState(false);

  const [
    selectedUserForDeletion,
    setSelectedUserForDeletion,
  ] = useState<AdminUser | null>(
    null,
  );

  const [
    selectedUserForRoleChange,
    setSelectedUserForRoleChange,
  ] = useState<AdminUser | null>(
    null,
  );

  const {
    data: users,
    isLoading,
    isError,
  } = useAdminUsersQuery();

  const {
    user: currentUser,
  } = useCurrentUser();

  return (
    <DashboardLayout>
      <section className="space-y-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
              Administration
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
              Utilisateurs
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Gérez les utilisateurs IntelliSearch ainsi que leurs rôles.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <span className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <UsersRound
                  className="size-5"
                  aria-hidden="true"
                />
              </span>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Total
                </p>

                <p className="text-lg font-bold text-slate-950">
                  {users?.length ?? 0}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsCreateDialogOpen(
                  true,
                );
              }}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              <UserPlus
                className="size-4"
                aria-hidden="true"
              />

              Créer un utilisateur
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {isLoading ? (
            <div className="flex min-h-64 items-center justify-center">
              <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
                <LoaderCircle
                  className="size-5 animate-spin"
                  aria-hidden="true"
                />

                Chargement des utilisateurs...
              </div>
            </div>
          ) : null}

          {isError ? (
            <div className="flex min-h-64 items-center justify-center px-6 text-center">
              <div>
                <p className="font-bold text-red-700">
                  Impossible de charger les utilisateurs.
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Vérifiez la connexion au backend et vos droits administrateur.
                </p>
              </div>
            </div>
          ) : null}

          {!isLoading &&
          !isError &&
          users?.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
              <span className="flex size-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                <UsersRound
                  className="size-6"
                  aria-hidden="true"
                />
              </span>

              <p className="mt-4 font-bold text-slate-900">
                Aucun utilisateur
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Aucun utilisateur n'est actuellement disponible.
              </p>
            </div>
          ) : null}

          {!isLoading &&
          !isError &&
          users &&
          users.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                      Utilisateur
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                      Email
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                      Rôle
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 bg-white">
                  {users.map(
                    (user) => {
                      const isCurrentUser =
                        currentUser?.keycloakId ===
                        user.keycloakId;

                      return (
                        <tr
                          key={user.keycloakId}
                          className="transition-colors hover:bg-slate-50"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                                <UserRound
                                  className="size-5"
                                  aria-hidden="true"
                                />
                              </span>

                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="truncate text-sm font-bold text-slate-900">
                                    {user.fullName}
                                  </p>

                                  {isCurrentUser ? (
                                    <span className="inline-flex shrink-0 items-center rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blue-700">
                                      Vous
                                    </span>
                                  ) : null}
                                </div>

                                <p className="mt-1 truncate text-xs text-slate-400">
                                  {user.keycloakId}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4 text-sm text-slate-600">
                            {user.email ??
                              "Non renseigné"}
                          </td>

                          <td className="px-6 py-4">
                            <span
                              className={
                                user.role ===
                                "ADMIN"
                                  ? "inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700"
                                  : "inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600"
                              }
                            >
                              {user.role ===
                              "ADMIN" ? (
                                <ShieldCheck
                                  className="size-3.5"
                                  aria-hidden="true"
                                />
                              ) : (
                                <UserRound
                                  className="size-3.5"
                                  aria-hidden="true"
                                />
                              )}

                              {user.role ===
                              "ADMIN"
                                ? "Administrateur"
                                : "Utilisateur"}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-right">
                            <div className="inline-flex items-center gap-2">
                              {isCurrentUser ? (
                                <button
                                  type="button"
                                  disabled
                                  className="inline-flex size-10 cursor-not-allowed items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-slate-400"
                                  aria-label="Impossible de modifier votre propre rôle"
                                  title="Vous ne pouvez pas modifier votre propre rôle"
                                >
                                  <LockKeyhole
                                    className="size-4"
                                    aria-hidden="true"
                                  />
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedUserForRoleChange(
                                      user,
                                    );
                                  }}
                                  className="inline-flex size-10 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600 transition hover:border-blue-200 hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                  aria-label={`Modifier le rôle de ${user.fullName}`}
                                  title="Modifier le rôle"
                                >
                                  <Pencil
                                    className="size-4"
                                    aria-hidden="true"
                                  />
                                </button>
                              )}

                              {isCurrentUser ? (
                                <button
                                  type="button"
                                  disabled
                                  className="inline-flex size-10 cursor-not-allowed items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-slate-400"
                                  aria-label="Impossible de supprimer votre propre compte"
                                  title="Vous ne pouvez pas supprimer votre propre compte"
                                >
                                  <LockKeyhole
                                    className="size-4"
                                    aria-hidden="true"
                                  />
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedUserForDeletion(
                                      user,
                                    );
                                  }}
                                  className="inline-flex size-10 items-center justify-center rounded-xl border border-red-100 bg-red-50 text-red-600 transition hover:border-red-200 hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                                  aria-label={`Supprimer ${user.fullName}`}
                                  title="Supprimer"
                                >
                                  <Trash2
                                    className="size-4"
                                    aria-hidden="true"
                                  />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    },
                  )}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      </section>

      <CreateAdminUserDialog
        isOpen={
          isCreateDialogOpen
        }
        onClose={() => {
          setIsCreateDialogOpen(
            false,
          );
        }}
      />

      <ChangeAdminUserRoleDialog
        user={
          selectedUserForRoleChange
        }
        onClose={() => {
          setSelectedUserForRoleChange(
            null,
          );
        }}
      />

      <DeleteAdminUserDialog
        user={
          selectedUserForDeletion
        }
        onClose={() => {
          setSelectedUserForDeletion(
            null,
          );
        }}
      />
    </DashboardLayout>
  );
}