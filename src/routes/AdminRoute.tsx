import type {
  ReactNode,
} from "react";

import {
  Navigate,
  useLocation,
} from "react-router-dom";

import {
  keycloak,
} from "@/config/keycloak.config";

import {
  useCurrentUser,
} from "@/features/auth/hooks/useCurrentUser";

import {
  ROUTES,
} from "@/routes/routePaths";

interface AdminRouteProps {
  children: ReactNode;
}

export function AdminRoute({
  children,
}: AdminRouteProps) {
  const location =
    useLocation();

  const {
    user,
    isAdmin,
    isLoading,
    isError,
  } = useCurrentUser();

  
  if (!keycloak.authenticated) {
    return (
      <Navigate
        to={ROUTES.login}
        replace
        state={{
          from:
            location.pathname +
            location.search,
        }}
      />
    );
  }

 
  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-600">
            Vérification des droits d'accès...
          </p>
        </div>
      </main>
    );
  }

 
  if (
    isError ||
    !user
  ) {
    return (
      <Navigate
        to={ROUTES.dashboard}
        replace
      />
    );
  }

  
  if (!isAdmin) {
    return (
      <Navigate
        to={ROUTES.dashboard}
        replace
      />
    );
  }

  return children;
}