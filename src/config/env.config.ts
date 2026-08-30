const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL;

const keycloakUrl =
  import.meta.env.VITE_KEYCLOAK_URL;

const keycloakRealm =
  import.meta.env.VITE_KEYCLOAK_REALM;

const keycloakClientId =
  import.meta.env.VITE_KEYCLOAK_CLIENT_ID;

if (!apiBaseUrl) {
  throw new Error(
    "La variable d'environnement VITE_API_BASE_URL est manquante.",
  );
}

if (!keycloakUrl) {
  throw new Error(
    "La variable d'environnement VITE_KEYCLOAK_URL est manquante.",
  );
}

if (!keycloakRealm) {
  throw new Error(
    "La variable d'environnement VITE_KEYCLOAK_REALM est manquante.",
  );
}

if (!keycloakClientId) {
  throw new Error(
    "La variable d'environnement VITE_KEYCLOAK_CLIENT_ID est manquante.",
  );
}

export const env = {
  apiBaseUrl,
  keycloak: {
    url: keycloakUrl,
    realm: keycloakRealm,
    clientId: keycloakClientId,
  },
} as const;