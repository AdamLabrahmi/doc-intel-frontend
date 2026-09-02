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
  Settings,
  UserRound,
} from "lucide-react";

import {
  Link,
  useLocation,
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

interface HeaderPageInfo {
  title: string;
  subtitle?: string;
}

function resolveHeaderPageInfo(
  pathname: string,
): HeaderPageInfo {
  if (
    pathname ===
    ROUTES.dashboard
  ) {
    return {
      title:
        "Tableau de bord",

      subtitle:
        "Supervision des traitements documentaires",
    };
  }

  if (
    pathname ===
    ROUTES.documents
  ) {
    return {
      title:
        "Documents",
    };
  }

  if (
    pathname.startsWith(
      "/documents/",
    )
  ) {
    return {
      title:
        "Détail du document",
    };
  }

  if (
    pathname ===
    ROUTES.conversations
  ) {
    return {
      title:
        "Conversations",
    };
  }

  if (
    pathname.startsWith(
      "/conversations/",
    )
  ) {
    return {
      title:
        "Conversation",
    };
  }

  if (
    pathname ===
    ROUTES.users
  ) {
    return {
      title:
        "Utilisateurs",
    };
  }

  if (
    pathname ===
    ROUTES.documentUpload
  ) {
    return {
      title:
        "Importer",

      subtitle:
        "Ajout de nouveaux documents",
    };
  }

  if (
    pathname ===
    ROUTES.extractionBenchmark
  ) {
    return {
      title:
        "Évaluation de l’extraction",

      subtitle:
        "Qualité et performances des méthodes d’extraction",
    };
  }

  if (
    pathname ===
    ROUTES.activity
  ) {
    return {
      title:
        "Activité",

      subtitle:
        "Suivi de l’activité de la plateforme",
    };
  }

  if (
    pathname ===
    ROUTES.settings
  ) {
    return {
      title:
        "Paramètres",

      subtitle:
        "Configuration de l’application",
    };
  }

  if (
    pathname ===
    ROUTES.profile
  ) {
    return {
      title:
        "Mon profil",

      subtitle:
        "Gestion de vos informations personnelles",
    };
  }

  return {
    title:
      "IntelliSearch",
  };
}

export function DashboardHeader({
  onOpenSidebar,
  onLogout,
}: DashboardHeaderProps) {
  const location =
    useLocation();

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

  const pageInfo =
    useMemo(
      () =>
        resolveHeaderPageInfo(
          location.pathname,
        ),
      [
        location.pathname,
      ],
    );

  const fullName =
    authenticatedUser
      ?.fullName
      ?.trim()
      ||
    "Utilisateur";

  const email =
    authenticatedUser
      ?.email
      ?.trim()
      ||
    "Adresse e-mail indisponible";

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
            .split(
              /\s+/,
            )
            .filter(
              Boolean,
            );

        if (
          parts.length ===
          0
        ) {
          return "U";
        }

        if (
          parts.length ===
          1
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
            .charAt(
              0,
            )
          +
          parts[
            parts.length -
            1
          ]
            .charAt(
              0,
            )
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
              .current &&
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
              .current &&
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

      document.addEventListener(
        "mousedown",
        handleOutsideClick,
      );

      return () => {
        document.removeEventListener(
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
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900/90">
      <div className="flex h-20 items-center gap-4 px-5 sm:px-8">
        <button
          type="button"
          onClick={
            onOpenSidebar
          }
          className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
          aria-label="Ouvrir le menu latéral"
        >
          <Menu
            className="size-5"
            aria-hidden="true"
          />
        </button>

        <div className="min-w-0">
          <h1 className="truncate text-xl font-bold tracking-tight text-slate-950 dark:text-white">
            {
              pageInfo.title
            }
          </h1>

          {pageInfo.subtitle ? (
            <p className="mt-0.5 hidden text-xs text-slate-500 dark:text-slate-400 sm:block">
              {
                pageInfo.subtitle
              }
            </p>
          ) : null}
        </div>

        <div className="ml-auto flex items-center gap-3">
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
              className="relative flex size-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-blue-400"
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

            {isNotificationsOpen ? (
              <div className="absolute right-0 top-14 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/10 dark:border-slate-700 dark:bg-slate-900">
                <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
                  <p className="font-bold text-slate-950 dark:text-white">
                    Notifications
                  </p>

                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    Aucune notification non lue
                  </p>
                </div>

                <div className="flex min-h-44 items-center justify-center p-6 text-center">
                  <div>
                    <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                      <Bell
                        className="size-5"
                        aria-hidden="true"
                      />
                    </span>

                    <p className="mt-4 text-sm font-bold text-slate-900 dark:text-white">
                      Aucune notification
                    </p>

                    <p className="mt-1 max-w-56 text-xs leading-5 text-slate-500 dark:text-slate-400">
                      Les notifications de traitement seront disponibles dans une prochaine version.
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
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
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-1.5 pr-3 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
              aria-label="Ouvrir le menu du profil"
              aria-expanded={
                isProfileOpen
              }
            >
              <span className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-sm font-bold text-white">
                {isAuthenticatedUserLoading ? (
                  <LoaderCircle
                    className="size-4 animate-spin"
                    aria-hidden="true"
                  />
                ) : (
                  initials
                )}
              </span>

              <span className="hidden text-left xl:block">
                <span className="block max-w-44 truncate text-sm font-bold text-slate-900 dark:text-white">
                  {isAuthenticatedUserLoading
                    ? "Chargement..."
                    : fullName}
                </span>

                <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                  {isAuthenticatedUserError
                    ? "Profil indisponible"
                    : displayRole}
                </span>
              </span>

              <ChevronDown
                className="hidden size-4 text-slate-400 dark:text-slate-500 sm:block"
                aria-hidden="true"
              />
            </button>

            {isProfileOpen ? (
              <div className="absolute right-0 top-14 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/10 dark:border-slate-700 dark:bg-slate-900">
                <div className="border-b border-slate-100 px-4 py-4 dark:border-slate-800">
                  <p className="truncate font-bold text-slate-950 dark:text-white">
                    {
                      fullName
                    }
                  </p>

                  <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
                    {
                      email
                    }
                  </p>

                  <p className="mt-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                    {
                      displayRole
                    }
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
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
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
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                  >
                    <Settings
                      className="size-4"
                      aria-hidden="true"
                    />

                    Paramètres
                  </Link>
                </div>

                <div className="border-t border-slate-100 p-2 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={
                      handleLogout
                    }
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                  >
                    <LogOut
                      className="size-4"
                      aria-hidden="true"
                    />

                    Se déconnecter
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}