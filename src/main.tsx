import { StrictMode } from "react";
import {
  createRoot,
} from "react-dom/client";
import {
  QueryClientProvider,
} from "@tanstack/react-query";

import "./index.css";

import App from "./App.tsx";

import { keycloak } from "@/config/keycloak.config";
import {
  clearAuthTokens,
  getAuthTokens,
  saveAuthTokens,
} from "@/features/auth/services/auth-token-storage.service";
import { queryClient } from "@/lib/query-client";

async function initializeKeycloak() {
  const storedTokens =
    getAuthTokens();

 
  if (storedTokens) {
    try {
      const authenticated =
        await keycloak.init({
          token:
            storedTokens.accessToken,

          refreshToken:
            storedTokens.refreshToken,

          idToken:
            storedTokens.idToken,

          checkLoginIframe:
            false,

          pkceMethod:
            "S256",
        });

      
      if (!authenticated) {
        clearAuthTokens();
      }

      return;
    } catch (error) {
      console.warn(
        "La session locale Keycloak n'est plus valide.",
        error,
      );

      clearAuthTokens();
    }
  }

 
  await keycloak.init({
    onLoad:
      "check-sso",

    pkceMethod:
      "S256",

    checkLoginIframe:
      false,
  });
}

function configureKeycloakCallbacks() {
 
  keycloak.onAuthRefreshSuccess =
    () => {
      if (
        keycloak.token &&
        keycloak.refreshToken
      ) {
        saveAuthTokens({
          accessToken:
            keycloak.token,

          refreshToken:
            keycloak.refreshToken,

          idToken:
            keycloak.idToken,
        });
      }
    };

  keycloak.onAuthLogout =
    () => {
      clearAuthTokens();
      queryClient.clear();
    };

  keycloak.onAuthRefreshError =
    () => {
      clearAuthTokens();
      queryClient.clear();
    };
}

async function bootstrapApplication() {
  try {
    configureKeycloakCallbacks();

    await initializeKeycloak();

    const rootElement =
      document.getElementById(
        "root",
      );

    if (!rootElement) {
      throw new Error(
        "L'élément racine React #root est introuvable.",
      );
    }

    createRoot(
      rootElement,
    ).render(
      <StrictMode>
        <QueryClientProvider
          client={queryClient}
        >
          <App />
        </QueryClientProvider>
      </StrictMode>,
    );
  } catch (error) {
    console.error(
      "Impossible d'initialiser Keycloak.",
      error,
    );

    const rootElement =
      document.getElementById(
        "root",
      );

    if (rootElement) {
      rootElement.innerHTML = `
        <main
          style="
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
            font-family: sans-serif;
            background: #f8fafc;
          "
        >
          <div
            style="
              max-width: 520px;
              background: white;
              border: 1px solid #e2e8f0;
              border-radius: 24px;
              padding: 32px;
              box-shadow:
                0 12px 40px
                rgba(15, 23, 42, 0.08);
            "
          >
            <h1
              style="
                margin: 0;
                font-size: 24px;
                color: #0f172a;
              "
            >
              Impossible de démarrer l'application
            </h1>

            <p
              style="
                margin-top: 12px;
                margin-bottom: 0;
                line-height: 1.6;
                color: #64748b;
              "
            >
              La connexion au serveur
              d'authentification Keycloak
              a échoué. Vérifiez que Keycloak
              est démarré puis rechargez la page.
            </p>
          </div>
        </main>
      `;
    }
  }
}

void bootstrapApplication();