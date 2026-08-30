import type { ReactNode } from "react";
import {
  Navigate,
  useLocation,
} from "react-router-dom";

import { keycloak } from "@/config/keycloak.config";
import { ROUTES } from "@/routes/routePaths";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const location =
    useLocation();

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

  return children;
}