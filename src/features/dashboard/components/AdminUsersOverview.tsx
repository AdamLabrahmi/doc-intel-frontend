import {
  ArrowRight,
  LoaderCircle,
  ShieldCheck,
  UserRound,
  UsersRound,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import {
  useAdminUsersQuery,
} from "@/features/admin-users/hooks/useAdminUsersQuery";

import {
  useCurrentUser,
} from "@/features/auth/hooks/useCurrentUser";

import {
  ROUTES,
} from "@/routes/routePaths";

export function AdminUsersOverview() {
  const {
    user:
      currentUser,

    isLoading:
      isCurrentUserLoading,
  } =
    useCurrentUser();

  const isAdmin =
    currentUser?.role ===
    "ADMIN";

  const {
    data:
      users = [],

    isLoading:
      isUsersLoading,

    isError:
      isUsersError,
  } =
    useAdminUsersQuery(
      isAdmin,
    );

  if (
    isCurrentUserLoading ||
    !isAdmin
  ) {
    return null;
  }

  const administratorsCount =
    users.filter(
      (
        user,
      ) =>
        user.role ===
        "ADMIN",
    ).length;

  const standardUsersCount =
    users.length -
    administratorsCount;

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
      {/* =====================================================
          Header
      ===================================================== */}

      <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
            <UsersRound
              className="size-5"
              aria-hidden="true"
            />
          </span>

          <div>
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">
              Administration
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Vue synthétique des comptes IntelliSearch.
            </p>
          </div>
        </div>

        <Link
          to={
            ROUTES.users
          }
          className="inline-flex w-fit items-center gap-2 text-sm font-bold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Gérer les utilisateurs

          <ArrowRight
            className="size-4"
            aria-hidden="true"
          />
        </Link>
      </div>

      {/* =====================================================
          Loading
      ===================================================== */}

      {isUsersLoading ? (
        <div className="flex min-h-40 items-center justify-center">
          <div className="flex items-center gap-3 text-sm font-semibold text-slate-500 dark:text-slate-400">
            <LoaderCircle
              className="size-5 animate-spin text-blue-600 dark:text-blue-400"
              aria-hidden="true"
            />

            Chargement des utilisateurs...
          </div>
        </div>
      ) : null}

      {/* =====================================================
          Error
      ===================================================== */}

      {!isUsersLoading &&
      isUsersError ? (
        <div className="p-6">
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 dark:border-red-900/50 dark:bg-red-950/30"
          >
            <p className="text-sm font-semibold text-red-700 dark:text-red-300">
              Impossible de charger les informations administratives.
            </p>
          </div>
        </div>
      ) : null}

      {/* =====================================================
          Statistiques utilisateurs
      ===================================================== */}

      {!isUsersLoading &&
      !isUsersError ? (
        <div className="grid gap-px bg-slate-100 dark:bg-slate-800 sm:grid-cols-3">
          {/* Total */}

          <article className="bg-white px-6 py-6 transition-colors dark:bg-slate-900">
            <div className="flex items-center gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                <UsersRound
                  className="size-5"
                  aria-hidden="true"
                />
              </span>

              <div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  Utilisateurs enregistrés
                </p>

                <p className="mt-1 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
                  {
                    users.length
                  }
                </p>
              </div>
            </div>
          </article>

          {/* Admins */}

          <article className="bg-white px-6 py-6 transition-colors dark:bg-slate-900">
            <div className="flex items-center gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                <ShieldCheck
                  className="size-5"
                  aria-hidden="true"
                />
              </span>

              <div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  Administrateurs
                </p>

                <p className="mt-1 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
                  {
                    administratorsCount
                  }
                </p>
              </div>
            </div>
          </article>

          {/* Users */}

          <article className="bg-white px-6 py-6 transition-colors dark:bg-slate-900">
            <div className="flex items-center gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <UserRound
                  className="size-5"
                  aria-hidden="true"
                />
              </span>

              <div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  Utilisateurs standards
                </p>

                <p className="mt-1 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
                  {
                    standardUsersCount
                  }
                </p>
              </div>
            </div>
          </article>
        </div>
      ) : null}
    </section>
  );
}