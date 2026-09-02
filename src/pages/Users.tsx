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
  ] =
    useState(false);

  const [
    selectedUserForDeletion,
    setSelectedUserForDeletion,
  ] =
    useState<AdminUser | null>(
      null,
    );

  const [
    selectedUserForRoleChange,
    setSelectedUserForRoleChange,
  ] =
    useState<AdminUser | null>(
      null,
    );

  const {
    data:
      users,

    isLoading,

    isError,
  } =
    useAdminUsersQuery();

  const {
    user:
      currentUser,
  } =
    useCurrentUser();

  const administratorsCount =
    users?.filter(
      (
        user,
      ) =>
        user.role ===
        "ADMIN",
    ).length ??
    0;

  const standardUsersCount =
    users?.filter(
      (
        user,
      ) =>
        user.role ===
        "USER",
    ).length ??
    0;

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-[1600px] space-y-6">
        
        <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            
          </div>

          <button
            type="button"
            onClick={() => {
              setIsCreateDialogOpen(
                true,
              );
            }}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-bold text-white shadow-sm shadow-blue-600/20 transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
          >
            <UserPlus
              className="size-4"
              aria-hidden="true"
            />

            Créer un utilisateur
          </button>
        </section>

        {/* =====================================================
            Résumé compact
        ===================================================== */}

        {!isLoading &&
        !isError ? (
          <section
            className="grid overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:grid-cols-3"
            aria-label="Résumé des utilisateurs"
          >
            <article className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-800 sm:border-b-0 sm:border-r">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                <UsersRound
                  className="size-4.5"
                  aria-hidden="true"
                />
              </span>

              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Total
                </p>

                <p className="mt-0.5 text-xl font-bold text-slate-950 dark:text-white">
                  {
                    users?.length ??
                    0
                  }
                </p>
              </div>
            </article>

            <article className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-800 sm:border-b-0 sm:border-r">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                <ShieldCheck
                  className="size-4.5"
                  aria-hidden="true"
                />
              </span>

              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Administrateurs
                </p>

                <p className="mt-0.5 text-xl font-bold text-slate-950 dark:text-white">
                  {
                    administratorsCount
                  }
                </p>
              </div>
            </article>

            <article className="flex items-center gap-3 px-5 py-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <UserRound
                  className="size-4.5"
                  aria-hidden="true"
                />
              </span>

              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Utilisateurs
                </p>

                <p className="mt-0.5 text-xl font-bold text-slate-950 dark:text-white">
                  {
                    standardUsersCount
                  }
                </p>
              </div>
            </article>
          </section>
        ) : null}

        {/* =====================================================
            Tableau
        ===================================================== */}

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
          {isLoading ? (
            <div className="flex min-h-64 items-center justify-center">
              <div className="flex items-center gap-3 text-sm font-semibold text-slate-500 dark:text-slate-400">
                <LoaderCircle
                  className="size-5 animate-spin text-blue-600 dark:text-blue-400"
                  aria-hidden="true"
                />

                Chargement des utilisateurs...
              </div>
            </div>
          ) : null}

          {isError ? (
            <div className="flex min-h-64 items-center justify-center px-6 text-center">
              <div>
                <p className="font-bold text-red-700 dark:text-red-300">
                  Impossible de charger les utilisateurs.
                </p>

                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Vérifiez la connexion au backend et vos droits administrateur.
                </p>
              </div>
            </div>
          ) : null}

          {!isLoading &&
          !isError &&
          users?.length ===
            0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                <UsersRound
                  className="size-5"
                  aria-hidden="true"
                />
              </span>

              <p className="mt-4 font-bold text-slate-900 dark:text-white">
                Aucun utilisateur
              </p>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Aucun compte n’est actuellement disponible.
              </p>
            </div>
          ) : null}

          {!isLoading &&
          !isError &&
          users &&
          users.length >
            0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-800/50">
                    <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Utilisateur
                    </th>

                    <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Email
                    </th>

                    <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Rôle
                    </th>

                    <th className="px-6 py-3.5 text-right text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {users.map(
                    (
                      user,
                    ) => {
                      const isCurrentUser =
                        currentUser?.keycloakId ===
                        user.keycloakId;

                      return (
                        <tr
                          key={
                            user.keycloakId
                          }
                          className="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/50"
                        >
                          {/* Utilisateur */}

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                                <UserRound
                                  className="size-4.5"
                                  aria-hidden="true"
                                />
                              </span>

                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="max-w-xs truncate text-sm font-bold text-slate-900 dark:text-slate-100">
                                    {
                                      user.fullName
                                    }
                                  </p>

                                  {isCurrentUser ? (
                                    <span className="inline-flex shrink-0 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                                      Vous
                                    </span>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Email */}

                          <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                            {user.email ??
                              "Non renseigné"}
                          </td>

                          {/* Rôle */}

                          <td className="px-6 py-4">
                            <span
                              className={
                                user.role ===
                                "ADMIN"
                                  ? "inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
                                  : "inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300"
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

                          {/* Actions */}

                          <td className="px-6 py-4 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              {isCurrentUser ? (
                                <>
                                  <button
                                    type="button"
                                    disabled
                                    className="inline-flex size-9 cursor-not-allowed items-center justify-center rounded-lg text-slate-300 dark:text-slate-600"
                                    aria-label="Impossible de modifier votre propre rôle"
                                    title="Vous ne pouvez pas modifier votre propre rôle"
                                  >
                                    <LockKeyhole
                                      className="size-4"
                                      aria-hidden="true"
                                    />
                                  </button>

                                  <button
                                    type="button"
                                    disabled
                                    className="inline-flex size-9 cursor-not-allowed items-center justify-center rounded-lg text-slate-300 dark:text-slate-600"
                                    aria-label="Impossible de supprimer votre propre compte"
                                    title="Vous ne pouvez pas supprimer votre propre compte"
                                  >
                                    <LockKeyhole
                                      className="size-4"
                                      aria-hidden="true"
                                    />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedUserForRoleChange(
                                        user,
                                      );
                                    }}
                                    className="inline-flex size-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-slate-400 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
                                    aria-label={`Modifier le rôle de ${user.fullName}`}
                                    title="Modifier le rôle"
                                  >
                                    <Pencil
                                      className="size-4"
                                      aria-hidden="true"
                                    />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedUserForDeletion(
                                        user,
                                      );
                                    }}
                                    className="inline-flex size-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:text-slate-400 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                                    aria-label={`Supprimer ${user.fullName}`}
                                    title="Supprimer"
                                  >
                                    <Trash2
                                      className="size-4"
                                      aria-hidden="true"
                                    />
                                  </button>
                                </>
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
        </section>
      </div>

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