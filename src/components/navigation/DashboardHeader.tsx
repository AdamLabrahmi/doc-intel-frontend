import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Bell,
  ChevronDown,
  LoaderCircle,
  LogOut,
  Menu,
  Search,
  Settings,
  UserRound,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import {
  useAuthenticatedUserQuery,
} from "@/features/auth/hooks/useAuthenticatedUserQuery";

import {
  ROUTES,
} from "@/routes/routePaths";

interface DashboardHeaderProps {
  onOpenSidebar: () => void;
  onLogout: () => void;
}

export function DashboardHeader({
  onOpenSidebar,
  onLogout,
}: DashboardHeaderProps) {
  const [
    isNotificationsOpen,
    setIsNotificationsOpen,
  ] = useState(false);

  const [
    isProfileOpen,
    setIsProfileOpen,
  ] = useState(false);

  const notificationsRef =
    useRef<HTMLDivElement>(
      null,
    );

  const profileRef =
    useRef<HTMLDivElement>(
      null,
    );

  const {
    data:
      authenticatedUser,

    isLoading:
      isAuthenticatedUserLoading,

    isError:
      isAuthenticatedUserError,
  } =
    useAuthenticatedUserQuery();

  const fullName =
    authenticatedUser
      ?.fullName
      ?.trim()
      || "Utilisateur";

  const email =
    authenticatedUser
      ?.email
      ?.trim()
      || "Adresse e-mail indisponible";

  const displayRole =
    useMemo(
      () => {
        if (
          authenticatedUser
            ?.role ===
          "ADMIN"
        ) {
          return "Administrateur";
        }

        if (
          authenticatedUser
            ?.role ===
          "USER"
        ) {
          return "Utilisateur";
        }

        return "Utilisateur";
      },
      [
        authenticatedUser
          ?.role,
      ],
    );

  const initials =
    useMemo(
      () => {
        const parts =
          fullName
            .split(/\s+/)
            .filter(Boolean);

        if (
          parts.length === 0
        ) {
          return "U";
        }

        if (
          parts.length === 1
        ) {
          return parts[0]
            .slice(
              0,
              2,
            )
            .toUpperCase();
        }

        return (
          parts[0]
            .charAt(0)
          +
          parts[
            parts.length - 1
          ]
            .charAt(0)
        ).toUpperCase();
      },
      [
        fullName,
      ],
    );

  useEffect(
    () => {
      const handleOutsideClick =
        (
          event:
            MouseEvent,
        ) => {
          const target =
  event.target as Node;

          if (
            notificationsRef
              .current
            &&
            !notificationsRef
              .current
              .contains(
                target,
              )
          ) {
            setIsNotificationsOpen(
              false,
            );
          }

          if (
            profileRef
              .current
            &&
            !profileRef
              .current
              .contains(
                target,
              )
          ) {
            setIsProfileOpen(
              false,
            );
          }
        };

      document
        .addEventListener(
          "mousedown",
          handleOutsideClick,
        );

      return () => {
        document
          .removeEventListener(
            "mousedown",
            handleOutsideClick,
          );
      };
    },
    [],
  );

  const handleLogout =
    () => {
      setIsProfileOpen(
        false,
      );

      onLogout();
    };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
      <div className="flex h-20 items-center gap-4 px-5 sm:px-8">

        <button
          type="button"
          onClick={
            onOpenSidebar
          }
          className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 lg:hidden"
          aria-label="Ouvrir le menu latéral"
        >
          <Menu
            className="size-5"
            aria-hidden="true"
          />
        </button>

        <div className="hidden min-w-0 sm:block">

          <h1 className="truncate text-xl font-bold tracking-tight text-slate-950">
            Tableau de bord
          </h1>

          <p className="mt-0.5 text-xs text-slate-500">
            Supervision des traitements documentaires
          </p>

        </div>

        <div className="relative ml-auto hidden w-full max-w-sm md:block">

          <Search
            className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />

          <input
            type="search"
            placeholder="Rechercher un document..."
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-950 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
          />

        </div>

        <div
          ref={
            notificationsRef
          }
          className="relative"
        >

          <button
            type="button"
            onClick={() => {
              setIsNotificationsOpen(
                (
                  currentValue,
                ) =>
                  !currentValue,
              );

              setIsProfileOpen(
                false,
              );
            }}
            className="relative flex size-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-blue-700"
            aria-label="Afficher les notifications"
            aria-expanded={
              isNotificationsOpen
            }
          >
            <Bell
              className="size-5"
              aria-hidden="true"
            />
          </button>

          {isNotificationsOpen
            ? (
              <div className="absolute right-0 top-14 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/10">

                <div className="border-b border-slate-100 px-5 py-4">

                  <p className="font-bold text-slate-950">
                    Notifications
                  </p>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Aucune notification non lue
                  </p>

                </div>

                <div className="flex min-h-44 items-center justify-center p-6 text-center">

                  <div>

                    <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                      <Bell
                        className="size-5"
                        aria-hidden="true"
                      />
                    </span>

                    <p className="mt-4 text-sm font-bold text-slate-900">
                      Aucune notification
                    </p>

                    <p className="mt-1 max-w-56 text-xs leading-5 text-slate-500">
                      Les notifications de traitement
                      seront disponibles dans une
                      prochaine version.
                    </p>

                  </div>

                </div>

              </div>
            )
            : null}

        </div>

        <div
          ref={
            profileRef
          }
          className="relative"
        >

          <button
            type="button"
            onClick={() => {
              setIsProfileOpen(
                (
                  currentValue,
                ) =>
                  !currentValue,
              );

              setIsNotificationsOpen(
                false,
              );
            }}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-1.5 pr-3 shadow-sm transition-colors hover:bg-slate-50"
            aria-label="Ouvrir le menu du profil"
            aria-expanded={
              isProfileOpen
            }
          >

            <span className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-sm font-bold text-white">

              {isAuthenticatedUserLoading
                ? (
                  <LoaderCircle
                    className="size-4 animate-spin"
                    aria-hidden="true"
                  />
                )
                : initials}

            </span>

            <span className="hidden text-left xl:block">

              <span className="block max-w-44 truncate text-sm font-bold text-slate-900">
                {isAuthenticatedUserLoading
                  ? "Chargement..."
                  : fullName}
              </span>

              <span className="block text-[11px] text-slate-500">
                {isAuthenticatedUserError
                  ? "Profil indisponible"
                  : displayRole}
              </span>

            </span>

            <ChevronDown
              className="hidden size-4 text-slate-400 sm:block"
              aria-hidden="true"
            />

          </button>

          {isProfileOpen
            ? (
              <div className="absolute right-0 top-14 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/10">

                <div className="border-b border-slate-100 px-4 py-4">

                  <p className="truncate font-bold text-slate-950">
                    {fullName}
                  </p>

                  <p className="mt-1 truncate text-xs text-slate-500">
                    {email}
                  </p>

                  <p className="mt-1 text-[11px] font-semibold text-blue-600">
                    {displayRole}
                  </p>

                </div>

                <div className="p-2">

                  <Link
                    to={
                      ROUTES.profile
                    }
                    onClick={() => {
                      setIsProfileOpen(
                        false,
                      );
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950"
                  >
                    <UserRound
                      className="size-4"
                      aria-hidden="true"
                    />

                    Mon profil
                  </Link>

                  <Link
                    to={
                      ROUTES.settings
                    }
                    onClick={() => {
                      setIsProfileOpen(
                        false,
                      );
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950"
                  >
                    <Settings
                      className="size-4"
                      aria-hidden="true"
                    />

                    Paramètres
                  </Link>

                </div>

                <div className="border-t border-slate-100 p-2">

                  <button
                    type="button"
                    onClick={
                      handleLogout
                    }
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    <LogOut
                      className="size-4"
                      aria-hidden="true"
                    />

                    Se déconnecter
                  </button>

                </div>

              </div>
            )
            : null}

        </div>

      </div>
    </header>
  );
}