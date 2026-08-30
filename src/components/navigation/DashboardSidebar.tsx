import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  BrainCircuit,
  ChevronLeft,
  LoaderCircle,
  LogOut,
  X,
} from "lucide-react";
import {
  Link,
  NavLink,
} from "react-router-dom";

import {
  dashboardNavigationItems,
} from "@/config/dashboard-navigation.config";
import {
  useCurrentUser,
} from "@/features/auth/hooks/useCurrentUser";
import { cn } from "@/lib/utils";

interface DashboardSidebarProps {
  isMobileOpen: boolean;
  onMobileClose: () => void;
  onLogout: () => void;
}

interface SidebarContentProps {
  onNavigation: () => void;
  onLogout: () => void;
  showCloseButton?: boolean;
}

function SidebarContent({
  onNavigation,
  onLogout,
  showCloseButton = false,
}: SidebarContentProps) {
  const {
    user,
    isLoading,
    isError,
  } = useCurrentUser();

  /*
   * Tant que le profil utilisateur n'est
   * pas chargé, aucun rôle n'est supposé.
   *
   * On évite surtout de considérer
   * automatiquement un utilisateur inconnu
   * comme ADMIN.
   */
  const visibleNavigationItems =
    user
      ? dashboardNavigationItems.filter(
          (item) =>
            item.roles.includes(
              user.role,
            ),
        )
      : [];

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex h-20 shrink-0 items-center justify-between border-b border-slate-100 px-5">
        <Link
          to="/"
          onClick={onNavigation}
          className="group flex min-w-0 items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          aria-label="Retour à l’accueil"
        >
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/25 transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105">
            <BrainCircuit
              className="size-5"
              aria-hidden="true"
            />
          </span>

          <span className="flex min-w-0 flex-col leading-none">
            <span className="truncate text-lg font-bold tracking-tight text-slate-950">
              IntelliSearch
            </span>

            <span className="mt-1 truncate text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Document intelligence
            </span>
          </span>
        </Link>

        {showCloseButton && (
          <button
            type="button"
            onClick={onNavigation}
            className="flex size-10 shrink-0 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="Fermer le menu"
          >
            <X
              className="size-5"
              aria-hidden="true"
            />
          </button>
        )}
      </div>

      <nav
        className="flex-1 overflow-y-auto px-4 py-6"
        aria-label="Navigation du tableau de bord"
      >
        <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
          Espace de travail
        </p>

        {isLoading ? (
          <div className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-slate-500">
            <span className="flex size-9 items-center justify-center rounded-lg bg-slate-100">
              <LoaderCircle
                className="size-4 animate-spin"
                aria-hidden="true"
              />
            </span>

            Chargement...
          </div>
        ) : null}

        {isError ? (
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3">
            <p className="text-xs font-semibold leading-5 text-red-700">
              Impossible de charger les droits
              de navigation.
            </p>
          </div>
        ) : null}

        {!isLoading &&
        !isError &&
        user ? (
          <div className="space-y-1.5">
            {visibleNavigationItems.map(
              (item) => {
                const Icon =
                  item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.end}
                    onClick={onNavigation}
                    className={({
                      isActive,
                    }) =>
                      cn(
                        "group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition-all duration-200",
                        isActive
                          ? "bg-blue-50 text-blue-700 shadow-sm"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
                      )
                    }
                  >
                    {({
                      isActive,
                    }) => (
                      <>
                        <span
                          className={cn(
                            "flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors",
                            isActive
                              ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                              : "bg-slate-100 text-slate-500 group-hover:bg-white",
                          )}
                        >
                          <Icon
                            className="size-4"
                            aria-hidden="true"
                          />
                        </span>

                        <span>
                          {item.label}
                        </span>
                      </>
                    )}
                  </NavLink>
                );
              },
            )}
          </div>
        ) : null}
      </nav>

      <div className="shrink-0 border-t border-slate-100 p-4">
        {user ? (
          <div className="mb-3 rounded-xl bg-slate-50 px-3.5 py-3">
            <p className="truncate text-xs font-bold text-slate-900">
              {user.fullName}
            </p>

            <p className="mt-1 text-[11px] font-semibold text-blue-600">
              {user.role === "ADMIN"
                ? "Administrateur"
                : "Utilisateur"}
            </p>
          </div>
        ) : null}

        <button
          type="button"
          onClick={onLogout}
          className="group flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 transition-colors group-hover:bg-red-100">
            <LogOut
              className="size-4"
              aria-hidden="true"
            />
          </span>

          <span>
            Se déconnecter
          </span>

          <ChevronLeft
            className="ml-auto size-4"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  );
}

export function DashboardSidebar({
  isMobileOpen,
  onMobileClose,
  onLogout,
}: DashboardSidebarProps) {
  const shouldReduceMotion =
    useReducedMotion();

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-slate-200 bg-white lg:block">
        <SidebarContent
          onNavigation={() =>
            undefined
          }
          onLogout={onLogout}
        />
      </aside>

      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.button
              type="button"
              initial={
                shouldReduceMotion
                  ? false
                  : {
                      opacity: 0,
                    }
              }
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration:
                  shouldReduceMotion
                    ? 0
                    : 0.2,
              }}
              onClick={
                onMobileClose
              }
              className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden"
              aria-label="Fermer le menu latéral"
            />

            <motion.aside
              initial={
                shouldReduceMotion
                  ? false
                  : {
                      x: "-100%",
                    }
              }
              animate={{
                x: 0,
              }}
              exit={{
                x: "-100%",
              }}
              transition={{
                duration:
                  shouldReduceMotion
                    ? 0
                    : 0.3,
                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              }}
              className="fixed inset-y-0 left-0 z-50 w-[min(18rem,calc(100vw-2rem))] border-r border-slate-200 bg-white shadow-2xl shadow-slate-950/15 lg:hidden"
            >
              <SidebarContent
                onNavigation={
                  onMobileClose
                }
                onLogout={
                  onLogout
                }
                showCloseButton
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}