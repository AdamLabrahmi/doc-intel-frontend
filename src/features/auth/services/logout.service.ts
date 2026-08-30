import { keycloak } from "@/config/keycloak.config";

import {
  logoutFromKeycloak,
} from "@/features/auth/api/logout.api";

import {
  clearAuthTokens,
  getAuthTokens,
} from "@/features/auth/services/auth-token-storage.service";

import {
  queryClient,
} from "@/lib/query-client";

import {
  ROUTES,
} from "@/routes/routePaths";

export async function logoutCurrentUser():
  Promise<void> {
  const tokens =
    getAuthTokens();

  try {
    if (
      tokens?.refreshToken
    ) {
      await logoutFromKeycloak(
        tokens.refreshToken,
      );
    }
  } catch (error) {
    
    console.error(
      "Impossible de révoquer la session Keycloak.",
      error,
    );
  } finally {
    clearAuthTokens();

  
    keycloak.clearToken();

    queryClient.clear();

    window.location.replace(
      ROUTES.login,
    );
  }
}