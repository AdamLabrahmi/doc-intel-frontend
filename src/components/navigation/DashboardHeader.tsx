import {
  useEffect,
  useRef,
  useState,
} from "react";
import { ROUTES } from "@/routes/routePaths";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  Info,
  LogOut,
  Menu,
  Search,
  Settings,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import { dashboardNotifications } from "@/features/dashboard/data/dashboard.mock";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  onOpenSidebar: () => void;
}

export function DashboardHeader({
  onOpenSidebar,
}: DashboardHeaderProps) {
  const navigate = useNavigate();

  const [isNotificationsOpen, setIsNotificationsOpen] =
    useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadNotificationsCount = dashboardNotifications.filter(
    (notification) => !notification.read,
  ).length;

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(target)
      ) {
        setIsNotificationsOpen(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(target)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleLogout = () => {
    console.log("Déconnexion statique");

    navigate("/login");
  };

  const getNotificationIcon = (
    type: "success" | "warning" | "info",
  ) => {
    if (type === "success") {
      return CheckCircle2;
    }

    if (type === "warning") {
      return CircleAlert;
    }

    return Info;
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
      <div className="flex h-20 items-center gap-4 px-5 sm:px-8">
        <button
          type="button"
          onClick={onOpenSidebar}
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
          ref={notificationsRef}
          className="relative"
        >
          <button
            type="button"
            onClick={() => {
              setIsNotificationsOpen((currentValue) => !currentValue);
              setIsProfileOpen(false);
            }}
            className="relative flex size-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-blue-700"
            aria-label="Afficher les notifications"
            aria-expanded={isNotificationsOpen}
          >
            <Bell
              className="size-5"
              aria-hidden="true"
            />

            {unreadNotificationsCount > 0 && (
              <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full border-2 border-white bg-red-500 text-[10px] font-bold text-white">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 top-14 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/10">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <div>
                  <p className="font-bold text-slate-950">
                    Notifications
                  </p>

                  <p className="mt-0.5 text-xs text-slate-500">
                    {unreadNotificationsCount} non lues
                  </p>
                </div>

                <button
                  type="button"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  Tout marquer comme lu
                </button>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {dashboardNotifications.map((notification) => {
                  const NotificationIcon = getNotificationIcon(
                    notification.type,
                  );

                  return (
                    <button
                      key={notification.id}
                      type="button"
                      className={cn(
                        "flex w-full gap-3 border-b border-slate-100 px-5 py-4 text-left transition-colors last:border-b-0 hover:bg-slate-50",
                        !notification.read && "bg-blue-50/40",
                      )}
                    >
                      <span
                        className={cn(
                          "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl",
                          notification.type === "success" &&
                            "bg-emerald-50 text-emerald-600",
                          notification.type === "warning" &&
                            "bg-red-50 text-red-600",
                          notification.type === "info" &&
                            "bg-blue-50 text-blue-600",
                        )}
                      >
                        <NotificationIcon
                          className="size-4"
                          aria-hidden="true"
                        />
                      </span>

                      <span className="min-w-0">
                        <span className="block text-sm font-bold text-slate-900">
                          {notification.title}
                        </span>

                        <span className="mt-1 block text-xs leading-5 text-slate-600">
                          {notification.description}
                        </span>

                        <span className="mt-1.5 block text-[11px] text-slate-400">
                          {notification.time}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div
          ref={profileRef}
          className="relative"
        >
          <button
            type="button"
            onClick={() => {
              setIsProfileOpen((currentValue) => !currentValue);
              setIsNotificationsOpen(false);
            }}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-1.5 pr-3 shadow-sm transition-colors hover:bg-slate-50"
            aria-label="Ouvrir le menu du profil"
            aria-expanded={isProfileOpen}
          >
            <span className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-sm font-bold text-white">
              AL
            </span>

            <span className="hidden text-left xl:block">
              <span className="block text-sm font-bold text-slate-900">
                Adam Labrahmi
              </span>

              <span className="block text-[11px] text-slate-500">
                Administrateur
              </span>
            </span>

            <ChevronDown
              className="hidden size-4 text-slate-400 sm:block"
              aria-hidden="true"
            />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 top-14 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/10">
              <div className="border-b border-slate-100 px-4 py-4">
                <p className="font-bold text-slate-950">
                  Adam Labrahmi
                </p>

                <p className="mt-1 truncate text-xs text-slate-500">
                  adam@example.com
                </p>
              </div>

              <div className="p-2">
                <Link
                  to={ROUTES.profile}
                  onClick={() => {
                  setIsProfileOpen(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950"
                >
                  <UserRound
                    className="size-4"
                    aria-hidden="true"
                  />
                  Mon profil
                </Link>

                <button
                  type="button"
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  <Settings
                    className="size-4"
                    aria-hidden="true"
                  />

                  Paramètres
                </button>
              </div>

              <div className="border-t border-slate-100 p-2">
                <button
                  type="button"
                  onClick={handleLogout}
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
          )}
        </div>
      </div>
    </header>
  );
}